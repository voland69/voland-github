// AZURE SAGE archmage-m - fix2: sphere 1 hit per round, no double victory
(function(){
const T=(ru,en)=> (typeof volandT==='function' ? volandT(ru,en) : ru);
const SN=(n)=> (typeof volandSkillName==='function' ? volandSkillName(n) : n);
const EN=(e)=> (typeof volandEnemyName==='function' ? volandEnemyName(e) : (e&&e.name||''));
let stacks=0, stacksTimer=0;
let defDebuffTurns=0;
let sphereTurns=0, sphereMult=1.6;
let annihilationTimer=0, annihilationMult=3.5;
let lastCur=null;

function extra(){
  let s=[];
  if(stacks>0) s.push('⏳'+T('СТАКИ ','STACKS ')+stacks+' +'+(stacks*10)+'%'+(stacksTimer>0?' '+stacksTimer+T('р','r'):''));
  if(defDebuffTurns>0) s.push('❄️DEF-20% '+defDebuffTurns);
  if(sphereTurns>0) s.push('⚡'+T('СФЕРА ','SPHERE ')+sphereTurns);
  if(annihilationTimer>0) s.push('🌌'+T('ВЗРЫВ ','BLAST ')+annihilationTimer);
  return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extra; },100);

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 if(idx===0) return false;
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 lastCur=cur;
 let sk=activeSkills[idx-1];
 if(!sk) return false;
 if(ctx.hMana < sk.mana){ addLog('⛔ '+T('Не хватает маны!','Not enough mana!'),'lose'); return false; }

 let effDef = defDebuffTurns>0 ? Math.floor(eDef*0.8) : eDef;
 let baseMult = sk.dmgPct ? sk.dmgPct/100 : 2.5;
 let mult = baseMult;
 let isEmpowered = stacks>=5;
 let bonusFromStacks = 0;

 if(isEmpowered){
   mult *= 1.5;
   bonusFromStacks = 50;
   addLog('⏳ 5 '+T('стаков!','stacks!')+' '+T('След заклинание ','Next spell ')+'+50% '+T('урона','damage'),'skill');
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
   addLog('❄️ '+SN(sk.name)+' ['+Math.round(mult*100)+'%'+(bonusFromStacks?' +'+bonusFromStacks+'% '+T('стаки','stacks'):'')+'] '+base+(isCrit?' CRIT':'')+' DEF-20% 3'+T('р','r')+' '+T('стаки','stacks')+' '+ (isEmpowered?1:Math.min(5,stacks+1)),'skill');
   if(isEmpowered){ stacks=1; } else { stacks=Math.min(5, stacks+1); }
   stacksTimer=5;
   updBars(); return true;
 }

 // Сфера Бури 160% - 3 раунда по 1 удару в раунд (без мгновенного урона)
 if(sk.name.includes('Сфер')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||10;
   sphereTurns = 3; // 3 тика, по 1 в конце каждого раунда
   addLog('⚡ '+SN(sk.name)+' '+T('создана!','created!')+' 3 '+T('раунда по ','rounds for [')+Math.round(mult*100)+'%'+(bonusFromStacks?' +'+bonusFromStacks+'%':'')+'] + '+T('сфера ','sphere ')+'3'+T('р','r')+' '+T('стаки','stacks')+' '+(isEmpowered?1:Math.min(5,stacks+1)),'skill');
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
   addLog('🏔️ '+SN(sk.name)+' ['+Math.round(mult*100)+'%'+(bonusFromStacks?' +'+bonusFromStacks+'%':'')+'] '+base+(isCrit?' CRIT':'')+' '+T('стаки','stacks')+' '+(isEmpowered?1:Math.min(5,stacks+1)),'skill');
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
   addLog('🌌 '+SN(sk.name)+' → '+T('время заморожено ','time frozen ')+'2'+T('р','r')+'! '+T('Взрыв ','Blast ')+Math.round(baseMult*100)+'% '+T('через ','in ')+'3'+T('р','r')+(bonusFromStacks?' (+'+bonusFromStacks+'% '+T('стаки','stacks')+')':'')+' '+T('стаки','stacks')+' '+(isEmpowered?1:Math.min(5,stacks+1)),'skill');
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
     if(window.VB) window.VB.addLog('⏳ '+T('Стаки ','Stacks ')+T('кончились','ended'),'hit');
   }
 }

 if(defDebuffTurns>0){
   defDebuffTurns--;
   if(defDebuffTurns==0 && window.VB) window.VB.addLog('❄️ DEF '+T('дебаф ','debuff ')+T('кончился','ended'),'hit');
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
   window.VB.addLog('⚡ '+SN('Сфера Бури')+' '+T('тик ','tick [')+Math.round(mult*100)+'%] '+base+' ['+sphereTurns+T('р','r')+']','skill');
   window.VB.updBars();
   sphereTurns--;
   if(sphereTurns==0 && window.VB) window.VB.addLog('⚡ '+T('Сфера ','Sphere ')+T('кончилась','ended'),'hit');
 }

 // Аннигиляция взрыв
 if(annihilationTimer>0){
   annihilationTimer--;
   if(annihilationTimer==0){
     let eDef = window.VB ? window.VB.eDef : 200;
     let effDef = defDebuffTurns>0 ? Math.floor(eDef*0.8) : eDef;
     let mult = annihilationMult;
     if(stacks>0) mult *= (1 + stacks*0.1);
     if(stacks>=5){ mult *= 1.5; window.VB.addLog('⏳ 5 '+T('стаков!','stacks!')+' '+T('Взрыв ','Blast ')+'+50%','skill'); }
     let base = Math.max(10, Math.floor(cur.DMG*mult) - effDef + (Math.floor(Math.random()*21)-10));
     if(Math.random()*100 < cur.CRIT) base = Math.floor(base*1.4);
     window.VB.eHp = Math.max(0, window.VB.eHp - base);
     window.VB.addLog('🌌 '+SN('Аннигиляция Времени')+' '+T('ВЗРЫВ ','BLAST [')+Math.round(mult*100)+'%] '+base,'skill');
     window.VB.updBars();
     // победу теперь делает engine.js, тут не логим ПОБЕДА!
   } else {
     if(window.VB) window.VB.addLog('🌌 '+SN('Аннигиляция Времени')+' '+T('тик... ','tick... ')+T('взрыв через ','blast in ')+annihilationTimer+T('р','r'),'skill');
   }
 }
};

})();
