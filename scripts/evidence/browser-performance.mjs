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
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.locator('canvas').first().waitFor({state:'visible',timeout:30000});
    await page.getByRole('button',{name:'Sarcophagus',exact:true}).waitFor({state:'visible'});
    const measured=await page.evaluate(async()=>{
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const firstUsableMs=performance.now(),intervals=[];let prior=performance.now();
      for(let i=0;i<90;i++){await new Promise(r=>requestAnimationFrame(r));const now=performance.now();intervals.push(now-prior);prior=now;}
      intervals.sort((a,b)=>a-b);
      return {firstUsableMs,rafMedianMs:intervals[45],rafP95Ms:intervals[85],jsHeapBytes:performance.memory?.usedJSHeapSize??null,resourceCount:performance.getEntriesByType('resource').length,userAgent:navigator.userAgent};
    });
    samples.push({optionalDelayMs,...measured,requestCount:requests.length,modelRequests:requests.filter(u=>u.includes('/model/')).length,errors});await context.close();
  }
  fs.writeFileSync(output,JSON.stringify({label,createdAt:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),node:process.version,platform:process.platform,cpu:os.cpus()[0].model,browser:browser.version(),rendering:'Chromium headless SwiftShader, production preview; fresh contexts; unthrottled localhost',criterion:'Visible model canvas and enabled quick-view UI plus two animation frames. RAF is page scheduling, not GPU frame timing. Heap is Chromium estimate, not total process memory.',samples},null,2),{flag:'wx'});
  console.log(output);console.log(samples.map(s=>({delay:s.optionalDelayMs,usable:s.firstUsableMs,p95:s.rafP95Ms,errors:s.errors})));
}finally{await browser.close();}
