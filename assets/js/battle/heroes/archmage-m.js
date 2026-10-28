// AZURE SAGE archmage-m - fix2: sphere 1 hit per round, no double victory
(function(){
let stacks=0, stacksTimer=0;
let defDebuffTurns=0;
let sphereTurns=0, sphereMult=1.6;
let annihilationTimer=0, annihilationMult=3.5;
let lastCur=null;

function extra(){
  let s=[];
  if(stacks>0) s.push('⏳СТАКИ '+stacks+' +'+(stacks*10)+'%'+(stacksTimer>0?' '+stacksTimer+'р':''));
  if(defDebuffTurns>0) s.push('❄️DEF-20% '+defDebuffTurns);
  if(sphereTurns>0) s.push('⚡СФЕРА '+sphereTurns);
  if(annihilationTimer>0) s.push('🌌ВЗРЫВ '+annihilationTimer);
  return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extra; },100);

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 if(idx===0) return false;
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 lastCur=cur;
 let sk=activeSkills[idx-1];
 if(!sk) return false;
 if(ctx.hMana < sk.mana){ addLog('⛔ Не хватает маны!','lose'); return false; }

 let effDef = defDebuffTurns>0 ? Math.floor(eDef*0.8) : eDef;
 let baseMult = sk.dmgPct ? sk.dmgPct/100 : 2.5;
 let mult = baseMult;
 let isEmpowered = stacks>=5;
 let bonusFromStacks = 0;

 if(isEmpowered){
   mult *= 1.5;
   bonusFromStacks = 50;
   addLog('⏳ 5 стаков! След заклинание +50% урона','skill');
 } else if(stacks>0){
   mult *= (1 + stacks*0.1);
   bonusFromStacks = stacks*10;
 }

 // Ледяное Копье 250% + DEF -20%
 if(sk.name.includes('Копье') || sk.name.includes('Кольцо') || sk.name.toLowerCase().includes('копье')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - effDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.4);
   ctx.eHp = Math.max(0, ctx.eHp - base);
   defDebuffTurns = 4;
   addLog('❄️ '+sk.name+' ['+Math.round(mult*100)+'%'+(bonusFromStacks?' +'+bonusFromStacks+'% стаки':'')+'] '+base+(isCrit?' CRIT':'')+' DEF-20% 3р стаки '+ (isEmpowered?1:Math.min(5,stacks+1)),'skill');
   if(isEmpowered){ stacks=1; } else { stacks=Math.min(5, stacks+1); }
   stacksTimer=5;
   updBars(); return true;
 }

 // Сфера Бури 160% - 3 раунда по 1 удару в раунд (без мгновенного урона)
 if(sk.name.includes('Сфер')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||10;
   sphereTurns = 3; // 3 тика, по 1 в конце каждого раунда
   addLog('⚡ '+sk.name+' создана! 3 раунда по ['+Math.round(mult*100)+'%'+(bonusFromStacks?' +'+bonusFromStacks+'%':'')+'] + сфера 3р стаки '+(isEmpowered?1:Math.min(5,stacks+1)),'skill');
   if(isEmpowered){ stacks=1; } else { stacks=Math.min(5, stacks+1); }
   stacksTimer=5;
   updBars(); return true;
 }

 // Лавина 300%
 if(sk.name.includes('Лавина')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||15;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - effDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.4);
   ctx.eHp = Math.max(0, ctx.eHp - base);
   addLog('🏔️ '+sk.name+' ['+Math.round(mult*100)+'%'+(bonusFromStacks?' +'+bonusFromStacks+'%':'')+'] '+base+(isCrit?' CRIT':'')+' стаки '+(isEmpowered?1:Math.min(5,stacks+1)),'skill');
   if(isEmpowered){ stacks=1; } else { stacks=Math.min(5, stacks+1); }
   stacksTimer=5;
   updBars(); return true;
 }

 // Аннигиляция Времени 350% с задержкой 3р стан 3р
 if(sk.name.includes('Аннигиляция') || sk.name.includes('Времени')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25;
   setEnemyStun(2);
   annihilationTimer = 3;
   annihilationMult = baseMult;
   addLog('🌌 '+sk.name+' → время заморожено 2р! Взрыв '+Math.round(baseMult*100)+'% через 3р'+(bonusFromStacks?' (+'+bonusFromStacks+'% стаки)':'')+' стаки '+(isEmpowered?1:Math.min(5,stacks+1)),'skill');
   if(isEmpowered){ stacks=1; } else { stacks=Math.min(5, stacks+1); }
   stacksTimer=5;
   updBars(); return true;
 }

 return false;
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 let cur = lastCur || (window.VB && window.VB.cur);
 if(!cur) return;

 if(stacksTimer>0){
   stacksTimer--;
   if(stacksTimer==0 && stacks>0){
     stacks=0;
     if(window.VB) window.VB.addLog('⏳ Стаки кончились','hit');
   }
 }

 if(defDebuffTurns>0){
   defDebuffTurns--;
   if(defDebuffTurns==0 && window.VB) window.VB.addLog('❄️ DEF дебаф кончился','hit');
 }

 // Сфера - 1 тик в конце раунда
 if(sphereTurns>0){
   let eDef = window.VB ? window.VB.eDef : 200;
   let effDef = defDebuffTurns>0 ? Math.floor(eDef*0.8) : eDef;
   let mult = sphereMult;
   if(stacks>0) mult *= (1 + stacks*0.1);
   // если 5 стаков, взрыв сферы тоже +50%?
   if(stacks>=5) mult *= 1.5;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - effDef + (Math.floor(Math.random()*21)-10));
   if(Math.random()*100 < cur.CRIT) base = Math.floor(base*1.4);
   window.VB.eHp = Math.max(0, window.VB.eHp - base);
   window.VB.addLog('⚡ Сфера Бури тик ['+Math.round(mult*100)+'%] '+base+' ['+sphereTurns+'р]','skill');
   window.VB.updBars();
   sphereTurns--;
   if(sphereTurns==0 && window.VB) window.VB.addLog('⚡ Сфера кончилась','hit');
 }

 // Аннигиляция взрыв
 if(annihilationTimer>0){
   annihilationTimer--;
   if(annihilationTimer==0){
     let eDef = window.VB ? window.VB.eDef : 200;
     let effDef = defDebuffTurns>0 ? Math.floor(eDef*0.8) : eDef;
     let mult = annihilationMult;
     if(stacks>0) mult *= (1 + stacks*0.1);
     if(stacks>=5){ mult *= 1.5; window.VB.addLog('⏳ 5 стаков! Взрыв +50%','skill'); }
     let base = Math.max(10, Math.floor(cur.DMG*mult) - effDef + (Math.floor(Math.random()*21)-10));
     if(Math.random()*100 < cur.CRIT) base = Math.floor(base*1.4);
     window.VB.eHp = Math.max(0, window.VB.eHp - base);
     window.VB.addLog('🌌 Аннигиляция ВРЕМЕНИ ВЗРЫВ ['+Math.round(mult*100)+'%] '+base,'skill');
     window.VB.updBars();
     // победу теперь делает engine.js, тут не логим ПОБЕДА!
   } else {
     if(window.VB) window.VB.addLog('🌌 Аннигиляция тик... взрыв через '+annihilationTimer+'р','skill');
   }
 }
};

})();
