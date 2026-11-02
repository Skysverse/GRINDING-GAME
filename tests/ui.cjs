const {chromium}=require('playwright-core');
const {spawn}=require('node:child_process');
const {mkdirSync}=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
const server=spawn('python3',['-m','http.server','5173','--bind','127.0.0.1'],{stdio:'ignore'});
let browser;
try{
 for(let i=0;i<40;i++){try{const r=await fetch('http://127.0.0.1:5173');if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5173/?test=1');await page.waitForFunction(()=>window.__emberfall);mkdirSync('test-results',{recursive:true});
 await page.screenshot({path:'test-results/camp.png'});
 await page.getByRole('button',{name:'Begin expedition'}).click();await page.waitForTimeout(100);
 assert.equal(await page.evaluate(()=>window.__emberfall.mode),'play');
 const x=await page.evaluate(()=>window.__emberfall.run.x);await page.keyboard.down('KeyD');await page.waitForTimeout(350);await page.keyboard.up('KeyD');assert.ok((await page.evaluate(()=>window.__emberfall.run.x))>x+35);
 await page.keyboard.press('Space');assert.ok(await page.evaluate(()=>window.__emberfall.run.dashCd>0));
 await page.keyboard.press('KeyQ');assert.ok(await page.evaluate(()=>window.__emberfall.run.spellCd>0));
 await page.evaluate(()=>{const g=window.__emberfall;g.run.hp=g.run.maxHp/2;});await page.keyboard.press('KeyE');assert.equal(await page.evaluate(()=>window.__emberfall.run.potions),2);
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.__emberfall.mode),'pause');const time=await page.evaluate(()=>window.__emberfall.run.elapsed);await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.__emberfall.run.elapsed),time);await page.getByRole('button',{name:'Resume expedition'}).click();
 // Put a real foe in attack range; the animation loop must kill it and award loot currency.
 await page.evaluate(()=>{const g=window.__emberfall;g.spawnEnemy('wisp');const e=g.run.enemies.at(-1);e.x=g.run.x+65;e.y=g.run.y;e.hp=5;});
 await page.waitForFunction(()=>window.__emberfall.save.kills>0);
 await page.evaluate(()=>{const g=window.__emberfall;g.gainXP(g.run.need);});await page.waitForFunction(()=>window.__emberfall.mode==='level');await page.locator('[data-boon]').first().click();assert.equal(await page.evaluate(()=>window.__emberfall.run.level),2);
 await page.evaluate(()=>{const g=window.__emberfall;g.addLoot(5);g.spawnBoss();});await page.waitForTimeout(150);assert.ok(await page.locator('#boss-hud').isVisible());await page.screenshot({path:'test-results/combat.png'});
 // Exercise telegraphed boss attacks and their damage resolution without waiting several minutes.
 const result=await page.evaluate(()=>{const g=window.__emberfall,r=g.run;r.enemies=r.enemies.filter(e=>e.type==='boss');const b=r.enemies[0];b.x=r.x+220;b.y=r.y;b.attack=0;g.update(.02);const projectiles=r.bullets.filter(b=>b.enemy).length;b.attack=0;g.update(.02);const hazards=r.hazards.length;b.attack=0;g.update(.02);const charge=r.hazards.some(h=>h.type==='charge');g.damageEnemy(b,b.hp+1);return {projectiles,hazards,charge,bosses:g.save.bosses};});
 assert.ok(result.projectiles>=12);assert.ok(result.hazards>=5);assert.ok(result.charge);assert.equal(result.bosses,1);
 await page.evaluate(()=>{const g=window.__emberfall;g.run.invuln=0;g.hurt(1e9);});assert.equal(await page.evaluate(()=>window.__emberfall.mode),'end');await page.getByRole('button',{name:'Return to sanctuary'}).click();
 await page.getByRole('button',{name:'Equipment',exact:true}).click();await page.locator('[data-equip]').first().click();assert.ok(await page.evaluate(()=>Object.values(window.__emberfall.save.equipped).some(Boolean)));
 await page.getByRole('button',{name:'Quests',exact:true}).click();await page.locator('[data-quest="bosses"]').click();assert.equal(await page.evaluate(()=>window.__emberfall.save.quests.bosses),1);
 const before=await page.evaluate(()=>JSON.stringify(window.__emberfall.save));await page.reload();await page.waitForFunction(()=>window.__emberfall);assert.equal(await page.evaluate(()=>JSON.stringify(window.__emberfall.save)),before);
 // Every class must be able to kill an enemy using the actual simulation.
 for(const id of ['arcanist','ranger']){await page.evaluate(id=>{const g=window.__emberfall;g.save.classId=id;g.start();g.spawnEnemy('wisp');const e=g.run.enemies.at(-1);e.x=g.run.x+200;e.y=g.run.y;e.hp=1;},id);await page.waitForFunction(()=>window.__emberfall.run.kills>0);await page.evaluate(()=>window.__emberfall.town());}
 await page.setViewportSize({width:1024,height:700});await page.getByRole('button',{name:'Begin expedition'}).waitFor({state:'visible'});const bounds=await page.getByRole('button',{name:'Begin expedition'}).boundingBox();assert.ok(bounds.y+bounds.height<700);await page.screenshot({path:'test-results/camp-small.png'});
 assert.deepEqual(errors,[]);console.log('PASS: movement, dash, spells, potions, pause, auto combat for 3 classes, XP blessings, boss patterns, loot, death, equipment, quests, save reload, compact layout; no browser exceptions.');
}finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
