/**
 * QM-Editor 主逻辑
 * Deltarune 存档编辑器
 */
import { parseSave, ParseError } from './save-parser.js';
import { serializeSave } from './save-serializer.js';
import { Platform } from './platform.js';
import { t, idxText } from './i18n.js';
import {
  CHAPTERS, CHAPTERS_META, CHARACTERS, CHARACTERS_META, CHAPTERS_CHARACTERS,
  CONSUMABLES, CONSUMABLES_META, WEAPONS, WEAPONS_META,
  ARMORS, ARMORS_META, KEYITEMS, KEYITEMS_META, SPELLS, SPELLS_META,
  LIGHTWORLDITEMS, LIGHTWORLDITEMS_META, PHONECONTACTS, PHONECONTACTS_META,
  SAVE_META, getNameByIndex, metaToOptions, getMetaByIndex, setLocaleMap,
} from './data.js';
import { FLAGS_META } from './flags-meta.js';
import { STORY_SECTIONS } from './story-sections.js';
import { LOCALE } from './data-locale.js';

let currentSave = null; // 当前解析后的存档对象
let currentFileName = ''; // 当前文件名
let currentFilePath = ''; // 当前文件路径（Tauri）
let currentPage = 'basic'; // 当前导航页面
let allowNonStandardParty = false; // 允许非标准队伍组合

// ========== 本地化辅助 ==========
/** metaToOptions 的本地化版本：自动注入中文翻译 */
function loc(meta, metaName) {
  return metaToOptions(meta, LOCALE[metaName]);
}
/** getNameByIndex 的本地化版本 */
function locName(meta, idx, metaName) {
  return getNameByIndex(meta, idx, LOCALE[metaName]);
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', async () => {
  await Platform.init();
  applyI18n();
  updatePlatformUI();
  await handleURLParams();
  bindEvents();
});

/** 将 HTML 中的 data-i18n 属性应用到文本内容 */
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });
}

function updatePlatformUI() {
  const badge = document.getElementById('platform-badge');
  const names = { tauri: 'Tauri', jsbridge: 'JSBridge', web: 'Web' };
  badge.textContent = names[Platform.type] || 'Web';
  badge.className = `badge badge-${Platform.type}`;

  // JSBridge 模式隐藏上传按钮
  if (Platform.type === 'jsbridge') {
    const pickBtn = document.getElementById('btn-pick');
    if (pickBtn) pickBtn.style.display = 'none';
  }
}

async function handleURLParams() {
  const params = new URLSearchParams(location.search);
  const filename = params.get('filename');
  if (filename) {
    document.getElementById('filename-input').value = filename;
    await loadFromPath(filename);
  }
}

function bindEvents() {
  const $ = id => document.getElementById(id);
  const on = (id, evt, fn) => { const el = $(id); if (el) el.addEventListener(evt, fn); };
  on('btn-load-path', 'click', async () => {
    const path = $('filename-input')?.value?.trim();
    if (path) await loadFromPath(path);
  });
  on('btn-pick', 'click', async () => {
    const result = await Platform.pickFile();
    if (result) {
      currentFileName = result.name;
      if (result.path) currentFilePath = result.path;
      loadSaveContent(result.content);
    }
  });
  on('btn-save', 'click', saveCurrentFile);
  on('btn-close', 'click', () => Platform.close());
  on('btn-list', 'click', listSaveFiles);
  // flags-search 在 renderFlagsSection 中动态创建，使用事件委托
  document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-flags-search') filterFlags();
  });
  // allowNonStandardParty checkbox 变更时重新渲染
  document.addEventListener('change', (e) => {
    if (e.target.id === 'allowNonStandardParty') {
      allowNonStandardParty = e.target.checked;
      renderCurrentPage();
    }
  });
  // 演示按钮
  on('btn-demo', 'click', () => {
    const demo = createDemoSave();
    currentFileName = 'demo_save';
    loadSaveContent(demo);
  });
  // 导航栏
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      navigateTo(page);
    });
  });
}

// ========== 创建演示存档 ==========
function createDemoSave() {
  const s = {
    format: 2, chapter: 2,
    playerName: 'Kris', vesselName: 'Vessel',
    party: [1, 2, 3], money: 200, xp: 120, lv: 3,
    inv: 12, invc: 0, inDarkWorld: true,
    characters: [],
    battle: { boltSpeed: 4, grazeAmount: 3, grazeSize: 2, tension: 0, maxTension: 100 },
    inventory: { consumables: [], keyItems: [], weapons: [], armors: [], storage: [] },
    lightWorld: {
      weapon: 2, armor: 3, experience: 100, level: 2,
      money: 50, health: 80, maxHealth: 90, attack: 10, defence: 8,
      weaponStrength: 5, armorDefence: 3, items: [], phone: [],
    },
    flags: [], plot: 100, room: 144, time: 3600,
  };
  // 5 characters for V2
  const charData = [
    { health: 90, maxHealth: 90, attack: 12, defence: 8, magic: 6, guts: 4, weapon: 1, primaryArmor: 1, secondaryArmor: 0, weaponStyle: 0 },
    { health: 110, maxHealth: 110, attack: 16, defence: 6, magic: 0, guts: 8, weapon: 2, primaryArmor: 2, secondaryArmor: 0, weaponStyle: 0 },
    { health: 70, maxHealth: 70, attack: 6, defence: 5, magic: 14, guts: 3, weapon: 9, primaryArmor: 3, secondaryArmor: 0, weaponStyle: 0 },
    { health: 80, maxHealth: 80, attack: 8, defence: 4, magic: 18, guts: 2, weapon: 12, primaryArmor: 0, secondaryArmor: 0, weaponStyle: 0 },
    { health: 0, maxHealth: 0, attack: 0, defence: 0, magic: 0, guts: 0, weapon: 0, primaryArmor: 0, secondaryArmor: 0, weaponStyle: 0 },
  ];
  for (const cd of charData) {
    const ch = { ...cd, weaponStats: [], spells: [] };
    for (let j = 0; j < 4; j++) {
      ch.weaponStats.push({ attack: 0, defence: 0, magic: 0, bolts: 0, grazeAmount: 0, grazeSize: 0, boltSpeed: 0, special: 0, element: 0, elementAmount: 0 });
    }
    for (let k = 0; k < 12; k++) ch.spells.push(0);
    s.characters.push(ch);
  }
  // Inventory V2
  for (let i = 0; i < 13; i++) { s.inventory.consumables.push(i < 3 ? i + 1 : 0); s.inventory.keyItems.push(i < 2 ? i + 1 : 0); }
  for (let i = 0; i < 48; i++) { s.inventory.weapons.push(i < 3 ? i + 1 : 0); s.inventory.armors.push(i < 3 ? i + 1 : 0); }
  for (let i = 0; i < 72; i++) s.inventory.storage.push(0);
  // Light world items
  for (let i = 0; i < 8; i++) { s.lightWorld.items.push(i < 2 ? i + 1 : 0); s.lightWorld.phone.push(i < 1 ? 201 : 0); }
  // Flags: 2509 for V2
  for (let i = 0; i < 2509; i++) s.flags.push(0);
  // Set some interesting flags
  s.flags[10] = 100; // SOUND_VOLUME
  s.flags[11] = 80; // MUSIC_VOLUME
  return serializeSave(s);
}

// ========== 加载存档 ==========
async function loadFromPath(path) {
  try {
    const content = await Platform.readFile(path);
    currentFileName = path.split(/[\\/]/).pop();
    currentFilePath = path;
    loadSaveContent(content);
  } catch (e) {
    showToast(t('loadFailed') + ': ' + e.message, 'error');
  }
}

function loadSaveContent(content) {
  try {
    currentSave = parseSave(content);
    renderEditor();
    showToast(t('loadSuccess') + ' ' + t('formatV') + currentSave.format + ' ' + t('chapter') + ': ' + currentSave.chapter);
  } catch (e) {
    showToast(t('parseFailed') + ': ' + e.message, 'error');
    if (e instanceof ParseError && e.details) {
      showToast(e.details, 'error');
    }
  }
}

// ========== 保存存档 ==========
async function saveCurrentFile() {
  if (!currentSave) { showToast(t('noSave'), 'error'); return; }
  collectEdits();
  const content = serializeSave(currentSave);
  try {
    if (Platform.type === 'jsbridge') {
      Platform.writeSync(content);
      showToast(t('saveSuccess'));
      return;
    }
    const savePath = currentFilePath || currentFileName || 'save';
    await Platform.writeFile(savePath, content);
    showToast(t('saveSuccess'));
  } catch (e) {
    showToast(t('saveFailed') + ': ' + e.message, 'error');
  }
}

// ========== 列出存档文件 ==========
async function listSaveFiles() {
  const files = await Platform.listFiles('.');
  const container = document.getElementById('file-list');
  container.innerHTML = '';
  if (files.length === 0) {
    container.textContent = t('noFiles');
    return;
  }
  for (const f of files) {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.textContent = f;
    item.addEventListener('click', async () => {
      document.getElementById('filename-input').value = f;
      await loadFromPath(f);
      container.innerHTML = '';
    });
    container.appendChild(item);
  }
}

// ========== 渲染编辑器 ==========
function navigateTo(page) {
  currentPage = page;
  // 更新导航栏状态
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  renderCurrentPage();
}

function renderCurrentPage() {
  const root = document.getElementById('editor-root');
  root.innerHTML = '';
  // 关于页面不需要加载存档
  if (currentPage === 'about') { root.appendChild(renderAboutSection()); return; }
  if (!currentSave) return;
  const s = currentSave;
  switch (currentPage) {
    case 'basic': root.appendChild(renderInfoSection(s)); root.appendChild(renderBasicSection(s)); break;
    case 'characters': root.appendChild(renderCharactersSection(s)); break;
    case 'inventory': root.appendChild(renderInventorySection(s)); break;
    case 'lightworld': root.appendChild(renderLightWorldSection(s)); break;
    case 'flags': root.appendChild(renderFlagsSection(s)); break;
    case 'story': root.appendChild(renderStorySection(s)); break;
  }
}

function renderEditor() {
  renderCurrentPage();
}

// ========== 信息栏 ==========
function renderInfoSection(s) {
  const info = el('div', 'section');
  info.innerHTML = `<div class="section-title">${t('sectionInfo')}</div>
    <div class="grid">
      <label>文件: <strong>${esc(currentFileName)}</strong></label>
      <label>格式: <strong>V${s.format}</strong></label>
      <label>章节: <strong>${locName(CHAPTERS_META, s.chapter, 'CHAPTERS_META')}</strong></label>
      <label>行数: <strong>${s.flags.length + 3}</strong> 标志数: <strong>${s.flags.length}</strong></label>
    </div>`;
  return info;
}

// ========== 基本属性 ==========
function renderBasicSection(s) {
  const sec = el('div', 'section');
  sec.innerHTML = `<div class="section-title">${t('sectionBasic')}</div>`;
  const g = el('div', 'grid');
  g.appendChild(makeInput(t('playerName'), 'playerName', s.playerName, 'text'));
  g.appendChild(makeInput(t('vesselName'), 'vesselName', s.vesselName, 'text'));
  g.appendChild(makeInput(t('money'), 'money', s.money, 'number'));
  g.appendChild(makeInput(t('xp'), 'xp', s.xp, 'number'));
  g.appendChild(makeInput(t('lv'), 'lv', s.lv, 'number'));
  g.appendChild(makeInput('INV', 'inv', s.inv, 'number'));
  g.appendChild(makeInput('INVC', 'invc', s.invc, 'number'));
  g.appendChild(makeCheckbox(t('inDarkWorld'), 'inDarkWorld', s.inDarkWorld));
  g.appendChild(makeInput(t('plot'), 'plot', s.plot, 'number'));
  g.appendChild(makeInput(t('room'), 'room', s.room, 'number'));
  g.appendChild(makeInput(t('time'), 'time', s.time, 'number'));
  // 队伍
  g.appendChild(makeCheckbox(t('allowNonStandardParty'), 'allowNonStandardParty', allowNonStandardParty));
  const chapter = s.chapter || 2;
  for (let slot = 0; slot < 3; slot++) {
    const opts = getPartySlotOptions(chapter, slot, s.party);
    g.appendChild(makeSelect(`[${slot}] ${t('party')}`, `party-${slot}`, s.party[slot], opts));
  }
  // 战斗
  g.appendChild(makeInput(t('boltSpeed'), 'battle-boltSpeed', s.battle.boltSpeed, 'number'));
  g.appendChild(makeInput(t('grazeAmount'), 'battle-grazeAmount', s.battle.grazeAmount, 'number'));
  g.appendChild(makeInput(t('grazeSize'), 'battle-grazeSize', s.battle.grazeSize, 'number'));
  g.appendChild(makeInput('Tension', 'battle-tension', s.battle.tension, 'number'));
  g.appendChild(makeInput('MaxTension', 'battle-maxTension', s.battle.maxTension, 'number'));
  sec.appendChild(g);
  return sec;
}

// ========== 角色 ==========
function renderCharactersSection(s) {
  const sec = el('div', 'section');
  sec.innerHTML = `<div class="section-title">${t('sectionCharacters')}</div>`;
  const charSvgMap = { 1: 'kris', 2: 'susie', 3: 'ralsei', 4: 'noelle' };
  // 只显示队伍中选中的角色，按 party 槽位遍历
  for (let slot = 0; slot < 3; slot++) {
    const charIdx = s.party[slot]; // CharacterIndex: 0=Empty, 1=Kris, 2=Susie, 3=Ralsei, 4=Noelle
    if (charIdx === 0) continue; // 跳过空槽位
    if (!s.characters[charIdx]) continue; // 数据不存在则跳过
    const ch = s.characters[charIdx];
    const charMeta = CHARACTERS_META[charIdx] || CHARACTERS_META[0];
    const chDiv = el('div', 'char-block');
    // 头像 + title 描述
    const headerDiv = el('div', 'char-header');
    const svgName = charSvgMap[charIdx];
    if (svgName) {
      const img = el('img', 'char-avatar');
      img.src = `./assets/characters/${svgName}.svg`;
      img.alt = charMeta.displayName;
      img.loading = 'lazy';
      if (charMeta.color) img.style.borderColor = charMeta.color;
      headerDiv.appendChild(img);
    }
    const infoDiv = el('div', 'char-info');
    const nameEl = el('div', 'char-name');
    if (charMeta.color) nameEl.style.color = charMeta.color;
    nameEl.textContent = `[${slot}] ${charMeta.displayName}`;
    infoDiv.appendChild(nameEl);
    const titleEl = el('div', 'char-title-text');
    titleEl.textContent = `LV${s.lv || 1} ${charMeta.title || ''}`;
    infoDiv.appendChild(titleEl);
    if (charMeta.titleDesc) {
      const descEl = el('div', 'char-desc');
      descEl.textContent = charMeta.titleDesc;
      infoDiv.appendChild(descEl);
    }
    headerDiv.appendChild(infoDiv);
    chDiv.appendChild(headerDiv);
    const g = el('div', 'grid');
    g.appendChild(makeInput(t('hp'), `ch-${charIdx}-health`, ch.health, 'number'));
    g.appendChild(makeInput(t('maxHp'), `ch-${charIdx}-maxHealth`, ch.maxHealth, 'number'));
    g.appendChild(makeInput(t('atk'), `ch-${charIdx}-attack`, ch.attack, 'number'));
    g.appendChild(makeInput(t('def'), `ch-${charIdx}-defence`, ch.defence, 'number'));
    g.appendChild(makeInput(t('mag'), `ch-${charIdx}-magic`, ch.magic, 'number'));
    g.appendChild(makeInput(t('guts'), `ch-${charIdx}-guts`, ch.guts, 'number'));
    g.appendChild(makeSelect(t('weapon'), `ch-${charIdx}-weapon`, ch.weapon, loc(WEAPONS_META, 'WEAPONS_META')));
    g.appendChild(makeSelect(t('primaryArmor'), `ch-${charIdx}-primaryArmor`, ch.primaryArmor, loc(ARMORS_META, 'ARMORS_META')));
    g.appendChild(makeSelect(t('secondaryArmor'), `ch-${charIdx}-secondaryArmor`, ch.secondaryArmor, loc(ARMORS_META, 'ARMORS_META')));
    if (s.format === 1) {
      g.appendChild(makeInput(t('weaponStyle'), `ch-${charIdx}-weaponStyle`, ch.weaponStyle, 'text'));
    } else {
      g.appendChild(makeInput(t('weaponStyle'), `ch-${charIdx}-weaponStyle`, ch.weaponStyle, 'number'));
    }
    // 法术
    for (let k = 0; k < ch.spells.length; k++) {
      const spellOpts = loc(SPELLS_META, 'SPELLS_META');
      const spellField = makeSelect(`${t('spell')}${k+1}`, `ch-${charIdx}-spell-${k}`, ch.spells[k], spellOpts);
      // 标记 unused 法术
      const spellMeta = SPELLS_META[ch.spells[k]];
      if (spellMeta && spellMeta.unused) {
        spellField.title = '此法术在游戏中不可获得，通常未完成、有缺陷并可能导致问题。';
        spellField.classList.add('field-unused');
      }
      g.appendChild(spellField);
    }
    chDiv.appendChild(g);
    sec.appendChild(chDiv);
  }
  return sec;
}

// ========== 物品栏 ==========
function renderInventorySection(s) {
  const sec = el('div', 'section');
  sec.innerHTML = `<div class="section-title">${t('sectionInventory')}</div>`;
  const g = el('div', 'grid');

  // 消耗品
  for (let i = 0; i < s.inventory.consumables.length; i++) {
    g.appendChild(makeSelect(`[${i+1}] ${t('consumable')}`, `inv-consumable-${i}`, s.inventory.consumables[i], loc(CONSUMABLES_META, 'CONSUMABLES_META')));
  }
  // 关键物品
  for (let i = 0; i < s.inventory.keyItems.length; i++) {
    g.appendChild(makeSelect(`[${i+1}] ${t('keyItem')}`, `inv-keyitem-${i}`, s.inventory.keyItems[i], loc(KEYITEMS_META, 'KEYITEMS_META')));
  }
  // 武器
  for (let i = 0; i < s.inventory.weapons.length; i++) {
    g.appendChild(makeSelect(`[${i+1}] ${t('weapon')}`, `inv-weapon-${i}`, s.inventory.weapons[i], loc(WEAPONS_META, 'WEAPONS_META')));
  }
  // 护甲
  for (let i = 0; i < s.inventory.armors.length; i++) {
    g.appendChild(makeSelect(`[${i+1}] ${t('invArmor')}`, `inv-armor-${i}`, s.inventory.armors[i], loc(ARMORS_META, 'ARMORS_META')));
  }
  // 仓库 (V2)
  if (s.inventory.storage) {
    for (let i = 0; i < s.inventory.storage.length; i++) {
      g.appendChild(makeSelect(`[${i+1}] ${t('storage')}`, `inv-storage-${i}`, s.inventory.storage[i], loc(CONSUMABLES_META, 'CONSUMABLES_META')));
    }
  }
  sec.appendChild(g);
  return sec;
}

// ========== 光世界 ==========
function renderLightWorldSection(s) {
  const sec = el('div', 'section');
  sec.innerHTML = `<div class="section-title">${t('sectionLightWorld')}</div>`;
  const g = el('div', 'grid');
  const lw = s.lightWorld;
  g.appendChild(makeSelect(t('weapon'), 'lw-weapon', lw.weapon, loc(LIGHTWORLDITEMS_META, 'LIGHTWORLDITEMS_META')));
  g.appendChild(makeSelect(t('invArmor'), 'lw-armor', lw.armor, loc(LIGHTWORLDITEMS_META, 'LIGHTWORLDITEMS_META')));
  g.appendChild(makeInput(t('xp'), 'lw-experience', lw.experience, 'number'));
  g.appendChild(makeInput(t('lv'), 'lw-level', lw.level, 'number'));
  g.appendChild(makeInput(t('money'), 'lw-money', lw.money, 'number'));
  g.appendChild(makeInput(t('hp'), 'lw-health', lw.health, 'number'));
  g.appendChild(makeInput(t('maxHp'), 'lw-maxHealth', lw.maxHealth, 'number'));
  g.appendChild(makeInput(t('atk'), 'lw-attack', lw.attack, 'number'));
  g.appendChild(makeInput(t('def'), 'lw-defence', lw.defence, 'number'));
  g.appendChild(makeInput(t('weaponStrength'), 'lw-weaponStrength', lw.weaponStrength, 'number'));
  g.appendChild(makeInput(t('armorDefence'), 'lw-armorDefence', lw.armorDefence, 'number'));
  for (let i = 0; i < lw.items.length; i++) {
    g.appendChild(makeSelect(`[${i+1}] ${t('lwItem')}`, `lw-item-${i}`, lw.items[i], loc(LIGHTWORLDITEMS_META, 'LIGHTWORLDITEMS_META')));
  }
  for (let i = 0; i < lw.phone.length; i++) {
    g.appendChild(makeSelect(`[${i+1}] ${t('phone')}`, `lw-phone-${i}`, lw.phone[i], loc(PHONECONTACTS_META, 'PHONECONTACTS_META')));
  }
  sec.appendChild(g);
  return sec;
}

// ========== 标志 ==========
function renderFlagsSection(s) {
  const sec = el('div', 'section');
  const knownCount = Object.keys(FLAGS_META).length;
  sec.innerHTML = `<div class="section-title">${t('sectionFlags')} (${s.flags.length}) <small style="color:var(--text2);font-weight:400">${t('flagsKnown')} ${knownCount} 条</small></div>
    <div class="flags-toolbar">
      <input type="text" id="flags-search-input" placeholder="${t('flagsSearch')}" />
      <button id="btn-flags-search" class="btn-sm">${t('flagsSearchBtn')}</button>
      <button class="btn-sm" id="btn-flags-clear-search">${t('flagsClear')}</button>
      <label class="flags-toolbar-check"><input type="checkbox" id="flags-named-only"> ${t('flagsNamedOnly')}</label>
      <span id="flags-count"></span>
    </div>`;
  const container = el('div', 'flags-grid');
  container.id = 'flags-container';
  renderFlagItems(container, s.flags, 0, s.flags.length);
  sec.appendChild(container);
  // 绑定清除搜索
  sec.querySelector('#btn-flags-clear-search').addEventListener('click', () => {
    document.getElementById('flags-search-input').value = '';
    document.getElementById('flags-named-only').checked = false;
    renderFlagItems(container, s.flags, 0, s.flags.length);
    document.getElementById('flags-count').textContent = '';
  });
  // 绑定仅显示已知
  sec.querySelector('#flags-named-only').addEventListener('change', () => {
    filterFlags();
  });
  return sec;
}

function renderFlagItems(container, flags, start, end) {
  container.innerHTML = '';
  const namedOnly = document.getElementById('flags-named-only')?.checked;
  for (let i = start; i < end && i < flags.length; i++) {
    const meta = FLAGS_META[i];
    if (namedOnly && !meta) continue;
    const item = el('div', 'flag-item');
    if (meta) item.classList.add('flag-known');
    const label = el('label', '');
    // 显示名称（如果有）
    const nameSpan = meta ? el('span', 'flag-name') : null;
    if (nameSpan) {
      nameSpan.textContent = meta.displayName || '';
      nameSpan.title = meta.description || '';
    }
    const idxSpan = el('span', 'flag-idx');
    idxSpan.textContent = `[${i}]`;
    label.appendChild(idxSpan);
    if (nameSpan) label.appendChild(nameSpan);
    // 对于 boolean 类型用 checkbox，否则用 input
    if (meta && meta.valueType === 'boolean') {
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'field-check';
      cb.checked = !!flags[i];
      cb.dataset.flagIndex = i;
      cb.id = `flag-${i}`;
      label.appendChild(cb);
    } else {
      const input = document.createElement('input');
      input.type = 'number';
      input.id = `flag-${i}`;
      input.className = 'flag-input';
      input.value = flags[i];
      input.dataset.flagIndex = i;
      label.appendChild(input);
    }
    // 值规则提示
    if (meta && meta.valueRules && meta.valueRules.map) {
      const hint = el('span', 'flag-hint');
      const val = flags[i];
      hint.textContent = meta.valueRules.map[val] || '';
      hint.title = Object.entries(meta.valueRules.map).map(([k,v]) => `${k}=${v}`).join('\n');
      label.appendChild(hint);
    }
    // volatile 标记
    if (meta && meta.volatile) {
      const vol = el('span', 'flag-volatile');
      vol.textContent = 'V';
      vol.title = 'Volatile - 此值会在运行时变化，修改可能不持久';
      label.appendChild(vol);
    }
    item.appendChild(label);
    container.appendChild(item);
  }
}

function filterFlags() {
  if (!currentSave) return;
  const query = document.getElementById('flags-search-input').value.trim();
  const container = document.getElementById('flags-container');
  const namedOnly = document.getElementById('flags-named-only')?.checked;
  if (!query && !namedOnly) {
    renderFlagItems(container, currentSave.flags, 0, currentSave.flags.length);
    document.getElementById('flags-count').textContent = '';
    return;
  }
  // 支持范围格式如 "100-200"、单索引、或名称搜索
  let indices = null;
  if (/^\d+-\d+$/.test(query)) {
    const parts = query.split('-');
    const start = Math.max(0, parseInt(parts[0]) || 0);
    const end = Math.min(currentSave.flags.length, (parseInt(parts[1]) || currentSave.flags.length) + 1);
    indices = [];
    for (let i = start; i < end; i++) indices.push(i);
  } else if (/^\d+$/.test(query)) {
    const idx = parseInt(query);
    const start = Math.max(0, idx - 50);
    const end = Math.min(currentSave.flags.length, idx + 51);
    indices = [];
    for (let i = start; i < end; i++) indices.push(i);
  } else if (query) {
    // 名称搜索
    const lower = query.toLowerCase();
    indices = [];
    for (let i = 0; i < currentSave.flags.length; i++) {
      const meta = FLAGS_META[i];
      if (meta && (meta.displayName?.toLowerCase().includes(lower) || meta.description?.toLowerCase().includes(lower))) {
        indices.push(i);
      }
    }
  }
  // 如果 namedOnly 过滤
  if (namedOnly && indices) {
    indices = indices.filter(i => FLAGS_META[i]);
  } else if (namedOnly && !indices) {
    indices = [];
    for (let i = 0; i < currentSave.flags.length; i++) {
      if (FLAGS_META[i]) indices.push(i);
    }
  }
  // 渲染
  container.innerHTML = '';
  if (indices) {
    for (const i of indices) {
      // 复用 renderFlagItems 的逻辑，但逐个添加
      const meta = FLAGS_META[i];
      const item = el('div', 'flag-item');
      if (meta) item.classList.add('flag-known');
      const label = el('label', '');
      const nameSpan = meta ? el('span', 'flag-name') : null;
      if (nameSpan) {
        nameSpan.textContent = meta.displayName || '';
        nameSpan.title = meta.description || '';
      }
      const idxSpan = el('span', 'flag-idx');
      idxSpan.textContent = `[${i}]`;
      label.appendChild(idxSpan);
      if (nameSpan) label.appendChild(nameSpan);
      if (meta && meta.valueType === 'boolean') {
        const cb = document.createElement('input');
        cb.type = 'checkbox'; cb.className = 'field-check';
        cb.checked = !!currentSave.flags[i]; cb.dataset.flagIndex = i; cb.id = `flag-${i}`;
        label.appendChild(cb);
      } else {
        const input = document.createElement('input');
        input.type = 'number'; input.id = `flag-${i}`; input.className = 'flag-input';
        input.value = currentSave.flags[i]; input.dataset.flagIndex = i;
        label.appendChild(input);
      }
      if (meta && meta.valueRules && meta.valueRules.map) {
        const hint = el('span', 'flag-hint');
        const val = currentSave.flags[i];
        hint.textContent = meta.valueRules.map[val] || '';
        hint.title = Object.entries(meta.valueRules.map).map(([k,v]) => `${k}=${v}`).join('\n');
        label.appendChild(hint);
      }
      if (meta && meta.volatile) {
        const vol = el('span', 'flag-volatile');
        vol.textContent = 'V'; vol.title = 'Volatile';
        label.appendChild(vol);
      }
      item.appendChild(label);
      container.appendChild(item);
    }
  }
  document.getElementById('flags-count').textContent = indices ? `${indices.length} 项` : '';
}

// ========== Story 页面 ==========
function renderStorySection(s) {
  const wrapper = el('div', '');
  // 搜索框
  const searchDiv = el('div', 'flags-toolbar');
  searchDiv.innerHTML = `<input type="text" id="story-search-input" placeholder="${t('storySearch')}" style="width:200px" />
    <button class="btn-sm" id="btn-story-search">${t('flagsSearchBtn')}</button>
    <button class="btn-sm" id="btn-story-clear">${t('flagsClear')}</button>`;
  wrapper.appendChild(searchDiv);
  const container = el('div', '');
  container.id = 'story-container';
  renderStoryContent(container, s);
  wrapper.appendChild(container);
  // 事件绑定
  setTimeout(() => {
    const searchBtn = document.getElementById('btn-story-search');
    const clearBtn = document.getElementById('btn-story-clear');
    const searchInput = document.getElementById('story-search-input');
    if (searchBtn) searchBtn.addEventListener('click', () => {
      renderStoryContent(container, s);
    });
    if (clearBtn) clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      renderStoryContent(container, s);
    });
    if (searchInput) searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') renderStoryContent(container, s);
    });
  }, 0);
  return wrapper;
}

function renderStoryContent(container, s) {
  container.innerHTML = '';
  const query = (document.getElementById('story-search-input')?.value || '').trim().toLowerCase();
  const chapter = s.chapter;
  const sections = STORY_SECTIONS[chapter];
  if (!sections) {
    container.innerHTML = `<div class="section" style="text-align:center;color:var(--text2);padding:20px">${t('chapter')} ${chapter} ${t('storyNoData')}</div>`;
    return;
  }
  for (const section of sections) {
    // 过滤
    const filteredSection = query ? filterStorySection(section, query) : section;
    if (!filteredSection) continue;
    // 渲染 section
    const secDiv = el('div', 'story-section');
    secDiv.innerHTML = `<div class="story-section-title">${esc(filteredSection.title)}</div>`;
    if ('clusters' in filteredSection) {
      for (const cluster of filteredSection.clusters) {
        if (cluster.flags.length === 0) continue;
        const clDiv = el('div', 'story-cluster');
        clDiv.innerHTML = `<div class="story-cluster-title">${esc(cluster.title)}</div>`;
        const grid = el('div', 'story-grid');
        for (const flagIdx of cluster.flags) {
          grid.appendChild(renderStoryFlag(flagIdx, s));
        }
        clDiv.appendChild(grid);
        secDiv.appendChild(clDiv);
      }
    } else {
      // flat section
      const grid = el('div', 'story-grid');
      for (const flagIdx of filteredSection.flags) {
        grid.appendChild(renderStoryFlag(flagIdx, s));
      }
      secDiv.appendChild(grid);
    }
    container.appendChild(secDiv);
  }
  if (container.children.length === 0) {
    container.innerHTML = `<div class="section" style="text-align:center;color:var(--text2);padding:20px">${t('storyNoMatch')}</div>`;
  }
}

function filterStorySection(section, query) {
  if ('clusters' in section) {
    const clusters = section.clusters.map(cluster => ({
      ...cluster,
      flags: cluster.flags.filter(idx => flagMatchesQuery(idx, query)),
    })).filter(cluster => cluster.flags.length > 0);
    return clusters.length > 0 ? { ...section, clusters } : null;
  }
  const flags = section.flags.filter(idx => flagMatchesQuery(idx, query));
  return flags.length > 0 ? { ...section, flags } : null;
}

function flagMatchesQuery(idx, query) {
  if (idx < 0) return false; // bitfield placeholder
  const meta = FLAGS_META[idx];
  if (!meta) return false;
  const haystack = `${idx} ${meta.displayName || ''} ${meta.description || ''}`.toLowerCase();
  return haystack.includes(query);
}

function renderStoryFlag(flagIdx, s) {
  const div = el('div', 'sflag');
  // bitfield 占位
  if (flagIdx < 0) {
    div.innerHTML = `<span class="sflag-name" style="color:var(--text3)">[bitfield]</span>`;
    return div;
  }
  const meta = FLAGS_META[flagIdx];
  const value = s.flags[flagIdx] ?? 0;
  // 名称
  const nameSpan = el('span', 'sflag-name');
  nameSpan.textContent = `[${flagIdx}] ${meta?.displayName || `Flag ${flagIdx}`}`;
  if (meta?.description) nameSpan.title = meta.description;
  // 描述行
  if (meta?.description) {
    const descSmall = el('small', '');
    descSmall.textContent = meta.description;
    nameSpan.appendChild(descSmall);
  }
  div.appendChild(nameSpan);
  // 控件 - 根据 valueType 选择
  if (meta?.valueType === 'boolean') {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'sflag-check';
    cb.checked = !!value;
    cb.dataset.flagIndex = flagIdx;
    div.appendChild(cb);
  } else if (meta?.valueType === 'map' && meta.valueRules?.map) {
    const select = document.createElement('select');
    select.className = 'sflag-select';
    select.dataset.flagIndex = flagIdx;
    const entries = Object.entries(meta.valueRules.map).sort(([a],[b]) => Number(a) - Number(b));
    for (const [val, label] of entries) {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = label;
      if (Number(val) === value) opt.selected = true;
      select.appendChild(opt);
    }
    div.appendChild(select);
  } else if (meta?.valueType === 'color') {
    const input = document.createElement('input');
    input.type = 'color';
    input.className = 'sflag-check';
    input.dataset.flagIndex = flagIdx;
    // 简化：用数字输入
    const numInput = document.createElement('input');
    numInput.type = 'number';
    numInput.className = 'sflag-number';
    numInput.value = value;
    numInput.dataset.flagIndex = flagIdx;
    div.appendChild(numInput);
  } else {
    // number 或未知
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'sflag-number';
    input.value = value;
    input.dataset.flagIndex = flagIdx;
    if (meta?.valueRules?.min !== undefined) input.min = meta.valueRules.min;
    if (meta?.valueRules?.max !== undefined) input.max = meta.valueRules.max;
    div.appendChild(input);
  }
  // volatile 标记
  if (meta?.volatile) {
    const vol = el('span', 'sflag-volatile');
    vol.textContent = 'V';
    vol.title = 'Volatile';
    div.appendChild(vol);
  }
  return div;
}

// ========== 收集编辑数据 ==========
function collectEdits() {
  const s = currentSave;
  // 基本属性
  s.playerName = getInput('playerName');
  s.vesselName = getInput('vesselName');
  s.money = getNum('money');
  s.xp = getNum('xp');
  s.lv = getNum('lv');
  s.inv = getNum('inv');
  s.invc = getNum('invc');
  s.inDarkWorld = getChecked('inDarkWorld');
  allowNonStandardParty = getChecked('allowNonStandardParty');
  s.plot = getNum('plot');
  s.room = getNum('room');
  s.time = getNum('time');
  s.party[0] = getNum('party-0');
  s.party[1] = getNum('party-1');
  s.party[2] = getNum('party-2');
  s.battle.boltSpeed = getNum('battle-boltSpeed');
  s.battle.grazeAmount = getNum('battle-grazeAmount');
  s.battle.grazeSize = getNum('battle-grazeSize');
  s.battle.tension = getNum('battle-tension');
  s.battle.maxTension = getNum('battle-maxTension');

  // 角色 - 按 party 槽位收集
  for (let slot = 0; slot < 3; slot++) {
    const charIdx = s.party[slot];
    if (charIdx === 0 || !s.characters[charIdx]) continue;
    const ch = s.characters[charIdx];
    ch.health = getNum(`ch-${charIdx}-health`);
    ch.maxHealth = getNum(`ch-${charIdx}-maxHealth`);
    ch.attack = getNum(`ch-${charIdx}-attack`);
    ch.defence = getNum(`ch-${charIdx}-defence`);
    ch.magic = getNum(`ch-${charIdx}-magic`);
    ch.guts = getNum(`ch-${charIdx}-guts`);
    ch.weapon = getNum(`ch-${charIdx}-weapon`);
    ch.primaryArmor = getNum(`ch-${charIdx}-primaryArmor`);
    ch.secondaryArmor = getNum(`ch-${charIdx}-secondaryArmor`);
    ch.weaponStyle = s.format === 1 ? getInput(`ch-${charIdx}-weaponStyle`) : getNum(`ch-${charIdx}-weaponStyle`);
    for (let k = 0; k < ch.spells.length; k++) {
      ch.spells[k] = getNum(`ch-${charIdx}-spell-${k}`);
    }
  }

  // 物品栏
  for (let i = 0; i < s.inventory.consumables.length; i++)
    s.inventory.consumables[i] = getNum(`inv-consumable-${i}`);
  for (let i = 0; i < s.inventory.keyItems.length; i++)
    s.inventory.keyItems[i] = getNum(`inv-keyitem-${i}`);
  for (let i = 0; i < s.inventory.weapons.length; i++)
    s.inventory.weapons[i] = getNum(`inv-weapon-${i}`);
  for (let i = 0; i < s.inventory.armors.length; i++)
    s.inventory.armors[i] = getNum(`inv-armor-${i}`);
  if (s.inventory.storage) {
    for (let i = 0; i < s.inventory.storage.length; i++)
      s.inventory.storage[i] = getNum(`inv-storage-${i}`);
  }

  // 光世界
  const lw = s.lightWorld;
  lw.weapon = getNum('lw-weapon');
  lw.armor = getNum('lw-armor');
  lw.experience = getNum('lw-experience');
  lw.level = getNum('lw-level');
  lw.money = getNum('lw-money');
  lw.health = getNum('lw-health');
  lw.maxHealth = getNum('lw-maxHealth');
  lw.attack = getNum('lw-attack');
  lw.defence = getNum('lw-defence');
  lw.weaponStrength = getNum('lw-weaponStrength');
  lw.armorDefence = getNum('lw-armorDefence');
  for (let i = 0; i < lw.items.length; i++) lw.items[i] = getNum(`lw-item-${i}`);
  for (let i = 0; i < lw.phone.length; i++) lw.phone[i] = getNum(`lw-phone-${i}`);

  // 标志
  document.querySelectorAll('.flag-input').forEach(input => {
    const idx = parseInt(input.dataset.flagIndex);
    if (idx >= 0 && idx < s.flags.length) {
      s.flags[idx] = parseInfNum(input.value);
    }
  });
  // boolean 标志 checkbox
  document.querySelectorAll('#flags-container .field-check').forEach(cb => {
    const idx = parseInt(cb.dataset.flagIndex);
    if (idx >= 0 && idx < s.flags.length) {
      s.flags[idx] = cb.checked ? 1 : 0;
    }
  });
  // Story 页面标志
  document.querySelectorAll('.sflag-check').forEach(cb => {
    const idx = parseInt(cb.dataset.flagIndex);
    if (idx >= 0 && idx < s.flags.length) {
      s.flags[idx] = cb.checked ? 1 : 0;
    }
  });
  document.querySelectorAll('.sflag-number').forEach(input => {
    const idx = parseInt(input.dataset.flagIndex);
    if (idx >= 0 && idx < s.flags.length) {
      s.flags[idx] = parseInfNum(input.value);
    }
  });
  document.querySelectorAll('.sflag-select').forEach(select => {
    const idx = parseInt(select.dataset.flagIndex);
    if (idx >= 0 && idx < s.flags.length) {
      s.flags[idx] = Number(select.value) || 0;
    }
  });
}

// ========== 关于页面 ==========
function renderAboutSection() {
  const sec = el('div', 'about-page');
  sec.innerHTML = `
    <h2>QM-Editor</h2>
    <div class="about-version">v3 - DELTARUNE 存档编辑器</div>
    <div class="about-author">${t('aboutAuthor')}</div>
    <div class="about-site"><a href="https://dreditorcn.genouka.top/" target="_blank" rel="noopener">https://dreditorcn.genouka.top/</a></div>
    ${Platform.type === 'jsbridge' ? `<div class="about-legacy"><a href="/v2/editor/" target="_blank" rel="noopener">${t('aboutLegacy')}</a></div>` : ''}
  `;
  return sec;
}

// ========== 队伍选项逻辑 ==========
/** 参考 tenna-editor 的 getPartySlotBaseOptions + Overview 去重逻辑 */
function getPartySlotOptions(chapter, slot, party) {
  const chapterChars = CHAPTERS_CHARACTERS[chapter] || CHAPTERS_CHARACTERS[2];
  let available;
  if (allowNonStandardParty) {
    available = [...chapterChars];
  } else {
    available = [];
    for (const charId of chapterChars) {
      const meta = CHARACTERS_META[charId];
      if (meta && meta.allowedSlots && meta.allowedSlots.includes(slot)) {
        available.push(charId);
      }
    }
  }
  available.sort((a, b) => a - b);

  // 去重：非标准模式下不过滤，标准模式下移除其他槽位已使用的角色
  if (!allowNonStandardParty) {
    const usedInOtherSlots = new Set(
      party.filter((member, i) => member !== 0 && i !== slot)
    );
    available = available.filter(id => id === party[slot] || !usedInOtherSlots.has(id));
    // 如果 slot 2 不是 Empty，slot 1 的 Empty 选项移除
    if (party[2] !== 0 && slot === 1) {
      available = available.filter(id => id !== 0);
    }
  }

  return available.map(id => {
    const meta = CHARACTERS_META[id] || { displayName: `Unknown (${id})` };
    const label = (LOCALE.CHARACTERS_META && LOCALE.CHARACTERS_META[id]) || meta.displayName;
    return { value: id, label, meta };
  });
}

// ========== UI 辅助 ==========
function el(tag, cls) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function makeInput(label, id, value, type) {
  const wrap = el('label', 'field');
  const span = el('span', 'field-label');
  span.textContent = label;
  const input = document.createElement('input');
  if (type === 'number') {
    // 使用 text 类型以支持 inf 输入
    input.type = 'text';
    input.inputMode = 'numeric';
    input.className = 'field-input';
    input.value = (value === Infinity || value === -Infinity) ? 'inf' : value;
  } else {
    input.type = type;
    input.className = 'field-input';
    input.value = value;
  }
  input.id = id;
  wrap.appendChild(span);
  wrap.appendChild(input);
  return wrap;
}

function makeCheckbox(label, id, checked) {
  const wrap = el('label', 'field');
  const span = el('span', 'field-label');
  span.textContent = label;
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = id;
  input.className = 'field-check';
  input.checked = !!checked;
  wrap.appendChild(span);
  wrap.appendChild(input);
  return wrap;
}

function makeSelect(label, id, value, options) {
  const wrap = el('label', 'field');
  const span = el('span', 'field-label');
  span.textContent = label;
  const select = document.createElement('select');
  select.id = id;
  select.className = 'field-select';
  for (const opt of options) {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = `[${opt.value}] ${opt.label}`;
    if (opt.value === value) o.selected = true;
    select.appendChild(o);
  }
  wrap.appendChild(span);
  wrap.appendChild(select);
  return wrap;
}

function getInput(id) {
  const e = document.getElementById(id);
  return e ? e.value : '';
}

function getNum(id) {
  const e = document.getElementById(id);
  return e ? parseInfNum(e.value) : 0;
}

/** 解析可能为 inf 的数值 */
function parseInfNum(val) {
  const v = String(val).trim().toLowerCase();
  if (v === 'inf' || v === 'infinity' || v === '+inf' || v === '+infinity') return Infinity;
  if (v === '-inf' || v === '-infinity') return -Infinity;
  return Number(val) || 0;
}

function getChecked(id) {
  const e = document.getElementById(id);
  return e ? e.checked : false;
}

// ========== Toast ==========
let toastTimer = null;
function showToast(msg, type) {
  const toastEl = document.getElementById('toast');
  toastEl.textContent = msg;
  toastEl.className = `toast toast-${type || 'info'} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.className = 'toast', 3000);
}
