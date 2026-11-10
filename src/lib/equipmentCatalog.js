export const EQUIPMENT_CATALOG = [
 // Weapons: 2014 basic weapon properties, cost in GP, weight in lb.
 {id:"club",name:"Club",category:"Weapon",weight:2,cost:0.1,actionData:{weapon:true,damage:"1d4",damageType:"bludgeoning",weaponCategory:"Simple Weapon",range:"5 ft.",properties:"Light"}},
 {id:"dagger",name:"Dagger",category:"Weapon",weight:1,cost:2,actionData:{weapon:true,damage:"1d4",damageType:"piercing",weaponCategory:"Simple Weapon",range:"20/60 ft.",properties:"Finesse, light, thrown",ability:"DEX"}},
 {id:"greatclub",name:"Greatclub",category:"Weapon",weight:10,cost:0.2,actionData:{weapon:true,damage:"1d8",damageType:"bludgeoning",weaponCategory:"Simple Weapon",range:"5 ft.",properties:"Two-handed"}},
 {id:"handaxe",name:"Handaxe",category:"Weapon",weight:2,cost:5,actionData:{weapon:true,damage:"1d6",damageType:"slashing",weaponCategory:"Simple Weapon",range:"20/60 ft.",properties:"Light, thrown"}},
 {id:"javelin",name:"Javelin",category:"Weapon",weight:2,cost:0.5,actionData:{weapon:true,damage:"1d6",damageType:"piercing",weaponCategory:"Simple Weapon",range:"30/120 ft.",properties:"Thrown"}},
 {id:"light-hammer",name:"Light Hammer",category:"Weapon",weight:2,cost:2,actionData:{weapon:true,damage:"1d4",damageType:"bludgeoning",weaponCategory:"Simple Weapon",range:"20/60 ft.",properties:"Light, thrown"}},
 {id:"mace",name:"Mace",category:"Weapon",weight:4,cost:5,actionData:{weapon:true,damage:"1d6",damageType:"bludgeoning",weaponCategory:"Simple Weapon",range:"5 ft.",properties:""}},
 {id:"quarterstaff",name:"Quarterstaff",category:"Weapon",weight:4,cost:0.2,actionData:{weapon:true,damage:"1d6",damageType:"bludgeoning",weaponCategory:"Simple Weapon",range:"5 ft.",properties:"Versatile (1d8)"}},
 {id:"sickle",name:"Sickle",category:"Weapon",weight:2,cost:1,actionData:{weapon:true,damage:"1d4",damageType:"slashing",weaponCategory:"Simple Weapon",range:"5 ft.",properties:"Light"}},
 {id:"spear",name:"Spear",category:"Weapon",weight:3,cost:1,actionData:{weapon:true,damage:"1d6",damageType:"piercing",weaponCategory:"Simple Weapon",range:"20/60 ft.",properties:"Thrown, versatile (1d8)"}},
 {id:"light-crossbow",name:"Light Crossbow",category:"Weapon",weight:5,cost:25,actionData:{weapon:true,damage:"1d8",damageType:"piercing",weaponCategory:"Simple Weapon",range:"80/320 ft.",properties:"Ammunition, loading, two-handed",ability:"DEX"}},
 {id:"dart",name:"Dart",category:"Weapon",weight:0.25,cost:0.05,actionData:{weapon:true,damage:"1d4",damageType:"piercing",weaponCategory:"Simple Weapon",range:"20/60 ft.",properties:"Finesse, thrown",ability:"DEX"}},
 {id:"shortbow",name:"Shortbow",category:"Weapon",weight:2,cost:25,actionData:{weapon:true,damage:"1d6",damageType:"piercing",weaponCategory:"Simple Weapon",range:"80/320 ft.",properties:"Ammunition, two-handed",ability:"DEX"}},
 {id:"sling",name:"Sling",category:"Weapon",weight:0,cost:0.1,actionData:{weapon:true,damage:"1d4",damageType:"bludgeoning",weaponCategory:"Simple Weapon",range:"30/120 ft.",properties:"Ammunition",ability:"DEX"}},
 {id:"longbow",name:"Longbow",category:"Weapon",weight:2,cost:50,actionData:{weapon:true,damage:"1d8",damageType:"piercing",weaponCategory:"Martial Weapon",range:"150/600 ft.",properties:"Ammunition, heavy, two-handed",ability:"DEX"}},
 {id:"heavy-crossbow",name:"Heavy Crossbow",category:"Weapon",weight:18,cost:50,actionData:{weapon:true,damage:"1d10",damageType:"piercing",weaponCategory:"Martial Weapon",range:"100/400 ft.",properties:"Ammunition, heavy, loading, two-handed",ability:"DEX"}},
 {id:"battleaxe",name:"Battleaxe",category:"Weapon",weight:4,cost:10,actionData:{weapon:true,damage:"1d8",damageType:"slashing",weaponCategory:"Martial Weapon",range:"5 ft.",properties:"Versatile (1d10)"}},
 {id:"flail",name:"Flail",category:"Weapon",weight:2,cost:10,actionData:{weapon:true,damage:"1d8",damageType:"bludgeoning",weaponCategory:"Martial Weapon",range:"5 ft.",properties:""}},
 {id:"glaive",name:"Glaive",category:"Weapon",weight:6,cost:20,actionData:{weapon:true,damage:"1d10",damageType:"slashing",weaponCategory:"Martial Weapon",range:"10 ft.",properties:"Heavy, reach, two-handed"}},
 {id:"greataxe",name:"Greataxe",category:"Weapon",weight:7,cost:30,actionData:{weapon:true,damage:"1d12",damageType:"slashing",weaponCategory:"Martial Weapon",range:"5 ft.",properties:"Heavy, two-handed"}},
 {id:"greatsword",name:"Greatsword",category:"Weapon",weight:6,cost:50,actionData:{weapon:true,damage:"2d6",damageType:"slashing",weaponCategory:"Martial Weapon",range:"5 ft.",properties:"Heavy, two-handed"}},
 {id:"longsword",name:"Longsword",category:"Weapon",weight:3,cost:15,actionData:{weapon:true,damage:"1d8",damageType:"slashing",weaponCategory:"Martial Weapon",range:"5 ft.",properties:"Versatile (1d10)"}},
 {id:"rapier",name:"Rapier",category:"Weapon",weight:2,cost:25,actionData:{weapon:true,damage:"1d8",damageType:"piercing",weaponCategory:"Martial Weapon",range:"5 ft.",properties:"Finesse",ability:"DEX"}},
 {id:"scimitar",name:"Scimitar",category:"Weapon",weight:3,cost:25,actionData:{weapon:true,damage:"1d6",damageType:"slashing",weaponCategory:"Martial Weapon",range:"5 ft.",properties:"Finesse, light",ability:"DEX"}},
 {id:"shortsword",name:"Shortsword",category:"Weapon",weight:2,cost:10,actionData:{weapon:true,damage:"1d6",damageType:"piercing",weaponCategory:"Martial Weapon",range:"5 ft.",properties:"Finesse, light",ability:"DEX"}},
 {id:"warhammer",name:"Warhammer",category:"Weapon",weight:2,cost:15,actionData:{weapon:true,damage:"1d8",damageType:"bludgeoning",weaponCategory:"Martial Weapon",range:"5 ft.",properties:"Versatile (1d10)"}},
 {id:"whip",name:"Whip",category:"Weapon",weight:3,cost:2,actionData:{weapon:true,damage:"1d4",damageType:"slashing",weaponCategory:"Martial Weapon",range:"10 ft.",properties:"Finesse, reach",ability:"DEX"}},
 // Armor and shields: AC, category, strength requirement, and stealth notes.
 {id:"padded",name:"Padded Armor",category:"Armor",weight:8,cost:5,armorBaseAC:11,armorCategory:"light",stealthDisadvantage:true},
 {id:"leather",name:"Leather Armor",category:"Armor",weight:10,cost:10,armorBaseAC:11,armorCategory:"light"},
 {id:"studded-leather",name:"Studded Leather",category:"Armor",weight:13,cost:45,armorBaseAC:12,armorCategory:"light"},
 {id:"hide",name:"Hide Armor",category:"Armor",weight:12,cost:10,armorBaseAC:12,armorCategory:"medium"},
 {id:"chain-shirt",name:"Chain Shirt",category:"Armor",weight:20,cost:50,armorBaseAC:13,armorCategory:"medium"},
 {id:"scale-mail",name:"Scale Mail",category:"Armor",weight:45,cost:50,armorBaseAC:14,armorCategory:"medium",stealthDisadvantage:true},
 {id:"breastplate",name:"Breastplate",category:"Armor",weight:20,cost:400,armorBaseAC:14,armorCategory:"medium"},
 {id:"half-plate",name:"Half Plate",category:"Armor",weight:40,cost:750,armorBaseAC:15,armorCategory:"medium",stealthDisadvantage:true},
 {id:"ring-mail",name:"Ring Mail",category:"Armor",weight:40,cost:30,armorBaseAC:14,armorCategory:"heavy",stealthDisadvantage:true},
 {id:"chain-mail",name:"Chain Mail",category:"Armor",weight:55,cost:75,armorBaseAC:16,armorCategory:"heavy",strengthRequirement:13,stealthDisadvantage:true},
 {id:"splint",name:"Splint Armor",category:"Armor",weight:60,cost:200,armorBaseAC:17,armorCategory:"heavy",strengthRequirement:15,stealthDisadvantage:true},
 {id:"plate",name:"Plate Armor",category:"Armor",weight:65,cost:1500,armorBaseAC:18,armorCategory:"heavy",strengthRequirement:15,stealthDisadvantage:true},
 {id:"shield",name:"Shield",category:"Shield",weight:6,cost:10,isShield:true},
 // Common adventuring gear and containers.
 {id:"backpack",name:"Backpack",category:"Gear",weight:5,cost:2,isContainer:true,maxContentWeightLb:30},
 {id:"pouch",name:"Pouch",category:"Gear",weight:1,cost:0.5,isContainer:true,maxContentWeightLb:6},
 {id:"sack",name:"Sack",category:"Gear",weight:0.5,cost:0.01,isContainer:true,maxContentWeightLb:30},
 {id:"bedroll",name:"Bedroll",category:"Gear",weight:7,cost:1},
 {id:"rope-hempen",name:"Hempen Rope (50 feet)",category:"Gear",weight:10,cost:1},
 {id:"torch",name:"Torch",category:"Gear",weight:1,cost:0.01},
 {id:"rations",name:"Rations (1 day)",category:"Consumable",weight:2,cost:0.5},
 {id:"waterskin",name:"Waterskin",category:"Gear",weight:5,cost:0.2},
 {id:"thieves-tools",name:"Thieves' Tools",category:"Tool",weight:1,cost:25},
 {id:"abacus",name:"Abacus",category:"Gear",weight:2,cost:2,description:"A counting device used for arithmetic."},
 {id:"acid-vial",name:"Acid (vial)",category:"Gear",weight:1,cost:25,description:"A vial of corrosive acid."},
 {id:"alchemists-fire",name:"Alchemist's Fire (flask)",category:"Gear",weight:1,cost:50,description:"An adhesive, flammable liquid."},
 {id:"antitoxin",name:"Antitoxin (vial)",category:"Consumable",weight:0,cost:50,description:"Grants advantage on saving throws against poison for 1 hour."},
 {id:"arcane-focus",name:"Arcane Focus",category:"Gear",weight:1,cost:10,description:"A crystal, orb, rod, staff or wand used as an arcane focus."},
 {id:"ball-bearings",name:"Ball Bearings (bag of 1,000)",category:"Gear",weight:2,cost:1},
 {id:"barrel",name:"Barrel",category:"Gear",weight:70,cost:2,isContainer:true,maxContentWeightLb:300},
 {id:"basket",name:"Basket",category:"Gear",weight:2,cost:0.4,isContainer:true,maxContentWeightLb:40},
 {id:"bell",name:"Bell",category:"Gear",weight:0,cost:1},
 {id:"blanket",name:"Blanket",category:"Gear",weight:3,cost:0.5},
 {id:"book",name:"Book",category:"Gear",weight:5,cost:25},
 {id:"bottle-glass",name:"Bottle, Glass",category:"Gear",weight:2,cost:2},
 {id:"bucket",name:"Bucket",category:"Gear",weight:2,cost:0.05,isContainer:true,maxContentWeightLb:20},
 {id:"caltrops",name:"Caltrops (bag of 20)",category:"Gear",weight:2,cost:1},
 {id:"candle",name:"Candle",category:"Gear",weight:0,cost:0.01},
 {id:"chain",name:"Chain (10 feet)",category:"Gear",weight:10,cost:5},
 {id:"chest",name:"Chest",category:"Gear",weight:25,cost:5,isContainer:true,maxContentWeightLb:300},
 {id:"clothes-common",name:"Clothes, Common",category:"Clothing",weight:3,cost:0.5},
 {id:"clothes-traveler",name:"Clothes, Traveler's",category:"Clothing",weight:4,cost:2},
 {id:"component-pouch",name:"Component Pouch",category:"Gear",weight:2,cost:25},
 {id:"crowbar",name:"Crowbar",category:"Gear",weight:5,cost:2},
 {id:"grappling-hook",name:"Grappling Hook",category:"Gear",weight:4,cost:2},
 {id:"hammer",name:"Hammer",category:"Gear",weight:3,cost:1},
 {id:"healers-kit",name:"Healer's Kit",category:"Gear",weight:3,cost:5},
 {id:"holy-symbol",name:"Holy Symbol",category:"Gear",weight:1,cost:5},
 {id:"ink",name:"Ink (1 ounce bottle)",category:"Gear",weight:0,cost:10},
 {id:"ink-pen",name:"Ink Pen",category:"Gear",weight:0,cost:0.02},
 {id:"lantern-hooded",name:"Lantern, Hooded",category:"Gear",weight:2,cost:5},
 {id:"lock",name:"Lock",category:"Gear",weight:1,cost:10},
 {id:"manacles",name:"Manacles",category:"Gear",weight:6,cost:2},
 {id:"mess-kit",name:"Mess Kit",category:"Gear",weight:1,cost:0.2},
 {id:"mirror-steel",name:"Mirror, Steel",category:"Gear",weight:0.5,cost:5},
 {id:"oil-flask",name:"Oil (flask)",category:"Consumable",weight:1,cost:0.1},
 {id:"paper",name:"Paper (one sheet)",category:"Gear",weight:0,cost:0.2},
 {id:"parchment",name:"Parchment (one sheet)",category:"Gear",weight:0,cost:0.1},
 {id:"potion-healing",name:"Potion of Healing",category:"Consumable",weight:0.5,cost:50,magicItem:true,description:"Magical potion. Drinking it restores 2d4 + 2 hit points."},
 {id:"quiver",name:"Quiver",category:"Gear",weight:1,cost:1,isContainer:true,maxContentWeightLb:20},
 {id:"spyglass",name:"Spyglass",category:"Gear",weight:1,cost:1000},
 {id:"tent",name:"Tent, two-person",category:"Gear",weight:20,cost:2},
 {id:"tinderbox",name:"Tinderbox",category:"Gear",weight:1,cost:0.5},
 {id:"vial",name:"Vial",category:"Gear",weight:0,cost:1,isContainer:true,maxContentWeightLb:1},
 {id:"whetstone",name:"Whetstone",category:"Gear",weight:1,cost:0.01}
];

export function getEquipmentTemplate(id) {
 const item = EQUIPMENT_CATALOG.find(entry => entry.id === id);
 return item ? structuredClone(item) : null;
}

export function calculateContainerLoad(items = [], containerId) {
 const byId = new Map(items.map(item => [item.id, item]));
 const descendants = new Set();
 const queue = [containerId];
 while (queue.length) {
  const parent = queue.shift();
  for (const item of items) {
   if (item.containerId === parent && !descendants.has(item.id)) {
    descendants.add(item.id);
    queue.push(item.id);
   }
  }
 }
 return [...descendants].reduce((total,id) => {
  const item = byId.get(id);
  return total + Math.max(0,Number(item?.weight)||0) * Math.max(0,Number(item?.quantity)||0);
 },0);
}

export function getContainerCapacityStatus(items = [], container) {
 if (!container || !Number.isFinite(Number(container.maxContentWeightLb))) return {load:calculateContainerLoad(items,container?.id),capacity:null,overCapacity:false,remaining:null};
 const load=calculateContainerLoad(items,container.id),capacity=Math.max(0,Number(container.maxContentWeightLb)||0);
 return {load,capacity,overCapacity:load>capacity,remaining:capacity-load};
}
