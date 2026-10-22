# VOLAND v2 Modular Structure

## Current (working)
- assets/js/db.js - heroes, items, locations, enemies
- assets/js/storage.js - save/load
- assets/js/config.js - constants
- assets/css/battlefield.css - all battle styles
- assets/js/battle/
  - skills.js - parse mana/cd/mult + applySkillEffect (block, stun, avatar)
  - ui.js - renderLocations, selectLocation, bars (numbers inside), actions, logs
  - engine.js - calcDamage, startBattle, heroAction, enemyTurn
  - rewards.js - victory modal ¡VICTORIA! + 2 buttons (fight again / to mobs)

- assets/js/ui/
  - modal.js - generic show/hide
  - bars.js - setBar helper

## Future (folders ready, empty)
- assets/js/quests/ - daily, boss, location quests
- assets/js/loot/ - drop.js, chest.js
- assets/js/progression/ - xp.js, gold.js, level.js
- assets/js/audio/ - sfx.js, music.js
- assets/data/locations/ - json per location
- assets/data/enemies/ - json per location
- assets/data/items/ - weapons, armor etc

## page6
- page6_modular.html is new main (120 lines only, was 600)
- Old page6_FINAL.html kept as backup

## What was fixed in this refactor
1. EXIT buttons on loc & mob screens
2. Bars show numbers inside (1563/1950) not %
3. Only 1 button in battle (СБЕЖАТЬ)
4. Victory modal with 2 buttons: БИТЬ СНОВА / К МОБАМ
5. Block 50% + reflect 25% + stun working
