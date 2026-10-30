// VOLAND STORAGE v2 - 3 saves + backward compat + ECONOMY + MANUAL CLAIM
const VOLAND_KEYS = {
  hero: 'voland_v1_hero',
  name: 'voland_v1_name',
  equip: 'voland_v1_equip',
  created: 'voland_v1_created',
  saves: 'voland_v1_saves',
  active: 'voland_v1_active',
  legacy_hero: 'voland_hero',
  legacy_name: 'voland_name',
  legacy_equip: 'voland_equip',
  kills: 'voland_v1_kills',
  quests: 'voland_v1_quests',
  quests_total: 'voland_v1_quests_total',
  pvp: 'voland_v1_pvp',
  playtime: 'voland_v1_playtime'
};

function volandSafeParse(str, fallback){ try { return JSON.parse(str); } catch(e){ return fallback; } }

function volandMigrate(){
  try {
    let saves = volandSafeParse(localStorage.getItem(VOLAND_KEYS.saves), null);
    if(!saves){
      const oldHero = localStorage.getItem(VOLAND_KEYS.hero) || localStorage.getItem(VOLAND_KEYS.legacy_hero);
      const oldName = localStorage.getItem(VOLAND_KEYS.name) || localStorage.getItem(VOLAND_KEYS.legacy_name);
      const oldEquip = localStorage.getItem(VOLAND_KEYS.equip) || localStorage.getItem(VOLAND_KEYS.legacy_equip);
      const oldCreated = localStorage.getItem(VOLAND_KEYS.created);
      if(oldHero && oldName && VOLAND_HEROES[oldHero]){
        saves = [{
          hero: oldHero,
          name: oldName,
          equip: volandSafeParse(oldEquip, {}),
          created: parseInt(oldCreated||Date.now()),
          kills: parseInt(localStorage.getItem(VOLAND_KEYS.kills)||'0'),
          quests: parseInt(localStorage.getItem(VOLAND_KEYS.quests)||'0'),
          quests_total: parseInt(localStorage.getItem(VOLAND_KEYS.quests_total)||'40'),
          pvp: parseInt(localStorage.getItem(VOLAND_KEYS.pvp)||'0')
        }];
        localStorage.setItem(VOLAND_KEYS.saves, JSON.stringify(saves));
        localStorage.setItem(VOLAND_KEYS.active, '0');
      }
    }
  } catch(e){}
}
volandMigrate();

function volandGetSaves(){
  try{
    let saves = volandSafeParse(localStorage.getItem(VOLAND_KEYS.saves), []);
    if(!Array.isArray(saves)) saves=[];
    saves = saves.filter(s=> s && s.hero && s.name && VOLAND_HEROES[s.hero]);
    return saves.slice(0,3);
  }catch(e){ return []; }
}

function volandSaveSaves(saves){
  try{ localStorage.setItem(VOLAND_KEYS.saves, JSON.stringify(saves.slice(0,3))); }catch(e){}
}

function volandGetActiveIndex(){
  try{
    let idx = parseInt(localStorage.getItem(VOLAND_KEYS.active)||'0');
    let saves = volandGetSaves();
    if(isNaN(idx) || idx<0 || idx>=saves.length) idx=0;
    return idx;
  }catch(e){ return 0; }
}

function volandHasSave(){ return volandGetSaves().length>0; }

function volandGetHeroId(){
  try{
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0 && saves[idx]) return saves[idx].hero;
    let id = localStorage.getItem(VOLAND_KEYS.hero) || localStorage.getItem(VOLAND_KEYS.legacy_hero);
    if(id && VOLAND_HEROES[id]) return id;
    return Object.keys(VOLAND_HEROES)[0]||'necro-f-new';
  }catch(e){ return Object.keys(VOLAND_HEROES)[0]||'necro-f-new'; }
}

function volandGetHero(){ const id = volandGetHeroId(); return VOLAND_HEROES[id] || VOLAND_HEROES[Object.keys(VOLAND_HEROES)[0]]; }

function volandGetName(){
  try{
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0 && saves[idx]) return saves[idx].name;
    let n = localStorage.getItem(VOLAND_KEYS.name) || localStorage.getItem(VOLAND_KEYS.legacy_name);
    return n || 'VOLAND 1337';
  }catch(e){ return 'VOLAND 1337'; }
}

function volandGetCurrentSave(){
  let saves = volandGetSaves();
  let idx = volandGetActiveIndex();
  return saves[idx] || null;
}

function volandGetEquipRaw(){
  try{
    let cur = volandGetCurrentSave();
    if(cur && cur.equip) return cur.equip;
    let s = localStorage.getItem(VOLAND_KEYS.equip) || localStorage.getItem(VOLAND_KEYS.legacy_equip);
    if(!s) return {};
    return volandSafeParse(s, {});
  }catch(e){ return {}; }
}

function volandGetEquippedItems(){
  const raw = volandGetEquipRaw();
  const eq = {};
  for(let slot in raw){
    const id = raw[slot];
    const item = VOLAND_ITEMS.find(x=>x.id===id);
    if(item) eq[slot]=item;
  }
  return eq;
}

function volandSaveEquip(equipped){
  const toSave = {};
  for(let slot in equipped) toSave[slot]=equipped[slot].id;
  try{
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0){
      saves[idx].equip = toSave;
      volandSaveSaves(saves);
    }
    localStorage.setItem(VOLAND_KEYS.equip, JSON.stringify(toSave));
  }catch(e){}
}

function volandCalcStats(){
  const heroId = volandGetHeroId();
  const base = VOLAND_HEROES[heroId]?.st || VOLAND_HEROES[Object.keys(VOLAND_HEROES)[0]].st;
  const cur = {...base};
  const eq = volandGetEquippedItems();
  const bonus = {};
  for(let slot in eq){
    for(let k in eq[slot].bonus){
      cur[k] = (cur[k]||0) + eq[slot].bonus[k];
      bonus[k] = (bonus[k]||0) + eq[slot].bonus[k];
    }
  }
  return {cur, bonus, heroId, hero: VOLAND_HEROES[heroId], equip: eq};
}

function volandGetPlaytimeHours(){
  try{
    let cur = volandGetCurrentSave();
    let created = cur ? cur.created : parseInt(localStorage.getItem(VOLAND_KEYS.created)||Date.now());
    let diff = Date.now() - created;
    return Math.floor(diff/1000/60/60);
  }catch(e){ return 0; }
}

function volandGetKills(){ try{ let cur=volandGetCurrentSave(); if(cur) return cur.kills||0; return parseInt(localStorage.getItem(VOLAND_KEYS.kills)||'0'); }catch(e){return 0;} }
function volandGetQuests(){ try{ let cur=volandGetCurrentSave(); if(cur) return {done: cur.quests||0, total: cur.quests_total||40}; return {done: parseInt(localStorage.getItem(VOLAND_KEYS.quests)||'0'), total: parseInt(localStorage.getItem(VOLAND_KEYS.quests_total)||'40')}; }catch(e){return {done:0,total:40};} }
function volandGetPvp(){ try{ let cur=volandGetCurrentSave(); if(cur) return cur.pvp||0; return parseInt(localStorage.getItem(VOLAND_KEYS.pvp)||'0'); }catch(e){return 0;} }

function volandAddKill(){ try{ let saves=volandGetSaves(); let idx=volandGetActiveIndex(); if(saves[idx]){ saves[idx].kills=(saves[idx].kills||0)+1; volandSaveSaves(saves);} }catch(e){} }

function volandGetMissionStats(){
 try{
  let raw = localStorage.getItem('voland_missions_stats');
  let s = raw ? JSON.parse(raw) : {};
  return {
   kill_loc: s.kill_loc || {1:0,2:0,3:0},
   kill_boss: s.kill_boss || 0,
   kill_boss_diff: s.kill_boss_diff || [],
   login_days: s.login_days || [],
   ult_uses: s.ult_uses || 0,
   win_streak: s.win_streak || 0,
   max_win_streak: s.max_win_streak || 0,
   collect_green: s.collect_green || 0,
   collect_blue: s.collect_blue || 0,
   collect_legend: s.collect_legend || 0,
   equip_dmg_max: s.equip_dmg_max || 0
  };
 }catch(e){ return {kill_loc:{1:0,2:0,3:0},kill_boss:0,kill_boss_diff:[],login_days:[],ult_uses:0,win_streak:0,max_win_streak:0,collect_green:0,collect_blue:0,collect_legend:0,equip_dmg_max:0}; }
}

function volandSaveMissionStats(stats){
 try{ localStorage.setItem('voland_missions_stats', JSON.stringify(stats)); }catch(e){}
}

function volandGetMissionsDone(){
 try{
  let raw = localStorage.getItem('voland_missions_done');
  return raw ? JSON.parse(raw) : [];
 }catch(e){ return []; }
}

function volandSaveMissionsDone(done){
 try{ localStorage.setItem('voland_missions_done', JSON.stringify(done)); }catch(e){}
}

function volandIsMissionUnlocked(mission, doneList){
 if(!mission.prev) return true;
 return doneList.includes(mission.prev);
}

function volandGetMissionProgress(mission){
 let stats = volandGetMissionStats();
 switch(mission.type){
  case 'kill_mob': return Math.min(stats.kill_loc[mission.loc]||0, mission.target);
  case 'kill_boss': return Math.min(stats.kill_boss||0, mission.target);
  case 'kill_boss_diff': return Math.min((stats.kill_boss_diff||[]).length, mission.target);
  case 'login': return Math.min((stats.login_days||[]).length, mission.target);
  case 'ult': return Math.min(stats.ult_uses||0, mission.target);
  case 'win_streak': return Math.min(stats.max_win_streak||0, mission.target);
  case 'collect_green': return Math.min(stats.collect_green||0, mission.target);
  case 'collect_blue': return Math.min(stats.collect_blue||0, mission.target);
  case 'collect_legend': return Math.min(stats.collect_legend||0, mission.target);
  case 'equip_dmg': return Math.min(stats.equip_dmg_max||0, mission.target);
  default: return 0;
 }
}

function volandUpdateMissionStat(type, loc, value){
 let stats = volandGetMissionStats();
 if(type==='kill_mob' && loc){
  stats.kill_loc[loc] = (stats.kill_loc[loc]||0) + value;
 } else if(type==='kill_boss'){
  stats.kill_boss = (stats.kill_boss||0) + value;
 } else if(type==='kill_boss_diff'){
  if(!stats.kill_boss_diff.includes(value)) stats.kill_boss_diff.push(value);
 } else if(type==='login'){
  let day = new Date().toISOString().slice(0,10);
  if(!stats.login_days.includes(day)) stats.login_days.push(day);
 } else if(type==='ult'){
  stats.ult_uses = (stats.ult_uses||0) + value;
 } else if(type==='win_streak'){
  if(value>0){
   stats.win_streak = (stats.win_streak||0) + 1;
   stats.max_win_streak = Math.max(stats.max_win_streak||0, stats.win_streak);
  } else {
   stats.win_streak = 0;
  }
 } else if(type==='collect_green'){
  stats.collect_green = value;
 } else if(type==='collect_blue'){
  stats.collect_blue = value;
 } else if(type==='collect_legend'){
  stats.collect_legend = value;
 } else if(type==='equip_dmg'){
  stats.equip_dmg_max = Math.max(stats.equip_dmg_max||0, value);
 }
 volandSaveMissionStats(stats);
}

// ===== ECONOMY v1 - gold, xp, resources, inventory =====
const VOLAND_ECON_KEYS = {
  gold: 'voland_v1_gold',
  xp: 'voland_v1_xp',
  resources: 'voland_v1_resources',
  inventory: 'voland_v1_inventory'
};

function volandGetGold(){ try{ return parseInt(localStorage.getItem(VOLAND_ECON_KEYS.gold)||'0')||0; }catch(e){return 0;} }
function volandSaveGold(v){ try{ localStorage.setItem(VOLAND_ECON_KEYS.gold, String(v)); }catch(e){} }
function volandAddGold(amount){
  try{
    let cur = volandGetGold();
    cur += parseInt(amount)||0;
    volandSaveGold(cur);
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves[idx]){ saves[idx].gold = cur; volandSaveSaves(saves); }
    return cur;
  }catch(e){return 0;}
}

function volandGetXp(){ try{ return parseInt(localStorage.getItem(VOLAND_ECON_KEYS.xp)||'0')||0; }catch(e){return 0;} }
function volandSaveXp(v){ try{ localStorage.setItem(VOLAND_ECON_KEYS.xp, String(v)); }catch(e){} }
function volandGetLevelThresholds(){
  let t=[0,1000,3000,6000];
  let add=4000;
  while(t.length<100){ t.push(t[t.length-1]+add); add+=1000; }
  return t;
}
function volandGetLevelInfo(xp){
  let th = volandGetLevelThresholds();
  xp = xp||0;
  for(let i=0;i<th.length-1;i++){
    if(xp>=th[i] && xp < th[i+1]){
      let cur = xp - th[i];
      let need = th[i+1]-th[i];
      return {lvl:i+1, cur:cur, need:need, pct: Math.floor(cur/need*100), total:xp, next:th[i+1]};
    }
  }
  let last = th[th.length-1];
  return {lvl:th.length, cur:xp-last, need:10000, pct:100, total:xp, next:last+10000};
}
function volandAddXp(amount){
  try{
    let cur = volandGetXp();
    cur += parseInt(amount)||0;
    volandSaveXp(cur);
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves[idx]){ saves[idx].xp = cur; volandSaveSaves(saves); }
    return cur;
  }catch(e){return 0;}
}

function volandGetResources(){
  try{
    let raw = localStorage.getItem(VOLAND_ECON_KEYS.resources);
    let obj = raw ? JSON.parse(raw) : {};
    return obj && typeof obj==='object' ? obj : {};
  }catch(e){ return {}; }
}
function volandSaveResources(obj){
  try{ localStorage.setItem(VOLAND_ECON_KEYS.resources, JSON.stringify(obj||{})); }catch(e){}
}
function volandAddResource(id, amount){
  try{
    if(!id) return {};
    let res = volandGetResources();
    res[id] = (res[id]||0) + (parseInt(amount)||1);
    if(res[id] > 100) res[id]=100;
    volandSaveResources(res);
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves[idx]){ saves[idx].resources = res; volandSaveSaves(saves); }
    return res;
  }catch(e){ return {}; }
}

function volandGetInventory(){
  try{
    let raw = localStorage.getItem(VOLAND_ECON_KEYS.inventory);
    let arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  }catch(e){ return []; }
}
function volandSaveInventory(arr){
  try{ localStorage.setItem(VOLAND_ECON_KEYS.inventory, JSON.stringify(arr||[])); }catch(e){}
}
function volandAddToInventory(itemId){
  try{
    if(!itemId) return [];
    let inv = volandGetInventory();
    inv.push({id:itemId, time:Date.now()});
    volandSaveInventory(inv);
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves[idx]){ saves[idx].inventory = inv; volandSaveSaves(saves); }
    return inv;
  }catch(e){ return []; }
}

// ===== MANUAL CLAIM SYSTEM v1 =====
function volandGetReadyMissions(){
 try{
  if(!window.VOLAND_MISSIONS) return [];
  let done = volandGetMissionsDone();
  let ready = [];
  for(let m of VOLAND_MISSIONS){
   if(done.includes(m.id)) continue;
   if(!volandIsMissionUnlocked(m, done)) continue;
   let prog = volandGetMissionProgress(m);
   if(prog >= m.target) ready.push(m);
  }
  return ready;
 }catch(e){ return []; }
}

function volandCheckMissions(){
 try{ return volandGetReadyMissions(); }catch(e){ return []; }
}

function volandClaimMission(id){
 try{
  if(!window.VOLAND_MISSIONS) return null;
  let m = VOLAND_MISSIONS.find(x=>x.id===id);
  if(!m) return null;
  let done = volandGetMissionsDone();
  if(done.includes(id)) return null;
  if(!volandIsMissionUnlocked(m, done)) return null;
  let prog = volandGetMissionProgress(m);
  if(prog < m.target) return null;
  let rew = m.reward||{};
  if(rew.gold && typeof volandAddGold==='function') volandAddGold(rew.gold);
  if(rew.xp && typeof volandAddXp==='function') volandAddXp(rew.xp);
  if(rew.title){
    try{
      let titles = JSON.parse(localStorage.getItem('voland_v1_titles')||'[]');
      if(!titles.includes(rew.title)){ titles.push(rew.title); localStorage.setItem('voland_v1_titles', JSON.stringify(titles)); }
    }catch(e){}
  }
  done.push(id);
  volandSaveMissionsDone(done);
  return m;
 }catch(e){ return null; }
}

// init login tracking
try{ volandUpdateMissionStat('login'); }catch(e){}
