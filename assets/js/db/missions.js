// VOLAND DB - MISSIONS module
const VOLAND_MISSIONS = [
 {id:1, name:'ПЕСЧАНАЯ РЕЗНЯ I', eng:'Sand Slayer I', icon:'🏜️', chain:'desert', prev:null, type:'kill_mob', loc:1, target:20, reward:{gold:100,xp:200}, desc:'Убей 20 мобов в Пустыне'},
 {id:2, name:'ПЕСЧАНАЯ РЕЗНЯ II', eng:'Sand Slayer II', icon:'🏜️', chain:'desert', prev:1, type:'kill_mob', loc:1, target:50, reward:{gold:250,xp:500}, desc:'Убей 50 мобов в Пустыне'},
 {id:3, name:'ПЕСЧАНАЯ РЕЗНЯ III', eng:'Sand Slayer III', icon:'🏜️', chain:'desert', prev:2, type:'kill_mob', loc:1, target:100, reward:{gold:500,xp:1000,title:'Песчаный Демон'}, desc:'Убей 100 мобов в Пустыне'},
 {id:4, name:'ЛЕСНОЙ ОХОТНИК I', eng:'Forest Hunter I', icon:'🌲', chain:'forest', prev:null, type:'kill_mob', loc:2, target:20, reward:{gold:120,xp:300}, desc:'Убей 20 мобов в Темном Лесу'},
 {id:5, name:'ЛЕСНОЙ ОХОТНИК II', eng:'Forest Hunter II', icon:'🌲', chain:'forest', prev:4, type:'kill_mob', loc:2, target:50, reward:{gold:300,xp:750}, desc:'Убей 50 мобов в Темном Лесу'},
 {id:6, name:'ЛЕСНОЙ ОХОТНИК III', eng:'Forest Hunter III', icon:'🌲', chain:'forest', prev:5, type:'kill_mob', loc:2, target:100, reward:{gold:600,xp:1500,title:'Лесной Призрак'}, desc:'Убей 100 мобов в Темном Лесу'},
 {id:7, name:'МОРОЗНЫЙ УБИЙЦА I', eng:'Frost Slayer I', icon:'❄️', chain:'frost', prev:null, type:'kill_mob', loc:3, target:20, reward:{gold:150,xp:400}, desc:'Убей 20 мобов в Ледяных Землях'},
 {id:8, name:'МОРОЗНЫЙ УБИЙЦА II', eng:'Frost Slayer II', icon:'❄️', chain:'frost', prev:7, type:'kill_mob', loc:3, target:50, reward:{gold:350,xp:1000}, desc:'Убей 50 мобов в Ледяных Землях'},
 {id:9, name:'МОРОЗНЫЙ УБИЙЦА III', eng:'Frost Slayer III', icon:'❄️', chain:'frost', prev:8, type:'kill_mob', loc:3, target:100, reward:{gold:700,xp:2000,title:'Ледяной Палач'}, desc:'Убей 100 мобов в Ледяных Землях'},
 {id:10, name:'ПЕРВЫЙ ТРОФЕЙ', eng:'First Trophy', icon:'👹', chain:'boss', prev:null, type:'kill_boss', target:1, reward:{gold:200,xp:500}, desc:'Убей 1 босса'},
 {id:11, name:'ОХОТНИК НА БOССОВ', eng:'Boss Hunter', icon:'💀', chain:'boss', prev:10, type:'kill_boss_diff', target:3, reward:{gold:400,xp:1000}, desc:'Убей 3 разных боссов'},
 {id:12, name:'ПОВЕЛИТЕЛЬ БОССОВ', eng:'Boss Lord', icon:'👑', chain:'boss', prev:11, type:'kill_boss', target:20, reward:{gold:1000,xp:2500,title:'Убийца Титанов'}, desc:'Убей 20 боссов всего'},
 {id:13, name:'НОВИЧОК', eng:'Newcomer', icon:'📅', chain:'login', prev:null, type:'login', target:7, reward:{gold:150,xp:300}, desc:'Зайди 7 разных дней в игру'},
 {id:14, name:'ВЕТЕРАН', eng:'Veteran', icon:'📅', chain:'login', prev:13, type:'login', target:30, reward:{gold:800,xp:2000,title:'Ветеран VOLAND'}, desc:'Зайди 30 разных дней'},
 {id:15, name:'СОБИРАТЕЛЬ', eng:'Collector', icon:'🟢', chain:'equip', prev:null, type:'collect_green', target:5, reward:{gold:300,xp:600}, desc:'Собери полный зеленый сет (5 предметов)'},
 {id:16, name:'КОЛЛЕКЦИОНЕР', eng:'Hoarder', icon:'🔵', chain:'equip', prev:15, type:'collect_blue', target:6, reward:{gold:600,xp:1200}, desc:'Собери полный синий сет (6 предметов)'},
 {id:17, name:'ЛЕГЕНДА', eng:'Legend', icon:'🟣', chain:'equip', prev:16, type:'collect_legend', target:1, reward:{gold:1000,xp:2500}, desc:'Собери 1 легендарный предмет'},
 {id:18, name:'ОРУЖЕЙНИК', eng:'Arms Dealer', icon:'⚔️', chain:'equip', prev:17, type:'equip_dmg', target:100, reward:{gold:500,xp:1000}, desc:'Надень предмет с +100 DMG'},
 {id:19, name:'УЧЕНИК МАГИИ I', eng:'Apprentice I', icon:'🌌', chain:'ult', prev:null, type:'ult', target:20, reward:{gold:150,xp:400}, desc:'Используй ульту (R) 20 раз'},
 {id:20, name:'УЧЕНИК МАГИИ II', eng:'Apprentice II', icon:'🌌', chain:'ult', prev:19, type:'ult', target:50, reward:{gold:350,xp:900}, desc:'Используй ульту 50 раз'},
 {id:21, name:'УЧЕНИК МАГИИ III', eng:'Apprentice III', icon:'🌌', chain:'ult', prev:20, type:'ult', target:100, reward:{gold:700,xp:1800,title:'Архимаг'}, desc:'Используй ульту 100 раз'},
 {id:22, name:'НЕУЯЗВИМЫЙ', eng:'Untouchable', icon:'🛡️', chain:'streak', prev:21, type:'win_streak', target:10, reward:{gold:1200,xp:3000,title:'Неуязвимый'}, desc:'Выиграй 10 боев подряд без смертей'},
];


