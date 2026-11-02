import * as T from './vendor/three.module.js';
import {heightAt,biomeAt,OBJECTS,BOSSES,CAMPS} from './data.js';
import {mat,mesh,box,rock,geo,makeHouse} from './models.js';
const random=(a,b=0)=>{const v=Math.sin(a*127.1+b*311.7)*43758.5453;return v-Math.floor(v);};
export class World{
 constructor(canvas,low=false){
  this.low=low;this.renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:1.5));this.renderer.setSize(innerWidth,innerHeight);this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.02;this.renderer.shadowMap.enabled=!low;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
  this.scene=new T.Scene();this.scene.background=new T.Color('#afc6ce');this.scene.fog=new T.Fog('#b6c8c5',90,255);this.camera=new T.PerspectiveCamera(55,innerWidth/innerHeight,.1,450);this.scene.add(new T.HemisphereLight('#d0e6ed','#655d44',1.5));
  const sun=new T.DirectionalLight('#ffe3b8',2.4);sun.position.set(-55,100,40);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-45;sun.shadow.camera.right=45;sun.shadow.camera.top=45;sun.shadow.camera.bottom=-45;sun.shadow.camera.far=200;sun.shadow.normalBias=.06;sun.shadow.bias=-.0003;this.scene.add(sun);this.scene.add(sun.target);this.sun=sun;
  this.colliders=[];this.objects=new Map();this.animated=[];this.buildTerrain();this.buildNature();this.buildVillage();this.buildRuins();this.buildMarkers();this.resize=()=>{this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);};addEventListener('resize',this.resize);
 }
 buildTerrain(){
  const geometry=new T.PlaneGeometry(620,620,180,180);geometry.rotateX(-Math.PI/2);const p=geometry.attributes.position,colors=[];const palettes=['#aaac7b','#809765','#9a9779','#8c91a3'];
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);let y=heightAt(x,z);const edge=Math.max(Math.abs(x),Math.abs(z));if(edge>232)y+=(edge-232)*.45+Math.sin(x*.09)*Math.sin(z*.07)*Math.max(0,edge-232)*.2;p.setY(i,y);const c=new T.Color(palettes[biomeAt(x,z)]);c.multiplyScalar(.92+random(x,z)*.15);colors.push(c.r,c.g,c.b);}
  geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.computeVertexNormals();const ground=new T.Mesh(geometry,new T.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true}));ground.receiveShadow=true;this.scene.add(ground);
  const lake=mesh(new T.CircleGeometry(28,48),new T.MeshStandardMaterial({color:'#649fa9',transparent:true,opacity:.86,roughness:.28,metalness:.3}),this.scene,-80,-.65,75);lake.rotation.x=-Math.PI/2;lake.castShadow=false;this.water=lake;
  for(const [x,z] of [[-120,-110],[145,-105],[145,150],[-36,-32],[-40,50]])this.road(0,10,x,z);
  const sky=new T.Mesh(new T.SphereGeometry(400,20,12),new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{top:{value:new T.Color('#719fbf')},bottom:{value:new T.Color('#e0dcca')}},vertexShader:'varying vec3 v; void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform vec3 top;uniform vec3 bottom;varying vec3 v;void main(){float f=clamp(normalize(v).y*.9+.12,0.,1.);gl_FragColor=vec4(mix(bottom,top,f),1.);}'}));this.scene.add(sky);this.sky=sky;
 }
 road(x1,z1,x2,z2){const positions=[],indices=[],dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),nx=-dz/len*1.6,nz=dx/len*1.6;for(let i=0;i<=70;i++){const t=i/70,x=x1+dx*t,z=z1+dz*t;for(const side of [-1,1])positions.push(x+nx*side,heightAt(x+nx*side,z+nz*side)+.045,z+nz*side);if(i<70){const j=i*2;indices.push(j,j+2,j+1,j+1,j+2,j+3);}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();const m=new T.Mesh(g,mat('#b1a58a'));m.receiveShadow=true;this.scene.add(m);}
 buildNature(){
  const trunks=[],leaves=[],rocks=[];
  for(let i=0;i<650;i++){const x=(random(i,1)-.5)*450,z=(random(i,2)-.5)*450,h=heightAt(x,z);if(Math.hypot(x,z)<30||h<-.7||BOSSES.some(b=>Math.hypot(x-b.x,z-b.z)<25)||OBJECTS.some(o=>Math.hypot(x-o.x,z-o.z)<6)||Math.abs(x-145)<22&&z<0)continue;const region=biomeAt(x,z),size=3+random(i,3)*4;trunks.push({x,z,h,size,region});leaves.push({x,z,h,size,region});}
  const trunkMesh=new T.InstancedMesh(new T.CylinderGeometry(.2,.4,1,5),mat('#665d45'),trunks.length);const leafMesh=new T.InstancedMesh(new T.ConeGeometry(1,1,6),mat('#ffffff'),leaves.length*2);const dummy=new T.Object3D();trunks.forEach((p,i)=>{dummy.position.set(p.x,p.h+p.size*.45,p.z);dummy.scale.set(1,p.size,1);dummy.rotation.set(0,random(i,5)*6,0);dummy.updateMatrix();trunkMesh.setMatrixAt(i,dummy.matrix);for(let j=0;j<2;j++){dummy.position.set(p.x,p.h+p.size*(.9+j*.36),p.z);dummy.scale.set(p.size*(.57-j*.13),p.size*.95,p.size*(.57-j*.13));dummy.updateMatrix();leafMesh.setMatrixAt(i*2+j,dummy.matrix);leafMesh.setColorAt(i*2+j,new T.Color(p.region===3?'#7a819b':p.region===2?'#7f866a':i%3===0?'#597b60':'#6b8e64').multiplyScalar(.9+random(i,7)*.25));}});trunkMesh.castShadow=true;leafMesh.castShadow=true;trunkMesh.receiveShadow=true;leafMesh.receiveShadow=true;this.scene.add(trunkMesh,leafMesh);
  const stoneMesh=new T.InstancedMesh(geo.lowSphere,mat('#8b9182'),150);for(let i=0;i<150;i++){const x=(random(i,21)-.5)*460,z=(random(i,22)-.5)*460,size=.6+random(i,23)*2.2;dummy.position.set(x,heightAt(x,z)+size*.3,z);dummy.rotation.set(random(i,24),random(i,25)*6,0);dummy.scale.set(size,size*.6,size*.8);dummy.updateMatrix();stoneMesh.setMatrixAt(i,dummy.matrix);}stoneMesh.castShadow=true;this.scene.add(stoneMesh);
  const grass=new T.InstancedMesh(new T.ConeGeometry(.12,.65,3),mat('#8eaa6e'),2800);for(let i=0;i<2800;i++){const x=(random(i,31)-.5)*440,z=(random(i,32)-.5)*440;dummy.position.set(x,heightAt(x,z)+.23,z);dummy.scale.setScalar(.5+random(i,33));dummy.rotation.set(0,random(i,34)*6,.1);dummy.updateMatrix();grass.setMatrixAt(i,dummy.matrix);}this.scene.add(grass);
  for(let i=0;i<35;i++){const a=i/35*Math.PI*2,r=255+random(i,44)*15,x=Math.cos(a)*r,z=Math.sin(a)*r;const mountain=mesh(geo.cone,biomeAt(x,z)===3?'#8791a4':'#8b998a',this.scene,x,heightAt(x,z)+12,z);mountain.scale.set(17+random(i,45)*17,35+random(i,46)*35,20+random(i,47)*15);}
 }
 buildVillage(){
  for(const [x,z,rot,col] of [[-15,-8,.2,'#a99f83'],[15,-10,-.2,'#b4aa90'],[-16,14,.5,'#a1a18b'],[17,13,-.5,'#afa487']]){makeHouse(this.scene,x,heightAt(x,z),z,rot,col);this.colliders.push({x,z,radius:5});}
  const plaza=mesh(new T.CylinderGeometry(10,10,.16,16),'#c0b59a',this.scene,0,.1,0);plaza.receiveShadow=true;
  for(const x of [-6,6]){box(this.scene,'#76694d',x,3.5,-2,.2,7,.2);const flag=box(this.scene,x<0?'#8a5140':'#687f77',x,5.2,-2,1.5,2,.08);this.animated.push({mesh:flag,type:'flag',offset:x});}
  for(const [x,z] of [[-9,5],[9,5],[-7,-11],[7,-11]]){box(this.scene,'#685b40',x,1,z,.2,2,.2);rock(this.scene,'#e7c584',x,2.1,z,.3,.4,.3);}
 }
 buildRuins(){
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2,x=145+Math.cos(a)*26,z=-105+Math.sin(a)*26;if(i%5===0)continue;const h=heightAt(x,z);const col=mesh(new T.CylinderGeometry(.9,1.2,6+i%3,6),'#969b8e',this.scene,x,h+3,z);rock(this.scene,'#b4b59e',x,h+6.5,z,1.5,.5,1.5);}
  for(const b of BOSSES){const y=heightAt(b.x,b.z);const g=new T.Group();g.position.set(b.x,y+.06,b.z);this.scene.add(g);const ring=mesh(new T.RingGeometry(20,20.6,48),mat(b.color),g);ring.rotation.x=-Math.PI/2;ring.castShadow=false;for(let i=0;i<7;i++){const a=i/7*Math.PI*2,x=b.x+Math.sin(a)*22,z=b.z+Math.cos(a)*22;rock(this.scene,b.type==='astral'?'#9d93b1':'#849283',x,heightAt(x,z)+2,z,1.3,3.2,1.3);}if(b.type==='astral'){for(let i=0;i<6;i++){const a=i/6*Math.PI*2,m=rock(this.scene,'#b5a0dc',b.x+Math.sin(a)*13,y+4+i%2,b.z+Math.cos(a)*13,1.2,2.8,1.2);this.animated.push({mesh:m,type:'crystal',offset:i});}}}
  const tower=new T.Group();tower.position.set(-36,heightAt(-36,-32),-32);this.scene.add(tower);for(let i=0;i<5;i++)box(tower,'#939b8d',(i%2-.5)*.3,i*1.6,0,3-i*.2,1.5,2.7-i*.2);
 }
 buildMarkers(){
  for(const o of OBJECTS){const group=new T.Group();group.position.set(o.x,heightAt(o.x,o.z),o.z);this.scene.add(group);
   if(o.type==='mentor'){rock(group,'#ead7a4',0,3,0,.22,.4,.22);}
   if(o.type==='hearth'){mesh(new T.CylinderGeometry(1.5,1.8,.5,8),'#a4ab96',group,0,.2,0);rock(group,'#e8d69b',0,1.2,0,.4,.9,.4);}
   if(o.type==='ore')for(let j=0;j<3;j++)rock(group,j===0?'#a6c4cd':'#7f8f8e',(j-1)*.5,.45,0,.6,.8,.7);
   if(['flower','herb'].includes(o.type)){for(let j=0;j<3;j++){box(group,'#55744f',(j-1)*.25,.3,0,.07,.6,.07);rock(group,o.type==='flower'?'#d1b8f3':'#b6d39c',(j-1)*.25,.65,0,.25,.15,.23);}}
   if(o.type==='stone')rock(group,'#d4c796',0,1.2,0,.8,1.5,.35);
   if(o.type==='beacon'){mesh(new T.CylinderGeometry(.6,1,3,6),'#8d9586',group,0,1.5,0);const gem=rock(group,'#f1ca86',0,3.7,0,.5,.8,.5);this.animated.push({mesh:gem,type:'crystal',offset:1});}
   if(o.type==='rune'){box(group,'#979c91',0,.8,0,2,1.5,1.5);const book=box(group,'#bba2d4',0,1.65,0,1.4,.15,.8);book.rotation.z=.1;}
   if(o.type==='rift'){const ring=mesh(new T.TorusGeometry(2.3,.22,6,22),'#a398bd',group,0,3,0);const core=mesh(new T.CircleGeometry(2,24),new T.MeshBasicMaterial({color:'#b59ee3',transparent:true,opacity:.35,side:T.DoubleSide}),group,0,3,0);this.animated.push({mesh:core,type:'portal',offset:0});}
   if(o.type==='boss'){rock(group,'#b8ac8a',0,.6,0,.8,.8,.8);rock(group,'#e5c88c',0,1.65,0,.25,.55,.25);}
   this.objects.set(o.id,{group,definition:o});
  }
 }
 blocked(x,z){return Math.hypot(x,z)>230||heightAt(x,z)<-1.15||this.colliders.some(c=>Math.hypot(x-c.x,z-c.z)<c.radius+.65);}
 move(position,dx,dz){const x=position.x,z=position.z;if(!this.blocked(x+dx,z))position.x+=dx;if(!this.blocked(position.x,z+dz))position.z+=dz;}
 update(time,player){for(const a of this.animated){if(a.type==='flag')a.mesh.rotation.y=Math.sin(time*1.5+a.offset)*.08;if(a.type==='crystal')a.mesh.rotation.y=time*.6+a.offset;if(a.type==='portal')a.mesh.material.opacity=.3+Math.sin(time*2)*.08;}this.sky.position.copy(this.camera.position);if(player){this.sun.position.set(player.x-45,85,player.z+30);this.sun.target.position.set(player.x,0,player.z);this.sun.target.updateMatrixWorld();}}
 setLow(low){this.low=low;this.renderer.shadowMap.enabled=!low;this.renderer.setPixelRatio(Math.min(devicePixelRatio,low?1:1.5));this.resize();}
 render(){this.renderer.render(this.scene,this.camera);}
}
