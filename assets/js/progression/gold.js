// VOLAND GOLD SYSTEM v3
function volandGetGoldReal(){ try{ return typeof volandGetGold==='function' ? volandGetGold() : 0; }catch(e){ return 0; } }
if(typeof volandAddGold==='undefined' || volandAddGold.toString().includes('console.log')){
  window.volandAddGold = function(amount){
    try{
      if(typeof volandGetGold==='function' && typeof volandSetGold==='function'){
        let cur=volandGetGold();
        let next=cur + (parseInt(amount)||0);
        return volandSetGold(next);
      }
      return 0;
    }catch(e){ return 0; }
  };
}
