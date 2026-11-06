
# VOLAND - Dark Fantasy RPG

Open source browser RPG.

## Pages
- `index.html` - Entry 
- `page2.html` - Hero select (8 heroes)
- `page3.html` - Hero stats (BASE + gear from page4)
- `page4.html` - Inventory / Bag (11 slots, equip system)
- `page5.html` - Skills (5 skills per hero)
- `page6.html` - Battlefield 
- `page7.html` - DESERT location - 4 mobs, boss TITAN DUN 
- `page8.html` - Battle page with log 

## Mechanics v2.0
- Tanks `LION WARDEN` & `IRON VOW`: PARRY 12% (was DODGE), DODGE 0%
- Other heroes: DODGE 8-20%, PARRY 0%
- Shield `Щит Бастион`: +60 DEF +50 HP +5% PARRY
- Battle: DODGE + PARRY + IMMUNE logs
- Ultimate `Аватар Империи`: +50% HP (1300→1950), immune 2 rounds, +300% DMG 3 rounds

## Версия
Единый источник версии — `VOLAND_CONFIG.version` в `assets/js/config.js` (сейчас `2.0`).
Не хардкодить версию в HTML и документах, а брать из конфига.
Ключи сохранений в `localStorage` остаются `voland_v1_*` для совместимости со старыми сейвами.

## Run
Just open `index.html` - uses localStorage, no backend.

## GitHub Pages
Enable Pages -> main / root. Add `assets/heroes/` images if you have them.

## License
MIT - open source.
