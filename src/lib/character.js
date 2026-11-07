export const SCHEMA_VERSION = 1;
export function createCharacter(overrides = {}) {
  const base = {
    id: crypto.randomUUID?.() ?? String(Date.now()), schemaVersion: SCHEMA_VERSION, ruleset: "5e-2014",
    name: "Nieuw character", species: "", className: "", subclass: "", subclasses:[], level: 1, background: "",
    abilities: {STR:10,DEX:10,CON:10,INT:10,WIS:10,CHA:10}, proficiencyBonus:2,
    savingThrows:[], skillProficiencies:[], armorClass:10, initiative:0, speed:30,
    hitPoints:{current:8,maximum:8,temporary:0}, hitDice:"1d8", hitDiceUsed:0, hitDiceByClass:{}, deathSaves:{successes:0,failures:0,stable:false}, actionEconomy:{action:false,bonusAction:false,reaction:false},
    attacks:[], actions:[], spellcasting:{ability:"",saveDC:0,attackBonus:0,slots:{},spells:[]},
    inventory:[], currency:{cp:0,sp:0,ep:0,gp:0,pp:0}, inspiration:{current:0,history:[]}, features:[],traits:[],resources:[],conditions:[],concentration:"",exhaustionLevel:0,notes:"",
    importMetadata:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()
  };
  return {...base,...overrides,abilities:{...base.abilities,...(overrides.abilities||{})},hitPoints:{...base.hitPoints,...(overrides.hitPoints||{})},spellcasting:{...base.spellcasting,...(overrides.spellcasting||{})},currency:{...base.currency,...(overrides.currency||{})},inspiration:{...base.inspiration,...(overrides.inspiration||{}),history:Array.isArray(overrides.inspiration?.history)?overrides.inspiration.history:[]},deathSaves:{...base.deathSaves,...(overrides.deathSaves||{})},actionEconomy:{...base.actionEconomy,...(overrides.actionEconomy||{})}};
}
export function normalizeCharacter(input={}) {
  const c=createCharacter(input); c.ruleset="5e-2014"; c.id=input.id||c.id; c.updatedAt=new Date().toISOString();
  for(const k of ["savingThrows","skillProficiencies","attacks","actions","inventory","features","traits","resources","conditions","subclasses"]) if(!Array.isArray(c[k])) c[k]=[];
  if(!Array.isArray(c.spellcasting.spells)) c.spellcasting.spells=[]; if(!Array.isArray(c.spellcastingProfiles)) c.spellcastingProfiles=[];
  return c;
}
export function exportCharacter(character) {
  return JSON.stringify({format:"my-dnd-character",schemaVersion:SCHEMA_VERSION,character},null,2);
}
export function importCharacterJSON(data) {
  const parsed=typeof data==="string"?JSON.parse(data):data;
  const source=parsed?.character??parsed;
  if(!source||typeof source!=="object"||Array.isArray(source)) throw new Error("Geen characterobject gevonden.");
  const name=source.name||source.characterName||source.charName;
  if(!name) throw new Error("Geen characternaam gevonden in dit bestand.");
  return {character:normalizeCharacter({...source,name,species:source.species||source.race||"",className:source.className||source.class||"",level:Number(source.level||source.totalLevel||1),abilities:source.abilities||source.stats||source.abilityScores||{},importMetadata:{source:parsed?.format||"JSON",importedAt:new Date().toISOString()}}),warnings:["Controleer alle velden. Niet-herkende bronvelden worden niet automatisch omgezet."]};
}
