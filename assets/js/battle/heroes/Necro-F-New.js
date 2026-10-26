// VOLAND HERO AMETHYST (necro-f-new)
(function(){
let fearTurns=0, prisonTurns=0, prisonMult=3.0, linkTurns=0, spiritTurns=0;
function extraStat(){
 let s=[];
 if(fearTurns>0) s.push('💜СТРАХ '+fearTurns+'(-15%)');
 if(prisonTurns>0) s.push('👻ТЮРЬМА '+prisonTurns);
 if(spiritTurns>0) s.push('🔮ДУХ '+spiritTurns);
 if(linkTurns>0) s.push('💀ЛИНК '+linkTurns);
 return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extraStat; },100);
window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 if(idx===0) return false;
 let sk=activeSkills[idx-1];
 if(sk.name.includes('Проклятие Душ')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
   let base=Math.floor(cur.DMG*2.0); base=Math.max(15, base - eDef + rand(-10,10));
   if(Math.random()*100<cur.CRIT) base=Math.floor(base*1.4);
   ctx.eHp=Math.max(0, ctx.eHp-base);
   fearTurns=4; ctx.hMana=Math.min(ctx.hMaxMana, ctx.hMana+5);
   addLog('💜 '+sk.name+' [200%] → '+base+' + СТРАХ -15% 4х +5 маны','skill'); updBars(); return true;
 }
 if(sk.name.includes('Тюрьма')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||10;
   setEnemyStun(1); prisonTurns=1; prisonMult=3.0;
   addLog('👻 '+sk.name+' → клетка 1р, стан','skill'); updBars(); return true;
 }
 if(sk.name.includes('Похищение')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||18;
   linkTurns=4; addLog('💀 '+sk.name+' → ЛИНК 4р 30% отраж+хил','skill'); updBars(); return true;
 }
 if(sk.name.includes('Закат')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25;
   let total=0;
   for(let i=0;i<5;i++){ let b=Math.floor(cur.DMG*2.0); b=Math.max(15, b - eDef + rand(-10,10)); if(Math.random()*100<cur.CRIT) b=Math.floor(b*1.4); total+=b; addLog('🌌 Душа '+(i+1)+' → '+b,'skill'); await new Promise(r=>setTimeout(r,100)); }
   ctx.eHp=Math.max(0, ctx.eHp-total); addLog('🌌 Закат всего '+total+' [до 1000%]','skill'); updBars(); return true;
 }
 return false;
};
window.VOLAND_HERO_ON_TURN_END = function(ctx){
 let {cur, rand, addLog, updBars}=ctx;
 if(prisonTurns>0){ let base=Math.floor(cur.DMG*prisonMult); base=Math.max(15, base - window.VB.eDef + rand(-10,10)); if(Math.random()*100<cur.CRIT) base=Math.floor(base*1.4); ctx.eHp=Math.max(0, ctx.eHp-base); addLog('💥 Тюрьма взрывается! '+base,'skill'); prisonTurns=0; updBars(); }
 if(spiritTurns>0){ let spDmg=Math.max(10, cur.DMG - window.VB.eDef + rand(-8,8)); ctx.eHp=Math.max(0, ctx.eHp-spDmg); window.VB.hMana=Math.min(window.VB.hMana+5, cur.MANA); addLog('🔮 Дух '+spDmg+' +5 маны ['+spiritTurns+']','skill'); updBars(); }
};
window.VOLAND_HERO_ON_ROUND_END = function(){
 if(fearTurns>0){ fearTurns--; if(fearTurns==0) window.VB.addLog('💜 Страх кончился','hit'); }
 if(prisonTurns>0) prisonTurns--;
 if(spiritTurns>0){ spiritTurns--; if(spiritTurns==0) window.VB.addLog('🔮 Дух исчез','hit'); }
 if(linkTurns>0){ linkTurns--; if(linkTurns==0) window.VB.addLog('💀 Линк кончился','hit'); }
};
})();
