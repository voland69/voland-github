// DARK RANGER archer-m - метка тени + инвиз
(function(){
let markTurns=0, invisTurns=0, attackCount=0;
function extra(){ let s=[]; if(markTurns>0) s.push('👁️МЕТКА '+markTurns); if(invisTurns>0) s.push('🌑ИНВИЗ '+invisTurns); return s.join(' '); }
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extra; },100);
window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 if(idx===0){
   attackCount++;
   if(attackCount%4===0){ markTurns=2; addLog('👁️ Метка Тени наложена 2р +100%','skill'); }
   let extra= markTurns>0? Math.floor(cur.DMG*1.0):0;
   let base=Math.max(10, cur.DMG - eDef + rand(-12,12) + extra);
   let forceCrit = invisTurns>0;
   if(forceCrit || Math.random()*100<cur.CRIT) base=Math.floor(base*1.5);
   if(invisTurns>0){ invisTurns=0; addLog('🌑 Инвиз снят, крит!','skill'); }
   ctx.eHp=Math.max(0, ctx.eHp-base);
   addLog('🏹 Атака '+(markTurns>0?'+МЕТКА ':'')+base+(forceCrit?' CRIT ИНВИЗ':''),'hit');
   ctx.cooldowns[0]=1; updBars(); return true;
 }
 let sk=activeSkills[idx-1];
 if(sk.name.includes('Беглый')){ if(ctx.hMana<sk.mana) return false; ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3; let base=Math.floor(cur.DMG*2.0); base=Math.max(10, base - eDef + rand(-10,10)); ctx.eHp=Math.max(0, ctx.eHp-base); addLog('🏹 '+sk.name+' '+base+' [200%]','skill'); updBars(); return true; }
 if(sk.name.includes('Шаг')){ if(ctx.hMana<sk.mana) return false; ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||20; invisTurns=3; addLog('🌑 '+sk.name+' инвиз 3р, след атака гарант крит','skill'); updBars(); return true; }
 if(ctx.hMana<sk.mana) return false; ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||5; let mult=sk.dmgPct?sk.dmgPct/100:1.4; let base=Math.floor(cur.DMG*mult); base=Math.max(10, base - eDef + rand(-10,10)); ctx.eHp=Math.max(0, ctx.eHp-base); if(sk.hasStun && Math.random()<0.33) setEnemyStun(1); addLog('💫 '+sk.name+' '+base,'skill'); updBars(); return true;
};
window.VOLAND_HERO_ON_ROUND_END=function(){ if(markTurns>0){ markTurns--; } if(invisTurns>0){ invisTurns--; if(invisTurns==0 && window.VB) window.VB.addLog('🌑 Инвиз кончился','hit'); } };
})();
