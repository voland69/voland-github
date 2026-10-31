// VOLAND DROP SYSTEM v3
function volandRollDrops(enemyData){
  try{
    let res=[];
    let equips=[];
    if(enemyData && Array.isArray(enemyData.drops)){
      enemyData.drops.forEach(d=>{
        if(Math.random() < (d.chance||0)){
          res.push({id:d.id, count:1});
        }
      });
    }
    if(enemyData && enemyData.equipChance && Math.random() < enemyData.equipChance){
      if(typeof VOLAND_ITEMS!=='undefined'){
        let pool = VOLAND_ITEMS.filter(it=>it.slot);
        if(pool.length>0){
          let pick = pool[Math.floor(Math.random()*pool.length)];
          equips.push(pick.id);
        }
      }
    }
    return {resources:res, equips:equips};
  }catch(e){ return {resources:[], equips:[]}; }
}
function volandApplyDrops(drop){
  try{
    if(!drop) return;
    if(drop.resources){
      drop.resources.forEach(r=>{
        if(typeof volandAddResource==='function') volandAddResource(r.id, r.count||1);
      });
    }
    if(drop.equips){
      drop.equips.forEach(eid=>{
        if(typeof volandAddToInventory==='function') volandAddToInventory(eid);
      });
    }
  }catch(e){}
}
