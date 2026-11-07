// VOLAND DB - ENEMIES module
const VOLAND_ENEMIES = {
1: [
   {stage:1, name:'ПЕСЧАНАЯ МЫШЬ', eng:'Sand Gerbil', icon:'🐭', img:'./assets/enemies/sand-gerbil.jpg', desc:'Безобидный грызун, ворует крошки. Урон 10%', lvl:'LVL 1', hp:40, hpColor:'#3ad080', gold:5, xp:80, drops:[{id:'quartz',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:2, name:'ПУСТЫННЫЙ СКОРПИОН', eng:'Desert Scorpion', icon:'🦂', img:'./assets/enemies/desert-scorpion.jpg', desc:'Ядовитое жало, стан 20% шанс. Урон 60%', lvl:'LVL 3', hp:65, hpColor:'#d0b040', gold:7, xp:150, drops:[{id:'quartz',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:3, name:'ЗМЕЯ ТРЕЩЕТКА', eng:'Rattlesnake', icon:'🐍', img:'./assets/enemies/rattlesnake.jpg', desc:'Ядовитый укус, яд 25% на 3 раунда. Урон 140%', lvl:'LVL 5', hp:85, hpColor:'#e05050', gold:10, xp:250, drops:[{id:'quartz',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:4, name:'ТИТАН ДЮН', eng:'Dune Tyrant - BOSS', icon:'👹', img:'./assets/enemies/dune-tyrant.jpg', desc:'Босс Пустыни: Песчаная буря + оглушение AOE. Урон 300%', lvl:'BOSS LVL 7', hp:100, hpColor:'#e6d5a0', boss:true, gold:30, xp:800, drops:[{id:'quartz',chance:0.20},{id:'fang',chance:0.10},{id:'essence',chance:0.10}]},
 ],
2: [
   {stage:1, name:'ЛЕСНОЙ ПРИЗРАК', eng:'Forest Wraith', icon:'👻', img:'./assets/enemies/forest-wraith.webp', desc:'Призрак леса, игнор 20% брони. Урон 180%', lvl:'LVL 2', hp:50, hpColor:'#6ab0ff', gold:8, xp:120, drops:[{id:'wood',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:2, name:'ТЕНЕВОЙ ВОЛК', eng:'Shadow Wolf', icon:'🐺', img:'./assets/enemies/shadow-wolf.webp', desc:'Прыжок из тени, крит +25%. Урон 200%', lvl:'LVL 4', hp:70, hpColor:'#a0a0ff', gold:10, xp:200, drops:[{id:'wood',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:3, name:'МШИСТЫЙ ГОЛЕМ', eng:'Moss Golem', icon:'🪨', img:'./assets/enemies/moss-golem.webp', desc:'Каменная кожа + шипы, отражение 15%. Урон 220%', lvl:'LVL 6', hp:85, hpColor:'#3ad080', gold:13, xp:320, drops:[{id:'wood',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:4, name:'ШИПОВАЯ ДРИАДА', eng:'Thorn Dryad - BOSS', icon:'🌹', img:'./assets/enemies/thorn-dryad.webp', desc:'Босс Леса: Шипы + яд AOE, реген 5% в раунд. Урон 300%', lvl:'BOSS LVL 8', hp:100, hpColor:'#e6d5a0', boss:true, gold:35, xp:1000, drops:[{id:'wood',chance:0.20},{id:'fang',chance:0.10},{id:'essence',chance:0.10}]},
 ],
3: [
   {stage:1, name:'ЛЕДЯНОЙ ПРИЗРАК', eng:'Ice Wraith', icon:'👻', img:'./assets/enemies/ice-wraith.webp', desc:'Призрак льда, заморозка 20% шанс. Урон 180%', lvl:'LVL 3', hp:50, hpColor:'#6ab0ff', gold:10, xp:180, drops:[{id:'diamond',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:2, name:'МОРОЗНЫЙ КЛЫК', eng:'Frostfang Wolf', icon:'🐺', img:'./assets/enemies/frostfang-wolf.webp', desc:'Укус мороза, крит +25%. Урон 200%', lvl:'LVL 5', hp:70, hpColor:'#a0a0ff', gold:12, xp:280, drops:[{id:'diamond',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:3, name:'ЛЕДЯНОЙ ТРОЛЛЬ', eng:'Frost Troll', icon:'🧌', img:'./assets/enemies/frost-troll.webp', desc:'Ледяная броня, блок 20%. Урон 220%', lvl:'LVL 7', hp:85, hpColor:'#3ad080', gold:15, xp:400, drops:[{id:'diamond',chance:0.10},{id:'fang',chance:0.05},{id:'essence',chance:0.05}]},
   {stage:4, name:'МОРОЗНЫЙ ПАУК', eng:'Frost Spider - BOSS', icon:'🕷️', img:'./assets/enemies/frost-spider.webp', desc:'Босс Льда: Паутина + яд AOE, реген 5% в раунд. Урон 300%', lvl:'BOSS LVL 10', hp:100, hpColor:'#e6d5a0', boss:true, gold:40, xp:1200, drops:[{id:'diamond',chance:0.20},{id:'fang',chance:0.10},{id:'essence',chance:0.10}]},
 ],
};


