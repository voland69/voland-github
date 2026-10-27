// WILD PATH archer-f - полная механика по ТЗ
(function(){
let bleedTurns=0, bleedDmg=0, poisonTurns=0, poisonDmg=0, hawkEyeTurns=0, stormTurns=0, stormLeft=0, nextCrit=false;

function extraStat(){
 let s=[];
 if(bleedTurns>0) s.push('🩸БЛИЧКА '+bleedTurns+'('+bleedDmg+')');
 if(poisonTurns>0) s.push('☠️ЯД '+poisonTurns);
 if(hawkEyeTurns>0) s.push('🦅ГЛАЗ '+hawkEyeTurns+' (+25% крит, -20% брони)');
 if(stormTurns>0) s.push('🌪️БУРЯ '+stormTurns+' ('+stormLeft+' стрел)');
 if(nextCrit) s.push('🐾КРИТ-след');
 return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extraStat; },100);

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 // база АТАКА - перехватываем чтобы учесть бафы
 if(idx===0){
  let effDef = Math.floor(eDef * (hawkEyeTurns>0 ? 0.8 : 1));
  let critChance = cur.CRIT + (hawkEyeTurns>0?25:0) + (nextCrit?100:0);
  let isCrit = nextCrit || (Math.random()*100 < critChance);
  let base = Math.max(10, cur.DMG - effDef + rand(-12,12));
  if(isCrit) base = Math.floor(base*1.5);
  ctx.eHp = Math.max(0, ctx.eHp - base);
  addLog('⚔️ Ты бьешь '+ctx.enemyData.name+' [АТАКА] на '+base+(isCrit?' CRIT!':''),'hit');
  if(nextCrit){ nextCrit=false; addLog('🐾 Тропы Зверя: крит использован','skill'); }
  updBars(); return true;
 }
 let sk=activeSkills[idx-1];
 if(!sk) return false;
 if(ctx.hMana < sk.mana){ addLog('⛔ Не хватает маны! Нужно '+sk.mana,'lose'); return false; }

 // 1 - Двойной Выстрел
 if(sk.name.includes('Двойной')){
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
  let effDef = Math.floor(eDef * (hawkEyeTurns>0 ? 0.8 : 1));
  let critChance = cur.CRIT + (hawkEyeTurns>0?25:0);
  let total=0;
  for(let i=0;i<2;i++){
   let isCrit = nextCrit || (Math.random()*100 < critChance);
   let d = Math.max(10, Math.floor(cur.DMG*1.0) - effDef + rand(-10,10));
   if(isCrit) d=Math.floor(d*1.5);
   total+=d;
   addLog('🎯 Стрела '+(i+1)+' → '+d+(isCrit?' CRIT!':''),'skill');
   await new Promise(r=>setTimeout(r,60));
  }
  ctx.eHp=Math.max(0, ctx.eHp-total);
  addLog('🎯 '+sk.name+' [100% x2] → '+total,'skill');
  bleedTurns=4;
  bleedDmg=Math.floor(cur.DMG*0.25);
  addLog('🩸 Кровотечение 25% ('+bleedDmg+') на 4р','skill');
  if(nextCrit) nextCrit=false;
  updBars(); return true;
 }
 // 2 - Ядовитая Лиана
 if(sk.name.includes('Лиана') || sk.name.includes('Ядовит')){
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||10;
  let effDef = Math.floor(eDef * (hawkEyeTurns>0 ? 0.8 : 1));
  let critChance = cur.CRIT + (hawkEyeTurns>0?25:0);
  let isCrit = nextCrit || (Math.random()*100 < critChance);
  let base = Math.max(15, Math.floor(cur.DMG*1.0) - effDef + rand(-10,10));
  if(isCrit) base=Math.floor(base*1.4);
  ctx.eHp=Math.max(0, ctx.eHp-base);
  setEnemyStun(1);
  poisonTurns=3;
  poisonDmg=Math.floor(cur.DMG*1.0);
  addLog('🌿 '+sk.name+' '+base+' + стан 1р + яд '+poisonDmg+' 3р','skill');
  if(nextCrit) nextCrit=false;
  updBars(); return true;
 }
 // 3 - Глаз Ястреба
 if(sk.name.includes('Глаз')){
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||20;
  hawkEyeTurns=4;
  addLog('🦅 '+sk.name+' → +25% крит + игнор 20% брони 4р','skill');
  updBars(); return true;
 }
 // 4 - Буря Стрел
 if(sk.name.includes('Буря')){
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25;
  stormTurns=3;
  stormLeft=12;
  addLog('🌪️ '+sk.name+' → 12 стрел за 3р по 80% + 25% стан','skill');
  updBars(); return true;
 }
 return false;
};

window.VOLAND_HERO_ON_TURN_END = function(ctx){
 let {cur, rand, addLog, updBars}=ctx;
 let eDef=window.VB.eDef;
 let effDef = Math.floor(eDef * (hawkEyeTurns>0 ? 0.8 : 1));
 let effDefHalf = Math.floor(effDef/2);
 if(bleedTurns>0){
  let d=Math.max(5, bleedDmg - Math.floor(effDef/5) + rand(-5,5));
  ctx.eHp=Math.max(0, ctx.eHp-d);
  addLog('🩸 Кровотечение '+d+' ['+bleedTurns+'р]','skill');
  updBars();
 }
 if(poisonTurns>0){
  let d=Math.max(10, poisonDmg - Math.floor(effDef/3) + rand(-6,6));
  ctx.eHp=Math.max(0, ctx.eHp-d);
  addLog('☠️ Яд '+d+' ['+poisonTurns+'р]','skill');
  updBars();
 }
 if(stormTurns>0 && stormLeft>0){
  let arrows = Math.ceil(stormLeft / stormTurns);
  if(arrows<1) arrows=1;
  if(arrows>stormLeft) arrows=stormLeft;
  let total=0;
  let doStun=false;
  for(let i=0;i<arrows;i++){
   let d=Math.max(5, Math.floor(cur.DMG*0.8) - effDefHalf + rand(-6,6));
   if(Math.random()*100 < (cur.CRIT + (hawkEyeTurns>0?25:0))) d=Math.floor(d*1.4);
   total+=d;
   if(Math.random()*100 < 25) doStun=true;
  }
  stormLeft-=arrows;
  ctx.eHp=Math.max(0, ctx.eHp-total);
  addLog('🌪️ Буря '+arrows+' стрел → '+total+' [80% x'+arrows+']'+(doStun?' + стан!':''),'skill');
  if(doStun){
   window.VB._setStun=1;
   addLog('🌪️ Шанс стана сработал!','crit');
  }
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
