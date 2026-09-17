# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: evidence-workflow.spec.ts >> actual pointer cut picking saves computed surfaces in canonical coordinates
- Location: tests\browser\evidence-workflow.spec.ts:23:1

# Error details

```
Error: Actual browser ray must reach an analytic section cap

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic "GIZA NEXUS" [ref=e6]:
        - img "GIZA NEXUS pyramid logo" [ref=e8]
      - generic "CINEMATIC SPATIAL REVERSE-ENGINEERING WORKSTATION" [ref=e9]:
        - generic [ref=e10]:
          - text: GIZA
          - emphasis [ref=e11]: NEXUS
          - text: · v0.10.12
        - heading "KHAFRE / EVIDENCE ASSEMBLY" [level=1] [ref=e12]
        - generic [ref=e13]: GIZA, EGYPT · 29.976000° N · 31.130969° E · c. 2570 BCE
    - navigation "Viewport surface" [ref=e14]:
      - button "3D MODEL" [pressed] [ref=e15] [cursor=pointer]
      - button "MAP ATLAS" [ref=e16] [cursor=pointer]
      - button "REGISTRATION" [ref=e17] [cursor=pointer]
    - generic "Model evidence summary" [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]: "24"
        - text: reconstructions
      - generic [ref=e21]:
        - generic [ref=e22]: "1"
        - text: assumed
      - generic [ref=e23]:
        - generic [ref=e24]: "31"
        - text: unverified
  - main [ref=e25]:
    - generic [ref=e26]:
      - generic [ref=e27]:
        - button "← Workstation" [ref=e28] [cursor=pointer]
        - generic [ref=e29]:
          - text: EVIDENCE ASSEMBLY / 01
          - heading "Sarcophagus · lid · burial chamber" [level=2] [ref=e30]
        - navigation "Spatial interrogation tools" [ref=e31]:
          - button "Evidence" [ref=e32] [cursor=pointer]
          - button "Measure" [pressed] [ref=e33] [cursor=pointer]
          - button "Section" [ref=e34] [cursor=pointer]
          - button "Compare" [ref=e35] [cursor=pointer]
          - button "Investigate" [ref=e36] [cursor=pointer]
          - button "Views" [ref=e37] [cursor=pointer]
      - generic [ref=e38]:
        - region "Evidence Assembly 3-D viewport" [ref=e39]:
          - generic [ref=e40]:
            - button "Show burial chamber" [ref=e41] [cursor=pointer]
            - button "Fit · F" [ref=e42] [cursor=pointer]
            - button "Top" [ref=e43] [cursor=pointer]
            - generic "Reality layers" [ref=e44]:
              - generic [ref=e45]:
                - checkbox "OBSERVED reality layer" [checked] [ref=e46]
                - text: OBSERVED
              - generic [ref=e48]:
                - checkbox "RECONSTRUCTED reality layer" [checked] [ref=e49]
                - text: RECONSTRUCTED
              - generic [ref=e51]:
                - checkbox "HYPOTHESIS reality layer" [ref=e52]
                - text: HYPOTHESIS
          - generic [ref=e58]:
            - generic [ref=e59]: Cavity floor / base · 0.31008, -0.50668, -0.75133 m
            - generic [ref=e60]: m · X east / Y north / Z up · Click to measure
        - complementary "Spatial measurement" [ref=e61]:
          - generic [ref=e62]:
            - heading "Spatial measurement" [level=3] [ref=e63]
            - button "Close contextual panel" [ref=e64] [cursor=pointer]: ×
          - generic [ref=e65]:
            - text: Feature for precise anchors
            - combobox "Measurement feature" [ref=e66]:
              - option "West wall / rim"
              - option "East wall / rim"
              - option "North end / rim"
              - option "South end / rim"
              - option "Cavity floor / base" [selected]
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
              - option "North locking-pin marker"
              - option "South locking-pin marker"
          - generic [ref=e67]:
            - button "Point distance" [pressed] [ref=e68] [cursor=pointer]
            - button "Angle · A–B–C" [ref=e69] [cursor=pointer]
          - paragraph [ref=e70]: Click two locations in 3-D or choose exact feature anchors below. B is the angle vertex. Measurements ignore inspection motion.
          - generic [ref=e71]:
            - text: Authoritative output frame
            - combobox "Measurement frame" [ref=e72]:
              - option "Coffer object-local" [selected]
              - option "Lid object-local"
              - option "Burial assembly reconstruction"
              - option "Preserved monument overview"
              - option "Site / world context"
          - generic [ref=e73]:
            - checkbox "Snap picks to nearest feature anchor" [checked] [ref=e74]
            - text: Snap picks to nearest feature anchor
          - generic [ref=e75]:
            - generic [ref=e76]: DISTANCE · 0/2 POINTS
            - strong [ref=e77]: Select points
          - button "Clear measurement" [ref=e78] [cursor=pointer]
          - generic [ref=e79]:
            - heading "Exact anchors · Cavity floor / base" [level=4] [ref=e80]
            - paragraph [ref=e81]: These are reconstructed corners/endpoints, not observed survey targets.
            - generic [ref=e82]:
              - button "Anchor 1" [ref=e83] [cursor=pointer]
              - button "Anchor 2" [ref=e84] [cursor=pointer]
              - button "Anchor 3" [ref=e85] [cursor=pointer]
              - button "Anchor 4" [ref=e86] [cursor=pointer]
              - button "Anchor 5" [ref=e87] [cursor=pointer]
              - button "Anchor 6" [ref=e88] [cursor=pointer]
              - button "Anchor 7" [ref=e89] [cursor=pointer]
              - button "Anchor 8" [ref=e90] [cursor=pointer]
          - generic [ref=e91]:
            - heading "Assembly clearances / constraints" [level=4] [ref=e92]
            - article [ref=e93]:
              - generic [ref=e94]: CONTAINMENT · SATISFIED
              - paragraph [ref=e95]: UNKNOWN / not numeric
              - text: Necessary envelope containment only; no claim about surface-level fit.
            - article [ref=e96]:
              - generic [ref=e97]: CLEARANCE · UNKNOWN
              - paragraph [ref=e98]: UNKNOWN / not numeric
              - text: Plan overhang is not closure clearance. Groove/contact profiles and actual lid pose are UNKNOWN.
            - article [ref=e99]:
              - generic [ref=e100]: CONNECTION · UNKNOWN
              - paragraph [ref=e101]: UNKNOWN / not numeric
              - text: Known north doorway references the existing upper route. Navigable metric connection requires validated endpoint orientation, elevation and opening geometry; no new space is created.
            - article [ref=e102]:
              - generic [ref=e103]: CLEARANCE · SATISFIED
              - paragraph [ref=e104]: 1.0922 m
              - text: Source-derived mean in reconstructed assembly; later movement noted. Not a present-day measured clearance.
            - article [ref=e105]:
              - generic [ref=e106]: CLEARANCE · SATISFIED
              - paragraph [ref=e107]: 1.0795 m
              - text: Source-reported clearance used as reconstruction constraint; full uncertainty UNKNOWN.
      - generic [ref=e108]:
        - strong [ref=e109]: RECONSTRUCTION ≠ OBSERVATION
        - generic [ref=e110]: Source-reported dimensions · idealized surfaces · lid placement, survey uncertainty and site transform UNKNOWN. No new metric registration or archaeological finding is asserted.
  - contentinfo [ref=e111]:
    - generic [ref=e112]: "DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP"
    - generic [ref=e113]: △ GIZA // NEXUS · v0.10.12 · KHAFRE · 56 KEY STRUCTURES
    - generic [ref=e114]: "● STATUS: READY"
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | import fs from 'node:fs/promises';
  3  | async function openAssembly(page:Page){await page.goto('/');await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await expect(page.locator('[data-evidence-workbench] canvas')).toBeVisible();await expect(page.getByLabel('Evidence feature')).toBeVisible();}
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
  15 |   // Synthetic in-browser revision only: never written into archaeological datasets.
  16 |   await page.route('**/model/research/measurements.json',async route=>{const response=await route.fetch(),doc=await response.json(),row=doc.measurements.find((r:{id:string})=>r.id==='m.coffer.lid_length');row.native_value+=.1;row.si_value=row.native_value*.0254;await route.fulfill({json:doc});});
  17 |   await page.reload();await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await page.getByRole('button',{name:'Investigate',exact:true}).click();await page.getByLabel('Investigation candidate').selectOption('candidate.coffer.lid-length-fit');await expect(page.getByText(/HISTORICAL ·/).first()).toBeVisible();await expect(page.getByLabel('Finding reviewer')).toHaveCount(0);
  18 |   await page.getByRole('button',{name:'Open saved snapshot',exact:true}).click();await expect(page.getByText('ARCHIVED INPUTS',{exact:false})).toBeVisible();
  19 |   const reopened=await exported(page,'Export saved record');expect(reopened).toEqual(study);
  20 |   await page.getByLabel('Import saved investigation').setInputFiles({name:'synthetic-browser-study.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(study))});await expect(page.getByText(/Imported and replay-verified/)).toBeVisible();await expect(page.getByRole('button',{name:'Open saved snapshot',exact:true})).toHaveCount(1);
  21 |   await page.getByRole('button',{name:'← Workstation',exact:true}).click();await expect(page.locator('[data-evidence-workbench]')).toHaveCount(0);expect(errors).toEqual([]);
  22 | });
  23 | test('actual pointer cut picking saves computed surfaces in canonical coordinates',async({page})=>{
  24 |   await openAssembly(page);await page.getByRole('button',{name:'Views',exact:true}).click();await page.getByRole('button',{name:'Isolate selected object',exact:true}).click();await page.getByRole('button',{name:'Top',exact:true}).click();
  25 |   await page.getByRole('button',{name:'Section',exact:true}).click();await page.getByRole('button',{name:'OBLIQUE',exact:true}).click();await page.getByLabel('Section inclination').fill('-90');await page.getByLabel('Section offset exact').fill('0.3');await page.getByRole('button',{name:'Measure',exact:true}).click();
  26 |   const canvas=page.locator('[data-evidence-workbench] canvas'),box=(await canvas.boundingBox())!;let found=false;
  27 |   // Search visible cut, not a synthetic picking API. Top view faces the retained
  28 |   // lower half-space. Cavity remains empty; only real analytic cap meshes hit.
  29 |   outer:for(const y of [.35,.4,.45,.5,.55,.6,.65])for(const x of [.25,.3,.35,.4,.45,.5,.55,.6,.65,.7,.75]){
  30 |     await page.getByRole('button',{name:'Clear measurement',exact:true}).click();await page.mouse.click(box.x+box.width*x,box.y+box.height*y);
  31 |     if(await page.getByText(/Computed section surface/).count()){await page.mouse.click(box.x+box.width*x+2,box.y+box.height*y);if(await page.getByText(/2 picked points retain/).count()){found=true;break outer;}}
  32 |   }
> 33 |   expect(found,'Actual browser ray must reach an analytic section cap').toBe(true);await page.getByRole('button',{name:'Investigate',exact:true}).click();const study=await exported(page);
     |                                                                         ^ Error: Actual browser ray must reach an analytic section cap
  34 |   expect(study.payload.draft.points).toHaveLength(2);for(const point of study.payload.draft.points){expect(point.origin.kind).toBe('COMPUTED_SECTION');expect(point.position[2]).toBeCloseTo(-.3,5);}expect(study.payload.result.status).toBe('KNOWN');
  35 | });
  36 | for(const size of [{width:1280,height:800},{width:390,height:844},{width:844,height:390}])test(`model-first layout and keyboard ${size.width}x${size.height}`,async({page})=>{
  37 |   await page.setViewportSize(size);await openAssembly(page);const box=await page.locator('[data-evidence-workbench] canvas').boundingBox();expect(box!.height).toBeGreaterThan(150);expect(box!.width).toBeGreaterThan(200);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  38 |   await page.locator('[data-evidence-workbench]').click({position:{x:5,y:5}});await page.keyboard.press('m');await expect(page.getByLabel('Measurement frame')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByLabel('Measurement frame')).not.toBeVisible();
  39 | });
  40 | for(const failure of ['slow','missing','malformed'])test(`optional atlas ${failure} does not block core or force workspace navigation`,async({page})=>{
  41 |   let finish:()=>void=()=>{};const gate=new Promise<void>(r=>{finish=r;});
  42 |   await page.route('**/model/maps/manifest.json',async route=>{if(failure==='slow'){await gate;await route.continue().catch(()=>{});}else await route.fulfill({status:failure==='missing'?404:200,contentType:'application/json',body:failure==='missing'?'{}':'{"layers":false}'});});
  43 |   await page.goto('/');await expect(page.locator('canvas').first()).toBeVisible({timeout:5000});await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await expect(page.locator('[data-evidence-workbench]')).toBeVisible();finish();await expect(page.getByLabel('Evidence feature')).toBeVisible();
  44 | });
  45 | 
```