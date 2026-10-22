// VOLAND REWARDS & MODALS v1 - victory screen like ¡VICTORIA!
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
    const baseGold = (currentStage||1)*20 + (currentLoc||1)*10 + (lastEnemyData&&lastEnemyData.boss?100:0);
    const baseXp = (currentStage||1)*500 + (currentLoc||1)*200 + (lastEnemyData&&lastEnemyData.boss?2000:0);
    goldEl.textContent='+'+baseGold;
    xpEl.textContent='+'+baseXp.toLocaleString('es-ES');
    lootEl.textContent=(lastEnemyData&&lastEnemyData.boss?'1':'0');
    goldBonus.textContent='+'+Math.floor(baseGold*0.05)+' (5%)';
    xpBonus.textContent='+'+Math.floor(baseXp*0.26)+' (26%)';
    if (window.volandAddXp) volandAddXp(baseXp);
    if (window.volandAddGold) volandAddGold(baseGold);
  } else {
    box.classList.add('defeat');
    trophy.textContent='💀';
    title.textContent='DERROTA';
    sub.textContent='Ты пал в бою против ' + (lastEnemyData?lastEnemyData.name:'врага');
    goldEl.textContent='+0';
    xpEl.textContent='+0';
    lootEl.textContent='0';
    goldBonus.textContent='+0';
    xpBonus.textContent='+0';
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
          <div class="card-desc">${e.desc}</div>
          <div class="card-hp"><div class="card-hp-fill" style="width:${e.hp}%; background:${e.boss?'linear-gradient(90deg,#8a6a1a,#d0b040)':''}; background-color:${e.hpColor}"></div></div>
        </div>
      `).join('');
    }
  }
  logChat('Возврат к выбору мобов');
}
function runBattle(){
  if (battle){ addBattleLog('Ты сбежал из боя с ' + battle.enemy.name, 'sys'); logChat('Сбежал из боя Stage '+battle.enemy.stage); }
  closeBattle();
}
