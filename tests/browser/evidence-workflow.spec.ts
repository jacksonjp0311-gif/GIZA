import {test,expect,type Page} from '@playwright/test';
import fs from 'node:fs/promises';
async function openAssembly(page:Page){await page.goto('/');await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await expect(page.locator('[data-evidence-workbench] canvas')).toBeVisible();await expect(page.getByLabel('Evidence feature')).toBeVisible();}
async function measureLid(page:Page){await page.getByLabel('Evidence feature').selectOption('feature.lid.envelope');await page.getByRole('button',{name:'Measure',exact:true}).click();await page.getByLabel('Measurement frame').selectOption('frame.khafre.lid.object');await page.getByRole('button',{name:'Anchor 1',exact:true}).click();await page.getByRole('button',{name:'Anchor 2',exact:true}).click();}
async function exported(page:Page,button='Export investigation'){const event=page.waitForEvent('download');await page.getByRole('button',{name:button,exact:true}).click();const d=await event;return JSON.parse(await fs.readFile((await d.path())!,'utf8'));}
test('actual model entry, isolation fit, invariant measurement, computation, draft detour, export and restore',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await openAssembly(page);await measureLid(page);
  await page.getByRole('button',{name:'Views',exact:true}).click();await page.getByRole('button',{name:'Isolate selected object',exact:true}).click();await page.getByRole('button',{name:'Fit · F',exact:true}).click();await page.getByRole('button',{name:'Save current camera',exact:true}).click();
  await page.getByLabel('Lid inspection separation').fill('3');await page.getByRole('button',{name:'Investigate',exact:true}).click();
  await page.getByLabel('Investigation candidate').selectOption('candidate.coffer.lid-length-fit');await page.getByRole('button',{name:'Run reproducible computation'}).click();await expect(page.getByText('CURRENT — matching dependency fingerprint',{exact:true})).toBeVisible();
  await page.getByLabel('Finding reviewer').fill('Synthetic software QA');await page.getByLabel('Finding review note').fill('Browser test draft; no archaeological conclusion.');
  await page.getByRole('button',{name:'Evidence',exact:true}).click();await page.getByRole('button',{name:'Investigate',exact:true}).click();await expect(page.getByLabel('Finding review note')).toHaveValue('Browser test draft; no archaeological conclusion.');
  await page.getByRole('button',{name:'Save investigation',exact:true}).click();await expect(page.getByText('Saved with original geometry, canonical points and reproducible result.',{exact:true})).toBeVisible();
  const study=await exported(page,'Export saved record');expect(study.payload.presentation.explode).toBe(3);expect(study.payload.result.status).toBe('KNOWN');expect(study.payload.receipts).toHaveLength(1);expect(study.payload.presentation.bookmarks).toHaveLength(1);
  const bodyTransform=study.payload.assemblySnapshot.transforms.find((t:{id:string})=>t.id==='transform.coffer.assembly');
  expect(study.payload.presentation.bookmarks[0].target[0]).toBeCloseTo(bodyTransform.matrix[3]+1.7+.6*.6,5); // Fit the visible parked lid, never the invisible coffer.
  const lid=study.payload.assemblySnapshot.features.find((f:{id:string})=>f.id==='feature.lid.envelope');expect(study.payload.result.value).toBeCloseTo(lid.geometry.max[0]-lid.geometry.min[0],10);expect(study.payload.presentation.camera).not.toBeNull();
  // Synthetic in-browser revision only: never written into archaeological datasets.
  await page.route('**/model/research/measurements.json',async route=>{const response=await route.fetch(),doc=await response.json(),row=doc.measurements.find((r:{id:string})=>r.id==='m.coffer.lid_length');row.native_value+=.1;row.si_value=row.native_value*.0254;await route.fulfill({json:doc});});
  await page.reload();await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await page.getByRole('button',{name:'Investigate',exact:true}).click();await page.getByLabel('Investigation candidate').selectOption('candidate.coffer.lid-length-fit');await expect(page.getByText(/HISTORICAL ·/).first()).toBeVisible();await expect(page.getByLabel('Finding reviewer')).toHaveCount(0);
  await page.getByRole('button',{name:'Open saved snapshot',exact:true}).click();await expect(page.getByText('ARCHIVED INPUTS — ORIGINAL SNAPSHOT',{exact:true})).toBeVisible();
  const reopened=await exported(page,'Export saved record');expect(reopened).toEqual(study);
  await page.getByLabel('Import saved investigation').setInputFiles({name:'synthetic-browser-study.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(study))});await expect(page.getByText(/Imported and replay-verified/)).toBeVisible();await expect(page.getByRole('button',{name:'Open saved snapshot',exact:true})).toHaveCount(1);
  await page.getByRole('button',{name:'← Workstation',exact:true}).click();await expect(page.locator('[data-evidence-workbench]')).toHaveCount(0);expect(errors).toEqual([]);
});
test('actual pointer cut picking saves computed surfaces in canonical coordinates',async({page})=>{
  await openAssembly(page);await page.getByRole('button',{name:'Views',exact:true}).click();await page.getByRole('button',{name:'Isolate selected object',exact:true}).click();await page.getByRole('button',{name:'Top',exact:true}).click();
  await page.getByRole('button',{name:'Section',exact:true}).click();await page.getByRole('button',{name:'OBLIQUE',exact:true}).click();await page.getByLabel('Section inclination').fill('-90');await page.getByLabel('Section offset exact').fill('0.3');await page.getByRole('button',{name:'Measure',exact:true}).click();
  const canvas=page.locator('[data-evidence-workbench] canvas'),box=(await canvas.boundingBox())!;let found=false;
  // Search visible cut, not a synthetic picking API. Top view faces the retained
  // lower half-space. Cavity remains empty; only real analytic cap meshes hit.
  outer:for(const y of [.35,.4,.45,.5,.55,.6,.65])for(const x of [.42,.43,.57,.58,.4,.45,.5,.55,.6]){
    await page.getByRole('button',{name:'Clear measurement',exact:true}).click();await page.mouse.click(box.x+box.width*x,box.y+box.height*y);
    if(await page.getByText(/Computed section surface/).count()){await page.mouse.click(box.x+box.width*x+2,box.y+box.height*y);if(await page.getByText(/2 picked points retain/).count()){found=true;break outer;}}
  }
  expect(found,'Actual browser ray must reach an analytic section cap').toBe(true);await page.getByRole('button',{name:'Investigate',exact:true}).click();const study=await exported(page);
  expect(study.payload.draft.points).toHaveLength(2);for(const point of study.payload.draft.points){expect(point.origin.kind).toBe('COMPUTED_SECTION');expect(point.position[2]).toBeCloseTo(-.3,5);}expect(study.payload.result.status).toBe('KNOWN');
});
for(const size of [{width:1280,height:800},{width:390,height:844},{width:844,height:390}])test(`model-first layout and keyboard ${size.width}x${size.height}`,async({page})=>{
  await page.setViewportSize(size);await openAssembly(page);const box=await page.locator('[data-evidence-workbench] canvas').boundingBox();expect(box!.height).toBeGreaterThan(150);expect(box!.width).toBeGreaterThan(200);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.locator('[data-evidence-workbench]').click({position:{x:5,y:5}});await page.keyboard.press('m');await expect(page.getByLabel('Measurement frame')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByLabel('Measurement frame')).not.toBeVisible();
});
for(const failure of ['slow','missing','malformed'])test(`optional atlas ${failure} does not block core or force workspace navigation`,async({page})=>{
  let finish:()=>void=()=>{};const gate=new Promise<void>(r=>{finish=r;});
  await page.route('**/model/maps/manifest.json',async route=>{if(failure==='slow'){await gate;await route.continue().catch(()=>{});}else await route.fulfill({status:failure==='missing'?404:200,contentType:'application/json',body:failure==='missing'?'{}':'{"layers":false}'});});
  await page.goto('/');await expect(page.locator('canvas').first()).toBeVisible({timeout:5000});await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await expect(page.locator('[data-evidence-workbench]')).toBeVisible();finish();await expect(page.getByLabel('Evidence feature')).toBeVisible();
});
