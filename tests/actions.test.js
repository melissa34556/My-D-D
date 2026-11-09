import test from "node:test";
import assert from "node:assert/strict";
import {buildActionSections} from "../src/lib/actions.js";

test("Actions are assembled from character-specific class and level features",()=>{
 const monk=buildActionSections({className:"Monk",level:5,abilities:{STR:10,DEX:16},proficiencyBonus:3,attacks:[],features:[]});
 assert.equal(monk.attacksPerAction,2);
 assert.ok(monk.attacks.some(x=>x.name==="Unarmed Strike"&&x.damage==="1d6"&&x.damageModifier===3));
 assert.ok(monk.bonusActions.some(x=>x.name==="Flurry of Blows"));
 assert.ok(monk.reactions.some(x=>x.name==="Deflect Missiles"));
 const rogue=buildActionSections({className:"Rogue",level:7,subclass:"Thief",abilities:{STR:10,DEX:18},proficiencyBonus:3,attacks:[],features:[]});
 assert.ok(rogue.bonusActions.some(x=>x.name==="Cunning Action"));
 assert.ok(rogue.bonusActions.some(x=>x.name==="Fast Hands"));
 assert.ok(rogue.reactions.some(x=>x.name==="Uncanny Dodge"));
 assert.ok(rogue.other.some(x=>x.name==="Sneak Attack"&&x.damage==="4d6"));
});
test("Multiclass features and spell attacks are combined without legacy labels",()=>{
 const c=buildActionSections({className:"Ranger 5 / Warlock 3",level:8,hitDiceByClass:{Ranger:{total:5},Warlock:{total:3}},subclassesByClass:{Ranger:"Gloom Stalker"},abilities:{STR:10,DEX:16},proficiencyBonus:3,attacks:[{name:"Longbow",attackBonus:6,damage:"1d8+3",range:"150/600"}],spellcastingProfiles:[{name:"Warlock",attackBonus:5,spells:[{name:"Eldritch Blast",level:0,attack:true,damage:"1d10"}]}],features:[]});
 assert.equal(c.attacksPerAction,2);
 assert.ok(c.attacks.some(x=>x.name==="Longbow"));
 assert.ok(c.attacks.some(x=>x.name==="Eldritch Blast"));
 assert.ok(c.other.some(x=>x.name==="Dread Ambusher"));
 assert.ok(!JSON.stringify(c).includes("Legacy"));
});
test("Core combat actions use the complete 2014 list and custom actions retain their category",()=>{
 const c=buildActionSections({className:"Warlock",level:1,abilities:{STR:10,DEX:10},proficiencyBonus:2,attacks:[],features:[],actions:[{name:"Pact Feature",type:"Bonus Action",description:"A custom feature."}]});
 assert.deepEqual(c.actions.map(x=>x.name),["Attack","Cast a Spell","Dash","Disengage","Dodge","Help","Hide","Ready","Search","Use an Object"]);
 assert.ok(c.bonusActions.some(x=>x.name==="Pact Feature"));
 assert.ok(c.reactions.some(x=>x.name==="Opportunity Attack"));
});

test("2014 rules keep grapple and shove as special attacks, not 2024 action names",()=>{
 const c=buildActionSections({className:"Fighter",level:1,abilities:{STR:14,DEX:12},proficiencyBonus:2,attacks:[],features:[]});
 assert.deepEqual(c.specialAttacks.map(x=>x.name),["Grapple","Shove"]);
 assert.ok(!c.actions.some(x=>["Influence","Study","Utilize","Magic"].includes(x.name)));
});
test("Imported structured actions are shown only when their requirements match",()=>{
 const contentEntries=[
  {id:"m1",name:"Flurry from database",category:"Classes",description:"Spend ki.",actionData:{actionType:"Bonus Action",className:"Monk",requiredLevel:2}},
  {id:"r1",name:"Cunning database action",category:"Classes",description:"Dash or hide.",actionData:{actionType:"Bonus Action",className:"Rogue",requiredLevel:2}}
 ];
 const monk=buildActionSections({className:"Monk",level:3,abilities:{STR:10,DEX:16},proficiencyBonus:2,features:[],contentEntries});
 assert.ok(monk.bonusActions.some(x=>x.name==="Flurry from database"));
 assert.ok(!monk.bonusActions.some(x=>x.name==="Cunning database action"));
});
test("Equipped imported weapons become attacks using their imported metadata",()=>{
 const c=buildActionSections({className:"Fighter",level:1,abilities:{STR:16,DEX:12},proficiencyBonus:2,features:[],attacks:[],inventory:[{id:"sword",name:"Longsword",equipped:true,actionData:{weapon:true,weaponCategory:"Melee Weapon",damage:"1d8",damageType:"slashing",range:"5 ft.",properties:"versatile",proficient:true}}]});
 const weapon=c.attacks.find(x=>x.name==="Longsword");
 assert.ok(weapon);
 assert.equal(weapon.attackBonus,5);
 assert.equal(weapon.damage,"1d8");
 assert.equal(weapon.damageModifier,3);
});
