const CORE_COMBAT_ACTIONS=[
 {name:"Attack",description:"Make a melee or ranged attack. Some features allow you to make more than one attack when you take this action."},
 {name:"Cast a Spell",description:"Cast a spell with a casting time of 1 action. Follow the spell components, range, targets, duration, and concentration rules."},
 {name:"Dash",description:"You gain extra movement for the current turn equal to your speed, after applying any modifiers."},
 {name:"Disengage",description:"Your movement does not provoke opportunity attacks for the rest of the turn."},
 {name:"Dodge",description:"Until the start of your next turn, attack rolls against you have disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage. You lose this benefit if incapacitated or if your speed becomes 0."},
 {name:"Help",description:"You can aid another creature with an ability check, or distract a creature within 5 feet of you to give an ally advantage on its next attack against it."},
 {name:"Hide",description:"Make a Dexterity (Stealth) check to attempt to hide, following the normal hiding rules."},
 {name:"Ready",description:"Choose an observable trigger and an action to take in response. You use your reaction when the trigger occurs; readied spells require concentration."},
 {name:"Search",description:"Devote your attention to finding something. The DM might call for a Wisdom (Perception) or Intelligence (Investigation) check."},
 {name:"Use an Object",description:"Use an object that requires your action. Interacting with one object for free is normally allowed once on your turn."}
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
const scaleDice=(formula,multiplier)=>String(formula||"").replace(/^(\d*)d(\d+)/i,(_,n,die)=>(Math.max(1,Number(n||1)*multiplier))+"d"+die);
function row(name,type,description,source="2014 rules",extra={}){return {name,type,description,source,...extra};}
export function buildActionSections(c){
 const classLevels=levels(c),totalLevel=Object.values(classLevels).reduce((a,b)=>a+b,0)||Number(c.level)||1;
 const subclassFor=cls=>c.subclassesByClass?.[cls]||(Object.keys(classLevels).length===1?c.subclass:"")||"";
 const features=(c.features||[]).map(f=>typeof f==="string"?{name:f,description:""}:f).filter(f=>f?.name);
 const hasFeature=name=>features.some(f=>text(f.name)===text(name));
 const featureDescription=name=>features.find(f=>text(f.name)===text(name))?.description||"";
 const attacks=[...(c.attacks||[])].map((a,i)=>({...a,id:a.id||"stored-"+i,source:a.source||"Character attack",kind:a.kind||(/spell/i.test(a.type||"")?"Spell":/ranged/i.test(a.type||"")?"Ranged Weapon":"Melee Weapon")}));
 const equippedWeapons=(c.inventory||[]).filter(x=>x.equipped&&x.actionData?.weapon&&x.actionData?.damage);
 for(const item of equippedWeapons){const d=item.actionData||{};if(attacks.some(a=>text(a.name)===text(item.name)))continue;const ability=String(d.ability||"").toUpperCase();const score=ability?mod(c.abilities?.[ability]):/ranged/i.test(d.weaponCategory||"")?mod(c.abilities?.DEX):/finesse/i.test(String(d.properties))?Math.max(mod(c.abilities?.DEX),mod(c.abilities?.STR)):mod(c.abilities?.STR);const proficiencies=(c.weaponProficiencies||[]).map(text);
 const weaponName=text(item.name),weaponClass=text(d.weaponCategory||"");
 const classNames=Object.keys(classLevels).map(text);
 const martial=["barbarian","fighter","paladin","ranger"].some(x=>classNames.includes(x));
 const simple=["barbarian","bard","cleric","druid","fighter","monk","paladin","ranger","rogue","warlock"].some(x=>classNames.includes(x));
 const limited=["dagger","dart","sling","quarterstaff","light crossbow"].some(x=>weaponName.includes(x));
 const selected=["hand crossbow","longsword","rapier","shortsword"].some(x=>weaponName.includes(x));
 const inferredProficiency=proficiencies.includes(weaponName)||proficiencies.includes(weaponClass)||(weaponClass.includes("martial")&&martial)||(weaponClass.includes("simple")&&simple)||((classNames.includes("bard")||classNames.includes("rogue"))&&selected)||(classNames.some(x=>["sorcerer","wizard"].includes(x))&&limited)||(classNames.includes("monk")&&weaponName.includes("shortsword"));
 const proficient=d.proficient===true?true:d.proficient===false?false:inferredProficiency;
 const prof=proficient?(Number(c.proficiencyBonus)||2):0;attacks.push({id:"inventory-"+(item.id||item.name),name:item.name,kind:d.weaponCategory||"Melee Weapon",range:d.range||"5 ft.",attackBonus:Number(d.attackBonus??(score+prof)),damage:d.damage,damageModifier:Number(d.damageModifier??score),damageType:d.damageType||"",source:"Equipped inventory",description:item.description||"",properties:d.properties||""});}
 const contentEntries=c.contentEntries||[];
 const actionTypeOf=entry=>String(entry.actionData?.actionType||entry.actionData?.activation||"").toLowerCase();
 const eligible=entry=>{
  const d=entry.actionData||{},cls=String(d.className||"").toLowerCase(),sub=String(d.subclass||"").toLowerCase(),species=String(d.species||"").toLowerCase(),feat=String(d.feat||"").toLowerCase();
  if(cls&&!Object.keys(classLevels).some(x=>text(x)===text(cls)))return false;
  if(sub&&!Object.values(c.subclassesByClass||{}).some(x=>text(x)===text(sub))&&text(c.subclass)!==text(sub))return false;
  if(species&&text(c.species)!==text(species))return false;
  if(feat&&!features.some(x=>text(x.name||x)===text(feat)))return false;
  const required=Number(d.requiredLevel||(entry.category==="Classes"?entry.level:0)||0);
  if(required&&cls&&Number(classLevels[Object.keys(classLevels).find(x=>text(x)===text(cls))]||0)<required)return false;
  if(required&&!cls&&Number(c.level||1)<required)return false;
  return true;
 };
 const databaseActions=[...contentEntries.filter(e=>e.actionData&&actionTypeOf(e)&&eligible(e)),...features.filter(f=>f.actionData?.actionType).map(f=>({name:f.name,description:f.description,source:f.source||"Character feature",actionData:f.actionData})).filter(eligible)];
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
 for(const sp of spells){const librarySpell=contentEntries.find(e=>e.category==="Spells"&&text(e.name)===text(sp.name)&&e.actionData?.attack);const imported=librarySpell?.actionData;const meta=spellAttacks[text(sp.name)]||((imported?.damage)?{damage:imported.damage,range:imported.range||"",kind:Number(sp.level)===0?"Cantrip":"Spell"}:null);if(meta&&!attacks.some(a=>text(a.name)===text(sp.name))){const profile=(c.spellcastingProfiles||[]).find(p=>(p.spells||[]).some(x=>x.name===sp.name));const level=Number(c.level)||1;const diceScale=level>=17?4:level>=11?3:level>=5?2:1;let damage=meta.damage;attacks.push({id:"spell-"+sp.name,name:sp.name,kind:meta.kind,range:meta.range,attackBonus:Number(imported?.attackBonus??profile?.attackBonus??sp.attackBonus??c.spellcasting?.attackBonus??0),damage:Number(sp.level)===0?scaleDice(imported?.damage||meta.damage,diceScale):(imported?.damage||damage),damageType:imported?.damageType||sp.damageType||"",source:sp.spellcastingClass||profile?.name||"Spell"});}}
 if(!attacks.some(a=>/unarmed strike/i.test(a.name||""))){const monkLevel=Object.entries(classLevels).find(([cls])=>text(cls)==="monk")?.[1]||0;const ability=monkLevel?Math.max(mod(c.abilities.DEX),mod(c.abilities.STR)):mod(c.abilities.STR);attacks.push({id:"unarmed-strike",name:"Unarmed Strike",kind:"Melee Attack",range:"5 ft. reach",attackBonus:(Number(c.proficiencyBonus)||2)+ability,damage:monkLevel?"1d"+dieFor(monkLevel):"1",damageModifier:ability,damageType:"bludgeoning",source:monkLevel?"Monk Martial Arts":"Unarmed"});}
 for(const sp of spells){if((sp.attack===true||sp.isAttack===true||sp.damage||sp.damageDice)&&!attacks.some(a=>text(a.name)===text(sp.name))){const profile=(c.spellcastingProfiles||[]).find(p=>(p.spells||[]).some(x=>x.name===sp.name));attacks.push({id:"spell-"+sp.spellcastingClass+"-"+sp.name,name:sp.name,kind:Number(sp.level)===0?"Cantrip":"Spell",range:sp.range||"",attackBonus:Number(sp.attackBonus??profile?.attackBonus??c.spellcasting?.attackBonus??0),damage:sp.damage||sp.damageDice||"1d6",damageType:sp.damageType||"",source:"Spell"});}}
 const actions=[...CORE_COMBAT_ACTIONS.map(a=>row(a.name,"Action",a.description))];
 const specialAttacks=[row("Grapple","Special Melee Attack","When you take the Attack action, you can replace one attack with a grapple attempt. Make a Strength (Athletics) check contested by the target Strength (Athletics) or Dexterity (Acrobatics)."),row("Shove","Special Melee Attack","When you take the Attack action, you can replace one attack with a shove attempt. Make a Strength (Athletics) check contested by the target Strength (Athletics) or Dexterity (Acrobatics) to push it 5 feet or knock it prone.")];
 const bonus=[],reactions=[],other=[];
 const add=(target,name,type,description,source,extra={})=>{const existing=target.findIndex(x=>text(x.name)===text(name));const next=row(name,type,description,source,extra);if(existing>=0){if(target[existing].contentId)target[existing]=next;return;}target.push(next);};
 add(reactions,"Opportunity Attack","Reaction","When a hostile creature you can see leaves your reach, you can use your reaction to make one melee attack against it.");
 for(const entry of databaseActions){
  const d=entry.actionData||{},kind=String(d.actionType||"Other").toLowerCase();
  const target=kind.includes("bonus")?bonus:kind.includes("reaction")?reactions:kind.includes("action")&&!kind.includes("other")?actions:other;
  if(![...actions,...bonus,...reactions,...other].some(x=>text(x.name)===text(entry.name)))add(target,entry.name,d.actionType||"Feature",entry.description||"Imported character option.",entry.source||"Content Library",{uses:d.uses,recharge:d.recharge,damage:d.damage,damageType:d.damageType,range:d.range,attackBonus:d.attackBonus,contentId:entry.id});
 }
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
  if(text(cls)==="warlock"&&lvl>=6&&sub.includes("fiend"))add(other,"Dark One’s Own Luck","Reaction","When you make an ability check or saving throw, add a d10 to the roll. Once used, recharge after a short or long rest.","The Fiend");
  if(text(cls)==="ranger"&&lvl>=3&&sub.includes("gloom stalker"))add(other,"Dread Ambusher","Feature","At the start of your first turn of each combat, your walking speed increases by 10 feet until the end of that turn. If you take the Attack action, you can make one additional weapon attack as part of that action; if it hits, it deals an extra 1d8 damage.","Gloom Stalker");
  if(text(cls)==="fighter"&&lvl>=2)add(other,"Action Surge","Special","You can take one additional action on your turn. Once used, it recharges after a short or long rest.","Fighter");
  if(text(cls)==="fighter"&&lvl>=5)add(other,"Extra Attack","Feature","You can attack twice, instead of once, whenever you take the Attack action on your turn.","Fighter");
  if(text(cls)==="bard"&&lvl>=6&&sub.includes("valor"))add(other,"Extra Attack","Feature","You can attack twice, instead of once, whenever you take the Attack action on your turn.","College of Valor");
  if(text(cls)==="wizard"&&lvl>=6&&sub.includes("bladesinger"))add(other,"Extra Attack","Feature","You can attack twice, instead of once, whenever you take the Attack action on your turn. You can replace one attack with a cantrip.","Bladesinger");
  if(text(cls)==="barbarian"&&lvl>=1)add(bonus,"Rage","Bonus Action","Enter a rage if you are not wearing heavy armor. You gain the 2014 rage benefits and cannot cast or concentrate on spells while raging.","Barbarian",{uses:"Limited uses; recharge on a long rest"});
  if(text(cls)==="fighter"&&lvl>=1)add(bonus,"Second Wind","Bonus Action","Regain hit points equal to 1d10 + your fighter level. Once used, recharge on a short or long rest.","Fighter",{uses:"1 / short or long rest"});
  if(text(cls)==="druid"&&lvl>=2)add(other,"Wild Shape","Action","Magically assume the shape of a beast you have seen before, subject to the 2014 Wild Shape limits for your druid level.","Druid",{uses:"2 / short rest"});
  if(text(cls)==="paladin"&&lvl>=1)add(other,"Lay on Hands","Action","Touch a creature and restore hit points by spending points from your pool. You can also spend 5 points to cure one disease or neutralize one poison.","Paladin",{uses:"Pool = 5 × paladin level"});
  if(text(cls)==="cleric"&&lvl>=2)add(other,"Channel Divinity: Turn Undead","Action","Each undead that can see or hear you within 30 feet must make a Wisdom saving throw or be turned for 1 minute or until it takes damage.","Cleric");
  if(text(cls)==="bard"&&lvl>=6)add(other,"Countercharm","Action","You start a performance that lasts until the end of your next turn. You and friendly creatures within 30 feet have advantage on saving throws against being frightened or charmed.","Bard");
  if(text(cls)==="warlock"&&lvl>=1&&sub.includes("archfey"))add(other,"Fey Presence","Action","Your presence can cause creatures in a 10-foot cube originating from you to make a Wisdom saving throw or become charmed or frightened (your choice) until the end of your next turn.","The Archfey");
  if(text(cls)==="warlock"&&lvl>=6&&sub.includes("archfey"))add(reactions,"Misty Escape","Reaction","When you take damage, you can turn invisible and teleport up to 60 feet to an unoccupied space you can see. You remain invisible until the start of your next turn or until you attack or cast a spell.","The Archfey");
  if(text(cls)==="warlock"&&lvl>=1&&sub.includes("hexblade"))add(bonus,"Hexblade's Curse","Bonus Action","Curse one creature you can see within 30 feet for 1 minute. You gain bonus damage against it, score critical hits on 19 or 20, and regain hit points if it dies.","Hexblade",{uses:"1 / short or long rest"});
  if(text(cls)==="paladin"&&lvl>=3&&sub.includes("vengeance"))add(bonus,"Vow of Enmity","Bonus Action","As a bonus action, you can utter a vow of enmity against a creature you can see within 10 feet. You have advantage on attack rolls against it for 1 minute.","Oath of Vengeance",{uses:"1 / short or long rest"});
  if(text(cls)==="fighter"&&lvl>=3&&sub.includes("battle master"))add(other,"Combat Superiority","Special","You can expend superiority dice to fuel Battle Master maneuvers. The maneuvers determine the action or attack timing.","Battle Master");
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
 const actionCount=Object.entries(classLevels).reduce((best,[cls,lvl])=>{const sub=text(subclassFor(cls));const count=text(cls)==="fighter"?(lvl>=11?2:lvl>=5?1:0):(["ranger","paladin","barbarian","monk"].includes(text(cls))&&lvl>=5?1:0)||((text(cls)==="bard"&&lvl>=6&&sub.includes("valor"))||(text(cls)==="wizard"&&lvl>=6&&sub.includes("bladesinger"))?1:0);return Math.max(best,count);},0);
 const hasExtra=features.some(f=>/extra attack/i.test(f.name));
 const attacksPerAction=1+Math.max(0,actionCount||((hasExtra||hasFeature("Extra Attack"))?1:0));
 return {attacks,actions,specialAttacks,bonusActions:bonus,reactions,other,attacksPerAction,totalLevel,spells};
}
export {CORE_COMBAT_ACTIONS};
