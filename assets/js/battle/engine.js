// VOLAND BATTLE ENGINE v1 - core combat
let battle = null;
let currentLoc = null;
let currentStage = null;
let lastEnemyData = null;

function calcDamage(attacker, defender, multiplier){
  if ((defender.immune||0)>0){
    return {dmg:0, crit:false, dodge:false, parry:false, immune:true};
  }
  const effectiveDmg = attacker.dmg * (1 + (attacker.dmgBuff||0));
  const base = effectiveDmg * (multiplier||1);
  const defReduce = defender.def * 0.5;
  let dmg = Math.max(5, base - defReduce);
  const isCrit = Math.random()*100 < attacker.crit;
  if (isCrit) dmg *= 1.5;
  const isDodge = Math.random()*100 < (defender.dodge||0);
  if (isDodge) return {dmg:0, crit:false, dodge:true, parry:false, immune:false};
  const isParry = Math.random()*100 < (defender.parry||0);
  if (isParry) return {dmg:0, crit:false, dodge:false, parry:true, immune:false};
  dmg *= (0.9 + Math.random()*0.2);
  return {dmg: Math.floor(dmg), crit:isCrit, dodge:false, parry:false, immune:false};
}

function startBattle(stage){
  hideVictory();
  currentStage = stage;
  const enemies = VOLAND_ENEMIES[currentLoc];
  const eData = enemies.find(x=>x.stage===stage);
  if (!eData){ logChat('Моб не найден'); return; }
  lastEnemyData = eData;
  const hStats = getHeroStats();
  const scaleHp = [0.4, 0.7, 1.0, 1.6][stage-1] || 0.5;
  const scaleDmg = [0.4, 0.6, 0.85, 1.15][stage-1] || 0.5;
  const scaleDef = [0.3, 0.5, 0.7, 0.9][stage-1] || 0.5;
  battle = {
    hero: {
      name: heroData.n,
      baseMaxHp: hStats.HP,
      baseDmg: hStats.DMG,
      maxHp: hStats.HP,
      hp: hStats.HP,
      maxMana: hStats.MANA,
      mana: hStats.MANA,
      dmg: hStats.DMG,
      def: hStats.DEF,
      crit: hStats.CRIT,
      dodge: hStats.DODGE||0,
      parry: hStats.PARRY||0,
      immune:0,
      dmgBuff:0,
      dmgBuffTurns:0,
      hpBuff:0,
      hpBuffTurns:0,
      block:0,
      blockTurns:0,
      reflect:0,
      reflectTurns:0,
      skills: heroData.sk,
      cooldowns: [0,0,0,0,0],
      manaCosts: heroData.sk.map(s=>parseManaCost(s[5])),
      cdMax: heroData.sk.map(s=>parseCooldown(s[5])),
      mult: heroData.sk.map(s=>parseSkillMultiplier(s[4]))
    },
    enemy: {
      name: eData.name,
      icon: eData.icon,
      maxHp: Math.floor(hStats.HP * scaleHp + 50),
      hp: Math.floor(hStats.HP * scaleHp + 50),
      dmg: Math.floor(hStats.DMG * scaleDmg + 10),
      def: Math.floor(hStats.DEF * scaleDef + 5),
      crit: 5 + stage*2,
      dodge: 3 + stage*2,
      parry: eData.boss ? 15 : 0,
      stunned:0,
      stage: stage,
      lvl: eData.lvl,
      boss: !!eData.boss
    },
    turn: 'hero',
    log: []
  };
  document.getElementById('locView').style.display='none';
  document.getElementById('enemyView').style.display='none';
  document.getElementById('battleView').style.display='flex';
  document.getElementById('btnToHero').style.display='none';
  document.getElementById('btnToLocs').style.display='none';
  document.getElementById('mainTitle').textContent = 'BATTLE • ' + eData.name;
  document.getElementById('mainSub').textContent = 'STAGE '+stage+' • '+eData.eng+' • БОЙ ИДЕТ • PARRY '+battle.enemy.parry+'%';
  document.getElementById('bHeroName').textContent = battle.hero.name + ' • ' + profileName.toUpperCase();
  document.getElementById('bHeroSub').textContent = heroData.role + ' • HP '+battle.hero.maxHp+' • DMG '+battle.hero.dmg;
  document.getElementById('bHeroImg').src = heroData.img;
  document.getElementById('bEnemyName').textContent = battle.enemy.name;
  document.getElementById('bEnemySub').textContent = eData.eng + ' • ' + eData.lvl + (eData.boss?' • BOSS • PARRY 15%':'');
  document.getElementById('bEnemyImgWrap').innerHTML = '<div style="font-size:64px">'+battle.enemy.icon+'</div>';
  clearBattleLog();
  addBattleLog('Бой начался: '+battle.hero.name+' vs '+battle.enemy.name, 'sys');
  addBattleLog('Твои статы: HP '+battle.hero.maxHp+' DMG '+battle.hero.dmg+' DEF '+battle.hero.def+' MANA '+battle.hero.maxMana+' CRIT '+battle.hero.crit+'% '+(battle.hero.parry>0 ? 'PARRY '+battle.hero.parry+'%' : 'DODGE '+battle.hero.dodge+'%'), 'hero');
  addBattleLog('Враг: HP '+battle.enemy.maxHp+' DMG '+battle.enemy.dmg+' DEF '+battle.enemy.def+' PARRY '+battle.enemy.parry+'%', 'enemy');
  renderBattleUI(); renderActions();
}

function heroAction(type, skillIdx){
  if (!battle || battle.turn!=='hero') return;
  if (type==='attack'){
    const res = calcDamage(battle.hero, battle.enemy, 1.0);
    if (res.immune){ addBattleLog(battle.enemy.name + ' неуязвим! Урон 0 🛡️', 'sys'); }
    else if (res.dodge){ addBattleLog(battle.enemy.name + ' увернулся от атаки!', 'enemy'); }
    else if (res.parry){ addBattleLog(battle.enemy.name + ' парировал атаку ' + battle.hero.name + '! 🛡️', 'enemy'); }
    else { battle.enemy.hp -= res.dmg; addBattleLog(battle.hero.name + ' бьет на ' + res.dmg + (res.crit?' CRIT!':'') + ' • HP врага ' + Math.max(0,battle.enemy.hp) + '/' + battle.enemy.maxHp, res.crit?'crit':'hero'); }
  } else if (type==='skill'){
    const i = skillIdx;
    if (battle.hero.cooldowns[i]>0){ addBattleLog('Скил на КД: '+battle.hero.cooldowns[i]+' ходов', 'sys'); return; }
    if (battle.hero.mana < battle.hero.manaCosts[i]){ addBattleLog('Не хватает маны для '+battle.hero.skills[i][0], 'sys'); return; }
    const mult = battle.hero.mult[i];
    const res = calcDamage(battle.hero, battle.enemy, mult);
    battle.hero.mana -= battle.hero.manaCosts[i];
    battle.hero.cooldowns[i] = battle.hero.cdMax[i];
    if (res.immune){ addBattleLog(battle.enemy.name + ' неуязвим к скилу ' + battle.hero.skills[i][0] + '!', 'sys'); }
    else if (res.dodge){ addBattleLog(battle.enemy.name + ' увернулся от скила ' + battle.hero.skills[i][0] + '!', 'enemy'); }
    else if (res.parry){ addBattleLog(battle.enemy.name + ' парировал скил ' + battle.hero.skills[i][0] + ' 🛡️', 'enemy'); }
    else { battle.enemy.hp -= res.dmg; addBattleLog(battle.hero.name + ' кастует ' + battle.hero.skills[i][0] + ' ['+battle.hero.skills[i][1]+'] на ' + res.dmg + (res.crit?' CRIT!':'') + ' • '+battle.hero.skills[i][4].slice(0,60), res.crit?'crit':'hero'); }
    const sName = battle.hero.skills[i][0];
    applySkillEffect(sName, battle);
  }
  for (let j=0;j<battle.hero.cooldowns.length;j++){ if (battle.hero.cooldowns[j]>0) battle.hero.cooldowns[j]--; }
  renderBattleUI(); renderActions();
  if (battle.enemy.hp<=0){
    addBattleLog('ПОБЕДА! ' + battle.enemy.name + ' повержен!', 'crit');
    logChat('Победа над ' + battle.enemy.name + ' Stage '+battle.enemy.stage);
    battle.turn = 'ended';
    setTimeout(()=> showVictory(true), 600);
    return;
  }
  battle.turn = 'enemy'; renderBattleUI(); renderActions(); setTimeout(enemyTurn, 800);
}

function enemyTurn(){
  if (!battle || battle.enemy.hp<=0) return;
  if (battle.enemy.stunned>0){
    addBattleLog('🌀 ' + battle.enemy.name + ' оглушен! Пропускает ход!', 'sys');
    battle.enemy.stunned--;
    battle.turn='hero'; renderBattleUI(); renderActions(); return;
  }
  const res = calcDamage(battle.enemy, battle.hero, 1.0);
  let finalDmg = res.dmg;
  let blocked = 0;
  let reflected = 0;
  if (!res.immune && !res.dodge && !res.parry){
    if (battle.hero.blockTurns>0 && battle.hero.block>0){
      blocked = Math.floor(finalDmg * battle.hero.block);
      finalDmg -= blocked;
      addBattleLog('🛡️ Бастион блокирует ' + blocked + ' урона ('+Math.round(battle.hero.block*100)+'% )', 'hero');
    }
    if (battle.hero.reflectTurns>0 && battle.hero.reflect>0 && finalDmg>0){
      reflected = Math.floor(finalDmg * battle.hero.reflect);
      if (reflected>0){
        battle.enemy.hp -= reflected;
        addBattleLog('↩️ Отражение ' + reflected + ' урона обратно в ' + battle.enemy.name + '!', 'crit');
      }
    }
  }
  if (res.immune){ addBattleLog(battle.hero.name + ' неуязвим! 🛡️ Урон 0', 'hero'); }
  else if (res.dodge){ addBattleLog(battle.hero.name + ' увернулся от атаки ' + battle.enemy.name + '!', 'hero'); }
  else if (res.parry){ addBattleLog(battle.hero.name + ' парировал атаку ' + battle.enemy.name + '! 🛡️', 'hero'); }
  else { 
    battle.hero.hp -= finalDmg; 
    let txt = battle.enemy.name + ' бьет на ' + finalDmg;
    if (blocked>0) txt += ' (блок '+blocked+')';
    txt += (res.crit?' CRIT!':'') + ' • Твое HP ' + Math.max(0,battle.hero.hp) + '/' + battle.hero.maxHp;
    addBattleLog(txt, res.crit?'crit':'enemy'); 
  }
  renderBattleUI();
  if (battle.enemy.hp<=0){
    addBattleLog('ПОБЕДА! ' + battle.enemy.name + ' повержен отражением!', 'crit');
    battle.turn='ended';
    setTimeout(()=> showVictory(true), 600);
    return;
  }
  if (battle.hero.hp<=0){
    addBattleLog('ПОРАЖЕНИЕ! Ты пал в бою против ' + battle.enemy.name, 'enemy');
    logChat('Поражение от ' + battle.enemy.name);
    battle.turn = 'ended'; renderActions();
    setTimeout(()=> showVictory(false), 600);
    return;
  }
  if (battle.hero.immune>0){ battle.hero.immune--; if (battle.hero.immune===0) addBattleLog('Неуязвимость спала', 'sys'); }
  if (battle.hero.blockTurns>0){ battle.hero.blockTurns--; if (battle.hero.blockTurns===0){ battle.hero.block=0; battle.hero.reflect=0; addBattleLog('Имперский Бастион спал', 'sys'); } }
  if (battle.hero.reflectTurns>0){ battle.hero.reflectTurns--; }
  if (battle.hero.dmgBuffTurns>0){
    battle.hero.dmgBuffTurns--;
    if (battle.hero.dmgBuffTurns===0){
      battle.hero.dmgBuff=0;
      battle.hero.dmg = battle.hero.baseDmg;
      addBattleLog('Баф +300% урона закончился', 'sys');
    }
  }
  if (battle.hero.hpBuffTurns>0){
    battle.hero.hpBuffTurns--;
    if (battle.hero.hpBuffTurns===0){
      battle.hero.maxHp = battle.hero.baseMaxHp;
      if (battle.hero.hp > battle.hero.maxHp) battle.hero.hp = battle.hero.maxHp;
      battle.hero.hpBuff=0;
      addBattleLog('Баф +50% HP закончился', 'sys');
    }
  }
  battle.turn = 'hero'; renderBattleUI(); renderActions();
}
