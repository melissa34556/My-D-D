const CORE_COMBAT_ACTIONS=[
 {name:"Attack",description:"Make one melee or ranged attack. Some features allow more attacks when you take the Attack action."},
 {name:"Dash",description:"You gain extra movement for the current turn equal to your speed, after applying any modifiers."},
 {name:"Disengage",description:"Your movement doesn’t provoke opportunity attacks for the rest of the turn."},
 {name:"Dodge",description:"Until the start of your next turn, attack rolls against you have disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage. You lose this benefit if incapacitated or if your speed becomes 0."},
 {name:"Grapple",description:"When you take the Attack action, you can replace one attack with a special melee attack: a Strength (Athletics) check contested by the target’s Strength (Athletics) or Dexterity (Acrobatics)."},
 {name:"Help",description:"You help another creature with an ability check, or give an ally advantage on its next attack against a creature within 5 feet of you, if the attack happens before your next turn."},
 {name:"Hide",description:"Make a Dexterity (Stealth) check to attempt to hide, following the normal hiding rules."},
 {name:"Improvise",description:"You can improvise an action not described elsewhere. The DM determines whether it is possible and what kind of roll is required."},
 {name:"Influence",description:"Attempt to influence a creature through conversation, social interaction, or other means determined by the DM."},
 {name:"Magic",description:"Cast a spell, activate a magic item, or use a magical feature according to its casting time and rules."},
 {name:"Ready",description:"Choose an observable trigger and an action to take in response. You use your reaction when the trigger occurs; readied spells require concentration."},
 {name:"Search",description:"Make a Wisdom (Perception) or Intelligence (Investigation) check to find something, as determined by the DM."},
 {name:"Shove",description:"When you take the Attack action, you can replace one attack with a special melee attack to push a creature 5 feet away or knock it prone."},
 {name:"Study",description:"Make an Intelligence check to recall lore or information about a creature, object, or situation."},
 {name:"Utilize",description:"Use an object that requires your action. Interacting with one object for free is normally allowed once on your turn."}
];
const text=v=>String(v||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const mod=n=>Math.floor((Number(n||10)-10)/2);
const allSpells=c=>[...(c.spellcastingProfiles||[]).flatMap(p=>(p.spells||[]).map(s=>({...s,spellcastingClass:p.name||p.sourceClass||""}))),...(c.spellcastingProfiles?.length?[]:(c.spellcasting?.spells||[]))];
const levels=c=>{
 const out={};for(const [name,data] of Object.entries(c.hitDiceByClass||{}))out[name]=Number(data.total)||0;
 if(!Object.keys(out).length){const m=String(c.className||"").match(/^(.+?)\s+(\d+)$/);if(m)out[m[1]]=Number(m[2]);else if(c.className)out[c.className]=Number(c.level)||1;}
 return out;
};
const dieFor=(level)=>level>=17?10:level>=11?8:level>=5?6:4;
function row(name,type,description,source="2014 rules",extra={}){return {name,type,description,source,...extra};}
export function buildActionSections(c){
 const classLevels=levels(c),totalLevel=Object.values(classLevels).reduce((a,b)=>a+b,0)||Number(c.level)||1;
 const subclassFor=cls=>c.subclassesByClass?.[cls]||(Object.keys(classLevels).length===1?c.subclass:"")||"";
 const features=(c.features||[]).map(f=>typeof f==="string"?{name:f,description:""}:f).filter(f=>f?.name);
 const hasFeature=name=>features.some(f=>text(f.name)===text(name));
 const featureDescription=name=>features.find(f=>text(f.name)===text(name))?.description||"";
 const attacks=[...(c.attacks||[])].map((a,i)=>({...a,id:a.id||"stored-"+i,source:a.source||"Character attack",kind:a.kind||(/spell/i.test(a.type||"")?"Spell":/ranged/i.test(a.type||"")?"Ranged Weapon":"Melee Weapon")}));
 const spells=allSpells(c);
 const spellAttacks={
  "eldritch blast":{damage:"1d10",range:"120 ft.",kind:"Cantrip"},
  "chill touch":{damage:"1d8",range:"120 ft.",kind:"Cantrip"},
  "fire bolt":{damage:"1d10",range:"120 ft.",kind:"Cantrip"},
  "ray of frost":{damage:"1d8",range:"60 ft.",kind:"Cantrip"},
  "shocking grasp":{damage:"1d8",range:"Touch",kind:"Cantrip"},
  "thorn whip":{damage:"1d6",range:"30 ft.",kind:"Cantrip"},
  "witch bolt":{damage:"1d12",range:"30 ft.",kind:"1st Level Spell"},
  "guiding bolt":{damage:"4d6",range:"120 ft.",kind:"1st Level Spell"},
  "inflict wounds":{damage:"3d10",range:"Touch",kind:"1st Level Spell"},
  "chromatic orb":{damage:"3d8",range:"90 ft.",kind:"1st Level Spell"},
  "scorching ray":{damage:"2d6",range:"120 ft.",kind:"2nd Level Spell"},
  "vampiric touch":{damage:"3d6",range:"Self",kind:"3rd Level Spell"}
 };
 for(const sp of spells){const meta=spellAttacks[text(sp.name)];if(meta&&!attacks.some(a=>text(a.name)===text(sp.name))){const profile=(c.spellcastingProfiles||[]).find(p=>(p.spells||[]).some(x=>x.name===sp.name));const level=Number(c.level)||1;const diceScale=level>=17?4:level>=11?3:level>=5?2:1;let damage=meta.damage;if(text(sp.name)==="eldritch blast")damage="1d10";else if(text(sp.name)==="chill touch"||text(sp.name)==="fire bolt"||text(sp.name)==="ray of frost"||text(sp.name)==="shocking grasp"||text(sp.name)==="thorn whip"){const sides=Number(damage.split("d")[1]);damage=diceScale+"d"+sides;}attacks.push({id:"spell-"+sp.name,name:sp.name,kind:meta.kind,range:meta.range,attackBonus:Number(profile?.attackBonus??sp.attackBonus??c.spellcasting?.attackBonus??0),damage,damageType:sp.damageType||"",source:sp.spellcastingClass||profile?.name||"Spell"});}}
 if(!attacks.some(a=>/unarmed strike/i.test(a.name||""))){const monkLevel=Object.entries(classLevels).find(([cls])=>text(cls)==="monk")?.[1]||0;const ability=monkLevel?Math.max(mod(c.abilities.DEX),mod(c.abilities.STR)):mod(c.abilities.STR);attacks.push({id:"unarmed-strike",name:"Unarmed Strike",kind:"Melee Attack",range:"5 ft. reach",attackBonus:(Number(c.proficiencyBonus)||2)+ability,damage:monkLevel?"1d"+dieFor(monkLevel):"1",damageModifier:ability,damageType:"bludgeoning",source:monkLevel?"Monk Martial Arts":"Unarmed"});}
 for(const sp of spells){if(sp.attack===true||sp.isAttack===true||sp.damage||sp.damageDice){const profile=(c.spellcastingProfiles||[]).find(p=>(p.spells||[]).some(x=>x.name===sp.name));attacks.push({id:"spell-"+sp.spellcastingClass+"-"+sp.name,name:sp.name,kind:Number(sp.level)===0?"Cantrip":"Spell",range:sp.range||"",attackBonus:Number(sp.attackBonus??profile?.attackBonus??c.spellcasting?.attackBonus??0),damage:sp.damage||sp.damageDice||"1d6",damageType:sp.damageType||"",source:"Spell"});}}
 const actions=[...CORE_COMBAT_ACTIONS.map(a=>row(a.name,"Action",a.description))];
 const bonus=[],reactions=[],other=[];
 const add=(target,name,type,description,source,extra={})=>target.push(row(name,type,description,source,extra));
 add(reactions,"Opportunity Attack","Reaction","When a hostile creature you can see leaves your reach, you can use your reaction to make one melee attack against it.");
 // Universal and class-derived feature catalog; a feature is only surfaced when the character has the required class/subclass level.
 for(const [cls,lvl] of Object.entries(classLevels)){
  const sub=text(subclassFor(cls));
  if(text(cls)==="monk"){
   if(lvl>=2){add(bonus,"Flurry of Blows","Bonus Action","Immediately after you take the Attack action on your turn, you can spend 1 ki point to make two unarmed strikes as a bonus action.","Monk · Ki");add(bonus,"Patient Defense","Bonus Action","You can spend 1 ki point to take the Dodge action as a bonus action.","Monk · Ki");add(bonus,"Step of the Wind","Bonus Action","You can spend 1 ki point to take the Disengage or Dash action as a bonus action, and your jump distance is doubled for the turn.","Monk · Ki");}
   if(lvl>=3){add(reactions,"Deflect Missiles","Reaction","Use your reaction to reduce damage from a ranged weapon attack. If you reduce it to 0, you can catch the missile; spending 1 ki point lets you make a ranged attack with it.","Monk");}
   if(lvl>=3&&sub.includes("open hand")){add(bonus,"Open Hand Technique","Feature","When you hit with one of the attacks granted by Flurry of Blows, you can impose one of the Open Hand Technique effects.","Way of the Open Hand");}
   if(lvl>=6&&sub.includes("shadow")){add(other,"Shadow Step","Feature","As a bonus action in dim light or darkness, teleport up to 60 feet to an unoccupied space you can see that is also in dim light or darkness.","Way of Shadow");}
   if(lvl>=6&&sub.includes("open hand")){add(other,"Wholeness of Body","Action","Regain hit points equal to three times your monk level. Once used, it recharges after a long rest.","Way of the Open Hand");}
  }
  if(text(cls)==="rogue"){
   if(lvl>=1)add(other,"Sneak Attack","Special","Once per turn, you can deal extra damage to one creature you hit with an attack if you have advantage on the attack roll, or another enemy of the target is within 5 feet of it and you don’t have disadvantage. The attack must use a finesse or ranged weapon. The extra damage scales with rogue level.","Rogue",{damage:Math.ceil(lvl/2)+"d6",uses:"Once per turn"});
   if(lvl>=2)add(bonus,"Cunning Action","Bonus Action","You can take the Dash, Disengage, or Hide action as a bonus action.","Rogue");
   if(lvl>=5)add(reactions,"Uncanny Dodge","Reaction","When an attacker you can see hits you with an attack, use your reaction to halve the attack’s damage against you.","Rogue");
   if(lvl>=3&&sub.includes("thief")){add(bonus,"Fast Hands","Bonus Action","Use the bonus action granted by Cunning Action to make a Dexterity (Sleight of Hand) check, use thieves’ tools to disarm a trap or open a lock, or take the Use an Object action.","Thief");}
   if(lvl>=3&&sub.includes("arcane trickster")){add(other,"Mage Hand Legerdemain","Feature","You can make the spectral hand invisible and perform additional delicate tasks with it.","Arcane Trickster");}
   if(lvl>=7&&sub.includes("thief")){add(other,"Second-Story Work","Feature","Climbing no longer costs you extra movement, and you can use your Dexterity modifier when determining the distance you jump.","Thief");}
  }
  if(text(cls)==="warlock"&&lvl>=1&&sub.includes("fiend"))add(other,"Dark One’s Blessing","Special","When you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum 1).","The Fiend");
  if(text(cls)==="warlock"&&lvl>=6&&sub.includes("fiend"))add(reactions,"Dark One’s Own Luck","Reaction","When you make an ability check or saving throw, add a d10 to the roll. Once used, recharge after a short or long rest.","The Fiend");
  if(text(cls)==="ranger"&&lvl>=3&&sub.includes("gloom stalker"))add(other,"Dread Ambusher","Feature","At the start of your first turn of each combat, your walking speed increases by 10 feet until the end of that turn. If you take the Attack action, you can make one additional weapon attack as part of that action; if it hits, it deals an extra 1d8 damage.","Gloom Stalker");
  if(text(cls)==="fighter"&&lvl>=2)add(other,"Action Surge","Special","You can take one additional action on your turn. Once used, it recharges after a short or long rest.","Fighter");
  if(text(cls)==="fighter"&&lvl>=5)add(other,"Extra Attack","Feature","You can attack twice, instead of once, whenever you take the Attack action on your turn.","Fighter");
  if(text(cls)==="barbarian"&&lvl>=2)add(bonus,"Reckless Attack","Feature","When you make your first attack on your turn, you can decide to attack recklessly, giving you advantage on Strength-based melee weapon attack rolls using Strength during this turn, but attack rolls against you have advantage until your next turn.","Barbarian");
  if(text(cls)==="barbarian"&&lvl>=3&&sub.includes("berserker"))add(bonus,"Frenzy","Bonus Action","While raging, you can make a single melee weapon attack as a bonus action on each of your turns after this one. You suffer one level of exhaustion when your rage ends.","Path of the Berserker");
  if(text(cls)==="paladin"&&lvl>=2)add(other,"Divine Smite","Special","When you hit a creature with a melee weapon attack, expend a spell slot to deal radiant damage in addition to the weapon’s damage.","Paladin");
  if(text(cls)==="bard"&&lvl>=1)add(bonus,"Bardic Inspiration","Bonus Action","Choose one creature other than yourself within 60 feet that can hear you. It gains one Bardic Inspiration die.","Bard");
  if(text(cls)==="cleric"&&lvl>=2)add(other,"Channel Divinity","Special","Use one of your Channel Divinity options. The available options depend on your cleric domain.","Cleric");
 }
 for(const custom of c.actions||[]){const type=text(custom.type);const target=type.includes("bonus")?bonus:type.includes("reaction")?reactions:type.includes("other")?other:actions;add(target,custom.name||"Character action",custom.type||"Action",custom.description||"Character-specific action.",custom.source||"Character");}
 // Imported feature text is retained and displayed, but only known activations are categorized automatically.
 const knownNames=new Set([...actions,...bonus,...reactions,...other].map(x=>text(x.name)));
 for(const f of features){const n=text(f.name);if(!n||knownNames.has(n))continue;
  let target=other,type="Feature";
  if(/sneak attack/.test(n)){target=other;type="Special";}
  else if(/cunning action|fast hands|flurry of blows|patient defense|step of the wind|bardic inspiration|second wind|rage/.test(n)){target=bonus;type="Feature";}
  else if(/uncanny dodge|deflect missiles|deflect attack|opportunity attack|countercharm/.test(n)){target=reactions;type="Feature";}
  else if(/action surge|dread ambusher|divine smite|channel divinity/.test(n)){target=other;type="Feature";}
  else continue;
  add(target,f.name,type,f.description||"Character feature. Consult the feature rules for its exact use and limitations.","Character feature");
 }
 const actionCount=Object.entries(classLevels).some(([cls,lvl])=>["fighter","ranger","paladin","barbarian","monk"].includes(text(cls))&&lvl>=5)?1:0;
 const hasExtra=features.some(f=>/extra attack/i.test(f.name));
 const attacksPerAction=1+Math.max(0,actionCount||((hasExtra||hasFeature("Extra Attack"))?1:0));
 return {attacks,actions,bonusActions:bonus,reactions,other,attacksPerAction,totalLevel,spells};
}
export {CORE_COMBAT_ACTIONS};
