// VOLAND PVP ENGINE V2 - Fixed stun lock, auto skip
(function(){
const DIFF_MULT = { easy: 0.3, medium: 1.0, hard: 1.3 };
let player = null;
let bot = null;
let turn = 1;
let isOver = false;
let playerStun = 0;
let botStun = 0;
let playerCd = [0,0,0,0,0];
let botCd = [0,0,0,0,0];
let logEl, pHpBar, bHpBar, pManaBar, bManaBar, pHpText, bHpText, pManaText, bManaText;

function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }

function getVH(){ 
  if(typeof VOLAND_HEROES !== 'undefined') return VOLAND_HEROES;
  if(typeof window !== 'undefined' && window.VOLAND_HEROES) return window.VOLAND_HEROES;
  return {};
}

function getHeroBase(heroId){
  try{
    let VH = getVH();
    if(VH && VH[heroId]){
      let h = VH[heroId];
      return { n: h.n, img: h.img, role: h.role, st: {...h.st}, sk: h.sk };
    }
  }catch(e){}
  return { n: heroId, img:'./assets/heroes/necro-f-new.webp', role:'HERO', st:{HP:1000,DEF:100,DMG:200,MANA:250,CRIT:15,DODGE:10}, sk:[] };
}

function calcStats(heroId, mult){
  let base = getHeroBase(heroId);
  let st = base.st;
  let cur = null;
  if(heroId === window.PLAYER_HERO_ID){
    try{ 
      if(typeof volandCalcStats==='function'){ 
        let calc = volandCalcStats(); 
        if(calc && calc.cur) cur = {...calc.cur};
        else if(calc && calc.HP) cur = {...calc};
      } 
    }catch(e){ console.log('calc error', e); }
  }
  if(!cur){
    cur = { HP: Math.floor(st.HP * mult), DEF: Math.floor(st.DEF * mult), DMG: Math.floor(st.DMG * mult), MANA: Math.floor(st.MANA * mult), CRIT: st.CRIT || 15, DODGE: st.DODGE || 10, PARRY: st.PARRY || 0 };
  } else {
    if(mult !== 1.0){ cur.HP = Math.floor((cur.HP||st.HP) * mult); cur.DMG = Math.floor((cur.DMG||st.DMG) * mult); cur.DEF = Math.floor((cur.DEF||st.DEF) * mult); cur.MANA = Math.floor((cur.MANA||st.MANA) * mult); }
    cur.HP = cur.HP || st.HP;
    cur.DMG = cur.DMG || st.DMG;
    cur.DEF = cur.DEF || st.DEF;
    cur.MANA = cur.MANA || st.MANA;
    cur.CRIT = cur.CRIT || st.CRIT || 15;
    cur.DODGE = cur.DODGE || st.DODGE || 10;
  }
  return { base, cur };
}

function initBattle(playerHeroId, botHeroId, diff){
  window.PLAYER_HERO_ID = playerHeroId;
  let pMult = 1.0; let bMult = DIFF_MULT[diff] || 1.0;
  let pData = calcStats(playerHeroId, pMult);
  let bData = calcStats(botHeroId, bMult);
  player = { id: playerHeroId, name: pData.base.n, img: pData.base.img, role: pData.base.role, maxHp: pData.cur.HP, hp: pData.cur.HP, maxMana: pData.cur.MANA, mana: pData.cur.MANA, dmg: pData.cur.DMG, def: pData.cur.DEF, crit: pData.cur.CRIT, dodge: pData.cur.DODGE, sk: pData.base.sk };
  bot = { id: botHeroId, name: bData.base.n, img: bData.base.img, role: bData.base.role, maxHp: bData.cur.HP, hp: bData.cur.HP, maxMana: bData.cur.MANA, mana: bData.cur.MANA, dmg: bData.cur.DMG, def: bData.cur.DEF, crit: bData.cur.CRIT, dodge: bData.cur.DODGE, sk: bData.base.sk };
  turn = 1; isOver = false; playerStun = 0; botStun = 0; playerCd = [0,0,0,0,0]; botCd = [0,0,0,0,0];
  setupUI();
  addLog(`⚔️ PVP START: ${player.name} vs ${bot.name} [${diff.toUpperCase()} ${Math.round(bMult*100)}%]`, 'skill');
  addLog(`Игрок: HP ${player.maxHp} DMG ${player.dmg} DEF ${player.def} | Бот: HP ${bot.maxHp} DMG ${bot.dmg} DEF ${bot.def}`, '');
  updateBars(); renderSkills();
}

function setupUI(){
  logEl = document.getElementById('battleLog');
  pHpBar = document.getElementById('pHpBar'); bHpBar = document.getElementById('bHpBar');
  pManaBar = document.getElementById('pManaBar'); bManaBar = document.getElementById('bManaBar');
  pHpText = document.getElementById('pHpText'); bHpText = document.getElementById('bHpText');
  pManaText = document.getElementById('pManaText'); bManaText = document.getElementById('bManaText');
  let pImg = document.getElementById('pImg'); let bImg = document.getElementById('bImg');
  if(pImg) pImg.src = player.img; if(bImg) bImg.src = bot.img;
  document.getElementById('pName').textContent = player.name; document.getElementById('bName').textContent = bot.name;
}

function updateBars(){
  if(!player || !bot) return;
  let pHpPct = Math.max(0, (player.hp / player.maxHp)*100);
  let bHpPct = Math.max(0, (bot.hp / bot.maxHp)*100);
  let pManaPct = Math.max(0, (player.mana / player.maxMana)*100);
  let bManaPct = Math.max(0, (bot.mana / bot.maxMana)*100);
  if(pHpBar) pHpBar.style.width = pHpPct+'%'; if(bHpBar) bHpBar.style.width = bHpPct+'%';
  if(pManaBar) pManaBar.style.width = pManaPct+'%'; if(bManaBar) bManaBar.style.width = bManaPct+'%';
  if(pHpText) pHpText.textContent = `${player.hp}/${player.maxHp}`; if(bHpText) bHpText.textContent = `${bot.hp}/${bot.maxHp}`;
  if(pManaText) pManaText.textContent = `${player.mana}/${player.maxMana}`; if(bManaText) bManaText.textContent = `${bot.mana}/${bot.maxMana}`;
}

function addLog(msg, type){
  if(!logEl) return;
  let div = document.createElement('div'); div.className = 'log-line '+(type||''); div.textContent = `[${turn}] ${msg}`;
  logEl.appendChild(div); logEl.scrollTop = logEl.scrollHeight;
}

function getSkillMeta(idx){
  const metas = { 0: {name:'ATK', mana:0, cd:1, mult:1.0, stun:0}, 1: {name:'Skill1', mana:10, cd:3, mult:2.0, stun:0}, 2: {name:'Skill2', mana:20, cd:8, mult:3.0, stun:1}, 3: {name:'Skill3', mana:30, cd:15, mult:2.5, stun:0}, 4: {name:'ULT', mana:60, cd:20, mult:5.0, stun:0} };
  return metas[idx] || metas[0];
}

function getPlayerSkillMeta(idx){
  if(idx===0) return {name:'ATK', mana:0, cd:1, mult:1.0, stun:0};
  try{ let VH = getVH(); let hero = VH ? VH[player.id] : null; if(hero && hero.sk && hero.sk[idx]){ let meta = getSkillMeta(idx); meta.name = hero.sk[idx][0]; if(idx===4) meta.mult = 5.5; return meta; } }catch(e){}
  return getSkillMeta(idx);
}

function getBotSkillMeta(idx, diff){
  let meta = getSkillMeta(idx);
  try{ let VH = getVH(); let hero = VH ? VH[bot.id] : null; if(hero && hero.sk && hero.sk[idx]){ meta.name = hero.sk[idx][0]; } }catch(e){}
  if(diff==='easy') meta.mult *= 0.9; if(diff==='hard') meta.mult *= 1.2;
  if(idx===4){ if(diff==='easy') meta.mult = 4.0; if(diff==='medium') meta.mult = 5.5; if(diff==='hard') meta.mult = 7.0; }
  return meta;
}

function playerAction(idx){
  if(isOver) return;
  if(playerStun>0){
    addLog(`💤 Ты оглушен ${playerStun}р, пропускаешь ход`, 'lose');
    playerStun--;
    endPlayerTurn();
    return;
  }
  if(playerCd[idx]>0){ addLog(`⛔ Скилл на КД ${playerCd[idx]}р`, 'lose'); return; }
  let meta = getPlayerSkillMeta(idx);
  if(player.mana < meta.mana){ addLog(`⛔ Не хватает маны ${meta.mana} (есть ${player.mana})`, 'lose'); return; }
  player.mana -= meta.mana; playerCd[idx] = meta.cd;
  let dmg = Math.floor(player.dmg * meta.mult); dmg = Math.max(10, dmg - bot.def + rand(-15,15));
  let isCrit = Math.random()*100 < player.crit; if(isCrit) dmg = Math.floor(dmg*1.4);
  let isDodge = Math.random()*100 < bot.dodge;
  if(isDodge){ addLog(`💨 ${bot.name} уклонился от ${meta.name}!`, 'enemy-hit'); }
  else { bot.hp = Math.max(0, bot.hp - dmg); addLog(`🔥 Ты ${meta.name} [${Math.round(meta.mult*100)}%] → ${bot.name} на ${dmg}${isCrit?' CRIT!':''}`, isCrit?'crit':'hit'); if(meta.stun>0){ botStun = Math.max(botStun, meta.stun); addLog(`💫 ${bot.name} оглушен ${meta.stun}р!`, 'skill'); } }
  updateBars(); if(bot.hp<=0){ win(); return; } endPlayerTurn();
}

function endPlayerTurn(){
  for(let i=0;i<playerCd.length;i++) if(playerCd[i]>0) playerCd[i]--;
  player.mana = Math.min(player.maxMana, player.mana+8); updateBars(); renderSkills();
  setTimeout(botTurn, 500);
}

function botTurn(){
  if(isOver) return;
  if(botStun>0){
    addLog(`💤 ${bot.name} оглушен ${botStun}р, пропускает ход`, 'hit');
    botStun--;
    bot.mana = Math.min(bot.maxMana, bot.mana+8);
    for(let i=0;i<botCd.length;i++) if(botCd[i]>0) botCd[i]--;
    updateBars(); turn++; addLog(`--- Ход ${turn}: твой ход ---`, ''); renderSkills();
    if(playerStun>0){ setTimeout(autoPlayerStunSkip, 700); }
    return;
  }

  let diff = window.CURRENT_DIFF || 'medium';
  let action = chooseBotAction(diff);

  if(action.type==='skip'){
    addLog(`💤 ${bot.name} пропускает ход (нет маны)`, 'hit');
  } else {
    let idx = action.idx; let meta = getBotSkillMeta(idx, diff);
    bot.mana -= meta.mana; botCd[idx] = meta.cd;
    let dmg = Math.floor(bot.dmg * meta.mult); dmg = Math.max(10, dmg - player.def + rand(-15,15));
    let isCrit = Math.random()*100 < bot.crit; if(isCrit) dmg = Math.floor(dmg*1.4);
    let isDodge = Math.random()*100 < player.dodge;
    if(isDodge){ addLog(`💨 Ты уклонился от ${meta.name} бота!`, 'hit'); }
    else { player.hp = Math.max(0, player.hp - dmg); addLog(`💥 ${bot.name} ${meta.name} [${Math.round(meta.mult*100)}%] → ты на ${dmg}${isCrit?' CRIT!':''}`, isCrit?'lose':'enemy-hit'); if(meta.stun>0){ playerStun = Math.max(playerStun, meta.stun); addLog(`💫 Ты оглушен ${meta.stun}р!`, 'lose'); } }
  }

  for(let i=0;i<botCd.length;i++) if(botCd[i]>0) botCd[i]--;
  bot.mana = Math.min(bot.maxMana, bot.mana+8); updateBars();
  if(player.hp<=0){ lose(); return; }
  turn++; addLog(`--- Ход ${turn}: твой ход ---`, ''); renderSkills();

  if(playerStun>0){
    setTimeout(autoPlayerStunSkip, 700);
  }
}

function autoPlayerStunSkip(){
  if(isOver) return;
  if(playerStun<=0) return;
  addLog(`💤 Ты оглушен ${playerStun}р, пропускаешь ход (авто)`, 'lose');
  playerStun--;
  for(let i=0;i<playerCd.length;i++) if(playerCd[i]>0) playerCd[i]--;
  player.mana = Math.min(player.maxMana, player.mana+8);
  updateBars();
  turn++;
  addLog(`--- Ход ${turn}: ход ${bot.name} ---`, '');
  renderSkills();
  setTimeout(botTurn, 600);
}

function chooseBotAction(diff){
  let available = [];
  for(let i=0;i<=4;i++){ if(botCd[i]<=0){ let meta = getBotSkillMeta(i, diff); if(bot.mana >= meta.mana) available.push({idx:i, meta}); } }
  if(available.length===0) return {type:'skip'};
  let playerHpPct = player.hp / player.maxHp; let botHpPct = bot.hp / bot.maxHp;
  if(diff==='easy'){ if(Math.random()<0.5){ let atk = available.find(a=>a.idx===0); if(atk) return atk; } return available[Math.floor(Math.random()*available.length)]; }
  if(diff==='medium' || diff==='hard'){
    let ult = available.find(a=>a.idx===4); if(ult && playerHpPct<0.35) return ult;
    if(botHpPct<0.35){ let def = available.find(a=>a.idx===3); if(def) return def; }
    if(playerStun===0){ let stunSkill = available.find(a=>a.meta.stun>0); if(stunSkill) return stunSkill; }
    available.sort((a,b)=> b.meta.mult - a.meta.mult); return available[0];
  }
  return available[0];
}

function win(){
  isOver = true; addLog(`✅ ПОБЕДА! Ты победил ${bot.name} [${window.CURRENT_DIFF}]`, 'win');
  document.getElementById('resultModal').classList.add('show'); document.getElementById('resultTitle').textContent = 'ПОБЕДА!'; document.getElementById('resultSub').textContent = `${player.name} победил ${bot.name} • ${window.CURRENT_DIFF.toUpperCase()}`;
  try{ if(typeof volandAddGold==='function') volandAddGold(50); }catch(e){}
}
function lose(){
  isOver = true; addLog(`❌ ПОРАЖЕНИЕ! Тебя победил ${bot.name}`, 'lose');
  document.getElementById('resultModal').classList.add('show'); document.getElementById('resultTitle').textContent = 'ПОРАЖЕНИЕ!'; document.getElementById('resultSub').textContent = `${bot.name} победил • ${window.CURRENT_DIFF.toUpperCase()}`;
}
function renderSkills(){
  let bar = document.getElementById('skillBar'); if(!bar) return; let html = '';
  for(let i=0;i<=4;i++){ let meta = getPlayerSkillMeta(i); let cd = playerCd[i]; let can = cd<=0 && player.mana>=meta.mana && playerStun===0 && !isOver; let key = ['Q','W','E','R','T'][i]; html += `<button class="skill-btn ${can?'':'disabled'}" onclick="window.pvpPlayerAction(${i})" ${can?'':'disabled'}><div class="key">${key}</div><div class="name">${meta.name}</div><div class="meta">${meta.mana} mana ${cd>0?'• CD '+cd:''}</div></button>`; }
  bar.innerHTML = html;
}
window.pvpPlayerAction = playerAction; window.pvpInit = initBattle;
})();
