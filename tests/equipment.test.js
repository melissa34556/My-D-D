import test from "node:test";
import assert from "node:assert/strict";
import {calculateArmorClass,calculateCarryingCapacity,getEncumbrance} from "../src/lib/equipment.js";
test("light armor adds full Dexterity modifier",()=>assert.equal(calculateArmorClass({dexterity:16,armor:{baseAC:11,category:"light"}}),14));
test("medium armor caps Dexterity modifier at +2",()=>assert.equal(calculateArmorClass({dexterity:18,armor:{baseAC:14,category:"medium"}}),16));
test("heavy armor ignores Dexterity modifier",()=>assert.equal(calculateArmorClass({dexterity:18,armor:{baseAC:16,category:"heavy"}}),16));
test("shield adds two AC",()=>assert.equal(calculateArmorClass({dexterity:14,armor:{baseAC:14,category:"medium"},shield:true}),18));
test("unarmored AC uses 10 plus Dexterity",()=>assert.equal(calculateArmorClass({dexterity:16}),13));
test("2014 carrying capacity is 15 times Strength",()=>assert.deepEqual(calculateCarryingCapacity(12),{normal:180,pushDragLift:360}));
test("encumbrance uses 5x and 10x Strength thresholds",()=>{assert.equal(getEncumbrance(51,10).lightlyEncumbered,true);assert.equal(getEncumbrance(101,10).heavilyEncumbered,true);assert.equal(getEncumbrance(160,10).overCapacity,true);});

import {calculateInventoryWeight,currencyInGold,inventoryItemValue} from "../src/lib/equipment.js";
test("inventory weight counts each item quantity, including contents of containers",()=>{
 assert.equal(calculateInventoryWeight([{name:"Backpack",weight:5,quantity:1,isContainer:true},{name:"Rope",weight:10,quantity:1,containerId:"pack"},{name:"Rations",weight:2,quantity:3,containerId:"pack"}]),21);
});
test("currency converts 2014 coin denominations to gold pieces",()=>{
 assert.equal(currencyInGold({cp:100,sp:10,ep:2,gp:5,pp:1}),18);
});
test("item value multiplies unit cost by quantity",()=>{
 assert.equal(inventoryItemValue([{cost:2,quantity:3},{cost:0.5,quantity:2}]),7);
});
