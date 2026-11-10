# VOLAND v2.0 Modular Structure

## Версия
Единый источник — `VOLAND_CONFIG.version` в `assets/js/config.js` (сейчас `2.0`).
`config.js` подключён на всех страницах первым, до файлов базы данных.

## Current (working)
- assets/js/db/ - модули: heroes.js, items.js (650 предметов), locations.js, enemies.js, missions.js (51 миссия), tiers.js, resources.js, starter.js
- assets/js/storage.js - save/load
- assets/js/config.js - constants
- assets/css/battlefield.css - в архиве `_archive/неиспользуемое/`, не подключён ни к одной странице
- assets/js/battle/
  - skills.js - parse mana/cd/mult + applySkillEffect (block, stun, avatar)
  - ui.js - renderLocations, selectLocation, bars (numbers inside), actions, logs
  - engine.js - calcDamage, startBattle, heroAction, enemyTurn


## Future / Archive
- assets/js/loot/ - drop.js (единый ролл лута, модалка = сумка)
- assets/js/progression/ - xp.js, gold.js (level.js в архиве)
- assets/js/battle/skills.js - оставлен, используется
- assets/js/battle/ui.js - оставлен, используется
- _archive/неиспользуемое/ - 12 неиспользуемых файлов: 8 героев battle/heroes, 2 audio, progression/level.js, css/battlefield.css
- Папок assets/data/ и assets/js/ui/ и assets/js/quests/ в архиве нет, не создавать без нужды

## page6
- page6.html is new main 

## What was fixed in this refactor
1. EXIT buttons on loc & mob screens
2. Bars show numbers inside (1563/1950) not %
3. Only 1 button in battle (СБЕЖАТЬ)
4. Victory modal with 2 buttons: БИТЬ СНОВА / К МОБАМ
5. Block 50% + reflect 25% + stun working
