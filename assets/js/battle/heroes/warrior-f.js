// IRON VOW warrior-f - fix2: bleed 1 timer, no duplicate, ends with alpha, HP setter fixed
(function(){
let wolfShield=0;
let alphaTurns=0;
let bleedTurns=0;
let alphaHPBonus=0;
let lastCur=null;

function extra(){
  let s=[];
  if(wolfShield>0) s.push('🛡️ВОЛК '+wolfShield+' 50%');
  if(alphaTurns>0) s.push('🌕АЛЬФА '+alphaTurns+' +30%');
  if(bleedTurns>0) s.push('🩸КРОВ '+bleedTurns);
  return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extra; },100);

function isLowHP(){
  let hHp = window.VB ? window.VB.hHp : 0;
  let hMax = window.VB ? window.VB.hMax : 1;
  return hHp>0 && hHp/hMax < 0.3;
}

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 lastCur=cur;
 let sk = activeSkills[idx-1];

 // Q базовая 100%
 if(idx===0){
   let mult = 1.0;
   if(alphaTurns>0) mult *= 1.3;
   let low = isLowHP();
   if(low) mult *= 1.5;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.5);
   // bleed extra 100% во время альфы - мгновенно
   let bleedExtra = 0;
   if(alphaTurns>0){
     bleedExtra = Math.max(5, Math.floor(cur.DMG*1.0) + rand(-5,5));
     if(isCrit) bleedExtra = Math.floor(bleedExtra*1.4);
   }
   let total = base + bleedExtra;
   ctx.eHp = Math.max(0, ctx.eHp - total);
   if(low){
     let heal = Math.floor(total*0.3);
     ctx.hHp = Math.min(window.VB.hMax, ctx.hHp + heal);
     addLog('🗡️ Атака '+base+(bleedExtra?' + кров '+bleedExtra:'')+' = '+total+(isCrit?' CRIT':'')+(alphaTurns>0?' +30% альфа':'')+' +50% стаи + хил '+heal,'hit');
   } else {
     addLog('🗡️ Атака '+base+(bleedExtra?' + кров '+bleedExtra+' = '+total:'')+(isCrit?' CRIT':'')+(alphaTurns>0?' +30% альфа':''),'hit');
   }
   ctx.cooldowns[0]=1;
   updBars(); return true;
 }

 if(!sk) return false;
 if(ctx.hMana < sk.mana){ addLog('⛔ Не хватает маны!','lose'); return false; }

 if(sk.name.includes('Рассекающий')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
   let mult1 = 1.1, mult2 = 1.1;
   if(alphaTurns>0){ mult1*=1.3; mult2*=1.3; }
   let low = isLowHP();
   if(low){ mult1*=1.5; mult2*=1.5; }
   let base1 = Math.max(5, Math.floor(cur.DMG*mult1) - eDef + rand(-8,8));
   let base2 = Math.max(5, Math.floor(cur.DMG*mult2) - eDef + rand(-8,8));
   let isCrit1 = Math.random()*100 < cur.CRIT;
   let isCrit2 = Math.random()*100 < cur.CRIT;
   if(isCrit1) base1 = Math.floor(base1*1.4);
   if(isCrit2) base2 = Math.floor(base2*1.4);
   let bleedExtra = 0;
   if(alphaTurns>0){
     bleedExtra = Math.max(5, Math.floor(cur.DMG*1.0) + rand(-5,5));
   }
   let total = base1+base2+bleedExtra;
   ctx.eHp = Math.max(0, ctx.eHp - total);
   let heal = 0;
   if(low){
     heal = Math.floor(total*0.3);
     ctx.hHp = Math.min(window.VB.hMax, ctx.hHp + heal);
   }
   addLog('🗡️ '+sk.name+' '+base1+' + '+base2+(bleedExtra?' + кров '+bleedExtra:'')+' = '+total+' [110%+110%'+(alphaTurns>0?' +30% +кров':'')+(low?' +50% стаи':'')+']'+(isCrit1||isCrit2?' CRIT':'')+(low?' + хил '+heal:''),'skill');
   updBars(); return true;
 }

 if(sk.name.includes('Щит')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||15;
   wolfShield = 5;
   addLog('🛡️ '+sk.name+' щит 4р блок 50% + контра 350%','skill');
   updBars(); return true;
 }

 if(sk.name.includes('Зов')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||15;
   let totalMult = 4.0;
   if(alphaTurns>0) totalMult*=1.3;
   let low = isLowHP();
   if(low) totalMult*=1.5;
   let base = Math.max(10, Math.floor(cur.DMG*totalMult) - eDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.4);
   let bleedExtra = 0;
   if(alphaTurns>0){
     bleedExtra = Math.max(5, Math.floor(cur.DMG*1.0) + rand(-5,5));
   }
   let total = base + bleedExtra;
   ctx.eHp = Math.max(0, ctx.eHp - total);
   setEnemyStun(1);
   let heal = 0;
   if(low){
     heal = Math.floor(total*0.3);
     ctx.hHp = Math.min(window.VB.hMax, ctx.hHp + heal);
   }
   addLog('🐾 '+sk.name+' стан 1р + '+base+(bleedExtra?' + кров '+bleedExtra+' = '+total:'')+' ['+Math.round(totalMult*100)+'% 200%x2]'+(isCrit?' CRIT':'')+(low?' +50% стаи + хил '+heal:''),'skill');
   updBars(); return true;
 }

 if(sk.name.includes('Альфа')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||20;
   if(alphaHPBonus==0){
     alphaHPBonus = Math.floor(window.VB.hMax*0.5);
     window.VB.hMax = window.VB.hMax + alphaHPBonus;
     window.VB.hHp = window.VB.hHp + alphaHPBonus;
     addLog('🌕 '+sk.name+' +50% HP +'+alphaHPBonus+' → HP '+window.VB.hHp+'/'+window.VB.hMax+' +30% урон 5р + кров 100%','skill');
   } else {
     addLog('🌕 '+sk.name+' уже активен '+alphaTurns+'р','skill');
   }
   alphaTurns = 6;
   bleedTurns = 6; // кров 5р вместе с альфой
   updBars(); return true;
 }

 return false;
};

window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 if(wolfShield>0 && Math.random()<0.5){
   let base = Math.max(10, Math.floor(ctx.cur.DMG*3.5) - (window.VB ? window.VB.eDef : 10) + (Math.floor(Math.random()*21)-10));
   if(Math.random()*100 < ctx.cur.CRIT) base = Math.floor(base*1.4);
   window.VB.eHp = Math.max(0, window.VB.eHp - base);
   window.VB.addLog('🐺 Щит Вожака блок! Контра '+base+' [350%]','skill');
   window.VB.updBars();
   return true;
 }
 return false;
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 if(wolfShield>0){
   wolfShield--;
   if(wolfShield==0 && window.VB) window.VB.addLog('🛡️ Щит Вожака кончился','hit');
 }
 if(alphaTurns>0){
   alphaTurns--;
   if(alphaTurns==0){
     if(window.VB) window.VB.addLog('🌕 Альфа кончилась','hit');
     if(alphaHPBonus>0 && window.VB){
       window.VB.hMax = Math.max(100, window.VB.hMax - alphaHPBonus);
       window.VB.hHp = Math.min(window.VB.hHp, window.VB.hMax);
       window.VB.addLog('🌕 -'+alphaHPBonus+' HP (конец альфы) → '+window.VB.hHp+'/'+window.VB.hMax,'hit');
       alphaHPBonus=0;
       window.VB.updBars();
     }
     // кровь кончается вместе с альфой
     if(bleedTurns>0){
       bleedTurns=0;
       if(window.VB) window.VB.addLog('🩸 Кровотечение кончилось (альфа кончилась)','hit');
     }
   }
 }
 if(bleedTurns>0 && alphaTurns>0){
   let cur = lastCur || (window.VB && window.VB.cur);
   if(cur){
     let base = Math.max(5, Math.floor(cur.DMG*1.0) + (Math.floor(Math.random()*11)-5));
     if(Math.random()*100 < cur.CRIT) base = Math.floor(base*1.4);
     window.VB.eHp = Math.max(0, window.VB.eHp - base);
     window.VB.addLog('🩸 Кровотечение ['+100+'%] '+base+' ['+bleedTurns+'р]','skill');
     window.VB.updBars();
   }
   bleedTurns--;
   if(bleedTurns==0 && window.VB && alphaTurns>0) window.VB.addLog('🩸 Кровотечение кончилось','hit');
 }
};

})();
