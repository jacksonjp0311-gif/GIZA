# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: evidence-workflow.spec.ts >> actual pointer cut picking saves computed surfaces in canonical coordinates
- Location: tests\browser\evidence-workflow.spec.ts:28:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForEvent: Test timeout of 60000ms exceeded.
=========================== logs ===========================
waiting for event "download"
============================================================
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
          - text: · v0.11.1
        - heading "KHAFRE / EVIDENCE ASSEMBLY" [level=1] [ref=e12]
        - generic [ref=e13]: GIZA, EGYPT · 29.976000° N · 31.130969° E · c. 2570 BCE
    - navigation "Viewport surface" [ref=e14]:
      - button "3D MODEL" [pressed] [ref=e15] [cursor=pointer]
      - button "MAP ATLAS" [ref=e16] [cursor=pointer]
      - button "REGISTRATION" [ref=e17] [cursor=pointer]
      - button "Tutorial / ?" [ref=e18] [cursor=pointer]
    - generic "Model evidence summary" [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e21]: "24"
        - text: reconstructions
      - generic [ref=e22]:
        - generic [ref=e23]: "1"
        - text: assumed
      - generic [ref=e24]:
        - generic [ref=e25]: "31"
        - text: unverified
  - complementary "New to GIZA?" [ref=e26]:
    - text: NEW TO GIZA?
    - paragraph [ref=e27]: Take a guided tour of the spatial research workstation.
    - button "Start tutorial" [ref=e28] [cursor=pointer]
    - button "Explore on my own" [ref=e29] [cursor=pointer]
  - main [ref=e30]:
    - generic [ref=e31]:
      - generic [ref=e32]:
        - button "← Workstation" [ref=e33] [cursor=pointer]
        - generic [ref=e34]:
          - text: EVIDENCE ASSEMBLY / 01
          - heading "Sarcophagus · lid · burial chamber" [level=2] [ref=e35]
        - navigation "Spatial interrogation tools" [ref=e36]:
          - button "Evidence" [ref=e37] [cursor=pointer]
          - button "Measure" [ref=e38] [cursor=pointer]
          - button "Section" [ref=e39] [cursor=pointer]
          - button "Compare" [ref=e40] [cursor=pointer]
          - button "Investigate" [pressed] [ref=e41] [cursor=pointer]
          - button "Views" [ref=e42] [cursor=pointer]
      - generic [ref=e43]:
        - region "Evidence Assembly 3-D viewport" [ref=e44]:
          - generic [ref=e45]:
            - button "Show burial chamber" [ref=e46] [cursor=pointer]
            - button "Fit · F" [ref=e47] [cursor=pointer]
            - button "Top" [ref=e48] [cursor=pointer]
            - group [ref=e49]:
              - generic "Explode / restore" [ref=e50] [cursor=pointer]
            - generic "Reality layers" [ref=e51]:
              - generic [ref=e52]:
                - checkbox "OBSERVED reality layer" [checked] [ref=e53]
                - text: OBSERVED
              - generic [ref=e55]:
                - checkbox "RECONSTRUCTED reality layer" [checked] [ref=e56]
                - text: RECONSTRUCTED
              - generic [ref=e58]:
                - checkbox "HYPOTHESIS reality layer" [ref=e59]
                - text: HYPOTHESIS
          - generic [ref=e62]:
            - generic: A
            - generic: B
          - generic [ref=e67]:
            - generic [ref=e68]: East wall / rim · 0.46804, 0.43645, -0.30000 m
            - generic [ref=e69]: m · X east / Y north / Z up · Drag rotate · wheel zoom · right-drag pan
        - complementary "Investigation workspace" [ref=e70]:
          - generic [ref=e71]:
            - heading "Investigation workspace" [level=3] [ref=e72]
            - button "Close contextual panel" [ref=e73] [cursor=pointer]: ×
          - generic [ref=e74]:
            - paragraph [ref=e75]: Investigation Candidates are computational questions, not discoveries. Review source definitions and null explanations before interpreting a result.
            - generic [ref=e76]:
              - text: Investigation candidate
              - combobox "Investigation candidate" [ref=e77]:
                - option "Select a candidate…" [disabled] [selected]
                - option "Independent image scale/control remains unestablished"
                - option "Opposite chamber lengths differ"
                - option "Opposite chamber widths differ"
                - option "Lid/body length compatibility"
                - option "Lid is not a uniform-thickness slab"
                - option "Lid/body width compatibility"
                - option "Unresolved constraint · constraint.chamber.connection"
                - option "Unresolved constraint · constraint.lid.fit"
                - option "Coffer long-axis disagreement"
                - option "Legacy rim above chamber-floor adapter"
                - option "Legacy/detail north–south offset"
                - option "Legacy/detail east–west offset"
                - option "Site/world datum unresolved"
            - generic [ref=e78]:
              - button "Independent image scale/control remains unestablished HYPOTHESIS · REVIEW REQUIRED" [ref=e79] [cursor=pointer]:
                - strong [ref=e80]: Independent image scale/control remains unestablished
                - generic [ref=e81]: HYPOTHESIS · REVIEW REQUIRED
              - button "Opposite chamber lengths differ RECONSTRUCTED · REVIEW REQUIRED" [ref=e82] [cursor=pointer]:
                - strong [ref=e83]: Opposite chamber lengths differ
                - generic [ref=e84]: RECONSTRUCTED · REVIEW REQUIRED
              - button "Opposite chamber widths differ RECONSTRUCTED · REVIEW REQUIRED" [ref=e85] [cursor=pointer]:
                - strong [ref=e86]: Opposite chamber widths differ
                - generic [ref=e87]: RECONSTRUCTED · REVIEW REQUIRED
              - button "Lid/body length compatibility RECONSTRUCTED · REVIEW REQUIRED" [ref=e88] [cursor=pointer]:
                - strong [ref=e89]: Lid/body length compatibility
                - generic [ref=e90]: RECONSTRUCTED · REVIEW REQUIRED
              - button "Lid is not a uniform-thickness slab RECONSTRUCTED · REVIEW REQUIRED" [ref=e91] [cursor=pointer]:
                - strong [ref=e92]: Lid is not a uniform-thickness slab
                - generic [ref=e93]: RECONSTRUCTED · REVIEW REQUIRED
              - button "Lid/body width compatibility RECONSTRUCTED · REVIEW REQUIRED" [ref=e94] [cursor=pointer]:
                - strong [ref=e95]: Lid/body width compatibility
                - generic [ref=e96]: RECONSTRUCTED · REVIEW REQUIRED
              - button "Unresolved constraint · constraint.chamber.connection HYPOTHESIS · REVIEW REQUIRED" [ref=e97] [cursor=pointer]:
                - strong [ref=e98]: Unresolved constraint · constraint.chamber.connection
                - generic [ref=e99]: HYPOTHESIS · REVIEW REQUIRED
              - button "Unresolved constraint · constraint.lid.fit HYPOTHESIS · REVIEW REQUIRED" [ref=e100] [cursor=pointer]:
                - strong [ref=e101]: Unresolved constraint · constraint.lid.fit
                - generic [ref=e102]: HYPOTHESIS · REVIEW REQUIRED
              - button "Coffer long-axis disagreement HYPOTHESIS · REVIEW REQUIRED" [ref=e103] [cursor=pointer]:
                - strong [ref=e104]: Coffer long-axis disagreement
                - generic [ref=e105]: HYPOTHESIS · REVIEW REQUIRED
              - button "Legacy rim above chamber-floor adapter HYPOTHESIS · REVIEW REQUIRED" [ref=e106] [cursor=pointer]:
                - strong [ref=e107]: Legacy rim above chamber-floor adapter
                - generic [ref=e108]: HYPOTHESIS · REVIEW REQUIRED
              - button "Legacy/detail north–south offset HYPOTHESIS · REVIEW REQUIRED" [ref=e109] [cursor=pointer]:
                - strong [ref=e110]: Legacy/detail north–south offset
                - generic [ref=e111]: HYPOTHESIS · REVIEW REQUIRED
              - button "Legacy/detail east–west offset HYPOTHESIS · REVIEW REQUIRED" [ref=e112] [cursor=pointer]:
                - strong [ref=e113]: Legacy/detail east–west offset
                - generic [ref=e114]: HYPOTHESIS · REVIEW REQUIRED
              - button "Site/world datum unresolved HYPOTHESIS · REVIEW REQUIRED" [ref=e115] [cursor=pointer]:
                - strong [ref=e116]: Site/world datum unresolved
                - generic [ref=e117]: HYPOTHESIS · REVIEW REQUIRED
            - generic [ref=e118]:
              - heading "Immutable research journal · 0" [level=4] [ref=e119]
              - paragraph [ref=e120]: Append-only local journal. Export receipts for durable custody.
              - button "Export journal" [ref=e122] [cursor=pointer]
            - group [ref=e123]:
              - generic "Authority promotion gate" [ref=e124] [cursor=pointer]
          - region "Saved investigations" [ref=e126]:
            - heading "Save / restore investigation" [level=4] [ref=e127]
            - group [ref=e128]:
              - generic "Inspect historical file without restoring" [ref=e129] [cursor=pointer]
            - generic [ref=e130]:
              - heading "Khafre feature measurement · input comparison" [level=4] [ref=e131]
              - region "Investigation explanation" [ref=e132]:
                - button "Explain / compare inputs" [ref=e133] [cursor=pointer]
            - paragraph [ref=e134]: Complete a measurement first. Physical inputs and result are archived separately from camera, visibility and inspection state.
            - generic [ref=e135]:
              - text: Investigation title
              - textbox "Investigation title" [ref=e136]: Khafre feature measurement
            - generic [ref=e137]:
              - button "Save investigation" [active] [ref=e138] [cursor=pointer]
              - button "Export investigation" [ref=e139] [cursor=pointer]
              - button "Import investigation" [ref=e140] [cursor=pointer]
            - status [ref=e141]: Saved with original geometry, canonical points and reproducible result.
            - article [ref=e142]:
              - text: Khafre feature measurement
              - paragraph [ref=e143]: CURRENT · 0.869208027923257 m
              - generic [ref=e144]: 2026-09-18T17:05:34.069Z · snapshot f2719aab3dc6
              - generic [ref=e145]:
                - button "Open saved snapshot" [ref=e146] [cursor=pointer]
                - button "Export saved record" [ref=e147] [cursor=pointer]
      - generic [ref=e148]:
        - strong [ref=e149]: RECONSTRUCTION ≠ OBSERVATION
        - generic [ref=e150]: Source-reported dimensions · idealized surfaces · lid placement, survey uncertainty and site transform UNKNOWN. No new metric registration or archaeological finding is asserted.
  - contentinfo [ref=e151]:
    - generic [ref=e152]: "DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP"
    - generic [ref=e153]: △ GIZA // NEXUS · v0.11.1 · KHAFRE · 56 KEY STRUCTURES
    - generic [ref=e154]: "● STATUS: READY"
```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | import fs from 'node:fs/promises';
  3  | async function openAssembly(page:Page){await page.goto('/?spatialDiagnostics=1');await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await expect(page.locator('[data-evidence-workbench] canvas')).toBeVisible();await expect(page.getByLabel('Evidence feature')).toBeVisible();}
  4  | async function measureLid(page:Page){await page.getByLabel('Evidence feature').selectOption('feature.lid.envelope');await page.getByRole('button',{name:'Measure',exact:true}).click();await page.getByLabel('Measurement frame').selectOption('frame.khafre.lid.object');await page.getByRole('button',{name:'Anchor 1',exact:true}).click();await page.getByRole('button',{name:'Anchor 2',exact:true}).click();}
> 5  | async function exported(page:Page,button='Export investigation'){const event=page.waitForEvent('download');await page.getByRole('button',{name:button,exact:true}).click();const d=await event;return JSON.parse(await fs.readFile((await d.path())!,'utf8'));}
     |                                                                                   ^ Error: page.waitForEvent: Test timeout of 60000ms exceeded.
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
  31 |   await expect(page.getByLabel('Measurement feature')).toBeVisible();
  32 |   const canvas=page.locator('[data-evidence-workbench] canvas');
  33 |   await expect.poll(async()=>{const d=JSON.parse(await canvas.getAttribute('data-spatial-diagnostics')??'{}');return !!d.settled&&d.caps.filter((c:any)=>c.inViewport&&Math.abs(c.section.offset-.3)<1e-8).length>=2;}).toBe(true);
  34 |   const diagnostic=JSON.parse((await canvas.getAttribute('data-spatial-diagnostics'))!);const targets=diagnostic.caps.filter((c:any)=>c.inViewport).slice(0,2);
  35 |   for(let i=0;i<2;i++){await page.mouse.click(targets[i].screen[0],targets[i].screen[1]);await expect(page.getByText(new RegExp(`${i+1} picked points retain`))).toBeVisible();}
  36 |   await expect(page.getByText(/Computed section surface/).first()).toBeVisible();await page.getByRole('button',{name:'Investigate',exact:true}).click();await page.getByRole('button',{name:'Save investigation',exact:true}).click();await expect(page.getByText('Saved with original geometry, canonical points and reproducible result.',{exact:true})).toBeVisible();const study=await exported(page,'Export saved record');
  37 |   expect(study.payload.draft.points).toHaveLength(2);for(const point of study.payload.draft.points){expect(point.origin.kind).toBe('COMPUTED_SECTION');expect(point.position[2]).toBeCloseTo(-.3,5);}expect(study.payload.result.status).toBe('KNOWN');
  38 |   expect(study.payload.draft.points.map((p:any)=>p.featureId)).toEqual(targets.map((t:any)=>t.featureId));expect(study.payload.draft.points.map((p:any)=>p.frameId)).toEqual(targets.map((t:any)=>t.frameId));
  39 |   await page.reload();await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await page.getByRole('button',{name:'Investigate',exact:true}).click();await page.getByRole('button',{name:'Open saved snapshot',exact:true}).click();expect(await exported(page,'Export saved record')).toEqual(study);
  40 | });
  41 | test('authority-hidden geometry is absent from actual Fit-visible camera bounds',async({page})=>{
  42 |   await openAssembly(page);await measureLid(page);await page.getByRole('button',{name:'Views',exact:true}).click();await page.getByRole('button',{name:'Isolate selected object',exact:true}).click();await page.getByRole('button',{name:'Fit · F',exact:true}).click();await page.getByRole('button',{name:'Save current camera',exact:true}).click();
  43 |   await page.getByLabel('RECONSTRUCTED reality layer',{exact:true}).uncheck();await page.getByRole('button',{name:'Fit · F',exact:true}).click();await page.getByRole('button',{name:'Save current camera',exact:true}).click();await page.getByRole('button',{name:'Evidence',exact:true}).click();await expect(page.getByText(/This authority layer is hidden/)).toBeVisible();
  44 |   await page.getByRole('button',{name:'Investigate',exact:true}).click();const study=await exported(page),views=study.payload.presentation.bookmarks,body=study.payload.assemblySnapshot.transforms.find((t:{id:string})=>t.id==='transform.coffer.assembly');
  45 |   expect(views[0].target[0]).not.toBeCloseTo(views[1].target[0],5);expect(views[1].target[0]).toBeCloseTo(body.matrix[3],5);expect(study.payload.result.status).toBe('KNOWN');expect(study.payload.presentation.layers.RECONSTRUCTED).toBe(false);
  46 | });
  47 | for(const size of [{width:1280,height:800},{width:390,height:844},{width:844,height:390}])test(`model-first layout and keyboard ${size.width}x${size.height}`,async({page})=>{
  48 |   await page.setViewportSize(size);await openAssembly(page);const box=await page.locator('[data-evidence-workbench] canvas').boundingBox();expect(box!.height).toBeGreaterThan(150);expect(box!.width).toBeGreaterThan(200);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  49 |   await page.locator('[data-evidence-workbench]').click({position:{x:5,y:5}});await page.keyboard.press('m');await expect(page.getByLabel('Measurement frame')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByLabel('Measurement frame')).not.toBeVisible();
  50 | });
  51 | for(const failure of ['slow','missing','malformed'])test(`optional atlas ${failure} does not block core or force workspace navigation`,async({page})=>{
  52 |   let finish:()=>void=()=>{};const gate=new Promise<void>(r=>{finish=r;});
  53 |   await page.route('**/model/maps/manifest.json',async route=>{if(failure==='slow'){await gate;await route.continue().catch(()=>{});}else await route.fulfill({status:failure==='missing'?404:200,contentType:'application/json',body:failure==='missing'?'{}':'{"layers":false}'});});
  54 |   await page.goto('/');await expect(page.locator('canvas').first()).toBeVisible({timeout:5000});await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await expect(page.locator('[data-evidence-workbench]')).toBeVisible();finish();await expect(page.getByLabel('Evidence feature')).toBeVisible();
  55 | });
  56 | 
```