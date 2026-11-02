export const CLASSES = [
 {id:'warden',name:'Warden',icon:'⚔',desc:'Resilient · cleaving blade',hp:140,damage:20,rate:.65,speed:210,color:'#e8c489',spell:'Earthshatter'},
 {id:'arcanist',name:'Arcanist',icon:'✧',desc:'Arcane · piercing bolts',hp:90,damage:27,rate:.8,speed:220,color:'#bfa4fa',spell:'Starfall'},
 {id:'ranger',name:'Ranger',icon:'➶',desc:'Agile · rapid arrows',hp:105,damage:15,rate:.36,speed:250,color:'#91dfb2',spell:'Thorn volley'}
];
export const REGIONS=[
 {name:'The Whispering Wilds',icon:'♧',desc:'Ancient woods. Restless spirits.',color:'#7cc6a0',ground:'#101f21',gate:0,mult:1},
 {name:'Cinderstone Ruins',icon:'♜',desc:'A fallen kingdom beneath the ash.',color:'#e2a074',ground:'#25201e',gate:5,mult:1.65},
 {name:'The Astral Hollow',icon:'✧',desc:'Where the veil between worlds thins.',color:'#b1a1ef',ground:'#1a1930',gate:10,mult:2.7}
];
export const RARITIES=['Common','Uncommon','Rare','Epic','Legendary'];
export const SLOTS=['weapon','armor','charm'];
export const ICONS={weapon:'⚔',armor:'◈',charm:'✧'};
export const UPGRADES=[
 {id:'power',name:'Ember blade',desc:'+6% base damage per rank',icon:'⚔'},
 {id:'vitality',name:'Heartwood',desc:'+12 maximum health per rank',icon:'♡'},
 {id:'fortune',name:'Fortune’s favor',desc:'+3% rare loot chance per rank (max 10)',icon:'✧'},
 {id:'haste',name:'Windwalker',desc:'+2% speed & attack speed per rank (max 20)',icon:'➶'}
];
export function freshSave(){return {version:1,gold:0,shards:0,embers:0,ascensions:0,kills:0,bosses:0,runs:0,bestWave:0,totalLevels:0,upgrades:{power:0,vitality:0,fortune:0,haste:0},equipped:{weapon:null,armor:null,charm:null},inventory:[],quests:{kills:0,bosses:0,waves:0},classId:'warden',region:0,sound:false};}
export function normalizeSave(raw){
 if(!raw || raw.version!==1) throw Error('This is not an Emberfall save.');
 const s=freshSave();
 for(const k of ['gold','shards','embers','ascensions','kills','bosses','runs','bestWave','totalLevels'])s[k]=Math.min(1e12,Math.max(0,Math.floor(Number(raw[k])||0)));
 for(const u of UPGRADES)s.upgrades[u.id]=Math.min(u.id==='fortune'?10:u.id==='haste'?20:1000,Math.max(0,Math.floor(Number(raw.upgrades?.[u.id])||0)));
 for(const k of ['kills','bosses','waves'])s.quests[k]=Math.min(1e5,Math.max(0,Math.floor(Number(raw.quests?.[k])||0)));
 const item=i=>i && SLOTS.includes(i.slot) && Number.isInteger(i.rarity) && i.rarity>=0&&i.rarity<5 && Number.isFinite(i.power)&&i.power>0 ? {id:String(i.id).slice(0,60),slot:i.slot,rarity:i.rarity,power:Math.min(1e7,i.power),name:String(i.name).slice(0,70)}:null;
 s.inventory=Array.isArray(raw.inventory)?raw.inventory.map(item).filter(Boolean).slice(0,60):[];
 for(const slot of SLOTS){let i=item(raw.equipped?.[slot]);s.equipped[slot]=i?.slot===slot?i:null;}
 if(CLASSES.some(c=>c.id===raw.classId))s.classId=raw.classId;
 s.region=Math.min(2,Math.max(0,Math.floor(Number(raw.region)||0)));if(s.bestWave<REGIONS[s.region].gate)s.region=0;
 s.sound=raw.sound===true;return s;
}
export function upgradeCost(level){return Math.floor(55*Math.pow(1.38,level));}
export function stats(s){const c=CLASSES.find(c=>c.id===s.classId)||CLASSES[0];return {...c,hp:c.hp+s.upgrades.vitality*12+(s.equipped.armor?.power||0)*4,damage:(c.damage+(s.equipped.weapon?.power||0)*1.5)*(1+s.upgrades.power*.06)*(1+s.ascensions*.1),rate:c.rate/(1+s.upgrades.haste*.02),speed:c.speed*(1+s.upgrades.haste*.02),crit:Math.min(.65,.08+(s.equipped.charm?.power||0)*.002),magnet:100};}
export function rollLoot(wave,region,fortune=0,rng=Math.random){
 const r=rng()+fortune*.014;const rarity=r> .992?4:r>.94?3:r>.77?2:r>.45?1:0;
 const slot=SLOTS[Math.min(2,Math.floor(rng()*3))];
 const power=Math.round((4+wave*1.3)*(1+rarity*.7)*(1+region*.5)*(0.85+rng()*.3));
 const names={weapon:['Iron Edge','Briarblade','Moonpiercer','Void Cleaver','Dawnbreaker'],armor:['Worn Mantle','Mossguard','Silverweave','Dusk Aegis','Sunforged Plate'],charm:['Old Sigil','Forest Heart','Starshard','Eclipse Eye','Eternal Ember']};
 return {id:Date.now().toString(36)+rng().toString(36).slice(2,9),slot,rarity,power,name:names[slot][rarity]};
}
export function salvageValue(item){return Math.max(1,Math.floor(item.power*(item.rarity+1)/3));}
export function questInfo(s,key){const stage=s.quests[key]||0;const base={kills:60,bosses:1,waves:5}[key];const target=key==='waves'?base+stage*5:base*(stage+1);return {key,title:{kills:'Thin the darkness',bosses:'Hunt the fallen',waves:'Into the unknown'}[key],current:{kills:s.kills,bosses:s.bosses,waves:s.bestWave}[key],target,reward:Math.floor((key==='bosses'?150:100)*(1+stage*.6))};}
export function claimQuest(s,key){const q=questInfo(s,key);if(q.current<q.target)return false;s.gold+=q.reward;s.shards+=5;s.quests[key]++;return true;}
export function buyUpgrade(s,id){const u=UPGRADES.find(x=>x.id===id);if(!u)return false;const l=s.upgrades[id],cost=upgradeCost(l);if(s.gold<cost||l>=(id==='fortune'?10:id==='haste'?20:1000))return false;s.gold-=cost;s.upgrades[id]++;return true;}
export function ascend(s){if(s.bestWave<15+s.ascensions*5)return false;s.ascensions++;s.embers+=1;s.gold=0;s.upgrades={power:0,vitality:0,fortune:0,haste:0};return true;}
