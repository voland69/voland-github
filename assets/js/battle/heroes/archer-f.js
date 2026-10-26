// WILD PATH archer-f - база + доты
(function(){
window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 if(idx===0) return false;
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 let sk=activeSkills[idx-1];
 if(ctx.hMana<sk.mana) return false;
 ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
 let mult= sk.dmgPct?sk.dmgPct/100 : 2.0;
 let base=Math.floor(cur.DMG*mult); base=Math.max(10, base - eDef + rand(-10,10));
 if(Math.random()*100<cur.CRIT) base=Math.floor(base*1.5);
 ctx.eHp=Math.max(0, ctx.eHp-base);
 if(sk.hasStun) setEnemyStun(1);
 addLog('🎯 '+sk.name+' ['+Math.round(mult*100)+'%] '+base,'skill'); updBars(); return true;
};
})();
