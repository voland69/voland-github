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
    SETTINGS: 'settings'
  };

  function internalGet(key, defaultValue) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null) return defaultValue;
      try { return JSON.parse(raw); } catch (e) { return raw; }
    } catch (err) { return defaultValue; }
  }

  function internalSet(key, value) {
    try {
      const toStore = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(STORAGE_PREFIX + key, toStore);
      return true;
    } catch (err) { return false; }
  }

function volandInit() {
  if (!localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.GOLD)) {
    internalSet(STORAGE_KEYS.GOLD, '0');
  }
  if (!localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.XP)) {
    internalSet(STORAGE_KEYS.XP, '0');
  }
  if (!localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.LEVEL)) {
    internalSet(STORAGE_KEYS.LEVEL, '1');
  }
  if (!localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.RESOURCES)) {
    internalSet(STORAGE_KEYS.RESOURCES, '{}');
  }
  if (!localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.BAG)) {
    internalSet(STORAGE_KEYS.BAG, '[]');
  }
  if (!localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.STAT_POINTS)) {
    internalSet(STORAGE_KEYS.STAT_POINTS, '0');
  }
  if (!localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.MISSIONS)) {
    internalSet(STORAGE_KEYS.MISSIONS, '[]');
  }
  return true;
}

function volandSave(key, value) {
  return internalSet(key, value);
}

function volandLoad(key, defaultValue) {
  return internalGet(key, defaultValue);
}

function volandReset() {
  Object.values(STORAGE_KEYS).forEach(function(k) {
    localStorage.removeItem(STORAGE_PREFIX + k);
  });
  volandInit();
  return true;
}

function volandGetGold() {
  const raw = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.GOLD);
  if (raw === null) return 0;
  const parsed = parseInt(raw, 10);
  return isNaN(parsed) ? 0 : parsed;
}

function volandAddGold(amount) {
  const current = volandGetGold();
  const addAmount = parseInt(amount, 10) || 0;
  const nextValue = current + addAmount;
  if (nextValue < 0) return current;
  internalSet(STORAGE_KEYS.GOLD, String(nextValue));
  return nextValue;
}

function volandSetGold(amount) {
  const clean = Math.max(0, parseInt(amount, 10) || 0);
  internalSet(STORAGE_KEYS.GOLD, String(clean));
  return clean;
}

function volandGetResources() {
  const res = internalGet(STORAGE_KEYS.RESOURCES, {});
  if (typeof res === 'string') { try { return JSON.parse(res); } catch { return {}; } }
  return res || {};
}

function volandGetResource(resourceId) {
  const all = volandGetResources();
  return all[resourceId] || 0;
}

function volandGetResourceCount(resourceId) {
  return volandGetResource(resourceId);
}

function volandAddResource(resourceId, count) {
  const allRes = volandGetResources();
  const toAdd = parseInt(count, 10) || 0;
  const current = allRes[resourceId] || 0;
  const updated = current + toAdd;
  if (updated <= 0) { delete allRes[resourceId]; }
  else { allRes[resourceId] = updated; }
  internalSet(STORAGE_KEYS.RESOURCES, allRes);
  return allRes[resourceId] || 0;
}

function volandRemoveResource(resourceId, count) {
  const removeCount = parseInt(count, 10) || 0;
  return volandAddResource(resourceId, -removeCount);
}

function volandSetResources(resourcesObj) {
  internalSet(STORAGE_KEYS.RESOURCES, resourcesObj || {});
  return volandGetResources();
}

function volandGetXp() {
  const rawXp = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.XP);
  if (rawXp === null) return 0;
  const xpParsed = parseInt(rawXp, 10);
  return isNaN(xpParsed) ? 0 : xpParsed;
}

function volandAddXp(amount) {
  let currentXp = volandGetXp();
  let currentLvl = volandGetLevel();
  const addXp = parseInt(amount, 10) || 0;
  currentXp += addXp;
  let levelsGained = 0;
  while (true) {
    const needForNext = currentLvl * 2 * 1000 - 1000; // 1:1000,2:3000,3:5000
    if (currentXp >= needForNext) {
      currentXp -= needForNext;
      currentLvl += 1;
      levelsGained += 1;
      volandAddStatPoint(1);
    } else { break; }
    if (levelsGained > 100) break;
  }
  internalSet(STORAGE_KEYS.XP, String(currentXp));
  internalSet(STORAGE_KEYS.LEVEL, String(currentLvl));
  return { xp: currentXp, lvl: currentLvl, leveled: levelsGained };
}

function volandSetXp(amount) {
  const cleanXp = Math.max(0, parseInt(amount, 10) || 0);
  internalSet(STORAGE_KEYS.XP, String(cleanXp));
  return cleanXp;
}

function volandGetLevel() {
  const rawLvl = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.LEVEL);
  if (rawLvl === null) return 1;
  const parsedLvl = parseInt(rawLvl, 10) || 1;
  return Math.max(1, parsedLvl);
}

function volandSetLevel(level) {
  const newLvl = Math.max(1, parseInt(level, 10) || 1);
  internalSet(STORAGE_KEYS.LEVEL, String(newLvl));
  return newLvl;
}

function volandGetLevelInfo() {
  const lvl = volandGetLevel();
  const xp = volandGetXp();
  const need = lvl * 2 * 1000 - 1000;
  const percent = need > 0 ? Math.min(100, Math.floor((xp / need) * 100)) : 0;
  return { level: lvl, xp: xp, need: need, percent: percent, next: lvl + 1 };
}

function volandCheckLevelUp() {
  const info = volandGetLevelInfo();
  if (info.xp >= info.need) {
    return volandAddXp(0);
  }
  return null;
}

function volandGetStatPoints() {
  const raw = localStorage.getItem(STORAGE_PREFIX + STORAGE_KEYS.STAT_POINTS);
  if (raw === null) return 0;
  return parseInt(raw, 10) || 0;
}

function volandAddStatPoint(amount) {
  const current = volandGetStatPoints();
  const add = parseInt(amount, 10) || 0;
  const next = current + add;
  internalSet(STORAGE_KEYS.STAT_POINTS, String(next));
  return next;
}

function volandUseStatPoint(amount) {
  const currentPoints = volandGetStatPoints();
  const use = parseInt(amount, 10) || 1;
  if (currentPoints < use) return false;
  internalSet(STORAGE_KEYS.STAT_POINTS, String(currentPoints - use));
  return true;
}

function volandGetHero() {
  return internalGet(STORAGE_KEYS.HERO, { name: 'Hero', level: 1 });
}

function volandSetHero(heroObj) {
  internalSet(STORAGE_KEYS.HERO, heroObj || {});
  return volandGetHero();
}

function volandGetHeroName() {
  const hero = volandGetHero();
  const lvl = volandGetLevel();
  const baseName = hero.name || 'Hero';
  return baseName + ' LVL ' + lvl;
}

function volandGetHeroLevel() {
  return volandGetLevel();
}

function volandGetBag() {
  return internalGet(STORAGE_KEYS.BAG, []);
}

function volandSetBag(bagArray) {
  internalSet(STORAGE_KEYS.BAG, bagArray || []);
  return volandGetBag();
}

function volandAddToBag(item) {
  const bag = volandGetBag();
  bag.push(item);
  if (bag.length > 50) bag.length = 50;
  internalSet(STORAGE_KEYS.BAG, bag);
  return bag;
}

function volandRemoveFromBag(index) {
  const bagData = volandGetBag();
  bagData.splice(index, 1);
  internalSet(STORAGE_KEYS.BAG, bagData);
  return bagData;
}

function volandGetBagSize() {
  return volandGetBag().length;
}

function volandIsBagFull() {
  return volandGetBagSize() >= 50;
}

function volandClearBag() {
  internalSet(STORAGE_KEYS.BAG, []);
  return [];
}

function volandGetMissions() {
  return internalGet(STORAGE_KEYS.MISSIONS, []);
}

function volandGetMission(missionId) {
  const allMissions = volandGetMissions();
  return allMissions.find(function(m) { return m.id === missionId; }) || null;
}

function volandClaimMission(missionId) {
  const missions = volandGetMissions();
  const mission = missions.find(function(m) { return m.id === missionId; });
  if (!mission || mission.claimed) return false;
  mission.claimed = true;
  if (mission.rewardGold) { volandAddGold(mission.rewardGold); }
  if (mission.rewardXp) { volandAddXp(mission.rewardXp); }
  internalSet(STORAGE_KEYS.MISSIONS, missions);
  return true;
}

function volandCompleteMission(missionId) {
  const missionsList = volandGetMissions();
  const found = missionsList.find(function(m) { return m.id === missionId; });
  if (!found) return false;
  found.completed = true;
  internalSet(STORAGE_KEYS.MISSIONS, missionsList);
  return true;
}

function volandIsMissionLocked(missionObj) {
  if (!missionObj) return true;
  if (missionObj.requireLevel && volandGetLevel() < missionObj.requireLevel) {
    return true;
  }
  return false;
}

function volandResetMissions() {
  internalSet(STORAGE_KEYS.MISSIONS, []);
  return [];
}

function volandGetSkills() {
  return internalGet(STORAGE_KEYS.SKILLS, []);
}

function volandGetSkill(skillId) {
  const skills = volandGetSkills();
  return skills.find(function(s) { return s.id === skillId; }) || null;
}

function volandUnlockSkill(skillId) {
  const skillList = volandGetSkills();
  if (!skillList.includes(skillId)) {
    skillList.push(skillId);
  }
  internalSet(STORAGE_KEYS.SKILLS, skillList);
  return skillList;
}

function volandHasSkill(skillId) {
  return volandGetSkills().includes(skillId);
}

function volandGetItem(itemId) {
  try {
    if (typeof volandDB !== 'undefined' && volandDB.items) {
      return volandDB.items.find(function(it) { return it.id === itemId; }) || null;
    }
  } catch (e) { }
  return null;
}

function volandHasItem(itemId) {
  const bagItems = volandGetBag();
  return bagItems.some(function(it) { return it.id === itemId; });
}

function volandGetDb() {
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
