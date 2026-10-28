// IRON VOW warrior-f - FINAL v2: bleed 50% true, Zov 200%+200% two hits
(function(){
let wolfShield=0;
let alphaTurns=0;
let alphaHPBonus=0;
let lastCur=null;

function extra(){
  let s=[];
  if(wolfShield>0) s.push('🛡️ВОЛК '+wolfShield+' 50%');
  if(alphaTurns>0) s.push('🌕АЛЬФА '+alphaTurns+' +30%');
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
   let low = isLowHP();
   let mult = 1.0;
   if(alphaTurns>0) mult *= 1.3;
   if(low) mult *= 1.5;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.5);
   let bleedExtra = 0;
   if(alphaTurns>0){
     let bMult = 0.5;
     if(low) bMult *= 1.5;
     bleedExtra = Math.max(5, Math.floor(cur.DMG*bMult) + rand(-5,5));
     if(isCrit) bleedExtra = Math.floor(bleedExtra*1.3);
   }
   let total = base + bleedExtra;
   ctx.eHp = Math.max(0, ctx.eHp - total);
   if(low){
     let heal = Math.floor(total*0.3);
     window.VB.hHp = Math.min(window.VB.hMax, window.VB.hHp + heal);
     if(bleedExtra>0){
       addLog('🗡️ Атака '+base+' +30% альфа + кров '+bleedExtra+' true = '+total+(isCrit?' CRIT':'')+' +50% стаи + хил '+heal,'hit');
     } else {
       addLog('🗡️ Атака '+base+(isCrit?' CRIT':'')+' +50% стаи + хил '+heal+' [HP<30%]','hit');
     }
   } else {
     if(bleedExtra>0){
       addLog('🗡️ Атака '+base+' + кров '+bleedExtra+' true = '+total+(isCrit?' CRIT':'')+' [100%+30%+50% true]','hit');
     } else {
       addLog('🗡️ Атака '+base+(isCrit?' CRIT':''),'hit');
     }
   }
   ctx.cooldowns[0]=1;
   updBars(); return true;
 }

 if(!sk) return false;
 if(ctx.hMana < sk.mana){ addLog('⛔ Не хватает маны!','lose'); return false; }

 if(sk.name.includes('Рассекающий')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
   let low = isLowHP();
   let m1 = 1.1, m2 = 1.1;
   if(alphaTurns>0){ m1*=1.3; m2*=1.3; }
   if(low){ m1*=1.5; m2*=1.5; }
   let base1 = Math.max(5, Math.floor(cur.DMG*m1) - eDef + rand(-8,8));
   let base2 = Math.max(5, Math.floor(cur.DMG*m2) - eDef + rand(-8,8));
   let isCrit1 = Math.random()*100 < cur.CRIT;
   let isCrit2 = Math.random()*100 < cur.CRIT;
   if(isCrit1) base1 = Math.floor(base1*1.4);
   if(isCrit2) base2 = Math.floor(base2*1.4);
   let bleedExtra = 0;
   if(alphaTurns>0){
     let bMult = 0.5;
     if(low) bMult *= 1.5;
     bleedExtra = Math.max(5, Math.floor(cur.DMG*bMult) + rand(-5,5));
     if(isCrit1||isCrit2) bleedExtra = Math.floor(bleedExtra*1.2);
   }
   let total = base1+base2+bleedExtra;
   ctx.eHp = Math.max(0, ctx.eHp - total);
   let heal = 0;
   if(low){
     heal = Math.floor(total*0.3);
     window.VB.hHp = Math.min(window.VB.hMax, window.VB.hHp + heal);
   }
   if(bleedExtra>0){
     addLog('🗡️ '+sk.name+' '+base1+' + '+base2+' + кров '+bleedExtra+' true = '+total+' [110%+110%+30%+50% true]'+(isCrit1||isCrit2?' CRIT':'')+(low?' +50% стаи + хил '+heal:''),'skill');
   } else {
     addLog('🗡️ '+sk.name+' '+base1+' + '+base2+' = '+total+' [110%+110%'+(low?' +50% стаи':'')+']'+(isCrit1||isCrit2?' CRIT':'')+(low?' + хил '+heal:''),'skill');
   }
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
   let low = isLowHP();
   let m = 2.0;
   if(alphaTurns>0) m*=1.3;
   if(low) m*=1.5;
   let base1 = Math.max(10, Math.floor(cur.DMG*m) - eDef + rand(-10,10));
   let base2 = Math.max(10, Math.floor(cur.DMG*m) - eDef + rand(-10,10));
   let isCrit1 = Math.random()*100 < cur.CRIT;
   let isCrit2 = Math.random()*100 < cur.CRIT;
   if(isCrit1) base1 = Math.floor(base1*1.4);
   if(isCrit2) base2 = Math.floor(base2*1.4);
   let bleedExtra = 0;
   if(alphaTurns>0){
     let bMult = 0.5;
     if(low) bMult *= 1.5;
     bleedExtra = Math.max(5, Math.floor(cur.DMG*bMult) + rand(-5,5));
   }
   let total = base1+base2+bleedExtra;
   ctx.eHp = Math.max(0, ctx.eHp - total);
   setEnemyStun(1);
   let heal = 0;
   if(low){
     heal = Math.floor(total*0.3);
     window.VB.hHp = Math.min(window.VB.hMax, window.VB.hHp + heal);
   }
   if(bleedExtra>0){
     addLog('🐾 '+sk.name+' стан 1р + '+base1+' + '+base2+' + кров '+bleedExtra+' true = '+total+' [200%×1.3 + 200%×1.3 + 50% true]'+(isCrit1||isCrit2?' CRIT':'')+(low?' +50% стаи + хил '+heal:''),'skill');
   } else {
     addLog('🐾 '+sk.name+' стан 1р + '+base1+' + '+base2+' = '+total+' [200% + 200% 2 раза]'+(isCrit1||isCrit2?' CRIT':'')+(low?' + хил '+heal:''),'skill');
   }
   updBars(); return true;
 }

 if(sk.name.includes('Альфа')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||20;
   if(alphaHPBonus==0){
     alphaHPBonus = Math.floor(window.VB.hMax*0.5);
     window.VB.hMax = window.VB.hMax + alphaHPBonus;
     window.VB.hHp = window.VB.hHp + alphaHPBonus;
     addLog('🌕 '+sk.name+' +50% HP +'+alphaHPBonus+' → HP '+window.VB.hHp+'/'+window.VB.hMax+' +30% урон 5р + кров 50% true от атак','skill');
   } else {
     addLog('🌕 '+sk.name+' уже активен '+alphaTurns+'р','skill');
   }
   alphaTurns = 5;
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
   }
 }
};

})();
