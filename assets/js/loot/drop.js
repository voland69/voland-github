// VOLAND DROP SYSTEM v3 - resources + gear from VOLAND_ENEMIES
function volandRollDrops(enemyData){
  let results = {resources:[], gear:null, gold:0, xp:0};
  try{
    if(!enemyData) return results;
    results.gold = parseInt(enemyData.gold)||0;
    results.xp = parseInt(enemyData.xp)||0;
    // resources
    if(Array.isArray(enemyData.drops)){
      enemyData.drops.forEach(d=>{
        let chance = parseFloat(d.chance)||0;
        if(Math.random() < chance){
          results.resources.push({id:d.id, amount:1});
        }
      });
    }
    // gear chance
    let equipChance = parseFloat(enemyData.equipChance)||0;
    if(equipChance>0 && Math.random() < equipChance){
      if(typeof VOLAND_ITEMS !== 'undefined' && VOLAND_ITEMS.length>0){
        // pick random item weighted by rarity
        let pool = VOLAND_ITEMS.filter(it=> it.slot);
        if(pool.length>0){
          let pick = pool[Math.floor(Math.random()*pool.length)];
          results.gear = pick;
        }
      }
    }
  }catch(e){ console.log('drop error', e); }
  return results;
}

function volandApplyDrops(dropResult){
  try{
    if(!dropResult) return;
    if(dropResult.gold>0 && typeof volandAddGold==='function') volandAddGold(dropResult.gold);
    if(dropResult.xp>0 && typeof volandAddXp==='function') volandAddXp(dropResult.xp);
    if(Array.isArray(dropResult.resources)){
      dropResult.resources.forEach(r=>{
        if(typeof volandAddResource==='function') volandAddResource(r.id, r.amount);
      });
    }
    if(dropResult.gear && typeof volandAddToInventory==='function'){
      volandAddToInventory(dropResult.gear.id);
    }
    return dropResult;
  }catch(e){ console.log('apply drop error', e); }
}
