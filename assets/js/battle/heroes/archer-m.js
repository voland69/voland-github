// DARK RANGER archer-m - rework: 7x180% zalp, 200% prizrachnaya, invis crit for skills, mark +100% to skill
(function(){
let markTurns=0, invisTurns=0, attackCount=0;

function extra(){ 
  let s=[]; 
  if(markTurns>0) s.push('👁️МЕТКА '+markTurns+' +100%'); 
  if(invisTurns>0) s.push('🌑ИНВИЗ '+invisTurns); 
  s.push('АТАК:'+attackCount);
  return s.join(' '); 
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extra; },100);

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;

 // Q - обычная атака
 if(idx===0){
  attackCount++;
  let isFourth = (attackCount%4===0);
  let markActive = markTurns>0;
  let mult = 1.0 + (markActive ? 1.0 : 0); // +100% если метка
  let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-12,12));
  let forceCrit = invisTurns>0;
  let isCrit = forceCrit || (Math.random()*100 < cur.CRIT);
  if(isCrit) base = Math.floor(base*1.5);
  let wasInvis = invisTurns>0;
  if(wasInvis){ invisTurns=0; addLog('🌑 Инвиз снят, крит!','skill'); }
  ctx.eHp = Math.max(0, ctx.eHp - base);
  if(markActive && ctx.eHp<=0){ ctx.hMana = Math.min(ctx.hMaxMana, ctx.hMana+15); addLog('👁️ Убийство метки +15 маны','skill'); }
  addLog('🏹 Атака '+(markActive?'+МЕТКА ':'')+base+(isCrit? (wasInvis?' CRIT ИНВИЗ':' CRIT') : '')+(isFourth?' [4-я → МЕТКА]':''),'hit');
  if(isFourth){ markTurns=2; addLog('👁️ Метка Тени наложена 2р +100%','skill'); }
  ctx.cooldowns[0]=1; updBars(); return true;
 }

 let sk=activeSkills[idx-1];
 if(!sk) return false;

 // W - Беглый выстрел 200% (+100% метка =300%)
 if(sk.name.includes('Беглый')){
  if(ctx.hMana<sk.mana){ addLog('⛔ Не хватает маны!','lose'); return false; }
  attackCount++;
  let isFourth = (attackCount%4===0);
  let markActive = markTurns>0;
  let mult = 2.0 + (markActive ? 1.0 : 0);
  let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-10,10));
  let wasInvis = invisTurns>0;
  let isCrit = wasInvis || (Math.random()*100 < cur.CRIT);
  if(isCrit) base = Math.floor(base*1.4);
  if(wasInvis){ invisTurns=0; addLog('🌑 Инвиз снят, крит!','skill'); }
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
  ctx.eHp = Math.max(0, ctx.eHp - base);
  if(markActive && ctx.eHp<=0){ ctx.hMana = Math.min(ctx.hMaxMana, ctx.hMana+15); addLog('👁️ Убийство метки +15 маны','skill'); }
  addLog('🏹 '+sk.name+' '+(markActive?'+МЕТКА ':'')+base+' ['+Math.round(mult*100)+'%]'+(isCrit? (wasInvis?' CRIT ИНВИЗ':' CRIT'):'')+(isFourth?' [4-я]':''),'skill');
  if(isFourth){ markTurns=2; addLog('👁️ Метка Тени наложена 2р +100%','skill'); }
  updBars(); return true;
 }

 // E - Шаг в Ничто - инвиз 3р
 if(sk.name.includes('Шаг')){
  if(ctx.hMana<sk.mana){ addLog('⛔ Не хватает маны!','lose'); return false; }
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||20;
  invisTurns=3;
  addLog('🌑 '+sk.name+' инвиз 3р, след атака/скил гарант крит','skill');
  updBars(); return true;
 }

 // R - Призрачная Стрела 200% (+100% метка =300%) + 33% стан
 if(sk.name.includes('Призрачная')){
  if(ctx.hMana<sk.mana){ addLog('⛔ Не хватает маны!','lose'); return false; }
  attackCount++;
  let isFourth = (attackCount%4===0);
  let markActive = markTurns>0;
  let mult = 2.0 + (markActive ? 1.0 : 0);
  let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-10,10));
  let wasInvis = invisTurns>0;
  let isCrit = wasInvis || (Math.random()*100 < cur.CRIT);
  if(isCrit) base = Math.floor(base*1.4);
  if(wasInvis){ invisTurns=0; addLog('🌑 Инвиз снят, крит!','skill'); }
  let doStun = Math.random()<0.33;
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||5;
  ctx.eHp = Math.max(0, ctx.eHp - base);
  if(markActive && ctx.eHp<=0){ ctx.hMana = Math.min(ctx.hMaxMana, ctx.hMana+15); addLog('👁️ Убийство метки +15 маны','skill'); }
  addLog('💫 '+sk.name+' '+(markActive?'+МЕТКА ':'')+base+' ['+Math.round(mult*100)+'%]'+(isCrit? (wasInvis?' CRIT ИНВИЗ':' CRIT'):'')+(doStun?' +стан!':'')+(isFourth?' [4-я]':''),'skill');
  if(doStun) setEnemyStun(1);
  if(isFourth){ markTurns=2; addLog('👁️ Метка Тени наложена 2р +100%','skill'); }
  updBars(); return true;
 }

 // T - Залп Бездны 7x180% (1260%)
 if(sk.name.includes('Залп')){
  if(ctx.hMana<sk.mana){ addLog('⛔ Не хватает маны!','lose'); return false; }
  attackCount++;
  let isFourth = (attackCount%4===0);
  let markActive = markTurns>0;
  let wasInvis = invisTurns>0;
  let total=0, critCount=0;
  for(let i=0;i<7;i++){
    let isFirst = i===0;
    let curMult = 1.8;
    // метка: если была активна до каста - все стрелы +100%, если это 4-я атака - только 1 стрела +100%
    if(markActive && !isFourth){
      curMult += 1.0; // 180+100=280% каждая
    } else if(isFourth && isFirst){
      curMult += 1.0; // только 1-я стрела +100% при 4-й атаке
    } else if(markActive && isFourth){
      // если и метка была и это 4-я - тоже только 1-я +100% чтобы не апать 7x
      if(isFirst) curMult += 1.0;
    }
    let isCrit = false;
    if(wasInvis && isFirst) isCrit=true; // инвиз: только 1-я стрела гарант крит
    else if(wasInvis && !isFirst) isCrit = Math.random()*100 < cur.CRIT;
    else if(isFourth && isFirst) isCrit=true; // 4-я атака залп: 1 стрела 100% крит
    else isCrit = Math.random()*100 < cur.CRIT;

    let d = Math.max(5, Math.floor(cur.DMG*curMult) - eDef + rand(-8,8));
    if(isCrit){ d=Math.floor(d*1.4); critCount++; }
    total+=d;
  }
  if(wasInvis){ invisTurns=0; addLog('🌑 Инвиз снят, крит 1 стрела!','skill'); }
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25;
  ctx.eHp = Math.max(0, ctx.eHp - total);
  if(markActive && ctx.eHp<=0){ ctx.hMana = Math.min(ctx.hMaxMana, ctx.hMana+15); addLog('👁️ Убийство метки +15 маны','skill'); }
  addLog('🌌 '+sk.name+' 7 стрел → '+total+' ['+(markActive?'+МЕТКА ':'')+'180%×7'+(markActive && !isFourth?' +100%':'')+'] критов:'+critCount+(wasInvis?' +инвиз 1 крит':'')+(isFourth?' [4-я 1 крит]':''),'skill');
  if(isFourth){ markTurns=2; addLog('👁️ Метка Тени наложена 2р +100%','skill'); }
  updBars(); return true;
 }

 return false;
};

window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 if(invisTurns>0){
  ctx.addLog('🌑 Враг не видит тебя (инвиз '+invisTurns+') — промах!','skill');
  return true; // скипаем удар врага
 }
 return false;
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 if(markTurns>0){ markTurns--; if(markTurns==0 && window.VB) window.VB.addLog('👁️ Метка кончилась','hit'); }
 if(invisTurns>0){ invisTurns--; if(invisTurns==0 && window.VB) window.VB.addLog('🌑 Инвиз кончился','hit'); }
};

})();
