// LION WARDEN warrior-m - бастион, аватар
(function(){
let bastionTurns=0, avatarTurns=0, avatarShield=0;
function extra(){ let s=[]; if(bastionTurns>0) s.push('🛡️БАСТИОН '+bastionTurns); if(avatarTurns>0) s.push('👑АВАТАР '+avatarTurns); return s.join(' '); }
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extra; },100);
window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 if(idx===0) return false;
 let sk=activeSkills[idx-1];
 if(ctx.hMana<sk.mana) return false;
 ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||8;
 if(sk.name.includes('Льва')){ let base=Math.floor(cur.DMG*2.0); base=Math.max(10, base - eDef + rand(-10,10)); ctx.eHp=Math.max(0, ctx.eHp-base); setEnemyStun(1); addLog('⚔ Удар Льва '+base+' стан 1р','skill'); updBars(); return true; }
 if(sk.name.includes('Бастион')){ bastionTurns=3; addLog('🛡 Бастион 3р блок 50% отраж 25%','skill'); updBars(); return true; }
 if(sk.name.includes('Аватар')){ avatarTurns=3; addLog('👑 Аватар Империи неуязв 2р +50% HP +300% 3р','skill'); let aoe=Math.floor(cur.DMG*2.0); ctx.eHp=Math.max(0, ctx.eHp-aoe); addLog('👑 AOE всем '+aoe,'skill'); updBars(); return true; }
 let base=Math.floor(cur.DMG*2.0); base=Math.max(10, base - eDef + rand(-10,10)); ctx.eHp=Math.max(0, ctx.eHp-base); addLog('📯 '+sk.name+' '+base,'skill'); updBars(); return true;
};
window.VOLAND_HERO_ON_ENEMY_TURN=function(ctx){
 if(avatarTurns>0 && avatarTurns>=2){ ctx.addLog('👑 Аватар неуязвим!','skill'); return true; }
 if(bastionTurns>0){ let dmg=Math.max(5, Math.floor((ctx.eDmg*0.5)) ); ctx.hHp=Math.max(0, ctx.hHp-dmg); let refl=Math.floor(dmg*0.25); ctx.eHp=Math.max(0, ctx.eHp-refl); ctx.addLog('🛡 Бастион блок 50% '+dmg+' отраж '+refl,'skill'); ctx.updBars(); return true; }
 return false;
};
window.VOLAND_HERO_ON_ROUND_END=function(){ if(bastionTurns>0) bastionTurns--; if(avatarTurns>0){ avatarTurns--; if(avatarTurns==0) window.VB.addLog('👑 Аватар кончился','hit'); } };
})();
