# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: evidence-workflow.spec.ts >> actual pointer cut picking saves computed surfaces in canonical coordinates
- Location: tests\browser\evidence-workflow.spec.ts:28:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/1 picked points retain/)
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText(/1 picked points retain/) with timeout 15000ms
  - waiting for getByText(/1 picked points retain/)

```

```yaml
- banner:
  - img "GIZA NEXUS pyramid logo"
  - text: GIZA
  - emphasis: NEXUS
  - text: · v0.11.1
  - heading "KHAFRE / EVIDENCE ASSEMBLY" [level=1]
  - text: GIZA, EGYPT · 29.976000° N · 31.130969° E · c. 2570 BCE
  - navigation "Viewport surface":
    - button "3D MODEL" [pressed]
    - button "MAP ATLAS"
    - button "REGISTRATION"
  - text: 24 reconstructions 1 assumed 31 unverified
- main:
  - button "← Workstation"
  - text: EVIDENCE ASSEMBLY / 01
  - heading "Sarcophagus · lid · burial chamber" [level=2]
  - navigation "Spatial interrogation tools":
    - button "Evidence" [pressed]
    - button "Measure"
    - button "Section"
    - button "Compare"
    - button "Investigate"
    - button "Views"
  - region "Evidence Assembly 3-D viewport":
    - button "Show burial chamber"
    - button "Fit · F"
    - button "Top"
    - group: Explode / restore
    - checkbox "OBSERVED reality layer" [checked]
    - text: OBSERVED
    - checkbox "RECONSTRUCTED reality layer" [checked]
    - text: RECONSTRUCTED
    - checkbox "HYPOTHESIS reality layer"
    - text: HYPOTHESIS West wall / rim · -0.40117, 0.43645, -0.30000 m m · X east / Y north / Z up · Drag rotate · wheel zoom · right-drag pan
  - complementary "Feature evidence":
    - heading "Feature evidence" [level=3]
    - button "Close contextual panel": ×
    - text: Feature / source dimension
    - combobox "Evidence feature":
      - option "West wall / rim" [selected]
      - option "East wall / rim"
      - option "North end / rim"
      - option "South end / rim"
      - option "Cavity floor / base"
      - option "Lid mean-thickness envelope"
      - option "West chamber boundary"
      - option "East chamber boundary"
      - option "North chamber boundary"
      - option "South chamber boundary"
      - option "Reconstructed floor datum"
      - option "North doorway plan interval"
      - option "South gable boundary"
      - option "North gable boundary"
      - option "Outer length"
      - option "Mean outer width"
      - option "Outer height"
      - option "Cavity length"
      - option "Cavity width"
      - option "Cavity depth"
      - option "Lid west length"
      - option "Lid south width"
      - option "burial · width e"
      - option "burial · width w"
      - option "burial · length n"
      - option "burial · length s"
      - option "burial · wall height"
      - option "burial · gable rise · vyse"
      - option "burial · door from e · start"
      - option "burial · door from e · end"
      - option "coffer · side thickness"
      - option "coffer · lid thickness min"
      - option "coffer · lid thickness max"
      - option "burial · paving · thickness min"
      - option "burial · paving · thickness max"
      - option "coffer · bottom · saw overcut"
      - option "coffer · pin n · from n inner"
      - option "coffer · pin n · from w outer"
      - option "coffer · pin s · from s inner"
      - option "coffer · pin s · from w outer"
      - option "coffer · ledge n · width min"
      - option "coffer · ledge n · width max"
      - option "coffer · ledge s · width min"
      - option "coffer · ledge s · width max"
      - option "coffer · west clearance"
      - option "coffer · north clearance"
      - option "coffer · pin diameter"
      - option "North locking-pin marker"
      - option "South locking-pin marker"
    - text: RECONSTRUCTED
    - heading "West wall / rim" [level=3]
    - paragraph: Idealized planar reconstruction from reported dimensions; centred rectangular cavity is not a mapped survey surface.
    - img "Uncertainty unknown; no numeric error envelope is available": UNKNOWN No numeric error envelope can be drawn.
    - term: Frame
    - definition: frame.khafre.coffer.object
    - term: Local anchor
    - definition: "-0.43596, 0.00000, -0.37567 m"
    - term: Assembly XYZ
    - definition: "-5.89296, 0.09106, -0.37567 m"
    - term: Position class
    - definition: RECONSTRUCTED · feature centre / reference anchor, not survey XYZ
    - term: Registration
    - definition: UNKNOWN · no accepted feature fit
    - term: World XYZ
    - definition: UNKNOWN · unresolved datum/control
    - paragraph: Actual surface irregularities, chips and local face positions UNKNOWN.
    - paragraph: Complete propagated uncertainty UNKNOWN.
    - heading "Exact observation bindings" [level=4]
    - article:
      - code: m.coffer.outer_length
      - paragraph: 2.633472 m
      - text: OBSERVED · ch. IX §77, pp.107-108
      - paragraph:
        - link "The Pyramids and Temples of Gizeh":
          - /url: https://petrieproject.com/book/the-pyramids-and-temples-of-gizeh
      - text: "Native: 103.68 in · uncertainty 0.000508 m"
      - paragraph: Source-reported record; no surveyed endpoints or authenticated review implied.
    - article:
      - code: m.coffer.outer_width
      - paragraph: 1.065911 m
      - text: OBSERVED · ch. IX §77, pp.107-108
      - paragraph:
        - link "The Pyramids and Temples of Gizeh":
          - /url: https://petrieproject.com/book/the-pyramids-and-temples-of-gizeh
      - text: "Native: 41.965 in · uncertainty UNKNOWN"
      - paragraph: Source-reported record; no surveyed endpoints or authenticated review implied.
    - article:
      - code: m.coffer.inner_width
      - paragraph: 0.677926 m
      - text: OBSERVED · ch. IX §77, pp.107-108
      - paragraph:
        - link "The Pyramids and Temples of Gizeh":
          - /url: https://petrieproject.com/book/the-pyramids-and-temples-of-gizeh
      - text: "Native: 26.69 in · uncertainty UNKNOWN"
      - paragraph: Source-reported record; no surveyed endpoints or authenticated review implied.
    - article:
      - code: m.coffer.inner_depth
      - paragraph: 0.751332 m
      - text: OBSERVED · ch. IX §77, pp.107-108
      - paragraph:
        - link "The Pyramids and Temples of Gizeh":
          - /url: https://petrieproject.com/book/the-pyramids-and-temples-of-gizeh
      - text: "Native: 29.58 in · uncertainty UNKNOWN"
      - paragraph: Source-reported record; no surveyed endpoints or authenticated review implied.
    - text: Relationship purpose
    - combobox "Evidence relationship purpose":
      - option "Direct observation support" [selected]
      - option "Derived dependencies"
      - option "Placement / transforms"
      - option "Related context — not support"
    - group: Evidence graph · 13 nodes · DIRECT_SUPPORT
    - group: Documentary references · 6
  - strong: RECONSTRUCTION ≠ OBSERVATION
  - text: Source-reported dimensions · idealized surfaces · lid placement, survey uncertainty and site transform UNKNOWN. No new metric registration or archaeological finding is asserted.
- contentinfo: "DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP △ GIZA // NEXUS · v0.11.1 · KHAFRE · 56 KEY STRUCTURES ● STATUS: READY"
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | import fs from 'node:fs/promises';
  3  | async function openAssembly(page:Page){await page.goto('/?spatialDiagnostics=1');await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await expect(page.locator('[data-evidence-workbench] canvas')).toBeVisible();await expect(page.getByLabel('Evidence feature')).toBeVisible();}
  4  | async function measureLid(page:Page){await page.getByLabel('Evidence feature').selectOption('feature.lid.envelope');await page.getByRole('button',{name:'Measure',exact:true}).click();await page.getByLabel('Measurement frame').selectOption('frame.khafre.lid.object');await page.getByRole('button',{name:'Anchor 1',exact:true}).click();await page.getByRole('button',{name:'Anchor 2',exact:true}).click();}
  5  | async function exported(page:Page,button='Export investigation'){const event=page.waitForEvent('download');await page.getByRole('button',{name:button,exact:true}).click();const d=await event;return JSON.parse(await fs.readFile((await d.path())!,'utf8'));}
  6  | test('actual model entry, isolation fit, invariant measurement, computation, draft detour, export and restore',async({page})=>{
  7  |   const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await openAssembly(page);await measureLid(page);
  8  |   await page.getByRole('button',{name:'Views',exact:true}).click();await page.getByRole('button',{name:'Isolate selected object',exact:true}).click();await page.getByRole('button',{name:'Fit · F',exact:true}).click();await page.getByRole('button',{name:'Save current camera',exact:true}).click();
  9  |   await page.getByLabel('Lid inspection separation').fill('3');await page.getByRole('button',{name:'Investigate',exact:true}).click();
  10 |   await page.getByLabel('Investigation candidate').selectOption('candidate.coffer.lid-length-fit');await page.getByRole('button',{name:'Run reproducible computation'}).click();await expect(page.getByText('CURRENT — matching dependency fingerprint',{exact:true})).toBeVisible();
  11 |   await page.getByLabel('Finding reviewer').fill('Synthetic software QA');await page.getByLabel('Finding review note').fill('Browser test draft; no archaeological conclusion.');
  12 |   await page.getByRole('button',{name:'Evidence',exact:true}).click();await page.getByRole('button',{name:'Investigate',exact:true}).click();await expect(page.getByLabel('Finding review note')).toHaveValue('Browser test draft; no archaeological conclusion.');
  13 |   await page.getByRole('button',{name:'Save investigation',exact:true}).click();await expect(page.getByText('Saved with original geometry, canonical points and reproducible result.',{exact:true})).toBeVisible();
  14 |   const study=await exported(page,'Export saved record');expect(study.payload.presentation.explode).toBe(3);expect(study.payload.result.status).toBe('KNOWN');expect(study.payload.receipts).toHaveLength(1);expect(study.payload.presentation.bookmarks).toHaveLength(1);
  15 |   const bodyTransform=study.payload.assemblySnapshot.transforms.find((t:{id:string})=>t.id==='transform.coffer.assembly');
  16 |   expect(study.payload.presentation.bookmarks[0].target[0]).toBeCloseTo(bodyTransform.matrix[3]+1.7+.6*.6,5); // Fit the visible parked lid, never the invisible coffer.
  17 |   const lid=study.payload.assemblySnapshot.features.find((f:{id:string})=>f.id==='feature.lid.envelope');expect(study.payload.result.value).toBeCloseTo(lid.geometry.max[0]-lid.geometry.min[0],10);expect(study.payload.presentation.camera).not.toBeNull();
  18 |   // Synthetic in-browser revision only: never written into archaeological datasets.
  19 |   await page.route('**/model/research/measurements.json',async route=>{const response=await route.fetch(),doc=await response.json(),row=doc.measurements.find((r:{id:string})=>r.id==='m.coffer.lid_length');row.native_value+=.1;row.si_value=row.native_value*.0254;await route.fulfill({json:doc});});
  20 |   await page.reload();await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await page.getByRole('button',{name:'Investigate',exact:true}).click();await page.getByLabel('Investigation candidate').selectOption('candidate.coffer.lid-length-fit');await expect(page.getByText(/HISTORICAL ·/).first()).toBeVisible();await expect(page.getByLabel('Finding reviewer')).toHaveCount(0);
  21 |   await page.getByRole('button',{name:'Explain / compare inputs',exact:true}).first().click();await expect(page.getByText('inputs.nodes.m.coffer.lid_length.data.value',{exact:true})).toBeVisible();
  22 |   await page.getByRole('button',{name:'Run new linked result',exact:true}).first().click();await expect(page.getByText('CURRENT — matching dependency fingerprint',{exact:true})).toBeVisible();
  23 |   await page.getByRole('button',{name:'Open saved snapshot',exact:true}).click();await expect(page.getByText('ARCHIVED INPUTS — ORIGINAL SNAPSHOT',{exact:true})).toBeVisible();
  24 |   const reopened=await exported(page,'Export saved record');expect(reopened).toEqual(study);
  25 |   await page.getByLabel('Import saved investigation').setInputFiles({name:'synthetic-browser-study.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(study))});await expect(page.getByText(/Imported and replay-verified/)).toBeVisible();await expect(page.getByRole('button',{name:'Open saved snapshot',exact:true})).toHaveCount(1);
  26 |   await page.getByRole('button',{name:'← Workstation',exact:true}).click();await expect(page.locator('[data-evidence-workbench]')).toHaveCount(0);expect(errors).toEqual([]);
  27 | });
  28 | test('actual pointer cut picking saves computed surfaces in canonical coordinates',async({page})=>{
  29 |   await openAssembly(page);await page.getByRole('button',{name:'Views',exact:true}).click();await page.getByRole('button',{name:'Isolate selected object',exact:true}).click();await page.getByRole('button',{name:'Top',exact:true}).click();
  30 |   await page.getByRole('button',{name:'Section',exact:true}).click();await page.getByRole('button',{name:'OBLIQUE',exact:true}).click();await page.getByLabel('Section inclination').fill('-90');await page.getByLabel('Section offset exact').fill('0.3');await page.getByRole('button',{name:'Measure',exact:true}).click();
  31 |   const canvas=page.locator('[data-evidence-workbench] canvas');
  32 |   await expect.poll(async()=>{const d=JSON.parse(await canvas.getAttribute('data-spatial-diagnostics')??'{}');return !!d.settled&&d.caps.filter((c:any)=>c.inViewport&&Math.abs(c.section.offset-.3)<1e-8).length>=2;}).toBe(true);
  33 |   const diagnostic=JSON.parse((await canvas.getAttribute('data-spatial-diagnostics'))!);const targets=diagnostic.caps.filter((c:any)=>c.inViewport).slice(0,2);
> 34 |   for(let i=0;i<2;i++){await page.mouse.click(targets[i].screen[0],targets[i].screen[1]);await expect(page.getByText(new RegExp(`${i+1} picked points retain`))).toBeVisible();}
     |                                                                                                                                                                  ^ Error: expect(locator).toBeVisible() failed
  35 |   await expect(page.getByText(/Computed section surface/).first()).toBeVisible();await page.getByRole('button',{name:'Investigate',exact:true}).click();await page.getByRole('button',{name:'Save investigation',exact:true}).click();await expect(page.getByText('Saved with original geometry, canonical points and reproducible result.',{exact:true})).toBeVisible();const study=await exported(page,'Export saved record');
  36 |   expect(study.payload.draft.points).toHaveLength(2);for(const point of study.payload.draft.points){expect(point.origin.kind).toBe('COMPUTED_SECTION');expect(point.position[2]).toBeCloseTo(-.3,5);}expect(study.payload.result.status).toBe('KNOWN');
  37 |   expect(study.payload.draft.points.map((p:any)=>p.featureId)).toEqual(targets.map((t:any)=>t.featureId));expect(study.payload.draft.points.map((p:any)=>p.frameId)).toEqual(targets.map((t:any)=>t.frameId));
  38 |   await page.reload();await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await page.getByRole('button',{name:'Investigate',exact:true}).click();await page.getByRole('button',{name:'Open saved snapshot',exact:true}).click();expect(await exported(page,'Export saved record')).toEqual(study);
  39 | });
  40 | test('authority-hidden geometry is absent from actual Fit-visible camera bounds',async({page})=>{
  41 |   await openAssembly(page);await measureLid(page);await page.getByRole('button',{name:'Views',exact:true}).click();await page.getByRole('button',{name:'Isolate selected object',exact:true}).click();await page.getByRole('button',{name:'Fit · F',exact:true}).click();await page.getByRole('button',{name:'Save current camera',exact:true}).click();
  42 |   await page.getByLabel('RECONSTRUCTED reality layer',{exact:true}).uncheck();await page.getByRole('button',{name:'Fit · F',exact:true}).click();await page.getByRole('button',{name:'Save current camera',exact:true}).click();await page.getByRole('button',{name:'Evidence',exact:true}).click();await expect(page.getByText(/This authority layer is hidden/)).toBeVisible();
  43 |   await page.getByRole('button',{name:'Investigate',exact:true}).click();const study=await exported(page),views=study.payload.presentation.bookmarks,body=study.payload.assemblySnapshot.transforms.find((t:{id:string})=>t.id==='transform.coffer.assembly');
  44 |   expect(views[0].target[0]).not.toBeCloseTo(views[1].target[0],5);expect(views[1].target[0]).toBeCloseTo(body.matrix[3],5);expect(study.payload.result.status).toBe('KNOWN');expect(study.payload.presentation.layers.RECONSTRUCTED).toBe(false);
  45 | });
  46 | for(const size of [{width:1280,height:800},{width:390,height:844},{width:844,height:390}])test(`model-first layout and keyboard ${size.width}x${size.height}`,async({page})=>{
  47 |   await page.setViewportSize(size);await openAssembly(page);const box=await page.locator('[data-evidence-workbench] canvas').boundingBox();expect(box!.height).toBeGreaterThan(150);expect(box!.width).toBeGreaterThan(200);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  48 |   await page.locator('[data-evidence-workbench]').click({position:{x:5,y:5}});await page.keyboard.press('m');await expect(page.getByLabel('Measurement frame')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByLabel('Measurement frame')).not.toBeVisible();
  49 | });
  50 | for(const failure of ['slow','missing','malformed'])test(`optional atlas ${failure} does not block core or force workspace navigation`,async({page})=>{
  51 |   let finish:()=>void=()=>{};const gate=new Promise<void>(r=>{finish=r;});
  52 |   await page.route('**/model/maps/manifest.json',async route=>{if(failure==='slow'){await gate;await route.continue().catch(()=>{});}else await route.fulfill({status:failure==='missing'?404:200,contentType:'application/json',body:failure==='missing'?'{}':'{"layers":false}'});});
  53 |   await page.goto('/');await expect(page.locator('canvas').first()).toBeVisible({timeout:5000});await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await expect(page.locator('[data-evidence-workbench]')).toBeVisible();finish();await expect(page.getByLabel('Evidence feature')).toBeVisible();
  54 | });
  55 | 
```