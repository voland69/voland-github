// ===== VOLAND LANG v1 — RU / EN switch, Stage 1 =====
// Язык — на устройство (localStorage), а не на героя. При смене героя язык не сбрасывается.
// Картинки с русским текстом не трогаем — только база (текст).
function volandGetLang(){
  try{
    let l = localStorage.getItem('voland_lang');
    if(l==='en' || l==='ru') return l;
  }catch(e){}
  return 'ru';
}
function volandIsEN(){ return volandGetLang()==='en'; }
function volandSetLang(l){
  try{ localStorage.setItem('voland_lang', l==='en' ? 'en' : 'ru'); }catch(e){}
  try{ location.reload(); }catch(e){}
}
function volandT(ru, en){
  return volandGetLang()==='en' ? en : ru;
}
var VOLAND_STATIC_DICT = {
  'ДЕНЬ': 'DAY',
  'НЕДЕЛЯ': 'WEEK',
  'ВСЕГО': 'TOTAL',
  'ЧАТ ГИЛЬДИИ': 'GUILD CHAT',
  'ОБЩИЙ ЧАТ': 'GLOBAL CHAT',
  'УЧАСТНИКИ ГИЛЬДИИ': 'GUILD MEMBERS',
  'ОПЫТ ГИЛЬДИИ': 'GUILD XP',
  'ГИЛЬДИЯ • 2 ВКЛАДКИ': 'GUILD • 2 TABS',
  'СОЗДАТЬ ГИЛЬДИЮ': 'CREATE GUILD',
  'ПОКИНУТЬ ГИЛЬДИЮ': 'LEAVE GUILD',
  'УЧАСТНИКИ': 'MEMBERS',
  'КАЗНА': 'TREASURY',
  'ЗАЛ ГИЛЬДИИ • УЛУЧШЕНИЯ': 'GUILD HALL • UPGRADES',
  'УЛУЧШИТЬ': 'UPGRADE',
  'РЫНОК • 3 ВКЛАДКИ': 'MARKET • 3 TABS',
  'РЕСУРСЫ В СУМКЕ': 'RESOURCES IN BAG',
  '1 • РЫНОК': '1 • MARKET',
  '2 • ОБМЕН': '2 • EXCHANGE',
  'ЦЕНА ПОКУПКИ': 'BUY PRICE',
  'ЦЕНА ПРОДАЖИ': 'SELL PRICE',
  'КУПИТЬ': 'BUY',
  'ПРОДАТЬ': 'SELL',
  'ЗАКРЫТЬ': 'CLOSE',
  'РЕСУРС': 'RESOURCE',
  'ВЫБОР ГЕРОЯ': 'SELECT HERO',
  '8 ГЕРОЕВ': '8 HEROES',
  'ВЫБЕРИ ГЕРОЯ • ВВЕДИ ИМЯ • ПОДТВЕРДИ → СТРАНИЦА ГЕРОЯ': 'CHOOSE HERO • ENTER NAME • CONFIRM → HERO PAGE',
  'ВВЕДИ СВОЁ ИМЯ (мин. 3 символа)': 'ENTER YOUR NAME (min 3 chars)',
  'ВВЕДИ ИМЯ ≥3 СИМВОЛА': 'ENTER NAME ≥3 CHARS',
  'ТЁМНОЕ ФЭНТЕЗИ': 'DARK FANTASY',
  'РПГ': 'RPG',
  'СТАБИЛЬНАЯ': 'STABLE',
  '3 СЛОТА ГЕРОЕВ': '3 HERO SLOTS',
  'СЕЗОН': 'SEASON',
  'НАГРАДЫ': 'REWARDS',
  '← НАЗАД': '← BACK',
  'СЕЗОН 1': 'SEASON 1',
  'МАСТЕРСКАЯ • МОДЕРНИЗАЦИЯ': 'WORKSHOP • UPGRADE',
  'ЗОЛОТО:': 'GOLD:',
  'РЕС:': 'RES:',
  'ТВОЙ ШМОТ': 'YOUR GEAR',
  'Выбери предмет слева для модернизации': 'Choose item on the left to upgrade',
  'Система: 5 мастей (bw → green → blue → red → gold) × 10 уровней': 'System: 5 tiers (bw → green → blue → red → gold) × 10 levels',
  'Золото: 50×lvl, Ресурсы: кварц/дерево/алмаз/вода/камень/кость + клык/эссенция': 'Gold: 50×lvl, Resources: quartz/wood/diamond/water/stone/bone + fang/essence',
  'ПВП АРЕНА • ТЕСТ БОТА': 'PVP ARENA • BOT TEST',
  '8 ГЕРОЕВ • 3 СЛОЖНОСТИ • УМНЫЕ СКИЛЫ • HP x5': '8 HEROES • 3 DIFFICULTIES • SMART SKILLS • HP x5',
  '1 • ВЫБЕРИ СЛОЖНОСТЬ': '1 • CHOOSE DIFFICULTY',
  'ЛЕГКО': 'EASY',
  'СРЕДНЕ': 'MEDIUM',
  'ТЯЖЕЛО': 'HARD',
  'Слабый • Рандом скилы': 'Weak • Random skills',
  'Как ты • Умные скилы': 'Like you • Smart skills',
  '+30% статы • Идеальный AI': '+30% stats • Perfect AI',
  '2 • ВЫБЕРИ ПРОТИВНИКА • 8 ГЕРОЕВ': '2 • CHOOSE OPPONENT • 8 HEROES',
  '3 • ПРОСМОТР И БОЙ': '3 • PREVIEW & FIGHT',
  'ВЫБЕРИ ГЕРОЯ': 'CHOOSE HERO',
  'ИГРОК': 'PLAYER',
  'БОТ': 'BOT',
  'ТЫ': 'YOU',
  '← НАЗАД В ЛОББИ': '← BACK TO LOBBY',
  'Ты победил бота': 'You defeated the bot',
  'РЕВАНШ': 'REMATCH',
  'ЛОББИ': 'LOBBY',
  'ПВП АРЕНА V1': 'PVP ARENA V1',
  'РЫНОК • 3 ВКЛАДКИ': 'MARKET • 3 TABS',
  'ЗОЛОТО:': 'GOLD:',
  'РЕС:': 'RES:',
  'РЕСУРСЫ В СУМКЕ': 'RESOURCES IN BAG',
  '1 • РЫНОК': '1 • MARKET',
  '2 • ОБМЕН': '2 • EXCHANGE',
  'КВАРЦ': 'QUARTZ',
  'РЕСУРС': 'RESOURCE',
  'ЦЕНА ПОКУПКИ': 'BUY PRICE',
  'ЦЕНА ПРОДАЖИ': 'SELL PRICE',
  'КУПИТЬ': 'BUY',
  'ПРОДАТЬ': 'SELL',
  'ЗАКРЫТЬ': 'CLOSE',
  'РЫНОК V1': 'MARKET V1',
  'МИССИИ • 51': 'MISSIONS • 51',
  'В рюкзаке: x0': 'In bag: x0',
  'Сезон 1 • 1 ноября — 31 декабря': 'Season 1 • 1 November — 31 December',
  'Новости и изменения': 'News and changes',
  'Календарь месяца • Ежедневные подарки': 'Month calendar • Daily gifts',
  'Пропустил — сгорел': 'Missed — burned',
  'НОЯБРЬ 2026': 'NOVEMBER 2026',
  '1 — 50 • БЕСПЛАТНО / ПРЕМИУМ': '1 — 50 • FREE / PREMIUM',
  'От общего XP героя': 'From total hero XP',
  'SELECT HERO \u2022 8 \u0413\u0415\u0420\u041e\u0415\u0412': 'SELECT HERO \u2022 8 HEROES',
  '\u0412\u042b\u0411\u0415\u0420\u0418 \u0413\u0415\u0420\u041e\u042f \u2022 \u0412\u0412\u0415\u0414\u0418 \u0418\u041c\u042f \u2022 CONFIRM \u2192 HERO PAGE': 'CHOOSE HERO \u2022 ENTER NAME \u2022 CONFIRM \u2192 HERO PAGE',
  '\u0421\u0438\u0441\u0442\u0435\u043c\u0430: \u041b\u0435\u0439\u0430\u0443\u0442 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d \u2014 \u0443\u0431\u0440\u0430\u043d\u044b \u0437\u0430\u0447\u0435\u0440\u043a\u043d\u0443\u0442\u044b\u0435 \u0431\u043b\u043e\u043a\u0438': 'System: Layout updated \u2014 crossed blocks removed',
  '\u0421\u0422\u0410\u0422\u042b \u0413\u0415\u0420\u041e\u042f \u2014 6 (A+B)': 'HERO STATS \u2014 6 (A+B)',
  '\u042d\u041a\u0418\u041f\u0418\u0420\u041e\u0412\u041a\u0410 \u2014 11 \u2022 \u041a\u041b\u0418\u041a \u0421\u041d\u042f\u0422\u042c': 'EQUIPMENT \u2014 11 \u2022 CLICK TO REMOVE',
  '\u0421\u0435\u0440\u044c\u0433\u0430 1': 'Earring 1',
  '\u0421\u0435\u0440\u044c\u0433\u0430 2': 'Earring 2',
  '\u041e\u0440\u0443\u0436\u0438\u0435': 'Weapon',
  '\u041a\u043e\u043b\u044c\u0446\u043e 1': 'Ring 1',
  '\u041a\u043e\u043b\u044c\u0446\u043e 2': 'Ring 2',
  '\u0428\u043b\u0435\u043c': 'Helmet',
  '\u0410\u043c\u0443\u043b\u0435\u0442': 'Amulet',
  '\u0411\u0440\u043e\u043d\u044f': 'Armor',
  '\u041f\u0435\u0440\u0447\u0430\u0442\u043a\u0438': 'Gloves',
  '\u0411\u043e\u0442\u0438\u043d\u043a\u0438': 'Boots',
  '\u0429\u0438\u0442': 'Shield',
  '\u043f\u0443\u0441\u0442\u043e': 'empty',
  '\u0411\u0410\u0420\u042b \u0413\u0415\u0420\u041e\u042f \u2014 4 (C=D)': 'HERO BARS \u2014 4 (C=D)',
  '\u0418\u041d\u0412\u0415\u041d\u0422\u0410\u0420\u042c \u2014 50 \u2022': 'INVENTORY \u2014 50 \u2022',
  '\u2022 \u041a\u041b\u0418\u041a \u041d\u0410\u0414\u0415\u0422\u042c': '\u2022 CLICK TO EQUIP',
  'CHAT + \u041b\u041e\u0413\u0418 v1': 'CHAT + LOGS v1',
  '\u0421\u0438\u0441\u0442\u0435\u043c\u0430: \u0428\u043c\u043e\u0442 \u0441\u043e\u0445\u0440\u0430\u043d\u044f\u0435\u0442\u0441\u044f \u043c\u0435\u0436\u0434\u0443 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0430\u043c\u0438 (v1) \u2014 \u0441\u0442\u0430\u0431\u0438\u043b\u044c\u043d\u043e': 'System: Gear saves across pages (v1) \u2014 stable',
  '\u041f\u0440\u0435\u0434\u043c\u0435\u0442': 'Item',
  '\u0417\u0410\u041a\u0420\u042b\u0422\u042c': 'CLOSE',
  '\u041d\u0410\u0414\u0415\u0422\u042c': 'EQUIP',
  '\u0421\u0422\u0420\u0410\u041d\u0418\u0426\u0410 5 \u2014 \u0421\u041a\u0418\u041b\u042b \u0413\u0415\u0420\u041e\u042f \u0418\u0417 DB.JS \u2014 6 \u0411\u041e\u041b\u042c\u0428\u0418\u0425 \u041e\u041a\u041e\u041d': 'PAGE 5 \u2014 HERO SKILLS FROM DB.JS \u2014 6 BIG WINDOWS',
  '\u0421\u043a\u0438\u043b\u044b \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043d\u044b \u0438\u0437 VOLAND_HEROES[hero].sk \u2014 5 \u0440\u0435\u0430\u043b\u044c\u043d\u044b\u0445 + 1 SOON': 'Skills loaded from VOLAND_HEROES[hero].sk \u2014 5 real + 1 SOON',
  '\u0418\u043a\u043e\u043d\u043a\u0438 \u0441\u043b\u0435\u0432\u0430 \u2022 \u0427\u0430\u0442 \u0441\u043f\u0440\u0430\u0432\u0430 \u2022 6 \u0431\u043e\u043b\u044c\u0448\u0438\u0445 \u043e\u043a\u043e\u0448\u0435\u043a \u043f\u043e\u0441\u0435\u0440\u0435\u0434\u0438\u043d\u0435': 'Icons left \u2022 Chat right \u2022 6 big windows in middle'
};
function volandApplyStaticLang(){
  if(volandGetLang()!=='en') return;
  try{
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var nodes = []; var n;
    while(n = walker.nextNode()) nodes.push(n);
    nodes.forEach(function(textNode){
      var t = textNode.nodeValue;
      if(!t) return;
      var trimmed = t.trim();
      if(VOLAND_STATIC_DICT[trimmed]){
        textNode.nodeValue = t.replace(trimmed, VOLAND_STATIC_DICT[trimmed]);
      } else {
        for(var ru in VOLAND_STATIC_DICT){
          if(t.indexOf(ru)!==-1){
            textNode.nodeValue = textNode.nodeValue.split(ru).join(VOLAND_STATIC_DICT[ru]);
          }
        }
      }
    });
  }catch(e){}
}
function volandRenderLangToggle(){
  try{
    if(document.getElementById('volandLangToggle')) return;
    var btn = document.createElement('div');
    btn.id = 'volandLangToggle';
    btn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;display:flex;gap:0;border:1px solid #2a3a4a;border-radius:8px;overflow:hidden;font-family:JetBrains Mono,monospace;font-size:11px;font-weight:700;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.4)';
    var lang = volandGetLang();
    var ruBtn = document.createElement('span');
    ruBtn.textContent = 'RU';
    ruBtn.style.cssText = 'padding:6px 10px;background:'+(lang==='ru' ? '#e6d5a0;color:#0a0f14' : '#1a242f;color:#8a9aaa');
    ruBtn.onclick = function(e){ e.stopPropagation(); if(volandGetLang()!=='ru') volandSetLang('ru'); };
    var enBtn = document.createElement('span');
    enBtn.textContent = 'EN';
    enBtn.style.cssText = 'padding:6px 10px;background:'+(lang==='en' ? '#e6d5a0;color:#0a0f14' : '#1a242f;color:#8a9aaa');
    enBtn.onclick = function(e){ e.stopPropagation(); if(volandGetLang()!=='en') volandSetLang('en'); };
    btn.appendChild(ruBtn);
    btn.appendChild(enBtn);
    document.body.appendChild(btn);
  }catch(e){}
}

// ===== VOLAND LANG v1.1 — Stage 2 helpers: missions, titles, months =====
var VOLAND_TITLE_DICT = {
  'ПЕСЧАНЫЙ СТРАННИК': 'SAND WANDERER',
  'ПЕСЧАНЫЙ ОХОТНИК': 'SAND HUNTER',
  'ПЕСЧАНЫЙ ДЕМОН': 'SAND DEMON',
  'ВЛАДЫКА ПУСТЫНИ': 'LORD OF THE DESERT',
  'ЛЕСНОЙ СТРАННИК': 'FOREST WANDERER',
  'ЛЕСНОЙ ОХОТНИК': 'FOREST HUNTER',
  'ЛЕСНОЙ ПРИЗРАК': 'FOREST GHOST',
  'ВЛАДЫКА ЛЕСА': 'LORD OF THE FOREST',
  'ЛЕДЯНОЙ СТРАННИК': 'ICE WANDERER',
  'ЛЕДЯНОЙ ВОИН': 'ICE WARRIOR',
  'ЛЕДЯНОЙ ПАЛАЧ': 'ICE EXECUTIONER',
  'ВЛАДЫКА ЛЬДА': 'LORD OF ICE',
  'ТОПНИК': 'SWAMP WALKER',
  'ЯДОВИТЫЙ ДУХ': 'POISON SPIRIT',
  'КОШМАР БОЛОТА': 'SWAMP NIGHTMARE',
  'ВЛАДЫКА БОЛОТА': 'LORD OF THE SWAMP',
  'ДИТЯ МАГМЫ': 'CHILD OF MAGMA',
  'КУЗНЕЦ ОГНЯ': 'FIRE SMITH',
  'СЕРДЦЕ ВУЛКАНА': 'HEART OF THE VOLCANO',
  'ВЛАДЫКА ВУЛКАНА': 'LORD OF THE VOLCANO',
  'КОСТЯНОЙ СТРАЖ': 'BONE GUARDIAN',
  'РЫЦАРЬ РУИН': 'RUIN KNIGHT',
  'ПОВЕЛИТЕЛЬ КОСТЕЙ': 'LORD OF BONES',
  'ВЛАДЫКА РУИН': 'LORD OF THE RUINS',
  'Убийца Титанов': 'TITAN SLAYER',
  'Ветеран VOLAND': 'VOLAND VETERAN',
  'Архимаг': 'ARCHMAGE'
};
function volandMissionName(m){
  if(!m) return '';
  if(volandGetLang()==='en' && m.eng) return m.eng;
  return m.name || '';
}
function volandMissionTitle(title){
  if(!title) return '';
  if(volandGetLang()==='en' && VOLAND_TITLE_DICT[title]) return VOLAND_TITLE_DICT[title];
  return title;
}
var VOLAND_LOC_EN = {
  'Пустыне': 'Desert',
  'Темном Лесу': 'Dark Forest',
  'Ледяных Землях': 'Frostlands',
  'Болоте': 'Swamp',
  'Вулкане': 'Volcano',
  'Руинах': 'Ruins'
};
function volandMissionDesc(m){
  if(!m) return '';
  let d = m.desc || '';
  if(volandGetLang()!=='en') return d;
  // Точные переводы для не-килл-миссий
  let exact = {
    'Убей 1 босса': 'Kill 1 boss',
    'Убей 3 разных боссов': 'Kill 3 different bosses',
    'Убей 6 разных боссов': 'Kill 6 different bosses',
    'Зайди 7 разных дней в игру': 'Log in 7 different days',
    'Зайди 30 разных дней': 'Log in 30 different days',
    'Собери хотя бы 5 предметов экипировки зеленого тира': 'Collect at least 5 green tier gear items',
    'Собери хотя бы 4 предмета синего тира': 'Collect at least 4 blue tier items',
    'Собери хотя бы 3 предмета красного тира': 'Collect at least 3 red tier items',
    'Собери 1 предмет золотого тира': 'Collect 1 gold tier item',
    'Используй ульту (T) 20 раз': 'Use ultimate (T) 20 times',
    'Используй ульту (T) 50 раз': 'Use ultimate (T) 50 times',
    'Используй ульту (T) 100 раз': 'Use ultimate (T) 100 times',
    'Используй ульту (T) 300 раз': 'Use ultimate (T) 300 times',
    'Используй ульту (T) 600 раз': 'Use ultimate (T) 600 times',
    'Используй ульту (T) 1000 раз': 'Use ultimate (T) 1000 times'
  };
  if(exact[d]) return exact[d];
  // Паттерн: Убей X мобов в LOC
  let mm = d.match(/^Убей\s+(\d+)\s+мобов\s+в\s+(.+)$/);
  if(mm){
    let n = mm[1];
    let loc = mm[2];
    let locEn = VOLAND_LOC_EN[loc] || loc;
    return 'Kill ' + n + ' mobs in ' + locEn;
  }
  return d;
}
var VOLAND_MONTH_GEN = {
  'января': 'January', 'февраля': 'February', 'марта': 'March', 'апреля': 'April', 'мая': 'May', 'июня': 'June',
  'июля': 'July', 'августа': 'August', 'сентября': 'September', 'октября': 'October', 'ноября': 'November', 'декабря': 'December'
};
var VOLAND_MONTH_UP = {
  'ЯНВАРЬ': 'JANUARY', 'ФЕВРАЛЬ': 'FEBRUARY', 'МАРТ': 'MARCH', 'АПРЕЛЬ': 'APRIL', 'МАЙ': 'MAY', 'ИЮНЬ': 'JUNE',
  'ИЮЛЬ': 'JULY', 'АВГУСТ': 'AUGUST', 'СЕНТЯБРЬ': 'SEPTEMBER', 'ОКТЯБРЬ': 'OCTOBER', 'НОЯБРЬ': 'NOVEMBER', 'ДЕКАБРЬ': 'DECEMBER'
};
var VOLAND_RES_RU = {
  'Кварц': 'Quartz', 'Дерево': 'Wood', 'Алмаз': 'Diamond', 'Вода': 'Water', 'Камень': 'Stone', 'Кость': 'Bone'
};
function volandMonthGen(ru){ return volandGetLang()==='en' && VOLAND_MONTH_GEN[ru] ? VOLAND_MONTH_GEN[ru] : ru; }
function volandMonthUp(ru){ return volandGetLang()==='en' && VOLAND_MONTH_UP[ru] ? VOLAND_MONTH_UP[ru] : ru; }
function volandResName(ru){ return volandGetLang()==='en' && VOLAND_RES_RU[ru] ? VOLAND_RES_RU[ru] : ru; }


// ===== VOLAND LANG v1.2 — Stage 3 helpers: items, heroes skills, enemies, resources =====
var VOLAND_ITEM_SLOT = {
  'Амулет': 'Amulet', 'Ботинки': 'Boots', 'Броня': 'Armor', 'Лук': 'Bow', 'Меч': 'Sword',
  'Перчатки': 'Gloves', 'Посох': 'Staff', 'Шлем': 'Helmet', 'Щит': 'Shield',
  'Кольцо': 'Ring', 'Серьга': 'Earring'
};
var VOLAND_ITEM_COLOR = {
  'Серый': 'Gray', 'Зеленый': 'Green', 'Синий': 'Blue', 'Красный': 'Red', 'Золотой': 'Gold'
};
function volandItemName(item){
  if(!item) return '';
  let name = typeof item === 'string' ? item : (item.name || '');
  if(volandGetLang()!=='en') return name;
  // Паттерн: "Амулет Серый Lvl1", "Серьга 1 Серый Lvl1", "Кольцо 2 Синий Lvl5"
  // Разбираем: [Слот] [номер?] [Цвет] LvlN
  let m = name.match(/^(\S+)(?:\s+(\d+))?\s+(\S+)\s+(Lvl\d+)$/);
  if(m){
    let slot = VOLAND_ITEM_SLOT[m[1]] || m[1];
    let num = m[2] ? ' ' + m[2] : '';
    let col = VOLAND_ITEM_COLOR[m[3]] || m[3];
    return slot + num + ' ' + col + ' ' + m[4];
  }
  return name;
}
function volandEnemyName(e){
  if(!e) return '';
  if(volandGetLang()==='en' && e.eng) return e.eng;
  return e.name || '';
}
var VOLAND_RES_DESC = {
  'Основная валюта': 'Main currency',
  'Кварц с пустыни, 10% дроп': 'Quartz from desert, 10% drop',
  'Дерево с лесных, 10% дроп': 'Wood from forest, 10% drop',
  'Алмаз с ледяных, 10% дроп': 'Diamond from frostlands, 10% drop',
  'Клык со всех мобов, 5% дроп': 'Fang from all mobs, 5% drop',
  'Эссенция со всех мобов, 5% дроп': 'Essence from all mobs, 5% drop',
  'Вода с болота, 10% дроп': 'Water from swamp, 10% drop',
  'Камень с вулкана, 10% дроп': 'Stone from volcano, 10% drop',
  'Кость с руин, 10% дроп': 'Bone from ruins, 10% drop'
};
function volandResourceName(r){
  if(!r) return '';
  if(volandGetLang()==='en' && r.eng) return r.eng;
  return r.name || '';
}
function volandResourceDesc(desc){
  if(!desc) return '';
  if(volandGetLang()==='en' && VOLAND_RES_DESC[desc]) return VOLAND_RES_DESC[desc];
  return desc;
}
var VOLAND_SKILL_DICT = {
  'Шепот Аметиста': {en:'Amethyst Whisper', desc:'Every 3rd spell summons an amethyst spirit for 3 rounds. Spirit hits for 100% of caster damage and gives you +5 mana per round while alive.', short:'Spirit: 100% damage • Mana: +5 per round'},
  'Проклятие Душ': {en:'Soul Curse', desc:'Beam deals 200% damage + steals 5 mana from enemy and applies Soul Fear: -20% enemy damage for 2 rounds.', short:'CD: 3 rounds • Mana: 10 • -20% enemy damage 2r'},
  'Аметистовая Тюрьма': {en:'Amethyst Prison', desc:'Caster traps all enemies in a cage for 1 round. At end of round cage explodes dealing 300% damage to all.', short:'CD: 10 rounds • Mana: 15 • Control: Stun AOE 1 round'},
  'Похищение Жизни': {en:'Life Steal', desc:'Link with enemy for 4 rounds: 30% of damage you take is reflected to enemy, and 30% of enemy damage heals you.', short:'CD: 18 rounds • Mana: 30 • 30% taken damage - reflect 30% lifesteal'},
  'Аметистовый Закат': {en:'Amethyst Sunset', desc:'ULTIMATE: Releases 5 amethyst souls, each seeks enemy and deals 200% damage + stuns 1 round. If enemy is alone — all 5 hit it.', short:'CD: 25 rounds • Mana: 100 • Damage: up to 1000% + stun 1 round'},
  'Костяной Легион': {en:'Bone Legion', desc:'Every round summons 1 skeleton helper (max 3). Skeletons inherit 100% of your damage. Skeletons are immortal and fight until end of battle.', short:'Skeleton 100% damage • Max skeletons: 3'},
  'Костяное Копье': {en:'Bone Spear', desc:'Throws bone, deals +150% damage and applies Bone Vulnerability: +25% damage from summons for 2 rounds.', short:'CD: 4 rounds • Mana: 15 • +25% damage from summons'},
  'Костяной Щит': {en:'Bone Shield', desc:'Summons bone shield: 20% max HP. When destroyed explodes, dealing +300% damage to all enemies.', short:'CD: 10 rounds • Mana: 30 • Shield: 20% HP • Damage +300% AOE'},
  'Поднять Мертвых': {en:'Raise Dead', desc:'Resurrects 2 bomber skeletons. In round 1, 1 skeleton explodes dealing 200% damage to all. Second skeleton explodes in round 2 dealing 300% damage to all.', short:'CD: 18 rounds • Mana: 30 • Summons: 2'},
  'Армия Погибели': {en:'Army of Doom', desc:'ULTIMATE: Summons 5 skeletons for 3 rounds. Each skeleton has 100% of summoner damage.', short:'CD: 25 rounds • Mana: 100 • Titan 200% damage'},
  'Тропы Зверя': {en:'Beast Trails', desc:'On dodge, next hit is 100% critical.', short:'CD: — • Mana: 0'},
  'Двойной Выстрел': {en:'Double Shot', desc:'Fires 2 arrows for 200% damage each. If both hit one target — bleeding 25% damage ignoring defense for 2 rounds.', short:'CD: 3 rounds • Mana: 5 • Damage: 400% + dot true 2r'},
  'Ядовитая Лиана': {en:'Poison Vine', desc:'Throws vine at nearest enemy dealing 200% damage. Enemy is stunned 1 round and poisoned 3 rounds. Poisoned enemy takes 25% damage ignoring defense for 3 rounds.', short:'CD: 10 rounds • Mana: 15 • Damage 200% + stun 1r + poison 25% true 3r'},
  'Глаз Ястреба': {en:'Hawk Eye', desc:'For 4 rounds sees all enemies in radius (even in invis) and gets +25% crit chance. Attacks ignore 20% armor.', short:'CD: 20 rounds • Mana: 20 • Crit: +25%'},
  'Буря Стрел': {en:'Arrow Storm', desc:'ULTIMATE: Jump in air, 9 arrows over 3 rounds in area. Each 150% damage + 25% stun chance 1 round.', short:'CD: 25 rounds • Mana: 30 • Damage: up to 1350% + stun'},
  'Метка Тени': {en:'Shadow Mark', desc:'Every 4th attack applies Shadow Mark for 2 rounds. Marked targets take +100% damage from your arrows. Killing marked target restores 15 mana.', short:'CD: — • Mana: 0 • +100% 2 rounds'},
  'Беглый выстрел': {en:'Rapid Shot', desc:'Shoots nearest enemy, dealing 200% damage.', short:'CD: 3 rounds • Mana: 5 • Damage: 200%'},
  'Шаг в Ничто': {en:'Step into Nothing', desc:'Becomes invisible for 3 rounds. Next attack in invis is guaranteed crit and removes invis effect.', short:'CD: 20 rounds • Mana: 25'},
  'Призрачная Стрела': {en:'Ghost Arrow', desc:'Fires arrow passing through enemies. Deals 200% damage and stuns 1 round with 33% chance. Pierces up to 3 targets.', short:'CD: 5 rounds • Mana: 20 • Damage: 200% + stun 33%'},
  'Залп Бездны': {en:'Abyss Volley', desc:'ULTIMATE: Fires 7 arrows. Each arrow deals 200% damage to one enemy. If target is alone — all damage hits it 1400% damage.', short:'CD: 25 rounds • Mana: 40 • Damage: 1400% (7×200%)'},
  'Искривление Времени': {en:'Time Warp', desc:'Each spell increases base damage by 10%, stacks 5 rounds. At 5 stacks next spell casts +50% damage.', short:'Stacks: 5 rounds • Bonus: +50% base damage'},
  'Ледяное Копье': {en:'Ice Spear', desc:'Throws ice spear at enemy back, dealing +250% damage and reduces its defense by 20%.', short:'CD: 3 rounds • Mana: 10 • Damage: 235×2.5 • DEF -20%'},
  'Сфера Бури': {en:'Storm Sphere', desc:'Creates sphere that for 3 rounds hits nearest enemies with lightning (3 targets) for +160% damage each round.', short:'CD: 10 rounds • Mana: 20 • Ticks: 3×235×160%'},
  'Лавина': {en:'Avalanche', desc:'Summons avalanche dealing +300% damage to all enemies.', short:'CD: 15 rounds • Mana: 30 • Damage: 235×3 to all enemies'},
  'Аннигиляция Времени': {en:'Time Annihilation', desc:'ULTIMATE: Freezes time for 2 rounds (enemies cannot move/attack) (stun), then explosion for +350% damage to all.', short:'CD: 25 rounds • Mana: 50 • Damage: 350% + control 2 rounds'},
  'Сердце Кальдеры': {en:'Caldera Heart', desc:'Every 4th spell ignites ground for 2 rounds dealing 100% damage to all enemies.', short:'CD: 4 • Mana: 20 • Damage: 100% 2 rounds'},
  'Огненный Шар': {en:'Fireball', desc:'Fireball deals 150% damage + burn 20% damage for 2 rounds. On crit — all enemies take damage.', short:'CD: 4 rounds • Mana: 15 • Damage: 150% + 20% dot'},
  'Извержение': {en:'Eruption', desc:'Explosion under feet, knocks back all enemies and deals 200% damage. Leaves lava for 3 rounds: 50% damage per round to all enemies.', short:'CD: 12 rounds • Mana: 25 • Damage 200% AOE + dot'},
  'Метеор': {en:'Meteor', desc:'Meteor falls dealing 500% damage to all enemies. Next round shockwave deals another 300% damage to all enemies.', short:'CD: 20 rounds • Mana: 50 • Damage 500% + 300% AOE'},
  'Судный День': {en:'Doomsday', desc:'ULTIMATE: 4 meteors over 4 rounds in area, each 200% damage. Last — supermeteor 400% + ground burn 50% damage for 2 rounds.', short:'CD: 25 rounds • Mana: 100 • Damage: 1000% AOE + dot'},
  'Клятва Стаи': {en:'Pack Oath', desc:'At HP <30% damage +50% and +30% lifesteal from dealt damage.', short:'CD: — • Mana: 0'},
  'Рассекающий Волк': {en:'Rending Wolf', desc:'2 sword hits for 200% damage each.', short:'CD: 3 rounds • Mana: 5 • Damage: 400%'},
  'Щит Волчьего Вожака': {en:'Wolf Alpha Shield', desc:'Raises shield with wolf for 4 rounds, blocks damage with 50% chance. Successful block gives counterattack for 350% damage.', short:'CD: 15 rounds • Mana: 20 • Block: 50%'},
  'Зов Стаи': {en:'Pack Call', desc:'Wolf howl stuns 1 enemy, all other enemies take 200% damage, stunned enemy takes damage twice.', short:'CD: 15 rounds • Mana: 20 • Wolves: 200% AOE + stun'},
  'Альфа Хищник': {en:'Alpha Predator', desc:'ULTIMATE: Turns into wolf for 5 rounds: +50% max HP, +30% damage. Cast itself deals no damage. All attacks in wolf form cause bleeding 50% true damage.', short:'CD: 20 rounds • Mana: 20 • +50% HP +30% damage + 50% true bleed from attacks, no damage on cast'},
  'Непоколебимая Стена': {en:'Unshakable Wall', desc:'For every 5% lost HP gets +3% DEF (up to 30%). At HP <30% gets shield 15% max HP for 4 rounds (once per battle).', short:'CD: - • Mana: 0 • DEF bonus: up to 30% • Shield: 15%'},
  'Удар Льва': {en:'Lion Strike', desc:'Powerful shield hit, deals 200% damage + stun 1 round.', short:'CD: 8 rounds • Mana: 10 • Stun: 1 round • Damage 200%'},
  'Имперский Бастион': {en:'Imperial Bastion', desc:'Raises shield for 3 rounds, blocks 50% damage and reflects 25% damage back. Allies behind take -20% damage.', short:'CD: 15 rounds • Mana: 30 • Block: 50% • Reflect 25%'},
  'Рассекающий удар': {en:'Rending Strike', desc:'Sword hit 200% damage to nearest enemy.', short:'CD: 3 rounds • Mana: 5 • Damage 200%'},
  'Аватар Империи': {en:'Empire Avatar', desc:'ULTIMATE: Invulnerable for 2 rounds, +50% max HP, +200% damage for 3 rounds. All enemies on field take 200% damage once.', short:'CD: 35 rounds • Mana: 50 • Damage: +200% • HP: +50%'}
};
function volandSkillName(name){
  if(!name) return '';
  if(volandGetLang()==='en' && VOLAND_SKILL_DICT[name]) return VOLAND_SKILL_DICT[name].en;
  return name;
}
function volandSkillDesc(desc){
  if(!desc) return '';
  if(volandGetLang()!=='en') return desc;
  for(let k in VOLAND_SKILL_DICT){
    if(VOLAND_SKILL_DICT[k].desc && desc.indexOf(VOLAND_SKILL_DICT[k].desc)!==-1) return desc;
    // Точное совпадение по русскому — ищем по ключу: если desc равен русскому описанию из словаря? Нет, словарь хранит только EN, поэтому ищем по русскому через обратный поиск
  }
  // Паттерн-замены для коротких описаний: КД, Мана, урона и т.д.
  let out = desc;
  out = out.replace(/КД:/g, 'CD:');
  out = out.replace(/Мана:/g, 'Mana:');
  out = out.replace(/раундов/g, 'rounds');
  out = out.replace(/раунда/g, 'rounds');
  out = out.replace(/раунд/g, 'round');
  out = out.replace(/урона/g, 'damage');
  out = out.replace(/Урон:/g, 'Damage:');
  out = out.replace(/Урон/g, 'Damage');
  out = out.replace(/Дух:/g, 'Spirit:');
  out = out.replace(/Щит:/g, 'Shield:');
  out = out.replace(/Крит:/g, 'Crit:');
  out = out.replace(/Блок:/g, 'Block:');
  out = out.replace(/Стан:/g, 'Stun:');
  out = out.replace(/Стаки:/g, 'Stacks:');
  out = out.replace(/Бонус:/g, 'Bonus:');
  out = out.replace(/Тиков:/g, 'Ticks:');
  out = out.replace(/Саммоны:/g, 'Summons:');
  out = out.replace(/Скелет/g, 'Skeleton');
  out = out.replace(/Макс скелетов:/g, 'Max skeletons:');
  out = out.replace(/дот/g, 'dot');
  out = out.replace(/яд/g, 'poison');
  out = out.replace(/Контроль:/g, 'Control:');
  return out;
}
function volandSkillLong(rusName, rusDesc){
  if(volandGetLang()==='en' && VOLAND_SKILL_DICT[rusName]) return VOLAND_SKILL_DICT[rusName].desc;
  return rusDesc;
}
function volandSkillShort(rusName, rusShort){
  if(volandGetLang()==='en' && VOLAND_SKILL_DICT[rusName]) return VOLAND_SKILL_DICT[rusName].short;
  return volandSkillDesc(rusShort);
}


// ===== VOLAND LANG v1.3 — Stage 4: battle logs (FIX2 — whole phrases, no poisony) =====
function volandBattleLog(t){
  if(!t) return t;
  if(volandGetLang()!=='en') return t;
  let out = String(t);
  // 0. Pre — хвосты со скринов 10:31 / 10:35, длинные первыми
  out = out.split('Ты оглушен').join('You are stunned');
  out = out.split('Ты ').join('You ');
  out = out.split('(авто)').join('(auto)');
  out = out.split('авто').join('auto');
  out = out.split('суперметеор').join('supermeteor');
  out = out.split('Суперметеор').join('Supermeteor');
  out = out.split('оглушенному').join('stunned');
  out = out.split('оглушенного').join('stunned');
  out = out.split('отражается').join('is reflected');
  out = out.split('хилит').join('heals');
  out = out.split('получаемого').join('taken');
  out = out.split('взрыв').join('explosion');
  out = out.split('Аннигиляция Времени').join('Time Annihilation');
  out = out.split('Аннигиляция').join('Annihilation');
  out = out.split('Времени').join('Time');
  out = out.split(' на ').join(' for ');
  out = out.split(' по ').join(' for ');
  out = out.split(' и ').join(' and ');
  out = out.split('победил').join('defeated');
  out = out.split('ПОБЕДА!').join('VICTORY!');
  out = out.split('бафы/дебафы').join('buffs/debuffs');
  // 1. Скиллы — целые имена, длинные первыми
  try{
    let keys = Object.keys(VOLAND_SKILL_DICT).sort((a,b)=>b.length-a.length);
    for(let k of keys){
      if(out.indexOf(k)!==-1) out = out.split(k).join(VOLAND_SKILL_DICT[k].en);
    }
  }catch(e){}
  // 2. Целые фразы — длинные первыми, чтобы "эффекты: яды, скелеты, сферы" не разбилась на куски
  let phrases = [
    ['эффекты: яды, скелеты, сферы', 'effects: poisons, skeletons, spheres'],
    ['Эффекты: яды, скелеты, сферы', 'Effects: poisons, skeletons, spheres'],
    ['Конец раунда', 'End of round'],
    ['конец раунда', 'end of round'],
    ['Не хватает маны', 'Not enough mana'],
    ['Нет лута', 'No loot'],
    ['Ты победил', 'You defeated'],
    ['Тебя победил', 'Defeated you'],
    ['Твой ход', 'Your turn'],
    ['твой ход', 'your turn'],
    ['ТВОЙ ХОД', 'YOUR TURN'],
    ['ПОБЕДА!', 'VICTORY!'],
    ['ПОРАЖЕНИЕ!', 'DEFEAT!'],
    ['НИЧЬЯ!', 'DRAW!'],
    ['пропускает ход (нет маны)', 'skips turn (no mana)'],
    ['пропускает ход', 'skips turn'],
    ['Ударная волна', 'Shockwave'],
    ['Контратака Волка', 'Wolf Counter'],
    ['Уязвимость Костей', 'Bone Vulnerability'],
    ['Поджог земли', 'Ground burn'],
    ['100% урона', '100% damage'],
    ['без маны', 'no mana'],
    ['неуязвим', 'invulnerable'],
    ['уклонился', 'dodged'],
    ['оглушен', 'stunned'],
    ['убит!', 'killed!'],
    ['Кровотечение', 'Bleeding'],
    ['кровотечение', 'bleeding'],
    ['Горение', 'Burning'],
    ['эффекты', 'effects'],
    ['Эффекты', 'Effects'],
    ['яды', 'poisons'],
    ['скелеты', 'skeletons'],
    ['сферы', 'spheres'],
    ['Сферы', 'Spheres'],
    ['Скелеты', 'Skeletons'],
    ['Игрок:', 'Player:'],
    ['Бот:', 'Bot:'],
    ['Раунд', 'Round'],
    ['ХОД ', 'TURN '],
    ['взорвался', 'exploded'],
    ['в клетке', 'in cage'],
    ['невидимость', 'invisibility'],
    ['инвиз крит', 'invis crit'],
    ['инвиз', 'invis'],
    ['гарант крит', 'guaranteed crit'],
    ['Урон:', 'Damage:'],
    ['Мана:', 'Mana:'],
    ['маны', 'mana'],
    ['КД:', 'CD:'],
    ['Лава', 'Lava'],
    ['Щит', 'Shield'],
    ['Блок:', 'Block:'],
    ['поглотил', 'absorbed'],
    ['урона', 'damage']
  ];
  // Сортируем по длине, чтобы длинные фразы шли первыми
  phrases.sort((a,b)=>b[0].length-a[0].length);
  for(let p of phrases){
    if(out.indexOf(p[0])!==-1) out = out.split(p[0]).join(p[1]);
  }
  out = out.replace(/стан(?=[\s,\:\]\!\.]|$)/g, 'stun');
  
  // FIX LOG — полный словарь PVP лога
  let extra = [
    ['Пассивы активны', 'Passives active'],
    ['Пассивка:', 'Passive:'],
    ['Оба пали', 'Both fell'],
    ['бафы/дебафы', 'buffs/debuffs'],
    ['5 стаков! След. заклинание', '5 stacks! Next spell'],
    ['стаков', 'stacks'],
    ['След. заклинание', 'Next spell'],
    ['Ударная волна Метеора', 'Meteor shockwave'],
    ['Ударная волна через', 'Shockwave in'],
    ['Ударная волна', 'Shockwave'],
    ['Уязвимость Костей', 'Bone Vulnerability'],
    ['Удар Льва', 'Lion Strike'],
    ['Сфера Бури', 'Storm Sphere'],
    ['Лава', 'Lava'],
    ['Поджог земли', 'Ground burn'],
    ['Сердце Кальдеры: земля горит', 'Caldera Heart: ground burns'],
    ['земля горит', 'ground burns'],
    ['Судный День', 'Doomsday'],
    ['метеора', 'meteors'],
    ['метеоров', 'meteors'],
    ['метеор', 'meteor'],
    ['суперметеор', 'supermeteor'],
    ['Суперметеор', 'Supermeteor'],
    ['5 душ', '5 souls'],
    ['душ', 'souls'],
    ['дух призван', 'spirit summoned'],
    ['Дух', 'Spirit'],
    ['дух', 'spirit'],
    ['заморозка', 'freeze'],
    ['Залп Бездны', 'Abyss Volley'],
    ['7 стрел', '7 arrows'],
    ['9 стрел', '9 arrows'],
    ['стрел', 'arrows'],
    ['Стрела Бездны', 'Abyss Arrow'],
    ['Стрела', 'Arrow'],
    ['стрела', 'arrow'],
    ['Шаг в Ничто', 'Step into Nothing'],
    ['атака из инвиза', 'attack from invis'],
    ['невидимость', 'invisibility'],
    ['Альфа Хищник', 'Alpha Predator'],
    ['Волк', 'Wolf'],
    ['кончился', 'ended'],
    ['Буря Стрел', 'Arrow Storm'],
    ['Буря', 'Storm'],
    ['Клятва Стаи', 'Pack Oath'],
    ['Контратака Волка', 'Wolf Counter'],
    ['Зов Стаи', 'Pack Call'],
    ['по оглушенному', 'to stunned'],
    ['оглушенному', 'stunned'],
    ['Тропы Зверя', 'Beast Trails'],
    ['след. удар', 'next hit'],
    ['Метка Тени', 'Shadow Mark'],
    ['отмечен', 'marked'],
    ['Убийство метки', 'Mark kill'],
    ['неуязв', 'invuln'],
    ['неуязвим', 'invulnerable'],
    ['Аватар Империи', 'Empire Avatar'],
    ['Аватар урон', 'Avatar damage'],
    ['Поднять Мертвых', 'Raise Dead'],
    ['подрывника', 'bombers'],
    ['подрывников', 'bombers'],
    ['Подрывник', 'Bomber'],
    ['взорвался', 'exploded'],
    ['Аметистовая Тюрьма', 'Amethyst Prison'],
    ['в клетке', 'in cage'],
    ['взрыв в конце', 'explosion at end'],
    ['Армия Погибели', 'Army of Doom'],
    ['скелетов', 'skeletons'],
    ['скелет', 'skeleton'],
    ['Скелеты', 'Skeletons'],
    ['Скелет', 'Skeleton'],
    ['Похищение Жизни', 'Life Steal'],
    ['связь', 'link'],
    ['получаемого урона отражается и хилит', 'of taken damage reflected and heals'],
    ['отраж', 'reflect'],
    ['хил', 'heal'],
    ['Страх Душ', 'Soul Fear'],
    ['кража', 'steal'],
    ['оглушен', 'stunned'],
    ['пропускает ход', 'skips turn'],
    ['пропускаешь ход', 'skip turn'],
    ['Ты оглушен', 'You are stunned'],
    ['Поджог', 'Burn'],
    ['Горение', 'Burning'],
    ['Крит Огненного Шара', 'Fireball Crit'],
    ['все враги получают урон', 'all enemies take damage'],
    ['Костяной Щит', 'Bone Shield'],
    ['при разрушении взрыв', 'on destroy explosion'],
    ['Щит', 'Shield'],
    ['поглотил', 'absorbed'],
    ['осталось', 'left'],
    ['Щит Волчьего Вожака', 'Wolf Alpha Shield'],
    ['контра', 'counter'],
    ['Непоколебимая Стена', 'Unshakable Wall'],
    ['Глаз Ястреба', 'Hawk Eye'],
    ['крит', 'crit'],
    ['игнор', 'ignore'],
    ['брони', 'armor'],
    ['Костяной Легион', 'Bone Legion'],
    ['всего', 'total'],
    ['Кровотечение', 'Bleeding'],
    ['кровотечение', 'bleeding'],
    ['Отражение', 'Reflect'],
    ['скилл на КД', 'skill on CD'],
    ['Скилл на КД', 'Skill on CD'],
    ['не хватает маны', 'not enough mana'],
    ['Не хватает маны', 'Not enough mana'],
    ['Пассивы', 'Passives'],
    ['за 4р по', 'over 4r for'],
    ['за 3р по', 'over 3r for'],
    ['за 4р', 'over 4r'],
    ['за 3р', 'over 3r'],
    ['по 150%', 'for 150%'],
    ['по 200%', 'for 200%'],
    ['по 100%', 'for 100%'],
    ['по 160%', 'for 160%'],
    ['каждый раунд', 'each round'],
    ['каждого', 'each'],
    ['на 2р', 'for 2r'],
    ['на 3р', 'for 3r'],
    ['на 4р', 'for 4r'],
    ['на 1р', 'for 1r'],
    ['в 1р', 'in 1r'],
    ['во 2р', 'in 2r'],
    ['4р', '4r'],
    ['3р', '3r'],
    ['2р', '2r'],
    ['1р', '1r'],
    ['р]', 'r]'],
    ['р,', 'r,'],
    ['р!', 'r!'],
    ['р.', 'r.']
  ];
  for(let p of extra){
    if(out.indexOf(p[0])!==-1) out = out.split(p[0]).join(p[1]);
  }
  // Цифра + Cyrillic р -> цифра + r (напр. 5р -> 5r)
  out = out.replace(/(\d+)р/g, '$1r');
  // Остаток: " за " в контексте "9 стрел за 3r" уже покрыт, но " за " одиночный -> " over "
  out = out.replace(/ за /g, ' over ');

  // 2b. Яд — только целое слово, чтобы не ломать Ядовитая
  out = out.replace(/Яд(?=[\s,\:\]\!\.])/g, 'Poison');
  out = out.replace(/яд(?=[\s,\:\]\!\.])/g, 'poison');
  // 3. АТАКА — только целое слово, не внутри других слов
  out = out.replace(/(^|[^A-Za-zА-Яа-яЁё])АТАКА([^A-Za-zА-Яа-яЁё]|$)/g, '$1ATTACK$2');
  return out;
}
document.addEventListener('DOMContentLoaded', function(){
  volandRenderLangToggle();
  volandApplyStaticLang();
});
