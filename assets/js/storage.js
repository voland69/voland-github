// VOLAND STORAGE — версия проекта 2.0 (см. VOLAND_CONFIG.version в config.js)
// Ключи localStorage намеренно остаются voland_v1_* — переименование убьёт старые сейвы.
// 3 saves + backward compat
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
    // legacy single -> saves array
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
    // filter invalid
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

function volandHasSave(){
  return volandGetSaves().length>0;
}

function volandGetHeroId(){
  try{
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0 && saves[idx]) return saves[idx].hero;
    // fallback old single
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

// New helpers for page3 stats
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
  let saves = volandGetSaves();
  let idx = volandGetActiveIndex();
  if(saves.length>0 && saves[idx]){
    if(saves[idx].mission_stats){
      let s = saves[idx].mission_stats;
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
    } else {
      let isNewHero = (parseInt(saves[idx].xp||0)===0 && (Date.now() - parseInt(saves[idx].created||0)) < 60000);
      if(isNewHero){
        let today = new Date().toISOString().slice(0,10);
        let empty = {kill_loc:{1:0,2:0,3:0}, kill_boss:0, kill_boss_diff:[], login_days:[today], ult_uses:0, win_streak:0, max_win_streak:0, collect_green:0, collect_blue:0, collect_legend:0, equip_dmg_max:0};
        saves[idx].mission_stats = empty;
        volandSaveSaves(saves);
        return empty;
      }
      // OLD HERO - migrate from global to preserve lvl4
      let raw = localStorage.getItem('voland_missions_stats');
      let s = raw ? JSON.parse(raw) : null;
      if(s && (s.kill_loc || s.kill_boss || s.login_days)){
        let migrated = {
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
        saves[idx].mission_stats = migrated;
        volandSaveSaves(saves);
        return migrated;
      }
      let today = new Date().toISOString().slice(0,10);
      let empty = {kill_loc:{1:0,2:0,3:0}, kill_boss:0, kill_boss_diff:[], login_days:[today], ult_uses:0, win_streak:0, max_win_streak:0, collect_green:0, collect_blue:0, collect_legend:0, equip_dmg_max:0};
      saves[idx].mission_stats = empty;
      volandSaveSaves(saves);
      return empty;
    }
  }
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
 try{
  // PER-HERO save
  let saves = volandGetSaves();
  let idx = volandGetActiveIndex();
  if(saves.length>0){
    saves[idx].mission_stats = stats;
    volandSaveSaves(saves);
  }
  localStorage.setItem('voland_missions_stats', JSON.stringify(stats));
 }catch(e){}
}

function volandGetMissionsDone(){
 try{
  let saves = volandGetSaves();
  let idx = volandGetActiveIndex();
  if(saves.length>0 && saves[idx]){
    if(Array.isArray(saves[idx].missions_done)){
      return saves[idx].missions_done;
    } else {
      let raw = localStorage.getItem('voland_missions_done');
      let done = raw ? JSON.parse(raw) : null;
      if(done && Array.isArray(done) && done.length>0){
        // OLD HERO - migrate
        saves[idx].missions_done = done;
        volandSaveSaves(saves);
        return done;
      }
      saves[idx].missions_done = [];
      volandSaveSaves(saves);
      return [];
    }
  }
  let raw = localStorage.getItem('voland_missions_done');
  return raw ? JSON.parse(raw) : [];
 }catch(e){ return []; }
}

function volandSaveMissionsDone(done){
 try{
  let saves = volandGetSaves();
  let idx = volandGetActiveIndex();
  if(saves.length>0){
    saves[idx].missions_done = done;
    volandSaveSaves(saves);
  }
  localStorage.setItem('voland_missions_done', JSON.stringify(done));
 }catch(e){}
}

function volandIsMissionUnlocked(mission, doneList){
 try{
   let m = mission;
   // If mission is id, find object
   if(typeof mission==='number'){
     let all = (typeof VOLAND_MISSIONS!=='undefined'&&VOLAND_MISSIONS.length>0)?VOLAND_MISSIONS:(typeof FALLBACK_MISSIONS!=='undefined'?FALLBACK_MISSIONS:[]);
     m = all.find(x=>x.id===mission) || {id:mission, prev:null};
   }
   if(!m) return true;
   if(!m.prev) return true;
   let done = doneList || (typeof volandGetMissionsDone==='function'?volandGetMissionsDone():[]);
   return done.includes(m.prev);
 }catch(e){ return true; }
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
 try{
  let stats = volandGetMissionStats();
  if(type==='kill_mob' && loc){
   let l = parseInt(loc)||1;
   stats.kill_loc = stats.kill_loc || {1:0,2:0,3:0};
   stats.kill_loc[l] = (stats.kill_loc[l]||0) + value;
   stats.kill_loc[String(l)] = stats.kill_loc[l];
   console.log('[MISSION] kill_mob loc', l, 'now', stats.kill_loc[l]);
  } else if(type==='kill_boss'){
   stats.kill_boss = (stats.kill_boss||0) + value;
   console.log('[MISSION] kill_boss now', stats.kill_boss);
  } else if(type==='kill_boss_diff'){
   if(!stats.kill_boss_diff.includes(value)) stats.kill_boss_diff.push(value);
  }
  volandSaveMissionStats(stats);
  console.log('[MISSION] saved', JSON.stringify(stats).slice(0,400));
 }catch(e){ console.error('[MISSION] update error', e); }
}


function volandClaimMission(id){
 try{
  let all = (typeof VOLAND_MISSIONS!=='undefined'&&VOLAND_MISSIONS.length>0)?VOLAND_MISSIONS:(typeof FALLBACK_MISSIONS!=='undefined'?FALLBACK_MISSIONS:[]);
  let m = all.find(x=>x.id===id);
  if(!m) return false;
  let done = volandGetMissionsDone();
  if(done.includes(id)) return false;
  let prog = volandGetMissionProgress(m);
  if(prog < m.target) return false;
  // give rewards
  if(m.reward){
    if(m.reward.gold && typeof volandAddGold==='function') volandAddGold(m.reward.gold);
    if(m.reward.xp && typeof volandAddXp==='function') volandAddXp(m.reward.xp);
  }
  done.push(id);
  volandSaveMissionsDone(done);
  // per-hero save
  try{
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0){
      saves[idx].missions_done = done;
      volandSaveSaves(saves);
    }
  }catch(e){}
  return true;
 }catch(e){ console.error('claim error', e); return false; }
}


function volandCheckMissions(){
 try{
  if(!window.VOLAND_MISSIONS) return [];
  let done = volandGetMissionsDone();
  let newly = [];
  for(let m of VOLAND_MISSIONS){
   if(done.includes(m.id)) continue;
   if(!volandIsMissionUnlocked(m, done)) continue;
   let prog = volandGetMissionProgress(m);
   if(prog >= m.target){
    done.push(m.id);
    newly.push(m);
   }
  }
  if(newly.length) volandSaveMissionsDone(done);
  return newly;
 }catch(e){ return []; }
}

// init login tracking
try{ volandUpdateMissionStat('login'); }catch(e){}




// ===== VOLAND STORAGE v3 - GOLD / XP / RESOURCES / INVENTORY / LEVEL =====
function volandGetGold(){
  try{
    let saves=volandGetSaves();
    let idx=volandGetActiveIndex();
    if(saves.length>0 && saves[idx]){
      if(typeof saves[idx].gold!=='undefined') return parseInt(saves[idx].gold)||0;
      // NEW HERO isolation: if save exists but no gold, return 0 (lvl1), don't leak global
      return 0;
    }
    let g = localStorage.getItem('voland_v1_gold');
    return parseInt(g||'0')||0;
  }catch(e){ return 0; }
}
function volandSetGold(amount){
  try{
    amount = Math.max(0, parseInt(amount)||0);
    let saves=volandGetSaves();
    let idx=volandGetActiveIndex();
    if(saves.length>0){
      saves[idx].gold = amount;
      volandSaveSaves(saves);
    }
    localStorage.setItem('voland_v1_gold', String(amount));
    return amount;
  }catch(e){ return 0; }
}
function volandAddGold(add){
  try{
    let cur=volandGetGold();
    let next=cur + (parseInt(add)||0);
    return volandSetGold(next);
  }catch(e){ return 0; }
}

function volandGetXp(){
  try{
    let saves=volandGetSaves();
    let idx=volandGetActiveIndex();
    if(saves.length>0 && saves[idx]){
      if(typeof saves[idx].xp!=='undefined') return parseInt(saves[idx].xp)||0;
      // NEW HERO isolation: lvl1 if no xp
      return 0;
    }
    let x = localStorage.getItem('voland_v1_xp');
    return parseInt(x||'0')||0;
  }catch(e){ return 0; }
}
function volandSetXp(amount){
  try{
    amount = Math.max(0, parseInt(amount)||0);
    let saves=volandGetSaves();
    let idx=volandGetActiveIndex();
    if(saves.length>0){
      saves[idx].xp = amount;
      volandSaveSaves(saves);
    }
    localStorage.setItem('voland_v1_xp', String(amount));
    return amount;
  }catch(e){ return 0; }
}
function volandAddXp(add){
  try{
    let cur=volandGetXp();
    let next=cur + (parseInt(add)||0);
    return volandSetXp(next);
  }catch(e){ return 0; }
}

function volandGetLevelInfo(totalXp){
  try{
    let xp = parseInt(totalXp)||0;
    if(xp<0) xp=0;
    let lvl = 1;
    let accumulated = 0;
    let need = 1000;
    while(true){
      need = (2*lvl - 1)*1000;
      if(xp < accumulated + need){
        break;
      }
      accumulated += need;
      lvl++;
      if(lvl>100) break;
    }
    let cur = xp - accumulated;
    if(cur<0) cur=0;
    let pct = need>0 ? Math.floor(cur/need*100) : 0;
    if(pct>100) pct=100;
    return {lvl:lvl, cur:cur, need:need, pct:pct, total:xp, nextNeed:need-cur, accumulated:accumulated};
  }catch(e){ return {lvl:1, cur:0, need:1000, pct:0, total:0, nextNeed:1000, accumulated:0}; }
}
function volandGetCurrentLevelInfo(){
  return volandGetLevelInfo(volandGetXp());
}
function volandGetLevel(){
  try{ return volandGetCurrentLevelInfo().lvl; }catch(e){ return 1; }
}
function volandCheckLevelUp(oldXp, newXp){
  try{
    let oldInfo = volandGetLevelInfo(oldXp);
    let newInfo = volandGetLevelInfo(newXp);
    if(newInfo.lvl > oldInfo.lvl){
      let diff = newInfo.lvl - oldInfo.lvl;
      let curPoints = 0;
      let saves = volandGetSaves();
      let idx = volandGetActiveIndex();
      if(saves[idx] && typeof saves[idx].stat_points!=='undefined'){
        curPoints = parseInt(saves[idx].stat_points)||0;
      } else {
        curPoints = parseInt(localStorage.getItem('voland_v1_stat_points')||'0')||0;
      }
      curPoints += diff;
      localStorage.setItem('voland_v1_stat_points', String(curPoints));
      if(saves[idx]){
        saves[idx].stat_points = curPoints;
        volandSaveSaves(saves);
      }
      return {leveled:true, oldLvl:oldInfo.lvl, newLvl:newInfo.lvl, points:diff, totalPoints:curPoints};
    }
    return {leveled:false};
  }catch(e){ return {leveled:false}; }
}
// обертка для volandAddXp чтобы чекать lvl up
(function(){
  try{
    let orig = volandAddXp;
    window.volandAddXp = function(amount){
      try{
        let oldXp = volandGetXp();
        let newXp = orig(amount);
        let lvlUp = volandCheckLevelUp(oldXp, newXp);
        if(lvlUp.leveled){
          console.log('LEVEL UP! '+lvlUp.oldLvl+' -> '+lvlUp.newLvl);
        }
        return newXp;
      }catch(e){ return orig(amount); }
    };
  }catch(e){}
})();

function volandGetResources(){
  try{
    let saves=volandGetSaves();
    let idx=volandGetActiveIndex();
    if(saves.length>0 && saves[idx]){
      if(saves[idx].resources) return saves[idx].resources;
      // NEW HERO isolation: empty resources for lvl1
      return {};
    }
    let raw = localStorage.getItem('voland_v1_resources');
    if(raw) return JSON.parse(raw);
    return {};
  }catch(e){ return {}; }
}
function volandSetResources(res){
  try{
    let cleaned={};
    for(let k in res){ cleaned[k]=Math.max(0, Math.min(99999, parseInt(res[k])||0)); }
    let saves=volandGetSaves();
    let idx=volandGetActiveIndex();
    if(saves.length>0){
      saves[idx].resources = cleaned;
      volandSaveSaves(saves);
    }
    localStorage.setItem('voland_v1_resources', JSON.stringify(cleaned));
    return cleaned;
  }catch(e){ return {}; }
}
function volandAddResource(id, add){
  try{
    let res=volandGetResources();
    let cur=parseInt(res[id]||0);
    res[id] = Math.min(99999, cur + (parseInt(add)||0));
    return volandSetResources(res)[id];
  }catch(e){ return 0; }
}

// FIX: dedup helpers - baseId + tier comparison (handles old ids via OLD_TO_NEW)
function volandGetItemBaseId(itemId){
  try{
    // Зелья: каждое зелье — свой baseId (полный id), чтобы HP-XS и MANA-XS не схлопывались в один "potion"
    if(typeof itemId==='string' && itemId.indexOf('potion-')===0) return itemId;
    let resolved = itemId;
    if(typeof volandResolveItemId==='function'){
      try{ resolved = volandResolveItemId(itemId); }catch(e){}
    } else if(typeof VOLAND_OLD_TO_NEW!=='undefined' && VOLAND_OLD_TO_NEW[itemId]){
      resolved = VOLAND_OLD_TO_NEW[itemId];
    }
    if(typeof VOLAND_ITEMS!=='undefined'){
      let it = VOLAND_ITEMS.find(x=>x.id===resolved);
      if(it && it.baseId) return it.baseId;
      // try original id if resolved not found
      let it2 = VOLAND_ITEMS.find(x=>x.id===itemId);
      if(it2 && it2.baseId) return it2.baseId;
    }
    // fallback: first part before -
    return (resolved||itemId).split('-')[0];
  }catch(e){ return itemId.split('-')[0]; }
}
function volandCompareItemLevel(idA, idB){
  try{
    let ra=idA, rb=idB;
    if(typeof volandResolveItemId==='function'){
      try{ ra=volandResolveItemId(idA); rb=volandResolveItemId(idB); }catch(e){}
    }
    if(typeof VOLAND_ITEMS==='undefined') return 0;
    let a = VOLAND_ITEMS.find(x=>x.id===ra) || VOLAND_ITEMS.find(x=>x.id===idA);
    let b = VOLAND_ITEMS.find(x=>x.id===rb) || VOLAND_ITEMS.find(x=>x.id===idB);
    if(!a || !b) return 0;
    const tierOrder={bw:0,green:1,blue:2,red:3,gold:4};
    let ta = tierOrder[a.tier]||0, tb = tierOrder[b.tier]||0;
    if(ta!==tb) return ta-tb;
    return (a.level||0)-(b.level||0);
  }catch(e){ return 0; }
}
function volandDedupInventoryByBaseId(inv){
  try{
    if(!Array.isArray(inv)) return [];
    let map={};
    let potionEntries=[];
    inv.forEach(entry=>{
      if(!entry || !entry.id) return;
      // Зелья не дедупим — каждая банка отдельная запись, чтобы стак работал по количеству записей
      if(typeof entry.id==='string' && entry.id.indexOf('potion-')===0){ potionEntries.push(entry); return; }
      let base = volandGetItemBaseId(entry.id);
      if(!map[base]){
        map[base]=entry;
      } else {
        if(volandCompareItemLevel(entry.id, map[base].id)>0){
          map[base]=entry;
        }
      }
    });
    let result = Object.values(map);
    result = result.concat(potionEntries);
    result.sort((a,b)=>(b.time||0)-(a.time||0));
    return result;
  }catch(e){ return inv; }
}

function volandGetInventory(){
  try{
    let saves=volandGetSaves();
    let idx=volandGetActiveIndex();
    let rawInv=null;
    if(saves.length>0 && saves[idx] && saves[idx].inventory) rawInv=saves[idx].inventory;
    else {
      let raw = localStorage.getItem('voland_v1_inventory');
      if(raw) rawInv=JSON.parse(raw);
    }
    if(!rawInv) return [];
    let cleaned = volandDedupInventoryByBaseId(rawInv);
    if(cleaned.length!==rawInv.length){
      try{
        let saves2=volandGetSaves();
        let idx2=volandGetActiveIndex();
        if(saves2.length>0){
          saves2[idx2].inventory=cleaned;
          volandSaveSaves(saves2);
        }
        localStorage.setItem('voland_v1_inventory', JSON.stringify(cleaned));
      }catch(e){}
    }
    return cleaned;
  }catch(e){ return []; }
}
function volandSaveInventory(inv){
  try{
    if(!Array.isArray(inv)) inv=[];
    inv = volandDedupInventoryByBaseId(inv);
    let saves=volandGetSaves();
    let idx=volandGetActiveIndex();
    if(saves.length>0){
      saves[idx].inventory = inv;
      volandSaveSaves(saves);
    }
    localStorage.setItem('voland_v1_inventory', JSON.stringify(inv));
    return inv;
  }catch(e){ return []; }
}
function volandAddToInventory(itemId){
  try{
    // Зелья: всегда новая запись, чтобы стак считался по количеству банок
    if(typeof itemId==='string' && itemId.indexOf('potion-')===0){
      let invP = volandGetInventory();
      invP.push({id:itemId, time:Date.now()});
      return volandSaveInventory(invP);
    }
    let inv=volandGetInventory();
    let base = volandGetItemBaseId(itemId);
    let existingIdx = -1;
    for(let i=0;i<inv.length;i++){
      if(volandGetItemBaseId(inv[i].id)===base){
        existingIdx=i;
        break;
      }
    }
    if(existingIdx>=0){
      if(volandCompareItemLevel(itemId, inv[existingIdx].id)>0){
        inv[existingIdx] = {id:itemId, time:Date.now()};
      }
    } else {
      inv.push({id:itemId, time:Date.now()});
    }
    return volandSaveInventory(inv);
  }catch(e){ return []; }
}
function volandRemoveFromInventory(itemId){
  try{
    let inv=volandGetInventory();
    inv = inv.filter(x=>x.id!==itemId);
    return volandSaveInventory(inv);
  }catch(e){ return []; }
}

// совместимость для page4
function getGold(){ return volandGetGold(); }
function getResources(){ return volandGetResources(); }


// VOLAND UPGRADE SYSTEM v1
function volandGetUpgradeCost(itemId){
  try{
    if(typeof VOLAND_UPGRADE_COSTS!=='undefined' && VOLAND_UPGRADE_COSTS[itemId]){
      return VOLAND_UPGRADE_COSTS[itemId];
    }
    return null;
  }catch(e){ return null; }
}

function volandCanUpgrade(itemId){
  try{
    let cost = volandGetUpgradeCost(itemId);
    if(!cost) return {can:false, reason:'MAX LEVEL'};
    let gold = volandGetGold();
    if(gold < cost.gold) return {can:false, reason:'NEED GOLD '+cost.gold, needGold:cost.gold-cost.gold, gold:cost.gold};
    let res = volandGetResources();
    for(let rid in cost.resources){
      let need = cost.resources[rid];
      let have = res[rid]||0;
      if(have < need) return {can:false, reason:'NEED '+rid.toUpperCase()+' '+need, needRes:rid, needAmount:need-have};
    }
    return {can:true, cost:cost};
  }catch(e){ return {can:false, reason:'ERROR'}; }
}

function volandUpgradeItem(itemId){
  try{
    let check = volandCanUpgrade(itemId);
    if(!check.can) return {success:false, reason:check.reason};
    let cost = check.cost;
    volandSetGold(volandGetGold() - cost.gold);
    let res = volandGetResources();
    for(let rid in cost.resources){
      res[rid] = Math.max(0, (res[rid]||0) - cost.resources[rid]);
    }
    volandSetResources(res);
    let nextId = cost.nextId;
    let equipped = volandGetEquipRaw();
    let foundEquipped = false;
    for(let slot in equipped){
      if(equipped[slot]===itemId){
        equipped[slot]=nextId;
        foundEquipped=true;
      }
    }
    if(foundEquipped){
      try{
        let saves=volandGetSaves();
        let idx=volandGetActiveIndex();
        if(saves.length>0){
          saves[idx].equip = equipped;
          volandSaveSaves(saves);
        }
        localStorage.setItem('voland_v1_equip', JSON.stringify(equipped));
      }catch(e){}
    } else {
      try{
        let inv = volandGetInventory();
        let nextBase = volandGetItemBaseId(nextId);
        let oldBase = volandGetItemBaseId(itemId);
        let targetBase = nextBase || oldBase;
        inv = inv.filter(x=> volandGetItemBaseId(x.id)!==targetBase && x.id!==itemId );
        inv.push({id:nextId, time:Date.now()});
        volandSaveInventory(inv);
      }catch(e){
        let inv = volandGetInventory();
        let idx = inv.findIndex(x=>x.id===itemId);
        if(idx>=0){
          inv[idx].id = nextId;
          volandSaveInventory(inv);
        } else {
          volandAddToInventory(nextId);
        }
      }
    }
    return {success:true, nextId:nextId, cost:cost};
  }catch(e){ return {success:false, reason:'EXCEPTION '+e}; }
}


// === STAMINA / HP / MANA REGEN SYSTEM ===
// Rates: STAMINA 2 per 3 min = 1 per 90 sec, HP 10 per min = 1 per 6 sec, MANA 3 per min = 1 per 20 sec
const VOLAND_STAMINA_MAX = 100;
const VOLAND_STAMINA_REGEN_MS = 90 * 1000; // 90 sec per 1 stamina
const VOLAND_HP_REGEN_MS = 6 * 1000; // 6 sec per 1 HP (10 per min)
const VOLAND_MANA_REGEN_MS = 20 * 1000; // 20 sec per 1 MANA (3 per min)

const VOLAND_STAMINA_COSTS = {
  // loc: { stage: cost } — формула: loc, loc+1, loc+2, loc x 5
  1: {1:1, 2:2, 3:3, 4:5}, // desert 1,2,3 boss 5
  2: {1:2, 2:3, 3:4, 4:10}, // forest 2,3,4 boss 10
  3: {1:3, 2:4, 3:5, 4:15}, // frost 3,4,5 boss 15
  4: {1:4, 2:5, 3:6, 4:20}, // swamp 4,5,6 boss 20
  5: {1:5, 2:6, 3:7, 4:25}, // volcano 5,6,7 boss 25
  6: {1:6, 2:7, 3:8, 4:30} // ruins 6,7,8 boss 30
};

function volandGetStaminaMax(){ return VOLAND_STAMINA_MAX; }

function volandGetStaminaData(){
  try{
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0 && saves[idx]){
      let s = saves[idx];
      if(typeof s.stamina === 'number' && typeof s.lastStaminaUpdate === 'number'){
        return {current: s.stamina, last: s.lastStaminaUpdate};
      }
      // NEW HERO isolation: full stamina for lvl1 hero, not global leak
      return {current: VOLAND_STAMINA_MAX, last: Date.now()};
    }
    // fallback localStorage (no active save)
    let cur = localStorage.getItem('voland_v1_stamina');
    let last = localStorage.getItem('voland_v1_stamina_last');
    if(cur!==null && last!==null){
      return {current: parseInt(cur)||VOLAND_STAMINA_MAX, last: parseInt(last)||Date.now()};
    }
    return {current: VOLAND_STAMINA_MAX, last: Date.now()};
  }catch(e){ return {current: VOLAND_STAMINA_MAX, last: Date.now()}; }
}

function volandSetStaminaData(current, last){
  try{
    current = Math.max(0, Math.min(VOLAND_STAMINA_MAX, parseInt(current)||0));
    last = last || Date.now();
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0){
      saves[idx].stamina = current;
      saves[idx].lastStaminaUpdate = last;
      volandSaveSaves(saves);
    }
    localStorage.setItem('voland_v1_stamina', String(current));
    localStorage.setItem('voland_v1_stamina_last', String(last));
    return current;
  }catch(e){ return current; }
}

function volandGetStamina(){
  try{
    let data = volandGetStaminaData();
    let now = Date.now();
    let elapsed = now - data.last;
    if(elapsed < 0) elapsed = 0;
    let regen = Math.floor(elapsed / VOLAND_STAMINA_REGEN_MS);
    if(regen > 0){
      let newCurrent = Math.min(VOLAND_STAMINA_MAX, data.current + regen);
      let newLast = data.last + regen * VOLAND_STAMINA_REGEN_MS;
      // if capped at max, reset last to now to avoid overflow
      if(newCurrent >= VOLAND_STAMINA_MAX){
        newCurrent = VOLAND_STAMINA_MAX;
        newLast = now;
      }
      volandSetStaminaData(newCurrent, newLast);
      return newCurrent;
    }
    return data.current;
  }catch(e){ return VOLAND_STAMINA_MAX; }
}

function volandSetStamina(val){
  return volandSetStaminaData(val, Date.now());
}

function volandAddStamina(delta){
  let cur = volandGetStamina();
  return volandSetStamina(cur + (parseInt(delta)||0));
}

function volandSpendStamina(cost){
  let cur = volandGetStamina();
  cost = parseInt(cost)||0;
  if(cur < cost) return false;
  volandSetStamina(cur - cost);
  return true;
}

function volandGetStaminaCost(loc, stage){
  try{
    loc = parseInt(loc)||1;
    stage = parseInt(stage)||1;
    if(VOLAND_STAMINA_COSTS[loc] && VOLAND_STAMINA_COSTS[loc][stage]){
      return VOLAND_STAMINA_COSTS[loc][stage];
    }
    // fallback: 1 + loc
    return loc;
  }catch(e){ return 1; }
}

// HP / MANA current with regen
function volandGetHPData(){
  try{
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0 && saves[idx]){
      if(typeof saves[idx].hp_current === 'number' && typeof saves[idx].lastHPUpdate === 'number'){
        return {current: saves[idx].hp_current, last: saves[idx].lastHPUpdate};
      }
      // NEW HERO isolation: full HP for lvl1
      let max = 1000;
      try{ max = volandCalcStats().cur.HP || 1000; }catch(e){}
      return {current: max, last: Date.now()};
    }
    let cur = localStorage.getItem('voland_v1_hp_current');
    let last = localStorage.getItem('voland_v1_hp_last');
    if(cur!==null && last!==null){
      return {current: parseInt(cur)||0, last: parseInt(last)||Date.now()};
    }
    let max = 1000;
    try{ max = volandCalcStats().cur.HP || 1000; }catch(e){}
    return {current: max, last: Date.now()};
  }catch(e){ return {current: 1000, last: Date.now()}; }
}

function volandSetHPData(current, last){
  try{
    let max = 1000;
    try{ max = volandCalcStats().cur.HP || 1000; }catch(e){}
    current = Math.max(0, Math.min(max, parseInt(current)||0));
    last = last || Date.now();
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0){
      saves[idx].hp_current = current;
      saves[idx].lastHPUpdate = last;
      volandSaveSaves(saves);
    }
    localStorage.setItem('voland_v1_hp_current', String(current));
    localStorage.setItem('voland_v1_hp_last', String(last));
    return current;
  }catch(e){ return current; }
}

function volandGetCurrentHP(){
  try{
    let data = volandGetHPData();
    let max = 1000;
    try{ max = volandCalcStats().cur.HP || 1000; }catch(e){}
    let now = Date.now();
    let elapsed = now - data.last;
    if(elapsed < 0) elapsed = 0;
    let regen = Math.floor(elapsed / VOLAND_HP_REGEN_MS);
    if(regen > 0 && data.current < max){
      let newCurrent = Math.min(max, data.current + regen);
      let newLast = data.last + regen * VOLAND_HP_REGEN_MS;
      if(newCurrent >= max){ newLast = now; }
      volandSetHPData(newCurrent, newLast);
      return newCurrent;
    }
    return Math.min(max, data.current);
  }catch(e){ try{ return volandCalcStats().cur.HP; }catch(_){ return 1000; } }
}

function volandSetCurrentHP(val){
  return volandSetHPData(val, Date.now());
}

function volandGetMANAData(){
  try{
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0 && saves[idx]){
      if(typeof saves[idx].mana_current === 'number' && typeof saves[idx].lastMANAUpdate === 'number'){
        return {current: saves[idx].mana_current, last: saves[idx].lastMANAUpdate};
      }
      // NEW HERO isolation: full MANA for lvl1
      let max = 200;
      try{ max = volandCalcStats().cur.MANA || 200; }catch(e){}
      return {current: max, last: Date.now()};
    }
    let cur = localStorage.getItem('voland_v1_mana_current');
    let last = localStorage.getItem('voland_v1_mana_last');
    if(cur!==null && last!==null){
      return {current: parseInt(cur)||0, last: parseInt(last)||Date.now()};
    }
    let max = 200;
    try{ max = volandCalcStats().cur.MANA || 200; }catch(e){}
    return {current: max, last: Date.now()};
  }catch(e){ return {current: 200, last: Date.now()}; }
}

function volandSetMANAData(current, last){
  try{
    let max = 200;
    try{ max = volandCalcStats().cur.MANA || 200; }catch(e){}
    current = Math.max(0, Math.min(max, parseInt(current)||0));
    last = last || Date.now();
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0){
      saves[idx].mana_current = current;
      saves[idx].lastMANAUpdate = last;
      volandSaveSaves(saves);
    }
    localStorage.setItem('voland_v1_mana_current', String(current));
    localStorage.setItem('voland_v1_mana_last', String(last));
    return current;
  }catch(e){ return current; }
}

function volandGetCurrentMANA(){
  try{
    let data = volandGetMANAData();
    let max = 200;
    try{ max = volandCalcStats().cur.MANA || 200; }catch(e){}
    let now = Date.now();
    let elapsed = now - data.last;
    if(elapsed < 0) elapsed = 0;
    let regen = Math.floor(elapsed / VOLAND_MANA_REGEN_MS);
    if(regen > 0 && data.current < max){
      let newCurrent = Math.min(max, data.current + regen);
      let newLast = data.last + regen * VOLAND_MANA_REGEN_MS;
      if(newCurrent >= max){ newLast = now; }
      volandSetMANAData(newCurrent, newLast);
      return newCurrent;
    }
    return Math.min(max, data.current);
  }catch(e){ try{ return volandCalcStats().cur.MANA; }catch(_){ return 200; } }
}

function volandSetCurrentMANA(val){
  return volandSetMANAData(val, Date.now());
}


// === BOSS DAILY LIMIT 10 PER BOSS (per loc) ===
const VOLAND_BOSS_DAILY_LIMIT = 10;

function volandGetBossKillDateStr(){
  let d = new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

function volandGetBossKillsData(){
  try{
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    let today = volandGetBossKillDateStr();
    if(saves.length>0 && saves[idx]){
      if(saves[idx].boss_kills_data){
        let data = saves[idx].boss_kills_data;
        if(data.date !== today){
          let empty = {date: today, kills:{}};
          saves[idx].boss_kills_data = empty;
          volandSaveSaves(saves);
          return empty;
        }
        return data;
      } else {
        // OLD HERO - migrate from global if exists, else empty
        let raw = localStorage.getItem('voland_v1_boss_kills');
        if(raw){
          try{
            let data = JSON.parse(raw);
            if(data && data.kills && Object.keys(data.kills).length>0){
              saves[idx].boss_kills_data = data;
              volandSaveSaves(saves);
              return data;
            }
          }catch(e){}
        }
        let empty = {date: today, kills:{}};
        saves[idx].boss_kills_data = empty;
        volandSaveSaves(saves);
        return empty;
      }
    }
    let raw = localStorage.getItem('voland_v1_boss_kills');
    if(!raw) return {date: today, kills:{}};
    let data = JSON.parse(raw);
    if(data.date !== today){
      return {date: today, kills:{}};
    }
    return data;
  }catch(e){ return {date: volandGetBossKillDateStr(), kills:{}}; }
}

function volandSaveBossKillsData(data){
  try{
    localStorage.setItem('voland_v1_boss_kills', JSON.stringify(data));
    // also save in saves for backup
    let saves = volandGetSaves();
    let idx = volandGetActiveIndex();
    if(saves.length>0){
      saves[idx].boss_kills_data = data;
      volandSaveSaves(saves);
    }
  }catch(e){}
}

function volandGetBossKills(loc){
  try{
    let data = volandGetBossKillsData();
    loc = String(parseInt(loc)||1);
    return parseInt(data.kills[loc]||0);
  }catch(e){ return 0; }
}

function volandAddBossKill(loc){
  try{
    let data = volandGetBossKillsData();
    loc = String(parseInt(loc)||1);
    data.kills[loc] = (parseInt(data.kills[loc]||0)+1);
    // cap at limit? keep counting but we check limit before battle
    volandSaveBossKillsData(data);
    return data.kills[loc];
  }catch(e){ return 0; }
}

function volandCanFightBoss(loc){
  let kills = volandGetBossKills(loc);
  return kills < VOLAND_BOSS_DAILY_LIMIT;
}

function volandGetBossKillsLeft(loc){
  let kills = volandGetBossKills(loc);
  return Math.max(0, VOLAND_BOSS_DAILY_LIMIT - kills);
}

function volandGetBossLimitInfo(loc){
  let kills = volandGetBossKills(loc);
  let left = VOLAND_BOSS_DAILY_LIMIT - kills;
  return {kills, limit: VOLAND_BOSS_DAILY_LIMIT, left: Math.max(0,left), canFight: kills < VOLAND_BOSS_DAILY_LIMIT};
}


function volandGetStaminaInfo(){
  let cur = volandGetStamina();
  let max = volandGetStaminaMax();
  let data = volandGetStaminaData();
  let now = Date.now();
  let elapsed = now - data.last;
  let toNext = VOLAND_STAMINA_REGEN_MS - (elapsed % VOLAND_STAMINA_REGEN_MS);
  if(cur >= max) toNext = 0;
  return {cur, max, toNext, pct: Math.round(cur/max*100)};
}


function volandGetItemById(itemId){
  try{
    if(typeof VOLAND_ITEMS!=='undefined'){
      return VOLAND_ITEMS.find(x=>x.id===itemId)||null;
    }
    return null;
  }catch(e){ return null; }
}

// Backward compat mapping old ids to new bw lvl1
const VOLAND_OLD_TO_NEW = {
  'head':'helmet-bw-lvl1',
  'armor':'armor-bw-lvl1',
  'amulet':'amulet-bw-lvl1',
  'gloves':'gloves-bw-lvl1',
  'boots':'boots-bw-lvl1',
  'ring1':'ring1-bw-lvl1',
  'ring2':'ring2-bw-lvl1',
  'ear1':'earring1-bw-lvl1',
  'ear2':'earring2-bw-lvl1',
  'weapon':'sword-bw-lvl1',
  'shield':'shield-bw-lvl1'
};

function volandResolveItemId(itemId){
  try{
    if(VOLAND_OLD_TO_NEW[itemId]) return VOLAND_OLD_TO_NEW[itemId];
    return itemId;
  }catch(e){ return itemId; }
}

// Override volandGetEquippedItems to resolve old ids
(function(){
  try{
    let orig = volandGetEquippedItems;
    window.volandGetEquippedItems = function(){
      try{
        let raw = volandGetEquipRaw();
        let eq = {};
        for(let slot in raw){
          let id = volandResolveItemId(raw[slot]);
          let item = null;
          if(typeof VOLAND_ITEMS!=='undefined'){
            item = VOLAND_ITEMS.find(x=>x.id===id);
            if(!item){
              // try find by base id?
              item = VOLAND_ITEMS.find(x=>x.id===raw[slot]);
            }
          }
          if(item) eq[slot]=item;
        }
        return eq;
      }catch(e){ return orig(); }
    };
  }catch(e){}
})();


function volandUsePotion(potionId){
 try{
  let item = null; if(typeof VOLAND_POTIONS!=='undefined') item = VOLAND_POTIONS.find(x=>x.id===potionId); if(!item && typeof VOLAND_ITEMS!=='undefined') item = VOLAND_ITEMS.find(x=>x.id===potionId);
  if(!item || item.type!=='potion' || !item.potion) return false;
  let p = item.potion;
  let saves = volandGetSaves();
  let idx = volandGetActiveIndex();
  if(saves.length===0) return false;
  let save = saves[idx];
  let inv = save.inventory || [];
  let invIdx = inv.findIndex(x=> (x.id||x)===potionId);
  if(invIdx===-1){
    if(typeof volandGetInventory==='function'){
      let globalInv = volandGetInventory();
      let gIdx = globalInv.findIndex(x=> (x.id||x)===potionId);
      if(gIdx===-1) return false;
    } else {
      return false;
    }
  }
  // apply effect - FIXED LOGIC per user: XL 1 hour
  if(p.stat==='HP'){
    if(p.percent){
      if(p.value===100){
        let max = volandCalcStats().cur.HP;
        volandSetCurrentHP(max);
      } else if(p.value===200){
        // HP XL: full +100% for 1h or until HP drops to normal
        let max = volandCalcStats().cur.HP;
        volandSetCurrentHP(max * 2);
        save.buffs = save.buffs || {};
        save.buffs.hpBonus = {value: max, until: Date.now() + 3600000, type:'double_until_normal'};
      }
    } else {
      let cur = volandGetCurrentHP();
      let max = volandCalcStats().cur.HP;
      let extra = (save.buffs && save.buffs.hpBonus) ? save.buffs.hpBonus.value : 0;
      let cap = max + extra;
      if(p.value>=1000) cap = max*2;
      volandSetCurrentHP(Math.min(cur + p.value, cap));
    }
  } else if(p.stat==='MANA'){
    if(p.percent){
      if(p.value===100){
        if(!p.tempBonus){
          let max = volandCalcStats().cur.MANA;
          volandSetCurrentMANA(max);
        } else {
          // MANA XL: +100% HP to existing HP (not full heal) for 1h
          let maxH = volandCalcStats().cur.HP;
          let curH = volandGetCurrentHP();
          // adds +100% max to existing HP, not heal to 100%
          let newHP = curH + maxH;
          volandSetCurrentHP(Math.min(newHP, maxH*2));
          let maxM = volandCalcStats().cur.MANA;
          volandSetCurrentMANA(maxM);
          save.buffs = save.buffs || {};
          save.buffs.hpBonus = {value: maxH, until: Date.now() + 3600000, type:'additive'};
        }
      }
    } else {
      let cur = volandGetCurrentMANA();
      let max = volandCalcStats().cur.MANA;
      volandSetCurrentMANA(Math.min(cur + p.value, max));
    }
  } else if(p.stat==='STAM'){
    if(p.percent){
      if(p.value===100){
        if(!p.tempBonus){
          volandSetStamina(100);
        } else {
          volandSetStamina(100);
          save.buffs = save.buffs || {};
          save.buffs.staminaRegen = {value:1000, until: Date.now() + 3600000};
        }
      }
    } else {
      let cur = volandGetStamina();
      volandSetStamina(Math.min(100, cur + p.value));
    }
  }
  if(invIdx!==-1){
    inv.splice(invIdx,1);
    save.inventory = inv;
    volandSaveSaves(saves);
  }
  if(typeof volandRemoveFromInventory==='function'){
    volandRemoveFromInventory(potionId);
  }
  volandSaveSaves(saves);
  return true;
 }catch(e){ console.error('potion use error', e); return false; }
}

// Check and clear expired buffs - call on load
function volandCheckBuffs(){
 try{
  let saves = volandGetSaves();
  let idx = volandGetActiveIndex();
  if(!saves[idx] || !saves[idx].buffs) return;
  let b = saves[idx].buffs;
  let now = Date.now();
  let curHP = volandGetCurrentHP();
  let maxHP = volandCalcStats().cur.HP;
  if(b.hpBonus && now >= b.until){
    // 1 hour expired
    if(curHP > maxHP) volandSetCurrentHP(maxHP);
    delete b.hpBonus;
  } else if(b.hpBonus && b.hpBonus.type==='double_until_normal' && curHP <= maxHP){
    // HP dropped to normal - remove buff early
    delete b.hpBonus;
  }
  if(b.staminaRegen && now >= b.until){
    delete b.staminaRegen;
  }
  volandSaveSaves(saves);
 }catch(e){}
}


// Stamina regen boost handling - modify volandGetStamina regen if buff active
function volandGetStaminaRegenBoost(){
 try{
  let saves = volandGetSaves();
  let idx = volandGetActiveIndex();
  if(saves[idx] && saves[idx].buffs && saves[idx].buffs.staminaRegen){
    let b = saves[idx].buffs.staminaRegen;
    if(Date.now() < b.until) return b.value;
    else { delete saves[idx].buffs.staminaRegen; volandSaveSaves(saves); }
  }
 }catch(e){}
 return 0;
}






function volandCleanupNonClassWeapons(){
 try{
  let heroId = 'necro-f-new';
  try{ heroId = volandGetHeroId() || 'necro-f-new'; }catch(e){}
  let classMap = {'necro-f-new':'mage','necro-m':'tank','archer-f':'archer','archer-m':'archer','archmage-m':'mage','warrior-f':'warrior','warrior-m':'warrior','mage-f-new':'mage'};
  let heroClass = classMap[heroId] || 'mage';
  let allowed = {'mage':['staff'],'archer':['bow'],'warrior':['sword'],'tank':['shield','sword']}[heroClass] || ['staff'];
  let saves = volandGetSaves();
  let idx = volandGetActiveIndex();
  if(saves[idx] && saves[idx].inventory){
    let inv = saves[idx].inventory;
    let filtered = inv.filter(item=>{
      let id = item.id || item;
      if(typeof id!=='string') return true;
      let base = id.split('-')[0];
      if(['sword','bow','staff','shield'].includes(base)){
        return allowed.includes(base);
      }
      return true;
    });
    if(filtered.length !== inv.length){
      console.log('Cleaned non-class weapons', inv.length - filtered.length);
      saves[idx].inventory = filtered;
      volandSaveSaves(saves);
      try{ localStorage.setItem('voland_v1_inventory', JSON.stringify(filtered)); }catch(e){}
    }
  }
 }catch(e){ console.log('cleanup error', e); }
}
try{ volandCleanupNonClassWeapons(); }catch(e){}

