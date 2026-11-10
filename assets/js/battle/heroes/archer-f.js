// WILD PATH archer-f - обновленные скилы: W 200% x2 + бличка 25% true 2р, E 200% + яд 25% true 3р, T 150%
(function(){
const T=(ru,en)=> (typeof volandT==='function' ? volandT(ru,en) : ru);
const SN=(n)=> (typeof volandSkillName==='function' ? volandSkillName(n) : n);
const EN=(e)=> (typeof volandEnemyName==='function' ? volandEnemyName(e) : (e&&e.name||''));
let bleedTurns=0, bleedDmg=0, poisonTurns=0, poisonDmg=0, hawkEyeTurns=0, stormTurns=0, stormLeft=0, nextCrit=false;

function extraStat(){
 let s=[];
 if(bleedTurns>0) s.push('🩸'+T('БЛИЧКА ','BLEED ')+bleedTurns+' true');
 if(poisonTurns>0) s.push('☠️'+T('ЯД ','POISON ')+poisonTurns+' true');
 if(hawkEyeTurns>0) s.push('🦅'+T('ГЛАЗ ','EYE ')+hawkEyeTurns);
 if(stormTurns>0) s.push('🌪️'+T('БУРЯ ','STORM ')+stormTurns+' ('+stormLeft+')');
 if(nextCrit) s.push('🐾'+T('КРИТ-след','CRIT-next'));
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
  addLog('⚔️ '+T('Ты бьешь ','You hit ')+EN(ctx.enemyData)+' ['+T('АТАКА','ATTACK')+'] '+T('на ','for ')+base+(isCrit?' CRIT!':''),'hit');
  if(nextCrit){ nextCrit=false; addLog('🐾 '+SN('Тропы Зверя')+': '+T('крит использован','crit used'),'skill'); }
  updBars(); return true;
 }

 let sk=activeSkills[idx-1];
 if(!sk) return false;
 if(ctx.hMana < sk.mana){ addLog('⛔ '+T('Не хватает маны! Нужно ','Not enough mana! Need ')+sk.mana,'lose'); return false; }

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
   addLog('🎯 '+T('Стрела ','Arrow ')+(i+1)+' → '+d+(isCrit?' CRIT!':''),'skill');
   await new Promise(r=>setTimeout(r,60));
  }
  ctx.eHp=Math.max(0, ctx.eHp-total);
  addLog('🎯 '+sk.name+' [200% x2] → '+total+' [400%]','skill');
  bleedTurns=2;
  bleedDmg=Math.floor(cur.DMG*0.25);
  addLog('🩸 '+T('Кровотечение ','Bleeding ')+'25% true ('+bleedDmg+') '+T('на ','for ')+'2'+T('р','r')+' '+T('игнор DEF','ignore DEF'),'skill');
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
  addLog('🌿 '+SN(sk.name)+' '+base+' [200%] + '+T('стан ','stun ')+'1'+T('р','r')+' + '+T('яд ','poison ')+'25% true ('+poisonDmg+') 3'+T('р','r'),'skill');
  if(nextCrit) nextCrit=false;
  updBars(); return true;
 }

 // R - Глаз Ястреба
 if(sk.name.includes('Глаз')){
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||20;
  hawkEyeTurns=4;
  addLog('🦅 '+SN(sk.name)+' → +25% '+T('крит','crit')+' + '+T('игнор','ignore')+' 20% '+T('брони','armor')+' 4'+T('р','r'),'skill');
  updBars(); return true;
 }

 // T - Буря Стрел 9 стрел за 3р по 150% + 25% стан
 if(sk.name.includes('Буря')){
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25;
  stormTurns=3;
  stormLeft=9;
  addLog('🌪️ '+SN(sk.name)+' → 9 '+T('стрел','arrows')+' '+T('за ','for ')+'3'+T('р','r')+' '+T('по ','for ')+'150% + 25% '+T('стан','stun'),'skill');
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
  addLog('🩸 '+T('Кровотечение ','Bleeding ')+d+' true ['+bleedTurns+T('р','r')+']','skill');
  updBars();
 }
 if(poisonTurns>0){
  let d = poisonDmg;
  ctx.eHp=Math.max(0, ctx.eHp-d);
  addLog('☠️ '+T('Яд ','Poison ')+d+' true ['+poisonTurns+T('р','r')+']','skill');
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
  addLog('🌪️ '+T('Буря ','Storm ')+arrows+' '+T('стрел','arrows')+' → '+total+' [150% x'+arrows+']'+(doStun?' + '+T('стан!','stun!'):''),'skill');
  if(doStun) window.VB._setStun=1;
  updBars();
 }
};

window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 if(Math.random()*100 < ctx.cur.DODGE){
  ctx.addLog('🐾 '+SN('Тропы Зверя')+': '+T('уклонение!','dodge!')+' '+T('След удар ','Next hit ')+'100% '+T('крит','crit'),'skill');
  nextCrit=true;
  ctx.updBars();
  return true;
 }
 return false;
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 if(bleedTurns>0){ bleedTurns--; if(bleedTurns==0) window.VB.addLog('🩸 '+T('Кровотечение ','Bleeding ')+T('кончилось','ended'),'hit'); }
 if(poisonTurns>0){ poisonTurns--; if(poisonTurns==0) window.VB.addLog('☠️ '+T('Яд ','Poison ')+T('кончился','ended'),'hit'); }
 if(hawkEyeTurns>0){ hawkEyeTurns--; if(hawkEyeTurns==0) window.VB.addLog('🦅 '+SN('Глаз Ястреба')+' '+T('кончился','ended'),'hit'); }
 if(stormTurns>0){
  stormTurns--;
  if(stormTurns==0){
   window.VB.addLog('🌪️ '+SN('Буря Стрел')+' '+T('закончилась','ended'),'hit');
   stormLeft=0;
  }
 }
};

})();
