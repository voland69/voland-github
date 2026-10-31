// VOLAND XP SYSTEM v3 - real persistence
if(typeof volandGetXp !== 'function'){
  function volandGetXp(){
    try{
      let saves = JSON.parse(localStorage.getItem('voland_v1_saves')||'[]');
      let idx = parseInt(localStorage.getItem('voland_v1_active')||'0');
      if(saves[idx] && typeof saves[idx].xp!=='undefined') return parseInt(saves[idx].xp)||0;
      return parseInt(localStorage.getItem('voland_v1_xp')||'0')||0;
    }catch(e){ return 0; }
  }
}
if(typeof volandAddXp !== 'function'){
  function volandAddXp(amount){
    try{
      let cur = volandGetXp();
      let add = parseInt(amount)||0;
      let val = cur + add;
      localStorage.setItem('voland_v1_xp', String(val));
      try{
        let saves = JSON.parse(localStorage.getItem('voland_v1_saves')||'[]');
        let idx = parseInt(localStorage.getItem('voland_v1_active')||'0');
        if(saves[idx]){ saves[idx].xp = val; localStorage.setItem('voland_v1_saves', JSON.stringify(saves)); }
      }catch(e){}
      console.log('XP +'+add+' => '+val);
      return val;
    }catch(e){ return 0; }
  }
}
if(typeof volandSetXp !== 'function'){
  function volandSetXp(amount){
    let val = Math.max(0, parseInt(amount)||0);
    localStorage.setItem('voland_v1_xp', String(val));
    try{
      let saves = JSON.parse(localStorage.getItem('voland_v1_saves')||'[]');
      let idx = parseInt(localStorage.getItem('voland_v1_active')||'0');
      if(saves[idx]){ saves[idx].xp = val; localStorage.setItem('voland_v1_saves', JSON.stringify(saves)); }
    }catch(e){}
    return val;
  }
}
