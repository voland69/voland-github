// VOLAND HERO AMETHYST (necro-f-new) - правки предшественника + база
(function(){
const T=(ru,en)=> (typeof volandT==='function' ? volandT(ru,en) : ru);
const SN=(n)=> (typeof volandSkillName==='function' ? volandSkillName(n) : n);
const EN=(e)=> (typeof volandEnemyName==='function' ? volandEnemyName(e) : (e&&e.name||''));
let fearTurns=0, prisonTurns=0, prisonMult=3.0, linkTurns=0, spiritTurns=0, spellCounter=0;
function extraStat(){
 let s=[];
 if(fearTurns>0) s.push('💜'+T('СТРАХ ','FEAR ')+fearTurns+'(-20% DMG '+T('врага','enemy')+')');
 if(prisonTurns>0) s.push('👻'+T('ТЮРЬМА ','PRISON ')+prisonTurns+' x'+prisonMult);
 if(spiritTurns>0) s.push('🔮'+T('ДУХ ','SPIRIT ')+spiritTurns+' (100%+5 '+T('маны','mana')+')');
 if(linkTurns>0) s.push('💀'+T('ЛИНК ','LINK ')+linkTurns+' (30% '+T('отраж','reflect')+'+'+T('хил','heal')+')');
 return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extraStat; },100);

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 let {cur, eDef, activeSkills, rand, addLog, updBars, setEnemyStun}=ctx;
 if(idx===0) return false;
 let sk=activeSkills[idx-1];
 if(!sk) return false;

 if(sk.name.includes('Проклятие Душ')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||3;
   let base=Math.floor(cur.DMG*2.0); base=Math.max(15, base - eDef + rand(-10,10));
   if(Math.random()*100<cur.CRIT) base=Math.floor(base*1.4);
   ctx.eHp=Math.max(0, ctx.eHp-base);
   fearTurns=2; // -20% 2р
   ctx.hMana=Math.min(ctx.hMaxMana, ctx.hMana+5);
   spellCounter++;
   addLog('💜 '+SN(sk.name)+' [200%] → '+base+' + '+T('СТРАХ ','FEAR ')+'-20% 2'+T('р','r')+' +5 '+T('маны','mana'),'skill'); 
   if(spellCounter%3===0){ spiritTurns=3; addLog('🔮 '+SN('Шепот Аметиста')+': '+T('дух ','spirit ')+'3 '+T('раунда ','rounds ')+'100% '+T('урона ','damage ')+'+5 '+T('маны','mana')+'/'+T('раунд','round'),'crit'); }
   updBars(); return true;
 }
 if(sk.name.includes('Тюрьма')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||10;
   setEnemyStun(1); prisonTurns=1; prisonMult=3.0;
   spellCounter++;
   addLog('👻 '+SN(sk.name)+' → '+T('клетка ','cage ')+'1'+T('р','r')+' + '+T('стан ','stun ')+'+ '+T('взрыв ','blast ')+'300% '+T('в конце раунда','at round end'),'skill'); 
   if(spellCounter%3===0){ spiritTurns=3; addLog('🔮 '+SN('Шепот Аметиста')+': '+T('дух ','spirit ')+'3 '+T('раунда','rounds'),'crit'); }
   updBars(); return true;
 }
 if(sk.name.includes('Похищение')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||18;
   linkTurns=4; // линк 4 раунда — 30% отраж + 30% хил
   spellCounter++;
   addLog('💀 '+SN(sk.name)+' → '+T('ЛИНК ','LINK ')+'4'+T('р','r')+' — 30% '+T('отраж ','reflect ')+'+ 30% '+T('хил','heal'),'skill'); 
   if(spellCounter%3===0){ spiritTurns=3; addLog('🔮 '+SN('Шепот Аметиста')+': '+T('дух ','spirit ')+'3 '+T('раунда','rounds'),'crit'); }
   updBars(); return true;
 }
 if(sk.name.includes('Закат')){
   if(ctx.hMana < sk.mana) return false;
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25;
   setEnemyStun(1);
   let total=0;
   for(let i=0;i<5;i++){ let b=Math.floor(cur.DMG*2.0); b=Math.max(15, b - eDef + rand(-10,10)); if(Math.random()*100<cur.CRIT) b=Math.floor(b*1.4); total+=b; ctx.eHp=Math.max(0, ctx.eHp-b); addLog('🌌 '+T('Душа ','Soul ')+(i+1)+' → '+b,'skill'); updBars(); await new Promise(r=>setTimeout(r,80)); if(ctx.eHp<=0) break; } 
   addLog('🌌 '+T('Закат ','Sunset ')+T('всего ','total ')+total+' ['+T('до ','up to ')+'1000%] + '+T('стан','stun'),'skill'); 
   spellCounter++;
   if(spellCounter%3===0){ spiritTurns=3; addLog('🔮 '+SN('Шепот Аметиста')+': '+T('дух ','spirit ')+'3 '+T('раунда','rounds'),'crit'); }
   updBars(); return true;
 }
 return false;
};

window.VOLAND_HERO_ON_TURN_END = function(ctx){
 let {cur, rand, addLog, updBars}=ctx;
 if(prisonTurns>0){ let base=Math.floor(cur.DMG*prisonMult); base=Math.max(15, base - window.VB.eDef + rand(-10,10)); if(Math.random()*100<cur.CRIT) base=Math.floor(base*1.4); ctx.eHp=Math.max(0, ctx.eHp-base); addLog('💥 '+T('Тюрьма ','Prison ')+T('взрывается!','explodes! ')+base+' [300%]','skill'); prisonTurns=0; updBars(); }
 if(spiritTurns>0){ let spDmg=Math.max(10, cur.DMG - window.VB.eDef + rand(-8,8)); ctx.eHp=Math.max(0, ctx.eHp-spDmg); window.VB.hMana=Math.min(window.VB.hMana+5, cur.MANA); addLog('🔮 '+T('Дух ','Spirit ')+spDmg+' +5 '+T('маны','mana')+' ['+spiritTurns+']','skill'); updBars(); }
};

// хук перед атакой врага — тут применяем -20% 
window.VOLAND_HERO_ON_ENEMY_TURN = function(ctx){
 let {addLog}=ctx;
 // страх -20% DMG врага от базы, не стакать
 if(fearTurns>0){
  let orig=window.VB.baseEDmg;
  let reduced=Math.floor(orig*0.80);
  addLog('💜 '+T('Страх: ','Fear: ')+T('урон врага ','enemy damage ')+'-20% ('+orig+'→'+reduced+') ['+fearTurns+']','hit');
  window.VB.eDmg = reduced;
 }
 return false; // не скипаем ход врага
};

// мгновенный отраж+хил сразу после удара врага
window.VOLAND_HERO_ON_ENEMY_HIT = function(ctx){
 if(linkTurns>0 && ctx.dmgToHero>0){
  let refl=Math.floor(ctx.dmgToHero*0.3);
  let heal=Math.floor(ctx.dmgToHero*0.3);
  window.VB.eHp=Math.max(0, window.VB.eHp-refl);
  window.VB.hHp=Math.min(window.VB.hMax||9999, window.VB.hHp+heal);
  window.VB.addLog('💀 '+T('Линк: ','Link: ')+T('отраж ','reflect ')+refl+' + '+T('хил ','heal ')+heal+' (30% '+T('от ','of ')+ctx.dmgToHero+')','skill');
  window.VB.updBars();
 }
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 // восстанавливаем eDmg после страха
 if(fearTurns>0){ fearTurns--; if(fearTurns==0){ window.VB.addLog('💜 '+T('Страх ','Fear ')+T('кончился','ended'),'hit'); window.VB.eDmg = window.VB.baseEDmg; } }
 if(spiritTurns>0){ spiritTurns--; if(spiritTurns==0) window.VB.addLog('🔮 '+T('Дух ','Spirit ')+T('исчез','vanished'),'hit'); }
 if(linkTurns>0){ 
  linkTurns--; if(linkTurns==0) window.VB.addLog('💀 '+T('Линк ','Link ')+T('кончился','ended'),'hit'); 
 }
};
})();
