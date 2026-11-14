// VOLAND HERO GRAVELORD (necro-m)
(function(){
const T=(ru,en)=> (typeof volandT==='function' ? volandT(ru,en) : ru);
const SN=(n)=> (typeof volandSkillName==='function' ? volandSkillName(n) : n);
const EN=(e)=> (typeof volandEnemyName==='function' ? volandEnemyName(e) : (e&&e.name||''));
let legionCount=0, boneVulnTurns=0, boneShield=0, bomber1=0, bomber2=0, armyTurns=0, armyCount=0;
function extraStat(){
 let s=[]; if(legionCount>0) s.push('🦴'+T('ЛЕГИОН ','LEGION ')+legionCount); if(boneVulnTurns>0) s.push('☠️'+T('УЯЗВ ','VULN ')+boneVulnTurns); if(boneShield>0) s.push('🛡️'+T('ЩИТ ','SHIELD ')+boneShield); if(bomber1>0||bomber2>0) s.push('💣'+T('БОМБЕРЫ','BOMBERS')); if(armyTurns>0) s.push('💀'+T('АРМИЯ ','ARMY ')+armyCount+'x'+armyTurns); return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extraStat; },100);
window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars}=ctx;
 if(idx===0) return false;
 let sk=activeSkills[idx-1];
 if(sk.name.includes('Копье')){ if(ctx.hMana<sk.mana) return false; ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||4; let base=Math.floor(cur.DMG*1.5); base=Math.max(15, base - eDef + rand(-10,10)); if(Math.random()*100<cur.CRIT) base=Math.floor(base*1.4); ctx.eHp=Math.max(0, ctx.eHp-base); boneVulnTurns=2; addLog('☠️ '+SN(sk.name)+' '+base+' +25% '+T('уязв ','vuln ')+'2'+T('р','r'),'skill'); updBars(); return true; }
 if(sk.name.includes('Щит')){ if(ctx.hMana<sk.mana) return false; ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||10; boneShield=Math.floor(cur.HP*0.2); addLog('🛡️ '+SN(sk.name)+' '+T('щит ','shield ')+boneShield+' 20% HP','skill'); updBars(); return true; }
 if(sk.name.includes('Поднять Мертвых')){ if(ctx.hMana<sk.mana) return false; ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||18; bomber1=1; bomber2=2; addLog('👥 2 '+T('бомбера: ','bombers: ')+'200% '+T('сейчас,','now,')+' 300% '+T('след раунд','next round'),'skill'); updBars(); return true; }
 if(sk.name.includes('Армия')){ if(ctx.hMana<sk.mana) return false; ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25; armyCount=5; armyTurns=3; addLog('💀 '+T('Армия ','Army ')+'5 '+T('скелетов ','skeletons ')+'3'+T('р','r')+' '+T('по ','for ')+'100%','skill'); updBars(); return true; }
 return false;
};
window.VOLAND_HERO_ON_TURN_END = function(ctx){
 let {cur, rand, addLog, updBars}=ctx; let eDef=window.VB.eDef; let vuln=boneVulnTurns>0?1.25:1.0;
 if(legionCount<3){ legionCount++; addLog('🦴 '+T('Легион ','Legion ')+'+1 '+T('скелет ','skeleton ')+legionCount+'/3','skill'); }
 if(legionCount>0) for(let i=0;i<legionCount;i++){ if(ctx.eHp<=0) break; let d=Math.max(5, Math.floor(cur.DMG*1.0*vuln) - Math.floor(eDef * 0.75) + rand(-5,5)); ctx.eHp=Math.max(0, ctx.eHp-d); addLog('🦴 '+T('Легион ','Legion ')+(i+1)+' '+d,'skill'); }
 if(armyTurns>0) for(let i=0;i<armyCount;i++){ if(ctx.eHp<=0) break; let d=Math.max(5, Math.floor(cur.DMG*1.0*vuln) - Math.floor(eDef * 0.75) + rand(-5,5)); ctx.eHp=Math.max(0, ctx.eHp-d); addLog('💀 '+T('Армия ','Army ')+(i+1)+' '+d,'skill'); }
 updBars();
 if(bomber1>0){ let d=Math.max(15, Math.floor(cur.DMG*2.0*vuln) - eDef + rand(-10,10)); ctx.eHp=Math.max(0, ctx.eHp-d); addLog('💣 '+T('Бомбер','Bomber')+'1 '+d+' [200%]','skill'); bomber1=0; updBars(); }
 if(bomber2>0){ bomber2--; if(bomber2==0){ let d=Math.max(15, Math.floor(cur.DMG*3.0*vuln) - eDef + rand(-10,10)); ctx.eHp=Math.max(0, ctx.eHp-d); addLog('💣 '+T('Бомбер','Bomber')+'2 '+d+' [300%]','skill'); updBars(); } else addLog('💣 '+T('Бомбер','Bomber')+'2 '+T('тик...','tick...'),'hit'); }
};
window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 if(boneShield>0){
   let dmg=Math.max(10, ctx.eDmg - ctx.cur.DEF + (ctx.rand?ctx.rand(-10,10):0));
   if(dmg<=boneShield){
    boneShield-=dmg;
    ctx.addLog('🛡️ '+T('Щит ','Shield ')+T('поглотил ','absorbed ')+dmg+' '+T('ост ','left ')+boneShield,'skill');
    ctx.updBars();
    return true; // полностью поглотил
   } else {
    let broken=boneShield;
    let over=dmg-broken;
    ctx.addLog('🛡️ '+T('Щит ','Shield ')+T('разрушен ','broken ')+broken+' + '+T('пробитие ','pierce ')+over,'skill');
    boneShield=0;
    let exp=Math.max(15, Math.floor(ctx.cur.DMG*3.0)-window.VB.eDef + (ctx.rand?ctx.rand(-5,5):0));
    ctx.eHp=Math.max(0, ctx.eHp-exp);
    ctx.addLog('💥 '+T('Взрыв щита ','Shield blast ')+exp+' AOE [300%]','skill');
    ctx.hHp=Math.max(0, ctx.hHp-over);
    if(over>0) ctx.addLog('💥 '+T('Пробитие ','Pierce ')+over+' '+T('в HP','to HP'),'enemy-hit');
    ctx.updBars();
    return true; // уже нанесли over, не давать engine бить второй раз
   }
 }
 return false;
};
window.VOLAND_HERO_ON_ROUND_END = function(){ if(boneVulnTurns>0){ boneVulnTurns--; if(boneVulnTurns==0) window.VB.addLog('☠️ '+T('Уязв ','Vuln ')+T('кончилась','ended'),'hit'); } if(armyTurns>0){ armyTurns--; if(armyTurns==0){ armyCount=0; window.VB.addLog('💀 '+T('Армия ','Army ')+T('исчезла','vanished'),'hit'); } } };
})();
