// VOLAND HERO AMETHYST (necro-f-new) - правки предшественника + база
(function(){
let fearTurns=0, prisonTurns=0, prisonMult=3.0, linkTurns=0, spiritTurns=0, spellCounter=0;
function extraStat(){
 let s=[];
 if(fearTurns>0) s.push('💜СТРАХ '+fearTurns+'(-15% DMG врага)');
 if(prisonTurns>0) s.push('👻ТЮРЬМА '+prisonTurns+' x'+prisonMult);
 if(spiritTurns>0) s.push('🔮ДУХ '+spiritTurns+' (100%+5 маны)');
 if(linkTurns>0) s.push('💀ЛИНК '+linkTurns+' (30% отраж+хил)');
 return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extraStat; },100);

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 if(idx===0) return false;
 let sk=activeSkills[idx-1];
 if(!sk) return false;

 if(sk.name.includes('Проклятие Душ')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
   let base=Math.floor(cur.DMG*2.0); base=Math.max(15, base - eDef + rand(-10,10));
   if(Math.random()*100<cur.CRIT) base=Math.floor(base*1.4);
   ctx.eHp=Math.max(0, ctx.eHp-base);
   fearTurns=4; // -15% урона врага 4 хода (из правок)
   ctx.hMana=Math.min(ctx.hMaxMana, ctx.hMana+5);
   spellCounter++;
   addLog('💜 '+sk.name+' [200%] → '+base+' + СТРАХ -15% 4х +5 маны','skill'); 
   if(spellCounter%3===0){ spiritTurns=3; addLog('🔮 Шепот Аметиста: дух 3 раунда 100% урона +5 маны/раунд','crit'); }
   updBars(); return true;
 }
 if(sk.name.includes('Тюрьма')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||10;
   setEnemyStun(1); prisonTurns=1; prisonMult=3.0;
   spellCounter++;
   addLog('👻 '+sk.name+' → клетка 1р + стан + взрыв 300% в конце раунда','skill'); 
   if(spellCounter%3===0){ spiritTurns=3; addLog('🔮 Шепот Аметиста: дух 3 раунда','crit'); }
   updBars(); return true;
 }
 if(sk.name.includes('Похищение')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||18;
   linkTurns=4; // линк 4 раунда — 30% отраж + 30% хил
   spellCounter++;
   addLog('💀 '+sk.name+' → ЛИНК 4р — 30% отраж + 30% хил','skill'); 
   if(spellCounter%3===0){ spiritTurns=3; addLog('🔮 Шепот Аметиста: дух 3 раунда','crit'); }
   updBars(); return true;
 }
 if(sk.name.includes('Закат')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25;
   setEnemyStun(1);
   let total=0;
   for(let i=0;i<5;i++){ let b=Math.floor(cur.DMG*2.0); b=Math.max(15, b - eDef + rand(-10,10)); if(Math.random()*100<cur.CRIT) b=Math.floor(b*1.4); total+=b; addLog('🌌 Душа '+(i+1)+' → '+b,'skill'); await new Promise(r=>setTimeout(r,80)); }
   ctx.eHp=Math.max(0, ctx.eHp-total); 
   addLog('🌌 Закат всего '+total+' [до 1000%] + стан','skill'); 
   spellCounter++;
   if(spellCounter%3===0){ spiritTurns=3; addLog('🔮 Шепот Аметиста: дух 3 раунда','crit'); }
   updBars(); return true;
 }
 return false;
};

window.VOLAND_HERO_ON_TURN_END = function(ctx){
 let {cur, rand, addLog, updBars}=ctx;
 if(prisonTurns>0){ let base=Math.floor(cur.DMG*prisonMult); base=Math.max(15, base - window.VB.eDef + rand(-10,10)); if(Math.random()*100<cur.CRIT) base=Math.floor(base*1.4); ctx.eHp=Math.max(0, ctx.eHp-base); addLog('💥 Тюрьма взрывается! '+base+' [300%]','skill'); prisonTurns=0; updBars(); }
 if(spiritTurns>0){ let spDmg=Math.max(10, cur.DMG - window.VB.eDef + rand(-8,8)); ctx.eHp=Math.max(0, ctx.eHp-spDmg); window.VB.hMana=Math.min(window.VB.hMana+5, cur.MANA); addLog('🔮 Дух '+spDmg+' +5 маны ['+spiritTurns+']','skill'); updBars(); }
};

// хук перед атакой врага — тут применяем -15% и линк
window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 let {cur, addLog, updBars}=ctx;
 let modified=false;
 // страх -15% DMG врага
 if(fearTurns>0){
  let orig=window.VB.eDmg;
  let reduced=Math.floor(orig*0.85);
  // временно меняем eDmg для расчета в engine? engine берет window.VB.eDmg? Он берет локальный eDmg, но мы перехватим через VB.eDmg если engine использует
  // для лога покажем
  addLog('💜 Страх: урон врага -15% ('+orig+'→'+reduced+') ['+fearTurns+']','hit');
  // сохраним редукцию в VB для engine? engine использует локальный eDmg, но мы можем патчить через ctx модификацию — сделаем через window.VB.eDmg и пусть engine берет его если есть fear
  window.VB.eDmg = reduced;
  modified=true;
 }
 // линк обрабатывается после атаки врага в engine? мы сделаем в ON_ROUND? лучше обработать в ON_ENEMY_TURN после того как engine посчитает? Пока оставим логику отражения в ON_TURN_END? Нет, нужно после урона.
 // Чтобы отразить, мы подпишемся на изменение hHp: в engine после атаки hHp уже уменьшен, мы можем отразить часть
 // Для простоты — если линк активен, отражаем 30% от текущего eDmg
 if(linkTurns>0){
  // отражение произойдет в engine после атаки — мы тут только подсказку
  // реальный отраж+хил сделаем в ON_ROUND_START? сделаем в этом хуке после атаки врага — engine вызывает хук ДО атаки, поэтому отражение сделаем в ON_ROUND_END через сохранение последнего урона
  window.VB._linkActive = true;
 }
 return false; // не скипаем ход врага
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 // восстанавливаем eDmg после страха
 if(fearTurns>0){ fearTurns--; if(fearTurns==0){ window.VB.addLog('💜 Страх кончился','hit'); window.VB.eDmg = window.VB.baseEDmg; } }
 if(spiritTurns>0){ spiritTurns--; if(spiritTurns==0) window.VB.addLog('🔮 Дух исчез','hit'); }
 if(linkTurns>0){ 
  // если был урон врага, отражаем
  if(window.VB._lastEnemyDmg && window.VB._linkActive){
   let refl=Math.floor(window.VB._lastEnemyDmg*0.3);
   let heal=Math.floor(window.VB._lastEnemyDmg*0.3);
   window.VB.eHp=Math.max(0, window.VB.eHp-refl);
   window.VB.hHp=Math.min(window.VB.hMax||9999, window.VB.hHp+heal);
   window.VB.addLog('💀 Линк: отраж '+refl+' + хил '+heal,'skill');
   window.VB.updBars();
  }
  window.VB._linkActive=false;
  linkTurns--; if(linkTurns==0) window.VB.addLog('💀 Линк кончился','hit'); 
 }
};
})();
