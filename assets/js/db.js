// VOLAND DB v1 - единый источник данных для всех страниц
// Пути все с ./assets/ чтобы работало на GitHub Pages в подпапке

const VOLAND_HEROES = {
'necro-f-new': {
  n:'AMETHYST', role:'MAGE • Necro - Female',
  img:'./assets/heroes/necro-f-new.webp',
  thumb:'./assets/heroes/necro-f-new.webp',
  st:{HP:1000,DEF:100,DMG:240,MANA:280,CRIT:15,DODGE:12},
  sk:[
    ['Шепот Аметиста','PASSIVE',['./assets/heroes/icon_shepot_ametista.jpg'],'🔮','Каждое 3-е заклинание призывает аметистового духа на 3 раунда. Дух бьет на 100% урона заклинателя и дает тебе +5 маны за раунд пока жив.','Дух: 100% урона • Мана: +5 за раунд'],
    ['Проклятие Душ','1',['./assets/heroes/icon_proklyatie_dush.jpg','./assets/heroes/icon_proklyatye_dush.jpg'],'💜','Луч света наносит 200% урона + крадет 5 маны у врага и накладывает Страх Душ: -15% урона врага на 4 раунда.','КД: 3 раундов • Мана: 10 • -15% урона врага'],
    ['Аметистовая Тюрьма','2',['./assets/heroes/icon_ametistovaya_tyurma.jpg'],'👻','Призыватель заключает всех врагов в клетку на 1 раунд. В конце раунда клетка взрывается нанося всем 300% урона.','КД: 10 раундов • Мана: 15 • Контроль: Стан AOE 1 раунд'],
    ['Похищение Жизни','3',['./assets/heroes/icon_pokhishchenie_zhizni.jpg'],'💀','Связь с врагом на 4 раунда: 30% урона, который ты получаешь, отражается в врага, и 30% урона врага хилит тебя.','КД: 18 раундов • Мана: 30 • 30% получаемого урона - отдача 30% лайфстил'],
    ['Аметистовый Закат','4',['./assets/heroes/icon_ametistovyy_zakat.jpg'],'🌌','ULTIMATE: Выпускает 5 аметистовых душ, каждая ищет врага и наносит 200% урона + станит на 1 раунд. Если враг один — все 5 попадают в него.','КД: 25 раундов • Мана: 100 • Урон: до 1000% + стан 1 раунд']
  ]
},
'necro-m': {
  n:'GRAVELORD', role:'TANK • Necro - Male',
  img:'./assets/heroes/necro-m.webp',
  thumb:'./assets/heroes/necro-m.webp',
  st:{HP:1150,DEF:110,DMG:190,MANA:260,CRIT:10,DODGE:8},
  sk:[
    ['Костяной Легион','PASSIVE',['./assets/heroes/icon_kostyanoy_legion.jpg'],'🦴','Каждый раунд призывается по 1 скелету помощнику (макс 3). Скелеты наследуют 50% твоего урона.','Скелет 50% урона • Макс скелетов: 3'],
    ['Костяное Копье','1',['./assets/heroes/icon_kostyanoe_kopye.jpg'],'☠','Бросает кость, наносит +150% урона и накладывает Уязвимость Костей: +25% урон от саммонов на 2 раунда.','КД: 4 раунда • Мана: 15 • +25% урона от саммонов'],
    ['Костяной Щит','2',['./assets/heroes/icon_kostyanoy_shchit.jpg'],'🛡','Призывает щит из костей: 20% макс HP. При разрушении взрывается, нанося +300% урона всем врагам.','КД: 10 раундов • Мана: 30 • Щит: 20% HP • Урон +300% AOE'],
    ['Поднять Мертвых','3',['./assets/heroes/icon_podnyat_mertvykh.jpg'],'👥','Воскрешает 2 скелетов подрывников.','КД: 18 раундов • Мана: 30 • Саммоны: 2'],
    ['Могильный Пакт','4',['./assets/heroes/icon_mogilnyy_pakt.jpg'],'💀','ULTIMATE: Жертвует 30% HP и призывает Костяного Титана на 5 раундов.','КД: 25 раундов • Мана: 100 • Титан 200% урона']
  ]
},
'archer-f': {
  n:'WILD PATH', role:'RANGER • Archer - Female',
  img:'./assets/heroes/archer-f.webp',
  thumb:'./assets/heroes/archer-f.webp',
  st:{HP:980,DEF:90,DMG:210,MANA:200,CRIT:25,DODGE:20},
  sk:[
    ['Дух Леса','PASSIVE',['./assets/heroes/icon_dukh_lesa.jpg'],'🌿','Каждый 3-й выстрел призывает духа волка на 2 раунда.','Волк 100% урона'],
    ['Точный Выстрел','1',['./assets/heroes/icon_tochnyy_vystrel.jpg'],'🎯','Выстрел на 200% урона + крит шанс +20%','КД: 3 • Мана: 10'],
    ['Градина Стрел','2',['./assets/heroes/icon_gradina_strel.jpg'],'🏹','5 стрел по 60% урона каждая','КД: 8 • Мана: 20'],
    ['Корни','3',['./assets/heroes/icon_korni.jpg'],'🌱','Корни станят врага на 2 раунда','КД: 15 • Мана: 30'],
    ['Призыв Стаи','4',['./assets/heroes/icon_prizyv_stai.jpg'],'🐺','ULTIMATE: Стая волков 500% урона AOE','КД: 25 • Мана: 100']
  ]
},
'archer-m': {
  n:'DARK RANGER', role:'RANGER • Archer - Male',
  img:'./assets/heroes/archer-m.webp',
  thumb:'./assets/heroes/archer-m.webp',
  st:{HP:1020,DEF:95,DMG:230,MANA:210,CRIT:20,DODGE:18},
  sk:[
    ['Тень','PASSIVE',['./assets/heroes/icon_ten.jpg'],'🌑','Уворот +5% каждый раунд','Стакается до 20%'],
    ['Темная Стрела','1',['./assets/heroes/icon_temnaya_strela.jpg'],'🏹','200% урона + яд 30% на 3 раунда','КД: 3 • Мана: 10'],
    ['Теневой Прыжок','2',['./assets/heroes/icon_tenevoy_pryzhok.jpg'],'💨','Прыжок за спину + крит 100%','КД: 8 • Мана: 20'],
    ['Сеть Теней','3',['./assets/heroes/icon_set_teney.jpg'],'🕸️','Сеть стан 2 раунда всем','КД: 15 • Мана: 30'],
    ['Теневой Легион','4',['./assets/heroes/icon_tenevoy_legion.jpg'],'👥','ULTIMATE: 3 тени по 150% урона','КД: 25 • Мана: 100']
  ]
},
'archmage-m': {
  n:'AZURE SAGE', role:'MAGE • Archmage - Male',
  img:'./assets/heroes/archmage-m.webp',
  thumb:'./assets/heroes/archmage-m.webp',
  st:{HP:900,DEF:80,DMG:260,MANA:320,CRIT:18,DODGE:10},
  sk:[
    ['Мудрость','PASSIVE',['./assets/heroes/icon_mudrost.jpg'],'📘','+2 маны за раунд','Пассивка'],
    ['Ледяная Стрела','1',['./assets/heroes/icon_ledyanaya_strela.jpg'],'❄️','150% урона + заморозка 20%','КД: 3 • Мана: 10'],
    ['Огненный Шар','2',['./assets/heroes/icon_ognennyy_shar.jpg'],'🔥','200% урона + поджог','КД: 8 • Мана: 20'],
    ['Молния','3',['./assets/heroes/icon_molniya.jpg'],'⚡','300% урона всем','КД: 15 • Мана: 30'],
    ['Армагеддон','4',['./assets/heroes/icon_armageddon.jpg'],'🌌','ULTIMATE: 1000% AOE','КД: 25 • Мана: 100']
  ]
},
'mage-f-new': {
  n:'VOLCANIC', role:'MAGE • Fire - Female',
  img:'./assets/heroes/mage-f-new.webp',
  thumb:'./assets/heroes/mage-f-new.webp',
  st:{HP:950,DEF:85,DMG:280,MANA:300,CRIT:22,DODGE:11},
  sk:[
    ['Сердце Кальдеры','PASSIVE',['./assets/heroes/icon_serdtse_kaldery.jpg'],'🌋','Каждое 4 заклинание поджигает землю на 2 раунда нанося 100% урона всем врагам.','КД: 4 • Мана: 20 • Урон: 100% 2 раунда'],
    ['Огненный Шар','1',['./assets/heroes/icon_ognennyy_shar.jpg'],'🔥','Огненный шар наносит 150% урона + поджог 20% урона на 2 раунда.','КД: 4 раунда • Мана: 15 • Урон: 150% + 20% дот'],
    ['Извержение','2',['./assets/heroes/icon_izverzhenie.jpg'],'💥','Взрыв под ногами, отбрасывает всех врагов и наносит 200% урона.','КД: 12 раундов • Мана: 25 • Урон 200% AOE + дот'],
    ['Метеор','3',['./assets/heroes/icon_meteor.jpg'],'☄','Падает метеор нанося 500% урона всем врагам.','КД: 20 раундов • Мана: 50 • Урон 500% + 300% AOE'],
    ['Судный День','4',['./assets/heroes/icon_sudnyy_den.jpg'],'🌋','ULTIMATE: 4 метеора за 4 раунда по области, каждый 200% урона.','КД: 25 раундов • Мана: 100 • Урон: 1000% AOE + дот']
  ]
},
'warrior-f': {
  n:'IRON VOW', role:'SHIELD TANK • Warrior - Female',
  img:'./assets/heroes/warrior-f.webp',
  thumb:'./assets/heroes/warrior-f.webp',
  st:{HP:1250,DEF:160,DMG:175,MANA:180,CRIT:12,DODGE:9},
  sk:[
    ['Клятва Стаи','PASSIVE',['./assets/heroes/icon_klyatva_stai.jpg'],'🐺','При HP <30% урон +50% и +30% лайфстил','КД: — • Мана: 0'],
    ['Рассекающий Волк','1',['./assets/heroes/icon_rassekayushchiy_volk.jpg'],'🗡','2 удара мечом по 110% урона каждый.','КД: 3 раунда • Мана: 5 • Урон: 220%'],
    ['Щит Волчьего Вожака','2',['./assets/heroes/icon_shchit_volchego_vozhaka.jpg'],'🛡','Поднимает щит с волком на 4 раунда, блокирует урон 50%.','КД: 15 раундов • Мана: 20 • Блок: 50%'],
    ['Зов Стаи','3',['./assets/heroes/icon_zov_stai.jpg'],'🐾','Станит 1 врага, все остальные получают 200% урона','КД: 15 раундов • Мана: 20 • Волки: 200% AOE + стан'],
    ['Альфа Хищник','4',['./assets/heroes/icon_alfa_khishchnik.jpg'],'🌕','ULTIMATE: Превращается в волка на 5 раундов','КД: 20 раундов • Мана: 20']
  ]
},
'warrior-m': {
  n:'LION WARDEN', role:'SHIELD TANK • Warrior - Male',
  img:'./assets/heroes/warrior-m.webp',
  thumb:'./assets/heroes/warrior-m.webp',
  st:{HP:1300,DEF:180,DMG:180,MANA:220,CRIT:8,DODGE:7},
  sk:[
    ['Непоколебимая Стена','PASSIVE',['./assets/heroes/icon_nepokolebimaya_stena.jpg'],'🦁','Каждые потерянные 5% HP дают +3% защиты','Защита до +30%'],
    ['Удар Льва','1',['./assets/heroes/icon_udar_lva.jpg'],'⚔','Бросает щит льва вперед, наносит 200% урона','КД: 8 • Мана: 15'],
    ['Имперский Бастион','2',['./assets/heroes/icon_imperskiy_bastion.jpg'],'🛡','Блокирует 50% урона 3 раунда','КД: 15 • Мана: 25'],
    ['Рассекающий удар','3',['./assets/heroes/icon_rassekayushchiy_udar.jpg'],'📯','Мощный рассекающий удар 200% урона','КД: 3 • Мана: 10'],
    ['Аватар Империи','4',['./assets/heroes/icon_avatar_imperii.jpg'],'👑','ULTIMATE: Неуязвимость 2р + 300% AOE 3р','КД: 35 • Мана: 50']
  ]
}
};

const VOLAND_ITEMS = [
 {id:'head',name:'Шлем Ярости',icon:'🪖',slot:'head',bonus:{DMG:20,DEF:10},desc:'+20 урона +10 DEF'},
 {id:'ear1',name:'Серьга Крита',icon:'🔹',slot:'ear1',bonus:{CRIT:1,DMG:5},desc:'+1% крита +5 DMG'},
 {id:'ear2',name:'Серьга Тени',icon:'🔸',slot:'ear2',bonus:{CRIT:1,DODGE:2},desc:'+1% крита +2 DODGE'},
 {id:'amulet',name:'Амулет Душ',icon:'📿',slot:'amulet',bonus:{MANA:50,CRIT:2},desc:'+50 маны +2% крита'},
 {id:'armor',name:'Кольчуга Титана',icon:'🦺',slot:'armor',bonus:{HP:100,DEF:30},desc:'+100 HP +30 DEF'},
 {id:'weapon',name:'Меч Бури',icon:'⚔️',slot:'weapon',bonus:{DMG:40},desc:'+40 урона'},
 {id:'shield',name:'Щит Бастион',icon:'🛡️',slot:'shield',bonus:{DEF:60,HP:50},desc:'+60 DEF +50 HP'},
 {id:'ring1',name:'Кольцо Крови',icon:'💍',slot:'ring1',bonus:{DMG:15,CRIT:1},desc:'+15 урона +1% крита'},
 {id:'ring2',name:'Кольцо Маны',icon:'💍',slot:'ring2',bonus:{MANA:30,DODGE:1},desc:'+30 маны +1 DODGE'},
 {id:'gloves',name:'Перчатки Силы',icon:'🧤',slot:'gloves',bonus:{DEF:15,DMG:10},desc:'+15 DEF +10 DMG'},
 {id:'boots',name:'Ботинки Ветра',icon:'👢',slot:'boots',bonus:{DEF:20,DODGE:2,HP:20},desc:'+20 DEF +2 DODGE +20 HP'},
];

const VOLAND_ITEMS_MAP = {
 head:{DMG:20,DEF:10}, ear1:{CRIT:1,DMG:5}, ear2:{CRIT:1,DODGE:2},
 amulet:{MANA:50,CRIT:2}, armor:{HP:100,DEF:30}, weapon:{DMG:40},
 shield:{DEF:60,HP:50}, ring1:{DMG:15,CRIT:1}, ring2:{MANA:30,DODGE:1},
 gloves:{DEF:15,DMG:10}, boots:{DEF:20,DODGE:2,HP:20}
};

const VOLAND_LOCATIONS = [
 {id:1, name:'ПУСТЫНЯ', eng:'DESERT', icon:'🏜️', type:'Жара • Песок', active:true},
 {id:2, name:'ТЕМНЫЙ ЛЕС', eng:'DARK FOREST', icon:'🌲', type:'Тень • Яд', active:true},
 {id:3, name:'ЛЕДЯНЫЕ ЗЕМЛИ', eng:'FROSTLANDS', icon:'❄️', type:'Холод • Лед', active:true},
 {id:4, name:'БОЛОТО', eng:'SWAMP', icon:'🐊', type:'SOON', active:false},
 {id:5, name:'ВУЛКАН', eng:'VOLCANO', icon:'🌋', type:'SOON', active:false},
 {id:6, name:'РУИНЫ', eng:'RUINS', icon:'🏛️', type:'SOON', active:false},
 {id:7, name:'НЕБЕСА', eng:'SKY ISLANDS', icon:'☁️', type:'SOON', active:false},
 {id:8, name:'БЕЗДНА', eng:'ABYSS', icon:'🕳️', type:'SOON', active:false},
];

const VOLAND_ENEMIES = {
 1: [
   {stage:1, name:'ПЕСЧАНАЯ МЫШЬ', eng:'Sand Gerbil', icon:'🐭', desc:'Безобидный грызун, ворует крошки. Урон 10%', lvl:'LVL 1', hp:40, hpColor:'#3ad080'},
   {stage:2, name:'ПУСТЫННЫЙ СКОРПИОН', eng:'Desert Scorpion', icon:'🦂', desc:'Ядовитое жало, стан 20% шанс. Урон 60%', lvl:'LVL 3', hp:65, hpColor:'#d0b040'},
   {stage:3, name:'ДЕТЕНЫШ ЧЕРВЯ', eng:'Sandworm Cub', icon:'🐛', desc:'Глотает целиком, игнор 15% брони. Урон 140%', lvl:'LVL 5', hp:85, hpColor:'#e05050'},
   {stage:4, name:'ТИТАН ДЮН', eng:'Dune Tyrant - BOSS', icon:'👹', desc:'Босс Пустыни: Песчаная буря + оглушение AOE. Урон 300%', lvl:'BOSS LVL 7', hp:100, hpColor:'#e6d5a0', boss:true},
 ],
 2: [
   {stage:1, name:'ЛЕСНОЙ ЗАЯЦ', eng:'Forest Hare', icon:'🐰', desc:'Быстрый, уворот +10%. Почти не бьет', lvl:'LVL 2', hp:45, hpColor:'#3ad080'},
   {stage:2, name:'ТЕНЕВОЙ ВОЛК', eng:'Shadow Wolf', icon:'🐺', desc:'Прыжок из тени, крит +15%', lvl:'LVL 4', hp:70, hpColor:'#d0b040'},
   {stage:3, name:'ШИПАСТЫЙ МЕДВЕДЬ', eng:'Thorn Bear', icon:'🐻', desc:'Колючая шкура, отражает 20% урона', lvl:'LVL 6', hp:88, hpColor:'#e05050'},
   {stage:4, name:'ДРЕВНИЙ ЭНТ', eng:'Ancient Ent - BOSS', icon:'🌳', desc:'Босс Леса: Корни + реген. Хил 5% в раунд', lvl:'BOSS LVL 8', hp:100, hpColor:'#e6d5a0', boss:true},
 ],
 3: [
   {stage:1, name:'СНЕЖНЫЙ КРОЛИК', eng:'Snow Bunny', icon:'❄️🐰', desc:'Милый, но кусает за палец', lvl:'LVL 3', hp:50, hpColor:'#3ad080'},
   {stage:2, name:'ЛЕДЯНОЙ ВОЛК', eng:'Ice Wolf', icon:'🐺', desc:'Заморозка: -20% скорости на 2 раунда', lvl:'LVL 5', hp:72, hpColor:'#6ab0ff'},
   {stage:3, name:'ЙЕТИ', eng:'Frost Yeti', icon:'🦧', desc:'Морозный рев: -15% урона врага', lvl:'LVL 7', hp:90, hpColor:'#e05050'},
   {stage:4, name:'ЛЕДЯНОЙ ДРАКОН', eng:'Frost Dragon - BOSS', icon:'🐉', desc:'Босс Льда: Дыхание льда AOE 250% + заморозка', lvl:'BOSS LVL 10', hp:100, hpColor:'#e6d5a0', boss:true},
 ],
};
