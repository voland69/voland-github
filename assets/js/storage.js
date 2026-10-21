// VOLAND STORAGE v2 - 3 слота персонажей
const VOLAND_KEYS = {
  profiles: 'voland_v2_profiles',
  active: 'voland_v2_active',
  equip_prefix: 'voland_v2_equip_',
  hero: 'voland_v1_hero',
  name: 'voland_v1_name',
  equip: 'voland_v1_equip',
  created: 'voland_v1_created',
  legacy_hero: 'voland_hero',
  legacy_name: 'voland_name',
  legacy_equip: 'voland_equip'
};
function volandSafeParse(str, fallback){ try { return JSON.parse(str); } catch(e){ return fallback; } }
function volandGetProfiles(){
  try {
    const raw = localStorage.getItem(VOLAND_KEYS.profiles);
    if (!raw) return [];
    const arr = volandSafeParse(raw, []);
    return arr.filter(p=>p && p.id && p.heroId && p.name && VOLAND_HEROES[p.heroId]);
  } catch(e){ return []; }
}
function volandSaveProfiles(profiles){ try { localStorage.setItem(VOLAND_KEYS.profiles, JSON.stringify(profiles)); } catch(e){} }
function volandGetActiveId(){ try { return localStorage.getItem(VOLAND_KEYS.active) || null; } catch(e){ return null; } }
function volandSetActive(id){ try { if(id) localStorage.setItem(VOLAND_KEYS.active, id); } catch(e){} }
function volandGetActiveProfile(){
  const profiles = volandGetProfiles();
  const activeId = volandGetActiveId();
  if (activeId){ const found = profiles.find(p=>p.id===activeId); if (found) return found; }
  if (profiles.length>0) return profiles[0];
  return null;
}
function volandGenerateId(){ return 'p_' + Date.now() + '_' + Math.floor(Math.random()*1000); }
function volandCreateProfile(heroId, name){
  if (!VOLAND_HEROES[heroId]) return null;
  name = (name||'').trim(); if (name.length<3) return null;
  let profiles = volandGetProfiles();
  if (profiles.length>=3) return null;
  const newProfile = { id: volandGenerateId(), heroId: heroId, name: name, created: Date.now() };
  profiles.push(newProfile);
  volandSaveProfiles(profiles);
  volandSetActive(newProfile.id);
  return newProfile;
}
function volandDeleteProfile(id){
  let profiles = volandGetProfiles().filter(p=>p.id!==id);
  volandSaveProfiles(profiles);
  try { localStorage.removeItem(VOLAND_KEYS.equip_prefix + id); } catch(e){}
  if (volandGetActiveId()===id){
    if (profiles.length>0) volandSetActive(profiles[0].id);
    else { try { localStorage.removeItem(VOLAND_KEYS.active); } catch(e){} }
  }
}
function volandMigrate(){
  try {
    if (volandGetProfiles().length>0) return;
    let oldHero = localStorage.getItem(VOLAND_KEYS.hero) || localStorage.getItem(VOLAND_KEYS.legacy_hero);
    let oldName = localStorage.getItem(VOLAND_KEYS.name) || localStorage.getItem(VOLAND_KEYS.legacy_name);
    let oldEquip = localStorage.getItem(VOLAND_KEYS.equip) || localStorage.getItem(VOLAND_KEYS.legacy_equip);
    if (oldHero && oldName && VOLAND_HEROES[oldHero]){
      const p = { id: volandGenerateId(), heroId: oldHero, name: oldName, created: parseInt(localStorage.getItem(VOLAND_KEYS.created)||Date.now()) };
      volandSaveProfiles([p]);
      volandSetActive(p.id);
      if (oldEquip){ try { localStorage.setItem(VOLAND_KEYS.equip_prefix + p.id, oldEquip); } catch(e){} }
    }
  } catch(e){}
}
volandMigrate();
function volandHasSave(){ return volandGetProfiles().length>0; }
function volandGetHeroId(){
  const active = volandGetActiveProfile();
  if (active) return active.heroId;
  return 'mage-f-new';
}
function volandGetHero(){ const id = volandGetHeroId(); return VOLAND_HEROES[id] || VOLAND_HEROES['mage-f-new']; }
function volandGetName(){
  const active = volandGetActiveProfile();
  if (active) return active.name;
  return 'VOLAND 1337';
}
function volandGetEquipRaw(){
  const active = volandGetActiveProfile();
  if (!active) return {};
  try {
    let s = localStorage.getItem(VOLAND_KEYS.equip_prefix + active.id);
    if (!s) return {};
    return volandSafeParse(s, {});
  } catch(e){ return {}; }
}
function volandGetEquippedItems(){
  const raw = volandGetEquipRaw();
  const eq = {};
  for (let slot in raw){
    const item = VOLAND_ITEMS.find(x=>x.id===raw[slot]);
    if (item) eq[slot]=item;
  }
  return eq;
}
function volandSaveEquip(equipped){
  const active = volandGetActiveProfile();
  if (!active) return;
  const toSave = {};
  for (let slot in equipped) toSave[slot]=equipped[slot].id;
  try { localStorage.setItem(VOLAND_KEYS.equip_prefix + active.id, JSON.stringify(toSave)); } catch(e){}
}
function volandCalcStats(){
  const heroId = volandGetHeroId();
  const base = VOLAND_HEROES[heroId]?.st || VOLAND_HEROES['mage-f-new'].st;
  const cur = {...base};
  const eq = volandGetEquippedItems();
  const bonus = {};
  for (let slot in eq){
    for (let k in eq[slot].bonus){ cur[k] = (cur[k]||0) + eq[slot].bonus[k]; bonus[k] = (bonus[k]||0) + eq[slot].bonus[k]; }
  }
  return {cur, bonus, heroId, hero: VOLAND_HEROES[heroId], equip: eq, profile: volandGetActiveProfile()};
}
function volandRequireSaveOrRedirect(){
  if (!volandHasSave()){
    if (!location.pathname.includes('page2.html') && !location.pathname.includes('index.html')){ location.href = './page2.html'; }
    return false;
  }
  return true;
}
function volandSwitchToProfile(id){
  if (volandGetProfiles().find(p=>p.id===id)){ volandSetActive(id); return true; }
  return false;
}
