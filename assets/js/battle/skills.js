// VOLAND BATTLE SKILLS v1 - skill parsing & effects
function parseSkillMultiplier(desc){ const m = desc.match(/(\d+)% урона/); if (m) return parseInt(m[1]); return 0; }
function parseManaCost(meta){ const m = meta.match(/Мана:\s*(\d+)/i); return m ? parseInt(m[1]) : 10; }
function parseCooldown(meta){ const m = meta.match(/КД:\s*(\d+)/i); return m ? parseInt(m[1]) : 3; }
function applySkillEffect(sName, battle){
 if (sName.includes('Удар Льва')){
  battle.enemy.stunned = 1;
  addBattleLog('💫 ' + battle.enemy.name + ' оглушен Ударом Льва на 1 раунд!', 'crit');
 }
 if (sName.includes('Имперский Бастион') || sName.includes('Бастион')){
  battle.hero.block = 0.5;
  battle.hero.blockTurns = 3;
  battle.hero.reflect = 0.25;
  battle.hero.reflectTurns = 3;
  addBattleLog('🛡 Имперский Бастион: блок 50% урона 3 раунда + отражение 25%!', 'crit');
 }
 if (sName.includes('Аватар Империи')){
  const hpAdd = Math.floor(battle.hero.baseMaxHp * 0.5);
  battle.hero.hpBuff = hpAdd;
  battle.hero.maxHp = battle.hero.baseMaxHp + hpAdd;
  battle.hero.hp += hpAdd;
  battle.hero.hpBuffTurns = 3;
  addBattleLog('👑 Аватар Империи: +50% HP на 3 раунда!', 'crit');
 }
 // AMETHYST - Похищение Жизни
 if (sName.includes('Похищение Жизни')){
  battle.hero.linkTurns = 4;
  battle.hero.linkReflect = 0.3;
  battle.hero.linkHeal = 0.3;
  addBattleLog('💀 Похищение Жизни: линк 4 раунда — 30% отраж + 30% хил', 'crit');
 }
 // AMETHYST - Проклятие Душ
 if (sName.includes('Проклятие Душ')){
  battle.enemy.dmgDebuff = 0.15;
  battle.enemy.dmgDebuffTurns = 4;
  addBattleLog('💜 Проклятие Душ: -15% урона врага на 4 раунда', 'crit');
 }
 // AMETHYST - Аметистовая Тюрьма
 if (sName.includes('Аметистовая Тюрьма')){
  battle.enemy.stunned = 1;
  battle.enemy.prisonTurn = 1;
  battle.enemy.prisonDmg = 3.0;
  addBattleLog('👻 Аметистовая Тюрьма: стан 1 раунд + взрыв 300% в конце', 'crit');
 }
}
