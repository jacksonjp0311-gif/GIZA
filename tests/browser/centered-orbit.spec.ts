import {test,expect} from '@playwright/test';
test('off-center wheel zoom and real drag preserve the overview orbit pivot',async({page},testInfo)=>{
  await page.goto('/?layerDiagnostics=1');
  const canvas=page.locator('canvas').first();
  const state=async()=>JSON.parse(await canvas.getAttribute('data-layer-diagnostics')??'{}');
  await expect.poll(async()=>(await state()).orbitTarget?.length).toBe(3);
  let last='',stable=0;const samples:unknown[]=[];
  try{
    await expect.poll(async()=>{const s=await state(),key=JSON.stringify([s.orbitTarget,s.cameraPosition]);samples.push({at:Date.now(),target:s.orbitTarget,position:s.cameraPosition});if(samples.length>30)samples.shift();stable=key===last?stable+1:0;last=key;return stable;}).toBeGreaterThanOrEqual(3);
  }catch(error){await testInfo.attach('orbit-settling.json',{body:JSON.stringify(samples),contentType:'application/json'});throw error;}
  const before=await state(),box=(await canvas.boundingBox())!;
  expect(before.orbitTarget[0]).toBe(0);expect(before.orbitTarget[1]).toBe(0);
  await page.mouse.move(box.x+box.width*.75,box.y+box.height*.55);
  await page.mouse.wheel(0,-220);
  await expect.poll(async()=>Math.hypot(...(await state()).cameraPosition.map((n:number,i:number)=>n-before.cameraPosition[i]))).toBeGreaterThan(1);
  expect((await state()).orbitTarget).toEqual(before.orbitTarget);
  await page.mouse.down();await page.mouse.move(box.x+box.width*.60,box.y+box.height*.58,{steps:12});await page.mouse.up();
  expect((await state()).orbitTarget).toEqual(before.orbitTarget);
  await page.getByRole('button',{name:'Full Pyramid',exact:true}).click();
  await page.getByRole('checkbox',{name:'Show Dimensions',exact:true}).check();
  await page.getByRole('button',{name:'Inspect / layers',exact:true}).hover();
  await expect(page.locator('.viewportDrawer.inspection .dimensionReadout')).toBeVisible();
  await page.mouse.move(box.x+box.width*.6,box.y+box.height*.6);
  await expect(page.getByText('Selected preview dimensions',{exact:true})).toBeHidden();
});
test('Inscription Lab distinguishes original context from reproduction imagery',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Hieroglyphs · Inscription Lab',exact:true}).click();
  const source=page.getByRole('button',{name:'Inspect Dream Stela · museum reproduction detail',exact:true});
  await expect(source).toBeVisible();await source.click();
  await expect(page.locator('.epiCredit')).toContainText('NOT direct evidence');
  await expect.poll(()=>page.locator('.epiImageScroll img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth===2048)).toBe(true);
});
