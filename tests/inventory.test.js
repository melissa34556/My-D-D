import test from "node:test";
import assert from "node:assert/strict";
import {normalizeInventory,canMoveInventoryItem,moveInventoryItem,removeInventoryItem,getInventoryDescendantIds,getInventoryItemCount} from "../src/lib/inventory.js";

const sample = [
 {id:"pack",name:"Backpack",isContainer:true,quantity:1,weight:5,containerId:""},
 {id:"pouch",name:"Pouch",isContainer:true,quantity:1,weight:1,containerId:"pack"},
 {id:"coin",name:"Coins",quantity:20,weight:0,containerId:"pouch"},
 {id:"rope",name:"Rope",quantity:1,weight:10,containerId:""}
];

test("normalization repairs invalid parents and breaks cycles",()=>{
 const items=normalizeInventory([{id:"a",isContainer:true,containerId:"b"},{id:"b",isContainer:true,containerId:"a"},{id:"x",containerId:"missing"}]);
 assert.equal(items.find(x=>x.id==="x").containerId,"");
 assert.equal(items.filter(x=>!x.containerId).length,2);
});
test("container descendants are found recursively",()=>{
 assert.deepEqual([...getInventoryDescendantIds(sample,"pack")].sort(),["coin","pouch"]);
});
test("an item cannot be moved into itself or one of its descendants",()=>{
 assert.equal(canMoveInventoryItem(sample,"pack","pouch"),false);
 assert.equal(canMoveInventoryItem(sample,"pack","pack"),false);
 assert.equal(canMoveInventoryItem(sample,"rope","pack"),true);
 assert.equal(canMoveInventoryItem(sample,"rope","missing"),false);
});
test("moving an item changes only its parent",()=>{
 const moved=moveInventoryItem(sample,"rope","pack");
 assert.equal(moved.find(x=>x.id==="rope").containerId,"pack");
 assert.equal(sample.find(x=>x.id==="rope").containerId,"");
});
test("deleting a container preserves its contents in the parent container",()=>{
 const removed=removeInventoryItem(sample,"pouch");
 assert.equal(removed.some(x=>x.id==="pouch"),false);
 assert.equal(removed.find(x=>x.id==="coin").containerId,"pack");
});
test("item count includes quantities rather than rows",()=>{
 assert.equal(getInventoryItemCount(sample),23);
});
