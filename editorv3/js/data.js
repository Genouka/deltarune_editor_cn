/**
 * Deltarune 存档数据定义
 * 由 sync-data.js 从 tenna-editor 自动生成
 * 请勿手动修改 - 修改请更新 tenna-editor 源码后重新运行同步
 */

// === 章节 ===
export const CHAPTERS = {
  CH1: 1,
  CH2: 2,
  CH3: 3,
  CH4: 4,
  CH5: 5,
};

export const CHAPTERS_META = {
  [1]: { displayName: 'Chapter 1 - The Beginning' },
  [2]: { displayName: "Chapter 2 - A Cyber's World" },
  [3]: { displayName: 'Chapter 3 - Late Night' },
  [4]: { displayName: 'Chapter 4 - Prophecy' },
  [5]: { displayName: 'Chapter 5 - Festival Day' },
};

// === 角色 ===
export const CHARACTERS = {
  EMPTY: 0,
  KRIS: 1,
  SUSIE: 2,
  RALSEI: 3,
  NOELLE: 4,
};
export const CHARACTERS_META = {
  [CHARACTERS.EMPTY]: { displayName: 'Empty', title: 'Empty', titleDesc: 'This is empty slot', allowedSlots: [1, 2] },
  [CHARACTERS.KRIS]: { displayName: 'Kris', title: 'Hero', titleDesc: 'Body contains a human SOUL', color: '#89b4fa', allowedSlots: [0] },
  [CHARACTERS.SUSIE]: { displayName: 'Susie', title: 'Mean Girl', titleDesc: "Won't do anything but fight", color: '#f38ba8', allowedSlots: [1, 2] },
  [CHARACTERS.RALSEI]: { displayName: 'Ralsei', title: 'Lonely Prince', titleDesc: 'Dark-World being. Has no subjects', color: '#a6e3a1', allowedSlots: [1, 2] },
  [CHARACTERS.NOELLE]: { displayName: 'Noelle', title: 'Snowcaster', titleDesc: 'Might be able to use some cool moves', color: '#f9e2af', allowedSlots: [1, 2] },
};

// === 章节可用角色 ===
export const CHAPTERS_CHARACTERS = {
  [1]: [CHARACTERS.EMPTY, CHARACTERS.KRIS, CHARACTERS.SUSIE, CHARACTERS.RALSEI],
  [2]: [CHARACTERS.EMPTY, CHARACTERS.KRIS, CHARACTERS.SUSIE, CHARACTERS.RALSEI, CHARACTERS.NOELLE],
  [3]: [CHARACTERS.EMPTY, CHARACTERS.KRIS, CHARACTERS.SUSIE, CHARACTERS.RALSEI, CHARACTERS.NOELLE],
  [4]: [CHARACTERS.EMPTY, CHARACTERS.KRIS, CHARACTERS.SUSIE, CHARACTERS.RALSEI, CHARACTERS.NOELLE],
  [5]: [CHARACTERS.EMPTY, CHARACTERS.KRIS, CHARACTERS.SUSIE, CHARACTERS.RALSEI, CHARACTERS.NOELLE],
};

// === 消耗品 ===
export const CONSUMABLES = {
  EMPTY: 0,
  DARK_CANDY: 1,
  REVIVEMINT: 2,
  GLOWSHARD: 3,
  MANUAL: 4,
  BROKENCAKE: 5,
  TOPCAKE: 6,
  SPINCAKE: 7,
  DARKBURGER: 8,
  LANCERCOOKIE: 9,
  GIGASALAD: 10,
  CLUBSSANDWICH: 11,
  HEARTSDONUT: 12,
  CHOCODIAMOND: 13,
  FAVSANDWICH: 14,
  ROUXLSROUX: 15,
  CD_BAGEL: 16,
  MANNEQUIN: 17,
  KRIS_TEA: 18,
  NOELLE_TEA: 19,
  RALSEI_TEA: 20,
  SUSIE_TEA: 21,
  DD_BURGER: 22,
  LIGHTCANDY: 23,
  BUTLERJUICE: 24,
  SPAGHETTICODE: 25,
  JAVACOOKIE: 26,
  TENSIONBIT: 27,
  TENSIONGEM: 28,
  TENSIONMAX: 29,
  REVIVEDUST: 30,
  REVIVEBRITE: 31,
  S_POISON: 32,
  DOGDOLLAR: 33,
  TVDINNER: 34,
  PIPIS: 35,
  FLATSODA: 36,
  TVSLOP: 37,
  EXECBUFFET: 38,
  DELUXEDINNER: 39,
  ANCIENTSWEET: 60,
  RHAPSOTEA: 61,
  SCARLIXIR: 62,
  BITTERTEAR: 63,
  PUNCH_BOWL: 40,
  FLAVIGNE: 41,
  GREEN_TEA: 42,
  ORANGE_JUICE: 43,
  SCHADENBROT: 64,
  TREE_CAKE: 65,
  S_POTION: 66,
  RAW_MOON: 67,
  PHANTA: 68,
  FLOWERY_SODA: 69,
  SHIKA_COLA: 70,
};

export const CONSUMABLES_META = {
  [0]: { displayName: 'Empty', weapon: true, armor: true },
  [1]: { displayName: 'Dark Candy' },
  [2]: { displayName: 'ReviveMint', weapon: true },
  [3]: { displayName: 'Glowshard' },
  [4]: { displayName: 'Manual' },
  [5]: { displayName: 'BrokenCake' },
  [6]: { displayName: 'TopCake', weapon: true },
  [7]: { displayName: 'SpinCake', weapon: true },
  [8]: { displayName: 'Darkburger' },
  [9]: { displayName: 'LancerCookie' },
  [10]: { displayName: 'GigaSalad' },
  [11]: { displayName: 'ClubsSandwich' },
  [12]: { displayName: 'HeartsDonut', weapon: true },
  [13]: { displayName: 'ChocoDiamond', weapon: true },
  [14]: { displayName: 'FavSandwich', armor: true },
  [15]: { displayName: 'RouxlsRoux', weapon: true },
  [16]: { displayName: 'CD Bagel', weapon: true },
  [17]: { displayName: 'Mannequin', weapon: true },
  [18]: {
    displayName: 'Kris Tea', weapon: true,
    getOverrides: ({ chapter }) => {
      if (chapter > 2) {
        return {
          displayName: 'Rotten Tea (Kris)',
          description: `A tea that has deteriorated after a short while due to its poor craftsmanship. +10HP

          This item used to be "Kris Tea" before reaching Chapter 3.
          `,
        };
      }

      return {};
    },
  },
  [19]: {
    displayName: 'Noelle Tea',
    getOverrides: ({ chapter }) => {
      if (chapter > 2) {
        return {
          displayName: 'Rotten Tea (Noelle)',
          description: `A tea that has deteriorated after a short while due to its poor craftsmanship. +10HP

          This item used to be "Noelle Tea" before reaching Chapter 3.
          `,
        };
      }

      return {};
    },
  },
  [20]: {
    displayName: 'Ralsei Tea',
    getOverrides: ({ chapter }) => {
      if (chapter > 2) {
        return {
          displayName: 'Rotten Tea (Ralsei)',
          description: `A tea that has deteriorated after a short while due to its poor craftsmanship. +10HP

          This item used to be "Ralsei Tea" before reaching Chapter 3.
          `,
        };
      }

      return {};
    },
  },
  [21]: {
    displayName: 'Susie Tea',
    getOverrides: ({ chapter }) => {
      if (chapter > 2) {
        return {
          displayName: 'Rotten Tea (Susie)',
          description: `A tea that has deteriorated after a short while due to its poor craftsmanship. +10HP

          This item used to be "Susie Tea" before reaching Chapter 3.
          `,
        };
      }

      return {};
    },
  },
  [22]: { displayName: 'DD-Burger', weapon: true },
  [23]: { displayName: 'LightCandy' },
  [24]: { displayName: 'ButlerJuice' },
  [25]: { displayName: 'SpaghettiCode' },
  [26]: { displayName: 'JavaCookie' },
  [27]: { displayName: 'TensionBit' },
  [28]: { displayName: 'TensionGem' },
  [29]: { displayName: 'TensionMax' },
  [30]: { displayName: 'ReviveDust' },
  [31]: { displayName: 'ReviveBrite' },
  [32]: { displayName: 'S. POISON' },
  [33]: { displayName: 'DogDollar' },
  [34]: { displayName: 'TVDinner' },
  [35]: { displayName: 'Pipis' },
  [36]: { displayName: 'FlatSoda' },
  [37]: { displayName: 'TVSlop' },
  [38]: { displayName: 'ExecBuffet' },
  [39]: { displayName: 'DeluxeDinner' },
  [60]: { displayName: 'AncientSweet' },
  [61]: { displayName: 'Rhapsotea' },
  [62]: { displayName: 'Scarlixir' },
  [63]: { displayName: 'BitterTear' },
  [40]: { displayName: 'PunchBowl' },
  [41]: { displayName: 'Flavigne' },
  [42]: { displayName: 'GreenTea' },
  [43]: { displayName: 'OrangeJuice' },
  [64]: { displayName: 'Schadenbrot' },
  [65]: { displayName: 'TreeCake' },
  [66]: { displayName: 'S. POTION' },
  [67]: { displayName: 'Raw Moon' },
  [68]: { displayName: 'Phanta' },
  [69]: { displayName: 'FlowerySoda' },
  [70]: { displayName: 'Shikacola' },
};

// === 武器 ===
export const WEAPONS = {
  EMPTY: 0,
  WOOD_BLADE: 1,
  MANE_AX: 2,
  RED_SCARF: 3,
  EVERYBODY_WEAPON: 4,
  SPOOKYSWORD: 5,
  BRAVE_AX: 6,
  DEVILSKNIFE: 7,
  TREFOIL: 8,
  RAGGER: 9,
  DAINTY_SCARF: 10,
  TWISTED_SWD: 11,
  SNOW_RING: 12,
  THORN_RING: 13,
  BOUNCE_BLADE: 14,
  CHEER_SCARF: 15,
  MECHA_SABER: 16,
  AUTO_AXE: 17,
  FIBER_SCARF: 18,
  RAGGER2: 19,
  BROKEN_SWD: 20,
  PUPPET_SCARF: 21,
  FREEZE_RING: 22,
  SABER10: 23,
  TOXIC_AXE: 24,
  FLEX_SCARF: 25,
  BLACK_SHARD: 26,
  JINGLE_BLADE: 50,
  SCARF_MARK: 51,
  JUSTICE_AXE: 52,
  WINGLADE: 53,
  ABSORB_AX: 54,
  WOOD_BLADE_2: 30,
  THATCHET: 31,
  BLUE_SHOES: 32,
  AQUA_KNIFE: 33,
  FLOWERY_SCARF: 34,
  BROKEN_SCARF: 35,
  GILDED_ROSE: 36,
  MISTLE_WP: 37,
};

export const WEAPONS_META = {
  [0]: { displayName: 'Empty' },
  [1]: { displayName: 'Wood Blade' },
  [2]: { displayName: 'Mane Ax' },
  [3]: { displayName: 'Red Scarf' },
  [4]: { displayName: 'EverybodyWeapon' },
  [5]: { displayName: 'Spookysword' },
  [6]: { displayName: 'Brave Ax' },
  [7]: { displayName: 'Devilsknife' },
  [8]: { displayName: 'Trefoil' },
  [9]: { displayName: 'Ragger' },
  [10]: { displayName: 'DaintyScarf' },
  [11]: { displayName: 'TwistedSwd' },
  [12]: { displayName: 'SnowRing' },
  [13]: { displayName: 'ThornRing' },
  [14]: { displayName: 'BounceBlade' },
  [15]: { displayName: 'CheerScarf' },
  [16]: { displayName: 'MechaSaber' },
  [17]: { displayName: 'AutoAxe' },
  [18]: { displayName: 'FiberScarf' },
  [19]: { displayName: 'Ragger2' },
  [20]: { displayName: 'BrokenSwd' },
  [21]: { displayName: 'PuppetScarf' },
  [22]: { displayName: 'FreezeRing' },
  [23]: { displayName: 'Saber10' },
  [24]: { displayName: 'ToxicAxe' },
  [25]: { displayName: 'FlexScarf' },
  [26]: { displayName: 'BlackShard' },
  [50]: { displayName: 'JingleBlade' },
  [51]: { displayName: 'ScarfMark' },
  [52]: { displayName: 'JusticeAxe' },
  [53]: { displayName: 'Winglade' },
  [54]: { displayName: 'AbsorbAx' },
  [30]: { displayName: 'WoodBlade2' },
  [31]: { displayName: 'Thatchet' },
  [32]: { displayName: 'BlueShoes' },
  [33]: { displayName: 'AquaKnife' },
  [34]: { displayName: 'FloweryScarf' },
  [35]: { displayName: 'BrokenScarf' },
  [36]: { displayName: 'GildedRose' },
  [37]: { displayName: 'MistleWP' },
};

// === 护甲 ===
export const ARMORS = {
  EMPTY: 0,
  AMBER_CARD: 1,
  DICE_BRACE: 2,
  PINK_RIBBON: 3,
  WHITE_RIBBON: 4,
  IRON_SHACKLE: 5,
  MOUSE_TOKEN: 6,
  JEVILSTAIL: 7,
  SILVER_CARD: 8,
  TWIN_RIBBON: 9,
  GLOW_WRIST: 10,
  CHAIN_MAIL: 11,
  B_SHOT_BOWTIE: 12,
  SPIKE_BAND: 13,
  SILVER_WATCH: 14,
  TENSION_BOW: 15,
  MANNEQUIN: 16,
  DARK_GOLD_BAND: 17,
  SKY_MANTLE: 18,
  SPIKE_SHACKLE: 19,
  FRAYED_BOWTIE: 20,
  DEALMAKER: 21,
  ROYAL_PIN: 22,
  SHADOW_MANTLE: 23,
  LODE_STONE: 24,
  GINGER_GUARD: 25,
  BLUE_RIBBON: 26,
  TENNA_TIE: 27,
  WAFERGUARD: 50,
  MYSTIC_BAND: 51,
  POWER_BAND: 52,
  PRINCESS_RBN: 53,
  GOLD_WIDOW: 54,
  MONARCH_RBN: 30,
  TRUE_TIE: 31,
  DOG_WIDOW: 32,
  RED_RIBBON: 33,
  NETSKIE_HAT: 34,
  SETH_SPECS: 35,
  YELLOW_HAT: 36,
  O_GLOVE: 37,
  GREEN_APRON: 38,
};

export const ARMORS_META = {
  [0]: { displayName: 'Empty' },
  [1]: { displayName: 'Amber Card' },
  [2]: { displayName: 'Dice Brace' },
  [3]: { displayName: 'Pink Ribbon' },
  [4]: { displayName: 'White Ribbon' },
  [5]: { displayName: 'Iron Shackle' },
  [6]: { displayName: 'MouseToken' },
  [7]: { displayName: 'Jevilstail' },
  [8]: { displayName: 'Silver Card' },
  [9]: { displayName: 'TwinRibbon' },
  [10]: { displayName: 'GlowWrist' },
  [11]: { displayName: 'ChainMail' },
  [12]: { displayName: 'B.ShotBowtie' },
  [13]: { displayName: 'SpikeBand' },
  [14]: { displayName: 'Silver Watch' },
  [15]: { displayName: 'TensionBow' },
  [16]: { displayName: 'Mannequin' },
  [17]: { displayName: 'DarkGoldBand' },
  [18]: { displayName: 'SkyMantle' },
  [19]: { displayName: 'SpikeShackle' },
  [20]: { displayName: 'FrayedBowtie' },
  [21]: { displayName: 'Dealmaker' },
  [22]: { displayName: 'RoyalPin' },
  [23]: { displayName: 'ShadowMantle' },
  [24]: { displayName: 'LodeStone' },
  [25]: { displayName: 'GingerGuard' },
  [26]: { displayName: 'BlueRibbon' },
  [27]: { displayName: 'TennaTie' },
  [50]: { displayName: 'Waferguard' },
  [51]: { displayName: 'MysticBand' },
  [52]: { displayName: 'PowerBand' },
  [53]: { displayName: 'PrincessRBN' },
  [54]: { displayName: 'GoldWidow' },
  [30]: { displayName: 'MonarchRBN' },
  [31]: { displayName: 'TrueTie' },
  [32]: { displayName: 'DogWidow' },
  [33]: { displayName: 'RedRibbon' },
  [34]: { displayName: 'NetskieHat' },
  [35]: { displayName: 'SethSpecs' },
  [36]: { displayName: 'YellowHat' },
  [37]: { displayName: 'O.Glove' },
  [38]: { displayName: 'GreenApron' },
};

// === 关键物品 ===
export const KEYITEMS = {
  EMPTY: 0,
  CELL_PHONE: 1,
  EGG: 2,
  BROKEN_CAKE: 3,
  BROKEN_KEY_A: 4,
  DOOR_KEY: 5,
  BROKEN_KEY_B: 6,
  BROKEN_KEY_C: 7,
  LANCER: 8,
  ROUXLS_KAARD: 9,
  EMPTY_DISK: 10,
  LOADED_DISK: 11,
  KEYGEN: 12,
  SHADOW_CRYSTAL: 13,
  STARWALKER: 14,
  PURE_CRYSTAL: 15,
  ODD_CONTROLLER: 16,
  BACKSTAGE_PASS: 17,
  TRIP_TICKET: 18,
  LANCER_CON: 19,
  SHEET_MUSIC: 30,
  CLAIMB_CLAWS: 31,
  SCISSORS: 20,
  YELLOW_SHRED: 21,
  BOOT_OIL: 22,
  RED_SPLATTER: 23,
  BROMIDE_R: 24,
  PETAL_FEATHER: 25,
  PERP_BOOK: 26,
  BLUE_STRING: 27,
  TRAIN_PLAN: 28,
  YELLOW_KEY: 29,
  MYSTERY_KEY: 32,
  BROMIDE_F: 33,
};

export const KEYITEMS_META = {
  [0]: { displayName: 'Empty' },
  [1]: { displayName: 'Cell Phone' },
  [2]: { displayName: 'Egg' },
  [3]: { displayName: 'BrokenCake' },
  [4]: { displayName: 'Broken Key A' },
  [5]: { displayName: 'Door Key' },
  [6]: { displayName: 'Broken Key B' },
  [7]: { displayName: 'Broken Key C' },
  [8]: { displayName: 'Lancer' },
  [9]: { displayName: 'Rouxls Kaard' },
  [10]: { displayName: 'EmptyDisk' },
  [11]: { displayName: 'LoadedDisk' },
  [12]: { displayName: 'KeyGen' },
  [13]: { displayName: 'ShadowCrystal' },
  [14]: { displayName: 'Starwalker' },
  [15]: { displayName: 'PureCrystal' },
  [16]: { displayName: 'OddController' },
  [17]: { displayName: 'BackstagePass' },
  [18]: { displayName: 'TripTicket' },
  [19]: { displayName: 'LancerCon' },
  [30]: { displayName: 'SheetMusic' },
  [31]: { displayName: 'ClaimbClaws' },
  [20]: { displayName: 'Scissors' },
  [21]: { displayName: 'YellowShred' },
  [22]: { displayName: 'BootOil' },
  [23]: { displayName: 'RedSplatter' },
  [24]: { displayName: 'BromideR' },
  [25]: { displayName: 'PetalFeather' },
  [26]: { displayName: 'PerpBook' },
  [27]: { displayName: 'BlueString' },
  [28]: { displayName: 'TrainPlan' },
  [29]: { displayName: 'YellowKey' },
  [32]: { displayName: 'MysteryKey' },
  [33]: { displayName: 'BromideF' },
};

// === 法术 ===
export const SPELLS = {
  EMPTY: 0,
  RUDE_SWORD: 1,
  HEAL_PRAYER: 2,
  PACIFY: 3,
  RUDE_BUSTER: 4,
  RED_BUSTER: 5,
  DUAL_HEAL: 6,
  ACT: 7,
  SLEEPMIST: 8,
  ICESHOCK: 9,
  SNOWGRAVE: 10,
  SUSIE_HEAL: 11,
  REVIVE_SONG: 12,
  SCYTHEMARE: 13,
};

export const SPELLS_META = {
  [0]: {
    displayName: 'Empty',
  },
  [1]: {
    displayName: 'Rude Sword', unused: true,
    unused: true,
  },
  [2]: {
    displayName: 'Heal Prayer',
  },
  [3]: {
    displayName: 'Pacify',
  },
  [4]: {
    displayName: 'Rude Buster',
  },
  [5]: {
    displayName: 'Red Buster',
  },
  [6]: {
    displayName: 'Dual Heal',
  },
  [7]: {
    displayName: 'ACT',
  },
  [8]: {
    displayName: 'Sleep Mist',
  },
  [9]: {
    displayName: 'IceShock',
  },
  [10]: {
    displayName: 'SnowGrave',
  },
  [11]: {
    displayName: 'UltimatHeal',
    getOverrides: ({ chapter, plot, flags }) => {
      if (
        chapter >= 4 &&
        (Number(flags[FLAGS.SUSIE_LEARNED_BETTER_HEAL]) ||
          Number(flags[FLAGS.DEFEATED_HAMMER_OF_JUSTICE]))
      ) {
        return { displayName: 'BetterHeal' };
      }

      if (
        chapter === 4 &&
        plot >= 110 &&
        Number(flags[FLAGS.JACKENSTEIN_CUTSCENE_PROGRESS]) < 6
      ) {
        return { displayName: 'Heal' };
      }

      if (chapter >= 4) {
        return { displayName: 'OKHeal' };
      }

      if (chapter >= 3) {
        return { displayName: 'UltraHeal' };
      }

      return {};
    },
  },
  [12]: {
    displayName: 'ReviveSong',
  },
  [13]: {
    displayName: 'Scythemare',
  },
};

// === 光世界物品 ===
export const LIGHTWORLDITEMS = {
  EMPTY: 0,
  HOT_CHOCOLATE: 1,
  PENCIL: 2,
  BANDAGE: 3,
  BOUQUET: 4,
  BALL_OF_JUNK: 5,
  HALLOWEEN_PENCIL: 6,
  LUCKY_PENCIL: 7,
  EGG: 8,
  CARDS: 9,
  BOX_OF_HEART_CANDY: 10,
  GLASS: 11,
  ERASER: 12,
  MECH_PENCIL: 13,
  WRISTWATCH: 14,
  HOLIDAY_PENCIL: 15,
  CACTUSNEEDLE: 16,
  BLACKSHARD: 17,
  QUILLPEN: 18,
  HONEY_TOAST: 19,
  BREAD: 20,
  SEEDS: 21,
  PENCIL2: 22,
  PETAL: 23,
};

export const LIGHTWORLDITEMS_META = {
  [0]: { displayName: 'Empty', weapon: true, armor: true },
  [1]: { displayName: 'Hot Chocolate' },
  [2]: { displayName: 'Pencil', weapon: true },
  [3]: { displayName: 'Bandage', armor: true },
  [4]: { displayName: 'Bouquet' },
  [5]: { displayName: 'Ball of Junk' },
  [6]: {
    displayName: 'Halloween Pencil',
    weapon: true,
  },
  [7]: { displayName: 'Lucky Pencil', weapon: true },
  [8]: { displayName: 'Egg' },
  [9]: { displayName: 'Cards' },
  [10]: { displayName: 'Box of Heart Candy' },
  [11]: { displayName: 'Glass' },
  [12]: { displayName: 'Eraser', weapon: true },
  [13]: { displayName: 'Mech. Pencil', weapon: true },
  [14]: { displayName: 'Wristwatch', armor: true },
  [15]: {
    displayName: 'Holiday Pencil',
    weapon: true,
  },
  [16]: { displayName: 'CactusNeedle', weapon: true },
  [17]: { displayName: 'BlackShard', weapon: true },
  [18]: { displayName: 'QuillPen', weapon: true },
  [19]: { displayName: 'Honey Toast' },
  [20]: { displayName: 'Bread' },
  [21]: { displayName: 'Seeds' },
  [22]: { displayName: 'Pencil2', weapon: true },
  [23]: { displayName: 'Petal' },
};

// === 手机联系人 ===
export const PHONECONTACTS = {
  EMPTY: 0,
  CALL_HOME: 201,
  SANS: 202,
};

export const PHONECONTACTS_META = {
  [0]: { displayName: 'Empty' },
  [201]: { displayName: 'Call Home' },
  [202]: { displayName: "Sans's Number" },
};

// === 存档格式元数据 ===
export const SAVE_META = {
  V1: {
    MIN_TOTAL_LINES: 10311, MAX_TOTAL_LINES: 10328,
    MIN_FLAG_COUNT: 9999, TOTAL_LINES: 10318, FLAG_COUNT: 9999,
  },
  V2: {
    MIN_TOTAL_LINES: 3046, MAX_TOTAL_LINES: 3065,
    MIN_FLAG_COUNT: 2500, TOTAL_LINES: 3055, FLAG_COUNT: 2509,
  },
};

// === 辅助函数 ===
function _label(v) { return typeof v === 'object' && v !== null ? (v.displayName || '') : String(v); }
function _meta(v) { return typeof v === 'object' && v !== null ? v : { displayName: String(v) }; }

/** 本地化映射，由 editor.js 通过 setLocaleMap 注入 */
let _localeMap = null;
export function setLocaleMap(map) { _localeMap = map; }
function _localizedLabel(idx, defaultLabel) {
  if (_localeMap && _localeMap[idx] !== undefined) return _localeMap[idx];
  return defaultLabel;
}

export function metaToOptions(meta, localeMap) {
  const lm = localeMap || _localeMap;
  const entries = Object.entries(meta).filter(([k]) => k !== '0' || meta[0] !== undefined);
  return entries.map(([value, label]) => {
    const numVal = Number(value);
    const defaultLabel = _label(label);
    const finalLabel = lm && lm[numVal] !== undefined ? lm[numVal] : defaultLabel;
    return { value: numVal, label: finalLabel, meta: _meta(label) };
  });
}

export function getNameByIndex(meta, idx, localeMap) {
  const lm = localeMap || _localeMap;
  if (meta[idx] === undefined) return `Unknown (${idx})`;
  const defaultLabel = _label(meta[idx]);
  return lm && lm[idx] !== undefined ? lm[idx] : defaultLabel;
}

export function getMetaByIndex(meta, idx) {
  if (meta[idx] === undefined) return null;
  return _meta(meta[idx]);
}
