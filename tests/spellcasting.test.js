import test from "node:test";
import assert from "node:assert/strict";
import {calculateMulticlassSlots,parseClassLevels} from "../src/lib/spellcasting.js";

test("Ranger 4 / Warlock 3 keeps Pact Magic separate",()=>{
 const r=calculateMulticlassSlots({Ranger:{total:4},Warlock:{total:3}});
 assert.equal(r.casterLevel,2);
 assert.deepEqual(r.slots,{1:{total:3,used:0}});
 assert.equal(r.breakdown.find(x=>x.name==="Warlock").note,"Pact Magic: aparte");
});
test("full and half casters combine using 2014 multiclass levels",()=>{
 const r=calculateMulticlassSlots({Wizard:2,Ranger:3});
 assert.equal(r.casterLevel,3);
 assert.deepEqual(r.slots,{1:{total:4,used:0},2:{total:2,used:0}});
});
test("Arcane Trickster and Eldritch Knight contribute one third rounded down",()=>{
 assert.equal(calculateMulticlassSlots({Rogue:9},{Rogue:"Arcane Trickster"}).casterLevel,3);
 assert.equal(calculateMulticlassSlots({Fighter:5},{Fighter:"Eldritch Knight"}).casterLevel,1);
});
test("Artificer rounds half caster levels up",()=>{
 assert.equal(calculateMulticlassSlots({Artificer:1}).casterLevel,1);
});
test("non-caster classes do not mark calculation unsupported",()=>{
 const r=calculateMulticlassSlots({Barbarian:3,Monk:2,Rogue:2});
 assert.equal(r.casterLevel,0);assert.equal(r.complete,true);
});
test("unknown class is flagged for manual review",()=>{
 const r=calculateMulticlassSlots({Mystic:5});
 assert.equal(r.complete,false);assert.deepEqual(r.unsupported,["Mystic"]);
});
test("class level string parser handles multiclass notation",()=>{
 assert.deepEqual(parseClassLevels("Ranger 4 / Warlock 3"),{Ranger:{total:4},Warlock:{total:3}});
});
