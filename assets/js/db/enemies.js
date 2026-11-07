// VOLAND DB - ENEMIES module
const VOLAND_ENEMIES = {
1: [
   {stage:1, name:'ПЕСЧАНАЯ МЫШЬ', eng:'Sand Gerbil', icon:'🐭', img:'./assets/enemies/sand-gerbil.jpg', hp:40, hpColor:'#3ad080', gold:5, xp:80, drops:[{id:'quartz',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:2, name:'ПУСТЫННЫЙ СКОРПИОН', eng:'Desert Scorpion', icon:'🦂', img:'./assets/enemies/desert-scorpion.jpg', hp:65, hpColor:'#d0b040', gold:7, xp:150, drops:[{id:'quartz',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:3, name:'ЗМЕЯ ТРЕЩЕТКА', eng:'Rattlesnake', icon:'🐍', img:'./assets/enemies/rattlesnake.jpg', hp:85, hpColor:'#e05050', gold:10, xp:250, drops:[{id:'quartz',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:4, name:'ТИТАН ДЮН', eng:'Dune Tyrant - BOSS', icon:'👹', img:'./assets/enemies/dune-tyrant.jpg', hp:100, hpColor:'#e6d5a0', boss:true, gold:30, xp:800, drops:[{id:'quartz',chance:0.20},{id:'fang',chance:0.10},{id:'essence',chance:0.10}]},
 ],
2: [
   {stage:1, name:'ЛЕСНОЙ ПРИЗРАК', eng:'Forest Wraith', icon:'👻', img:'./assets/enemies/forest-wraith.webp', hp:50, hpColor:'#6ab0ff', gold:8, xp:120, drops:[{id:'wood',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:2, name:'ТЕНЕВОЙ ВОЛК', eng:'Shadow Wolf', icon:'🐺', img:'./assets/enemies/shadow-wolf.webp', hp:70, hpColor:'#a0a0ff', gold:10, xp:200, drops:[{id:'wood',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:3, name:'МШИСТЫЙ ГОЛЕМ', eng:'Moss Golem', icon:'🪨', img:'./assets/enemies/moss-golem.webp', hp:85, hpColor:'#3ad080', gold:13, xp:320, drops:[{id:'wood',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:4, name:'ШИПОВАЯ ДРИАДА', eng:'Thorn Dryad - BOSS', icon:'🌹', img:'./assets/enemies/thorn-dryad.webp', hp:100, hpColor:'#e6d5a0', boss:true, gold:35, xp:1000, drops:[{id:'wood',chance:0.20},{id:'fang',chance:0.10},{id:'essence',chance:0.10}]},
 ],
3: [
   {stage:1, name:'ЛЕДЯНОЙ ПРИЗРАК', eng:'Ice Wraith', icon:'👻', img:'./assets/enemies/ice-wraith.webp', hp:50, hpColor:'#6ab0ff', gold:10, xp:180, drops:[{id:'diamond',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:2, name:'МОРОЗНЫЙ КЛЫК', eng:'Frostfang Wolf', icon:'🐺', img:'./assets/enemies/frostfang-wolf.webp', hp:70, hpColor:'#a0a0ff', gold:12, xp:280, drops:[{id:'diamond',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:3, name:'ЛЕДЯНОЙ ТРОЛЛЬ', eng:'Frost Troll', icon:'🧌', img:'./assets/enemies/frost-troll.webp', hp:85, hpColor:'#3ad080', gold:15, xp:400, drops:[{id:'diamond',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:4, name:'МОРОЗНЫЙ ПАУК', eng:'Frost Spider - BOSS', icon:'🕷️', img:'./assets/enemies/frost-spider.webp', hp:100, hpColor:'#e6d5a0', boss:true, gold:40, xp:1200, drops:[{id:'diamond',chance:0.20},{id:'fang',chance:0.10},{id:'essence',chance:0.10}]},
 ],
4: [
   {stage:1, name:'ЧУДИЩЕ БОЛОТНОЕ', eng:'Toxic Toad', icon:'🐸', img:'./assets/enemies/toxic-toad.webp', hp:60, hpColor:'#3ad080', gold:15, xp:250, drops:[{id:'water',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:2, name:'БОЛОТНЫЙ ЖУК', eng:'Swamp Hag', icon:'🪲', img:'./assets/enemies/swamp-hag.webp', hp:70, hpColor:'#d0b040', gold:18, xp:350, drops:[{id:'water',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:3, name:'ЛОЗЯНОЙ УЖАС', eng:'Vine Horror', icon:'🌿', img:'./assets/enemies/vine-horror.webp', hp:85, hpColor:'#e05050', gold:22, xp:500, drops:[{id:'water',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:4, name:'ТОКСИЧНАЯ ЖАБА', eng:'Mire Crawler - BOSS', icon:'🐸', img:'./assets/enemies/mire-crawler.webp', hp:100, hpColor:'#e6d5a0', boss:true, gold:50, xp:1500, drops:[{id:'water',chance:0.20},{id:'fang',chance:0.10},{id:'essence',chance:0.10}]},
 ],
5: [
   {stage:1, name:'УГОЛЬНЫЙ БЕС', eng:'Ember Imp', icon:'🔥', img:'./assets/enemies/ember-imp.webp', hp:60, hpColor:'#6ab0ff', gold:18, xp:350, drops:[{id:'stone',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:2, name:'МАГМОВАЯ САЛАМАНДРА', eng:'Magma Salamander', icon:'🦎', img:'./assets/enemies/magma-salamander.webp', hp:70, hpColor:'#a0a0ff', gold:22, xp:450, drops:[{id:'stone',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:3, name:'ОБСИДИАНОВАЯ ГОРГУЛЬЯ', eng:'Obsidian Gargoyle', icon:'🗿', img:'./assets/enemies/obsidian-gargoyle.webp', hp:85, hpColor:'#3ad080', gold:28, xp:650, drops:[{id:'stone',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:4, name:'ОГНЕННЫЙ ТРОЛЛЬ', eng:'Fire Troll - BOSS', icon:'🧌', img:'./assets/enemies/fire-troll.webp', hp:100, hpColor:'#e6d5a0', boss:true, gold:60, xp:1800, drops:[{id:'stone',chance:0.20},{id:'fang',chance:0.10},{id:'essence',chance:0.10}]},
 ],
6: [
   {stage:1, name:'СКЕЛЕТ-ЛЕГИОНЕР', eng:'Skeleton Liegionnaire', icon:'💀', img:'./assets/enemies/skeleton-liegionnaire.webp', hp:60, hpColor:'#6ab0ff', gold:22, xp:450, drops:[{id:'bone',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:2, name:'ПРИВИДЕНИЕ РУИН', eng:'Ruin Specter', icon:'👻', img:'./assets/enemies/ruin-specter.webp', hp:70, hpColor:'#a0a0ff', gold:28, xp:600, drops:[{id:'bone',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:3, name:'КАМЕННАЯ ГОРГУЛЬЯ', eng:'Stone Gargoyle', icon:'🗿', img:'./assets/enemies/stone-gargoyle.webp', hp:85, hpColor:'#3ad080', gold:35, xp:850, drops:[{id:'bone',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:4, name:'ПАДШИЙ ПАЛАДИН', eng:'Fallen Paladin - BOSS', icon:'⚔️', img:'./assets/enemies/fallen-paladin.webp', hp:100, hpColor:'#e6d5a0', boss:true, gold:75, xp:2200, drops:[{id:'bone',chance:0.20},{id:'fang',chance:0.10},{id:'essence',chance:0.10}]},
 ],
};
