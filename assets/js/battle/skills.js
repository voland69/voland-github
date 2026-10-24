// VOLAND BATTLE SKILLS v3 - AMETHYST + GRAVELORD + DARK RANGER + LION WARDEN
function parseSkillMultiplier(desc){ const m = desc.match(/(\d+)% урона/); if (m) return parseInt(m[1]); return 0; }
function parseManaCost(meta){ const m = meta.match(/Мана:\s*(\d+)/i); return m ? parseInt(m[1]) : 10; }
function parseCooldown(meta){ const m = meta.match(/КД:\s*(\d+)/i); return m ? parseInt(m[1]) : 3; }

function applySkillEffect(sName, battle){
 // LION WARDEN
 if (sName.includes('Удар Льва')){
  battle.enemy.stunned = 1;
  addBattleLog('💫 ' + battle.enemy.name + ' оглушен Ударом Льва на 1 раунд!', 'crit');
 }
 if (sName.includes('Имперский Бастион') || sName.includes('Бастион')){
  battle.hero.block = 0.5;
  battle.hero.blockTurns = 3;
  battle.hero.reflect = 0.25;
  battle.hero.reflectTurns = 3;
  addBattleLog('🛡 Имперский Бастион: блок 50% 3 раунда + отражение 25%!', 'crit');
 }
 if (sName.includes('Аватар Империи')){
  const hpAdd = Math.floor(battle.hero.baseMaxHp * 0.5);
  battle.hero.hpBuff = hpAdd;
  battle.hero.maxHp = battle.hero.baseMaxHp + hpAdd;
  battle.hero.hp += hpAdd;
  battle.hero.hpBuffTurns = 3;
  addBattleLog('👑 Аватар Империи: +50% HP на 3 раунда!', 'crit');
 }

 // AMETHYST
 if (sName.includes('Проклятие Душ')){
  battle.enemy.dmgDebuff = 0.15;
  battle.enemy.dmgDebuffTurns = 4;
  battle.hero.mana += 5;
  addBattleLog('💜 Проклятие Душ: -15% урона врага 4 хода +5 маны', 'crit');
 }
 if (sName.includes('Аметистовая Тюрьма')){
  battle.enemy.stunned = 1;
  battle.enemy.prisonTurns = 1;
  battle.enemy.prisonMult = 3.0;
  addBattleLog('👻 Тюрьма: клетка 1 раунд + взрыв 300% в конце раунда', 'crit');
 }
 if (sName.includes('Похищение Жизни')){
  battle.hero.linkTurns = 4;
  battle.hero.linkReflect = 0.3;
  battle.hero.linkHeal = 0.3;
  addBattleLog('💀 Похищение Жизни: линк 4 раунда — 30% отраж + 30% хил', 'crit');
 }
 if (sName.includes('Аметистовый Закат')){
  battle.enemy.stunned = 1;
  addBattleLog('🌌 Аметистовый Закат: 5 душ по 200% (до 1000%) + стан', 'crit');
 }

 // GRAVELORD
 if (sName.includes('Костяное Копье')){
  battle.enemy.boneVulnTurns = 2;
  battle.enemy.boneVulnMult = 0.25;
  addBattleLog('🦴 Костяное Копье: +25% урон саммонов 2 хода', 'crit');
 }
 if (sName.includes('Костяной Щит')){
  battle.hero.boneShield = Math.floor(battle.hero.maxHp*0.2);
  addBattleLog('🛡️ Костяной Щит: щит 20% HP + взрыв 300% при разрушении', 'crit');
 }
 if (sName.includes('Поднять Мертвых')){
  battle.hero.bomber1 = 1;
  battle.hero.bomber2 = 2;
  addBattleLog('💣 Поднять Мертвых: 2 бомбера 200% и 300%', 'crit');
 }
 if (sName.includes('Армия Погибели') || sName.includes('Могильный Пакт')){
  battle.hero.armyTurns = 3;
  battle.hero.armyCount = 5;
  addBattleLog('💀 Армия Погибели: 5 скелетов 3 раунда по 50% урона', 'crit');
 }

 // DARK RANGER
 if (sName.includes('Беглый выстрел')){
  if(battle.enemy.shadowMarkTurns>0){
    addBattleLog('🏹 Беглый выстрел +100% метка', 'crit');
  }
 }
 if (sName.includes('Шаг в Ничто')){
  battle.hero.invisTurns = 3;
  battle.hero.invisCrit = true;
  addBattleLog('🌑 Шаг в Ничто: инвиз 3 раунда + гарант крит', 'crit');
 }
 if (sName.includes('Призрачная Стрела')){
  if(Math.random()<0.33){
    battle.enemy.stunned=1;
    addBattleLog('💫 Призрачная Стрела: стан 1 раунд!', 'crit');
  }
 }
 if (sName.includes('Залп Бездны')){
  addBattleLog('🌌 Залп Бездны: 7 стрел по 100% (700% в одну)', 'crit');
 }
 // пассивка Метка Тени - каждая 4-я атака на 2 раунда +100%
 if (battle.hero.attackCounter!==undefined){
   battle.hero.attackCounter++;
   if(battle.hero.attackCounter%4==0){
     battle.enemy.shadowMarkTurns=2;
     addBattleLog('👁️ Метка Тени: +100% урона 2 раунда', 'crit');
   }
 }
 // пассивка Легион
 if (battle.hero.legionCount!==undefined && battle.hero.legionCount < 3){
  battle.hero.legionCount = (battle.hero.legionCount||0)+1;
  addBattleLog('🦴 Легион: скелет '+(battle.hero.legionCount)+'/3', 'crit');
 }

 // Пассивка AMETHYST
 if (battle.hero.spellCount && battle.hero.spellCount % 3 === 0){
  battle.hero.spiritTurns = 3;
  addBattleLog('🔮 Шепот Аметиста: дух 3 раунда 100% урона +5 маны/раунд', 'crit');
 }
}
