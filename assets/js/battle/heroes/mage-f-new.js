// VOLCANIC mage-f-new - fix2: DoT не бьет в раунд каста, ульта 1 метеор в раунд
(function(){
let spellCounter=0;
let burnTurns=0, burnMult=0.2, burnSkip=false;
let lavaTurns=0, lavaMult=0.5, lavaSkip=false;
let calderaTurns=0, calderaMult=1.0, calderaSkip=false;
let meteorWaveTimer=0, meteorWaveMult=3.0, waveSkip=false;
let judgmentTurns=0, judgmentTick=0, judgmentSkip=false;
let lastCur=null;

function extra(){
  let s=[];
  if(burnTurns>0) s.push('🔥ОЖОГ '+burnTurns);
  if(lavaTurns>0) s.push('🌋ЛАВА '+lavaTurns);
  if(calderaTurns>0) s.push('🌋КАЛЬДЕРА '+calderaTurns);
  if(meteorWaveTimer>0) s.push('☄️ВОЛНА '+meteorWaveTimer);
  if(judgmentTurns>0) s.push('🌋СУД '+judgmentTurns+'/'+(judgmentTick+1));
  s.push('ЗАКЛ:'+spellCounter);
  return s.join(' ');
}
setTimeout(()=>{ if(window.VB) window.VB.extraStat=extra; },100);

window.VOLAND_HERO_USE_SKILL = async function(idx, ctx){
 if(idx===0) return false;
 let {cur, eDef, activeSkills, rand, addLog, updBars}=ctx;
 lastCur=cur;
 let sk=activeSkills[idx-1];
 if(!sk) return false;
 if(ctx.hMana < sk.mana){ addLog('⛔ Не хватает маны!','lose'); return false; }

 let effDef = eDef;
 let baseMult = sk.dmgPct ? sk.dmgPct/100 : 1.5;
 let mult = baseMult;

 if(sk.name.includes('Огненный') || sk.name.includes('Шар')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||4;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - effDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.4);
   ctx.eHp = Math.max(0, ctx.eHp - base);
   burnTurns = 2; // 2 тика, начиная со след раунда
   burnMult = 0.2;
   burnSkip = true;
   spellCounter++;
   addLog('🔥 '+sk.name+' ['+Math.round(mult*100)+'%] '+base+(isCrit?' CRIT AOE':'')+' + ожог 20% 2р (со след р) закл '+spellCounter,'skill');
   if(spellCounter%4===0){
     calderaTurns=2;
     calderaSkip=true;
     addLog('🌋 Сердце Кальдеры! Земля горит 100% 2р (со след р)','skill');
   }
   updBars(); return true;
 }

 if(sk.name.includes('Извержение')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||12;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - effDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.4);
   ctx.eHp = Math.max(0, ctx.eHp - base);
   lavaTurns = 3;
   lavaMult = 0.5;
   lavaSkip = true;
   spellCounter++;
   addLog('💥 '+sk.name+' ['+Math.round(mult*100)+'%] '+base+(isCrit?' CRIT':'')+' + лава 50% 3р (со след р) закл '+spellCounter,'skill');
   if(spellCounter%4===0){
     calderaTurns=2;
     calderaSkip=true;
     addLog('🌋 Сердце Кальдеры! Земля горит 100% 2р (со след р)','skill');
   }
   updBars(); return true;
 }

 if(sk.name.includes('Метеор') && !sk.name.includes('Судный')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||20;
   let base = Math.max(10, Math.floor(cur.DMG*mult) - effDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.4);
   ctx.eHp = Math.max(0, ctx.eHp - base);
   meteorWaveTimer = 1;
   meteorWaveMult = 3.0;
   waveSkip = true;
   spellCounter++;
   addLog('☄️ '+sk.name+' ['+Math.round(mult*100)+'%] '+base+(isCrit?' CRIT':'')+' + волна 300% след р закл '+spellCounter,'skill');
   if(spellCounter%4===0){
     calderaTurns=2;
     calderaSkip=true;
     addLog('🌋 Сердце Кальдеры! Земля горит 100% 2р (со след р)','skill');
   }
   updBars(); return true;
 }

 if(sk.name.includes('Судный') || sk.name.includes('День')){
   ctx.hMana-=sk.mana; ctx.cooldowns[idx]=sk.cd||25;
   let firstMult = 2.0;
   let base = Math.max(10, Math.floor(cur.DMG*firstMult) - effDef + rand(-10,10));
   let isCrit = Math.random()*100 < cur.CRIT;
   if(isCrit) base = Math.floor(base*1.4);
   ctx.eHp = Math.max(0, ctx.eHp - base);
   judgmentTurns = 3;
   judgmentTick = 1;
   judgmentSkip = true; // пропуск тика в раунд каста, 1 метеор в раунд
   spellCounter++;
   addLog('🌋 '+sk.name+' метеор 1/4 ['+Math.round(firstMult*100)+'%] '+base+(isCrit?' CRIT':'')+' + еще 3 метеора (по 1 в раунд) закл '+spellCounter,'skill');
   if(spellCounter%4===0){
     calderaTurns=2;
     calderaSkip=true;
     addLog('🌋 Сердце Кальдеры! Земля горит 100% 2р (со след р)','skill');
   }
   updBars(); return true;
 }

 return false;
};

window.VOLAND_HERO_ON_ROUND_END = function(){
 let cur = lastCur || (window.VB && window.VB.cur);
 if(!cur) return;

 // Ожог - не бьет в раунд каста
 if(burnTurns>0){
   if(burnSkip){ burnSkip=false; }
   else {
     let base = Math.max(5, Math.floor(cur.DMG*burnMult) + (Math.floor(Math.random()*11)-5));
     if(Math.random()*100 < cur.CRIT) base = Math.floor(base*1.4);
     window.VB.eHp = Math.max(0, window.VB.eHp - base);
     window.VB.addLog('🔥 Ожог ['+Math.round(burnMult*100)+'%] '+base+' ['+burnTurns+'р]','skill');
     window.VB.updBars();
     burnTurns--;
     if(burnTurns==0) window.VB.addLog('🔥 Ожог кончился','hit');
   }
 }

 if(lavaTurns>0){
   if(lavaSkip){ lavaSkip=false; }
   else {
     let base = Math.max(5, Math.floor(cur.DMG*lavaMult) + (Math.floor(Math.random()*11)-5));
     if(Math.random()*100 < cur.CRIT) base = Math.floor(base*1.4);
     window.VB.eHp = Math.max(0, window.VB.eHp - base);
     window.VB.addLog('🌋 Лава ['+Math.round(lavaMult*100)+'%] '+base+' ['+lavaTurns+'р]','skill');
     window.VB.updBars();
     lavaTurns--;
     if(lavaTurns==0) window.VB.addLog('🌋 Лава остыла','hit');
   }
 }

 if(calderaTurns>0){
   if(calderaSkip){ calderaSkip=false; }
   else {
     let base = Math.max(10, Math.floor(cur.DMG*calderaMult) + (Math.floor(Math.random()*11)-5));
     if(Math.random()*100 < cur.CRIT) base = Math.floor(base*1.4);
     window.VB.eHp = Math.max(0, window.VB.eHp - base);
     window.VB.addLog('🌋 Кальдера ['+Math.round(calderaMult*100)+'%] '+base+' ['+calderaTurns+'р]','skill');
     window.VB.updBars();
     calderaTurns--;
     if(calderaTurns==0) window.VB.addLog('🌋 Кальдера остыла','hit');
   }
 }

 if(meteorWaveTimer>0){
   if(waveSkip){ waveSkip=false; }
   else {
     meteorWaveTimer--;
     if(meteorWaveTimer==0){
       let eDef = window.VB ? window.VB.eDef : 10;
       let base = Math.max(10, Math.floor(cur.DMG*meteorWaveMult) - eDef + (Math.floor(Math.random()*21)-10));
       if(Math.random()*100 < cur.CRIT) base = Math.floor(base*1.4);
       window.VB.eHp = Math.max(0, window.VB.eHp - base);
       window.VB.addLog('☄️ Метеор волна ['+Math.round(meteorWaveMult*100)+'%] '+base,'skill');
       window.VB.updBars();
     }
   }
 }

 if(judgmentTurns>0){
   if(judgmentSkip){ judgmentSkip=false; }
   else {
     judgmentTick++;
     let isLast = judgmentTick==4;
     let mult = isLast ? 4.0 : 2.0;
     let eDef = window.VB ? window.VB.eDef : 10;
     let base = Math.max(10, Math.floor(cur.DMG*mult) - eDef + (Math.floor(Math.random()*21)-10));
     if(Math.random()*100 < cur.CRIT) base = Math.floor(base*1.4);
     window.VB.eHp = Math.max(0, window.VB.eHp - base);
     window.VB.addLog('🌋 Судный День метеор '+judgmentTick+'/4 ['+Math.round(mult*100)+'%] '+base,'skill');
     window.VB.updBars();
     if(isLast){
       lavaTurns = 2;
       lavaMult = 0.5;
       lavaSkip = true;
       window.VB.addLog('🌋 Судный День поджог земли 50% 2р (со след р)','skill');
     }
     judgmentTurns--;
     if(judgmentTurns==0){
       window.VB.addLog('🌋 Судный День кончился','hit');
       judgmentTick=0;
     }
   }
 }
};

})();
