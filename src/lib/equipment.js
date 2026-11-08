export function calculateArmorClass({dexterity=10,armor=null,shield=false,magicBonus=0}={}){
 const dexMod=Math.floor((Number(dexterity||10)-10)/2);
 let base=10+dexMod;
 if(armor&&Number.isFinite(Number(armor.baseAC))){
  const category=String(armor.category||"light").toLowerCase();
  base=Number(armor.baseAC)+(category==="heavy"?0:category==="medium"?Math.min(2,dexMod):dexMod);
 }
 return Math.max(0,base+(shield?2:0)+(Number(magicBonus)||0));
}
export function calculateCarryingCapacity(strength=10){
 const score=Math.max(1,Number(strength)||10);
 return {normal:score*15,pushDragLift:score*30};
}
export function getEncumbrance(weight,strength=10){
 const capacity=calculateCarryingCapacity(strength),carried=Math.max(0,Number(weight)||0);
 return {carried,capacity:capacity.normal,pushDragLift:capacity.pushDragLift,overCapacity:carried>capacity.normal,heavilyEncumbered:carried>capacity.normal*(2/3),lightlyEncumbered:carried>capacity.normal/3};
}
