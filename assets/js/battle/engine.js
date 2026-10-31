// VOLAND BATTLE ENGINE v1 - база, чистый старт
// DMG-DEF+rand, полоски HP/MANA, QWER, win/lose, грузит механику героя из heroes/${heroId}.js
(function(){
if(typeof volandHasSave==='function' && !volandHasSave()) location.href='./page2.html';
const p=new URLSearchParams(location.search);
const loc=parseInt(p.get('loc')||localStorage.getItem('voland_location')||'1');
const stage=parseInt(p.get('stage')||localStorage.getItem('voland_last_stage')||'1');

let heroId=(typeof volandGetHeroId==='function'?volandGetHeroId():'necro-f-new');
if(typeof VOLAND_HEROES!=='undefined' && !VOLAND_HEROES[heroId]) heroId=Object.keys(VOLAND_HEROES)[0]||'necro-f-new';
const heroData=VOLAND_HEROES[heroId];
const calc=(typeof volandCalcStats==='function'?volandCalcStats():{cur:heroData.st,bonus:{}});
const cur=calc.cur;
const profileName=(typeof volandGetName==='function'?volandGetName():'VOLAND');

let enemies=(VOLAND_ENEMIES&&VOLAND_ENEMIES[loc])?VOLAND_ENEMIES[loc]:VOLAND_ENEMIES[1];
let enemyData=enemies.find(e=>e.stage===stage)||enemies[0];
let locData=(VOLAND_LOCATIONS&&VOLAND_LOCATIONS.find(l=>l.id==loc))||{name:'ПУСТЫНЯ',eng:'DESERT'};

document.getElementById('locTitle').textContent=locData.name;
document.getElementById('stageTitle').textContent='STAGE '+stage+' • '+enemyData.name;
if(enemyData.img){ document.getElementById('enemyIcon').innerHTML='<img src="'+enemyData.img+'" style="width:100%;height:100%;object-fit:cover;border-radius:8px" onerror="this.parentNode.textContent=\''+enemyData.icon+'\'">'; } else { document.getElementById('enemyIcon').textContent=enemyData.icon; }
document.getElementById('enemyName').textContent=enemyData.name;
document.getElementById('enemyEng').textContent=enemyData.eng;
document.getElementById('enemyDesc').textContent=enemyData.desc;
document.getElementById('heroIcon').innerHTML='<img src="'+heroData.img+'" onerror="this.parentNode.textContent=\'🦁\'">';
document.getElementById('heroName').textContent=profileName.toUpperCase();
document.getElementById('heroRole').textContent=heroData.n+' • '+heroData.role;

// РЕАЛЬНЫЕ СТАТЫ - РУКАМИ
// DESERT LOC1: Мышь 4000/100/150, Скорп 3000/200/150, Змея 4000/150/200, Титан 6000/200/250
// FOREST LOC2: Призрак 5000/150/250, Волк 5000/150/300, Голем 7000/300/250, Дриада 10000/350/300
let eDef, eDmg, eMaxHp;
if(loc==3){
  // ЛЕДЯНЫЕ ЗЕМЛИ LOC3
  eDef = stage==4 ? 400 : stage==3 ? 300 : stage==2 ? 200 : 200;
  eDmg = stage==4 ? 400 : stage==3 ? 300 : stage==2 ? 350 : 250;
  eMaxHp = stage==4 ? 13000 : stage==3 ? 10000 : stage==2 ? 7000 : 7000;
} else if(loc==2){
  // ТЕМНЫЙ ЛЕС
  eDef = stage==4 ? 350 : stage==3 ? 300 : stage==2 ? 150 : 150;
  eDmg = stage==4 ? 300 : stage==3 ? 250 : stage==2 ? 300 : 250;
  eMaxHp = stage==4 ? 10000 : stage==3 ? 7000 : stage==2 ? 5000 : 5000;
} else {
  // ПУСТЫНЯ LOC1
  eDef = stage==4 ? 200 : stage==3 ? 150 : stage==2 ? 200 : 100;
  eDmg = stage==4 ? 250 : stage==3 ? 200 : stage==2 ? 150 : 150;
  eMaxHp = stage==4 ? 6000 : stage==3 ? 4000 : stage==2 ? 3000 : 4000;
}
const baseEDmg = eDmg;

let eHp=eMaxHp, hHp=cur.HP, hMax=cur.HP, hMana=cur.MANA, hMaxMana=cur.MANA;
let turn=1, enemyStun=0, cooldowns=[0,0,0,0,0], isBattleOver=false;
let spellCount=0;

// общие статусы - могут использоваться героями
window.VB={eDef, get eDmg(){return eDmg}, set eDmg(v){eDmg=v}, baseEDmg, eMaxHp, get eHp(){return eHp}, set eHp(v){eHp=v}, get hHp(){return hHp}, set hHp(v){hHp=v}, get hMana(){return hMana}, set hMana(v){hMana=v}, get hMax(){return hMax}, set hMax(v){hMax=v}, cur, heroData, enemyData, loc, stage, _lastEnemyDmg:0, _linkActive:false};

function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
const logZone=document.getElementById('logZone');
function addLog(t,c=''){ const d=document.createElement('div'); d.className='log-line '+c; d.textContent=t; logZone.appendChild(d); logZone.scrollTop=9999; }
window.VB.addLog=addLog;

function parseSkill(sk){
 const full=(sk[4]||'')+' '+(sk[5]||'');
 const manaMatch=full.match(/Мана:\s*(\d+)/i);
 const cdMatch=full.match(/КД:\s*(\d+)/i);
 const dmgMatches=[...full.matchAll(/(\d+)%\s*урона/gi)];
 let maxDmg=0; dmgMatches.forEach(m=>{let v=parseInt(m[1]); if(v>maxDmg) maxDmg=v;});
 return {name:sk[0],num:sk[1],icons:sk[2]||[],emoji:sk[3]||'⚔️',desc:sk[4]||'',short:sk[5]||'',mana:manaMatch?parseInt(manaMatch[1]):0,cd:cdMatch?parseInt(cdMatch[1]):0,dmgPct:maxDmg||0,hasStun:/стан|оглуш/i.test(full)};
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
  const cd=cooldowns[idx]; const can=s.isAttack||hMana>=s.mana; const dis=cd>0||!can||isBattleOver;
  const btn=document.createElement('div'); btn.className='skill-btn'+(dis?' disabled':'')+(s.num=='4'?' ultimate':'');
  btn.onclick=()=>{if(!dis) useAction(idx);};
  const iconPath=s.icons&&s.icons[0]?s.icons[0]:'';
  let iconHtml=iconPath?'<img src="'+iconPath+'" onerror="this.style.display=\'none\'; this.parentNode.textContent=\''+s.emoji+'\'">' : (s.emoji||'⚔️');
  btn.innerHTML='<div class="skill-icon">'+iconHtml+'</div><div class="skill-name">'+(s.isAttack?'АТАКА':s.name.toUpperCase().slice(0,12))+'</div><div class="skill-cost '+(s.mana==0?'zero':'')+'">'+(s.isAttack?'0':s.mana)+'</div><div class="skill-key">'+s.key+'</div>'+(cd>0?'<div class="skill-cd">'+cd+'</div>':'');
  btn.title=s.isAttack?'Атака DMG '+cur.DMG+' - DEF '+eDef+' + rand' : s.name+'\n'+s.desc+'\n'+s.short;
  bar.appendChild(btn);
 });
}
window.VB.renderSkillBar=renderSkillBar;

async function useAction(idx){
 if(isBattleOver) return; if(cooldowns[idx]>0) return;
 // хук героя
 if(window.VOLAND_HERO_USE_SKILL){
   let handled = await window.VOLAND_HERO_USE_SKILL(idx, {cur, eDef, eDmg, eMaxHp, get eHp(){return eHp}, set eHp(v){eHp=v}, get hHp(){return hHp}, set hHp(v){hHp=v}, get hMana(){return hMana}, set hMana(v){hMana=v}, hMax, hMaxMana, enemyData, heroData, activeSkills, getMult, rand, addLog, updBars, cooldowns, turn, spellCount, enemyStun, setEnemyStun:v=>enemyStun=v, isBattleOver, allSkills});
   if(handled){ spellCount++; afterHeroAction(); return; }
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
  hMana-=sk.mana; cooldowns[idx]=sk.cd||1; if(cooldowns[idx]==0) cooldowns[idx]=1;
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
  try{ window.VOLAND_HERO_ON_ENEMY_HIT({dmgToHero, cur, eDef, eDmg: effectiveDmg, addLog, updBars, rand}); }catch(e){ console.log('link err',e); }
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
  // Берем награды из db.js VOLAND_ENEMIES, а не формулой
  let goldReward = (enemyData && enemyData.gold) ? parseInt(enemyData.gold) : 5;
  let xpReward = (enemyData && enemyData.xp) ? parseInt(enemyData.xp) : 80;
  try{
    document.getElementById('rewGold').textContent='+'+goldReward;
    document.getElementById('rewXp').textContent='+'+xpReward;
    let lootEl=document.getElementById('rewLoot');
    if(lootEl){
      // посчитаем лут из drops
      let lootCount=0;
      if(enemyData && Array.isArray(enemyData.drops)){
        enemyData.drops.forEach(d=>{ if(Math.random()<(d.chance||0)) lootCount++; });
      }
      if(enemyData && enemyData.equipChance && Math.random()<enemyData.equipChance) lootCount++;
      lootEl.textContent=String(lootCount);
    }
  }catch(e){}
  document.getElementById('modalTitle').textContent='ПОБЕДА!';
  document.getElementById('modalSub').textContent='Ты победил • '+enemyData.name+' • LOC'+loc+' STAGE'+stage;
  document.getElementById('victoryModal').classList.add('show');
  renderSkillBar();
  // сохраняем награды - не конфликтуют с поражением
  try{
    if(typeof volandAddGold==='function') volandAddGold(goldReward);
    if(typeof volandAddXp==='function') volandAddXp(xpReward);
    // ресурсы и шмот через drop систему если есть
    if(typeof volandRollDrops==='function' && typeof volandApplyDrops==='function'){
      let drop = volandRollDrops(enemyData);
      volandApplyDrops(drop);
    } else {
      // fallback прямой ролл ресурсов
      if(enemyData && Array.isArray(enemyData.drops)){
        enemyData.drops.forEach(d=>{
          if(Math.random() < (d.chance||0)){
            if(typeof volandAddResource==='function') volandAddResource(d.id, 1);
          }
        });
      }
      if(enemyData && enemyData.equipChance && Math.random() < enemyData.equipChance){
        if(typeof VOLAND_ITEMS!=='undefined' && typeof volandAddToInventory==='function'){
          let pool = VOLAND_ITEMS.filter(it=>it.slot);
          if(pool.length>0){
            let pick = pool[Math.floor(Math.random()*pool.length)];
            volandAddToInventory(pick.id);
          }
        }
      }
    }
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
      }
    }
  }catch(e){ console.log('victory save error', e); }
}

function showDefeat(){
  isBattleOver=true;
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

function loadHeroModule(){
 const s=document.createElement('script');
 s.src='./assets/js/battle/heroes/'+heroId+'.js?v='+Date.now();
 s.onload=()=>{ addLog('✨ Механика героя '+heroData.n+' загружена из heroes/'+heroId+'.js?v=anti-cache','skill'); renderSkillBar(); };
 s.onerror=()=>{ addLog('ℹ️ Нет отдельной механики для '+heroId+' — используется база DMG-DEF','hit'); };
 document.head.appendChild(s);
}

updBars(); renderSkillBar();
addLog('Бой: '+profileName+' ['+heroData.n+'] vs '+enemyData.name+' [LOC '+loc+' STAGE '+stage+']','');
addLog('Моб UI: hp '+enemyData.hp+'% бар • Реал: DEF '+eDef+' DMG '+eDmg+' HP '+eMaxHp+' (ручками в engine.js)','skill');
addLog('Формула: урон = DMG героя - DEF моба + rand, мин 10 • Мана +8 за ход','');
addLog('Пассивка: '+passive.name+' — '+passive.desc,'skill');
addLog('⬇️ Жми: Q=Атака, W,E,R,T=Скилы','');
loadHeroModule();
document.addEventListener('keydown',e=>{ const k=e.key.toLowerCase(); if(k=='q') useAction(0); if(k=='w') useAction(1); if(k=='e') useAction(2); if(k=='r') useAction(3); if(k=='t') useAction(4); });
window.useAction=useAction;
})();
