// VOLAND XP SYSTEM v3
if(typeof volandAddXp==='undefined' || volandAddXp.toString().includes('console.log')){
  window.volandAddXp = function(amount){
    try{
      if(typeof volandGetXp==='function' && typeof volandSetXp==='function'){
        let cur=volandGetXp();
        let next=cur + (parseInt(amount)||0);
        return volandSetXp(next);
      }
      return 0;
    }catch(e){ return 0; }
  };
}
