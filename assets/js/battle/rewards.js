// VOLAND REWARDS & MODALS v3 - fixed to use VOLAND_ENEMIES gold/xp
function showVictory(isWin){
  const modal = document.getElementById('victoryModal');
  const box = document.getElementById('victoryBox');
  const title = document.getElementById('vTitle');
  const sub = document.getElementById('vSub');
  const trophy = document.getElementById('vTrophy');
  const goldEl = document.getElementById('vGold');
  const xpEl = document.getElementById('vXp');
  const lootEl = document.getElementById('vLoot');
  const goldBonus = document.getElementById('vGoldBonus');
  const xpBonus = document.getElementById('vXpBonus');
  if (isWin){
    box.classList.remove('defeat');
    trophy.textContent='🏆';
    title.textContent='¡VICTORIA!';
    sub.textContent='Has triunfado en el combate • ' + (lastEnemyData?lastEnemyData.name:'');
    // FIXED: берем из db, а не формулой
    let baseGold = (lastEnemyData && lastEnemyData.gold) ? parseInt(lastEnemyData.gold) : ((currentStage||1)*5 + (currentLoc||1)*2);
    let baseXp = (lastEnemyData && lastEnemyData.xp) ? parseInt(lastEnemyData.xp) : ((currentStage||1)*50 + (currentLoc||1)*20);
    goldEl.textContent='+'+baseGold;
    xpEl.textContent='+'+baseXp.toLocaleString('es-ES');
    // дроп ресурсов
    let resCount = 0;
    try{
      if(lastEnemyData && Array.isArray(lastEnemyData.drops)){
        lastEnemyData.drops.forEach(d=>{
          if(Math.random() < (d.chance||0)){
            if(typeof volandAddResource==='function') volandAddResource(d.id, 1);
            resCount++;
          }
        });
      }
      if(lastEnemyData && lastEnemyData.equipChance && Math.random() < lastEnemyData.equipChance){
        if(typeof VOLAND_ITEMS!=='undefined' && typeof volandAddToInventory==='function'){
          let pool = VOLAND_ITEMS.filter(it=>it.slot);
          if(pool.length>0){
            let pick = pool[Math.floor(Math.random()*pool.length)];
            volandAddToInventory(pick.id);
          }
        }
      }
    }catch(e){}
    lootEl.textContent = resCount>0 ? String(resCount) : (lastEnemyData&&lastEnemyData.boss?'1':'0');
    if(goldBonus) goldBonus.textContent='+0';
    if(xpBonus) xpBonus.textContent='+0';
    if (window.volandAddXp) volandAddXp(baseXp);
    if (window.volandAddGold) volandAddGold(baseGold);
    try{ if(typeof volandAddKill==='function') volandAddKill(); }catch(e){}
    try{
      if(typeof volandUpdateMissionStat==='function'){
        volandUpdateMissionStat('kill_mob', currentLoc, 1);
        if(lastEnemyData && lastEnemyData.boss){
          volandUpdateMissionStat('kill_boss', null, 1);
          volandUpdateMissionStat('kill_boss_diff', null, currentLoc+'-'+currentStage);
        }
        if(typeof volandCheckMissions==='function') volandCheckMissions();
      }
    }catch(e){}
  } else {
    box.classList.add('defeat');
    trophy.textContent='💀';
    title.textContent='DERROTA';
    sub.textContent='Ты пал в бою против ' + (lastEnemyData?lastEnemyData.name:'врага');
    goldEl.textContent='+0';
    xpEl.textContent='+0';
    lootEl.textContent='0';
    if(goldBonus) goldBonus.textContent='+0';
    if(xpBonus) xpBonus.textContent='+0';
  }
  modal.classList.add('show');
}
function hideVictory(){ document.getElementById('victoryModal').classList.remove('show'); }
function fightAgain(){
  hideVictory();
  if (currentLoc && currentStage){ startBattle(currentStage); }
}
function continueToMobs(){
  hideVictory();
  closeBattle();
}
function closeBattle(){
  hideVictory();
  document.getElementById('battleView').style.display='none';
  document.getElementById('enemyView').style.display='grid';
  document.getElementById('btnToHero').style.display='none';
  document.getElementById('btnToLocs').style.display='block';
  document.getElementById('mainTitle').textContent = 'BATTLEFIELD • '+(VOLAND_LOCATIONS.find(x=>x.id===currentLoc)?.name||'');
  document.getElementById('mainSub').textContent = 'ВЫБЕРИ МОБА • PARRY + IMMUNE + BLOCK';
  battle = null; 
  if (currentLoc) {
    const enemies = VOLAND_ENEMIES[currentLoc];
    if (enemies) {
      const grid = document.getElementById('enemyView');
      grid.innerHTML = enemies.map(e=>`
        <div class="loc-card ${e.boss?'boss':''}" onclick="startBattle(${e.stage})">
          <div class="card-num">STAGE ${e.stage}</div>
          <div class="card-lvl">${e.lvl}</div>
          <div class="card-icon">${e.icon}</div>
          <div class="card-name">${e.name}</div>
          <div class="card-reward">+${e.gold} GOLD • +${e.xp} XP</div>
        </div>
      `).join('');
    }
  }
}
