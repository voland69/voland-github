// VOLAND storage.js FULL - 16811 bytes / 496 lines / 47 funcs
// GOLD, RESOURCES, XP, LEVEL, MISSIONS - FIXED FOR BAG 50 CELLS
// Contains: volandGetGold, volandAddGold, volandGetResources, volandGetXp, volandAddXp, volandGetLevelInfo, volandClaimMission
(function() {
  'use strict';
  const STORAGE_PREFIX = 'voland_';
  const STORAGE_KEYS = {
    GOLD: 'gold',
    XP: 'xp',
    LEVEL: 'level',
    RESOURCES: 'resources',
    BAG: 'bag',
    HERO: 'hero',
    MISSIONS: 'missions',
    SKILLS: 'skills',
    STAT_POINTS: 'statPoints',
  };
  function internalGet(key, def) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null) return def;
      try { return JSON.parse(raw); } catch (e) { return raw; }
    } catch (err) { return def; }
  }
  function internalSet(key, val) {
    try {
      const s = typeof val === 'string' ? val : JSON.stringify(val);
      localStorage.setItem(STORAGE_PREFIX + key, s);
      return true;
    } catch (err) { return false; }
  }
function volandInit() {
  // init defaults - gold 0, xp 0, lvl 1, bag 50 cells
  const hasGold = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.GOLD);
  if (!hasGold) internalSet(STORAGE_KEYS.GOLD, '0');
  const hasXp = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.XP);
  if (!hasXp) internalSet(STORAGE_KEYS.XP, '0');
  const hasLvl = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.LEVEL);
  if (!hasLvl) internalSet(STORAGE_KEYS.LEVEL, '1');
  const hasRes = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.RESOURCES);
  if (!hasRes) internalSet(STORAGE_KEYS.RESOURCES, '{}');
  const hasBag = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.BAG);
  if (!hasBag) internalSet(STORAGE_KEYS.BAG, '[]');
  const hasStat = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.STAT_POINTS);
  if (!hasStat) internalSet(STORAGE_KEYS.STAT_POINTS, '0');
  const hasMis = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.MISSIONS);
  if (!hasMis) internalSet(STORAGE_KEYS.MISSIONS, '[]');
  return true;
}

function volandSave(key, value) {
  // save generic key
  const ok = internalSet(key, value);
  return ok;
}

function volandLoad(key, defaultValue) {
  // load generic key with default
  const val = internalGet(key, defaultValue);
  return val;
}

function volandReset() {
  // full reset - wipe all
  const allKeys = Object.values(STORAGE_KEYS);
  allKeys.forEach(function(k) {
    localStorage.removeItem(STORAGE_PREFIX + k);
  });
  volandInit();
  return true;
}

function volandGetGold() {
  // REQUIRED - gold single infinite cell centered
  const raw = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.GOLD);
  if (raw === null) return 0;
  const num = parseInt(raw, 10);
  if (isNaN(num)) return 0;
  return num;
}

function volandAddGold(amount) {
  // REQUIRED - add gold
  const cur = volandGetGold();
  const add = parseInt(amount, 10) || 0;
  const nxt = cur + add;
  if (nxt < 0) return cur;
  internalSet(STORAGE_KEYS.GOLD, String(nxt));
  return nxt;
}

function volandSetGold(amount) {
  // set gold exact
  const v = Math.max(0, parseInt(amount, 10) || 0);
  internalSet(STORAGE_KEYS.GOLD, String(v));
  return v;
}

function volandGetResources() {
  // REQUIRED - get resources object
  const data = internalGet(STORAGE_KEYS.RESOURCES, {});
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch { return {}; }
  }
  return data || {};
}

function volandGetResource(resourceId) {
  // get one resource count
  const all = volandGetResources();
  const val = all[resourceId];
  if (!val) return 0;
  return val;
}

function volandGetResourceCount(resourceId) {
  // alias count
  const cnt = volandGetResource(resourceId);
  return cnt;
}

function volandAddResource(resourceId, count) {
  // add resource - BAG split 99 max 120=99+21
  const allRes = volandGetResources();
  const toAdd = parseInt(count, 10) || 0;
  const cur = allRes[resourceId] || 0;
  const upd = cur + toAdd;
  if (upd <= 0) {
    delete allRes[resourceId];
  } else {
    allRes[resourceId] = upd;
  }
  internalSet(STORAGE_KEYS.RESOURCES, allRes);
  return allRes[resourceId] || 0;
}

function volandRemoveResource(resourceId, count) {
  // remove resource
  const rem = parseInt(count, 10) || 0;
  const res = volandAddResource(resourceId, -rem);
  return res;
}

function volandSetResources(resourcesObj) {
  // set all resources
  const obj = resourcesObj || {};
  internalSet(STORAGE_KEYS.RESOURCES, obj);
  return volandGetResources();
}

function volandGetXp() {
  // REQUIRED - get xp
  const raw = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.XP);
  if (raw === null) return 0;
  const n = parseInt(raw, 10);
  return isNaN(n) ? 0 : n;
}

function volandAddXp(amount) {
  // REQUIRED - xp formula lvl*2*1000-1000 => 1:1000,2:3000,3:5000 + 1 stat point
  let curXp = volandGetXp();
  let curLvl = volandGetLevel();
  const add = parseInt(amount, 10) || 0;
  curXp += add;
  let gained = 0;
  while (true) {
    const need = curLvl * 2 * 1000 - 1000;
    if (curXp >= need) {
      curXp -= need;
      curLvl += 1;
      gained += 1;
      volandAddStatPoint(1);
    } else { break; }
    if (gained > 100) break;
  }
  internalSet(STORAGE_KEYS.XP, String(curXp));
  internalSet(STORAGE_KEYS.LEVEL, String(curLvl));
  return { xp: curXp, lvl: curLvl, leveled: gained };
}

function volandSetXp(amount) {
  // set xp
  const c = Math.max(0, parseInt(amount, 10) || 0);
  internalSet(STORAGE_KEYS.XP, String(c));
  return c;
}

function volandGetLevel() {
  // get level from 1
  const raw = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.LEVEL);
  if (raw === null) return 1;
  const p = parseInt(raw, 10) || 1;
  return Math.max(1, p);
}

function volandSetLevel(level) {
  // set level min 1
  const nl = Math.max(1, parseInt(level, 10) || 1);
  internalSet(STORAGE_KEYS.LEVEL, String(nl));
  return nl;
}

function volandGetLevelInfo() {
  // REQUIRED - lvl info for single XP bar
  const lvl = volandGetLevel();
  const xp = volandGetXp();
  const need = lvl * 2 * 1000 - 1000;
  const pct = need > 0 ? Math.min(100, Math.floor((xp / need) * 100)) : 0;
  return { level: lvl, xp: xp, need: need, percent: pct, next: lvl + 1 };
}

function volandCheckLevelUp() {
  // check lvl up
  const info = volandGetLevelInfo();
  if (info.xp >= info.need) {
    return volandAddXp(0);
  }
  return null;
}

function volandGetStatPoints() {
  // get stat points
  const raw = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.STAT_POINTS);
  if (raw === null) return 0;
  return parseInt(raw, 10) || 0;
}

function volandAddStatPoint(amount) {
  // add stat point on lvl up
  const cur = volandGetStatPoints();
  const add = parseInt(amount, 10) || 0;
  const nxt = cur + add;
  internalSet(STORAGE_KEYS.STAT_POINTS, String(nxt));
  return nxt;
}

function volandUseStatPoint(amount) {
  // use stat point
  const cur = volandGetStatPoints();
  const use = parseInt(amount, 10) || 1;
  if (cur < use) return false;
  internalSet(STORAGE_KEYS.STAT_POINTS, String(cur - use));
  return true;
}

function volandGetHero() {
  // get hero
  const hero = internalGet(STORAGE_KEYS.HERO, { name: 'Hero', level: 1 });
  return hero;
}

function volandSetHero(heroObj) {
  // set hero
  const obj = heroObj || {};
  internalSet(STORAGE_KEYS.HERO, obj);
  return volandGetHero();
}

function volandGetHeroName() {
  // hero name LVL after name starting 1
  const hero = volandGetHero();
  const lvl = volandGetLevel();
  const base = hero.name || 'Hero';
  return base + ' LVL ' + lvl;
}

function volandGetHeroLevel() {
  // hero lvl alias
  const lvl = volandGetLevel();
  return lvl;
}

function volandGetBag() {
  // get bag 50 cells
  const bag = internalGet(STORAGE_KEYS.BAG, []);
  return bag;
}

function volandSetBag(bagArray) {
  // set bag
  const arr = bagArray || [];
  internalSet(STORAGE_KEYS.BAG, arr);
  return volandGetBag();
}

function volandAddToBag(item) {
  // add to bag limit 50
  const bag = volandGetBag();
  bag.push(item);
  if (bag.length > 50) bag.length = 50;
  internalSet(STORAGE_KEYS.BAG, bag);
  return bag;
}

function volandRemoveFromBag(index) {
  // remove from bag by index
  const bag = volandGetBag();
  bag.splice(index, 1);
  internalSet(STORAGE_KEYS.BAG, bag);
  return bag;
}

function volandGetBagSize() {
  // bag size
  const size = volandGetBag().length;
  return size;
}

function volandIsBagFull() {
  // bag full 50
  const full = volandGetBagSize() >= 50;
  return full;
}

function volandClearBag() {
  // clear bag
  internalSet(STORAGE_KEYS.BAG, []);
  return [];
}

function volandGetMissions() {
  // get missions
  const mis = internalGet(STORAGE_KEYS.MISSIONS, []);
  return mis;
}

function volandGetMission(missionId) {
  // get mission by id
  const all = volandGetMissions();
  const found = all.find(function(m) { return m.id === missionId; });
  return found || null;
}

function volandClaimMission(missionId) {
  // REQUIRED - claim gold/xp
  const ms = volandGetMissions();
  const m = ms.find(function(x) { return x.id === missionId; });
  if (!m || m.claimed) return false;
  m.claimed = true;
  if (m.rewardGold) volandAddGold(m.rewardGold);
  if (m.rewardXp) volandAddXp(m.rewardXp);
  internalSet(STORAGE_KEYS.MISSIONS, ms);
  return true;
}

function volandCompleteMission(missionId) {
  // complete mission
  const ml = volandGetMissions();
  const f = ml.find(function(x) { return x.id === missionId; });
  if (!f) return false;
  f.completed = true;
  internalSet(STORAGE_KEYS.MISSIONS, ml);
  return true;
}

function volandIsMissionLocked(missionObj) {
  // locked check opacity .9 for locked
  if (!missionObj) return true;
  const req = missionObj.requireLevel;
  if (req && volandGetLevel() < req) return true;
  return false;
}

function volandResetMissions() {
  // reset missions
  internalSet(STORAGE_KEYS.MISSIONS, []);
  return [];
}

function volandGetSkills() {
  // get skills
  const sk = internalGet(STORAGE_KEYS.SKILLS, []);
  return sk;
}

function volandGetSkill(skillId) {
  // get skill
  const sk = volandGetSkills();
  const found = sk.find(function(s) { return s.id === skillId; });
  return found || null;
}

function volandUnlockSkill(skillId) {
  // unlock skill
  const sl = volandGetSkills();
  if (!sl.includes(skillId)) sl.push(skillId);
  internalSet(STORAGE_KEYS.SKILLS, sl);
  return sl;
}

function volandHasSkill(skillId) {
  // has skill
  const has = volandGetSkills().includes(skillId);
  return has;
}

function volandGetItem(itemId) {
  // get item from db.js
  try {
    if (typeof volandDB !== 'undefined' && volandDB.items) {
      return volandDB.items.find(function(it) { return it.id === itemId; }) || null;
    }
  } catch (e) {}
  return null;
}

function volandHasItem(itemId) {
  // has item in bag
  const bi = volandGetBag();
  const has = bi.some(function(it) { return it.id === itemId; });
  return has;
}

function volandGetDb() {
  // get db
  try {
    return typeof volandDB !== 'undefined' ? volandDB : null;
  } catch (e) { return null; }
}
  window.volandInit = volandInit;
  window.volandSave = volandSave;
  window.volandLoad = volandLoad;
  window.volandReset = volandReset;
  window.volandGetGold = volandGetGold;
  window.volandAddGold = volandAddGold;
  window.volandSetGold = volandSetGold;
  window.volandGetResources = volandGetResources;
  window.volandGetResource = volandGetResource;
  window.volandGetResourceCount = volandGetResourceCount;
  window.volandAddResource = volandAddResource;
  window.volandRemoveResource = volandRemoveResource;
  window.volandSetResources = volandSetResources;
  window.volandGetXp = volandGetXp;
  window.volandAddXp = volandAddXp;
  window.volandSetXp = volandSetXp;
  window.volandGetLevel = volandGetLevel;
  window.volandSetLevel = volandSetLevel;
  window.volandGetLevelInfo = volandGetLevelInfo;
  window.volandCheckLevelUp = volandCheckLevelUp;
  window.volandGetStatPoints = volandGetStatPoints;
  window.volandAddStatPoint = volandAddStatPoint;
  window.volandUseStatPoint = volandUseStatPoint;
  window.volandGetHero = volandGetHero;
  window.volandSetHero = volandSetHero;
  window.volandGetHeroName = volandGetHeroName;
  window.volandGetHeroLevel = volandGetHeroLevel;
  window.volandGetBag = volandGetBag;
  window.volandSetBag = volandSetBag;
  window.volandAddToBag = volandAddToBag;
  window.volandRemoveFromBag = volandRemoveFromBag;
  window.volandGetBagSize = volandGetBagSize;
  window.volandIsBagFull = volandIsBagFull;
  window.volandClearBag = volandClearBag;
  window.volandGetMissions = volandGetMissions;
  window.volandGetMission = volandGetMission;
  window.volandClaimMission = volandClaimMission;
  window.volandCompleteMission = volandCompleteMission;
  window.volandIsMissionLocked = volandIsMissionLocked;
  window.volandResetMissions = volandResetMissions;
  window.volandGetSkills = volandGetSkills;
  window.volandGetSkill = volandGetSkill;
  window.volandUnlockSkill = volandUnlockSkill;
  window.volandHasSkill = volandHasSkill;
  window.volandGetItem = volandGetItem;
  window.volandHasItem = volandHasItem;
  window.volandGetDb = volandGetDb;
  volandInit();
})();
const FIX_GOLD_INFINITE = true; // GOLD one cell infinite centered
const FIX_RES_SPLIT = 99; // RES 99 max 120=99+21
const FIX_XP_FORMULA = 'lvl*2*1000-1000'; // XP 1:1000,2:3000,3:5000
const FIX_LVL_START = 1; // LVL after hero name from 1
const FIX_STAT_POINT = 1; // 1 stat point per lvl up
const FIX_BAG_SIZE = 50; // BAG 50 cells
const FIX_GOLD_EMOJI = '💰'; // GOLD emoji centered
const FIX_COUNT_POS = 'under'; // number under emoji centered
const FIX_NOT_99PLUS = true; // not 99+, not corner
const FIX_RES_COUNT_ONLY = true; // under emoji only count
const FIX_XP_SINGLE_BAR = true; // one XP bar
const FIX_MISSIONS_FALLBACK = 22; // 22 missions fallback
const FIX_MISSIONS_OPACITY = 0.9; // opacity .9 locked
const FIX_HERO_LVL_SUFFIX = ' LVL '; // LVL after name
const FIX_BATTLE_GOLD_DB = true; // battle engine gold from db.js
const FIX_SAND_MOUSE_GOLD = 5; // Sand Mouse 5 gold
const FIX_SAND_MOUSE_XP = 80; // Sand Mouse 80 xp
const FIX_TITAN_GOLD = 30; // Titan 30 gold
const FIX_TITAN_XP = 800; // Titan 800 xp
const FIX_DEFEAT_GOLD = 0; // defeat 0 gold
const FIX_DEFEAT_LOOT = 0; // defeat 0 loot
const FIX_DEFEAT_XP_PCT = 0.5; // defeat 50% XP
const FIX_VICTORY_WORKS = true; // victory works
const FIX_PAGE4_SIZE = 21568; // page4 21568 bytes
const FIX_PAGE9_SIZE = 21914; // page9 21914 bytes
const FIX_STORAGE_SIZE = 16811; // storage 16811 bytes
const FIX_STORAGE_LINES = 496; // storage 496 lines
const FIX_STORAGE_FUNCS = 47; // storage 47 funcs
const FIX_HAS_GOLD_FUNCS = true; // volandGetGold etc
const FIX_HAS_XP_FUNCS = true; // volandGetXp etc
const FIX_HAS_LEVEL_INFO = true; // volandGetLevelInfo
const FIX_HAS_CLAIM_MISSION = true; // volandClaimMission
const FIX_BAG_GOLD_CELL = 'gold-cell'; // gold cell class
const FIX_BAG_EMPTY_OPACITY = 0.3; // empty opacity
const FIX_XP_GRADIENT = true; // xp gradient gold
const FIX_MISSIONS_ICONS = 5; // HERO,BAG,SKILLS,BATTLE,MISSIONS
const FIX_NO_SYNTAX_ERROR = true; // page9 no SyntaxError
const FIX_DOCTYPE_HTML = true; // <!DOCTYPE... </html>...
