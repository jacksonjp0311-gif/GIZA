import {chromium} from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
const label=process.argv[2],url=process.argv[3]??'http://127.0.0.1:4193';
if(!label||!/^[a-z0-9-]+$/.test(label))throw new Error('Unique run label required');
const output=`verification/evidence-boundaries/performance-${label}.json`;
if(fs.existsSync(output))throw new Error('Preserve previous performance runs');
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const samples=[];
try{
  for(const optionalDelayMs of [0,0,0,5000]){
    const context=await browser.newContext({viewport:{width:1280,height:800}}),page=await context.newPage();
    const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
    if(optionalDelayMs)await page.route('**/model/maps/manifest.json',async route=>{await new Promise(r=>setTimeout(r,optionalDelayMs));await route.continue().catch(()=>{});});
    await page.goto(url+(url.includes('?')?'&':'?')+'tutorialDiagnostics=1',{waitUntil:'domcontentloaded'});
    await page.locator('canvas').first().waitFor({state:'visible',timeout:30000});
    await page.getByRole('button',{name:'Sarcophagus',exact:true}).waitFor({state:'visible'});
    const measured=await page.evaluate(async()=>{
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const firstUsableMs=performance.now(),intervals=[];let prior=performance.now();
      for(let i=0;i<90;i++){await new Promise(r=>requestAnimationFrame(r));const now=performance.now();intervals.push(now-prior);prior=now;}
      intervals.sort((a,b)=>a-b);
      return {firstUsableMs,rafMedianMs:intervals[45],rafP95Ms:intervals[85],jsHeapBytes:performance.memory?.usedJSHeapSize??null,resourceCount:performance.getEntriesByType('resource').length,userAgent:navigator.userAgent};
    });
    const interaction=page.evaluate(async()=>{const times=[];let prior=performance.now();for(let i=0;i<60;i++){await new Promise(r=>requestAnimationFrame(r));const now=performance.now();times.push(now-prior);prior=now;}times.sort((a,b)=>a-b);return {medianMs:times[30],p95Ms:times[57]};});
    const bounds=await page.locator('canvas').first().boundingBox();
    await page.mouse.move(bounds.x+bounds.width*.5,bounds.y+bounds.height*.5);await page.mouse.down();await page.mouse.move(bounds.x+bounds.width*.62,bounds.y+bounds.height*.54,{steps:24});await page.mouse.up();
    const interactionScheduling=await interaction;
    await page.getByRole('button',{name:'Tutorial / ?',exact:true}).click();await page.getByTestId('tutorial-cutout').waitFor({state:'visible'});
    const tutorialLayout=await page.evaluate(()=>{const entries=performance.getEntriesByName('giza.tutorial.layout').map(e=>e.duration);return {samples:entries.length,maxMs:entries.length?Math.max(...entries):null};});
    await page.keyboard.press('Escape');
    samples.push({optionalDelayMs,...measured,interactionScheduling,tutorialLayout,requestCount:requests.length,modelRequests:requests.filter(u=>u.includes('/model/')).length,errors});await context.close();
  }
  fs.writeFileSync(output,JSON.stringify({label,createdAt:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),node:process.version,platform:process.platform,cpu:os.cpus()[0].model,browser:browser.version(),rendering:'Chromium headless SwiftShader, production preview; fresh contexts; unthrottled localhost',criterion:'Visible model canvas and enabled quick-view UI plus two animation frames. RAF is page scheduling, not GPU frame timing. Heap is Chromium estimate, not total process memory.',samples},null,2),{flag:'wx'});
  console.log(output);console.log(samples.map(s=>({delay:s.optionalDelayMs,usable:s.firstUsableMs,p95:s.rafP95Ms,errors:s.errors})));
}finally{await browser.close();}
