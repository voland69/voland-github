# VOLAND V2 - Dark Fantasy RPG

Open source browser RPG. V2.

## Pages
- `index.html` - Entry, 3 save slots
- `page2.html` - Hero select (8 heroes)
- `page3.html` - Hero stats (BASE + gear from page4)
- `page4.html` - Inventory / Bag (11 slots, equip system)
- `page5.html` - Skills (5 skills per hero)
- `page6.html` - Battlefield, выбор локации, 6 активных локаций
- `page7.html` - Stages, выбор моба в локации, 4 стадии
- `page8.html` - Battle, бой с логом
- `page9.html` - Missions (51 missions)
- `page10.html` - Market
- `page11.html` - PvP Arena
- `page12.html` - Workshop, item upgrade
- `page13.html` - Pass
- `page14.html` - Guild

## Mechanics V2
- Tanks `LION WARDEN` & `IRON VOW`: PARRY 12%, DODGE 0%
- Tank `GRAVELORD`: PARRY 8%, DODGE 0%
- Other heroes: DODGE 10-20%, PARRY 0%
- Shield `Щит Серый Lvl1`: +60 DEF +50 HP +1 PARRY
- Battle: DODGE + PARRY + IMMUNE logs
- Multi-hit V2: каждый удар отдельно, свой крит, свой DEF, свой лог, стоп если враг умер
- Ultimate `Аватар Империи`: +50% HP (1600→2400), immune 2 rounds, +200% DMG 3 rounds

## Версия V2
Единый источник версии — `VOLAND_CONFIG.version` в `assets/js/config.js` (сейчас `2.0`, V2).
Не хардкодить версию в HTML и документах, а брать из конфига.
Ключи сохранений в `localStorage` остаются `voland_v1_*` для совместимости со старыми сейвами.

## Run
Just open `index.html` - uses localStorage, no backend.

## GitHub Pages
Enable Pages -> main / root. Add `assets/heroes/` images if you have them.

## License
MIT - open source.
