import test from "node:test";
import assert from "node:assert/strict";
import {buildActionSections} from "../src/lib/actions.js";

test("Actions are assembled from character-specific class and level features",()=>{
 const monk=buildActionSections({className:"Monk",level:5,abilities:{STR:10,DEX:16},proficiencyBonus:3,attacks:[],features:[]});
 assert.equal(monk.attacksPerAction,2);
 assert.ok(monk.attacks.some(x=>x.name==="Unarmed Strike"&&x.damage==="1d6+3"));
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
 assert.deepEqual(c.actions.map(x=>x.name),["Attack","Dash","Disengage","Dodge","Grapple","Help","Hide","Improvise","Influence","Magic","Ready","Search","Shove","Study","Utilize"]);
 assert.ok(c.bonusActions.some(x=>x.name==="Pact Feature"));
 assert.ok(c.reactions.some(x=>x.name==="Opportunity Attack"));
});
