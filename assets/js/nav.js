// VOLAND NAV - единый навбар для page3-page14. Канон, копий разметки в страницах нет.
// page7 и page8 подсвечивают BATTLE (page6), как было в оригинальной разметке.
(function(){
  var ITEMS = [
    {page:'page3', href:'./page3.html', img:'./assets/ui/nav/hero.webp', label:'HERO'},
    {page:'page4', href:'./page4.html', img:'./assets/ui/nav/bag.webp', label:'BAG'},
    {page:'page5', href:'./page5.html', img:'./assets/ui/nav/skills.webp', label:'SKILLS'},
    {page:'page6', href:'./page6.html', img:'./assets/ui/nav/battle.webp', label:'BATTLE'},
    {page:'page9', href:'./page9.html', img:'./assets/ui/nav/missions.webp', label:'MISSIONS'},
    {page:'page10', href:'./page10.html', img:'./assets/ui/nav/market.webp', label:'MARKET'},
    {page:'page11', href:'./page11.html', img:'./assets/ui/nav/pvp.webp', label:'PVP'},
    {page:'page12', href:'./page12.html', img:'./assets/ui/nav/workshop.webp', label:'WORKSHOP'},
    {page:'page13', href:'./page13.html', img:'./assets/ui/nav/pass.webp', label:'PASS'},
    {page:'page14', href:'./page14.html', img:'./assets/ui/nav/guilds.webp', label:'GUILD'}
  ];
  function currentPage(){
    try{
      var f = (location.pathname.split('/').pop() || '').replace('.html','');
      if(f==='page7' || f==='page8') return 'page6';
      return f;
    }catch(e){ return ''; }
  }
  function render(){
    var el = document.getElementById('voland-nav');
    if(!el) return;
    var cur = currentPage();
    var top = ITEMS.map(function(it){
      var act = (it.page===cur) ? ' active' : '';
      return '<div class="nav-group'+act+'" onclick="location.href=\''+it.href+'\'"><div class="nav-item'+act+'" data-page="'+it.page+'"><img src="'+it.img+'" alt="'+it.label+'"></div><div class="nav-label">'+it.label+'</div></div>';
    }).join('');
    var bottomAct = (cur==='index') ? ' active' : '';
    el.innerHTML = '<div class="nav-top">'+top+'</div><div class="nav-bottom"><div class="nav-group'+bottomAct+'" onclick="location.href=\'./index.html\'"><div class="nav-item'+bottomAct+'" data-page="index"><img src="./assets/ui/nav/start.webp" alt="START"></div><div class="nav-label">START</div></div></div>';
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
