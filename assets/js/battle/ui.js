// VOLAND BATTLE UI v1 - render locations, mobs, bars, actions
function getHeroStats(){ const {cur} = volandCalcStats(); return cur; }
function renderHeroStats(){
  const cur = getHeroStats();
  document.getElementById('heroStats').innerHTML = heroData.n + ' • ' + profileName.toUpperCase() + '<br>HP '+cur.HP+' • DMG '+cur.DMG+' • DEF '+cur.DEF+'<br>MANA '+cur.MANA+' • CRIT '+cur.CRIT+'% • '+(cur.PARRY>0 ? 'PARRY '+cur.PARRY+'%' : 'DODGE '+cur.DODGE+'%');
}

function renderLocations(){
  currentLoc = null; currentStage = null;
  document.getElementById('locView').style.display='grid';
  document.getElementById('enemyView').style.display='none';
  document.getElementById('battleView').style.display='none';
  document.getElementById('btnToHero').style.display='block';
  document.getElementById('btnToLocs').style.display='none';
  document.getElementById('mainTitle').textContent='BATTLEFIELD';
  document.getElementById('mainSub').textContent='3 ЛОКАЦИИ • ВЫБЕРИ КУДА ИДТИ • PARRY + IMMUNE + BLOCK';
  const grid = document.getElementById('locView');
  grid.innerHTML = VOLAND_LOCATIONS.filter(l=>l.active).map(l=>`
    <div class="loc-card" onclick="selectLocation(${l.id})">
      <div class="card-num">LOC ${l.id}</div>
      <div class="card-icon">${l.icon}</div>
      <div class="card-name">${l.name}</div>
      <div class="card-desc">${l.type} • 4 моба • клик → мобы</div>
    </div>
  `).join('');
}

function selectLocation(id){
  currentLoc = id;
  const loc = VOLAND_LOCATIONS.find(x=>x.id===id);
  document.getElementById('locView').style.display='none';
  document.getElementById('enemyView').style.display='grid';
  document.getElementById('mainTitle').textContent='BATTLEFIELD • '+(loc?loc.name:'LOC '+id);
  document.getElementById('mainSub').textContent=(loc?loc.name:'')+' • 4 МОБА • КЛИК ПО МОБУ = БОЙ';
  document.getElementById('btnToHero').style.display='none';
  document.getElementById('btnToLocs').style.display='block';
  const enemies = VOLAND_ENEMIES[id] || [];
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

function backToLocations(){ hideVictory(); renderLocations(); logChat('Возврат к локациям'); }
function backToHero(){ location.href='./page3.html'; }

function clearBattleLog(){ document.getElementById('battleLog').innerHTML=''; if (battle) battle.log=[]; }
function addBattleLog(text, type){
  const div = document.createElement('div'); div.className='log-line '+(type||'sys'); div.textContent=text;
  document.getElementById('battleLog').appendChild(div);
  document.getElementById('battleLog').scrollTop=9999;
  if (battle) battle.log.push({text, type});
}

function renderBattleUI(){
  if (!battle) return;
  const hPct = Math.max(0, Math.floor(battle.hero.hp / battle.hero.maxHp * 100));
  const ePct = Math.max(0, Math.floor(battle.enemy.hp / battle.enemy.maxHp * 100));
  const mPct = Math.max(0, Math.floor(battle.hero.mana / battle.hero.maxMana * 100));
  document.getElementById('hHpBar').style.width = hPct + '%';
  document.getElementById('hHpBar').textContent = Math.max(0,battle.hero.hp) + ' / ' + battle.hero.maxHp;
  document.getElementById('hHpPct').textContent = hPct + '%';
  document.getElementById('hManaBar').style.width = mPct + '%';
  document.getElementById('hManaBar').textContent = battle.hero.mana + ' / ' + battle.hero.maxMana;
  document.getElementById('hManaPct').textContent = mPct + '%';
  document.getElementById('eHpBar').style.width = ePct + '%';
  document.getElementById('eHpBar').textContent = Math.max(0,battle.enemy.hp) + ' / ' + battle.enemy.maxHp;
  document.getElementById('eHpPct').textContent = ePct + '%';
  document.getElementById('heroBox').classList.toggle('active', battle.turn==='hero');
  document.getElementById('enemyBox').classList.toggle('active', battle.turn==='enemy');
}

function renderActions(){
  if (!battle) return;
  const actionsDiv = document.getElementById('actions');
  let html = '';
  html += `<div class="act-btn" onclick="heroAction('attack')"><div class="a-icon">⚔️</div><div class="a-name">АТАКА</div><div class="a-meta">100% урона • без маны</div></div>`;
  for (let i=1;i<battle.hero.skills.length;i++){
    const s = battle.hero.skills[i];
    const sName = s[0]; const sBadge = s[1]; const sIconRaw = s[2][0];
    const cd = battle.hero.cooldowns[i]; const manaCost = battle.hero.manaCosts[i]; const mult = battle.hero.mult[i];
    const isUlt = sBadge==='4';
    const disabled = cd>0 || battle.hero.mana < manaCost || battle.turn!=='hero';
    html += `<div class="act-btn ${isUlt?'ult':''}" ${disabled?'disabled':''} onclick="heroAction('skill', ${i})">
      ${cd>0?`<div class="cooldown">${cd}</div>`:''}
      <div class="a-icon"><img src="${sIconRaw}" style="width:36px;height:36px;border-radius:6px;object-fit:cover" onerror="this.style.display='none'"></div>
      <div class="a-name">${sName} [${sBadge}]</div>
      <div class="a-meta">${Math.round(mult*100)}% урона • ${manaCost} маны • КД ${battle.hero.cdMax[i]}</div>
    </div>`;
  }
  actionsDiv.innerHTML = html;
}

function logChat(msg){ const d=document.createElement('div'); d.className='sys-msg'; d.textContent=msg; document.getElementById('chatBody').appendChild(d); document.getElementById('chatBody').scrollTop=9999; }
