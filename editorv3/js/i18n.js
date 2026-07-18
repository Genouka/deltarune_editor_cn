/**
 * 本地化模块
 * 默认语言: zh-CN
 */

const zhCN = {
  // 标题/导航
  appTitle: 'QM-Editor',
  navBasic: '基本属性',
  navCharacters: '角色',
  navInventory: '物品栏',
  navLightWorld: '光世界',
  navFlags: '标志',
  navStory: '故事进度',
  navTitle: '导航',

  // 顶栏
  filenamePlaceholder: '文件名 (如 file_ch2_0)',
  btnLoad: '加载',
  btnPick: '选择文件',
  btnList: '列出存档',
  btnDemo: '演示',
  btnSave: '保存',
  btnClose: '关闭',

  // 存档信息
  sectionInfo: '存档信息',
  labelFile: '文件',
  labelFormat: '格式',
  labelChapter: '章节',
  labelLines: '行数',
  labelFlagCount: '标志数',

  // 基本属性
  sectionBasic: '基本属性',
  playerName: '玩家名',
  vesselName: '容器名',
  money: '金钱',
  xp: '经验',
  lv: '等级',
  inv: 'INV',
  invc: 'INVC',
  inDarkWorld: '暗世界',
  plot: '剧情进度',
  room: '房间',
  time: '时间',
  party: '队伍',
  boltSpeed: '弹速',
  grazeAmount: '擦弹量',
  grazeSize: '擦弹大小',
  tension: 'Tension',
  maxTension: 'MaxTension',

  // 角色
  sectionCharacters: '角色',
  weapon: '武器',
  primaryArmor: '护甲1',
  secondaryArmor: '护甲2',
  weaponStyle: '武器风格',
  spell: '法术',
  hp: 'HP',
  maxHp: 'MaxHP',
  atk: 'ATK',
  def: 'DEF',
  mag: 'MAG',
  guts: 'GUTS',

  // 物品栏
  sectionInventory: '物品栏',
  consumable: '消耗品',
  keyItem: '关键物品',
  invWeapon: '武器',
  invArmor: '护甲',
  storage: '仓库',

  // 光世界
  sectionLightWorld: '光世界',
  lwWeapon: '武器',
  lwArmor: '护甲',
  experience: '经验',
  level: '等级',
  lwMoney: '金钱',
  lwHealth: 'HP',
  lwMaxHealth: 'MaxHP',
  lwAttack: 'ATK',
  lwDefence: 'DEF',
  weaponStrength: '武器强度',
  armorDefence: '护甲防御',
  lwItem: '物品',
  phone: '电话',

  // 标志
  sectionFlags: '标志',
  flagsKnown: '已知',
  flagsSearch: '搜索标志索引或名称...',
  flagsSearchBtn: '搜索',
  flagsClear: '清除',
  flagsNamedOnly: '仅显示已知',

  // Story
  storySearch: '搜索故事字段...',
  storyNoData: '暂无故事数据',
  storyNoMatch: '未找到匹配的故事字段',
  chapter: '章节',

  // Toast
  loadSuccess: '存档加载成功！',
  loadFailed: '读取失败',
  parseFailed: '解析失败',
  noSave: '没有已加载的存档',
  saveSuccess: '保存成功！',
  saveFailed: '保存失败',
  noFiles: '没有找到存档文件',

  // 占位
  placeholder: '选择文件或输入文件名加载存档',
  urlHint: '支持 ?filename=file_ch2_0 形式的 URL 参数',

  // 格式
  formatV: 'V',
};

const enUS = {
  ...zhCN,
  navBasic: 'Basic',
  navCharacters: 'Characters',
  navInventory: 'Inventory',
  navLightWorld: 'Light World',
  navFlags: 'Flags',
  navStory: 'Story',
  navTitle: 'NAV',
  filenamePlaceholder: 'Filename (e.g. file_ch2_0)',
  btnLoad: 'Load',
  btnPick: 'Pick File',
  btnList: 'List',
  btnDemo: 'Demo',
  btnSave: 'Save',
  btnClose: 'Close',
  sectionInfo: 'Save Info',
  sectionBasic: 'Basic',
  playerName: 'Player Name',
  vesselName: 'Vessel Name',
  money: 'Money',
  xp: 'XP',
  lv: 'LV',
  inv: 'INV',
  invc: 'INVC',
  inDarkWorld: 'Dark World',
  plot: 'Plot',
  room: 'Room',
  time: 'Time',
  party: 'Party',
  boltSpeed: 'Bolt Speed',
  grazeAmount: 'Graze Amt',
  grazeSize: 'Graze Size',
  tension: 'Tension',
  maxTension: 'Max Tension',
  sectionCharacters: 'Characters',
  weapon: 'Weapon',
  primaryArmor: 'Armor 1',
  secondaryArmor: 'Armor 2',
  weaponStyle: 'Wpn Style',
  spell: 'Spell',
  hp: 'HP',
  maxHp: 'MaxHP',
  atk: 'ATK',
  def: 'DEF',
  mag: 'MAG',
  guts: 'GUTS',
  sectionInventory: 'Inventory',
  consumable: 'Consumable',
  keyItem: 'Key Item',
  invWeapon: 'Weapon',
  invArmor: 'Armor',
  storage: 'Storage',
  sectionLightWorld: 'Light World',
  lwWeapon: 'Weapon',
  lwArmor: 'Armor',
  experience: 'EXP',
  level: 'LV',
  lwMoney: 'Money',
  lwHealth: 'HP',
  lwMaxHealth: 'MaxHP',
  lwAttack: 'ATK',
  lwDefence: 'DEF',
  weaponStrength: 'Wpn Str',
  armorDefence: 'Armor Def',
  lwItem: 'Item',
  phone: 'Phone',
  sectionFlags: 'Flags',
  flagsKnown: 'known',
  flagsSearch: 'Search flag index or name...',
  flagsSearchBtn: 'Search',
  flagsClear: 'Clear',
  flagsNamedOnly: 'Known only',
  storySearch: 'Search story fields...',
  storyNoData: 'No story data for this chapter',
  storyNoMatch: 'No matching story fields',
  chapter: 'Chapter',
  loadSuccess: 'Save loaded!',
  loadFailed: 'Load failed',
  parseFailed: 'Parse failed',
  noSave: 'No save loaded',
  saveSuccess: 'Saved!',
  saveFailed: 'Save failed',
  noFiles: 'No save files found',
  placeholder: 'Pick a file or enter filename to load',
  urlHint: 'Supports ?filename=file_ch2_0 URL parameter',
  formatV: 'V',
};

const locales = { 'zh-CN': zhCN, 'en-US': enUS };
let current = zhCN;

export function setLocale(lang) {
  current = locales[lang] || zhCN;
}

export function getLocale() {
  return current;
}

/** 翻译 key，支持插值 t('hello', {name: 'world'}) => zhCN.hello */
export function t(key, params) {
  let str = current[key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
  }
  return str;
}

/** 格式化编号: [idx] text */
export function idxText(idx, text) {
  return `[${idx}] ${text}`;
}
