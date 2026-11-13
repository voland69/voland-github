# VOLAND V2 - Modular Structure

## Версия V2
Единый источник — `VOLAND_CONFIG.version` в `assets/js/config.js` (сейчас `2.0`, V2).
`config.js` подключён на всех страницах первым, до файлов базы данных.

## Current (working) V2
- assets/js/db/ - модули: heroes.js, items.js (650 предметов), locations.js, enemies.js, missions.js (51 миссия), tiers.js, resources.js, starter.js
- assets/js/storage.js - save/load, канон скидки гильдии: volandGetGuildDiscount / volandGetDiscountedBuy / volandGuildDiscountLabel
- assets/js/config.js - constants, версия V2
- assets/css/nav.css - единый навбар для page3-page14
- assets/js/nav.js - единый навбар для page3-page14, строит разметку и ставит active
- assets/js/battle/engine.js - PvE бой, parseSkill с мульти-ударом, каждый удар отдельно, единственный вызов volandRollDrops
- assets/js/battle/pvp-engine.js - PvP бой, мульти-удар каждый удар отдельно
- assets/js/battle/heroes/ - 8 хуков героев, мульти-удар каждый удар отдельно
- assets/js/loot/drop.js - единый ролл лута, модалка = сумка

## Pages V2
- index.html - Entry, 3 save slots
- page2.html - Hero select (8 heroes)
- page3.html - Hero stats
- page4.html - Inventory / Bag
- page5.html - Skills
- page6.html - Battlefield, выбор локации, 6 активных
- page7.html - Stages, выбор моба в локации, 4 стадии
- page8.html - Battle, бой с логом
- page9.html - Missions (51 missions)
- page10.html - Market
- page11.html - PvP Arena
- page12.html - Workshop
- page13.html - Pass
- page14.html - Guild

## Page flow V2
- page6 Battlefield -> выбор локации -> page7 Stages -> выбор моба -> page8 Battle -> бой
- page7 и page8 подсвечивают BATTLE (page6) в навбаре, потому что это подшаги боя, а не отдельные разделы

## What was fixed in V2
1. EXIT buttons on loc & mob screens
2. Bars show numbers inside (1563/1950) not %
3. Only 1 button in battle (СБЕЖАТЬ)
4. Victory modal with 2 buttons: БИТЬ СНОВА / К МОБАМ
5. Block 50% + reflect 25% + stun working
6. Multi-hit V2: каждый удар отдельно, свой крит, свой DEF, свой лог, стоп если враг умер
7. GRAVELORD: PARRY 8%, DODGE 0%
8. Skeleton Legionnaire: опечатка Liegionnaire исправлена
