// VOLAND BATTLE ENGINE v1 - база, чистый старт
// DMG-DEF+rand, полоски HP/MANA, QWER, win/lose, грузит механику героя из heroes/${heroId}.js
(function(){
if(typeof volandHasSave==='function' && !volandHasSave()) location.href='./page2.html';
const p=new URLSearchParams(location.search);
const loc=parseInt(p.get('loc')||localStorage.getItem('voland_location')||'1');
const stage=parseInt(p.get('stage')||localStorage.getItem('voland_last_stage')||'1');
if(stage===4 && typeof volandCanFightBoss==='function' && !volandCanFightBoss(loc)){ try{ var _bi=typeof volandGetBossLimitInfo==='function'?volandGetBossLimitInfo(loc):{kills:10,limit:10}; alert('Лимит боссов на сегодня! Ты уже убил '+_bi.kills+'/'+_bi.limit+' боссов этой локи.\nПриходи завтра. Сброс в полночь.'); }catch(e){} location.href='./page7.html?loc='+loc; return; }

let heroId=(typeof volandGetHeroId==='function'?volandGetHeroId():'necro-f-new');
if(typeof VOLAND_HEROES!=='undefined' && !VOLAND_HEROES[heroId]) heroId=Object.keys(VOLAND_HEROES)[0]||'necro-f-new';
const heroData=VOLAND_HEROES[heroId];
const calc=(typeof volandCalcStats==='function'?volandCalcStats():{cur:heroData.st,bonus:{}});
const cur=calc.cur;
const profileName=(typeof volandGetName==='function'?volandGetName():'VOLAND');

let enemies=(VOLAND_ENEMIES&&VOLAND_ENEMIES[loc])?VOLAND_ENEMIES[loc]:null;
if(!enemies){ enemies=VOLAND_ENEMIES[1]; }
let enemyData=enemies.find(e=>e.stage===stage)||enemies[0];
let locData=(VOLAND_LOCATIONS&&VOLAND_LOCATIONS.find(l=>l.id==loc))||{name:'ПУСТЫНЯ',eng:'DESERT'};

document.getElementById('locTitle').textContent=locData.name;
document.getElementById('stageTitle').textContent='STAGE '+stage+' • '+enemyData.name;
if(enemyData.img){ document.getElementById('enemyIcon').innerHTML='<img src="'+enemyData.img+'" style="width:100%;height:100%;object-fit:cover;border-radius:8px" onerror="this.parentNode.textContent=\''+enemyData.icon+'\'">'; } else { document.getElementById('enemyIcon').textContent=enemyData.icon; }
document.getElementById('enemyName').textContent=enemyData.name;
document.getElementById('enemyEng').textContent=enemyData.eng;
document.getElementById('enemyDesc').textContent=enemyData.desc||'';
document.getElementById('heroIcon').innerHTML='<img src="'+heroData.img+'" onerror="this.parentNode.textContent=\'🦁\'">';
document.getElementById('heroName').textContent=profileName.toUpperCase();
document.getElementById('heroRole').textContent=heroData.n+' • '+heroData.role;

// Статы врага - только из enemies.js (VOLAND_ENEMIES). Копий нет.
let eDef = parseInt(enemyData.def)||100;
let eDmg = parseInt(enemyData.dmg)||150;
let eMaxHp = parseInt(enemyData.hp)||4000;
const baseEDmg = eDmg;

// HP/MANA from storage with regen - after battle stays low then regens
let storedHP = cur.HP, storedMANA = cur.MANA;
try{
  if(typeof volandGetCurrentHP==='function') storedHP = volandGetCurrentHP();
  if(typeof volandGetCurrentMANA==='function') storedMANA = volandGetCurrentMANA();
}catch(e){}
let eHp=eMaxHp, hHp=storedHP, hMax=cur.HP, hMana=storedMANA, hMaxMana=cur.MANA;
if(hHp<=0) hHp = Math.min(100, hMax); // if dead before, give 100 HP to start
if(hMana<0) hMana = 0;

let turn=1, enemyStun=0, cooldowns=[0,0,0,0,0], isBattleOver=false;
let spellCount=0;

// общие статусы - могут использоваться героями
window.VB={eDef, get eDmg(){return eDmg}, set eDmg(v){eDmg=v}, baseEDmg, eMaxHp, get eHp(){return eHp}, set eHp(v){eHp=v}, get hHp(){return hHp}, set hHp(v){hHp=v}, get hMana(){return hMana}, set hMana(v){hMana=v}, get hMax(){return hMax}, set hMax(v){hMax=v}, cur, heroData, enemyData, loc, stage, _lastEnemyDmg:0, _linkActive:false};

function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
const logZone=document.getElementById('logZone');
function addLog(t,c=''){ try{ if(typeof volandBattleLog==='function') t=volandBattleLog(t); }catch(e){} const d=document.createElement('div'); d.className='log-line '+c; d.textContent=t; logZone.appendChild(d); logZone.scrollTop=9999; }
window.VB.addLog=addLog;

function parseMultiHit(full){
 // Мульти-удар V2: каждый удар отдельно. Ищем N по X% / Каждая X%.
 // Призыв скелетов не считаем мульти-ударом, это саммоны, а не прямой урон.
 if(/Призывает.*скелет/i.test(full)) return null;
 if(!/кажд/i.test(full) && !/по\s*\d+%/i.test(full)) return null;
 let countMatch = full.match(/(\d+)\s*(?:аметистовых\s+)?(?:душ|стрел|стрелы|удара|ударов|метеора|метеоров)/i);
 if(!countMatch) return null;
 let hits = parseInt(countMatch[1]);
 if(hits<2 || hits>20) return null;
 let perMatch = full.match(/кажд[а-я]+\s+[^%]*?(\d+)%/i) || full.match(/по\s*(\d+)%/i);
 if(!perMatch) return null;
 let perHit = parseInt(perMatch[1]);
 if(perHit<50 || perHit>1000) return null;
 return {hits:hits, perHit:perHit};
}
function parseSkill(sk){
 const full=(sk[4]||'')+' '+(sk[5]||'');
 const manaMatch=full.match(/Мана:\s*(\d+)/i);
 const cdMatch=full.match(/КД:\s*(\d+)/i);
 const dmgMatches=[...full.matchAll(/(\d+)%\s*урона/gi)];
 let maxDmg=0; dmgMatches.forEach(m=>{let v=parseInt(m[1]); if(v>maxDmg) maxDmg=v;});
 let mh=parseMultiHit(full);
 return {name:sk[0],num:sk[1],icons:sk[2]||[],emoji:sk[3]||'⚔️',desc:sk[4]||'',short:sk[5]||'',mana:manaMatch?parseInt(manaMatch[1]):0,cd:cdMatch?parseInt(cdMatch[1]):0,dmgPct:maxDmg||0,hasStun:/стан|оглуш/i.test(full),hits:mh?mh.hits:1,perHitPct:mh?mh.perHit:(maxDmg||0)};
}
const allSkills=heroData.sk.map(parseSkill);
const passive=allSkills[0];
const activeSkills=allSkills.slice(1);
function getMult(s,i){ if(s.dmgPct>0) return s.dmgPct/100; return [2.0,3.0,2.0,7.0][i]||2.0; }

window.VB.allSkills=allSkills; window.VB.activeSkills=activeSkills; window.VB.passive=passive;

function updBars(){
 document.getElementById('heroHpBar').style.width=Math.max(0,hHp/hMax*100)+'%';
 document.getElementById('heroHpBar').textContent='HP '+hHp+'/'+hMax;
 document.getElementById('heroManaBar').style.width=Math.max(0,hMana/hMaxMana*100)+'%';
 document.getElementById('heroManaBar').textContent='MANA '+hMana+'/'+hMaxMana;
 document.getElementById('enemyHpBar').style.width=Math.max(0,eHp/eMaxHp*100)+'%';
 document.getElementById('enemyHpBar').textContent='HP '+eHp+'/'+eMaxHp;
 let stat='DEF '+eDef+' • DMG '+eDmg;
 if(enemyStun>0) stat+=' • STUN '+enemyStun;
 if(window.VB.extraStat) stat+=' • '+window.VB.extraStat();
 document.getElementById('enemyStatBar').textContent=stat;
 document.getElementById('turnInfo').textContent='ХОД '+turn+' • '+(isBattleOver?'КОНЕЦ':'ТВОЙ ХОД')+' • MANA '+hMana;
}
window.VB.updBars=updBars;

function renderSkillBar(){
 const bar=document.getElementById('skillBar'); bar.innerHTML='';
 const list=[{name:'АТАКА',emoji:'⚔️',mana:0,cd:0,icons:[],isAttack:true,key:'Q'}, ...activeSkills.map((s,i)=>({...s,idx:i,key:['W','E','R','T'][i]}))];
 list.forEach((s,idx)=>{
  const cd=cooldowns[idx]; const can=s.isAttack||hMana>=s.mana; const dis=cd>0||!can||isBattleOver||(!heroModuleLoaded && !heroModuleFailed);
  const btn=document.createElement('div'); btn.className='skill-btn'+(dis?' disabled':'')+(s.num=='4'?' ultimate':'');
  btn.onclick=()=>{if(!dis) useAction(idx);};
  const iconPath=s.icons&&s.icons[0]?s.icons[0]:'';
  let iconHtml=iconPath?'<img src="'+iconPath+'" onerror="this.style.display=\'none\'; this.parentNode.textContent=\''+s.emoji+'\'">' : (s.emoji||'⚔️');
  btn.innerHTML='<div class="skill-icon">'+iconHtml+'</div><div class="skill-name">'+(s.isAttack?'АТАКА':(typeof volandSkillName==='function' ? volandSkillName(s.name) : s.name).toUpperCase().slice(0,12))+'</div><div class="skill-cost '+(s.mana==0?'zero':'')+'">'+(s.isAttack?'0':s.mana)+'</div><div class="skill-key">'+s.key+'</div>'+(cd>0?'<div class="skill-cd">'+cd+'</div>':'');
  btn.title=s.isAttack?'Атака DMG '+cur.DMG+' - DEF '+eDef+' + rand' : s.name+'\n'+s.desc+'\n'+s.short;
  bar.appendChild(btn);
 });
}
window.VB.renderSkillBar=renderSkillBar;

async function useAction(idx){
 if(isBattleOver) return; if(cooldowns[idx]>0) return;
 if(!heroModuleLoaded && !heroModuleFailed){ addLog('⏳ Механика героя ещё грузится, жди...','skill'); return; }
 // хук героя
 if(window.VOLAND_HERO_USE_SKILL){
   let handled = await window.VOLAND_HERO_USE_SKILL(idx, {cur, eDef, eDmg, eMaxHp, get eHp(){return eHp}, set eHp(v){eHp=v}, get hHp(){return hHp}, set hHp(v){hHp=v}, get hMana(){return hMana}, set hMana(v){hMana=v}, hMax, hMaxMana, enemyData, heroData, activeSkills, getMult, rand, addLog, updBars, cooldowns, turn, spellCount, enemyStun, setEnemyStun:v=>enemyStun=v, isBattleOver, allSkills});
   if(handled){ if(idx===4 && typeof volandUpdateMissionStat==='function'){ try{ volandUpdateMissionStat('ult', null, 1); }catch(e){} } spellCount++; afterHeroAction(); return; }
 }
 // база
 let dmg=0, isCrit=false;
 if(idx===0){
  isCrit=Math.random()*100<cur.CRIT;
  let base=Math.max(10, cur.DMG - eDef + rand(-12,12));
  if(isCrit) base=Math.floor(base*1.5);
  dmg=base;
  addLog('⚔️ Ты бьешь '+enemyData.name+' [АТАКА] на '+dmg+(isCrit?' CRIT!':''),'hit');
  cooldowns[0]=1;
 }else{
  const sk=activeSkills[idx-1];
  if(hMana<sk.mana){ addLog('⛔ Не хватает маны! Нужно '+sk.mana,'lose'); return; }
  if(idx===4 && typeof volandUpdateMissionStat==='function'){ try{ volandUpdateMissionStat('ult', null, 1); }catch(e){} }
  hMana-=sk.mana; cooldowns[idx]=sk.cd||1; if(cooldowns[idx]==0) cooldowns[idx]=1;
  // Мульти-удар V2: каждый удар отдельно, свой крит, свой DEF, свой лог, стоп если враг умер.
  let hits=sk.hits||1;
  let perHitPct=sk.perHitPct||0;
  if(hits>1 && perHitPct>0){
    let total=0;
    for(let hi=0; hi<hits; hi++){
      let m=perHitPct/100;
      let b=Math.max(15, Math.floor(cur.DMG*m) - eDef + rand(-10,10));
      let c=Math.random()*100<cur.CRIT; if(c) b=Math.floor(b*1.4);
      total+=b;
      eHp=Math.max(0, eHp-b);
      addLog('🔮 '+sk.name+' [удар '+(hi+1)+'/'+hits+' '+perHitPct+'%] → '+enemyData.name+' на '+b+(c?' CRIT!':''),'skill');
      updBars();
      if(eHp<=0){ addLog('✅ ПОБЕДА! '+enemyData.name+' убит!','win'); showVictory(); return; }
    }
    if(sk.hasStun){ enemyStun=1; addLog('💫 '+sk.name+' оглушает на 1 раунд!','skill'); }
    addLog('🔮 '+sk.name+' итого '+total+' ['+hits+'x'+perHitPct+'%]','skill');
    afterHeroAction(); return;
  }
  let mult=getMult(sk, idx-1);
  let base=Math.floor(cur.DMG*mult);
  base=Math.max(15, base - eDef + rand(-10,10));
  isCrit=Math.random()*100<cur.CRIT; if(isCrit) base=Math.floor(base*1.4);
  dmg=base;
  if(sk.hasStun){ enemyStun=1; addLog('💫 '+sk.name+' оглушает на 1 раунд!','skill'); }
  addLog('🔮 '+sk.name+' ['+Math.round(mult*100)+'%] → '+enemyData.name+' на '+dmg+(isCrit?' CRIT!':''),'skill');
 }
 eHp=Math.max(0,eHp-dmg);
 updBars();
 if(eHp<=0){ addLog('✅ ПОБЕДА! '+enemyData.name+' убит!','win'); showVictory(); return; }
 afterHeroAction();
}

function afterHeroAction(){
 spellCount++;
 // хук конца хода героя
 if(window.VOLAND_HERO_ON_TURN_END) window.VOLAND_HERO_ON_TURN_END({cur, eDef, eDmg, eMaxHp, get eHp(){return eHp}, set eHp(v){eHp=v}, get hHp(){return hHp}, set hHp(v){hHp=v}, get hMana(){return hMana}, set hMana(v){hMana=v}, hMax, hMaxMana, addLog, updBars, rand, enemyData, turn});
 if(eHp<=0){ addLog('✅ ПОБЕДА!','win'); showVictory(); return; }
 setTimeout(enemyTurn, 400);
}

function enemyTurn(){
 if(isBattleOver) return;
 // мгновенный стан от скилов типа Буря Стрел - должен сработать ДО проверки стана
 if(window.VB && window.VB._setStun){
  enemyStun = Math.max(enemyStun, window.VB._setStun);
  addLog('💫 Стан от скила '+window.VB._setStun+'р','skill');
  window.VB._setStun=0;
  updBars();
 }
 if(window.VOLAND_HERO_ON_ENEMY_TURN){
   let skip = window.VOLAND_HERO_ON_ENEMY_TURN({cur, eDef, eDmg, eMaxHp, get eHp(){return eHp}, set eHp(v){eHp=v}, get hHp(){return hHp}, set hHp(v){hHp=v}, addLog, updBars, rand, enemyStun});
   if(skip){ endRound(); return; }
 }
 if(enemyStun>0){ addLog('💤 '+enemyData.name+' оглушен, пропускает ход [стан '+enemyStun+'→'+(enemyStun-1)+']','hit'); enemyStun--; endRound(); return; }
 let effectiveDmg = window.VB.eDmg; // может быть снижен страхом -15%
 let dmgToHero=Math.max(10, effectiveDmg - cur.DEF + rand(-10,10));
 window.VB._lastEnemyDmg = dmgToHero;
 hHp=Math.max(0,hHp-dmgToHero);
 addLog('💥 '+enemyData.name+' бьет тебя на '+dmgToHero+' — HP '+hHp+'/'+hMax,'enemy-hit');
 // instant link reflect - если есть у героя
 if(window.VOLAND_HERO_ON_ENEMY_HIT){
  try{ window.VOLAND_HERO_ON_ENEMY_HIT({dmgToHero, cur, eDef, eDmg: effectiveDmg, addLog, updBars, rand}); }catch(e){  }
 }
 updBars();
 if(hHp<=0){ addLog('❌ ПОРАЖЕНИЕ!','lose'); showDefeat(); return; }
 endRound();
}

function endRound(){
 // сначала все доты / таймеры конца раунда
 if(window.VOLAND_HERO_ON_ROUND_END) window.VOLAND_HERO_ON_ROUND_END({turn});
 // победа от дота / взрыва с задержкой
 if(eHp<=0){ addLog('✅ ПОБЕДА! '+enemyData.name+' убит!','win'); showVictory(); return; }
 if(hHp<=0){ addLog('❌ ПОРАЖЕНИЕ!','lose'); showDefeat(); return; }
 turn++;
 for(let i=0;i<cooldowns.length;i++){ if(cooldowns[i]>0) cooldowns[i]--; }
 hMana=Math.min(hMaxMana,hMana+8);
 updBars(); renderSkillBar();
 addLog('--- Ход '+turn+': твой ход ---','');
}


function showVictory(){
  isBattleOver=true;
  // Награды ТОЛЬКО из VOLAND_ENEMIES (enemies.js).
  let goldReward = (enemyData && enemyData.gold) ? parseInt(enemyData.gold) : 5;
  let xpReward = (enemyData && enemyData.xp) ? parseInt(enemyData.xp) : 80;

  // ЕДИНЫЙ РОЛЛ ЛУТА — один раз на всю победу.
  // То, что выпало здесь, и показывается в модалке, и выдаётся в сумку.
  // Второго ролла больше нет, расхождения между модалкой и сумкой быть не может.
  let drop = {resources:[], potions:[]};
  try{
    if(typeof volandRollDrops==='function'){
      drop = volandRollDrops(enemyData) || drop;
    } else {
      // Единственный ролл лута - в loot/drop.js (volandRollDrops). Второго ролла здесь нет.
      drop = {resources:[], potions:[]};
    }
  }catch(e){ drop = {resources:[], potions:[]}; }

  // Показ в модалке — из ТОГО ЖЕ drop, что выдаём. Каждый предмет — в своём окошке.
  try{
    document.getElementById('rewGold').textContent='+'+goldReward;
    document.getElementById('rewXp').textContent='+'+xpReward;
    let lootBoxesEl = document.getElementById('lootBoxes');
    if(lootBoxesEl){
      let boxesHtml = '';
      // Ресурсы — каждый в своём окошке
      drop.resources.forEach(r=>{
        let res = (typeof VOLAND_RESOURCES!=='undefined') ? VOLAND_RESOURCES.find(x=>x.id===r.id) : null;
        let icon = res && res.icon ? res.icon : './assets/ui/loot/essence.webp';
        let name = res ? (typeof volandResourceName==='function' ? volandResourceName(res) : res.name) : r.id;
        let cnt = r.count||1;
        boxesHtml += '<div class="reward"><div><img src="'+icon+'" style="width:42px;height:42px;object-fit:contain;display:block" onerror="this.style.display=\'none\'"></div><div class="reward-val">'+(cnt>1 ? 'x'+cnt : '1')+'</div><div class="reward-lbl">'+name+'</div></div>';
      });
      // Зелья — каждое в своём окошке
      drop.potions.forEach(p=>{
        let pid = p.id || p;
        let it = null;
        if(typeof VOLAND_POTIONS!=='undefined') it = VOLAND_POTIONS.find(x=>x.id===pid);
        if(!it && typeof VOLAND_ITEMS!=='undefined') it = VOLAND_ITEMS.find(x=>x.id===pid);
        let icon = it && it.icon ? it.icon : './assets/ui/potions/hp-xs.webp';
        let name = it ? (typeof volandItemName==='function' ? volandItemName(it) : it.name) : pid;
        let cnt = p.count||1;
        boxesHtml += '<div class="reward"><div><img src="'+icon+'" style="width:42px;height:42px;object-fit:contain;display:block" onerror="this.style.display=\'none\'"></div><div class="reward-val">'+(cnt>1 ? 'x'+cnt : '1')+'</div><div class="reward-lbl">'+name+'</div></div>';
      });
      if(boxesHtml === ''){
        boxesHtml = '<div class="reward"><div><img src="./assets/ui/loot/essence.webp" style="width:42px;height:42px;object-fit:contain;display:block"></div><div class="reward-val">0</div><div class="reward-lbl">Нет лута</div></div>';
      }
      lootBoxesEl.innerHTML = boxesHtml;
    }
  }catch(e){}
  document.getElementById('modalTitle').textContent='ПОБЕДА!';
  document.getElementById('modalSub').textContent='Ты победил • '+enemyData.name+' • LOC'+loc+' STAGE'+stage;
  document.getElementById('victoryModal').classList.add('show');
  renderSkillBar();
  // Сохраняем награды — применяем ТОТ ЖЕ drop, без второго ролла
  try{
    if(typeof volandAddGold==='function') volandAddGold(goldReward);
    if(typeof volandAddXp==='function') volandAddXp(xpReward);
    if(typeof volandApplyDrops==='function'){
      volandApplyDrops(drop);
    } else {
      // Fallback-применение того же drop
      drop.resources.forEach(r=>{
        if(typeof volandAddResource==='function') volandAddResource(r.id, r.count||1);
      });
      drop.potions.forEach(p=>{
        let pid = p.id || p;
        if(typeof volandAddToInventory==='function') volandAddToInventory(pid);
      });
    }
    // SAVE HP/MANA after battle
    try{
      if(typeof volandSetCurrentHP==='function') volandSetCurrentHP(hHp);
      if(typeof volandSetCurrentMANA==='function') volandSetCurrentMANA(hMana);
    }catch(e){  }
    if(typeof volandAddKill==='function') volandAddKill();
    else {
      let saves=JSON.parse(localStorage.getItem('voland_v1_saves')||'[]');
      let idx=parseInt(localStorage.getItem('voland_v1_active')||'0');
      if(saves[idx]){ saves[idx].kills=(saves[idx].kills||0)+1; localStorage.setItem('voland_v1_saves', JSON.stringify(saves)); }
    }
    if(typeof volandUpdateMissionStat==='function'){
      volandUpdateMissionStat('kill_mob', loc, 1);
      if(enemyData && enemyData.boss){
        volandUpdateMissionStat('kill_boss', null, 1);
        volandUpdateMissionStat('kill_boss_diff', null, loc+'-'+stage);
        if(typeof volandAddBossKill==='function'){
          try{ var _canBoss=true; try{ if(typeof volandCanFightBoss==='function') _canBoss=volandCanFightBoss(loc); }catch(e){} if(_canBoss) volandAddBossKill(loc); }catch(e){  }
        } try{ if(enemyData && enemyData.boss && typeof volandCanFightBoss==='function' && !volandCanFightBoss(loc)){ var _b=document.getElementById('btnAgain'); if(_b){ _b.textContent='⛔ ЛИМИТ БОССА • К МОБАМ'; _b.onclick=function(){ location.href='./page7.html?loc='+loc; }; } } }catch(e){}
      }
    }
  }catch(e){  }
}


function showDefeat(){
  isBattleOver=true;
  // SAVE HP/MANA even on defeat - stays low then regens
  try{
    if(typeof volandSetCurrentHP==='function') volandSetCurrentHP(Math.max(0, hHp));
    if(typeof volandSetCurrentMANA==='function') volandSetCurrentMANA(Math.max(0, hMana));
  }catch(e){}
  document.getElementById('modalIcon').textContent='💀';
  document.getElementById('modalTitle').textContent='ПОРАЖЕНИЕ!';
  document.getElementById('modalSub').textContent='Тебя победил '+enemyData.name;
  // при поражении - без золота и лута, только 50% XP
  let xpReward = (enemyData && enemyData.xp) ? Math.floor(parseInt(enemyData.xp)*0.5) : 0;
  try{
    let goldEl=document.getElementById('rewGold');
    let xpEl=document.getElementById('rewXp');
    let lootEl=document.getElementById('rewLoot');
    if(goldEl) goldEl.textContent='+0';
    if(xpEl) xpEl.textContent='+'+xpReward;
    if(lootEl) lootEl.textContent='0';
  }catch(e){}
  try{
    if(typeof volandAddXp==='function' && xpReward>0) volandAddXp(xpReward);
    if(typeof volandUpdateMissionStat==='function'){
      volandUpdateMissionStat('win_streak', null, 0);
    }
  }catch(e){}
  document.getElementById('victoryModal').classList.add('show');
  renderSkillBar();
}


function tryNav(url){ if(!isBattleOver){ addLog('⛔ Нельзя выйти из боя! Закончи бой','lose'); return; } location.href=url; }
window.tryNav=tryNav;

let heroModuleLoaded=false, heroModuleFailed=false;
function loadHeroModule(){
 heroModuleLoaded=false; heroModuleFailed=false;
 try{ window.VOLAND_HERO_USE_SKILL=null; window.VOLAND_HERO_ON_TURN_END=null; window.VOLAND_HERO_ON_ENEMY_TURN=null; window.VOLAND_HERO_ON_ENEMY_HIT=null; window.VOLAND_HERO_ON_ROUND_END=null; }catch(e){}
 const s=document.createElement('script');
 s.src='./assets/js/battle/heroes/'+heroId+'.js?v='+Date.now();
 s.onload=()=>{
   if(typeof window.VOLAND_HERO_USE_SKILL==='function'){
     heroModuleLoaded=true;
     addLog('✨ Механика героя '+heroData.n+' загружена из heroes/'+heroId+'.js','skill');
   } else {
     heroModuleFailed=true; heroModuleLoaded=true;
     addLog('❌ Механика героя '+heroId+' не определилась после загрузки heroes/'+heroId+'.js — используется база DMG-DEF','lose');
   }
   renderSkillBar();
 };
 s.onerror=(e)=>{
   heroModuleFailed=true; heroModuleLoaded=true;
   addLog('❌ Ошибка загрузки heroes/'+heroId+'.js — механика не загружена, используется база DMG-DEF','lose');
   renderSkillBar();
 };
 document.head.appendChild(s);
}

updBars(); renderSkillBar();
addLog('Бой: '+profileName+' ['+heroData.n+'] vs '+enemyData.name+' [LOC '+loc+' STAGE '+stage+']','');
addLog('Формула: урон = DMG героя - DEF моба + rand, мин 10 • Мана +8 за ход','');
addLog('Пассивка: '+passive.name+' — '+passive.desc,'skill');
addLog('⬇️ Жми: Q=Атака, W,E,R,T=Скилы','');
loadHeroModule();
document.addEventListener('keydown',e=>{ const k=e.key.toLowerCase(); if(k=='q') useAction(0); if(k=='w') useAction(1); if(k=='e') useAction(2); if(k=='r') useAction(3); if(k=='t') useAction(4); });
window.useAction=useAction;
})();
