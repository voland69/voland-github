// IRON VOW warrior-f - волки, щит, альфа
(function(){
let wolfShield=0, alphaTurns=0;
function extra(){ let s=[]; if(wolfShield>0) s.push('🛡️ВОЛК '+wolfShield); if(alphaTurns>0) s.push('🌕АЛЬФА '+alphaTurns); return s.join(' '); }
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extra; },100);
window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 if(idx===0){
   let {cur, eDef, rand, addLog, updBars}=ctx;
   let mult= alphaTurns>0?1.3:1.0;
   let base=Math.max(10, Math.floor(cur.DMG*2.2*mult) - eDef + rand(-10,10));
   ctx.eHp=Math.max(0, ctx.eHp-base);
   addLog('🗡️ Рассекающий Волк '+base+(alphaTurns>0?' +30% альфа':''),'skill'); ctx.cooldowns[0]=1; updBars(); return true;
 }
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 let sk=activeSkills[idx-1];
 if(ctx.hMana<sk.mana) return false;
 ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||15;
 if(sk.name.includes('Щит')){ wolfShield=4; addLog('🛡 Щит Вожака 4р блок 50% + контра 350%','skill'); updBars(); return true; }
 if(sk.name.includes('Зов')){ setEnemyStun(1); let base=Math.floor(cur.DMG*2.0); base=Math.max(10, base - eDef + rand(-10,10)); ctx.eHp=Math.max(0, ctx.eHp-base*2); addLog('🐾 Зов Стаи стан + '+base*2,'skill'); updBars(); return true; }
 if(sk.name.includes('Альфа')){ alphaTurns=5; addLog('🌕 Альфа Хищник 5р +50% HP +30% урон','skill'); updBars(); return true; }
 let base=Math.floor(cur.DMG*2.0); base=Math.max(10, base - eDef + rand(-10,10)); ctx.eHp=Math.max(0, ctx.eHp-base); addLog('🐺 '+sk.name+' '+base,'skill'); updBars(); return true;
};
window.VOLAND_HERO_ON_ENEMY_TURN=function(ctx){
 if(wolfShield>0 && Math.random()<0.5){ let counter=Math.floor(ctx.cur.DMG*3.5); ctx.eHp=Math.max(0, ctx.eHp-counter); ctx.addLog('🐺 Контра волка '+counter+' [350%]','skill'); ctx.updBars(); return true; }
 return false;
};
window.VOLAND_HERO_ON_ROUND_END=function(){ if(wolfShield>0){ wolfShield--; } if(alphaTurns>0){ alphaTurns--; if(alphaTurns==0) window.VB.addLog('🌕 Альфа кончилась','hit'); } };
})();
