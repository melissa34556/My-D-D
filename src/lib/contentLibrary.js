const DB="my-dd-content-v1",STORE="entries",SOURCES="sources";
function openDB(){return new Promise((resolve,reject)=>{if(!("indexedDB" in window)){reject(new Error("IndexedDB wordt niet ondersteund in deze browser."));return;}const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE)){const s=db.createObjectStore(STORE,{keyPath:"id"});s.createIndex("name","name");s.createIndex("category","category");}if(!db.objectStoreNames.contains(SOURCES))db.createObjectStore(SOURCES,{keyPath:"id"});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function transact(store,mode,action){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(store,mode),os=tx.objectStore(store);let result;try{result=action(os);}catch(e){reject(e);db.close();return;}tx.oncomplete=()=>{db.close();resolve(result?.result);};tx.onerror=()=>{db.close();reject(tx.error);};});}
export async function getContent(){const db=await openDB();return new Promise((resolve,reject)=>{const req=db.transaction(STORE).objectStore(STORE).getAll();req.onsuccess=()=>{db.close();resolve(req.result||[]);};req.onerror=()=>{db.close();reject(req.error);};});}
export async function saveContent(records){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite"),os=tx.objectStore(STORE);records.forEach(x=>os.put(x));tx.oncomplete=()=>{db.close();resolve(records.length);};tx.onerror=()=>{db.close();reject(tx.error);};});}
export async function removeContent(id){return transact(STORE,"readwrite",os=>os.delete(id));}
export async function getActionContent(){const records=await getContent();return records.filter(x=>["Classes","Species","Feats","Equipment","Spells","Rules","Other"].includes(x.category));}
export async function getSources(){const db=await openDB();return new Promise((resolve,reject)=>{const req=db.transaction(SOURCES).objectStore(SOURCES).getAll();req.onsuccess=()=>{db.close();resolve(req.result||[]);};req.onerror=()=>{db.close();reject(req.error);};});}
export async function saveSource(source){return transact(SOURCES,"readwrite",os=>os.put(source));}
export async function removeSource(id){return transact(SOURCES,"readwrite",os=>os.delete(id));}
const classify=s=>{const x=String(s||"").toLowerCase();if(/spell/.test(x))return"Spells";if(/class|archetype|subclass/.test(x))return"Classes";if(/race|species/.test(x))return"Species";if(/background/.test(x))return"Backgrounds";if(/feat/.test(x))return"Feats";if(/weapon|armor|equipment|item|gear/.test(x))return"Equipment";if(/monster|creature/.test(x))return"Creatures";if(/rule|condition/.test(x))return"Rules";return"Other";};
const idFor=(source,id,name)=>source+":"+String(id||name).toLowerCase().replace(/[^a-z0-9]+/g,"-");
const direct=(node,tag)=>node.querySelector(":scope > "+tag)?.textContent?.trim()||"";
function xmlRecords(doc,filename){
 const out=[],seen=new Set(),nodes=[...doc.querySelectorAll("*")].filter(n=>n.children.length>0||n.attributes.length>0);
 for(const n of nodes){
  const name=n.getAttribute("name")||direct(n,"name")||n.getAttribute("title");if(!name||name.length>140)continue;
  const id=n.getAttribute("id")||n.getAttribute("identifier")||name;
  const ownType=[n.tagName,n.getAttribute("type"),n.getAttribute("category")].filter(Boolean).join(" ");
  const category=classify(ownType)!=="Other"?classify(ownType):classify(filename);
  const description=[...n.querySelectorAll(":scope > description,:scope > text,:scope > entries,:scope > flavor")].map(x=>x.textContent.trim()).filter(Boolean).join("\n\n");
  const rawLevel=n.getAttribute("level")||n.getAttribute("spell-level")||direct(n,"level")||direct(n,"spell-level");
  const level=rawLevel!==""&&Number.isFinite(Number(rawLevel))?Number(rawLevel):undefined;
  const key=category+":"+String(name).toLowerCase();if(seen.has(key))continue;seen.add(key);
  const actionData={actionType:n.getAttribute("action-type")||n.getAttribute("actionType")||n.getAttribute("activation")||"",className:n.getAttribute("class")||n.getAttribute("class-name")||"",subclass:n.getAttribute("subclass")||"",species:n.getAttribute("species")||n.getAttribute("race")||"",feat:n.getAttribute("feat")||"",requiredLevel:n.getAttribute("required-level")||n.getAttribute("class-level")||"",uses:n.getAttribute("uses")||"",recharge:n.getAttribute("recharge")||"",damage:n.getAttribute("damage")||"",damageType:n.getAttribute("damage-type")||"",range:n.getAttribute("range")||"",attackBonus:n.getAttribute("attack-bonus")||"",prerequisite:n.getAttribute("prerequisite")||"",attack:n.getAttribute("attack")==="true",weapon:n.getAttribute("weapon")==="true",weaponCategory:n.getAttribute("weapon-category")||"",properties:n.getAttribute("properties")||"",ability:n.getAttribute("ability")||"",proficient:n.hasAttribute("proficient")?n.getAttribute("proficient")==="true":undefined};out.push({id:idFor(filename,id,name),name:name.trim(),category,description,source:filename,sourceId:id,kind:n.tagName,...(level!==undefined?{level}:{}),actionData});
 }
 return out;
}
function jsonRecords(data,filename){
 const out=[],seen=new Set();
 const walk=(v,kind="")=>{
  if(Array.isArray(v)){v.forEach(x=>walk(x,kind));return;}
  if(!v||typeof v!=="object")return;
  const name=v.name||v.title;
  if(typeof name==="string"&&name.trim()){
   const ownType=[kind,v.type,v.category].filter(Boolean).join(" "),category=classify(ownType)!=="Other"?classify(ownType):classify(filename);
   const description=typeof v.description==="string"?v.description:typeof v.entries==="string"?v.entries:Array.isArray(v.entries)?v.entries.map(x=>typeof x==="string"?x:typeof x?.text==="string"?x.text:"").filter(Boolean).join("\n\n"):"";
   const rawLevel=v.level??v.spellLevel??v["spell-level"],level=rawLevel!==undefined&&Number.isFinite(Number(rawLevel))?Number(rawLevel):undefined;
   const key=category+":"+name.trim().toLowerCase();
   if(!seen.has(key)){seen.add(key);const actionData={actionType:v.actionType||v.activationType||v.activation?.type||v.activation||v.action||(/action|reaction/i.test(String(v.type||""))?v.type:""),className:v.className||(typeof v.class==="string"?v.class:v.class?.name)||v.classRequirement||"",subclass:(typeof v.subclass==="string"?v.subclass:v.subclass?.name)||v.subclassName||"",species:(typeof v.species==="string"?v.species:v.species?.name)||v.race||"",feat:v.feat||"",requiredLevel:v.requiredLevel||v.classLevel||v.levelRequirement||"",uses:v.uses||v.usage||"",recharge:v.recharge||v.recovery||"",damage:v.damage||v.damageDice||"",damageType:v.damageType||"",range:v.range||"",attackBonus:v.attackBonus||"",prerequisite:v.prerequisite||v.prerequisites||"",attack:!!(v.attack||v.isAttack||v.attackType||v.attackBonus!==undefined),weapon:!!(v.weapon||v.weaponCategory||v.weaponType||v.weapon?.category||(category==="Equipment"&&(v.damage||v.damageDice))),weaponCategory:v.weaponCategory||v.weaponType||v.weapon?.category||"",properties:v.properties||v.weaponProperties||v.weapon?.properties||"",ability:v.ability||v.attackAbility||"",proficient:v.proficient};out.push({id:idFor(filename,v.id||v.key||name,name),name:name.trim(),category,description,source:filename,sourceId:v.id||v.key||"",kind,...(level!==undefined?{level}:{}),actionData});}
  }
  for(const [k,x] of Object.entries(v))if(x&&typeof x==="object")walk(x,k);
 };
 walk(data);return out;
}
export async function parseContentFile(file){const text=await file.text(),name=file.name;let records=[];if(/\.json$/i.test(name)){records=jsonRecords(JSON.parse(text),name);}else if(/\.xml$/i.test(name)||/\.por$/i.test(name)||/\.dnd5e$/i.test(name)){const doc=new DOMParser().parseFromString(text,"application/xml");if(doc.querySelector("parsererror"))throw new Error(name+": ongeldig XML-bestand.");records=xmlRecords(doc,name);}else throw new Error(name+": alleen XML, JSON, POR en DND5E worden ondersteund.");return {records,filename:name};}
