// VOLAND DB - STARTER GEAR + POTIONS module
const VOLAND_BASE_CLOTHING_IDS = ['helmet-bw-lvl1','amulet-bw-lvl1','armor-bw-lvl1','gloves-bw-lvl1','boots-bw-lvl1','ring1-bw-lvl1','ring2-bw-lvl1','earring1-bw-lvl1','earring2-bw-lvl1'];
const VOLAND_WEAPON_SETS = {
  bow: ['bow-bw-lvl1'],
  staff: ['staff-bw-lvl1'],
  sword: ['sword-bw-lvl1','shield-bw-lvl1']
};
const VOLAND_HERO_WEAPON_TYPE = {
  'archer-f': 'bow',
  'archer-m': 'bow',
  'archmage-m': 'staff',
  'mage-f-new': 'staff',
  'necro-f-new': 'staff',
  'necro-m': 'staff',
  'warrior-f': 'sword',
  'warrior-m': 'sword'
};
function VOLAND_GET_STARTER_GEAR_FOR_HERO(heroId){
  try{
    let base = [...VOLAND_BASE_CLOTHING_IDS];
    let wType = VOLAND_HERO_WEAPON_TYPE[heroId] || 'sword';
    let weapons = VOLAND_WEAPON_SETS[wType] || VOLAND_WEAPON_SETS['sword'];
    return [...base, ...weapons];
  }catch(e){ return [...VOLAND_BASE_CLOTHING_IDS, 'sword-bw-lvl1','shield-bw-lvl1']; }
}

// Зелья - отдельный массив
const VOLAND_POTIONS = [
{id:'potion-hp-xs',name:'Зелье HP XS',baseId:'potion-hp',tier:'potion',level:1,slot:null,icon:'./assets/ui/potions/hp-xs.webp',emoji:'🧪',bonus:{},desc:'+250 HP',rarity:'common',type:'potion',potion:{stat:'HP',value:250,percent:false}},
  {id:'potion-hp-s',name:'Зелье HP S',baseId:'potion-hp',tier:'potion',level:2,slot:null,icon:'./assets/ui/potions/hp-s.webp',emoji:'🧪',bonus:{},desc:'+500 HP',rarity:'common',type:'potion',potion:{stat:'HP',value:500,percent:false}},
  {id:'potion-hp-m',name:'Зелье HP M',baseId:'potion-hp',tier:'potion',level:3,slot:null,icon:'./assets/ui/potions/hp-m.webp',emoji:'🧪',bonus:{},desc:'+1000 HP',rarity:'common',type:'potion',potion:{stat:'HP',value:1000,percent:false}},
  {id:'potion-hp-l',name:'Зелье HP L',baseId:'potion-hp',tier:'potion',level:4,slot:null,icon:'./assets/ui/potions/hp-l.webp',emoji:'🧪',bonus:{},desc:'100% HP',rarity:'rare',type:'potion',potion:{stat:'HP',value:100,percent:true}},
  {id:'potion-hp-xl',name:'Зелье HP XL',baseId:'potion-hp',tier:'potion',level:5,slot:null,icon:'./assets/ui/potions/hp-xl.webp',emoji:'🧪',bonus:{},desc:'200% HP 1ч',rarity:'epic',type:'potion',potion:{stat:'HP',value:200,percent:true,tempBonus:{hp:100,duration:3600}}},
  {id:'potion-mana-xs',name:'Зелье MANA XS',baseId:'potion-mana',tier:'potion',level:1,slot:null,icon:'./assets/ui/potions/mana-xs.webp',emoji:'💙',bonus:{},desc:'+100 MANA',rarity:'common',type:'potion',potion:{stat:'MANA',value:100,percent:false}},
  {id:'potion-mana-s',name:'Зелье MANA S',baseId:'potion-mana',tier:'potion',level:2,slot:null,icon:'./assets/ui/potions/mana-s.webp',emoji:'💙',bonus:{},desc:'+200 MANA',rarity:'common',type:'potion',potion:{stat:'MANA',value:200,percent:false}},
  {id:'potion-mana-m',name:'Зелье MANA M',baseId:'potion-mana',tier:'potion',level:3,slot:null,icon:'./assets/ui/potions/mana-m.webp',emoji:'💙',bonus:{},desc:'+400 MANA',rarity:'common',type:'potion',potion:{stat:'MANA',value:400,percent:false}},
  {id:'potion-mana-l',name:'Зелье MANA L',baseId:'potion-mana',tier:'potion',level:4,slot:null,icon:'./assets/ui/potions/mana-l.webp',emoji:'💙',bonus:{},desc:'100% MANA',rarity:'rare',type:'potion',potion:{stat:'MANA',value:100,percent:true}},
  {id:'potion-mana-xl',name:'Зелье MANA XL',baseId:'potion-mana',tier:'potion',level:5,slot:null,icon:'./assets/ui/potions/mana-xl.webp',emoji:'💙',bonus:{},desc:'100% MANA +100% HP 1ч',rarity:'epic',type:'potion',potion:{stat:'MANA',value:100,percent:true,tempBonus:{hp:100,duration:3600}}},
  {id:'potion-stam-xs',name:'Зелье STAM XS',baseId:'potion-stam',tier:'potion',level:1,slot:null,icon:'./assets/ui/potions/stam-xs.webp',emoji:'⚡',bonus:{},desc:'+10 STAM',rarity:'common',type:'potion',potion:{stat:'STAM',value:10,percent:false}},
  {id:'potion-stam-s',name:'Зелье STAM S',baseId:'potion-stam',tier:'potion',level:2,slot:null,icon:'./assets/ui/potions/stam-s.webp',emoji:'⚡',bonus:{},desc:'+20 STAM',rarity:'common',type:'potion',potion:{stat:'STAM',value:20,percent:false}},
  {id:'potion-stam-m',name:'Зелье STAM M',baseId:'potion-stam',tier:'potion',level:3,slot:null,icon:'./assets/ui/potions/stam-m.webp',emoji:'⚡',bonus:{},desc:'+30 STAM',rarity:'common',type:'potion',potion:{stat:'STAM',value:30,percent:false}},
  {id:'potion-stam-l',name:'Зелье STAM L',baseId:'potion-stam',tier:'potion',level:4,slot:null,icon:'./assets/ui/potions/stam-l.webp',emoji:'⚡',bonus:{},desc:'100% STAM',rarity:'rare',type:'potion',potion:{stat:'STAM',value:100,percent:true}},
  {id:'potion-stam-xl',name:'Зелье STAM XL',baseId:'potion-stam',tier:'potion',level:5,slot:null,icon:'./assets/ui/potions/stam-xl.webp',emoji:'⚡',bonus:{},desc:'100% STAM +1000% реген 1ч',rarity:'epic',type:'potion',potion:{stat:'STAM',value:100,percent:true,tempBonus:{regen:1000,duration:3600}}},
];

// Legacy для старых сейвов
const VOLAND_STARTER_ITEMS = VOLAND_ITEMS.filter(it=>it.tier==='bw' && it.level===1).map(it=>it.id);
const VOLAND_STARTER_GEAR_IDS = [...VOLAND_BASE_CLOTHING_IDS, 'bow-bw-lvl1','staff-bw-lvl1','sword-bw-lvl1','shield-bw-lvl1'];

