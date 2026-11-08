import test from "node:test";
import assert from "node:assert/strict";
import {criticalDamageFormula,skillProficiencyBonus} from "../src/lib/rollRules.js";
test("critical doubles weapon damage dice but not flat modifier",()=>assert.equal(criticalDamageFormula("1d8+3"),"2d8+3"));
test("critical doubles multiple dice",()=>assert.equal(criticalDamageFormula("2d6"),"4d6"));
test("unsupported damage formula is not silently changed",()=>assert.equal(criticalDamageFormula("1d6+1d4"),null));
test("proficient skill adds proficiency bonus",()=>assert.equal(skillProficiencyBonus(2,3,{proficient:true}),5));
test("expertise doubles proficiency bonus",()=>assert.equal(skillProficiencyBonus(2,3,{proficient:true,expertise:true}),8));
test("half proficiency rounds down",()=>assert.equal(skillProficiencyBonus(2,3,{halfProficiency:true}),3));
