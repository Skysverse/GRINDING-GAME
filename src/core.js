import {CLASSES,WEAPONS,QUESTS,OBJECTS,SKILLS} from './data.js';
const cap=(n,max=1e9)=>Math.min(max,Math.max(0,Math.floor(Number(n)||0)));
export function createSave(classId){
 if(!CLASSES.some(c=>c.id===classId))throw Error('Choose a valid class.');
 return {version:3,classId,level:1,xp:0,gold:0,kills:0,deaths:0,metrics:{},completed:[],collected:[],unlocked:[classId+'-0'],equipped:classId+'-0',position:{x:0,z:18},bosses:{stonewarden:0,ashking:0,starless:0},sound:false};
}
export function normalizeSave(raw){
 if(!raw||raw.version!==3)throw Error('This save belongs to a different game version.');
 const s=createSave(raw.classId);for(const k of ['level','xp','gold','kills','deaths'])s[k]=cap(raw[k]);s.level=Math.max(1,Math.min(100,s.level));
 for(const [key,value] of Object.entries(raw.metrics||{}).slice(0,100))if(/^[A-Za-z0-9-]{1,40}$/.test(key))s.metrics[key]=cap(value);
 // Only retain a contiguous chain, so an edited/corrupt save cannot strand the story.
 s.completed=[];for(const q of QUESTS[s.classId]){if(!Array.isArray(raw.completed)||!raw.completed.includes(q.id))break;s.completed.push(q.id);}
 s.collected=[...new Set(Array.isArray(raw.collected)?raw.collected.filter(id=>OBJECTS.some(o=>o.id===id)):[])];
 s.unlocked=[s.classId+'-0',...QUESTS[s.classId].filter(q=>s.completed.includes(q.id)&&q.weapon!==null).map(q=>WEAPONS[s.classId][q.weapon].id)];
 if(s.unlocked.includes(raw.equipped))s.equipped=raw.equipped;
 for(const id of ['stonewarden','ashking','starless'])s.bosses[id]=cap(raw.bosses?.[id]);
 if(Number.isFinite(raw.position?.x)&&Number.isFinite(raw.position?.z)&&Math.hypot(raw.position.x,raw.position.z)<235)s.position={x:raw.position.x,z:raw.position.z};
 s.sound=raw.sound===true;return s;
}
export function currentQuest(s){return QUESTS[s.classId][s.completed.length]||null;}
export function questProgress(s,q=currentQuest(s)){return q?Math.min(q.target,s.metrics[q.metric]||0):0;}
export function questReady(s){const q=currentQuest(s);return !!q&&questProgress(s,q)>=q.target;}
export function record(s,metric,amount=1){s.metrics[metric]=cap((s.metrics[metric]||0)+Math.max(0,amount));}
export function xpNeeded(s){return Math.floor(55+Math.pow(s.level,1.45)*28);}
export function gainXP(s,amount){s.xp+=Math.max(0,amount);let levels=0;while(s.level<100&&s.xp>=xpNeeded(s)){s.xp-=xpNeeded(s);s.level++;levels++;}if(s.level===100)s.xp=Math.min(s.xp,xpNeeded(s));return levels;}
export function claimQuest(s){const q=currentQuest(s);if(!q||!questReady(s))return null;s.completed.push(q.id);s.gold+=q.reward;gainXP(s,50+s.completed.length*24);if(q.weapon!==null){const id=WEAPONS[s.classId][q.weapon].id;if(!s.unlocked.includes(id))s.unlocked.push(id);s.equipped=id;}return q;}
export function equipWeapon(s,id){if(!s.unlocked.includes(id)||!WEAPONS[s.classId].some(w=>w.id===id))return false;s.equipped=id;return true;}
export function skillUnlocked(s,key){if(key==='Q')return true;return QUESTS[s.classId].some(q=>q.skill===key&&s.completed.includes(q.id));}
export function stats(s){const c=CLASSES.find(c=>c.id===s.classId),weapon=WEAPONS[s.classId].find(w=>w.id===s.equipped)||WEAPONS[s.classId][0];return {...c,maxHp:c.hp+(s.level-1)*15,damage:c.damage*weapon.power*(1+(s.level-1)*.1),weapon,skills:SKILLS[s.classId]};}
export function collectObject(s,id){const o=OBJECTS.find(o=>o.id===id);if(!o||!o.metric||s.collected.includes(id)||(o.classId&&o.classId!==s.classId))return false;s.collected.push(id);record(s,o.metric);gainXP(s,12);return true;}
export function recordKill(s,type,bossId=null){s.kills++;record(s,type+'Kills');if(bossId){s.bosses[bossId]=(s.bosses[bossId]||0)+1;record(s,bossId);}}
export function respawn(s){s.deaths++;const lost=Math.floor(s.gold*.1);s.gold-=lost;s.position={x:0,z:18};return lost;}
export function attackInCone(player,target,angle,range,halfAngle=1.1){const dx=target.x-player.x,dz=target.z-player.z;if(Math.hypot(dx,dz)>range+(target.radius||0))return false;const delta=Math.atan2(Math.sin(Math.atan2(dx,dz)-angle),Math.cos(Math.atan2(dx,dz)-angle));return Math.abs(delta)<halfAngle;}
