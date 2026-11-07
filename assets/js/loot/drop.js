// VOLAND DROP SYSTEM v4 — ресурсы + зелья. Шмота в луте нет вообще.
function volandRollDrops(enemyData){
  try{
    let res=[];
    let potions=[];
    if(enemyData && Array.isArray(enemyData.drops)){
      enemyData.drops.forEach(d=>{
        if(Math.random() < (d.chance||0)){
          res.push({id:d.id, count:1});
        }
      });
    }
    // Зелья: шанс как у ресурсов (шанс основного ресурса) — 10% у обычных, 20% у боссов
    // Размер по стадии: 1 -> XS, 2 -> S, 3 -> M, 4 (босс) -> L. XL нигде не падает.
    let stage = enemyData ? enemyData.stage : 1;
    let sizeMap = {1:'xs', 2:'s', 3:'m', 4:'l'};
    let size = sizeMap[stage] || 'xs';
    let potionChance = 0.10;
    if(enemyData && Array.isArray(enemyData.drops) && enemyData.drops.length>0){
      potionChance = enemyData.drops[0].chance || 0.10;
    } else if(enemyData && enemyData.boss){
      potionChance = 0.20;
    }
    if(Math.random() < potionChance){
      let types = ['hp','mana','stam'];
      let pick = types[Math.floor(Math.random()*types.length)];
      let potionId = 'potion-'+pick+'-'+size;
      potions.push({id:potionId, count:1});
    }
    return {resources:res, potions:potions};
  }catch(e){ return {resources:[], potions:[]}; }
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
  }catch(e){}
}
