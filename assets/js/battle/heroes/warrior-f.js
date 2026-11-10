// IRON VOW warrior-f - clean version for antivirus
(function(){
const T=(ru,en)=> (typeof volandT==='function' ? volandT(ru,en) : ru);
const SN=(n)=> (typeof volandSkillName==='function' ? volandSkillName(n) : n);
const EN=(e)=> (typeof volandEnemyName==='function' ? volandEnemyName(e) : (e&&e.name||''));
let wolfShield=0;
let alphaTurns=0;
let alphaHPBonus=0;
let lastCur=null;

function extra(){
  let s=[];
  if(wolfShield>0) s.push(T('ВОЛК ','WOLF ')+wolfShield+' 50%');
  if(alphaTurns>0) s.push(T('АЛЬФА ','ALPHA ')+alphaTurns+' +30%');
  return s.join(' ');
}
setTimeout(function(){ if(window.VB) window.VB.extraStat=extra; },100);

function isLowHP(){
  let hHp = window.VB ? window.VB.hHp : 0;
  let hMax = window.VB ? window.VB.hMax : 1;
  return hHp>0 && hHp/hMax < 0.3;
}

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let cur = ctx.cur;
 let eDef = ctx.eDef;
 let activeSkills = ctx.activeSkills;
 let rand = ctx.rand;
 let addLog = ctx.addLog;
 let updBars = ctx.updBars;
 let setEnemyStun = ctx.setEnemyStun;
 lastCur=cur;
 let sk = activeSkills[idx-1];

 if(idx===0){
   let low = isLowHP();
   let mult = 1.0;
   if(alphaTurns>0) mult *= 1.3;
   if(low) mult *= 1.5;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.5);
   let bleedExtra = 0;
   if(alphaTurns>0){
     let bMult = 0.5;
     if(low) bMult *= 1.5;
     bleedExtra = Math.max(5, Math.floor(cur.DMG*bMult) + rand(-5,5));
     if(isCrit) bleedExtra = Math.floor(bleedExtra*1.3);
   }
   let total = base + bleedExtra;
   ctx.eHp = Math.max(0, ctx.eHp - total);
   if(low){
     let heal = Math.floor(total*0.3);
     window.VB.hHp = Math.min(window.VB.hMax, window.VB.hHp + heal);
     if(bleedExtra>0){
       addLog(T('Атака ','Attack ')+base+' +30% '+T('альфа ','alpha ')+'+ '+T('кровь ','bleed ')+bleedExtra+' pure = '+total+(isCrit?' CRIT':'')+' +50% '+T('стаи ','pack ')+'+ '+T('хил ','heal ')+heal,'hit');
     } else {
       addLog(T('Атака ','Attack ')+base+(isCrit?' CRIT':'')+' +50% '+T('стаи ','pack ')+'+ '+T('хил ','heal ')+heal,'hit');
     }
   } else {
     if(bleedExtra>0){
       addLog(T('Атака ','Attack ')+base+' + '+T('кровь ','bleed ')+bleedExtra+' pure = '+total+(isCrit?' CRIT':'')+' [100%+30%+50% pure]','hit');
     } else {
       addLog(T('Атака ','Attack ')+base+(isCrit?' CRIT':''),'hit');
     }
   }
   ctx.cooldowns[0]=1;
   updBars(); return true;
 }

 if(!sk) return false;
 if(ctx.hMana < sk.mana){ addLog(T('Нет маны!','No mana!'),'lose'); return false; }

 if(sk.name.includes('Rassekayushchiy') || sk.name.includes('Рассекающий')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
   let low = isLowHP();
   let m1 = 2.0, m2 = 2.0;
   if(alphaTurns>0){ m1*=1.3; m2*=1.3; }
   if(low){ m1*=1.5; m2*=1.5; }
   let base1 = Math.max(5, Math.floor(cur.DMG*m1) - eDef + rand(-8,8));
   let base2 = Math.max(5, Math.floor(cur.DMG*m2) - eDef + rand(-8,8));
   let isCrit1 = Math.random()*100 < cur.CRIT;
   let isCrit2 = Math.random()*100 < cur.CRIT;
   if(isCrit1) base1 = Math.floor(base1*1.4);
   if(isCrit2) base2 = Math.floor(base2*1.4);
   let bleedExtra = 0;
   if(alphaTurns>0){
     let bMult = 0.5;
     if(low) bMult *= 1.5;
     bleedExtra = Math.max(5, Math.floor(cur.DMG*bMult) + rand(-5,5));
     if(isCrit1||isCrit2) bleedExtra = Math.floor(bleedExtra*1.2);
   }
   let total = base1+base2+bleedExtra;
   ctx.eHp = Math.max(0, ctx.eHp - total);
   let heal = 0;
   if(low){
     heal = Math.floor(total*0.3);
     window.VB.hHp = Math.min(window.VB.hMax, window.VB.hHp + heal);
   }
   if(bleedExtra>0){
     addLog(SN(sk.name)+' '+base1+' + '+base2+' + '+T('кровь ','bleed ')+bleedExtra+' pure = '+total+' [200%+200%+30%+50% pure]'+(isCrit1||isCrit2?' CRIT':'')+(low?' +50% '+T('стаи ','pack ')+'+ '+T('хил ','heal ')+heal:''),'skill');
   } else {
     addLog(SN(sk.name)+' '+base1+' + '+base2+' = '+total+' [200%+200%'+(low?' +50% '+T('стаи ','pack '):'')+']'+(isCrit1||isCrit2?' CRIT':'')+(low?' + '+T('хил ','heal ')+heal:''),'skill');
   }
   updBars(); return true;
 }

 if(sk.name.includes('Shchit') || sk.name.includes('Щит')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||15;
   wolfShield = 5;
   addLog(SN(sk.name)+' '+T('щит ','shield ')+'4'+T('р','r')+' '+T('блок ','block ')+'50% + '+T('контра ','counter ')+'350%','skill');
   updBars(); return true;
 }

 if(sk.name.includes('Zov') || sk.name.includes('Зов')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||15;
   let low = isLowHP();
   let m = 2.0;
   if(alphaTurns>0) m*=1.3;
   if(low) m*=1.5;
   let base1 = Math.max(10, Math.floor(cur.DMG*m) - eDef + rand(-10,10));
   let base2 = Math.max(10, Math.floor(cur.DMG*m) - eDef + rand(-10,10));
   let isCrit1 = Math.random()*100 < cur.CRIT;
   let isCrit2 = Math.random()*100 < cur.CRIT;
   if(isCrit1) base1 = Math.floor(base1*1.4);
   if(isCrit2) base2 = Math.floor(base2*1.4);
   let bleedExtra = 0;
   if(alphaTurns>0){
     let bMult = 0.5;
     if(low) bMult *= 1.5;
     bleedExtra = Math.max(5, Math.floor(cur.DMG*bMult) + rand(-5,5));
   }
   let total = base1+base2+bleedExtra;
   ctx.eHp = Math.max(0, ctx.eHp - total);
   setEnemyStun(1);
   let heal = 0;
   if(low){
     heal = Math.floor(total*0.3);
     window.VB.hHp = Math.min(window.VB.hMax, window.VB.hHp + heal);
   }
   if(bleedExtra>0){
     addLog(SN(sk.name)+' '+T('стан ','stun ')+'1'+T('р','r')+' + '+base1+' + '+base2+' + '+T('кровь ','bleed ')+bleedExtra+' pure = '+total+' [200%x1.3 + 200%x1.3 + 50% pure]'+(isCrit1||isCrit2?' CRIT':'')+(low?' +50% '+T('стаи ','pack ')+'+ '+T('хил ','heal ')+heal:''),'skill');
   } else {
     addLog(SN(sk.name)+' '+T('стан ','stun ')+'1'+T('р','r')+' + '+base1+' + '+base2+' = '+total+' [200% + 200% 2 '+T('раза','times')+']'+(isCrit1||isCrit2?' CRIT':'')+(low?' + '+T('хил ','heal ')+heal:''),'skill');
   }
   updBars(); return true;
 }

 if(sk.name.includes('Alfa') || sk.name.includes('Альфа')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||20;
   if(alphaHPBonus==0){
     alphaHPBonus = Math.floor(window.VB.hMax*0.5);
     window.VB.hMax = window.VB.hMax + alphaHPBonus;
     window.VB.hHp = window.VB.hHp + alphaHPBonus;
     addLog(SN(sk.name)+' +50% HP +'+alphaHPBonus+' -> HP '+window.VB.hHp+'/'+window.VB.hMax+' +30% '+T('урон ','damage ')+'5'+T('р','r')+' + '+T('кровь ','bleed ')+'50% pure '+T('от атак','from attacks'),'skill');
   } else {
     addLog(SN(sk.name)+' '+T('уже активен ','already active ')+alphaTurns+'r','skill');
   }
   alphaTurns = 5;
   updBars(); return true;
 }

 return false;
};

window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 if(wolfShield>0 && Math.random()<0.5){
   let base = Math.max(10, Math.floor(ctx.cur.DMG*3.5) - (window.VB ? window.VB.eDef : 10) + (Math.floor(Math.random()*21)-10));
   if(Math.random()*100 < ctx.cur.CRIT) base = Math.floor(base*1.4);
   window.VB.eHp = Math.max(0, window.VB.eHp - base);
   window.VB.addLog(T('Волк ','Wolf ')+T('щит ','shield ')+T('блок!','block! ')+T('Контра ','Counter ')+base+' [350%]','skill');
   window.VB.updBars();
   return true;
 }
 return false;
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 if(wolfShield>0){
   wolfShield--;
   if(wolfShield==0 && window.VB) window.VB.addLog(T('Щит Волка ','Wolf Shield ')+T('кончился','ended'),'hit');
 }
 if(alphaTurns>0){
   alphaTurns--;
   if(alphaTurns==0){
     if(window.VB) window.VB.addLog(T('Альфа ','Alpha ')+T('кончилась','ended'),'hit');
     if(alphaHPBonus>0 && window.VB){
       window.VB.hMax = Math.max(100, window.VB.hMax - alphaHPBonus);
       window.VB.hHp = Math.min(window.VB.hHp, window.VB.hMax);
       window.VB.addLog('-'+alphaHPBonus+' HP ('+T('конец альфы','alpha ended')+') -> '+window.VB.hHp+'/'+window.VB.hMax,'hit');
       alphaHPBonus=0;
       window.VB.updBars();
     }
   }
 }
};

})();
