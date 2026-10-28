// VOLAND HERO GRAVELORD (necro-m)
(function(){
let legionCount=0, boneVulnTurns=0, boneShield=0, bomber1=0, bomber2=0, armyTurns=0, armyCount=0;
function extraStat(){
 let s=[]; if(legionCount>0) s.push('🦴ЛЕГИОН '+legionCount); if(boneVulnTurns>0) s.push('☠️УЯЗВ '+boneVulnTurns); if(boneShield>0) s.push('🛡️ЩИТ '+boneShield); if(bomber1>0||bomber2>0) s.push('💣БОМБЕРЫ'); if(armyTurns>0) s.push('💀АРМИЯ '+armyCount+'x'+armyTurns); return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extraStat; },100);
window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars}=ctx;
 if(idx===0) return false;
 let sk=activeSkills[idx-1];
 if(sk.name.includes('Копье')){ if(ctx.hMana<sk.mana) return false; ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||4; let base=Math.floor(cur.DMG*1.5); base=Math.max(15, base - eDef + rand(-10,10)); if(Math.random()*100<cur.CRIT) base=Math.floor(base*1.4); ctx.eHp=Math.max(0, ctx.eHp-base); boneVulnTurns=2; addLog('☠️ '+sk.name+' '+base+' +25% уязв 2р','skill'); updBars(); return true; }
 if(sk.name.includes('Щит')){ if(ctx.hMana<sk.mana) return false; ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||10; boneShield=Math.floor(cur.HP*0.2); addLog('🛡️ '+sk.name+' щит '+boneShield+' 20% HP','skill'); updBars(); return true; }
 if(sk.name.includes('Поднять Мертвых')){ if(ctx.hMana<sk.mana) return false; ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||18; bomber1=1; bomber2=2; addLog('👥 2 бомбера: 200% сейчас, 300% след раунд','skill'); updBars(); return true; }
 if(sk.name.includes('Армия')){ if(ctx.hMana<sk.mana) return false; ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25; armyCount=5; armyTurns=3; addLog('💀 Армия 5 скелетов 3р по 100%','skill'); updBars(); return true; }
 return false;
};
window.VOLAND_HERO_ON_TURN_END = function(ctx){
 let {cur, rand, addLog, updBars}=ctx; let eDef=window.VB.eDef; let vuln=boneVulnTurns>0?1.25:1.0;
 if(legionCount<3){ legionCount++; addLog('🦴 Легион +1 скелет '+legionCount+'/3','skill'); }
 let total=0; if(legionCount>0) for(let i=0;i<legionCount;i++){ total+=Math.max(5, Math.floor(cur.DMG*1.0*vuln) - Math.floor(eDef/3) + rand(-5,5)); }
 if(armyTurns>0) for(let i=0;i<armyCount;i++){ total+=Math.max(5, Math.floor(cur.DMG*1.0*vuln) - Math.floor(eDef/3) + rand(-5,5)); }
 if(total>0){ ctx.eHp=Math.max(0, ctx.eHp-total); addLog('🦴 Саммоны '+total,'skill'); updBars(); }
 if(bomber1>0){ let d=Math.max(15, Math.floor(cur.DMG*2.0*vuln) - eDef + rand(-10,10)); ctx.eHp=Math.max(0, ctx.eHp-d); addLog('💣 Бомбер1 '+d+' [200%]','skill'); bomber1=0; updBars(); }
 if(bomber2>0){ bomber2--; if(bomber2==0){ let d=Math.max(15, Math.floor(cur.DMG*3.0*vuln) - eDef + rand(-10,10)); ctx.eHp=Math.max(0, ctx.eHp-d); addLog('💣 Бомбер2 '+d+' [300%]','skill'); updBars(); } else addLog('💣 Бомбер2 тик...','hit'); }
};
window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 if(boneShield>0){
   let dmg=Math.max(10, ctx.eDmg - ctx.cur.DEF + (ctx.rand?ctx.rand(-10,10):0));
   if(dmg<=boneShield){
    boneShield-=dmg;
    ctx.addLog('🛡️ Щит поглотил '+dmg+' ост '+boneShield,'skill');
    ctx.updBars();
    return true; // полностью поглотил
   } else {
    let broken=boneShield;
    let over=dmg-broken;
    ctx.addLog('🛡️ Щит разрушен '+broken+' + пробитие '+over,'skill');
    boneShield=0;
    let exp=Math.max(15, Math.floor(ctx.cur.DMG*3.0)-window.VB.eDef + (ctx.rand?ctx.rand(-5,5):0));
    ctx.eHp=Math.max(0, ctx.eHp-exp);
    ctx.addLog('💥 Взрыв щита '+exp+' AOE [300%]','skill');
    ctx.hHp=Math.max(0, ctx.hHp-over);
    if(over>0) ctx.addLog('💥 Пробитие '+over+' в HP','enemy-hit');
    ctx.updBars();
    return true; // уже нанесли over, не давать engine бить второй раз
   }
 }
 return false;
};
window.VOLAND_HERO_ON_ROUND_END = function(){ if(boneVulnTurns>0){ boneVulnTurns--; if(boneVulnTurns==0) window.VB.addLog('☠️ Уязв кончилась','hit'); } if(armyTurns>0){ armyTurns--; if(armyTurns==0){ armyCount=0; window.VB.addLog('💀 Армия исчезла','hit'); } } };
})();
