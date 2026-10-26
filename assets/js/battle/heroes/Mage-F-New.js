// VOLCANIC mage-f-new - огонь, лава, метеоры
(function(){
let lavaTurns=0;
function extra(){ return lavaTurns>0?'🔥ЛАВА '+lavaTurns:''; }
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extra; },100);
window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 if(idx===0) return false;
 let {cur, eDef, activeSkills, rand, addLog, updBars}=ctx;
 let sk=activeSkills[idx-1];
 if(ctx.hMana<sk.mana) return false;
 ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||4;
 let mult= sk.dmgPct?sk.dmgPct/100:1.5;
 let base=Math.floor(cur.DMG*mult); base=Math.max(10, base - eDef + rand(-10,10));
 ctx.eHp=Math.max(0, ctx.eHp-base);
 if(sk.name.includes('Извержение')) lavaTurns=3;
 if(sk.name.includes('Огненный')) addLog('🔥 '+sk.name+' '+base+' + поджог 20% 2р','skill');
 else addLog('🌋 '+sk.name+' '+base+' ['+Math.round(mult*100)+'%]','skill');
 updBars(); return true;
};
window.VOLAND_HERO_ON_TURN_END=function(ctx){
 if(lavaTurns>0){ let dmg=Math.max(10, Math.floor(ctx.cur.DMG*0.5) - window.VB.eDef); ctx.eHp=Math.max(0, ctx.eHp-dmg); ctx.addLog('🌋 Лава '+dmg+' ['+lavaTurns+']','skill'); ctx.updBars(); }
};
window.VOLAND_HERO_ON_ROUND_END=function(){ if(lavaTurns>0){ lavaTurns--; if(lavaTurns==0) window.VB.addLog('🌋 Лава остыла','hit'); } };
})();
