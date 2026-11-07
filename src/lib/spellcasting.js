// D&D 5e (2014) multiclass Spellcasting slots. Pact Magic is always separate.
const FULL=new Set(["bard","cleric","druid","sorcerer","wizard"]);
const HALF_DOWN=new Set(["paladin","ranger"]);
const HALF_UP=new Set(["artificer"]);
const THIRD=new Set(["rogue","fighter"]);
const NONCASTER=new Set(["barbarian","monk"]);
const SLOT_TABLE=[[],[2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]];
const norm=s=>String(s||"").trim().toLowerCase();
const subclassKind=(cls,sub)=>{const s=norm(sub),c=norm(cls);if(c==="rogue"&&s==="arcane trickster")return"third";if(c==="fighter"&&s==="eldritch knight")return"third";return"";};
export function calculateMulticlassSlots(classLevels={},subclasses={}) {
 let casterLevel=0; const breakdown=[]; const unsupported=[];
 for(const [name,raw] of Object.entries(classLevels||{})){
  const level=Math.max(0,Math.floor(Number(raw?.total??raw)||0)); if(!level)continue;
  const key=norm(name),sub=typeof subclasses==="string"?subclasses:subclasses?.[name]||"";
  let contribution=0,note="";
  if(FULL.has(key))contribution=level;
  else if(HALF_DOWN.has(key))contribution=Math.floor(level/2);
  else if(HALF_UP.has(key))contribution=Math.ceil(level/2);
  else if(key==="warlock"){note="Pact Magic: aparte";}
  else if(THIRD.has(key)&&subclassKind(name,sub)==="third")contribution=Math.floor(level/3);
  else if(THIRD.has(key)){note="Geen Spellcasting-subclass herkend";}
  else if(NONCASTER.has(key)){note="Geen Spellcasting class feature";}
  else {unsupported.push(name);note="Niet automatisch meegerekend";}
  casterLevel+=contribution;breakdown.push({name,level,contribution,note});
 }
 const capped=Math.min(20,casterLevel),slots=(SLOT_TABLE[capped]||[]).reduce((o,total,i)=>{if(total)o[i+1]={total,used:0};return o;},{});
 return {casterLevel,slots,breakdown,unsupported,complete:unsupported.length===0};
}
export function parseClassLevels(value="") {
 const result={};
 for(const part of String(value).split(/\s*\/\s*/)){
  const m=part.trim().match(/^(.+?)\s+(\d+)$/); if(m)result[m[1].trim()]={total:Number(m[2])};
 }
 return result;
}
