/**
 * Deltarune 存档解析器
 * 参考 tenna-editor 的 save-parser.ts
 */
import { LineCursor } from './line-cursor.js';
import { SAVE_META } from './data.js';

export class ParseError extends Error {
  constructor(message, line, details) {
    super(message);
    this.name = 'ParseError';
    this.line = line;
    this.details = details;
  }
}

function detectSaveFormat(count) {
  if (count >= SAVE_META.V1.MIN_TOTAL_LINES && count <= SAVE_META.V1.MAX_TOTAL_LINES) return 1;
  if (count >= SAVE_META.V2.MIN_TOTAL_LINES && count <= SAVE_META.V2.MAX_TOTAL_LINES) return 2;
  return null;
}

function readFlags(cursor, minFlagCount) {
  const flagCount = cursor.totalLines - cursor.currentPosition - 3;
  if (flagCount < minFlagCount) {
    throw new ParseError(`Invalid save format (${flagCount} flags, expected at least ${minFlagCount})`, cursor.currentPosition + 1);
  }
  const flags = [];
  for (let i = 0; i < flagCount; i++) flags.push(cursor.nextNumber());
  return flags;
}

function parseCharacters(cursor, count, v2) {
  const characters = [];
  for (let i = 0; i < count; i++) {
    const ch = {
      health: cursor.nextNumber(),
      maxHealth: cursor.nextNumber(),
      attack: cursor.nextNumber(),
      defence: cursor.nextNumber(),
      magic: cursor.nextNumber(),
      guts: cursor.nextNumber(),
      weapon: cursor.nextNumber(),
      primaryArmor: cursor.nextNumber(),
      secondaryArmor: cursor.nextNumber(),
      weaponStyle: v2 ? cursor.nextNumber() : (function() {
        let ws = cursor.nextString();
        if (ws.trim() === 'nan') ws = 'Normal';
        return ws;
      })(),
      weaponStats: [],
      spells: [],
    };
    const wsCount = 4;
    for (let j = 0; j < wsCount; j++) {
      const ws = {
        attack: cursor.nextNumber(), defence: cursor.nextNumber(),
        magic: cursor.nextNumber(), bolts: cursor.nextNumber(),
        grazeAmount: cursor.nextNumber(), grazeSize: cursor.nextNumber(),
        boltSpeed: cursor.nextNumber(), special: cursor.nextNumber(),
      };
      if (v2) { ws.element = cursor.nextNumber(); ws.elementAmount = cursor.nextNumber(); }
      ch.weaponStats.push(ws);
    }
    for (let k = 0; k < 12; k++) ch.spells.push(cursor.nextNumber());
    characters.push(ch);
  }
  return characters;
}

function parseSaveV1(cursor) {
  const playerName = cursor.nextString();
  const vesselName = cursor.nextString();
  cursor.skip(5);
  const party = [cursor.nextNumber(), cursor.nextNumber(), cursor.nextNumber()];
  const money = cursor.nextNumber();
  const xp = cursor.nextNumber(), lv = cursor.nextNumber();
  const inv = cursor.nextNumber(), invc = cursor.nextNumber();
  const inDarkWorld = !!cursor.nextNumber();
  const characters = parseCharacters(cursor, 4, false);

  const boltSpeed = cursor.nextNumber();
  const grazeAmount = cursor.nextNumber();
  const grazeSize = cursor.nextNumber();

  const inventory = { consumables: [], keyItems: [], weapons: [], armors: [] };
  for (let i = 0; i < 13; i++) {
    inventory.consumables.push(cursor.nextNumber());
    inventory.keyItems.push(cursor.nextNumber());
    inventory.weapons.push(cursor.nextNumber());
    inventory.armors.push(cursor.nextNumber());
  }

  const tension = cursor.nextNumber(), maxTension = cursor.nextNumber();

  const lightWorld = {
    weapon: cursor.nextNumber(), armor: cursor.nextNumber(),
    experience: cursor.nextNumber(), level: cursor.nextNumber(),
    money: cursor.nextNumber(), health: cursor.nextNumber(),
    maxHealth: cursor.nextNumber(), attack: cursor.nextNumber(),
    defence: cursor.nextNumber(), weaponStrength: cursor.nextNumber(),
    armorDefence: cursor.nextNumber(), items: [], phone: [],
  };
  for (let i = 0; i < 8; i++) {
    lightWorld.items.push(cursor.nextNumber());
    lightWorld.phone.push(cursor.nextNumber());
  }

  const flags = readFlags(cursor, SAVE_META.V1.MIN_FLAG_COUNT);
  const plot = cursor.nextNumber();
  const room = cursor.nextNumber();
  const time = cursor.nextNumber();

  return {
    format: 1, chapter: 0,
    playerName, vesselName, party, money, xp, lv, inv, invc, inDarkWorld,
    characters,
    battle: { boltSpeed, grazeAmount, grazeSize, tension, maxTension },
    inventory, lightWorld, flags, plot, room, time,
  };
}

function parseSaveV2(cursor) {
  const playerName = cursor.nextString();
  const vesselName = cursor.nextString();
  cursor.skip(5);
  const party = [cursor.nextNumber(), cursor.nextNumber(), cursor.nextNumber()];
  const money = cursor.nextNumber();
  const xp = cursor.nextNumber(), lv = cursor.nextNumber();
  const inv = cursor.nextNumber(), invc = cursor.nextNumber();
  const inDarkWorld = !!cursor.nextNumber();
  const characters = parseCharacters(cursor, 5, true);

  const boltSpeed = cursor.nextNumber();
  const grazeAmount = cursor.nextNumber();
  const grazeSize = cursor.nextNumber();

  const inventory = { consumables: [], keyItems: [], weapons: [], armors: [], storage: [] };
  for (let i = 0; i < 13; i++) {
    inventory.consumables.push(cursor.nextNumber());
    inventory.keyItems.push(cursor.nextNumber());
  }
  for (let i = 0; i < 48; i++) {
    inventory.weapons.push(cursor.nextNumber());
    inventory.armors.push(cursor.nextNumber());
  }
  for (let i = 0; i < 72; i++) {
    inventory.storage.push(cursor.nextNumber());
  }

  const tension = cursor.nextNumber(), maxTension = cursor.nextNumber();

  const lightWorld = {
    weapon: cursor.nextNumber(), armor: cursor.nextNumber(),
    experience: cursor.nextNumber(), level: cursor.nextNumber(),
    money: cursor.nextNumber(), health: cursor.nextNumber(),
    maxHealth: cursor.nextNumber(), attack: cursor.nextNumber(),
    defence: cursor.nextNumber(), weaponStrength: cursor.nextNumber(),
    armorDefence: cursor.nextNumber(), items: [], phone: [],
  };
  for (let i = 0; i < 8; i++) {
    lightWorld.items.push(cursor.nextNumber());
    lightWorld.phone.push(cursor.nextNumber());
  }

  const flags = readFlags(cursor, SAVE_META.V2.MIN_FLAG_COUNT);
  const plot = cursor.nextNumber();
  const room = cursor.nextNumber();
  const time = cursor.nextNumber();

  return {
    format: 2, chapter: 0,
    playerName, vesselName, party, money, xp, lv, inv, invc, inDarkWorld,
    characters,
    battle: { boltSpeed, grazeAmount, grazeSize, tension, maxTension },
    inventory, lightWorld, flags, plot, room, time,
  };
}

export function parseSave(content) {
  const cursor = new LineCursor(content);
  const format = detectSaveFormat(cursor.totalLines);
  if (format === 1) return parseSaveV1(cursor);
  if (format === 2) return parseSaveV2(cursor);
  throw new ParseError(
    `Unrecognized save format (${cursor.totalLines} lines)`,
    undefined,
    `Expected ${SAVE_META.V1.MIN_TOTAL_LINES}-${SAVE_META.V1.MAX_TOTAL_LINES} lines for Ch1 or ${SAVE_META.V2.MIN_TOTAL_LINES}-${SAVE_META.V2.MAX_TOTAL_LINES} lines for Ch2+`
  );
}
