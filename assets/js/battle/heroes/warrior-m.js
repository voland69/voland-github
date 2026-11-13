// LION WARDEN warrior-m - fix2: bastion 50% block correctly with DEF, duration 3r, reflect 25% of original
(function(){
let bastionTurns=0;
let avatarTurns=0;
let avatarDmgTurns=0;
let avatarHPBonus=0;
let passiveShield=0;
let passiveUsed=false;
let passiveShieldTurns=0;
let lastCur=null;
const T=(ru,en)=> (typeof volandT==='function' ? volandT(ru,en) : ru);
const SN=(n)=> (typeof volandSkillName==='function' ? volandSkillName(n) : n);

function extra(){
  let s=[];
  if(bastionTurns>0) s.push('🛡️'+T('БАСТИОН ','BASTION ')+bastionTurns+' 50%');
  if(avatarTurns>0) s.push('👑'+T('АВАТАР ','AVATAR ')+avatarTurns+' '+T('неуязв','invuln'));
  if(avatarDmgTurns>0) s.push('⚔️+200% '+avatarDmgTurns);
  if(passiveShield>0) s.push('🛡️'+T('ЩИТ ','SHIELD ')+passiveShield+' '+passiveShieldTurns+T('р','r'));
  if(window.VB){
    let hpPct = window.VB.hHp / window.VB.hMax * 100;
    let lost = 100 - hpPct;
    let defBonus = Math.min(30, Math.floor(lost/5)*3);
    if(defBonus>0) s.push('🦁DEF+'+defBonus+'%');
  }
  return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extra; },100);

function getDefBonus(){
  if(!window.VB) return 0;
  let hpPct = window.VB.hHp / window.VB.hMax * 100;
  let lost = 100 - hpPct;
  return Math.min(30, Math.floor(lost/5)*3);
}

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 lastCur=cur;
 let sk = activeSkills[idx-1];

 if(idx===0){
   let mult = 1.0;
   if(avatarDmgTurns>0) mult += 2.0;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.5);
   ctx.eHp = Math.max(0, ctx.eHp - base);
   addLog('⚔️ '+T('Атака ','Attack ')+base+(mult>1?' ['+Math.round(mult*100)+'% +200% '+T('аватар','avatar')+']':'')+(isCrit?' CRIT':''),'hit');
   ctx.cooldowns[0]=1;
   updBars(); return true;
 }

 if(!sk) return false;
 if(ctx.hMana < sk.mana){ addLog('⛔ '+T('Не хватает маны!','Not enough mana!'),'lose'); return false; }

 if(sk.name.includes('Льва')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||8;
   let mult = 2.0;
   if(avatarDmgTurns>0) mult += 2.0;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.4);
   ctx.eHp = Math.max(0, ctx.eHp - base);
   setEnemyStun(1);
   addLog('⚔️ '+SN('Удар Льва')+' '+base+' ['+Math.round(mult*100)+'%'+(avatarDmgTurns>0?' +200% '+T('аватар','avatar'):'')+'] '+T('стан ','stun ')+'1'+T('р','r')+(isCrit?' CRIT':''),'skill');
   updBars(); return true;
 }

 if(sk.name.includes('Бастион')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||15;
   bastionTurns = 3; // ровно 3р блока
   addLog('🛡️ '+SN('Имперский Бастион')+' '+T('щит ','shield ')+'3'+T('р','r')+' '+T('блок ','block ')+'50% '+T('отраж ','reflect ')+'25%','skill');
   updBars(); return true;
 }

 if(sk.name.includes('Рассекающий')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
   let mult = 2.0;
   if(avatarDmgTurns>0) mult += 2.0;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.4);
   ctx.eHp = Math.max(0, ctx.eHp - base);
   addLog('📯 '+SN('Рассекающий удар')+' '+base+' ['+Math.round(mult*100)+'%'+(avatarDmgTurns>0?' +200% '+T('аватар','avatar'):'')+']'+(isCrit?' CRIT':''),'skill');
   updBars(); return true;
 }

 if(sk.name.includes('Аватар')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||35;
   let aoeMult = 2.0;
   let aoe = Math.max(10, Math.floor(cur.DMG*aoeMult) - eDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) aoe = Math.floor(aoe*1.4);
   ctx.eHp = Math.max(0, ctx.eHp - aoe);
   addLog('👑 '+SN('Аватар Империи')+' AOE '+T('всем ','to all ')+aoe+' [200%]'+(isCrit?' CRIT':''),'skill');
   avatarTurns = 2; // неуязв 2р
   avatarDmgTurns = 3; // +200% 3р
   if(avatarHPBonus==0){
     avatarHPBonus = Math.floor(window.VB.hMax*0.5);
     window.VB.hMax = window.VB.hMax + avatarHPBonus;
     window.VB.hHp = window.VB.hHp + avatarHPBonus;
     addLog('👑 +50% HP +'+avatarHPBonus+' → HP '+window.VB.hHp+'/'+window.VB.hMax+' '+T('неуязв','invuln')+' 2'+T('р','r')+' +200% '+T('урон','damage')+' 3'+T('р','r'),'skill');
   } else {
     addLog('👑 '+T('Аватар уже активен ','Avatar already active ')+T('неуязв','invuln')+' '+avatarTurns+T('р','r')+' +200% '+avatarDmgTurns+T('р','r'),'skill');
   }
   updBars(); return true;
 }

 return false;
};

window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 // Аватар неуязв 2р
 if(avatarTurns>0){
   ctx.addLog('👑 '+T('Аватар ','Avatar ')+T('неуязвим!','invulnerable!')+' ['+avatarTurns+T('р','r')+']','skill');
   return true;
 }
 // Бастион - правильный расчет с DEF
 if(bastionTurns>0){
   let defBonus = getDefBonus();
   let effDef = Math.floor(ctx.cur.DEF * (1 + defBonus/100));
   let origDmg = Math.max(10, ctx.eDmg - effDef + (Math.floor(Math.random()*21)-10));
   let blocked = Math.max(5, Math.floor(origDmg*0.5));
   let refl = Math.max(1, Math.floor(origDmg*0.25));
   // пассивный щит поглощает
   if(passiveShield>0){
     let absorbed = Math.min(passiveShield, blocked);
     passiveShield -= absorbed;
     blocked -= absorbed;
     ctx.addLog('🛡️ '+T('Щит пассива ','Passive shield ')+T('поглотил ','absorbed ')+absorbed+' '+T('осталось ','left ')+passiveShield,'skill');
     if(passiveShield<=0){
       passiveShield=0;
       passiveShieldTurns=0;
       ctx.addLog('🛡️ '+T('Щит пассива ','Passive shield ')+T('сломан','broken'),'hit');
     }
   }
   window.VB.hHp = Math.max(0, window.VB.hHp - blocked);
   window.VB.eHp = Math.max(0, window.VB.eHp - refl);
   ctx.addLog('🛡️ '+T('Бастион ','Bastion ')+T('блок ','block ')+'50% '+blocked+' ('+T('из ','of ')+origDmg+') '+T('отраж ','reflect ')+refl+' [25%] DEF+'+defBonus+'%','skill');
   ctx.updBars();
   return true; // скип обычного урона врага
 }
 // пассивка щит 15% без бастиона
 if(passiveShield>0){
   let defBonus = getDefBonus();
   let effDef = Math.floor(ctx.cur.DEF * (1 + defBonus/100));
   let origDmg = Math.max(10, ctx.eDmg - effDef + (Math.floor(Math.random()*21)-10));
   let absorbed = Math.min(passiveShield, origDmg);
   passiveShield -= absorbed;
   let remaining = origDmg - absorbed;
   window.VB.hHp = Math.max(0, window.VB.hHp - remaining);
   ctx.addLog('🛡️ '+T('Щит пассива ','Passive shield ')+T('блок ','block ')+absorbed+' '+T('урон','damage')+' '+remaining+' DEF+'+defBonus+'%','skill');
   if(passiveShield<=0){
     passiveShield=0;
     passiveShieldTurns=0;
     ctx.addLog('🛡️ '+T('Щит пассива ','Passive shield ')+T('сломан','broken'),'hit');
   }
   ctx.updBars();
   return true;
 }
 return false;
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 if(bastionTurns>0){
   bastionTurns--;
   if(bastionTurns==0 && window.VB) window.VB.addLog('🛡️ '+T('Бастион ','Bastion ')+T('кончился','ended'),'hit');
 }
 if(avatarTurns>0){
   avatarTurns--;
   if(avatarTurns==0 && window.VB) window.VB.addLog('👑 '+T('Аватар ','Avatar ')+T('неуязв','invuln')+' '+T('кончился','ended'),'hit');
 }
 if(avatarDmgTurns>0){
   avatarDmgTurns--;
   if(avatarDmgTurns==0 && window.VB){
     window.VB.addLog('⚔️ +200% '+T('урон','damage')+' '+T('кончился','ended'),'hit');
     if(avatarHPBonus>0){
       window.VB.hMax = Math.max(100, window.VB.hMax - avatarHPBonus);
       window.VB.hHp = Math.min(window.VB.hHp, window.VB.hMax);
       window.VB.addLog('👑 -'+avatarHPBonus+' HP ('+T('конец аватара','avatar ended')+') → '+window.VB.hHp+'/'+window.VB.hMax,'hit');
       avatarHPBonus=0;
       window.VB.updBars();
     }
   }
 }
 if(window.VB && window.VB.hHp/window.VB.hMax < 0.3 && passiveShield==0 && passiveShieldTurns==0 && !passiveUsed){
   passiveShield = Math.floor(window.VB.hMax*0.15);
   passiveShieldTurns = 4;
   passiveUsed = true;
   window.VB.addLog('🦁 '+SN('Непоколебимая Стена')+'! '+T('Щит ','Shield ')+passiveShield+' 15% HP '+T('на ','for ')+'4'+T('р','r')+' ('+T('1 раз за бой','once per battle')+') DEF+'+getDefBonus()+'%','skill');
 } else if(passiveShieldTurns>0){
   passiveShieldTurns--;
   if(passiveShieldTurns==0){
     if(passiveShield>0 && window.VB) window.VB.addLog('🛡️ '+T('Щит пассива ','Passive shield ')+T('истек ','expired ')+passiveShield,'hit');
     passiveShield=0;
   }
 }
};

})();
