import {normalizeCharacter,importCharacterJSON} from "./character.js";
const clean=v=>String(v??"").trim();
export async function importFile(file) {
  const n=file.name.toLowerCase();
  if(n.endsWith(".json")) return importCharacterJSON(await file.text());
  if(n.endsWith(".pdf")) return importPDF(file);
  if(n.endsWith(".por")||n.endsWith(".xml")||n.endsWith(".dnd5e")) return importXML(await file.text(),file.name);
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
function importXML(xml,filename) {
  const doc=new DOMParser().parseFromString(xml,"application/xml");
  if(doc.querySelector("parsererror")) throw new Error("Aurora-bestand kon niet als XML worden gelezen.");
  const raw={};
  for(const node of [...doc.querySelectorAll("*")]) {
    if(node.children.length===0&&clean(node.textContent)) raw[node.getAttribute("name")||node.getAttribute("key")||node.tagName]=clean(node.textContent);
    if(node.hasAttribute("value")&&clean(node.getAttribute("value"))) raw[node.getAttribute("name")||node.getAttribute("key")||node.tagName]=clean(node.getAttribute("value"));
  }
  const flat=Object.fromEntries(Object.entries(raw).map(([k,v])=>[k.toLowerCase().replace(/[^a-z0-9]/g,""),v]));
  const pick=(...ks)=>{for(const k of ks)if(flat[k])return flat[k];return "";};
  const name=pick("charactername","name","charname");
  if(!name) throw new Error("Geen characternaam herkend. Aurora-exportformaat nog niet ondersteund.");
  const abilities={};for(const a of ["str","dex","con","int","wis","cha"]){const v=Number(pick(a,a+"score",a+"total"));if(v>0)abilities[a.toUpperCase()]=v;}
  return {character:normalizeCharacter({name,species:pick("race","species","racename"),className:pick("class","classname"),level:Number(pick("totallevel","level"))||1,background:pick("background"),abilities,importMetadata:{source:filename,importedAt:new Date().toISOString(),rawFields:raw}}),warnings:["Aurora-exportbestanden verschillen per versie. Dit is een experimentele uitlezing; controleer de gegevens.","Alle gevonden bronvelden zijn bewaard, ook als ze nog niet gemapt zijn."]};
}
