export function calculateArmorClass({dexterity=10,armor=null,shield=false,magicBonus=0,shieldMagicBonus=0}={}){
 const dexMod=Math.floor((Number(dexterity||10)-10)/2);
 let base=10+dexMod;
 if(armor&&Number.isFinite(Number(armor.baseAC))){
  const category=String(armor.category||"light").toLowerCase();
  base=Number(armor.baseAC)+(category==="heavy"?0:category==="medium"?Math.min(2,dexMod):dexMod);
 }
 return Math.max(0,base+(shield?2+(Number(shieldMagicBonus)||0):0)+(Number(magicBonus)||0));
}
export function calculateCarryingCapacity(strength=10){
 const score=Math.max(1,Number(strength)||10);
 return {normal:score*15,pushDragLift:score*30};
}
export function getEncumbrance(weight,strength=10){
 const capacity=calculateCarryingCapacity(strength),carried=Math.max(0,Number(weight)||0);
 return {carried,capacity:capacity.normal,pushDragLift:capacity.pushDragLift,overCapacity:carried>capacity.normal,heavilyEncumbered:carried>capacity.normal*(2/3),lightlyEncumbered:carried>capacity.normal/3};
}

export function calculateInventoryWeight(items=[]){
 return (Array.isArray(items)?items:[]).reduce((total,item)=>total+Math.max(0,Number(item?.weight)||0)*Math.max(0,Number(item?.quantity??item?.qty??1)||0),0);
}
export function currencyInGold(currency={}){
 return (Number(currency.gp)||0)+(Number(currency.pp)||0)*10+(Number(currency.ep)||0)*0.5+(Number(currency.sp)||0)*0.1+(Number(currency.cp)||0)*0.01;
}
export function inventoryItemValue(items=[]){
 return (Array.isArray(items)?items:[]).reduce((total,item)=>total+Math.max(0,Number(item?.cost)||0)*Math.max(0,Number(item?.quantity??item?.qty??1)||0),0);
}
