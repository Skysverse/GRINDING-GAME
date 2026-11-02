// Permanent, one-time objectives and class mastery. No resetting quest counters.
export const METRICS = ['manualAttacks','dashes','spells','herbs','rescued','rifts','defended','landmarks','enhanced','salvaged','rareEquipped','wisp','brute','caster','ruinsBosses','astralBosses','cleanBoss','lootFound'];
export const MOVES = {
  warden: [
    {key:'Q',name:'Earthshatter',kills:12,bosses:0,cooldown:9,desc:'Smash the ground, damage nearby foes, and recover 15 health.'},
    {key:'R',name:'Iron Aegis',kills:60,bosses:0,cooldown:15,desc:'Raise a five-second shield worth 60% of your maximum health.'},
    {key:'F',name:'Kingbreaker',kills:180,bosses:3,cooldown:22,desc:'Unleash three seconds of whirling cleaves around you.'}
  ],
  arcanist: [
    {key:'Q',name:'Starfall',kills:12,bosses:0,cooldown:9,desc:'Detonate an arcane star at the cursor, up to 400 paces away.'},
    {key:'R',name:'Riftstep',kills:60,bosses:0,cooldown:12,desc:'Blink toward your aim, bursting enemies at your destination.'},
    {key:'F',name:'Astral Convergence',kills:180,bosses:3,cooldown:22,desc:'Call a massive delayed explosion at your cursor.'}
  ],
  ranger: [
    {key:'Q',name:'Thorn Volley',kills:12,bosses:0,cooldown:9,desc:'Fire nine piercing arrows in a fan toward your aim.'},
    {key:'R',name:'Windwalk',kills:60,bosses:0,cooldown:14,desc:'Move 60% faster for six seconds and refresh your dash.'},
    {key:'F',name:'Arrowstorm',kills:180,bosses:3,cooldown:22,desc:'Call three waves of arrows onto the targeted area.'}
  ]
};
export function moveProgress(save,classId,key){
  const move=MOVES[classId]?.find(m=>m.key===key);if(!move)return null;
  const kills=save.mastery[classId].kills,bosses=save.mastery[classId].bosses;
  return {...move,unlocked:kills>=move.kills&&bosses>=move.bosses,killsNow:kills,bossesNow:bosses};
}
const q=(id,title,story,metric,target,gold,shards,requires=[],category='Journey')=>({id,title,story,metric,target,gold,shards,requires,category});
export const QUESTS=[
  q('first-strike','Steel, not fate','Captain Elowen: Practice ten deliberate attacks. Every strike is your choice.','manualAttacks',10,65,3,[],'Combat'),
  q('herbalist','The apothecary’s basket','Mira: Hold X beside five moonleaf plants. Their light may still heal the wounded.','herbs',5,100,8,[],'Gathering'),
  q('lost-scout','A light in the woods','Elowen: Find our scout northwest of camp. Hold X to speak, then lead them back to the central campfire.','rescued',1,160,10,[],'Escort'),
  q('watchtower','Where the bells fell','Archivist Sera: Find and examine the old watchtower northeast of camp.','landmarks',1,90,5,[],'Exploration'),
  q('footwork','Between the raindrops','Elowen: Perform eight dashes. A living adventurer knows when to move.','dashes',8,75,4,['first-strike'],'Training'),
  q('wisp-hunt','Rest for the restless','Sera: Release twenty woodland wisps. Their souls should not be trapped here.','wisp',20,130,6,['watchtower'],'Hunt'),
  q('beacon','Hold the last light','Elowen: Ignite the beacon southwest of camp and remain nearby to defend it for eighteen seconds.','defended',1,180,12,['lost-scout'],'Defense'),
  q('first-spell','An ember answers','Sera: Unlock your Q move through twelve class defeats, then cast a move five times.','spells',5,140,8,['first-strike'],'Mastery'),
  q('relic-finder','What the earth remembers','Mira: Recover three pieces of equipment during expeditions.','lootFound',3,120,8,['herbalist'],'Treasure'),
  q('salvage','Nothing wasted','Smith Orren: Salvage two spare items at the armory.','salvaged',2,90,10,['relic-finder'],'Crafting'),
  q('enhance','A smith’s promise','Orren: Enhance an equipped item with shards. Make something worth keeping.','enhanced',1,150,12,['salvage'],'Crafting'),
  q('rare-gear','A worthy inheritance','Orren: Equip a Rare, Epic, or Legendary item.','rareEquipped',1,180,15,['enhance'],'Equipment'),
  q('first-guardian','The hollow crown','Elowen: Defeat your first fallen guardian. Its crown no longer belongs to the dark.','bosses',1,250,18,['beacon'],'Boss'),
  q('ruins-road','Beyond the green veil','Sera: Complete wave five to open the road to Cinderstone.','bestWave',5,160,10,['watchtower'],'Journey'),
  q('brute-hunt','Stone has a heartbeat','Orren: Defeat twelve stone brutes. Their armor can still be broken.','brute',12,180,10,['first-guardian'],'Hunt'),
  q('rift-seal','Mend the broken sky','Sera: Travel to Cinderstone and seal its violet rift. Hold X beside it while the ritual completes.','rifts',1,260,20,['ruins-road'],'Ritual'),
  q('mage-hunt','Silence the choir','Mira: Defeat ten hostile casters. The voices in the ruins must stop.','caster',10,190,12,['rift-seal'],'Hunt'),
  q('ash-king','The keeper of ash','Elowen: Defeat a guardian in Cinderstone Ruins.','ruinsBosses',1,350,25,['rift-seal'],'Boss'),
  q('no-flask','An unbroken vow','Elowen: Defeat a guardian without drinking a potion during that expedition.','cleanBoss',1,300,25,['first-guardian'],'Challenge'),
  q('astral-road','The starless threshold','Sera: Complete wave ten and unlock the Astral Hollow.','bestWave',10,220,15,['ash-king'],'Journey'),
  q('second-rift','The final seam','Sera: Seal the rifts in both Cinderstone and the Astral Hollow.','rifts',2,350,25,['astral-road'],'Ritual'),
  q('starless','A name for the darkness','Elowen: Defeat a guardian in the Astral Hollow.','astralBosses',1,500,40,['second-rift'],'Boss'),
  q('warden-path','The oathkeeper’s trial','Elowen: Earn sixty defeats as the Warden to unlock Iron Aegis.','wardenKills',60,220,15,['first-spell'],'Class mastery'),
  q('arcanist-path','The scholar’s trial','Sera: Earn sixty defeats as the Arcanist to unlock Riftstep.','arcanistKills',60,220,15,['first-spell'],'Class mastery'),
  q('ranger-path','The pathfinder’s trial','Mira: Earn sixty defeats as the Ranger to unlock Windwalk.','rangerKills',60,220,15,['first-spell'],'Class mastery'),
  q('whole-story','The ember remembers','Sera: Complete wave fifteen. Beyond it, your own legends begin.','bestWave',15,600,50,['starless'],'Final chapter')
];
export function questValue(save,metric){
  if(['bosses','bestWave'].includes(metric))return save[metric];
  const classId=metric.replace(/Kills$/,'');
  if(classId!==metric&&save.mastery[classId])return save.mastery[classId].kills;
  return save.metrics[metric]||0;
}
export function questInfo(save,id){
  const quest=QUESTS.find(q=>q.id===id);if(!quest)return null;
  return {...quest,current:questValue(save,quest.metric),claimed:save.completedQuests.includes(id),available:quest.requires.every(id=>save.completedQuests.includes(id))};
}
export function claimQuest(save,id){
  const q=questInfo(save,id);if(!q||!q.available||q.claimed||q.current<q.target)return false;
  save.gold+=q.gold;save.shards+=q.shards;save.completedQuests.push(id);return true;
}
export function journal(save){return QUESTS.map(q=>questInfo(save,q.id));}
export function record(save,metric,amount=1){if(METRICS.includes(metric))save.metrics[metric]=Math.min(1e12,(save.metrics[metric]||0)+amount);}
export const WORLD_OBJECTS=[
 {id:'scout',region:0,x:-300,y:-180,type:'escort',label:'Lost scout',duration:1.5,hint:'Speak, then lead the scout back to camp',story:'Scout: I thought the light had gone. Thank you for coming back.'},
 ...Array.from({length:5},(_,i)=>({id:'moonleaf-'+i,region:0,x:Math.round(Math.cos(i/5*Math.PI*2+.3)*350),y:Math.round(Math.sin(i/5*Math.PI*2+.3)*350),type:'herb',label:'Moonleaf',duration:.35,hint:'Gather moonleaf'})),
 {id:'tower',region:0,x:260,y:-440,type:'landmark',label:'Old watchtower',duration:1.8,hint:'Examine the lost inscription',story:'The inscription reads: When the crown falls, carry its light beyond the green veil.'},
 {id:'beacon',region:0,x:-470,y:300,type:'defense',label:'Last-light beacon',duration:1.5,hint:'Ignite, then stay within the ring for 18 seconds',story:'Elowen: The beacon burns again. Now the road is ours.'},
 {id:'cinder-rift',region:1,x:350,y:-200,type:'rift',label:'Cinderstone rift',duration:3,hint:'Hold to seal the rift',story:'Sera: One wound in the sky has closed. Another waits beyond the stars.'},
 {id:'astral-rift',region:2,x:-320,y:200,type:'rift',label:'Astral seam',duration:4,hint:'Hold to mend the final seam',story:'The silence that follows is warm, like the first morning of spring.'}
];
