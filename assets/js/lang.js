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

document.addEventListener('DOMContentLoaded', function(){
  volandRenderLangToggle();
  volandApplyStaticLang();
});
