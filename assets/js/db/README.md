# VOLAND DB Modular

Split from monolithic db.js (250kb) into:

- heroes.js - 8 героев
- tiers.js - тиры, цвета, множители, типы шмота
- resources.js - ресурсы (quartz, wood и тд)
- items.js - 650 предметов + upgrade costs
- locations.js - 8 локаций
- enemies.js - мобы по локациям
- missions.js - 22 миссии
- starter.js - стартовый шмот, оружие по классу, зелья

Порядок загрузки важен:
1. heroes
2. tiers
3. resources
4. items
5. starter (зависит от items)
6. locations
7. enemies
8. missions

В HTML подключать 8 файлов вместо одного db.js
