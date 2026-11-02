import * as T from './vendor/three.module.js';
const mats=new Map();
export function mat(color,roughness=.9,metalness=0){const key=color+':'+roughness+':'+metalness;if(!mats.has(key))mats.set(key,new T.MeshStandardMaterial({color,roughness,metalness,flatShading:true}));return mats.get(key);}
export function mesh(geometry,color,parent,x=0,y=0,z=0){const m=new T.Mesh(geometry,typeof color==='string'||typeof color==='number'?mat(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent?.add(m);return m;}
export const geo={box:new T.BoxGeometry(1,1,1),sphere:new T.IcosahedronGeometry(1,1),lowSphere:new T.IcosahedronGeometry(1,0),cone:new T.ConeGeometry(1,1,7),cylinder:new T.CylinderGeometry(1,1,1,8)};
export function box(parent,color,x,y,z,sx,sy,sz){const m=mesh(geo.box,color,parent,x,y,z);m.scale.set(sx,sy,sz);return m;}
export function rock(parent,color,x,y,z,sx=1,sy=1,sz=1){const m=mesh(geo.lowSphere,color,parent,x,y,z);m.scale.set(sx,sy,sz);return m;}
export function shadow(parent,radius=1){const m=new T.Mesh(new T.CircleGeometry(radius,20),new T.MeshBasicMaterial({color:'#101b17',transparent:true,opacity:.24,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.y=.035;parent.add(m);return m;}
export function makeHero(classId,color='#dfbb7a',weaponColor='#c4d0c8'){
 const root=new T.Group(),rig=new T.Group();root.add(rig);const bodyColor=classId==='warrior'?'#667477':classId==='mage'?'#665d8c':'#54775b';
 const cape=box(rig,classId==='warrior'?'#7b423a':classId==='mage'?'#4e4269':'#3e5a43',0,1.3,-.27,.85,1.18,.12);cape.rotation.x=.15;
 const body=box(rig,bodyColor,0,1.4,0,.75,.85,.48);box(rig,'#9a845b',0,1.14,.26,.78,.1,.06);box(rig,color,0,1.65,.26,.19,.26,.05);
 const head=new T.Group();head.position.y=2.05;rig.add(head);rock(head,'#d7b28e',0,0,0,.29,.32,.27);rock(head,classId==='warrior'?'#819194':bodyColor,0,.16,-.035,.31,.23,.28);box(head,'#263632',-.105,0,.257,.055,.045,.025);box(head,'#263632',.105,0,.257,.055,.045,.025);
 if(classId==='mage'){const hat=mesh(geo.cone,'#6c608e',head,0,.4,0);hat.scale.set(.35,.6,.35);}
 const arms=[],legs=[];
 for(const side of [-1,1]){const arm=new T.Group();arm.position.set(side*.52,1.7,0);rig.add(arm);box(arm,bodyColor,0,-.25,0,.28,.55,.3);rock(arm,color,0,0,0,.24,.19,.25);box(arm,'#d7b28e',0,-.62,.04,.19,.22,.22);arms.push(arm);const leg=new T.Group();leg.position.set(side*.22,1.02,0);rig.add(leg);box(leg,'#354342',0,-.33,0,.28,.65,.32);box(leg,'#39403b',0,-.79,.09,.31,.28,.48);legs.push(leg);}
 const weapon=new T.Group();arms[1].add(weapon);weapon.position.set(0,-.58,.1);
 if(classId==='warrior'){box(weapon,'#7f6541',0,0,.13,.13,.13,.42);box(weapon,'#b5a276',0,0,.4,.65,.12,.13);box(weapon,weaponColor,0,0,1.25,.19,.095,1.6);const tip=mesh(new T.ConeGeometry(.13,.35,4),weaponColor,weapon,0,0,2.22);tip.rotation.x=Math.PI/2;}
 if(classId==='mage'){const staff=mesh(geo.cylinder,'#846944',weapon,0,.25,0);staff.scale.set(.065,2,.065);rock(weapon,weaponColor,0,1.35,0,.24,.36,.24);const ring=mesh(new T.TorusGeometry(.27,.035,5,16),color,weapon,0,1.36,0);ring.rotation.x=.2;}
 if(classId==='ranger'){const bow=mesh(new T.TorusGeometry(.62,.055,5,12,Math.PI),weaponColor,weapon,0,0,.3);bow.rotation.set(0,Math.PI/2,-Math.PI/2);box(weapon,'#cbd6b7',0,0,.34,.018,1.22,.018);}
 shadow(root,.85);return {root,rig,arms,legs,cape,weapon,body,head};
}
export function animateHero(model,time,moving,attack=0,dodge=0){const walk=moving?Math.sin(time*12)*.65:Math.sin(time*2)*.025;model.legs[0].rotation.x=walk;model.legs[1].rotation.x=-walk;model.arms[0].rotation.x=-walk*.6;model.arms[1].rotation.x=walk*.5;model.rig.position.y=moving?Math.abs(Math.sin(time*12))*.07:Math.sin(time*2)*.025;model.cape.rotation.x=.15+Math.abs(walk)*.15;if(attack>0){model.arms[1].rotation.y=Math.sin((1-attack/.32)*Math.PI)*1.5-.6;model.arms[1].rotation.x=-.5;model.rig.rotation.y=Math.sin((1-attack/.32)*Math.PI)*.25;}else{model.arms[1].rotation.y=0;model.rig.rotation.y=0;}model.rig.rotation.x=dodge>0?-.6:0;}
export function makeEnemy(type,boss=false,color='#9db394'){
 const root=new T.Group(),rig=new T.Group();root.add(rig);
 if(type==='wolf'){box(rig,'#616e69',0,.8,0,.95,.8,1.6);rock(rig,'#7f8b7d',0,1.1,.95,.5,.45,.55);for(const side of [-1,1]){rock(rig,'#69766f',side*.3,1.55,.95,.16,.32,.14);for(const z of [-.55,.55])box(rig,'#414f4b',side*.35,.35,z,.2,.65,.24);rock(rig,'#e8c78a',side*.2,1.21,1.39,.065,.06,.04);}const tail=box(rig,'#6b7771',0,1,-1.1,.23,.2,.85);tail.rotation.x=.5;
 }else{const scale=boss?2.4:1;rig.scale.setScalar(scale);rock(rig,type==='seer'?'#756381':boss?color:'#777e70',0,1.3,0,.78,.85,.5);rock(rig,type==='seer'?'#52495f':'#6b766c',0,2.3,0,.4,.45,.37);for(const side of [-1,1]){box(rig,'#4a534e',side*.33,.5,0,.35,.95,.4);rock(rig,boss?color:'#8c9782',side*.92,1.6,0,.37,.6,.4);rock(rig,'#ebd28a',side*.16,2.35,.35,.09,.07,.055);if(boss){const horn=mesh(geo.cone,color,rig,side*.48,2.9,0);horn.scale.set(.2,.85,.2);horn.rotation.z=-side*.4;}}if(type==='seer')rock(rig,'#c9a3e9',0,3,0,.22,.35,.22);if(boss)rock(rig,'#f3d294',0,1.65,.48,.22,.35,.15);}
 shadow(root,boss?2.5:1);return {root,rig};
}
export function makeHouse(parent,x,y,z,rotation=0,color='#a19378'){
 const g=new T.Group();g.position.set(x,y,z);g.rotation.y=rotation;parent.add(g);box(g,color,0,2,0,8,4,6);box(g,'#675d49',0,.25,0,8.5,.5,6.5);const roof=mesh(new T.ConeGeometry(6.2,3,4),'#5b6759',g,0,5.4,0);roof.rotation.y=Math.PI/4;roof.scale.z=.8;box(g,'#453f33',0,1.4,3.04,1.6,2.8,.12);for(const side of [-1,1]){box(g,'#e4b97d',side*2.5,2.3,3.06,1.1,1.2,.1);box(g,'#6c624d',side*3.6,2,3.08,.18,4,.16);}box(g,'#8b8d7c',2.5,6,0,1,3,1);return g;
}
