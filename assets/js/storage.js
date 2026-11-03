// VOLAND STORAGE v2 - 3 saves + backward compat
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
    // filter invalid - but don't require hero in VOLAND_HEROES to avoid redirect loop when db fails
    saves = saves.filter(s=> s && s.hero && s.name);
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
    if(saves.length>0 && saves[idx] && typeof saves[idx].gold!=='undefined') return parseInt(saves[idx].gold)||0;
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
    if(saves.length>0 && saves[idx] && typeof saves[idx].xp!=='undefined') return parseInt(saves[idx].xp)||0;
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
    if(saves.length>0 && saves[idx] && saves[idx].resources) return saves[idx].resources;
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

function volandGetInventory(){
  try{
    let saves=volandGetSaves();
    let idx=volandGetActiveIndex();
    if(saves.length>0 && saves[idx] && saves[idx].inventory) return saves[idx].inventory;
    let raw = localStorage.getItem('voland_v1_inventory');
    if(raw) return JSON.parse(raw);
    return [];
  }catch(e){ return []; }
}
function volandSaveInventory(inv){
  try{
    if(!Array.isArray(inv)) inv=[];
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
    let inv=volandGetInventory();
    inv.push({id:itemId, time:Date.now()});
    return volandSaveInventory(inv);
  }catch(e){ return []; }
}
function volandRemoveFromInventory(itemId){
  try{
    let inv=volandGetInventory();
    let idx=inv.findIndex(x=>x.id===itemId);
    if(idx>=0){ inv.splice(idx,1); }
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
    // deduct gold
    volandSetGold(volandGetGold() - cost.gold);
    // deduct resources
    let res = volandGetResources();
    for(let rid in cost.resources){
      res[rid] = Math.max(0, (res[rid]||0) - cost.resources[rid]);
    }
    volandSetResources(res);
    // replace item in inventory/equip
    let nextId = cost.nextId;
    // if item is equipped, replace equipped
    let equipped = volandGetEquipRaw();
    let foundEquipped = false;
    for(let slot in equipped){
      if(equipped[slot]===itemId){
        equipped[slot]=nextId;
        foundEquipped=true;
      }
    }
    if(foundEquipped){
      // save equipped
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
      // if in inventory, replace
      let inv = volandGetInventory();
      let idx = inv.findIndex(x=>x.id===itemId);
      if(idx>=0){
        inv[idx].id = nextId;
        volandSaveInventory(inv);
      } else {
        // if not found, add next and remove old if exists
        volandAddToInventory(nextId);
      }
    }
    return {success:true, nextId:nextId, cost:cost};
  }catch(e){ return {success:false, reason:'EXCEPTION '+e}; }
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
