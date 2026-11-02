const {chromium}=require('playwright-core');
const {spawn}=require('node:child_process');
const {mkdirSync}=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const server=spawn('python3',['-m','http.server','5173','--bind','127.0.0.1'],{stdio:'ignore'});let browser;
 try{
  for(let i=0;i<40;i++){try{if((await fetch('http://127.0.0.1:5173')).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/?test=1');await page.waitForFunction(()=>window.__emberfall);mkdirSync('test-results',{recursive:true});
  await page.getByRole('button',{name:'Moves',exact:true}).click();assert.equal(await page.locator('.move-card').count(),3);await page.screenshot({path:'test-results/moves.png'});
  await page.getByRole('button',{name:'Expeditions',exact:true}).click();await page.getByRole('button',{name:'Begin expedition'}).click();
  await page.evaluate(()=>{const r=window.__emberfall.run;r.invuln=100;r.spawnClock=100;});
  const x=await page.evaluate(()=>window.__emberfall.run.x);await page.keyboard.down('KeyD');await page.waitForTimeout(250);await page.keyboard.up('KeyD');assert.ok(await page.evaluate(x=>window.__emberfall.run.x>x+20,x));
  await page.keyboard.press('KeyQ');assert.equal(await page.evaluate(()=>window.__emberfall.run.moveCd.Q),0);
  await page.evaluate(()=>{const g=window.__emberfall;g.spawnEnemy('wisp');const e=g.run.enemies.at(-1);e.x=g.run.x+70;e.y=g.run.y;e.hp=5;e.speed=0;g.run.boons.orbit=3;});
  await page.waitForTimeout(800);assert.equal(await page.evaluate(()=>window.__emberfall.run.kills),0); // idle + orbit never attack
  await page.mouse.click(500,450);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>window.__emberfall.run.kills),0); // aimed away
  await page.waitForTimeout(700);await page.mouse.click(790,450);await page.waitForFunction(()=>window.__emberfall.run.kills===1);
  const attacks=await page.evaluate(()=>window.__emberfall.save.metrics.manualAttacks);await page.waitForTimeout(700);await page.mouse.down();await page.waitForTimeout(900);await page.mouse.up();assert.equal(await page.evaluate(()=>window.__emberfall.save.metrics.manualAttacks),attacks+1); // holding is not autofire
  await page.evaluate(()=>{const g=window.__emberfall;g.run.enemies=[];g.save.mastery.warden.kills=11;g.spawnEnemy('wisp');const e=g.run.enemies.at(-1);e.x=g.run.x+65;e.y=g.run.y;e.hp=1;e.speed=0;});await page.mouse.click(790,450);await page.waitForFunction(()=>window.__emberfall.save.mastery.warden.kills===12);
  await page.keyboard.press('KeyQ');assert.ok(await page.evaluate(()=>window.__emberfall.run.moveCd.Q>0));assert.equal(await page.evaluate(()=>window.__emberfall.spell('Q')),false);
  await page.keyboard.press('Space');assert.ok(await page.evaluate(()=>window.__emberfall.run.dashCd>0));await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.__emberfall.mode),'pause');await page.getByRole('button',{name:'Resume expedition'}).click();
  // Real hold-to-interact input. Only the hero position is arranged by the test.
  await page.evaluate(()=>{const g=window.__emberfall;g.run.dash=0;const o=g.run.objects.find(o=>o.type==='herb');g.run.x=o.x;g.run.y=o.y;});await page.keyboard.down('KeyX');await page.waitForTimeout(550);await page.keyboard.up('KeyX');assert.equal(await page.evaluate(()=>window.__emberfall.save.metrics.herbs),1);
  // Escort must reach the campfire; speaking to the scout is not completion.
  await page.evaluate(()=>{const r=window.__emberfall.run,o=r.objects.find(o=>o.type==='escort');r.x=o.x;r.y=o.y;});await page.keyboard.down('KeyX');await page.waitForTimeout(1800);await page.keyboard.up('KeyX');assert.equal(await page.evaluate(()=>window.__emberfall.save.metrics.rescued),0);
  await page.evaluate(()=>{const g=window.__emberfall,r=g.run;r.x=0;r.y=0;for(let i=0;i<180;i++)g.updateObjectives(1/60);});assert.equal(await page.evaluate(()=>window.__emberfall.save.metrics.rescued),1);
  const defense=await page.evaluate(()=>{const g=window.__emberfall,r=g.run,o=r.objects.find(o=>o.type==='defense');o.defending=true;r.x=o.x;r.y=o.y;g.updateObjectives(8);r.x+=300;g.updateObjectives(10);const held=o.defenseTime;r.x=o.x;g.updateObjectives(10);return {held,done:g.save.metrics.defended};});assert.equal(defense.held,8);assert.equal(defense.done,1);
  await page.evaluate(()=>{const g=window.__emberfall;g.save.bestWave=5;g.save.region=1;g.start();const o=g.run.objects.find(o=>o.type==='rift');g.run.x=o.x;g.run.y=o.y;g.run.invuln=100;g.run.spawnClock=100;});await page.keyboard.down('KeyX');await page.waitForTimeout(3300);await page.keyboard.up('KeyX');assert.equal(await page.evaluate(()=>window.__emberfall.save.metrics.rifts),1);
  await page.screenshot({path:'test-results/manual-combat.png'});
  // Each unlocked move must produce its class-specific effect, while locked moves consume nothing.
  for(const id of ['warden','arcanist','ranger']){
   const result=await page.evaluate(id=>{const g=window.__emberfall;g.save.classId=id;g.save.mastery[id]={kills:180,bosses:3};g.start();g.run.spawnClock=100;const q=g.spell('Q'),r=g.spell('R'),f=g.spell('F');return {q,r,f,shield:g.run.shield,wind:g.run.windwalk,blink:Math.hypot(g.run.x,g.run.y),whirl:g.run.whirlwind,hazards:g.run.hazards.length,bullets:g.run.bullets.length};},id);
   assert.ok(result.q&&result.r&&result.f);if(id==='warden')assert.ok(result.shield>0&&result.whirl>0);if(id==='arcanist')assert.ok(result.blink>100&&result.hazards>0);if(id==='ranger')assert.ok(result.wind>0&&result.bullets>=9&&result.hazards===3);
  }
  // Aimed ranged attacks also require explicit input.
  for(const id of ['arcanist','ranger']){await page.evaluate(id=>{const g=window.__emberfall;g.save.classId=id;g.start();g.run.spawnClock=100;g.run.invuln=100;g.spawnEnemy('wisp');const e=g.run.enemies.at(-1);e.x=g.run.x+200;e.y=g.run.y;e.hp=1;e.speed=0;},id);await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>window.__emberfall.run.kills),0);await page.mouse.click(920,450);await page.waitForFunction(()=>window.__emberfall.run.kills>0);}
  await page.evaluate(()=>{const g=window.__emberfall;g.save.metrics.manualAttacks=10;g.town();});await page.getByRole('button',{name:'Quests',exact:true}).click();await page.locator('[data-quest="first-strike"]').click();assert.equal(await page.locator('[data-quest="first-strike"]').count(),0);assert.ok(await page.getByText('✓ Steel, not fate').isVisible());await page.screenshot({path:'test-results/journal.png'});
  const before=await page.evaluate(()=>JSON.stringify(window.__emberfall.save));await page.reload();await page.waitForFunction(()=>window.__emberfall);assert.equal(await page.evaluate(()=>JSON.stringify(window.__emberfall.save)),before);
  await page.evaluate(()=>{window.__emberfall.start();});assert.equal(await page.evaluate(()=>window.__emberfall.run.objects.some(o=>o.id==='cinder-rift')),false); // completed world interactions persist
  await page.evaluate(()=>window.__emberfall.town());await page.setViewportSize({width:1024,height:700});await page.getByRole('button',{name:'Begin expedition'}).waitFor();const b=await page.getByRole('button',{name:'Begin expedition'}).boundingBox();assert.ok(b.y+b.height<700);
  assert.deepEqual(errors,[]);console.log('PASS: no idle attacks; aimed click combat; no held autofire; mastery unlock; all 9 moves; cooldowns; keyboard, dash, pause; gathering, escort, defense, rituals; one-time quests; save reload and completed objectives; compact layout.');
 }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
