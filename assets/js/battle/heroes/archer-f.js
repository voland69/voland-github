// WILD PATH archer-f - обновленные скилы: W 200% x2 + бличка 25% true 2р, E 200% + яд 25% true 3р, T 150%
(function(){
let bleedTurns=0, bleedDmg=0, poisonTurns=0, poisonDmg=0, hawkEyeTurns=0, stormTurns=0, stormLeft=0, nextCrit=false;

function extraStat(){
 let s=[];
 if(bleedTurns>0) s.push('🩸БЛИЧКА '+bleedTurns+' true');
 if(poisonTurns>0) s.push('☠️ЯД '+poisonTurns+' true');
 if(hawkEyeTurns>0) s.push('🦅ГЛАЗ '+hawkEyeTurns);
 if(stormTurns>0) s.push('🌪️БУРЯ '+stormTurns+' ('+stormLeft+')');
 if(nextCrit) s.push('🐾КРИТ-след');
 return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extraStat; },100);

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 let effDefBase = Math.floor(eDef * (hawkEyeTurns>0 ? 0.8 : 1));

 if(idx===0){
  let critChance = cur.CRIT + (hawkEyeTurns>0?25:0) + (nextCrit?100:0);
  let isCrit = nextCrit || (Math.random()*100 < critChance);
  let base = Math.max(10, cur.DMG - effDefBase + rand(-12,12));
  if(isCrit) base = Math.floor(base*1.5);
  ctx.eHp = Math.max(0, ctx.eHp - base);
  addLog('⚔️ Ты бьешь '+ctx.enemyData.name+' [АТАКА] на '+base+(isCrit?' CRIT!':''),'hit');
  if(nextCrit){ nextCrit=false; addLog('🐾 Тропы Зверя: крит использован','skill'); }
  updBars(); return true;
 }

 let sk=activeSkills[idx-1];
 if(!sk) return false;
 if(ctx.hMana < sk.mana){ addLog('⛔ Не хватает маны! Нужно '+sk.mana,'lose'); return false; }

 // W - Двойной Выстрел 2x200% + бличка 25% true 2р
 if(sk.name.includes('Двойной')){
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
  let critChance = cur.CRIT + (hawkEyeTurns>0?25:0);
  let total=0;
  for(let i=0;i<2;i++){
   let isCrit = nextCrit || (Math.random()*100 < critChance);
   let d = Math.max(15, Math.floor(cur.DMG*2.0) - effDefBase + rand(-10,10));
   if(isCrit) d=Math.floor(d*1.4);
   total+=d;
   addLog('🎯 Стрела '+(i+1)+' → '+d+(isCrit?' CRIT!':''),'skill');
   await new Promise(r=>setTimeout(r,60));
  }
  ctx.eHp=Math.max(0, ctx.eHp-total);
  addLog('🎯 '+sk.name+' [200% x2] → '+total+' [400%]','skill');
  bleedTurns=2;
  bleedDmg=Math.floor(cur.DMG*0.25);
  addLog('🩸 Кровотечение 25% true ('+bleedDmg+') на 2р игнор DEF','skill');
  if(nextCrit) nextCrit=false;
  updBars(); return true;
 }

 // E - Ядовитая Лиана 200% + стан 1р + яд 25% true 3р
 if(sk.name.includes('Лиана') || sk.name.includes('Ядовит')){
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||10;
  let isCrit = nextCrit || (Math.random()*100 < (cur.CRIT + (hawkEyeTurns>0?25:0)));
  let base = Math.max(15, Math.floor(cur.DMG*2.0) - effDefBase + rand(-10,10));
  if(isCrit) base=Math.floor(base*1.4);
  ctx.eHp=Math.max(0, ctx.eHp-base);
  setEnemyStun(1);
  poisonTurns=3;
  poisonDmg=Math.floor(cur.DMG*0.25);
  addLog('🌿 '+sk.name+' '+base+' [200%] + стан 1р + яд 25% true ('+poisonDmg+') 3р','skill');
  if(nextCrit) nextCrit=false;
  updBars(); return true;
 }

 // R - Глаз Ястреба
 if(sk.name.includes('Глаз')){
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||20;
  hawkEyeTurns=4;
  addLog('🦅 '+sk.name+' → +25% крит + игнор 20% брони 4р','skill');
  updBars(); return true;
 }

 // T - Буря Стрел 9 стрел за 3р по 150% + 25% стан
 if(sk.name.includes('Буря')){
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25;
  stormTurns=3;
  stormLeft=9;
  addLog('🌪️ '+sk.name+' → 9 стрел за 3р по 150% + 25% стан','skill');
  updBars(); return true;
 }

 return false;
};

window.VOLAND_HERO_ON_TURN_END = function(ctx){
 let {cur, rand, addLog, updBars}=ctx;
 let eDef=window.VB.eDef;
 let effDef = Math.floor(eDef * (hawkEyeTurns>0 ? 0.8 : 1));

 if(bleedTurns>0){
  // true damage - игнор DEF
  let d = bleedDmg;
  ctx.eHp=Math.max(0, ctx.eHp-d);
  addLog('🩸 Кровотечение '+d+' true ['+bleedTurns+'р]','skill');
  updBars();
 }
 if(poisonTurns>0){
  let d = poisonDmg;
  ctx.eHp=Math.max(0, ctx.eHp-d);
  addLog('☠️ Яд '+d+' true ['+poisonTurns+'р]','skill');
  updBars();
 }
 if(stormTurns>0 && stormLeft>0){
  let arrows = Math.ceil(stormLeft / stormTurns);
  if(arrows<1) arrows=1;
  if(arrows>stormLeft) arrows=stormLeft;
  let total=0;
  let doStun=false;
  for(let i=0;i<arrows;i++){
   let d=Math.max(10, Math.floor(cur.DMG*1.5) - effDef + rand(-6,6));
   if(Math.random()*100 < (cur.CRIT + (hawkEyeTurns>0?25:0))) d=Math.floor(d*1.4);
   total+=d;
   if(Math.random()*100 < 25) doStun=true;
  }
  stormLeft-=arrows;
  ctx.eHp=Math.max(0, ctx.eHp-total);
  addLog('🌪️ Буря '+arrows+' стрел → '+total+' [150% x'+arrows+']'+(doStun?' + стан!':''),'skill');
  if(doStun) window.VB._setStun=1;
  updBars();
 }
};

window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 if(Math.random()*100 < ctx.cur.DODGE){
  ctx.addLog('🐾 Тропы Зверя: уклонение! След удар 100% крит','skill');
  nextCrit=true;
  ctx.updBars();
  return true;
 }
 return false;
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 if(bleedTurns>0){ bleedTurns--; if(bleedTurns==0) window.VB.addLog('🩸 Кровотечение кончилось','hit'); }
 if(poisonTurns>0){ poisonTurns--; if(poisonTurns==0) window.VB.addLog('☠️ Яд кончился','hit'); }
 if(hawkEyeTurns>0){ hawkEyeTurns--; if(hawkEyeTurns==0) window.VB.addLog('🦅 Глаз Ястреба кончился','hit'); }
 if(stormTurns>0){
  stormTurns--;
  if(stormTurns==0){
   window.VB.addLog('🌪️ Буря Стрел закончилась','hit');
   stormLeft=0;
  }
 }
};

})();
