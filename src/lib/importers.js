import {normalizeCharacter,importCharacterJSON} from "./character.js";
const clean=v=>String(v??"").trim();
export async function importFile(file) {
  const n=file.name.toLowerCase();
  if(n.endsWith(".json")) return importCharacterJSON(await file.text());
  if(n.endsWith(".pdf")) return importPDF(file);
  if(n.endsWith(".dnd5e")||n.endsWith(".por")||n.endsWith(".xml")) return importAurora(await file.text(),file.name);
  throw new Error("Bestandstype niet ondersteund. Kies JSON, PDF of Aurora XML/Por.");
}
async function importPDF(file) {
  const {PDFDocument}=await import("pdf-lib");
  const pdf=await PDFDocument.load(await file.arrayBuffer(),{ignoreEncryption:true});
  const fields={};
  for(const f of pdf.getForm().getFields()){try{fields[f.getName()]=clean(f.getText?.()??"");}catch{fields[f.getName()]="";}}
  const keys=Object.keys(fields);
  const find=(pattern)=>{const k=keys.find(x=>pattern.test(x));return k?fields[k]:"";};
  const name=find(/character.?name|char.?name|^name$/i);
  if(!name) throw new Error("Geen characternaam gevonden. Gebruik de ingevulde officiële D&D Beyond PDF-export.");
  const abilities={};
  for(const a of ["STR","DEX","CON","INT","WIS","CHA"]){const v=Number(find(new RegExp(a+"(?:ength|terity|stitution|elligence|dom|risma)?(?: score)?","i")));if(v>0)abilities[a]=v;}
  return {character:normalizeCharacter({name,species:find(/race|species/i),className:find(/class/i),level:Number(find(/level/i))||1,background:find(/background/i),abilities,importMetadata:{source:file.name,importedAt:new Date().toISOString(),pdfFields:fields}}),warnings:["PDF-import leest invulbare velden. Niet alle D&D Beyond-details staan noodzakelijk in de PDF.","Alle herkende PDF-velden blijven bewaard voor latere verbetering van de mapping."]};
}
function importAurora(sourceText,filename) {\n  try { const parsed=JSON.parse(sourceText); const mapped=mapAuroraJSON(parsed,filename); if(mapped) return mapped; } catch {}\n  return importXML(sourceText,filename);\n}\nfunction mapAuroraJSON(data,filename) {\n  const entries=[]; const walk=(v,path="")=>{if(!v||typeof v!=="object")return; for(const [k,x] of Object.entries(v)){entries.push([k.toLowerCase().replace(/[^a-z0-9]/g,""),x,path]); if(x&&typeof x==="object")walk(x,path+"/"+k);}}; walk(data);\n  const pick=(...keys)=>{for(const k of keys){const hit=entries.find(e=>e[0]===k&&["string","number"].includes(typeof e[1]));if(hit&&String(hit[1]).trim())return hit[1];}return "";};\n  const name=pick("charactername","name","charname"); if(!name)return null;\n  const abilities={}; for(const a of ["str","dex","con","int","wis","cha"]){const n=Number(pick(a,a+"score",a+"total"));if(n>0)abilities[a.toUpperCase()]=n;}\n  const character=normalizeCharacter({name:String(name),species:String(pick("race","species","racename")||""),className:String(pick("classname","class")||""),level:Number(pick("totallevel","level"))||1,background:String(pick("background")||""),abilities,importMetadata:{source:filename,importedAt:new Date().toISOString(),rawData:data}});\n  return {character,warnings:["Aurora .dnd5e JSON-import is voorlopig een generieke eerste mapping. Controleer alle velden; onbekende data blijft in de importmetadata bewaard."]};\n}\nfunction importXML(xml,filename) {
  const doc=new DOMParser().parseFromString(xml,"application/xml");
  if(doc.querySelector("parsererror")) throw new Error("Aurora-bestand kon niet als XML worden gelezen.");
  const root=doc.documentElement, build=root.querySelector(":scope > build");
  if(root.tagName!=="character"||!build) throw new Error("Dit XML-bestand lijkt geen Aurora character-export te zijn.");
  const text=(parent,selector)=>clean(parent?.querySelector(selector)?.textContent);
  const input=build.querySelector(":scope > input"), display=root.querySelector(":scope > display-properties");
  const val=(parent,tag)=>text(parent,tag);
  const num=(parent,tag,fallback=0)=>{const n=Number(val(parent,tag));return Number.isFinite(n)&&val(parent,tag)!==""?n:fallback;};
  const name=val(input,"name")||val(display,"name");
  if(!name) throw new Error("Geen characternaam gevonden in het Aurora-bestand.");
  const abilities={};
  const abilityNode=build.querySelector(":scope > abilities");
  for(const [key,tag] of [["STR","strength"],["DEX","dexterity"],["CON","constitution"],["INT","intelligence"],["WIS","wisdom"],["CHA","charisma"]]) abilities[key]=num(abilityNode,tag,10);
  const sum=[...build.querySelectorAll(":scope > sum > element")];
  const profIds=sum.filter(x=>x.getAttribute("type")==="Proficiency").map(x=>x.getAttribute("id")||"");
  const skillNames=["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"];
  const skillProficiencies=[...new Set(profIds.flatMap(id=>{const m=id.match(/ID_PROFICIENCY_SKILL_([A-Z_]+)$/);if(!m)return[];const found=skillNames.find(s=>s.toUpperCase().replace(/ /g,"_")===m[1]);return found?[found]:[];}))];
  const savingThrows=profIds.map(id=>{const m=id.match(/ID_PROFICIENCY_SAVINGTHROW_(STRENGTH|DEXTERITY|CONSTITUTION|INTELLIGENCE|WISDOM|CHARISMA)$/);return m?m[1]:"";}).filter(Boolean);
  const levelNodes=[...build.querySelectorAll(":scope > elements > element[type='Level']")];
  const classId=levelNodes.find(x=>x.getAttribute("multiclass")!=="true")?.getAttribute("class")||sum.find(x=>x.getAttribute("type")==="Class")?.getAttribute("id")||"";
  const className=(classId.match(/CLASS_([A-Z_]+)$/)?.[1]||"").replace(/_/g," ").toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
  const classCounts={};
  for(const lv of levelNodes){const id=lv.getAttribute("class");let cls=id?.match(/MULTICLASS_([A-Z_]+)$/)?.[1];if(!cls)cls=classId.match(/CLASS_([A-Z_]+)$/)?.[1];if(cls){cls=cls.replace(/_/g," ").toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());classCounts[cls]=(classCounts[cls]||0)+1;}}
  const classSummary=Object.entries(classCounts).map(([k,v])=>k+" "+v).join(" / ")||val(display,"class")||className;
  const subclassId=sum.find(x=>x.getAttribute("type")==="Archetype")?.getAttribute("id")||"";
  const subclass=(subclassId.replace(/^.*ARCHETYPE_[A-Z0-9]+_/,"").replace(/_/g," ").toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()));
  const equipment=[...build.querySelectorAll(":scope > equipment > item")].filter(x=>x.getAttribute("hidden")!=="true").map(x=>({name:x.getAttribute("name")||"Unknown item",quantity:Number(x.getAttribute("amount")||1),sourceId:x.getAttribute("id")||"",identifier:x.getAttribute("identifier")||"",equipped:x.getAttribute("equipped")==="true"}));
  const attacks=[...input.querySelectorAll("attacks > attack")].map(x=>({name:x.getAttribute("name")||"Attack",range:x.getAttribute("range")||"",attackBonus:Number((x.getAttribute("attack")||"").match(/[+-]?\d+/)?.[0]||0),damage:(x.getAttribute("damage")||"").split(" ")[0]||"1d6",damageType:(x.getAttribute("damage")||"").replace(/^[^ ]+\s*/,""),description:x.textContent||""}));
  const spellcasting=[...build.querySelectorAll(":scope > magic > spellcasting")].map(sc=>{
    const slotsNode=sc.querySelector("slots"), slots={};
    if(slotsNode) for(let i=1;i<=9;i++){const total=Number(slotsNode.getAttribute("s"+i)||0);if(total)slots[i]={total,used:0};}
    const spells=[...sc.querySelectorAll("cantrips > spell, spells > spell")].map(sp=>({name:sp.getAttribute("name")||"Unknown spell",level:Number(sp.getAttribute("level")||0),prepared:sp.getAttribute("prepared")==="true",known:sp.getAttribute("known")==="true",sourceId:sp.getAttribute("id")||""}));
    return {name:sc.getAttribute("name")||"",ability:sc.getAttribute("ability")||"",attackBonus:Number(sc.getAttribute("attack")||0),saveDC:Number(sc.getAttribute("dc")||0),slots,spells};
  });
  const currencyNode=input.querySelector("currency"), currency={cp:num(currencyNode,"copper"),sp:num(currencyNode,"silver"),ep:num(currencyNode,"electrum"),gp:num(currencyNode,"gold"),pp:num(currencyNode,"platinum")};
  const background=val(display,"background")||sum.find(x=>x.getAttribute("type")==="Background")?.getAttribute("id")?.replace(/^ID_BACKGROUND_/,"").replace(/_/g," ")||"";
  const features=[...new Set(sum.filter(x=>["Racial Trait","Background Feature","Feat","Class Feature","Archetype Feature","Ability Score Improvement"].includes(x.getAttribute("type"))).map(x=>(x.getAttribute("id")||"").replace(/^ID_[A-Z0-9_]+_(?:RACIAL_TRAIT|BACKGROUND_FEATURE|FEAT|CLASS_FEATURE|ARCHETYPE_FEATURE)_/,"").replace(/_/g," ").toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())).filter(Boolean))];
  const languages=sum.filter(x=>x.getAttribute("type")==="Language").map(x=>(x.getAttribute("id")||"").replace(/^ID_[A-Z0-9_]+_LANGUAGE_/,"").replace(/_/g," ").toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()));
  const traits=[...new Set(languages)];
  const backstory=val(input,"backstory"), appearance=build.querySelector(":scope > appearance");
  const nameParts=classSummary.split(" / ");
  const mainClass=nameParts[0]?.replace(/ \d+$/,"")||className;
  const hpWarning="Aurora-export bevat in dit bestand geen expliciete actuele/maximale HP-velden. HP is daarom niet gegokt en moet na import worden ingevuld.";
  const armorNames=equipment.map(x=>x.name.toLowerCase()); const dexMod=Math.floor((abilities.DEX-10)/2); let armorClass=10+dexMod;
  if(armorNames.some(x=>x.includes("studded leather"))) armorClass=12+dexMod;
  else if(armorNames.some(x=>x.includes("leather"))) armorClass=11+dexMod;
  else if(armorNames.some(x=>x.includes("chain shirt")||x.includes("hide"))) armorClass=13+Math.min(2,dexMod);
  else if(armorNames.some(x=>x.includes("scale mail")||x.includes("breastplate"))) armorClass=14+Math.min(2,dexMod);
  else if(armorNames.some(x=>x.includes("half plate"))) armorClass=15+Math.min(2,dexMod);
  else if(armorNames.some(x=>x.includes("chain mail"))) armorClass=16;
  else if(armorNames.some(x=>x.includes("splint"))) armorClass=17;
  else if(armorNames.some(x=>x.includes("plate"))) armorClass=18;
  if(armorNames.some(x=>x==="shield")) armorClass+=2;
  const character=normalizeCharacter({
    name,species:val(display,"race"),className:classSummary||mainClass,subclass:subclass||val(display,"archetype"),level:num(display,"level",levelNodes.length||1),background,
    abilities,proficiencyBonus:Math.ceil(num(display,"level",1)/4)+1,
    savingThrows,skillProficiencies,armorClass,initiative:dexMod,speed:30,
    hitPoints:{current:0,maximum:0,temporary:0},hitDiceByClass:Object.fromEntries(Object.entries(classCounts).map(([cls,total])=>[cls,{size:({"Barbarian":12,"Fighter":10,"Paladin":10,"Ranger":10,"Bard":8,"Cleric":8,"Druid":8,"Monk":8,"Rogue":8,"Warlock":8,"Sorcerer":6,"Wizard":6}[cls]||8),total,used:0}])),
    attacks,spellcasting:{ability:spellcasting[0]?.ability||"",saveDC:spellcasting[0]?.saveDC||0,attackBonus:spellcasting[0]?.attackBonus||0,slots:Object.assign({},...spellcasting.map(x=>x.slots)),spells:spellcasting.flatMap(x=>x.spells.map(sp=>({...sp,spellcastingClass:x.name})))},
    inventory:equipment,currency,features,traits,notes:[backstory,val(input,"notes"),val(input,"additional-features")].filter(Boolean).join("\n\n"),
    importMetadata:{source:filename,format:"Aurora Builder .dnd5e XML",auroraVersion:root.getAttribute("version")||"",importedAt:new Date().toISOString(),classBreakdown:classCounts,spellcasting,sourceElementIds:sum.map(x=>({type:x.getAttribute("type"),id:x.getAttribute("id")})),appearance:{age:val(appearance,"age"),height:val(appearance,"height"),weight:val(appearance,"weight"),eyes:val(appearance,"eyes"),skin:val(appearance,"skin"),hair:val(appearance,"hair")},playerName:val(input,"player-name"),experience:num(input,"experience"),gender:val(input,"gender"),languages}
  });
  const warnings=[hpWarning,"Controleer de klasseverdeling en vaardigheids-/saving throw-proficiencies. Aurora bewaart sommige afgeleide waarden als bron-ID's.","De portrait-afbeelding is niet geïmporteerd; Aurora kan deze als lokaal bestandspad opslaan dat op een ander apparaat niet geldig is."];
  if(spellcasting.length>1) warnings.push("Meerdere spellcasting-klassen zijn samengevoegd in één spellbook. De oorspronkelijke spellcasting-profielen zijn bewaard in importmetadata.");
  return {character,warnings};
}
