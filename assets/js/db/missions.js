// VOLAND DB - MISSIONS module
const VOLAND_MISSIONS = [
 // --- DESERT — ПЕСЧАНАЯ РЕЗНЯ — 5+10 за моба ---
 {id:1, name:'ПЕСЧАНАЯ РЕЗНЯ I', eng:'Sand Slayer I', icon:'🏜️', chain:'desert', prev:null, type:'kill_mob', loc:1, target:20, reward:{gold:100,xp:200}, desc:'Убей 20 мобов в Пустыне'},
 {id:2, name:'ПЕСЧАНАЯ РЕЗНЯ II', eng:'Sand Slayer II', icon:'🏜️', chain:'desert', prev:1, type:'kill_mob', loc:1, target:50, reward:{gold:250,xp:500}, desc:'Убей 50 мобов в Пустыне'},
 {id:3, name:'ПЕСЧАНАЯ РЕЗНЯ III', eng:'Sand Slayer III', icon:'🏜️', chain:'desert', prev:2, type:'kill_mob', loc:1, target:100, reward:{gold:500,xp:1000,title:'ПЕСЧАНЫЙ СТРАННИК',titleColor:'green'}, desc:'Убей 100 мобов в Пустыне'},
 {id:4, name:'ПЕСЧАНАЯ РЕЗНЯ IV', eng:'Sand Slayer IV', icon:'🏜️', chain:'desert', prev:3, type:'kill_mob', loc:1, target:200, reward:{gold:1000,xp:2000,title:'ПЕСЧАНЫЙ ОХОТНИК',titleColor:'blue'}, desc:'Убей 200 мобов в Пустыне'},
 {id:5, name:'ПЕСЧАНАЯ РЕЗНЯ V', eng:'Sand Slayer V', icon:'🏜️', chain:'desert', prev:4, type:'kill_mob', loc:1, target:300, reward:{gold:1500,xp:3000,title:'ПЕСЧАНЫЙ ДЕМОН',titleColor:'red'}, desc:'Убей 300 мобов в Пустыне'},
 {id:6, name:'ПЕСЧАНАЯ РЕЗНЯ VI', eng:'Sand Slayer VI', icon:'🏜️', chain:'desert', prev:5, type:'kill_mob', loc:1, target:500, reward:{gold:2500,xp:5000,title:'ВЛАДЫКА ПУСТЫНИ',titleColor:'yellow'}, desc:'Убей 500 мобов в Пустыне'},
 // --- FOREST — ЛЕСНОЙ ОХОТНИК — 10+15 за моба ---
 {id:7, name:'ЛЕСНОЙ ОХОТНИК I', eng:'Forest Hunter I', icon:'🌲', chain:'forest', prev:null, type:'kill_mob', loc:2, target:20, reward:{gold:200,xp:300}, desc:'Убей 20 мобов в Темном Лесу'},
 {id:8, name:'ЛЕСНОЙ ОХОТНИК II', eng:'Forest Hunter II', icon:'🌲', chain:'forest', prev:7, type:'kill_mob', loc:2, target:50, reward:{gold:500,xp:750}, desc:'Убей 50 мобов в Темном Лесу'},
 {id:9, name:'ЛЕСНОЙ ОХОТНИК III', eng:'Forest Hunter III', icon:'🌲', chain:'forest', prev:8, type:'kill_mob', loc:2, target:100, reward:{gold:1000,xp:1500,title:'ЛЕСНОЙ СТРАННИК',titleColor:'green'}, desc:'Убей 100 мобов в Темном Лесу'},
 {id:10, name:'ЛЕСНОЙ ОХОТНИК IV', eng:'Forest Hunter IV', icon:'🌲', chain:'forest', prev:9, type:'kill_mob', loc:2, target:200, reward:{gold:2000,xp:3000,title:'ЛЕСНОЙ ОХОТНИК',titleColor:'blue'}, desc:'Убей 200 мобов в Темном Лесу'},
 {id:11, name:'ЛЕСНОЙ ОХОТНИК V', eng:'Forest Hunter V', icon:'🌲', chain:'forest', prev:10, type:'kill_mob', loc:2, target:300, reward:{gold:3000,xp:4500,title:'ЛЕСНОЙ ПРИЗРАК',titleColor:'red'}, desc:'Убей 300 мобов в Темном Лесу'},
 {id:12, name:'ЛЕСНОЙ ОХОТНИК VI', eng:'Forest Hunter VI', icon:'🌲', chain:'forest', prev:11, type:'kill_mob', loc:2, target:500, reward:{gold:5000,xp:7500,title:'ВЛАДЫКА ЛЕСА',titleColor:'yellow'}, desc:'Убей 500 мобов в Темном Лесу'},
 // --- FROST — МОРОЗНЫЙ УБИЙЦА — 13+20 за моба ---
 {id:13, name:'МОРОЗНЫЙ УБИЙЦА I', eng:'Frost Slayer I', icon:'❄️', chain:'frost', prev:null, type:'kill_mob', loc:3, target:20, reward:{gold:260,xp:400}, desc:'Убей 20 мобов в Ледяных Землях'},
 {id:14, name:'МОРОЗНЫЙ УБИЙЦА II', eng:'Frost Slayer II', icon:'❄️', chain:'frost', prev:13, type:'kill_mob', loc:3, target:50, reward:{gold:650,xp:1000}, desc:'Убей 50 мобов в Ледяных Землях'},
 {id:15, name:'МОРОЗНЫЙ УБИЙЦА III', eng:'Frost Slayer III', icon:'❄️', chain:'frost', prev:14, type:'kill_mob', loc:3, target:100, reward:{gold:1300,xp:2000,title:'ЛЕДЯНОЙ СТРАННИК',titleColor:'green'}, desc:'Убей 100 мобов в Ледяных Землях'},
 {id:16, name:'МОРОЗНЫЙ УБИЙЦА IV', eng:'Frost Slayer IV', icon:'❄️', chain:'frost', prev:15, type:'kill_mob', loc:3, target:200, reward:{gold:2600,xp:4000,title:'ЛЕДЯНОЙ ВОИН',titleColor:'blue'}, desc:'Убей 200 мобов в Ледяных Землях'},
 {id:17, name:'МОРОЗНЫЙ УБИЙЦА V', eng:'Frost Slayer V', icon:'❄️', chain:'frost', prev:16, type:'kill_mob', loc:3, target:300, reward:{gold:3900,xp:6000,title:'ЛЕДЯНОЙ ПАЛАЧ',titleColor:'red'}, desc:'Убей 300 мобов в Ледяных Землях'},
 {id:18, name:'МОРОЗНЫЙ УБИЙЦА VI', eng:'Frost Slayer VI', icon:'❄️', chain:'frost', prev:17, type:'kill_mob', loc:3, target:500, reward:{gold:6500,xp:10000,title:'ВЛАДЫКА ЛЬДА',titleColor:'yellow'}, desc:'Убей 500 мобов в Ледяных Землях'},
 // --- SWAMP — БОЛОТНЫЙ ОХОТНИК — 15+25 за моба ---
 {id:19, name:'БОЛОТНЫЙ ОХОТНИК I', eng:'Swamp Hunter I', icon:'🐊', chain:'swamp', prev:null, type:'kill_mob', loc:4, target:20, reward:{gold:300,xp:500}, desc:'Убей 20 мобов в Болоте'},
 {id:20, name:'БОЛОТНЫЙ ОХОТНИК II', eng:'Swamp Hunter II', icon:'🐊', chain:'swamp', prev:19, type:'kill_mob', loc:4, target:50, reward:{gold:750,xp:1250}, desc:'Убей 50 мобов в Болоте'},
 {id:21, name:'БОЛОТНЫЙ ОХОТНИК III', eng:'Swamp Hunter III', icon:'🐊', chain:'swamp', prev:20, type:'kill_mob', loc:4, target:100, reward:{gold:1500,xp:2500,title:'ТОПНИК',titleColor:'green'}, desc:'Убей 100 мобов в Болоте'},
 {id:22, name:'БОЛОТНЫЙ ОХОТНИК IV', eng:'Swamp Hunter IV', icon:'🐊', chain:'swamp', prev:21, type:'kill_mob', loc:4, target:200, reward:{gold:3000,xp:5000,title:'ЯДОВИТЫЙ ДУХ',titleColor:'blue'}, desc:'Убей 200 мобов в Болоте'},
 {id:23, name:'БОЛОТНЫЙ ОХОТНИК V', eng:'Swamp Hunter V', icon:'🐊', chain:'swamp', prev:22, type:'kill_mob', loc:4, target:300, reward:{gold:4500,xp:7500,title:'КОШМАР БОЛОТА',titleColor:'red'}, desc:'Убей 300 мобов в Болоте'},
 {id:24, name:'БОЛОТНЫЙ ОХОТНИК VI', eng:'Swamp Hunter VI', icon:'🐊', chain:'swamp', prev:23, type:'kill_mob', loc:4, target:500, reward:{gold:7500,xp:12500,title:'ВЛАДЫКА БОЛОТА',titleColor:'yellow'}, desc:'Убей 500 мобов в Болоте'},
 // --- VOLCANO — ОГНЕННЫЙ ОХОТНИК — 20+35 за моба ---
 {id:25, name:'ОГНЕННЫЙ ОХОТНИК I', eng:'Fire Hunter I', icon:'🌋', chain:'volcano', prev:null, type:'kill_mob', loc:5, target:20, reward:{gold:400,xp:700}, desc:'Убей 20 мобов в Вулкане'},
 {id:26, name:'ОГНЕННЫЙ ОХОТНИК II', eng:'Fire Hunter II', icon:'🌋', chain:'volcano', prev:25, type:'kill_mob', loc:5, target:50, reward:{gold:1000,xp:1750}, desc:'Убей 50 мобов в Вулкане'},
 {id:27, name:'ОГНЕННЫЙ ОХОТНИК III', eng:'Fire Hunter III', icon:'🌋', chain:'volcano', prev:26, type:'kill_mob', loc:5, target:100, reward:{gold:2000,xp:3500,title:'ДИТЯ МАГМЫ',titleColor:'green'}, desc:'Убей 100 мобов в Вулкане'},
 {id:28, name:'ОГНЕННЫЙ ОХОТНИК IV', eng:'Fire Hunter IV', icon:'🌋', chain:'volcano', prev:27, type:'kill_mob', loc:5, target:200, reward:{gold:4000,xp:7000,title:'КУЗНЕЦ ОГНЯ',titleColor:'blue'}, desc:'Убей 200 мобов в Вулкане'},
 {id:29, name:'ОГНЕННЫЙ ОХОТНИК V', eng:'Fire Hunter V', icon:'🌋', chain:'volcano', prev:28, type:'kill_mob', loc:5, target:300, reward:{gold:6000,xp:10500,title:'СЕРДЦЕ ВУЛКАНА',titleColor:'red'}, desc:'Убей 300 мобов в Вулкане'},
 {id:30, name:'ОГНЕННЫЙ ОХОТНИК VI', eng:'Fire Hunter VI', icon:'🌋', chain:'volcano', prev:29, type:'kill_mob', loc:5, target:500, reward:{gold:10000,xp:17500,title:'ВЛАДЫКА ВУЛКАНА',titleColor:'yellow'}, desc:'Убей 500 мобов в Вулкане'},
 // --- RUINS — СТРАЖ РУИН — 25+50 за моба ---
 {id:31, name:'СТРАЖ РУИН I', eng:'Ruin Guardian I', icon:'🏛️', chain:'ruins', prev:null, type:'kill_mob', loc:6, target:20, reward:{gold:500,xp:1000}, desc:'Убей 20 мобов в Руинах'},
 {id:32, name:'СТРАЖ РУИН II', eng:'Ruin Guardian II', icon:'🏛️', chain:'ruins', prev:31, type:'kill_mob', loc:6, target:50, reward:{gold:1250,xp:2500}, desc:'Убей 50 мобов в Руинах'},
 {id:33, name:'СТРАЖ РУИН III', eng:'Ruin Guardian III', icon:'🏛️', chain:'ruins', prev:32, type:'kill_mob', loc:6, target:100, reward:{gold:2500,xp:5000,title:'КОСТЯНОЙ СТРАЖ',titleColor:'green'}, desc:'Убей 100 мобов в Руинах'},
 {id:34, name:'СТРАЖ РУИН IV', eng:'Ruin Guardian IV', icon:'🏛️', chain:'ruins', prev:33, type:'kill_mob', loc:6, target:200, reward:{gold:5000,xp:10000,title:'РЫЦАРЬ РУИН',titleColor:'blue'}, desc:'Убей 200 мобов в Руинах'},
 {id:35, name:'СТРАЖ РУИН V', eng:'Ruin Guardian V', icon:'🏛️', chain:'ruins', prev:34, type:'kill_mob', loc:6, target:300, reward:{gold:7500,xp:15000,title:'ПОВЕЛИТЕЛЬ КОСТЕЙ',titleColor:'red'}, desc:'Убей 300 мобов в Руинах'},
 {id:36, name:'СТРАЖ РУИН VI', eng:'Ruin Guardian VI', icon:'🏛️', chain:'ruins', prev:35, type:'kill_mob', loc:6, target:500, reward:{gold:12500,xp:25000,title:'ВЛАДЫКА РУИН',titleColor:'yellow'}, desc:'Убей 500 мобов в Руинах'},
 // --- BOSS ---
 {id:37, name:'ПЕРВЫЙ ТРОФЕЙ', eng:'First Trophy', icon:'👹', chain:'boss', prev:null, type:'kill_boss', target:1, reward:{gold:200,xp:500}, desc:'Убей 1 босса'},
 {id:38, name:'ОХОТНИК НА БОССОВ', eng:'Boss Hunter', icon:'💀', chain:'boss', prev:37, type:'kill_boss_diff', target:3, reward:{gold:400,xp:1000}, desc:'Убей 3 разных боссов'},
 {id:39, name:'ПОВЕЛИТЕЛЬ БОССОВ', eng:'Boss Lord', icon:'👑', chain:'boss', prev:38, type:'kill_boss_diff', target:6, reward:{gold:1000,xp:2500,title:'Убийца Титанов'}, desc:'Убей 6 разных боссов'},
 // --- LOGIN ---
 {id:40, name:'НОВИЧОК', eng:'Newcomer', icon:'📅', chain:'login', prev:null, type:'login', target:7, reward:{gold:500,xp:500}, desc:'Зайди 7 разных дней в игру'},
 {id:41, name:'ВЕТЕРАН', eng:'Veteran', icon:'📅', chain:'login', prev:40, type:'login', target:30, reward:{gold:2000,xp:2000,title:'Ветеран VOLAND'}, desc:'Зайди 30 разных дней'},
 // --- EQUIP — по тирам ---
 {id:42, name:'СОБИРАТЕЛЬ', eng:'Collector', icon:'🟢', chain:'equip', prev:null, type:'collect_green', target:5, reward:{gold:1000,xp:1000}, desc:'Собери хотя бы 5 предметов экипировки зеленого тира'},
 {id:43, name:'КОЛЛЕКЦИОНЕР', eng:'Hoarder', icon:'🔵', chain:'equip', prev:42, type:'collect_blue', target:4, reward:{gold:2000,xp:2000}, desc:'Собери хотя бы 4 предмета синего тира'},
 {id:44, name:'ХРАНИТЕЛИ', eng:'Keepers', icon:'🔴', chain:'equip', prev:43, type:'collect_red', target:3, reward:{gold:3000,xp:3000}, desc:'Собери хотя бы 3 предмета красного тира'},
 {id:45, name:'ЛЕГЕНДА', eng:'Legend', icon:'🟣', chain:'equip', prev:44, type:'collect_gold', target:1, reward:{gold:5000,xp:5000}, desc:'Собери 1 предмет золотого тира'},
 // --- ULT — ульта на T, 6 фаз, та же логика 7+18 ---
 {id:46, name:'УЧЕНИК МАГИИ I', eng:'Apprentice I', icon:'🌌', chain:'ult', prev:null, type:'ult', target:20, reward:{gold:150,xp:400}, desc:'Используй ульту (T) 20 раз'},
 {id:47, name:'УЧЕНИК МАГИИ II', eng:'Apprentice II', icon:'🌌', chain:'ult', prev:46, type:'ult', target:50, reward:{gold:350,xp:900}, desc:'Используй ульту (T) 50 раз'},
 {id:48, name:'УЧЕНИК МАГИИ III', eng:'Apprentice III', icon:'🌌', chain:'ult', prev:47, type:'ult', target:100, reward:{gold:700,xp:1800,title:'Архимаг'}, desc:'Используй ульту (T) 100 раз'},
 {id:49, name:'УЧЕНИК МАГИИ IV', eng:'Apprentice IV', icon:'🌌', chain:'ult', prev:48, type:'ult', target:300, reward:{gold:2100,xp:5400}, desc:'Используй ульту (T) 300 раз'},
 {id:50, name:'УЧЕНИК МАГИИ V', eng:'Apprentice V', icon:'🌌', chain:'ult', prev:49, type:'ult', target:600, reward:{gold:4200,xp:10800}, desc:'Используй ульту (T) 600 раз'},
 {id:51, name:'УЧЕНИК МАГИИ VI', eng:'Apprentice VI', icon:'🌌', chain:'ult', prev:50, type:'ult', target:1000, reward:{gold:7000,xp:18000}, desc:'Используй ульту (T) 1000 раз'},
];
