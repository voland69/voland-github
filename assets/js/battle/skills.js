// VOLAND BATTLE SKILLS v1 - skill parsing & effects
function parseSkillMultiplier(desc){ const m = desc.match(/(\d+)% урона/); if (m) return parseInt(m[1])/100; return 2; }
function parseManaCost(meta){ const m = meta.match(/Мана:\s*(\d+)/i); return m ? parseInt(m[1]) : 10; }
function parseCooldown(meta){ const m = meta.match(/КД:\s*(\d+)/i); return m ? parseInt(m[1]) : 3; }
function applySkillEffect(sName, battle){
  if (sName.includes('Удар Льва')){
    battle.enemy.stunned = 1;
    addBattleLog('🌀 ' + battle.enemy.name + ' оглушен Ударом Льва на 1 раунд!', 'crit');
  }
  if (sName.includes('Имперский Бастион') || sName.includes('Бастион')){
    battle.hero.block = 0.5;
    battle.hero.blockTurns = 3;
    battle.hero.reflect = 0.25;
    battle.hero.reflectTurns = 3;
    addBattleLog('🛡️ Имперский Бастион: блок 50% урона 3 раунда + отражение 25%!', 'crit');
  }
  if (sName.includes('Аватар Империи')){
    const hpAdd = Math.floor(battle.hero.baseMaxHp * 0.5);
    battle.hero.hpBuff = hpAdd;
    battle.hero.maxHp = battle.hero.baseMaxHp + hpAdd;
    battle.hero.hp += hpAdd;
    battle.hero.hpBuffTurns = 3;
    battle.hero.immune = 2;
    battle.hero.dmgBuff = 3;
    battle.hero.dmgBuffTurns = 3;
    battle.hero.dmg = battle.hero.baseDmg * (1 + battle.hero.dmgBuff);
    addBattleLog('🛡️ ' + battle.hero.name + ' Аватар Империи: +50% HP ['+battle.hero.baseMaxHp+' → '+battle.hero.maxHp+'] • Неуязвим 2 раунда • +300% урона 3 раунда!', 'crit');
  }
  if (sName.includes('Зов Стаи') || sName.includes('Корни') || sName.includes('Сеть Теней') || sName.includes('Аметистовая Тюрьма')){
    if (!battle.enemy.stunned) {
      battle.enemy.stunned = 1;
      addBattleLog('🌀 ' + battle.enemy.name + ' оглушен скилом ' + sName + '!', 'crit');
    }
  }
}
