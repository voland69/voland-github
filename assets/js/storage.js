// VOLAND STORAGE v1 - безопасный, версионированный, никогда не падает
const VOLAND_KEYS = {
  hero: 'voland_v1_hero',
  name: 'voland_v1_name',
  equip: 'voland_v1_equip',
  created: 'voland_v1_created',
  legacy_hero: 'voland_hero',
  legacy_name: 'voland_name',
  legacy_equip: 'voland_equip'
};

function volandSafeParse(str, fallback){
  try { return JSON.parse(str); } catch(e){ return fallback; }
}
function volandGet(key, fallback){
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v;
  } catch(e){ return fallback; }
}
function volandSet(key, value){
  try { localStorage.setItem(key, value); return true; } catch(e){ return false; }
}
function volandMigrate(){
  try {
    const oldHero = localStorage.getItem(VOLAND_KEYS.legacy_hero);
    const oldName = localStorage.getItem(VOLAND_KEYS.legacy_name);
    const oldEquip = localStorage.getItem(VOLAND_KEYS.legacy_equip);
    if (oldHero && !localStorage.getItem(VOLAND_KEYS.hero)) localStorage.setItem(VOLAND_KEYS.hero, oldHero);
    if (oldName && !localStorage.getItem(VOLAND_KEYS.name)) localStorage.setItem(VOLAND_KEYS.name, oldName);
    if (oldEquip && !localStorage.getItem(VOLAND_KEYS.equip)) localStorage.setItem(VOLAND_KEYS.equip, oldEquip);
  } catch(e){}
}
volandMigrate();

function volandHasSave(){
  try {
    const h = localStorage.getItem(VOLAND_KEYS.hero);
    const n = localStorage.getItem(VOLAND_KEYS.name);
    return !!(h && n && VOLAND_HEROES[h]);
  } catch(e){ return false; }
}
function volandGetHeroId(){
  try {
    let id = localStorage.getItem(VOLAND_KEYS.hero);
    if (!id) id = localStorage.getItem(VOLAND_KEYS.legacy_hero);
    if (!id || !VOLAND_HEROES[id]) return 'mage-f-new';
    return id;
  } catch(e){ return 'mage-f-new'; }
}
function volandGetHero(){
  const id = volandGetHeroId();
  return VOLAND_HEROES[id] || VOLAND_HEROES['mage-f-new'];
}
function volandGetName(){
  try {
    let n = localStorage.getItem(VOLAND_KEYS.name);
    if (!n) n = localStorage.getItem(VOLAND_KEYS.legacy_name);
    return n || 'VOLAND 1337';
  } catch(e){ return 'VOLAND 1337'; }
}
function volandGetEquipRaw(){
  try {
    let s = localStorage.getItem(VOLAND_KEYS.equip);
    if (!s) s = localStorage.getItem(VOLAND_KEYS.legacy_equip);
    if (!s) return {};
    return volandSafeParse(s, {});
  } catch(e){ return {}; }
}
function volandGetEquippedItems(){
  const raw = volandGetEquipRaw();
  const eq = {};
  for (let slot in raw){
    const id = raw[slot];
    const item = VOLAND_ITEMS.find(x=>x.id===id);
    if (item) eq[slot]=item;
  }
  return eq;
}
function volandSaveEquip(equipped){
  const toSave = {};
  for (let slot in equipped) toSave[slot]=equipped[slot].id;
  volandSet(VOLAND_KEYS.equip, JSON.stringify(toSave));
}
function volandCalcStats(){
  const heroId = volandGetHeroId();
  const base = VOLAND_HEROES[heroId]?.st || VOLAND_HEROES['mage-f-new'].st;
  const cur = {...base};
  const eq = volandGetEquippedItems();
  const bonus = {};
  for (let slot in eq){
    for (let k in eq[slot].bonus){
      cur[k] = (cur[k]||0) + eq[slot].bonus[k];
      bonus[k] = (bonus[k]||0) + eq[slot].bonus[k];
    }
  }
  return {cur, bonus, heroId, hero: VOLAND_HEROES[heroId], equip: eq};
}
function volandRequireSaveOrRedirect(){
  if (!volandHasSave()){
    if (!location.pathname.includes('page2.html') && !location.pathname.includes('index.html')){
      location.href = './page2.html';
    }
    return false;
  }
  return true;
}
