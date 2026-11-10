// VOLAND PVP ENGINE V3 - Full PVE-like: buffs/debuffs/passives/summons for all 8 heroes
(function(){
const DIFF_MULT = { easy: 0.3, medium: 1.0, hard: 1.3 };
const PVP_HP_MULT = 5;
let player=null, bot=null, turn=1, isOver=false;
let logEl, pHpBar, bHpBar, pManaBar, bManaBar, pHpText, bHpText, pManaText, bManaText;
function rand(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function getVH(){ if(typeof VOLAND_HEROES!=='undefined') return VOLAND_HEROES; if(typeof window!=='undefined'&&window.VOLAND_HEROES) return window.VOLAND_HEROES; return {}; }
function getHeroBase(id){
  try{ let VH=getVH(); if(VH&&VH[id]){ let h=VH[id]; return {n:h.n, img:h.img, role:h.role, st:{...h.st}, sk:h.sk}; } }catch(e){}
  return {n:id, img:'./assets/heroes/necro-f-new.webp', role:'HERO', st:{HP:1000,DEF:100,DMG:200,MANA:250,CRIT:15,DODGE:10}, sk:[]};
}
function calcStats(heroId, mult, isPlayer){
  let base=getHeroBase(heroId); let st=base.st; let cur=null;
  if(isPlayer){
    try{ if(typeof volandCalcStats==='function'){ let c=volandCalcStats(); if(c&&c.cur) cur={...c.cur}; else if(c&&c.HP) cur={...c}; } }catch(e){}
  }
  if(!cur){ cur={HP:Math.floor(st.HP*mult*PVP_HP_MULT), DEF:Math.floor(st.DEF*mult), DMG:Math.floor(st.DMG*mult), MANA:Math.floor(st.MANA*mult), CRIT:st.CRIT||15, DODGE:st.DODGE||10, PARRY:st.PARRY||0}; }
  else { if(mult!==1){ cur.HP=Math.floor((cur.HP||st.HP)*mult); cur.DMG=Math.floor((cur.DMG||st.DMG)*mult); cur.DEF=Math.floor((cur.DEF||st.DEF)*mult); cur.MANA=Math.floor((cur.MANA||st.MANA)*mult);} cur.HP=(cur.HP||st.HP)*PVP_HP_MULT; cur.DMG=cur.DMG||st.DMG; cur.DEF=cur.DEF||st.DEF; cur.MANA=cur.MANA||st.MANA; cur.CRIT=cur.CRIT||st.CRIT||15; cur.DODGE=cur.DODGE||st.DODGE||10; }
  return {base, cur};
}
function makeFighter(heroId, mult, isPlayer){
  let d=calcStats(heroId, mult, isPlayer);
  return {
    id:heroId, name:d.base.n, img:d.base.img, role:d.base.role,
    maxHp:d.cur.HP, hp:d.cur.HP, maxMana:d.cur.MANA, mana:d.cur.MANA,
    baseDmg:d.cur.DMG, baseDef:d.cur.DEF, baseCrit:d.cur.CRIT, baseDodge:d.cur.DODGE,
    cd:[0,0,0,0,0],
    shield:0, shieldTurns:0, shieldExplode:0,
    blockChance:0, blockTurns:0, counterPct:0,
    invulnTurns:0, invisTurns:0,
    dmgBonusPct:0, critBonus:0, defBonusPct:0, lifestealPct:0,
    reflectPct:0, reflectTurns:0,
    dmgDownPct:0, dmgDownTurns:0, defDownPct:0, defDownTurns:0,
    stunTurns:0,
    poisonTurns:0, poisonDmg:0, bleedTurns:0, bleedDmg:0, burnTurns:0, burnDmg:0, lavaTurns:0, lavaDmg:0,
    fearTurns:0, markTurns:0,
    hawkEyeTurns:0, stormTurns:0, stormLeft:0,
    sphereTurns:0, sphereDmg:0,
    meteorDelay:0, meteorDmg:0,
    doomsdayTurns:0, doomsdayLeft:0,
    wolfTurns:0, avatarTurns:0, avatarDmgTurns:0, bastionTurns:0, linkTurns:0,
    attackCount:0, spellCount:0, nextCrit:false, passiveShieldUsed:false,
    skeletons:[], spirits:[],
    timeWarpStacks:0,
    lastAction:''
  };
}
function effDmg(f){
  let m=1;
  m+= f.dmgBonusPct/100;
  if(f.timeWarpStacks>0) m+= f.timeWarpStacks*0.10;
  if(f.id==='warrior-f' && f.hp/f.maxHp<0.30) m+=0.50;
  if(f.dmgDownTurns>0) m*= (1 - f.dmgDownPct/100);
  if(f.fearTurns>0) m*=0.80;
  return Math.floor(f.baseDmg*m);
}
function effDef(f){
  let m=1;
  m+= f.defBonusPct/100;
  if(f.id==='warrior-m'){
    let lost=100 - (f.hp/f.maxHp*100);
    let bonus=Math.min(30, Math.floor(lost/5)*3);
    m+= bonus/100;
  }
  if(f.defDownTurns>0) m*= (1 - f.defDownPct/100);
  return Math.floor(f.baseDef*m);
}
function effCrit(f){
  let c=f.baseCrit + f.critBonus;
  if(f.hawkEyeTurns>0) c+=25;
  if(f.nextCrit) c+=100;
  return c;
}
function effDodge(f){ return f.baseDodge; }

function initBattle(playerHeroId, botHeroId, diff){
  window.PLAYER_HERO_ID=playerHeroId;
  let pMult=1.0, bMult=DIFF_MULT[diff]||1.0;
  player=makeFighter(playerHeroId, pMult, true);
  bot=makeFighter(botHeroId, bMult, false);
  turn=1; isOver=false;
  setupUI(); updateBars(); renderSkills();
  addLog(`⚔️ PVP START: ${player.name} vs ${bot.name} [${diff.toUpperCase()} ${Math.round(bMult*100)}%] HPx5`, 'skill');
  addLog(`🔮 Пассивы активны: ${getPassiveName(player.id)} | ${getPassiveName(bot.id)}`, '');
  addLog(`Игрок: HP ${player.maxHp} DMG ${player.baseDmg} DEF ${player.baseDef} | Бот: HP ${bot.maxHp} DMG ${bot.baseDmg} DEF ${bot.baseDef}`, '');
}
function getPassiveName(id){
  try{ let VH=getVH(); if(VH[id]&&VH[id].sk&&VH[id].sk[0]) return VH[id].sk[0][0]; }catch(e){}
  return 'PASSIVE';
}
function setupUI(){
  logEl=document.getElementById('battleLog');
  pHpBar=document.getElementById('pHpBar'); bHpBar=document.getElementById('bHpBar');
  pManaBar=document.getElementById('pManaBar'); bManaBar=document.getElementById('bManaBar');
  pHpText=document.getElementById('pHpText'); bHpText=document.getElementById('bHpText');
  pManaText=document.getElementById('pManaText'); bManaText=document.getElementById('bManaText');
  let pImg=document.getElementById('pImg'), bImg=document.getElementById('bImg');
  if(pImg) pImg.src=player.img; if(bImg) bImg.src=bot.img;
  document.getElementById('pName').textContent=player.name; document.getElementById('bName').textContent=bot.name;
}
function updateBars(){
  if(!player||!bot) return;
  let pHpPct=Math.max(0,(player.hp/player.maxHp)*100), bHpPct=Math.max(0,(bot.hp/bot.maxHp)*100);
  let pManaPct=Math.max(0,(player.mana/player.maxMana)*100), bManaPct=Math.max(0,(bot.mana/bot.maxMana)*100);
  if(pHpBar) pHpBar.style.width=pHpPct+'%'; if(bHpBar) bHpBar.style.width=bHpPct+'%';
  if(pManaBar) pManaBar.style.width=pManaPct+'%'; if(bManaBar) bManaBar.style.width=bManaPct+'%';
  if(pHpText) pHpText.textContent=`${player.hp}/${player.maxHp}`; if(bHpText) bHpText.textContent=`${bot.hp}/${bot.maxHp}`;
  if(pManaText) pManaText.textContent=`${player.mana}/${player.maxMana}`; if(bManaText) bManaText.textContent=`${bot.mana}/${bot.maxMana}`;
}
function addLog(msg, type){
  if(!logEl) return;
  try{ if(typeof volandBattleLog==='function') msg=volandBattleLog(msg); }catch(e){}
  let div=document.createElement('div'); div.className='log-line '+(type||''); div.textContent=`[${turn}] ${msg}`;
  logEl.appendChild(div); logEl.scrollTop=logEl.scrollHeight;
}
function getSkillInfo(heroId, idx){
  if(idx===0) return {name:'АТАКА', icon:'⚔️', displayName: (typeof volandT==='function' ? volandT('АТАКА','ATTACK') : 'АТАКА'), mana:0, cd:1, desc:'100% урона'};
  try{ let VH=getVH(); let h=VH[heroId]; if(h&&h.sk&&h.sk[idx]){ let s=h.sk[idx]; return {name: s[0], icon: (s[2]&&s[2][0] ? s[2][0] : '🔮'), displayName: (typeof volandSkillName==='function' ? volandSkillName(s[0]) : s[0]), mana: parseMana(s[5]||''), cd: parseCd(s[5]||''), desc:s[5]||''}; } }catch(e){}
  const fallback=[{name:'Skill1',mana:10,cd:3},{name:'Skill2',mana:20,cd:8},{name:'Skill3',mana:30,cd:15},{name:'ULT',mana:60,cd:20}];
  return fallback[idx-1]||fallback[0];
}
function parseMana(desc){
  let m=desc.match(/Мана:\s*(\d+)/); if(m) return parseInt(m[1]);
  if(desc.includes('Мана: 5')) return 5; if(desc.includes('Мана: 10')) return 10; if(desc.includes('Мана: 15')) return 15; if(desc.includes('Мана: 20')) return 20; if(desc.includes('Мана: 25')) return 25; if(desc.includes('Мана: 30')) return 30; if(desc.includes('Мана: 40')) return 40; if(desc.includes('Мана: 50')) return 50; if(desc.includes('Мана: 100')) return 100;
  return 10;
}
function parseCd(desc){
  let m=desc.match(/КД:\s*(\d+)/); if(m) return parseInt(m[1]);
  return 3;
}
function dealDamage(attacker, defender, rawDmg, opts={}){
  if(isOver) return 0;
  if(defender.invulnTurns>0){ addLog(`👑 ${defender.name} неуязвим! (${defender.invulnTurns}р)`, 'skill'); return 0; }
  if(!opts.isTrue && opts.canDodge!==false){
    if(Math.random()*100 < effDodge(defender)){
      addLog(`💨 ${defender.name} уклонился от ${opts.skillName||'атаки'}!`, 'enemy-hit');
      if(defender.id==='archer-f'){ defender.nextCrit=true; addLog(`🐾 Тропы Зверя: ${defender.name} уклонился, след. удар 100% крит!`, 'skill'); }
      return 0;
    }
  }
  if(defender.blockTurns>0 && defender.blockChance>0){
    if(Math.random()*100 < defender.blockChance){
      addLog(`🛡️ ${defender.name} заблокировал удар!`, 'skill');
      if(defender.id==='warrior-f'){
        let counter=Math.floor(effDmg(defender)*3.5);
        addLog(`🐺 Контратака Волка ${counter} [350%]!`, 'skill');
        attacker.hp=Math.max(0, attacker.hp-counter);
        updateBars();
      }
      return 0;
    }
  }
  let isBastion = defender.bastionTurns>0;
  let finalDmg;
  if(opts.isTrue){ finalDmg=rawDmg; }
  else {
    let def=effDef(defender);
    if(opts.ignoreDef) def=Math.floor(def*0.8);
    finalDmg=Math.max(10, rawDmg - def + rand(-12,12));
  }
  if(defender.markTurns>0 && attacker.id==='archer-m'){
    finalDmg=Math.floor(finalDmg*2);
    addLog(`👁️ Метка Тени: +100% урона по ${defender.name}!`, 'skill');
  }
  let isCrit=false;
  if(opts.canCrit!==false){
    let critCh=effCrit(attacker);
    if(attacker.nextCrit || Math.random()*100 < critCh){ isCrit=true; finalDmg=Math.floor(finalDmg*1.4); if(attacker.nextCrit){ attacker.nextCrit=false; } }
  }
  if(isBastion){
    let orig=finalDmg;
    let blocked=Math.floor(orig*0.5);
    let reflect=Math.floor(orig*0.25);
    finalDmg=blocked;
    addLog(`🛡️ Бастион: блок 50% ${blocked} (из ${orig}) отраж ${reflect}`, 'skill');
    attacker.hp=Math.max(0, attacker.hp-reflect);
  }
  if(defender.shield>0){
    let absorbed=Math.min(defender.shield, finalDmg);
    defender.shield-=absorbed; finalDmg-=absorbed;
    addLog(`🛡️ Щит ${defender.name} поглотил ${absorbed} (осталось ${defender.shield})`, 'skill');
    if(defender.shield<=0){
      defender.shield=0;
      if(defender.shieldExplode>0){ let expl=defender.shieldExplode; defender.shieldExplode=0; addLog(`💥 Щит ${defender.name} взорвался ${expl} [300%]!`, 'skill'); attacker.hp=Math.max(0, attacker.hp-expl); }
    }
    if(finalDmg<=0){ updateBars(); return 0; }
  }
  defender.hp=Math.max(0, defender.hp-finalDmg);
  addLog(`${opts.skillName? '🔥 '+attacker.name+' '+opts.skillName+' → '+defender.name+' на '+finalDmg : '⚔️ '+attacker.name+' → '+defender.name+' '+finalDmg}${isCrit?' CRIT!':''}`, isCrit?'crit':'hit');
  if(attacker.id==='warrior-f' && attacker.hp/attacker.maxHp<0.30){
    let heal=Math.floor(finalDmg*0.30); attacker.hp=Math.min(attacker.maxHp, attacker.hp+heal); addLog(`🐺 Клятва Стаи: +${heal} HP лайфстил 30%`, 'skill');
  }
  if(attacker.lifestealPct>0){
    let heal=Math.floor(finalDmg*attacker.lifestealPct/100); attacker.hp=Math.min(attacker.maxHp, attacker.hp+heal); addLog(`💀 Лайфстил +${heal} HP`, 'skill');
  }
  if(defender.linkTurns>0){
    let refl=Math.floor(finalDmg*0.30); let heal=Math.floor(finalDmg*0.30);
    attacker.hp=Math.max(0, attacker.hp-refl); defender.hp=Math.min(defender.maxHp, defender.hp+heal);
    addLog(`💜 Похищение Жизни: отраж ${refl} + хил ${heal} [30%]`, 'skill');
  }
  if(defender.reflectPct>0 && defender.reflectTurns>0){
    let refl=Math.floor(finalDmg*defender.reflectPct/100); attacker.hp=Math.max(0, attacker.hp-refl); addLog(`🪞 Отражение ${refl}`, 'skill');
  }
  updateBars();
  return finalDmg;
}
function executeSkill(attacker, defender, idx){
  let info=getSkillInfo(attacker.id, idx);
  let isAtk = idx===0;
  if(!isAtk){
    if(attacker.cd[idx]>0){ addLog(`⛔ ${attacker.name} скилл на КД ${attacker.cd[idx]}р`, 'lose'); return false; }
    if(attacker.mana < info.mana){ addLog(`⛔ ${attacker.name} не хватает маны ${info.mana} (есть ${attacker.mana})`, 'lose'); return false; }
    attacker.mana-=info.mana; attacker.cd[idx]=info.cd;
  } else {
    attacker.cd[0]=1;
  }
  attacker.attackCount++;
  if(!isAtk) attacker.spellCount++;
  let dmgBase=effDmg(attacker);
  let skillName = isAtk ? 'АТАКА' : info.name;
  switch(attacker.id){
    case 'necro-f-new':
      if(isAtk){ dealDamage(attacker, defender, Math.floor(dmgBase*1.0), {skillName:'АТАКА'}); break; }
      if(info.name.includes('Проклятие')){
        dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:info.name});
        defender.mana=Math.max(0, defender.mana-5); attacker.mana=Math.min(attacker.maxMana, attacker.mana+5);
        defender.fearTurns=2; defender.dmgDownPct=20; defender.dmgDownTurns=2;
        addLog(`💜 Страх Душ: -20% урона ${defender.name} на 2р, кража 5 маны`, 'skill');
      } else if(info.name.includes('Тюрьма')){
        defender.stunTurns=Math.max(defender.stunTurns,1);
        let expl=Math.floor(dmgBase*3.0);
        addLog(`👻 Аметистовая Тюрьма: ${defender.name} в клетке 1р, взрыв в конце ${expl}`, 'skill');
        dealDamage(attacker, defender, expl, {skillName:'Аметистовая Тюрьма [300%] взрыв', canDodge:false});
      } else if(info.name.includes('Похищение')){
        attacker.linkTurns=4;
        addLog(`💀 Похищение Жизни: связь 4р - 30% получаемого урона отражается и хилит`, 'skill');
        dealDamage(attacker, defender, Math.floor(dmgBase*1.0), {skillName:info.name});
      } else if(info.name.includes('Закат')){
        let total=0;
        for(let i=0;i<5;i++){ let d=dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:'Аметистовая Душа '+(i+1)+' [200%]', canDodge:true}); total+=d; if(defender.hp<=0) break; }
        defender.stunTurns=Math.max(defender.stunTurns,1);
        addLog(`🌌 Аметистовый Закат: 5 душ → ${total} [1000%] + стан 1р!`, 'skill');
      }
      break;
    case 'necro-m':
      if(isAtk){ dealDamage(attacker, defender, Math.floor(dmgBase*1.0), {skillName:'АТАКА'}); break; }
      if(info.name.includes('Копье')){
        dealDamage(attacker, defender, Math.floor(dmgBase*1.5), {skillName:info.name});
        attacker._summonBonusTurns=2; attacker._summonBonusPct=25;
        addLog(`☠️ Уязвимость Костей: +25% урона от саммонов 2р`, 'skill');
      } else if(info.name.includes('Щит')){
        let sh=Math.floor(attacker.maxHp*0.20); attacker.shield=sh; attacker.shieldTurns=10; attacker.shieldExplode=Math.floor(dmgBase*3.0);
        addLog(`🛡️ Костяной Щит: ${sh} HP, при разрушении взрыв ${attacker.shieldExplode} [300%]`, 'skill');
      } else if(info.name.includes('Поднять')){
        attacker.skeletons.push({dmg:Math.floor(dmgBase*2.0), turns:1, type:'bomber', explodeIn:1});
        attacker.skeletons.push({dmg:Math.floor(dmgBase*3.0), turns:2, type:'bomber', explodeIn:2});
        addLog(`👥 Поднять Мертвых: 2 подрывника - взрыв 200% в 1р и 300% во 2р`, 'skill');
      } else if(info.name.includes('Армия')){
        for(let i=0;i<5;i++) attacker.skeletons.push({dmg:Math.floor(dmgBase*1.0), turns:3, type:'normal'});
        addLog(`💀 Армия Погибели: 5 скелетов на 3р по 100% урона каждый!`, 'skill');
      }
      break;
    case 'archer-f':
      if(isAtk){ dealDamage(attacker, defender, Math.floor(dmgBase*1.0), {skillName:'АТАКА'}); break; }
      if(info.name.includes('Двойной')){
        let t=0;
        for(let i=0;i<2;i++){ t+=dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:'Стрела '+(i+1)+' [200%]'}); }
        defender.bleedTurns=2; defender.bleedDmg=Math.floor(dmgBase*0.25);
        addLog(`🩸 Кровотечение 25% true (${defender.bleedDmg}) на 2р игнор DEF`, 'skill');
      } else if(info.name.includes('Лиана')||info.name.includes('Ядовит')){
        dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:info.name});
        defender.stunTurns=Math.max(defender.stunTurns,1);
        defender.poisonTurns=3; defender.poisonDmg=Math.floor(dmgBase*0.25);
        addLog(`🌿 Яд 25% true (${defender.poisonDmg}) 3р + стан 1р`, 'skill');
      } else if(info.name.includes('Глаз')){
        attacker.hawkEyeTurns=4; addLog(`🦅 Глаз Ястреба: +25% крит + игнор 20% брони 4р`, 'skill');
      } else if(info.name.includes('Буря')){
        attacker.stormTurns=3; attacker.stormLeft=9; addLog(`🌪️ Буря Стрел: 9 стрел за 3р по 150% + 25% стан`, 'skill');
      }
      break;
    case 'archer-m':
      if(isAtk){
        let wasInvis=attacker.invisTurns>0;
        if(wasInvis){ attacker.nextCrit=true; attacker.invisTurns=0; addLog(`🌑 Шаг в Ничто: атака из инвиза - гарант крит!`, 'skill'); }
        dealDamage(attacker, defender, Math.floor(dmgBase*1.0), {skillName:'АТАКА'+(wasInvis?' [инвиз крит]':'')});
        if(attacker.attackCount%4===0){ defender.markTurns=2; addLog(`👁️ Метка Тени: ${defender.name} отмечен 2р +100% урона!`, 'skill'); }
        if(defender.hp<=0 && defender.markTurns>0){ attacker.mana=Math.min(attacker.maxMana, attacker.mana+15); addLog(`👁️ Убийство метки: +15 маны`, 'skill'); }
        break;
      }
      if(info.name.includes('Беглый')){ dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:info.name}); }
      else if(info.name.includes('Шаг')){ attacker.invisTurns=3; addLog(`🌑 Шаг в Ничто: невидимость 3р, след. атака гарант крит`, 'skill'); }
      else if(info.name.includes('Призрачная')){ dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:info.name}); if(Math.random()*100<33){ defender.stunTurns=Math.max(defender.stunTurns,1); addLog(`💫 Призрачная Стрела: стан 1р [33%]!`, 'skill'); } }
      else if(info.name.includes('Залп')){ let total=0; for(let i=0;i<7;i++){ total+=dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:'Стрела Бездны '+(i+1)+' [200%]'}); if(defender.hp<=0) break; } addLog(`🌌 Залп Бездны: 7 стрел → ${total} [1400%]!`, 'skill'); }
      break;
    case 'archmage-m':
      if(isAtk){ dealDamage(attacker, defender, Math.floor(dmgBase*1.0), {skillName:'АТАКА'}); break; }
      if(info.name.includes('Копье')){ dealDamage(attacker, defender, Math.floor(dmgBase*2.5), {skillName:info.name}); defender.defDownPct=20; defender.defDownTurns=2; addLog(`❄️ Ледяное Копье: -20% DEF ${defender.name} 2р`, 'skill'); }
      else if(info.name.includes('Сфера')){ attacker.sphereTurns=3; attacker.sphereDmg=Math.floor(dmgBase*1.6); addLog(`⚡ Сфера Бури: 3р по ${attacker.sphereDmg} [160%] каждый раунд`, 'skill'); }
      else if(info.name.includes('Лавина')){ dealDamage(attacker, defender, Math.floor(dmgBase*3.0), {skillName:info.name}); }
      else if(info.name.includes('Аннигиляция')){ defender.stunTurns=Math.max(defender.stunTurns,2); let expl=Math.floor(dmgBase*3.5); addLog(`🌌 Аннигиляция Времени: заморозка 2р, взрыв ${expl} [350%]`, 'skill'); dealDamage(attacker, defender, expl, {skillName:'Аннигиляция [350%]', canDodge:false}); }
      break;
    case 'mage-f-new':
      if(isAtk){ dealDamage(attacker, defender, Math.floor(dmgBase*1.0), {skillName:'АТАКА'}); break; }
      if(info.name.includes('Шар')){
        let wasCrit = Math.random()*100 < effCrit(attacker);
        dealDamage(attacker, defender, Math.floor(dmgBase*1.5), {skillName:info.name});
        defender.burnTurns=2; defender.burnDmg=Math.floor(dmgBase*0.20); addLog(`🔥 Поджог 20% (${defender.burnDmg}) 2р`, 'skill');
        if(wasCrit) addLog(`🔥 Крит Огненного Шара: все враги получают урон!`, 'skill');
      } else if(info.name.includes('Извержение')){ dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:info.name}); defender.lavaTurns=3; defender.lavaDmg=Math.floor(dmgBase*0.50); addLog(`💥 Лава 50% (${defender.lavaDmg}) 3р`, 'skill'); }
      else if(info.name.includes('Метеор')){ dealDamage(attacker, defender, Math.floor(dmgBase*5.0), {skillName:'Метеор [500%]'}); attacker.meteorDelay=1; attacker.meteorDmg=Math.floor(dmgBase*3.0); addLog(`☄️ Ударная волна через 1р: ${attacker.meteorDmg} [300%]`, 'skill'); }
      else if(info.name.includes('Судный')){ attacker.doomsdayTurns=4; attacker.doomsdayLeft=4; addLog(`🌋 Судный День: 4 метеора за 4р по 200% + суперметеор 400%`, 'skill'); }
      break;
    case 'warrior-f':
      if(isAtk){
        let d=dealDamage(attacker, defender, Math.floor(dmgBase*1.0), {skillName:'АТАКА'});
        if(attacker.wolfTurns>0 && d>0){ defender.bleedTurns=2; defender.bleedDmg=Math.floor(dmgBase*0.50); addLog(`🩸 Волк: кровотечение 50% true (${defender.bleedDmg})`, 'skill'); }
        break;
      }
      if(info.name.includes('Рассекающий')){
        let t=0; for(let i=0;i<2;i++) t+=dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:'Волк '+(i+1)+' [200%]'}); addLog(`🗡️ Рассекающий Волк: ${t} [400%]`, 'skill');
        if(attacker.wolfTurns>0){ defender.bleedTurns=2; defender.bleedDmg=Math.floor(dmgBase*0.50); addLog(`🩸 Волк: кровотечение 50% true`, 'skill'); }
      } else if(info.name.includes('Щит')){ attacker.blockChance=50; attacker.blockTurns=4; attacker.counterPct=350; addLog(`🛡️ Щит Волчьего Вожака: блок 50% 4р, контра 350%`, 'skill'); }
      else if(info.name.includes('Зов')){ defender.stunTurns=Math.max(defender.stunTurns,1); dealDamage(attacker, defender, Math.floor(dmgBase*4.0), {skillName:'Зов Стаи [400% стан]'}); addLog(`🐾 Зов Стаи: стан 1р + 200% x2 по оглушенному`, 'skill'); }
      else if(info.name.includes('Альфа')){ attacker.wolfTurns=5; let hpBonus=Math.floor(attacker.maxHp*0.50); attacker.maxHp+=hpBonus; attacker.hp+=hpBonus; attacker.dmgBonusPct+=30; addLog(`🌕 Альфа Хищник: +50% HP (+${hpBonus}) +30% урона 5р, атаки дают кровотечение 50% true`, 'skill'); }
      break;
    case 'warrior-m':
      if(isAtk){ dealDamage(attacker, defender, Math.floor(dmgBase*1.0), {skillName:'АТАКА'}); break; }
      if(info.name.includes('Льва')){ dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:info.name}); defender.stunTurns=Math.max(defender.stunTurns,1); addLog(`⚔️ Удар Льва: стан 1р`, 'skill'); }
      else if(info.name.includes('Бастион')){ attacker.bastionTurns=3; addLog(`🛡️ Имперский Бастион: блок 50% + отраж 25% 3р`, 'skill'); }
      else if(info.name.includes('Рассекающий')){ dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:info.name}); }
      else if(info.name.includes('Аватар')){ dealDamage(attacker, defender, Math.floor(dmgBase*2.0), {skillName:'Аватар AOE [200%]'}); attacker.invulnTurns=2; attacker.avatarDmgTurns=3; attacker.dmgBonusPct+=200; let hpBonus=Math.floor(attacker.maxHp*0.50); attacker.maxHp+=hpBonus; attacker.hp+=hpBonus; addLog(`👑 Аватар Империи: неуязв 2р +50% HP (+${hpBonus}) +200% урона 3р`, 'skill'); }
      break;
    default:
      dealDamage(attacker, defender, Math.floor(dmgBase*1.0), {skillName:skillName});
      break;
  }
  if(!isAtk){
    if(attacker.id==='archmage-m'){ attacker.timeWarpStacks=Math.min(5, attacker.timeWarpStacks+1); if(attacker.timeWarpStacks>=5) addLog(`⏳ Искривление Времени: 5 стаков! След. заклинание +50%`, 'skill'); }
    if(attacker.id==='mage-f-new'){ if(attacker.spellCount%4===0){ defender.lavaTurns=2; defender.lavaDmg=Math.floor(dmgBase*1.0); addLog(`🌋 Сердце Кальдеры: земля горит 2р 100% (${defender.lavaDmg})`, 'skill'); } }
    if(attacker.id==='necro-f-new'){ if(attacker.spellCount%3===0){ attacker.spirits.push({dmg:Math.floor(dmgBase*1.0), turns:3}); addLog(`🔮 Шепот Аметиста: дух призван на 3р 100% урона +5 маны/р!`, 'skill'); } }
  }
  if(attacker.hp/attacker.maxHp<0.30 && attacker.id==='warrior-m' && !attacker.passiveShieldUsed){ attacker.passiveShieldUsed=true; let sh=Math.floor(attacker.maxHp*0.15); attacker.shield=sh; attacker.shieldTurns=4; addLog(`🦁 Непоколебимая Стена: щит ${sh} 15% HP 4р (1 раз за бой)!`, 'skill'); }
  if(defender.hp/defender.maxHp<0.30 && defender.id==='warrior-m' && !defender.passiveShieldUsed){ defender.passiveShieldUsed=true; let sh=Math.floor(defender.maxHp*0.15); defender.shield=sh; defender.shieldTurns=4; addLog(`🦁 Непоколебимая Стена: ${defender.name} щит ${sh} 15% HP!`, 'skill'); }
  updateBars();
  return true;
}
function endRoundEffects(){
  if(isOver) return;
  [player, bot].forEach(f=>{
    if(f.poisonTurns>0){ let d=f.poisonDmg; f.hp=Math.max(0,f.hp-d); addLog(`☠️ Яд ${f.name} -${d} true [${f.poisonTurns}р]`, 'skill'); }
    if(f.bleedTurns>0){ let d=f.bleedDmg; f.hp=Math.max(0,f.hp-d); addLog(`🩸 Кровотечение ${f.name} -${d} true [${f.bleedTurns}р]`, 'skill'); }
    if(f.burnTurns>0){ let d=f.burnDmg; f.hp=Math.max(0,f.hp-d); addLog(`🔥 Горение ${f.name} -${d} [${f.burnTurns}р]`, 'skill'); }
    if(f.lavaTurns>0){ let d=f.lavaDmg; f.hp=Math.max(0,f.hp-d); addLog(`🌋 Лава ${f.name} -${d} [${f.lavaTurns}р]`, 'skill'); }
  });
  [player, bot].forEach(f=>{
    let opp = f===player ? bot : player;
    if(f.skeletons.length>0){
      let total=0; let remaining=[];
      f.skeletons.forEach(s=>{
        if(s.type==='bomber'){ s.explodeIn--; if(s.explodeIn<=0){ total+=s.dmg; addLog(`💥 Подрывник ${f.name} взорвался ${s.dmg}!`, 'skill'); } else remaining.push(s); }
        else { let bonus = f._summonBonusTurns>0 ? 1.25 : 1; let d=Math.floor(s.dmg*bonus); total+=d; if(s.turns>1) remaining.push({...s, turns:s.turns-1}); }
      });
      f.skeletons=remaining;
      if(total>0){ opp.hp=Math.max(0, opp.hp-total); addLog(`🦴 Скелеты ${f.name} → ${opp.name} ${total} [${f.skeletons.length} скелетов]`, 'skill'); }
    }
    if(f.spirits.length>0){
      let total=0; let rem=[];
      f.spirits.forEach(sp=>{ total+=sp.dmg; f.mana=Math.min(f.maxMana, f.mana+5); if(sp.turns>1) rem.push({...sp, turns:sp.turns-1}); });
      f.spirits=rem;
      if(total>0){ opp.hp=Math.max(0, opp.hp-total); addLog(`🔮 Дух ${f.name} → ${opp.name} ${total} +5 маны`, 'skill'); }
    }
    if(f.sphereTurns>0){ let d=f.sphereDmg; opp.hp=Math.max(0, opp.hp-d); addLog(`⚡ Сфера Бури ${f.name} → ${opp.name} ${d} [160%] [${f.sphereTurns}р]`, 'skill'); }
    if(f.stormTurns>0 && f.stormLeft>0){
      let arrows=Math.ceil(f.stormLeft/f.stormTurns); arrows=Math.min(arrows, f.stormLeft);
      let total=0; let doStun=false;
      for(let i=0;i<arrows;i++){ total+=Math.max(10, Math.floor(effDmg(f)*1.5) - effDef(opp) + rand(-6,6)); if(Math.random()*100<25) doStun=true; }
      f.stormLeft-=arrows; opp.hp=Math.max(0, opp.hp-total); addLog(`🌪️ Буря ${f.name} ${arrows} стрел → ${total} [150% x${arrows}]${doStun?' + стан!':''}`, 'skill'); if(doStun) opp.stunTurns=Math.max(opp.stunTurns,1);
    }
    if(f.meteorDelay>0){ f.meteorDelay--; if(f.meteorDelay===0){ let d=f.meteorDmg; opp.hp=Math.max(0, opp.hp-d); addLog(`☄️ Ударная волна Метеора ${d} [300%]!`, 'skill'); } }
    if(f.doomsdayTurns>0 && f.doomsdayLeft>0){
      let isLast = f.doomsdayLeft===1;
      let mult = isLast ? 4.0 : 2.0;
      let d=Math.floor(effDmg(f)*mult); opp.hp=Math.max(0, opp.hp-d); addLog(`🌋 Судный День ${f.name} метеор ${d} [${Math.round(mult*100)}%] ${f.doomsdayLeft}р`, 'skill');
      if(isLast){ opp.burnTurns=2; opp.burnDmg=Math.floor(effDmg(f)*0.50); addLog(`🌋 Поджог земли 50% 2р`, 'skill'); }
    }
    if(f._summonBonusTurns>0) f._summonBonusTurns--;
  });
  [player, bot].forEach(f=>{
    if(f.id==='necro-m'){
      let normal = f.skeletons.filter(s=>s.type==='normal').length;
      if(normal<3){ f.skeletons.push({dmg:Math.floor(effDmg(f)*1.0), turns:99, type:'normal'}); addLog(`🦴 Костяной Легион: +1 скелет (всего ${f.skeletons.length})`, 'skill'); }
    }
  });
  [player, bot].forEach(f=>{
    if(f.poisonTurns>0) f.poisonTurns--; if(f.bleedTurns>0) f.bleedTurns--; if(f.burnTurns>0) f.burnTurns--; if(f.lavaTurns>0) f.lavaTurns--;
    if(f.sphereTurns>0) f.sphereTurns--; if(f.stormTurns>0) f.stormTurns--; if(f.doomsdayTurns>0){ f.doomsdayTurns--; f.doomsdayLeft--; }
    if(f.hawkEyeTurns>0) f.hawkEyeTurns--;
    if(f.bastionTurns>0) f.bastionTurns--;
    if(f.invulnTurns>0) f.invulnTurns--;
    if(f.invisTurns>0) f.invisTurns--;
    if(f.blockTurns>0) f.blockTurns--;
    if(f.shieldTurns>0){ f.shieldTurns--; if(f.shieldTurns===0 && f.shield>0 && f.id!=='necro-m') f.shield=0; }
    if(f.reflectTurns>0) f.reflectTurns--;
    if(f.linkTurns>0) f.linkTurns--;
    if(f.fearTurns>0) f.fearTurns--;
    if(f.markTurns>0) f.markTurns--;
    if(f.dmgDownTurns>0) f.dmgDownTurns--;
    if(f.defDownTurns>0) f.defDownTurns--;
    if(f.wolfTurns>0){ f.wolfTurns--; if(f.wolfTurns===0){ f.dmgBonusPct=Math.max(0, f.dmgBonusPct-30); addLog(`🌕 Волк ${f.name} кончился`, 'hit'); } }
    if(f.avatarDmgTurns>0){ f.avatarDmgTurns--; if(f.avatarDmgTurns===0){ f.dmgBonusPct=Math.max(0, f.dmgBonusPct-200); addLog(`👑 Аватар урон ${f.name} кончился`, 'hit'); } }
    if(f.timeWarpStacks>0 && Math.random()<0.2) f.timeWarpStacks=0;
    f.mana=Math.min(f.maxMana, f.mana+8);
    for(let i=0;i<f.cd.length;i++) if(f.cd[i]>0) f.cd[i]--;
  });
  updateBars();
  if(player.hp<=0 && bot.hp<=0){ addLog(`💀 Оба пали! Ничья`, 'lose'); isOver=true; let m=document.getElementById('resultModal'); if(m) m.classList.add('show'); let t=document.getElementById('resultTitle'); if(t) t.textContent='НИЧЬЯ!'; let s=document.getElementById('resultSub'); if(s) s.textContent=`Оба пали • ${window.CURRENT_DIFF.toUpperCase()}`; return; }
  if(bot.hp<=0){ win(); return; }
  if(player.hp<=0){ lose(); return; }
}
function playerAction(idx){
  if(isOver) return;
  if(player.stunTurns>0){
    addLog(`💤 Ты оглушен ${player.stunTurns}р, пропускаешь ход`, 'lose');
    player.stunTurns--;
    endPlayerTurn(); return;
  }
  if(player.cd[idx]>0){ addLog(`⛔ Скилл на КД ${player.cd[idx]}р`, 'lose'); return; }
  let info=getSkillInfo(player.id, idx);
  if(idx!==0 && player.mana < info.mana){ addLog(`⛔ Не хватает маны ${info.mana} (есть ${player.mana})`, 'lose'); return; }
  executeSkill(player, bot, idx);
  updateBars();
  if(bot.hp<=0){ win(); return; }
  endPlayerTurn();
}
function endPlayerTurn(){
  renderSkills();
  setTimeout(botTurn, 600);
}
function botTurn(){
  if(isOver) return;
  if(bot.stunTurns>0){
    addLog(`💤 ${bot.name} оглушен ${bot.stunTurns}р, пропускает ход`, 'hit');
    bot.stunTurns--;
    endBotTurn(); return;
  }
  let diff=window.CURRENT_DIFF||'medium';
  let action=chooseBotAction(diff);
  if(action.type==='skip'){ addLog(`💤 ${bot.name} пропускает ход (нет маны)`, 'hit'); }
  else { executeSkill(bot, player, action.idx); }
  updateBars();
  if(player.hp<=0){ lose(); return; }
  endBotTurn();
}
function endBotTurn(){
  turn++;
  addLog(`--- Конец раунда ${turn-1} — эффекты: яды, скелеты, сферы ---`, '');
  endRoundEffects();
  if(isOver) return;
  addLog(`--- Раунд ${turn}: твой ход ---`, '');
  renderSkills();
  if(player.stunTurns>0){ setTimeout(autoPlayerStunSkip, 700); }
}
function autoPlayerStunSkip(){
  if(isOver) return; if(player.stunTurns<=0) return;
  addLog(`💤 Ты оглушен ${player.stunTurns}р, пропускаешь ход (авто)`, 'lose');
  player.stunTurns--;
  setTimeout(botTurn, 600);
}
function chooseBotAction(diff){
  let avail=[];
  for(let i=0;i<=4;i++){ if(bot.cd[i]<=0){ let info=getSkillInfo(bot.id, i); if(bot.mana>=info.mana) avail.push({idx:i, info}); } }
  if(avail.length===0) return {type:'skip'};
  let pPct=player.hp/player.maxHp, bPct=bot.hp/bot.maxHp;
  if(diff==='easy'){ if(Math.random()<0.5){ let atk=avail.find(a=>a.idx===0); if(atk) return atk; } return avail[Math.floor(Math.random()*avail.length)]; }
  let ult=avail.find(a=>a.idx===4); if(ult && pPct<0.35) return ult;
  if(bPct<0.35){
    let defSkill = avail.find(a=>{ let n=a.info.name; return n.includes('Щит')||n.includes('Бастион')||n.includes('Аватар')||n.includes('Альфа')||n.includes('Шаг'); });
    if(defSkill) return defSkill;
  }
  if(player.stunTurns===0){
    let stunSkill=avail.find(a=>{ let n=a.info.name; return n.includes('Лиана')||n.includes('Льва')||n.includes('Тюрьма')||n.includes('Зов')||n.includes('Призрачная')||n.includes('Аннигиляция'); });
    if(stunSkill && Math.random()<0.8) return stunSkill;
  }
  if(bPct<0.6){
    let healSkill=avail.find(a=>a.info.name.includes('Похищение')||a.info.name.includes('Щит'));
    if(healSkill) return healSkill;
  }
  avail.sort((a,b)=> (b.idx===4?5:b.idx) - (a.idx===4?5:a.idx));
  let hawk=avail.find(a=>a.info.name.includes('Глаз')); if(hawk && bot.hawkEyeTurns===0) return hawk;
  return avail[0];
}
function win(){
  isOver=true; addLog(`✅ ПОБЕДА! Ты победил ${bot.name} [${window.CURRENT_DIFF}]`, 'win');
  let m=document.getElementById('resultModal'); if(m) m.classList.add('show');
  let t=document.getElementById('resultTitle'); if(t) t.textContent=(typeof volandT==='function' ? volandT('ПОБЕДА!','VICTORY!') : 'ПОБЕДА!');
  let s=document.getElementById('resultSub'); if(s) s.textContent=`${player.name} ${(typeof volandT==='function' ? volandT('победил','defeated') : 'победил')} ${bot.name} • ${window.CURRENT_DIFF.toUpperCase()} • PVP V3 ${(typeof volandT==='function' ? volandT('бафы/дебафы','buffs/debuffs') : 'бафы/дебафы')}`;
  try{ if(typeof volandAddGold==='function') volandAddGold(50); }catch(e){}
}
function lose(){
  isOver=true; addLog(`❌ ПОРАЖЕНИЕ! Тебя победил ${bot.name}`, 'lose');
  let m=document.getElementById('resultModal'); if(m) m.classList.add('show');
  let t=document.getElementById('resultTitle'); if(t) t.textContent=(typeof volandT==='function' ? volandT('ПОРАЖЕНИЕ!','DEFEAT!') : 'ПОРАЖЕНИЕ!');
  let s=document.getElementById('resultSub'); if(s) s.textContent=`${bot.name} ${(typeof volandT==='function' ? volandT('победил','defeated') : 'победил')} • ${window.CURRENT_DIFF.toUpperCase()} • PVP V3`;
}
function renderSkills(){
  let bar=document.getElementById('skillBar'); if(!bar) return; let html='';
  for(let i=0;i<=4;i++){
    let info=getSkillInfo(player.id, i);
    let cd=player.cd[i]; let can=cd<=0 && player.mana>=info.mana && player.stunTurns===0 && !isOver;
    let key=['Q','W','E','R','T'][i];
    html+=`<button class="skill-btn ${can?'':'disabled'}" onclick="window.pvpPlayerAction(${i})" ${can?'':'disabled'}><div class="key">${key}</div><div class="skill-icon">${info.icon && info.icon.indexOf(".")!==-1 ? `<img src="${info.icon}" style="width:28px;height:28px;object-fit:cover;border-radius:6px;display:block;margin:0 auto 4px" onerror="this.style.display='none'">` : `<div style="font-size:22px;line-height:1;margin:0 auto 4px;text-align:center">${info.icon||"🔮"}</div>`}</div><div class="name">${info.displayName || info.name}</div><div class="meta">${info.mana} mana ${cd>0?'• CD '+cd:''}</div></button>`;
  }
  bar.innerHTML=html;
}
window.pvpPlayerAction=playerAction; window.pvpInit=initBattle;
})();
