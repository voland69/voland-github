// VOLAND DROP SYSTEM v3 - resources + potions
// Potions: XS from stage 1, S from stage 2, M from stage 3 (4%), L from boss (5%), XL not dropped yet
function volandGetPotionDropsForEnemy(enemyData){
  try{
    if(!enemyData) return [];
    if(enemyData.boss){
      return [{id:'potion-hp-l',chance:0.05},{id:'potion-mana-l',chance:0.05},{id:'potion-stam-l',chance:0.05}];
    }
    let s = parseInt(enemyData.stage||1);
    let tier = s===1 ? 'xs' : s===2 ? 's' : s===3 ? 'm' : 'xs';
    return [{id:'potion-hp-'+tier,chance:0.04},{id:'potion-mana-'+tier,chance:0.04},{id:'potion-stam-'+tier,chance:0.04}];
  }catch(e){ return []; }
}
function volandRollDrops(enemyData){
  try{
    let res=[];
    let potions=[];
    let equips=[];
    let hasPotionInDrops = false;
    if(enemyData && Array.isArray(enemyData.drops)){
      enemyData.drops.forEach(d=>{
        if(!d || !d.id) return;
        if(Math.random() < (d.chance||0)){
          if(String(d.id).indexOf('potion-')===0){
            potions.push({id:d.id, count:1});
          } else {
            res.push({id:d.id, count:1});
          }
        }
        if(String(d.id).indexOf('potion-')===0) hasPotionInDrops = true;
      });
    }
    // Future-proof: if enemy has no potion drops defined (future locations), auto-add by stage/boss
    if(!hasPotionInDrops && enemyData){
      volandGetPotionDropsForEnemy(enemyData).forEach(d=>{
        if(Math.random() < (d.chance||0)){
          potions.push({id:d.id, count:1});
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
    return {resources:res, potions:potions, equips:equips};
  }catch(e){ return {resources:[], potions:[], equips:[]}; }
}
function volandApplyDrops(drop){
  try{
    if(!drop) return;
    if(drop.resources){
      drop.resources.forEach(r=>{
        if(typeof volandAddResource==='function') volandAddResource(r.id, r.count||1);
      });
    }
    if(drop.potions){
      drop.potions.forEach(p=>{
        if(typeof volandAddToInventory==='function') volandAddToInventory(p.id);
      });
    }
    if(drop.equips){
      drop.equips.forEach(eid=>{
        if(typeof volandAddToInventory==='function') volandAddToInventory(eid);
      });
    }
  }catch(e){}
}
