// LION WARDEN warrior-m - fix2: bastion 50% block correctly with DEF, duration 3r, reflect 25% of original
(function(){
let bastionTurns=0;
let avatarTurns=0;
let avatarDmgTurns=0;
let avatarHPBonus=0;
let passiveShield=0;
let passiveShieldTurns=0;
let lastCur=null;

function extra(){
  let s=[];
  if(bastionTurns>0) s.push('🛡️БАСТИОН '+bastionTurns+' 50%');
  if(avatarTurns>0) s.push('👑АВАТАР '+avatarTurns+' неуязв');
  if(avatarDmgTurns>0) s.push('⚔️+200% '+avatarDmgTurns);
  if(passiveShield>0) s.push('🛡️ЩИТ '+passiveShield+' '+passiveShieldTurns+'р');
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
   addLog('⚔️ Атака '+base+(mult>1?' ['+Math.round(mult*100)+'% +200% аватар]':'')+(isCrit?' CRIT':''),'hit');
   ctx.cooldowns[0]=1;
   updBars(); return true;
 }

 if(!sk) return false;
 if(ctx.hMana < sk.mana){ addLog('⛔ Не хватает маны!','lose'); return false; }

 if(sk.name.includes('Льва')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||8;
   let mult = 2.0;
   if(avatarDmgTurns>0) mult += 2.0;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.4);
   ctx.eHp = Math.max(0, ctx.eHp - base);
   setEnemyStun(1);
   addLog('⚔️ Удар Льва '+base+' ['+Math.round(mult*100)+'%'+(avatarDmgTurns>0?' +200% аватар':'')+'] стан 1р'+(isCrit?' CRIT':''),'skill');
   updBars(); return true;
 }

 if(sk.name.includes('Бастион')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||15;
   bastionTurns = 3; // ровно 3р блока
   addLog('🛡️ Имперский Бастион щит 3р блок 50% отраж 25%','skill');
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
   addLog('📯 Рассекающий удар '+base+' ['+Math.round(mult*100)+'%'+(avatarDmgTurns>0?' +200% аватар':'')+']'+(isCrit?' CRIT':''),'skill');
   updBars(); return true;
 }

 if(sk.name.includes('Аватар')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||35;
   let aoeMult = 2.0;
   let aoe = Math.max(10, Math.floor(cur.DMG*aoeMult) - eDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) aoe = Math.floor(aoe*1.4);
   ctx.eHp = Math.max(0, ctx.eHp - aoe);
   addLog('👑 Аватар Империи AOE всем '+aoe+' [200%]'+(isCrit?' CRIT':''),'skill');
   avatarTurns = 2; // неуязв 2р
   avatarDmgTurns = 3; // +300% 3р
   if(avatarHPBonus==0){
     avatarHPBonus = Math.floor(window.VB.hMax*0.5);
     window.VB.hMax = window.VB.hMax + avatarHPBonus;
     window.VB.hHp = window.VB.hHp + avatarHPBonus;
     addLog('👑 +50% HP +'+avatarHPBonus+' → HP '+window.VB.hHp+'/'+window.VB.hMax+' неуязв 2р +200% урон 3р','skill');
   } else {
     addLog('👑 Аватар уже активен неуязв '+avatarTurns+'р +300% '+avatarDmgTurns+'р','skill');
   }
   updBars(); return true;
 }

 return false;
};

window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 // Аватар неуязв 2р
 if(avatarTurns>0){
   ctx.addLog('👑 Аватар неуязвим! ['+avatarTurns+'р]','skill');
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
     ctx.addLog('🛡️ Щит пассива поглотил '+absorbed+' осталось '+passiveShield,'skill');
     if(passiveShield<=0){
       passiveShield=0;
       passiveShieldTurns=0;
       ctx.addLog('🛡️ Щит пассива сломан','hit');
     }
   }
   window.VB.hHp = Math.max(0, window.VB.hHp - blocked);
   window.VB.eHp = Math.max(0, window.VB.eHp - refl);
   ctx.addLog('🛡️ Бастион блок 50% '+blocked+' (из '+origDmg+') отраж '+refl+' [25%] DEF+'+defBonus+'%','skill');
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
   ctx.addLog('🛡️ Щит пассива блок '+absorbed+' урон '+remaining+' DEF+'+defBonus+'%','skill');
   if(passiveShield<=0){
     passiveShield=0;
     passiveShieldTurns=0;
     ctx.addLog('🛡️ Щит пассива сломан','hit');
   }
   ctx.updBars();
   return true;
 }
 return false;
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 if(bastionTurns>0){
   bastionTurns--;
   if(bastionTurns==0 && window.VB) window.VB.addLog('🛡️ Бастион кончился','hit');
 }
 if(avatarTurns>0){
   avatarTurns--;
   if(avatarTurns==0 && window.VB) window.VB.addLog('👑 Аватар неуязв кончился','hit');
 }
 if(avatarDmgTurns>0){
   avatarDmgTurns--;
   if(avatarDmgTurns==0 && window.VB){
     window.VB.addLog('⚔️ +200% урон кончился','hit');
     if(avatarHPBonus>0){
       window.VB.hMax = Math.max(100, window.VB.hMax - avatarHPBonus);
       window.VB.hHp = Math.min(window.VB.hHp, window.VB.hMax);
       window.VB.addLog('👑 -'+avatarHPBonus+' HP (конец аватара) → '+window.VB.hHp+'/'+window.VB.hMax,'hit');
       avatarHPBonus=0;
       window.VB.updBars();
     }
   }
 }
 if(window.VB && window.VB.hHp/window.VB.hMax < 0.3 && passiveShield==0 && passiveShieldTurns==0){
   passiveShield = Math.floor(window.VB.hMax*0.15);
   passiveShieldTurns = 4;
   window.VB.addLog('🦁 Непоколебимая Стена! Щит '+passiveShield+' 15% HP на 4р DEF+'+getDefBonus()+'%','skill');
 }
 if(passiveShieldTurns>0){
   passiveShieldTurns--;
   if(passiveShieldTurns==0){
     if(passiveShield>0 && window.VB) window.VB.addLog('🛡️ Щит пассива истек '+passiveShield,'hit');
     passiveShield=0;
   }
 }
};

})();
