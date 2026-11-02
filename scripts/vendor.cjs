const fs=require('node:fs');
fs.mkdirSync('src/vendor',{recursive:true});
for(const f of ['three.module.js','three.core.js'])fs.copyFileSync('node_modules/three/build/'+f,'src/vendor/'+f);
fs.copyFileSync('node_modules/three/LICENSE','src/vendor/THREE-LICENSE.txt');
