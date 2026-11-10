// DARK RANGER archer-m - fix: metka only +100% dmg, no crit on 4th, only 1 arrow gets bonus
(function(){
const T=(ru,en)=> (typeof volandT==='function' ? volandT(ru,en) : ru);
const SN=(n)=> (typeof volandSkillName==='function' ? volandSkillName(n) : n);
const EN=(e)=> (typeof volandEnemyName==='function' ? volandEnemyName(e) : (e&&e.name||''));
let markTurns=0, invisTurns=0, attackCount=0;

function extra(){ 
  let s=[]; 
  if(markTurns>0) s.push('👁️'+T('МЕТКА ','MARK ')+markTurns+' +100%'); 
  if(invisTurns>0) s.push('🌑'+T('ИНВИЗ ','INVIS ')+invisTurns); 
  s.push(T('АТАК:','ATK:')+attackCount);
  return s.join(' '); 
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extra; },100);

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;

 if(idx===0){
  attackCount++;
  let isFourth = (attackCount%4===0);
  let markActive = markTurns>0;
  let mult = 1.0 + (markActive ? 1.0 : 0);
  let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-12,12));
  let forceCrit = invisTurns>0;
  let isCrit = forceCrit || (Math.random()*100 < cur.CRIT);
  if(isCrit) base = Math.floor(base*1.5);
  let wasInvis = invisTurns>0;
  if(wasInvis){ invisTurns=0; addLog('🌑 '+T('Инвиз снят, ','Invis removed, ')+T('крит!','crit!'),'skill'); }
  ctx.eHp = Math.max(0, ctx.eHp - base);
  if(markActive && ctx.eHp<=0){ ctx.hMana = Math.min(ctx.hMaxMana, ctx.hMana+15); addLog('👁️ '+T('Убийство метки ','Mark kill ')+'+15 '+T('маны','mana'),'skill'); }
  addLog('🏹 '+T('Атака ','Attack ')+(markActive?'+'+T('МЕТКА ','MARK '):'')+base+(isCrit? (wasInvis?' CRIT '+T('ИНВИЗ','INVIS'):' CRIT') : '')+(isFourth?' [4-'+T('я','th')+' → '+T('МЕТКА','MARK')+']':''),'hit');
  if(isFourth){ markTurns=3; addLog('👁️ '+SN('Метка Тени')+' '+T('наложена ','applied ')+'2'+T('р','r')+' +100%','skill'); }
  ctx.cooldowns[0]=1; updBars(); return true;
 }

 let sk=activeSkills[idx-1];
 if(!sk) return false;

 if(sk.name.includes('Беглый')){
  if(ctx.hMana<sk.mana){ addLog('⛔ '+T('Не хватает маны!','Not enough mana!'),'lose'); return false; }
  attackCount++;
  let isFourth = (attackCount%4===0);
  let markActive = markTurns>0;
  let mult = 2.0 + (markActive ? 1.0 : 0);
  let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-10,10));
  let wasInvis = invisTurns>0;
  let isCrit = wasInvis || (Math.random()*100 < cur.CRIT);
  if(isCrit) base = Math.floor(base*1.4);
  if(wasInvis){ invisTurns=0; addLog('🌑 '+T('Инвиз снят, ','Invis removed, ')+T('крит!','crit!'),'skill'); }
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
  ctx.eHp = Math.max(0, ctx.eHp - base);
  if(markActive && ctx.eHp<=0){ ctx.hMana = Math.min(ctx.hMaxMana, ctx.hMana+15); addLog('👁️ '+T('Убийство метки ','Mark kill ')+'+15 '+T('маны','mana'),'skill'); }
  addLog('🏹 '+SN(sk.name)+' '+(markActive?'+'+T('МЕТКА ','MARK '):'')+base+' ['+Math.round(mult*100)+'%]'+(isCrit? (wasInvis?' CRIT '+T('ИНВИЗ','INVIS'):' CRIT'):'')+(isFourth?' [4-'+T('я','th')+']':''),'skill');
  if(isFourth){ markTurns=3; addLog('👁️ '+SN('Метка Тени')+' '+T('наложена ','applied ')+'2'+T('р','r')+' +100%','skill'); }
  updBars(); return true;
 }

 if(sk.name.includes('Шаг')){
  if(ctx.hMana<sk.mana){ addLog('⛔ '+T('Не хватает маны!','Not enough mana!'),'lose'); return false; }
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||20;
  invisTurns=3;
  addLog('🌑 '+SN(sk.name)+' '+T('инвиз ','invis ')+'3'+T('р','r')+', '+T('след атака/скил гарант крит','next attack/skill guaranteed crit'),'skill');
  updBars(); return true;
 }

 if(sk.name.includes('Призрачная')){
  if(ctx.hMana<sk.mana){ addLog('⛔ '+T('Не хватает маны!','Not enough mana!'),'lose'); return false; }
  attackCount++;
  let isFourth = (attackCount%4===0);
  let markActive = markTurns>0;
  let mult = 2.0 + (markActive ? 1.0 : 0);
  let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-10,10));
  let wasInvis = invisTurns>0;
  let isCrit = wasInvis || (Math.random()*100 < cur.CRIT);
  if(isCrit) base = Math.floor(base*1.4);
  if(wasInvis){ invisTurns=0; addLog('🌑 '+T('Инвиз снят, ','Invis removed, ')+T('крит!','crit!'),'skill'); }
  let doStun = Math.random()<0.33;
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||5;
  ctx.eHp = Math.max(0, ctx.eHp - base);
  if(markActive && ctx.eHp<=0){ ctx.hMana = Math.min(ctx.hMaxMana, ctx.hMana+15); addLog('👁️ '+T('Убийство метки ','Mark kill ')+'+15 '+T('маны','mana'),'skill'); }
  addLog('💫 '+SN(sk.name)+' '+(markActive?'+'+T('МЕТКА ','MARK '):'')+base+' ['+Math.round(mult*100)+'%]'+(isCrit? (wasInvis?' CRIT '+T('ИНВИЗ','INVIS'):' CRIT'):'')+(doStun?' +'+T('стан!','stun!'):'')+(isFourth?' [4-'+T('я','th')+']':''),'skill');
  if(doStun) setEnemyStun(1);
  if(isFourth){ markTurns=3; addLog('👁️ '+SN('Метка Тени')+' '+T('наложена ','applied ')+'2'+T('р','r')+' +100%','skill'); }
  updBars(); return true;
 }

 // T - Залп Бездны 7x180% - метка только +100% на 1 стрелу, без крита на 4-й
 if(sk.name.includes('Залп')){
  if(ctx.hMana<sk.mana){ addLog('⛔ '+T('Не хватает маны!','Not enough mana!'),'lose'); return false; }
  attackCount++;
  let isFourth = (attackCount%4===0);
  let markActive = markTurns>0;
  let wasInvis = invisTurns>0;
  ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25;
  let total=0, critCount=0;
  let hasBonus = markActive || isFourth; // если есть метка или это 4-я атака - 1 стрела получит +100%
  addLog('🌌 '+SN(sk.name)+' → 7 '+T('стрел','arrows')+' '+T('по ','for ')+'200%'+(hasBonus?' +'+T('МЕТКА ','MARK ')+'1 '+T('стрела','arrow'):'')+(wasInvis?' +'+T('ИНВИЗ ','INVIS ')+'1 '+T('крит','crit'):'')+(isFourth?' [4-'+T('я','th')+']':''),'skill');
  for(let i=0;i<7;i++){
    let isFirst = i===0;
    let curMult = 2.0;
    // только 1-я стрела получает +100% если есть метка или 4-я атака
    if(hasBonus && isFirst){
      curMult += 1.0; // 280% на 1-й
    }
    // крит: только инвиз дает гарант крит на 1-й, 4-я крит не дает
    let isCrit = false;
    if(wasInvis && isFirst) isCrit=true;
    else isCrit = Math.random()*100 < cur.CRIT;

    let d = Math.max(5, Math.floor(cur.DMG*curMult) - eDef + rand(-8,8));
    if(isCrit){ d=Math.floor(d*1.4); critCount++; }
    total+=d;
    ctx.eHp = Math.max(0, ctx.eHp - d);
    let tag = '['+Math.round(curMult*100)+'%'+(hasBonus && isFirst ? '+'+T('МЕТКА','MARK'):'')+']';
    addLog('  🏹 '+T('Стрела ','Arrow ')+(i+1)+' → '+d+' '+tag+(isCrit?' CRIT'+(wasInvis && isFirst ? ' '+T('ИНВИЗ','INVIS'):'') : ''),'skill');
    await new Promise(r=>setTimeout(r,70));
    updBars();
    if(ctx.eHp<=0) break;
  }
  if(wasInvis){ invisTurns=0; addLog('🌑 '+T('Инвиз снят','Invis removed'),'skill'); }
  if(markActive && ctx.eHp<=0){ ctx.hMana = Math.min(ctx.hMaxMana, ctx.hMana+15); addLog('👁️ '+T('Убийство метки ','Mark kill ')+'+15 '+T('маны','mana'),'skill'); }
  addLog('🌌 '+SN(sk.name)+' '+T('итого ','total ')+total+' ('+T('критов ','crits ')+critCount+'/7)','skill');
  if(isFourth){ markTurns=3; addLog('👁️ '+SN('Метка Тени')+' '+T('наложена ','applied ')+'2'+T('р','r')+' +100%','skill'); }
  updBars(); return true;
 }

 return false;
};

window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 if(invisTurns>0){
  ctx.addLog('🌑 '+T('Враг не видит тебя ','Enemy cannot see you ')+'('+T('инвиз ','invis ')+invisTurns+') — '+T('промах!','miss!'),'skill');
  return true;
 }
 return false;
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 if(markTurns>0){ markTurns--; if(markTurns==0 && window.VB) window.VB.addLog('👁️ '+T('Метка ','Mark ')+T('кончилась','ended'),'hit'); }
 if(invisTurns>0){ invisTurns--; if(invisTurns==0 && window.VB) window.VB.addLog('🌑 '+T('Инвиз ','Invis ')+T('кончился','ended'),'hit'); }
};

})();
