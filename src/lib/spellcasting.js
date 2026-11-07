// D&D 5e (2014) multiclass Spellcasting slots. Pact Magic is separate.
const FULL=new Set(["bard","cleric","druid","sorcerer","wizard"]);
const HALF_DOWN=new Set(["paladin","ranger"]);
const HALF_UP=new Set(["artificer"]);
const SLOT_TABLE=[[],[2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],[4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]];
const norm=s=>String(s||"").trim().toLowerCase();
export function calculateMulticlassSlots(classLevels={}) {
 let casterLevel=0; const breakdown=[]; const unsupported=[];
 for(const [name,raw] of Object.entries(classLevels||{})){
  const level=Math.max(0,Math.floor(Number(raw?.total??raw)||0)); if(!level)continue;
  const key=norm(name); let contribution=0;
  if(FULL.has(key))contribution=level;
  else if(HALF_DOWN.has(key))contribution=Math.floor(level/2);
  else if(HALF_UP.has(key))contribution=Math.ceil(level/2);
  else if(key==="warlock"){breakdown.push({name,level,contribution:0,note:"Pact Magic: aparte"});continue;}
  else {unsupported.push(name);breakdown.push({name,level,contribution:0,note:"Niet automatisch meegerekend"});continue;}
  casterLevel+=contribution;breakdown.push({name,level,contribution});
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
