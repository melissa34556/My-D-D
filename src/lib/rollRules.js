export function criticalDamageFormula(formula="1d6"){
 const match=String(formula).trim().match(/^(\d*)d(4|6|8|10|12|20|100)([+-]\d+)?$/i);
 if(!match)return null;
 const count=Math.max(1,Number(match[1]||1));
 return `${count*2}d${match[2]}${match[3]||""}`;
}
export function skillProficiencyBonus(abilityModifier,proficiencyBonus,{proficient=false,expertise=false,halfProficiency=false}={}){
 const prof=Number(proficiencyBonus)||0;
 return (Number(abilityModifier)||0)+(expertise?prof*2:proficient?prof:halfProficiency?Math.floor(prof/2):0);
}
export function calculatePassiveScore(skillModifier,{advantage=false,disadvantage=false}={}){
 return 10+(Number(skillModifier)||0)+(advantage&&!disadvantage?5:disadvantage&&!advantage?-5:0);
}
