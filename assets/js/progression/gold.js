// VOLAND GOLD SYSTEM v3 - real persistence via storage.js
// storage.js contains volandGetGold, volandSetGold, volandAddGold
// This file kept for backward compat - ensures functions exist even if storage not loaded
if(typeof volandGetGold !== 'function'){
  function volandGetGold(){
    try{
      let saves = JSON.parse(localStorage.getItem('voland_v1_saves')||'[]');
      let idx = parseInt(localStorage.getItem('voland_v1_active')||'0');
      if(saves[idx] && typeof saves[idx].gold!=='undefined') return parseInt(saves[idx].gold)||0;
      return parseInt(localStorage.getItem('voland_v1_gold')||'0')||0;
    }catch(e){ return 0; }
  }
}
if(typeof volandAddGold !== 'function'){
  function volandAddGold(amount){
    try{
      let cur = volandGetGold();
      let add = parseInt(amount)||0;
      let val = cur + add;
      localStorage.setItem('voland_v1_gold', String(val));
      try{
        let saves = JSON.parse(localStorage.getItem('voland_v1_saves')||'[]');
        let idx = parseInt(localStorage.getItem('voland_v1_active')||'0');
        if(saves[idx]){ saves[idx].gold = val; localStorage.setItem('voland_v1_saves', JSON.stringify(saves)); }
      }catch(e){}
      console.log('Gold +'+add+' => '+val);
      return val;
    }catch(e){ return 0; }
  }
}
if(typeof volandSetGold !== 'function'){
  function volandSetGold(amount){
    let val = Math.max(0, parseInt(amount)||0);
    localStorage.setItem('voland_v1_gold', String(val));
    try{
      let saves = JSON.parse(localStorage.getItem('voland_v1_saves')||'[]');
      let idx = parseInt(localStorage.getItem('voland_v1_active')||'0');
      if(saves[idx]){ saves[idx].gold = val; localStorage.setItem('voland_v1_saves', JSON.stringify(saves)); }
    }catch(e){}
    return val;
  }
}
