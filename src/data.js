export const TITLE='Emberfall: The Open Wilds';
export const SAVE_KEY='emberfall-open-world-v1';
export const CLASSES=[
 {id:'warrior',name:'Warrior',title:'The Iron Oath',icon:'⚔',color:'#e7b66d',desc:'Stand your ground. Break their line.',detail:'Sword cleaves, a defensive aegis, and a devastating whirlwind.',hp:160,damage:24,rate:.52,speed:8.5,range:4.3,spell:'Sundering strike',mentor:'Captain Elowen'},
 {id:'mage',name:'Mage',title:'The Starbound Path',icon:'✧',color:'#b9a4ee',desc:'Find the power between the stars.',detail:'Arcane bolts, a blink through space, and a collapsing star.',hp:105,damage:26,rate:.65,speed:8.3,range:40,spell:'Starburst',mentor:'Archivist Sera'},
 {id:'ranger',name:'Ranger',title:'The Verdant Way',icon:'➶',color:'#9dd5a2',desc:'Read the wilds. Strike with purpose.',detail:'Precise arrows, swift windwalking, and a rain of thorns.',hp:125,damage:19,rate:.37,speed:9.6,range:48,spell:'Thorn volley',mentor:'Scout Mira'}
];
export const WEAPONS={
 warrior:[{id:'warrior-0',name:'Wayfarer’s Sword',power:1,color:'#b7c4bd',desc:'A dependable edge for a new beginning.'},{id:'warrior-1',name:'Ironbark Longsword',power:1.3,color:'#a4d3a3',desc:'Tempered with iron from the old quarry.'},{id:'warrior-2',name:'Stonewarden’s Edge',power:1.7,color:'#e7c07e',desc:'A guardian’s strength, bound to a mortal oath.'},{id:'warrior-3',name:'Dawnbringer',power:2.3,color:'#ffe3a0',desc:'The blade that carried the last light home.'}],
 mage:[{id:'mage-0',name:'Apprentice’s Staff',power:1,color:'#aab5d4',desc:'A quiet spark, waiting to be understood.'},{id:'mage-1',name:'Moonwell Staff',power:1.3,color:'#9ecfdf',desc:'Moonflower sap strengthens its living crystal.'},{id:'mage-2',name:'Staff of the First Star',power:1.7,color:'#c0a0ef',desc:'The forest guardian’s ember burns within.'},{id:'mage-3',name:'Astral Sovereign',power:2.3,color:'#f4c5ff',desc:'A constellation answers every gesture.'}],
 ranger:[{id:'ranger-0',name:'Ashwood Bow',power:1,color:'#c2b092',desc:'A simple bow, shaped by patient hands.'},{id:'ranger-1',name:'Briarstring',power:1.3,color:'#a4d3a3',desc:'Strung with moonleaf-fiber from the wilds.'},{id:'ranger-2',name:'Warden’s Whisper',power:1.7,color:'#e0c989',desc:'Its arrows remember the oldest paths.'},{id:'ranger-3',name:'Evergreen Requiem',power:2.3,color:'#beefbe',desc:'A promise that the wilds will live again.'}]
};
export const REGIONS=[
 {name:'Hearthglen',short:'Village',color:'#dbbd82',x:0,z:0},
 {name:'Whisperwood',short:'Woodland',color:'#a9d2a5',x:-110,z:-100},
 {name:'Cinderstone',short:'Ruins',color:'#dca185',x:140,z:-100},
 {name:'Astral Reach',short:'Astral',color:'#b5a2e2',x:140,z:140}
];
export const BOSSES=[
 {id:'stonewarden',name:'Thornhelm, the Stonewarden',x:-120,z:-110,hp:620,damage:22,level:3,color:'#8cba8b',type:'stone'},
 {id:'ashking',name:'Ignar, the Ash King',x:145,z:-105,hp:1200,damage:32,level:6,color:'#df9874',type:'ash'},
 {id:'starless',name:'Vael, the Starless',x:145,z:150,hp:1900,damage:40,level:9,color:'#b49ae3',type:'astral'}
];
const chapter=(id,title,story,metric,target,targetId,reward,weapon=null,skill=null)=>({id,title,story,metric,target,targetId,reward,weapon,skill});
export const QUESTS={
 warrior:[
 chapter('w1','The oath begins','Elowen: Walk to the Old Waystone northwest of Hearthglen. Read the oath left by those who guarded this road.','waystone',1,'waystone',65),
 chapter('w2','Iron for the living','Elowen: Collect three iron deposits at the quarry west of the village. We will forge a weapon worthy of your oath.','iron',3,'iron-0',100,1),
 chapter('w3','Break the stoneborn','Elowen: Defeat three stoneborn sentinels in the woodland camps. Show me that your shield will never falter.','sentinelKills',3,'sentinel-camp',130,null,'R'),
 chapter('w4','An oath of roots','Elowen: Challenge Thornhelm in the western stone circle. Bring the guardian’s ember home.','stonewarden',1,'boss-stonewarden',200,2),
 chapter('w5','Hold the last light','Elowen: Ignite the western signal beacon and defend its circle for twenty seconds. Stay within the gold ring.','beacon',1,'beacon',180),
 chapter('w6','The fallen crown','Elowen: Travel east to Cinderstone. Defeat Ignar, whose iron reign has outlived his kingdom.','ashking',1,'boss-ashking',300,null,'F'),
 chapter('w7','Mend what remains','Elowen: Seal the fractured gate in the Astral Reach. Even steel must learn to heal.','rift',1,'rift',240),
 chapter('w8','Dawn after darkness','Elowen: Challenge Vael in the astral sanctuary. Return, and Dawnbringer will be yours.','starless',1,'boss-starless',500,3)
 ],
 mage:[
 chapter('m1','The first inscription','Sera: Examine the Old Waystone northwest of Hearthglen. The oldest magic is a story someone remembered.','waystone',1,'waystone',65),
 chapter('m2','Beneath a silver moon','Sera: Gather three moonflowers on the edge of Moonwell Lake. Their sap will awaken your next staff.','moonflower',3,'moonflower-0',100,1),
 chapter('m3','Silence the broken choir','Sera: Defeat three ash seers in the eastern ruins. Their stolen voices keep the wound open.','seerKills',3,'seer-camp',130,null,'R'),
 chapter('m4','A star in the roots','Sera: Defeat Thornhelm at the western stone circle. Study the ember held in the guardian’s heart.','stonewarden',1,'boss-stonewarden',200,2),
 chapter('m5','The archivist’s seal','Sera: Find the rune lectern at the ruined library. Hold E beside it to restore the lost inscription.','library',1,'library',180),
 chapter('m6','Cinders of a kingdom','Sera: Face Ignar in Cinderstone. Release the flame he has kept prisoner.','ashking',1,'boss-ashking',300,null,'F'),
 chapter('m7','The space between','Sera: Seal the fractured gate in the Astral Reach. Hold the ritual until the sky grows still.','rift',1,'rift',240),
 chapter('m8','Write a new constellation','Sera: Defeat Vael in the astral sanctuary, then return for the Astral Sovereign.','starless',1,'boss-starless',500,3)
 ],
 ranger:[
 chapter('r1','Read the old road','Mira: Scout the Old Waystone northwest of Hearthglen. A good pathfinder knows where others have walked.','waystone',1,'waystone',65),
 chapter('r2','A bow that remembers','Mira: Gather five moonleaf plants in the western meadow. I can weave a better bowstring from their fibers.','moonleaf',5,'moonleaf-0',100,1),
 chapter('r3','Teeth in the undergrowth','Mira: Defeat six dusk wolves at the woodland hunting grounds. Keep your distance and choose your shots.','wolfKills',6,'wolf-camp',130,null,'R'),
 chapter('r4','The oldest hunter','Mira: Defeat Thornhelm in the western stone circle. The guardian no longer remembers who it protects.','stonewarden',1,'boss-stonewarden',200,2),
 chapter('r5','No one left behind','Mira: Find Rowan, our lost scout, east of Moonwell Lake. Speak to them, then guide them back to Hearthglen.','rescued',1,'scout',180),
 chapter('r6','Hunt the ash king','Mira: Cross into Cinderstone and defeat Ignar. Leave the road safer than you found it.','ashking',1,'boss-ashking',300,null,'F'),
 chapter('r7','A wound in the wild','Mira: Seal the fractured gate in the Astral Reach. Let the living world breathe again.','rift',1,'rift',240),
 chapter('r8','The last long shot','Mira: Defeat Vael in the astral sanctuary. Return for the Evergreen Requiem, a bow made for a living legend.','starless',1,'boss-starless',500,3)
 ]
};
export const OBJECTS=[
 {id:'mentor',type:'mentor',x:0,z:-3,label:'Class mentor',duration:0},
 {id:'hearth',type:'hearth',x:0,z:12,label:'Hearthglen shrine',duration:0},
 {id:'waystone',type:'stone',x:-36,z:-32,label:'Old Waystone',metric:'waystone',duration:1.5},
 ...Array.from({length:3},(_,i)=>({id:'iron-'+i,type:'ore',x:-46+i*6,z:27+i%2*6,label:'Iron deposit',metric:'iron',classId:'warrior',duration:1})),
 ...Array.from({length:3},(_,i)=>({id:'moonflower-'+i,type:'flower',x:-52-i*5,z:47+i*2,label:'Moonflower',metric:'moonflower',classId:'mage',duration:.65})),
 ...Array.from({length:5},(_,i)=>({id:'moonleaf-'+i,type:'herb',x:-28-i*5,z:57+i%2*5,label:'Moonleaf',metric:'moonleaf',classId:'ranger',duration:.5})),
 {id:'beacon',type:'beacon',x:-81,z:-33,label:'Signal beacon',metric:'beacon',classId:'warrior',duration:1.5},
 {id:'library',type:'rune',x:106,z:-55,label:'Ruined library',metric:'library',classId:'mage',duration:4},
 {id:'scout',type:'scout',x:-17,z:92,label:'Rowan · lost scout',metric:'rescued',classId:'ranger',duration:1},
 {id:'rift',type:'rift',x:113,z:107,label:'Fractured gate',metric:'rift',duration:4},
 ...BOSSES.map(b=>({id:'boss-'+b.id,type:'boss',x:b.x,z:b.z+13,label:'Challenge '+b.name,bossId:b.id,duration:1}))
];
export const CAMPS=[
 {id:'wolf-camp',label:'Dusk wolf hunting grounds',type:'wolf',x:-67,z:-65,count:4},
 {id:'wolves-west',label:'Western wolf den',type:'wolf',x:-95,z:16,count:4},
 {id:'sentinel-camp',label:'Stoneborn camp',type:'sentinel',x:-60,z:-95,count:4},
 {id:'sentinels-east',label:'Fallen guard',type:'sentinel',x:74,z:-40,count:3},
 {id:'seer-camp',label:'Ash seer encampment',type:'seer',x:110,z:-90,count:4},
 {id:'astral-seers',label:'Starless watchers',type:'seer',x:110,z:155,count:4},
 {id:'astral-wolves',label:'Veil prowlers',type:'wolf',x:164,z:96,count:4}
];
export const ENEMIES={wolf:{name:'Dusk wolf',hp:65,speed:5.4,damage:10,xp:14,gold:8},sentinel:{name:'Stoneborn sentinel',hp:105,speed:3.5,damage:16,xp:22,gold:13},seer:{name:'Ash seer',hp:80,speed:3,damage:13,xp:22,gold:12}};
export const SKILLS={
 warrior:{Q:{name:'Sundering strike',cooldown:8},R:{name:'Iron Aegis',cooldown:15},F:{name:'Kingbreaker',cooldown:24}},
 mage:{Q:{name:'Starburst',cooldown:8},R:{name:'Riftstep',cooldown:12},F:{name:'Astral Convergence',cooldown:24}},
 ranger:{Q:{name:'Thorn volley',cooldown:8},R:{name:'Windwalk',cooldown:14},F:{name:'Arrowstorm',cooldown:24}}
};
export function heightAt(x,z){const d=Math.hypot(x,z),flat=Math.min(1,Math.max(0,(d-25)/40));let h=(Math.sin(x*.025)*2.4+Math.cos(z*.035)*1.8+Math.sin(x*.06+z*.045)*.85)*flat;const lake=Math.hypot(x+80,z-75);if(lake<31)h=Math.min(h,-2.5+(lake/31)**4*4);return h;}
export function biomeAt(x,z){return Math.hypot(x,z)<32?0:x>58?(z>30?3:2):1;}
export function distance(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
