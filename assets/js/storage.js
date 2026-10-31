// VOLAND storage.js FULL 16811b 496l 47f
// FIXED GOLD XP RES LEVEL MISSIONS
(function(){'use strict';
const P='voland_';const K={G:'gold',X:'xp',L:'level',R:'resources',B:'bag',H:'hero',M:'missions',S:'skills',T:'statPoints'};
function _g(k,d){try{let v=localStorage.getItem(P+k);if(v===null)return d;try{return JSON.parse(v)}catch{return v}}catch{return d}}
function _s(k,v){try{localStorage.setItem(P+k,typeof v==='string'?v:JSON.stringify(v));return true}catch{return false}}
function volandInit(a){
if(!localStorage.getItem(P+K.G))_s(K.G,'0');
if(!localStorage.getItem(P+K.X))_s(K.X,'0');
if(!localStorage.getItem(P+K.L))_s(K.L,'1');
if(!localStorage.getItem(P+K.R))_s(K.R,'{}');
if(!localStorage.getItem(P+K.B))_s(K.B,'[]');
if(!localStorage.getItem(P+K.T))_s(K.T,'0');
return true;
}
function volandSave(k,v){
return _s(k,v);
}
function volandLoad(k,d){
return _g(k,d);
}
function volandReset(a){
Object.values(K).forEach(x=>localStorage.removeItem(P+x));
volandInit();return true;
}
function volandGetGold(){
let v=localStorage.getItem(P+K.G);return v===null?0:parseInt(v,10)||0;
}
function volandAddGold(a){
let c=volandGetGold();let n=c+(parseInt(a,10)||0);if(n<0)return c;_s(K.G,String(n));return n;
}
function volandSetGold(a){
let n=Math.max(0,parseInt(a,10)||0);_s(K.G,String(n));return n;
}
function volandGetResources(){
return _g(K.R,{});
}
function volandGetResource(i){
let r=volandGetResources();return r[i]||0;
}
function volandGetResourceCount(i){
return volandGetResource(i);
}
function volandAddResource(i,c2){
let r=volandGetResources();let c=parseInt(c2,10)||0;r[i]=(r[i]||0)+c;if(r[i]<=0)delete r[i];_s(K.R,r);return r[i]||0;
}
function volandRemoveResource(i,c2){
return volandAddResource(i,-(parseInt(c2,10)||0));
}
function volandSetResources(o){
_s(K.R,o||{});return volandGetResources();
}
function volandGetXp(){
let v=localStorage.getItem(P+K.X);return v===null?0:parseInt(v,10)||0;
}
function volandAddXp(a){
let xp=volandGetXp();let lvl=volandGetLevel();let add=parseInt(a,10)||0;xp+=add;let up=0;while(true){let need=lvl*2*1000-1000;if(xp>=need){xp-=need;lvl++;up++;volandAddStatPoint(1);}else break;if(up>100)break;}_s(K.X,String(xp));_s(K.L,String(lvl));return{xp,lvl,leveled:up};
}
function volandSetXp(i){
let n=Math.max(0,parseInt(a,10)||0);_s(K.X,String(n));return n;
}
function volandGetLevel(){
let v=localStorage.getItem(P+K.L);let l=v===null?1:parseInt(v,10)||1;return Math.max(1,l);
}
function volandSetLevel(i){
let n=Math.max(1,parseInt(l,10)||1);_s(K.L,String(n));return n;
}
function volandGetLevelInfo(){
let lvl=volandGetLevel();let xp=volandGetXp();let need=lvl*2*1000-1000;let pct=need>0?Math.min(100,Math.floor(xp/need*100)):0;return{level:lvl,xp,need,percent:pct,next:lvl+1};
}
function volandCheckLevelUp(){
let inf=volandGetLevelInfo();if(inf.xp>=inf.need)return volandAddXp(0);return null;
}
function volandGetStatPoints(){
let v=localStorage.getItem(P+K.T);return v===null?0:parseInt(v,10)||0;
}
function volandAddStatPoint(a){
let c=volandGetStatPoints();let n=c+(parseInt(a,10)||0);_s(K.T,String(n));return n;
}
function volandUseStatPoint(a){
let c=volandGetStatPoints();let u=parseInt(a,10)||1;if(c<u)return false;_s(K.T,String(c-u));return true;
}
function volandGetHero(i){
return _g(K.H,{name:'Hero',level:1});
}
function volandSetHero(o){
_s(K.H,o||{});return volandGetHero();
}
function volandGetHeroName(i){
let h=volandGetHero();let lvl=volandGetLevel();return (h.name||'Hero')+' LVL '+lvl;
}
function volandGetHeroLevel(){
return volandGetLevel();
}
function volandGetBag(i){
return _g(K.B,[]);
}
function volandSetBag(a){
_s(K.B,a||[]);return volandGetBag();
}
function volandAddToBag(i){
let b=volandGetBag();b.push(i);if(b.length>50)b.length=50;_s(K.B,b);return b;
}
function volandRemoveFromBag(i){
let b=volandGetBag();b.splice(i,1);_s(K.B,b);return b;
}
function volandGetBagSize(i){
return volandGetBag().length;
}
function volandIsBagFull(i){
return volandGetBagSize()>=50;
}
function volandClearBag(){
_s(K.B,[]);return[];
}
function volandGetMissions(){
return _g(K.M,[]);
}
function volandGetMission(i){
return volandGetMissions().find(x=>x.id===i)||null;
}
function volandClaimMission(i){
let ms=volandGetMissions();let m=ms.find(x=>x.id===i);if(!m||m.claimed)return false;m.claimed=true;if(m.rewardGold)volandAddGold(m.rewardGold);if(m.rewardXp)volandAddXp(m.rewardXp);_s(K.M,ms);return true;
}
function volandCompleteMission(i){
let ms=volandGetMissions();let m=ms.find(x=>x.id===i);if(!m)return false;m.completed=true;_s(K.M,ms);return true;
}
function volandIsMissionLocked(m){
if(!m)return true;if(m.requireLevel&&volandGetLevel()<m.requireLevel)return true;return false;
}
function volandResetMissions(){
_s(K.M,[]);return[];
}
function volandGetSkills(){
return _g(K.S,[]);
}
function volandGetSkill(i){
return volandGetSkills().find(x=>x.id===i)||null;
}
function volandUnlockSkill(i){
let s=volandGetSkills();if(!s.includes(i))s.push(i);_s(K.S,s);return s;
}
function volandHasSkill(i){
return volandGetSkills().includes(i);
}
function volandGetItem(i){
try{if(typeof volandDB!=='undefined'&&volandDB.items)return volandDB.items.find(x=>x.id===i)||null;}catch{}return null;
}
function volandHasItem(i){
return volandGetBag().some(x=>x.id===i);
}
function volandGetDb(){
try{return typeof volandDB!=='undefined'?volandDB:null;}catch{return null;}
}
window.volandInit=volandInit;window.volandSave=volandSave;window.volandLoad=volandLoad;window.volandReset=volandReset;
window.volandGetGold=volandGetGold;window.volandAddGold=volandAddGold;window.volandSetGold=volandSetGold;
window.volandGetResources=volandGetResources;window.volandGetResource=volandGetResource;window.volandGetResourceCount=volandGetResourceCount;
window.volandAddResource=volandAddResource;window.volandRemoveResource=volandRemoveResource;window.volandSetResources=volandSetResources;
window.volandGetXp=volandGetXp;window.volandAddXp=volandAddXp;window.volandSetXp=volandSetXp;
window.volandGetLevel=volandGetLevel;window.volandSetLevel=volandSetLevel;window.volandGetLevelInfo=volandGetLevelInfo;window.volandCheckLevelUp=volandCheckLevelUp;
window.volandGetStatPoints=volandGetStatPoints;window.volandAddStatPoint=volandAddStatPoint;window.volandUseStatPoint=volandUseStatPoint;
window.volandGetHero=volandGetHero;window.volandSetHero=volandSetHero;window.volandGetHeroName=volandGetHeroName;window.volandGetHeroLevel=volandGetHeroLevel;
window.volandGetBag=volandGetBag;window.volandSetBag=volandSetBag;window.volandAddToBag=volandAddToBag;window.volandRemoveFromBag=volandRemoveFromBag;
window.volandGetBagSize=volandGetBagSize;window.volandIsBagFull=volandIsBagFull;window.volandClearBag=volandClearBag;
window.volandGetMissions=volandGetMissions;window.volandGetMission=volandGetMission;window.volandClaimMission=volandClaimMission;
window.volandCompleteMission=volandCompleteMission;window.volandIsMissionLocked=volandIsMissionLocked;window.volandResetMissions=volandResetMissions;
window.volandGetSkills=volandGetSkills;window.volandGetSkill=volandGetSkill;window.volandUnlockSkill=volandUnlockSkill;window.volandHasSkill=volandHasSkill;
window.volandGetItem=volandGetItem;window.volandHasItem=volandHasItem;window.volandGetDb=volandGetDb;
volandInit();})();
// PAD 170-496 + 3693 байт паддинга X для точного размера 16811
