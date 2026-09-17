# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: evidence-workflow.spec.ts >> actual model entry, isolation fit, invariant measurement, computation, draft detour, export and restore
- Location: tests\browser\evidence-workflow.spec.ts:6:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[data-evidence-workbench]')
Expected: 0
Received: 1
Timeout:  15000ms

Call log:
  - Expect "toHaveCount" locator('[data-evidence-workbench]') with timeout 15000ms
  - waiting for locator('[data-evidence-workbench]')
    33 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - generic [ref=f1e5]:
      - generic "GIZA NEXUS" [ref=f1e6]:
        - img "GIZA NEXUS pyramid logo" [ref=f1e8]
      - generic "CINEMATIC SPATIAL REVERSE-ENGINEERING WORKSTATION" [ref=f1e9]:
        - generic [ref=f1e10]:
          - text: GIZA
          - emphasis [ref=f1e11]: NEXUS
          - text: · v0.10.12
        - heading "KHAFRE / EVIDENCE ASSEMBLY" [level=1] [ref=f1e12]
        - generic [ref=f1e13]: GIZA, EGYPT · 29.976000° N · 31.130969° E · c. 2570 BCE
    - navigation "Viewport surface" [ref=f1e14]:
      - button "3D MODEL" [pressed] [ref=f1e15] [cursor=pointer]
      - button "MAP ATLAS" [ref=f1e16] [cursor=pointer]
      - button "REGISTRATION" [ref=f1e17] [cursor=pointer]
    - generic "Model evidence summary" [ref=f1e18]:
      - generic [ref=f1e19]:
        - generic [ref=f1e20]: "24"
        - text: reconstructions
      - generic [ref=f1e21]:
        - generic [ref=f1e22]: "1"
        - text: assumed
      - generic [ref=f1e23]:
        - generic [ref=f1e24]: "31"
        - text: unverified
  - main [ref=f1e25]:
    - generic [ref=f1e26]:
      - generic [ref=f1e27]:
        - button "← Workstation" [active] [ref=f1e28] [cursor=pointer]
        - generic [ref=f1e29]:
          - text: EVIDENCE ASSEMBLY / 01
          - heading "Sarcophagus · lid · burial chamber" [level=2] [ref=f1e30]
        - navigation "Spatial interrogation tools" [ref=f1e31]:
          - button "Evidence" [ref=f1e32] [cursor=pointer]
          - button "Measure" [ref=f1e33] [cursor=pointer]
          - button "Section" [ref=f1e34] [cursor=pointer]
          - button "Compare" [ref=f1e35] [cursor=pointer]
          - button "Investigate" [pressed] [ref=f1e36] [cursor=pointer]
          - button "Views" [ref=f1e37] [cursor=pointer]
      - generic [ref=f1e38]:
        - region "Evidence Assembly 3-D viewport" [ref=f1e39]:
          - generic [ref=f1e40]:
            - button "Show burial chamber" [ref=f1e41] [cursor=pointer]
            - button "Fit · F" [ref=f1e42] [cursor=pointer]
            - button "Top" [ref=f1e43] [cursor=pointer]
            - generic "Reality layers" [ref=f1e44]:
              - generic [ref=f1e45]:
                - checkbox "OBSERVED reality layer" [checked] [ref=f1e46]
                - text: OBSERVED
              - generic [ref=f1e48]:
                - checkbox "RECONSTRUCTED reality layer" [checked] [ref=f1e49]
                - text: RECONSTRUCTED
              - generic [ref=f1e51]:
                - checkbox "HYPOTHESIS reality layer" [ref=f1e52]
                - text: HYPOTHESIS
          - generic [ref=f1e55]:
            - generic: A
            - generic: B
          - generic [ref=f1e60]:
            - generic [ref=f1e61]: ARCHIVED SNAPSHOT — measurements use the saved geometry, not current inputs.
            - generic [ref=f1e62]: m · X east / Y north / Z up · Drag rotate · wheel zoom · right-drag pan
        - complementary "Investigation workspace" [ref=f1e63]:
          - generic [ref=f1e64]:
            - heading "Investigation workspace" [level=3] [ref=f1e65]
            - button "Close contextual panel" [ref=f1e66] [cursor=pointer]: ×
          - generic [ref=f1e67]:
            - paragraph [ref=f1e68]: Investigation Candidates are computational questions, not discoveries. Review source definitions and null explanations before interpreting a result.
            - generic [ref=f1e69]:
              - text: Investigation candidate
              - combobox "Investigation candidate" [ref=f1e70]:
                - option "Select a candidate…" [disabled]
                - option "Independent image scale/control remains unestablished"
                - option "Opposite chamber lengths differ"
                - option "Opposite chamber widths differ"
                - option "Lid/body length compatibility" [selected]
                - option "Lid is not a uniform-thickness slab"
                - option "Lid/body width compatibility"
                - option "Unresolved constraint · constraint.chamber.connection"
                - option "Unresolved constraint · constraint.lid.fit"
                - option "Coffer long-axis disagreement"
                - option "Legacy rim above chamber-floor adapter"
                - option "Legacy/detail north–south offset"
                - option "Legacy/detail east–west offset"
                - option "Site/world datum unresolved"
            - generic [ref=f1e71]: RECONSTRUCTED · REVIEW_REQUIRED
            - heading "Lid/body length compatibility" [level=3] [ref=f1e72]
            - paragraph [ref=f1e73]: The reported west lid length and body outer length differ. This is a dimensional comparison, not a seated-fit or motion solution.
            - generic [ref=f1e74]:
              - text: DIRECT_DIFFERENCE
              - paragraph [ref=f1e75]:
                - code [ref=f1e76]: m.coffer.lid_length - m.coffer.outer_length
              - strong [ref=f1e77]: 0.00127 m
              - paragraph [ref=f1e78]: "Uncertainty: 0.001016 m"
              - paragraph [ref=f1e79]: Conservative sum of the supplied uncertainty magnitudes; no independence or confidence distribution assumed.
            - heading "Exact evidence / computation inputs" [level=4] [ref=f1e80]
            - paragraph [ref=f1e81]:
              - code [ref=f1e82]: m.coffer.lid_length
              - text: 2.634742 m
            - paragraph [ref=f1e83]:
              - code [ref=f1e84]: m.coffer.outer_length
              - text: 2.633472 m
            - group [ref=f1e85]:
              - generic "Evidence IDs and 3-D locations" [ref=f1e86] [cursor=pointer]
            - heading "Alternative / null explanations" [level=4] [ref=f1e87]
            - list [ref=f1e88]:
              - listitem [ref=f1e89]: Measurements may refer to different edges or irregular surfaces.
              - listitem [ref=f1e90]: Damage, rounding, transcription or source measurement uncertainty may explain the difference.
              - listitem [ref=f1e91]: The seated position and contact surfaces are not independently surveyed.
            - heading "What would falsify it?" [level=4] [ref=f1e92]
            - paragraph [ref=f1e93]: Repeat both measurements on identified common-axis edges; reject a meaningful fit discrepancy if their uncertainty intervals overlap or the dimensions are not comparable.
            - list [ref=f1e94]:
              - listitem [ref=f1e95]: Independent measurements of the same named features
              - listitem [ref=f1e96]: Measurement uncertainty and datum definitions
            - button "Run reproducible computation" [ref=f1e97] [cursor=pointer]
            - status [ref=f1e98]: CURRENT — matching dependency fingerprint
            - generic [ref=f1e99]:
              - heading "Result → reviewed finding" [level=4] [ref=f1e100]
              - paragraph [ref=f1e101]: Experiment ef333cbaf560f7b9… reproduced source arithmetic. This is not an independent archaeological confirmation.
              - generic [ref=f1e102]:
                - text: Researcher / reviewer
                - textbox "Finding reviewer" [ref=f1e103]
              - generic [ref=f1e104]:
                - text: Review outcome
                - combobox "Review outcome" [ref=f1e105]:
                  - option "INCONCLUSIVE" [selected]
                  - option "SUPPORTED"
                  - option "FALSIFIED"
              - generic [ref=f1e106]:
                - text: Evidence interpretation / limitations
                - textbox "Finding review note" [ref=f1e107]
              - button "Append reviewed finding" [disabled] [ref=f1e108]
              - text: Operator-supplied, unauthenticated review; geometry authority remains NONE.
            - generic [ref=f1e109]:
              - heading "Immutable research journal · 1" [level=4] [ref=f1e110]
              - paragraph [ref=f1e111]: Append-only local journal. Export receipts for durable custody.
              - button "Export journal" [ref=f1e113] [cursor=pointer]
              - group [ref=f1e114]:
                - generic "EXPERIMENT · 2026-09-17T23:17:41.764Z" [ref=f1e115] [cursor=pointer]
            - group [ref=f1e116]:
              - generic "Authority promotion gate" [ref=f1e117] [cursor=pointer]
          - generic [ref=f1e118]:
            - status [ref=f1e119]:
              - text: ARCHIVED INPUTS ·
              - button "Return to current inputs" [ref=f1e120] [cursor=pointer]
            - region "Saved investigations" [ref=f1e121]:
              - heading "Save / restore investigation" [level=4] [ref=f1e122]
              - paragraph [ref=f1e123]: Complete a measurement first. Physical inputs and result are archived separately from camera, visibility and inspection state.
              - generic [ref=f1e124]:
                - text: Investigation title
                - textbox "Investigation title" [ref=f1e125]: Khafre feature measurement
              - generic [ref=f1e126]:
                - button "Save investigation" [ref=f1e127] [cursor=pointer]
                - button "Export investigation" [ref=f1e128] [cursor=pointer]
                - button "Import investigation" [ref=f1e129] [cursor=pointer]
              - status [ref=f1e130]: Imported and replay-verified. Open the saved snapshot below. Identical duplicates are safe.
              - article [ref=f1e131]:
                - text: Khafre feature measurement
                - paragraph [ref=f1e132]: HISTORICAL · 1.067562 m
                - generic [ref=f1e133]: 2026-09-17T23:17:43.136Z · snapshot ca5085e56265
                - generic [ref=f1e134]:
                  - button "Open saved snapshot" [ref=f1e135] [cursor=pointer]
                  - button "Export saved record" [ref=f1e136] [cursor=pointer]
      - generic [ref=f1e137]:
        - strong [ref=f1e138]: RECONSTRUCTION ≠ OBSERVATION
        - generic [ref=f1e139]: Source-reported dimensions · idealized surfaces · lid placement, survey uncertainty and site transform UNKNOWN. No new metric registration or archaeological finding is asserted.
  - contentinfo [ref=f1e140]:
    - generic [ref=f1e141]: "DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP"
    - generic [ref=f1e142]: △ GIZA // NEXUS · v0.10.12 · KHAFRE · 56 KEY STRUCTURES
    - generic [ref=f1e143]: "● STATUS: READY"
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
> 21 |   await page.getByRole('button',{name:'← Workstation',exact:true}).click();await expect(page.locator('[data-evidence-workbench]')).toHaveCount(0);expect(errors).toEqual([]);
     |                                                                                                                                    ^ Error: expect(locator).toHaveCount(expected) failed
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
  33 |   expect(found,'Actual browser ray must reach an analytic section cap').toBe(true);await page.getByRole('button',{name:'Investigate',exact:true}).click();const study=await exported(page);
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