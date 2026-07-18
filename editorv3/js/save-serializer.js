/**
 * Deltarune 存档序列化器
 * 参考 tenna-editor 的 save-serializer.ts
 */

function serializeNumber(value) {
  if (value >= 1e6) return value.toExponential().replace(/e\+(\d)$/, 'e+0$1');
  return String(value);
}

function serializeSaveV1(save) {
  const lines = [];
  lines.push(save.playerName);
  lines.push(save.vesselName);
  for (let i = 0; i < 5; i++) lines.push('');
  lines.push(serializeNumber(save.party[0]));
  lines.push(serializeNumber(save.party[1]));
  lines.push(serializeNumber(save.party[2]));
  lines.push(serializeNumber(save.money));
  lines.push(serializeNumber(save.xp));
  lines.push(serializeNumber(save.lv));
  lines.push(serializeNumber(save.inv));
  lines.push(serializeNumber(save.invc));
  lines.push(serializeNumber(save.inDarkWorld ? 1 : 0));

  for (const ch of save.characters) {
    lines.push(serializeNumber(ch.health));
    lines.push(serializeNumber(ch.maxHealth));
    lines.push(serializeNumber(ch.attack));
    lines.push(serializeNumber(ch.defence));
    lines.push(serializeNumber(ch.magic));
    lines.push(serializeNumber(ch.guts));
    lines.push(serializeNumber(ch.weapon));
    lines.push(serializeNumber(ch.primaryArmor));
    lines.push(serializeNumber(ch.secondaryArmor));
    lines.push(String(ch.weaponStyle));
    for (const ws of ch.weaponStats) {
      lines.push(serializeNumber(ws.attack));
      lines.push(serializeNumber(ws.defence));
      lines.push(serializeNumber(ws.magic));
      lines.push(serializeNumber(ws.bolts));
      lines.push(serializeNumber(ws.grazeAmount));
      lines.push(serializeNumber(ws.grazeSize));
      lines.push(serializeNumber(ws.boltSpeed));
      lines.push(serializeNumber(ws.special));
    }
    for (const sp of ch.spells) lines.push(serializeNumber(sp));
  }

  lines.push(serializeNumber(save.battle.boltSpeed));
  lines.push(serializeNumber(save.battle.grazeAmount));
  lines.push(serializeNumber(save.battle.grazeSize));

  for (let i = 0; i < 13; i++) {
    lines.push(serializeNumber(save.inventory.consumables[i] || 0));
    lines.push(serializeNumber(save.inventory.keyItems[i] || 0));
    lines.push(serializeNumber(save.inventory.weapons[i] || 0));
    lines.push(serializeNumber(save.inventory.armors[i] || 0));
  }

  lines.push(serializeNumber(save.battle.tension));
  lines.push(serializeNumber(save.battle.maxTension));

  const lw = save.lightWorld;
  lines.push(serializeNumber(lw.weapon));
  lines.push(serializeNumber(lw.armor));
  lines.push(serializeNumber(lw.experience));
  lines.push(serializeNumber(lw.level));
  lines.push(serializeNumber(lw.money));
  lines.push(serializeNumber(lw.health));
  lines.push(serializeNumber(lw.maxHealth));
  lines.push(serializeNumber(lw.attack));
  lines.push(serializeNumber(lw.defence));
  lines.push(serializeNumber(lw.weaponStrength));
  lines.push(serializeNumber(lw.armorDefence));
  for (let i = 0; i < 8; i++) {
    lines.push(serializeNumber(lw.items[i] || 0));
    lines.push(serializeNumber(lw.phone[i] || 0));
  }

  for (const f of save.flags) lines.push(serializeNumber(Number(f) || 0));
  lines.push(serializeNumber(save.plot));
  lines.push(serializeNumber(save.room));
  lines.push(serializeNumber(save.time));

  return lines.map((line, idx) => idx <= 6 ? line : line + ' ').join('\n');
}

function serializeSaveV2(save) {
  const lines = [];
  lines.push(save.playerName);
  lines.push(save.vesselName);
  for (let i = 0; i < 5; i++) lines.push('');
  lines.push(serializeNumber(save.party[0]));
  lines.push(serializeNumber(save.party[1]));
  lines.push(serializeNumber(save.party[2]));
  lines.push(serializeNumber(save.money));
  lines.push(serializeNumber(save.xp));
  lines.push(serializeNumber(save.lv));
  lines.push(serializeNumber(save.inv));
  lines.push(serializeNumber(save.invc));
  lines.push(serializeNumber(save.inDarkWorld ? 1 : 0));

  for (const ch of save.characters) {
    lines.push(serializeNumber(ch.health));
    lines.push(serializeNumber(ch.maxHealth));
    lines.push(serializeNumber(ch.attack));
    lines.push(serializeNumber(ch.defence));
    lines.push(serializeNumber(ch.magic));
    lines.push(serializeNumber(ch.guts));
    lines.push(serializeNumber(ch.weapon));
    lines.push(serializeNumber(ch.primaryArmor));
    lines.push(serializeNumber(ch.secondaryArmor));
    lines.push(serializeNumber(ch.weaponStyle));
    for (const ws of ch.weaponStats) {
      lines.push(serializeNumber(ws.attack));
      lines.push(serializeNumber(ws.defence));
      lines.push(serializeNumber(ws.magic));
      lines.push(serializeNumber(ws.bolts));
      lines.push(serializeNumber(ws.grazeAmount));
      lines.push(serializeNumber(ws.grazeSize));
      lines.push(serializeNumber(ws.boltSpeed));
      lines.push(serializeNumber(ws.special));
      lines.push(serializeNumber(ws.element));
      lines.push(serializeNumber(ws.elementAmount));
    }
    for (const sp of ch.spells) lines.push(serializeNumber(sp));
  }

  lines.push(serializeNumber(save.battle.boltSpeed));
  lines.push(serializeNumber(save.battle.grazeAmount));
  lines.push(serializeNumber(save.battle.grazeSize));

  for (let i = 0; i < 13; i++) {
    lines.push(serializeNumber(save.inventory.consumables[i] || 0));
    lines.push(serializeNumber(save.inventory.keyItems[i] || 0));
  }
  for (let i = 0; i < 48; i++) {
    lines.push(serializeNumber(save.inventory.weapons[i] || 0));
    lines.push(serializeNumber(save.inventory.armors[i] || 0));
  }
  for (let i = 0; i < 72; i++) {
    lines.push(serializeNumber(save.inventory.storage[i] || 0));
  }

  lines.push(serializeNumber(save.battle.tension));
  lines.push(serializeNumber(save.battle.maxTension));

  const lw = save.lightWorld;
  lines.push(serializeNumber(lw.weapon));
  lines.push(serializeNumber(lw.armor));
  lines.push(serializeNumber(lw.experience));
  lines.push(serializeNumber(lw.level));
  lines.push(serializeNumber(lw.money));
  lines.push(serializeNumber(lw.health));
  lines.push(serializeNumber(lw.maxHealth));
  lines.push(serializeNumber(lw.attack));
  lines.push(serializeNumber(lw.defence));
  lines.push(serializeNumber(lw.weaponStrength));
  lines.push(serializeNumber(lw.armorDefence));
  for (let i = 0; i < 8; i++) {
    lines.push(serializeNumber(lw.items[i] || 0));
    lines.push(serializeNumber(lw.phone[i] || 0));
  }

  for (const f of save.flags) lines.push(serializeNumber(Number(f) || 0));
  lines.push(serializeNumber(save.plot));
  lines.push(serializeNumber(save.room));
  lines.push(serializeNumber(save.time));

  return lines.map((line, idx) => idx <= 6 ? line : line + ' ').join('\n');
}

export function serializeSave(save) {
  if (save.format === 1) return serializeSaveV1(save);
  if (save.format === 2) return serializeSaveV2(save);
  throw new Error('Unsupported save format');
}
