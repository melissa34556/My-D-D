import test from "node:test";
import assert from "node:assert/strict";
import {EQUIPMENT_CATALOG,getEquipmentTemplate,calculateContainerLoad,getContainerCapacityStatus} from "../src/lib/equipmentCatalog.js";

test("equipment catalog includes common 2014 weapons, armor, shield and containers",()=>{
 for(const id of ["longsword","rapier","longbow","leather","chain-mail","plate","shield","backpack","pouch"]) {
  assert.ok(EQUIPMENT_CATALOG.some(item=>item.id===id),id+" should exist");
 }
});
test("weapon templates provide damage data for Actions integration",()=>{
 const rapier=getEquipmentTemplate("rapier");
 assert.equal(rapier.actionData.weapon,true);
 assert.equal(rapier.actionData.damage,"1d8");
 assert.equal(rapier.actionData.ability,"DEX");
});
test("armor templates provide AC, type and relevant restrictions",()=>{
 const plate=getEquipmentTemplate("plate");
 assert.equal(plate.armorBaseAC,18);
 assert.equal(plate.armorCategory,"heavy");
 assert.equal(plate.strengthRequirement,15);
 assert.equal(plate.stealthDisadvantage,true);
});
test("template lookup returns an independent copy",()=>{
 const first=getEquipmentTemplate("longsword");
 first.actionData.damage="9d9";
 assert.equal(getEquipmentTemplate("longsword").actionData.damage,"1d8");
});
test("container load includes all nested contents but not container tare weight",()=>{
 const items=[
  {id:"pack",isContainer:true,weight:5,quantity:1},
  {id:"pouch",isContainer:true,weight:1,quantity:1,containerId:"pack"},
  {id:"coins",weight:0.2,quantity:10,containerId:"pouch"},
  {id:"rope",weight:10,quantity:1,containerId:"pack"}
 ];
 assert.equal(calculateContainerLoad(items,"pack"),13);
 assert.deepEqual(getContainerCapacityStatus(items,{id:"pack",maxContentWeightLb:12}),{load:13,capacity:12,overCapacity:true,remaining:-1});
});
test("containers without configured capacity are not treated as overfilled",()=>{
 const items=[{id:"bag",isContainer:true,weight:1},{id:"item",weight:1,quantity:2,containerId:"bag"}];
 assert.deepEqual(getContainerCapacityStatus(items,items[0]),{load:2,capacity:null,overCapacity:false,remaining:null});
});
