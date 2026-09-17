# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: evidence-workflow.spec.ts >> actual model entry, isolation fit, invariant measurement, computation, draft detour, export and restore
- Location: tests\browser\evidence-workflow.spec.ts:6:1

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 3

@@ -1,7 +1,7 @@
  Object {
-   "id": "investigation:1fce3bd538dbec9170a09155d1c33b128b42aa157aa2fc7c74efcfc016caf83e",
+   "id": "investigation:d269cb5ce65765ad4e13855bac6101f1e7cf9a7cef48c33e230171aca4a40da6",
    "payload": Object {
      "assemblySnapshot": Object {
        "audit": Array [
          Object {
            "detailValue": 1.5707963267948966,
@@ -3477,11 +3477,11 @@
              "value": null,
            },
          },
        ],
      },
-     "createdAt": "2026-09-17T23:16:27.385Z",
+     "createdAt": "2026-09-17T23:16:26.765Z",
      "dependencyFingerprint": "e82c4036e33e727fe547d6412a4ec1886ad19d67f32687297b8d60e2417ae164",
      "draft": Object {
        "frameId": "frame.khafre.lid.object",
        "mode": "DISTANCE",
        "points": Array [
@@ -13031,7 +13031,7 @@
      },
      "snapshotSha256": "ca5085e56265e4b995a54feb384de76d61d08240a80e72b74c4aff3372e9dca3",
      "title": "Khafre feature measurement",
    },
    "schema": "giza.saved-investigation.v1",
-   "sha256": "1fce3bd538dbec9170a09155d1c33b128b42aa157aa2fc7c74efcfc016caf83e",
+   "sha256": "d269cb5ce65765ad4e13855bac6101f1e7cf9a7cef48c33e230171aca4a40da6",
  }
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
        - button "← Workstation" [ref=f1e28] [cursor=pointer]
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
            - generic [ref=f1e71]:
              - button "Independent image scale/control remains unestablished HYPOTHESIS · REVIEW REQUIRED" [ref=f1e72] [cursor=pointer]:
                - strong [ref=f1e73]: Independent image scale/control remains unestablished
                - generic [ref=f1e74]: HYPOTHESIS · REVIEW REQUIRED
              - button "Opposite chamber lengths differ RECONSTRUCTED · REVIEW REQUIRED" [ref=f1e75] [cursor=pointer]:
                - strong [ref=f1e76]: Opposite chamber lengths differ
                - generic [ref=f1e77]: RECONSTRUCTED · REVIEW REQUIRED
              - button "Opposite chamber widths differ RECONSTRUCTED · REVIEW REQUIRED" [ref=f1e78] [cursor=pointer]:
                - strong [ref=f1e79]: Opposite chamber widths differ
                - generic [ref=f1e80]: RECONSTRUCTED · REVIEW REQUIRED
              - button "Lid/body length compatibility RECONSTRUCTED · REVIEW REQUIRED" [ref=f1e81] [cursor=pointer]:
                - strong [ref=f1e82]: Lid/body length compatibility
                - generic [ref=f1e83]: RECONSTRUCTED · REVIEW REQUIRED
              - button "Lid is not a uniform-thickness slab RECONSTRUCTED · REVIEW REQUIRED" [ref=f1e84] [cursor=pointer]:
                - strong [ref=f1e85]: Lid is not a uniform-thickness slab
                - generic [ref=f1e86]: RECONSTRUCTED · REVIEW REQUIRED
              - button "Lid/body width compatibility RECONSTRUCTED · REVIEW REQUIRED" [ref=f1e87] [cursor=pointer]:
                - strong [ref=f1e88]: Lid/body width compatibility
                - generic [ref=f1e89]: RECONSTRUCTED · REVIEW REQUIRED
              - button "Unresolved constraint · constraint.chamber.connection HYPOTHESIS · REVIEW REQUIRED" [ref=f1e90] [cursor=pointer]:
                - strong [ref=f1e91]: Unresolved constraint · constraint.chamber.connection
                - generic [ref=f1e92]: HYPOTHESIS · REVIEW REQUIRED
              - button "Unresolved constraint · constraint.lid.fit HYPOTHESIS · REVIEW REQUIRED" [ref=f1e93] [cursor=pointer]:
                - strong [ref=f1e94]: Unresolved constraint · constraint.lid.fit
                - generic [ref=f1e95]: HYPOTHESIS · REVIEW REQUIRED
              - button "Coffer long-axis disagreement HYPOTHESIS · REVIEW REQUIRED" [ref=f1e96] [cursor=pointer]:
                - strong [ref=f1e97]: Coffer long-axis disagreement
                - generic [ref=f1e98]: HYPOTHESIS · REVIEW REQUIRED
              - button "Legacy rim above chamber-floor adapter HYPOTHESIS · REVIEW REQUIRED" [ref=f1e99] [cursor=pointer]:
                - strong [ref=f1e100]: Legacy rim above chamber-floor adapter
                - generic [ref=f1e101]: HYPOTHESIS · REVIEW REQUIRED
              - button "Legacy/detail north–south offset HYPOTHESIS · REVIEW REQUIRED" [ref=f1e102] [cursor=pointer]:
                - strong [ref=f1e103]: Legacy/detail north–south offset
                - generic [ref=f1e104]: HYPOTHESIS · REVIEW REQUIRED
              - button "Legacy/detail east–west offset HYPOTHESIS · REVIEW REQUIRED" [ref=f1e105] [cursor=pointer]:
                - strong [ref=f1e106]: Legacy/detail east–west offset
                - generic [ref=f1e107]: HYPOTHESIS · REVIEW REQUIRED
              - button "Site/world datum unresolved HYPOTHESIS · REVIEW REQUIRED" [ref=f1e108] [cursor=pointer]:
                - strong [ref=f1e109]: Site/world datum unresolved
                - generic [ref=f1e110]: HYPOTHESIS · REVIEW REQUIRED
            - generic [ref=f1e111]:
              - heading "Immutable research journal · 1" [level=4] [ref=f1e112]
              - paragraph [ref=f1e113]: Append-only local journal. Export receipts for durable custody.
              - button "Export journal" [ref=f1e115] [cursor=pointer]
              - group [ref=f1e116]:
                - generic "EXPERIMENT · 2026-09-17T23:16:25.680Z" [ref=f1e117] [cursor=pointer]
            - group [ref=f1e118]:
              - generic "Authority promotion gate" [ref=f1e119] [cursor=pointer]
          - generic [ref=f1e120]:
            - status [ref=f1e121]:
              - text: ARCHIVED INPUTS ·
              - button "Return to current inputs" [ref=f1e122] [cursor=pointer]
            - region "Saved investigations" [ref=f1e123]:
              - heading "Save / restore investigation" [level=4] [ref=f1e124]
              - paragraph [ref=f1e125]: Complete a measurement first. Physical inputs and result are archived separately from camera, visibility and inspection state.
              - generic [ref=f1e126]:
                - text: Investigation title
                - textbox "Investigation title" [ref=f1e127]: Khafre feature measurement
              - generic [ref=f1e128]:
                - button "Save investigation" [ref=f1e129] [cursor=pointer]
                - button "Export investigation" [ref=f1e130] [cursor=pointer]
                - button "Import investigation" [ref=f1e131] [cursor=pointer]
              - status [ref=f1e132]: Opened ORIGINAL snapshot. Old points have not been attached to current geometry.
              - article [ref=f1e133]:
                - text: Khafre feature measurement
                - paragraph [ref=f1e134]: CURRENT · 1.067562 m
                - generic [ref=f1e135]: 2026-09-17T23:16:26.765Z · snapshot ca5085e56265
                - generic [ref=f1e136]:
                  - button "Open saved snapshot" [ref=f1e137] [cursor=pointer]
                  - button "Export saved record" [active] [ref=f1e138] [cursor=pointer]
      - generic [ref=f1e139]:
        - strong [ref=f1e140]: RECONSTRUCTION ≠ OBSERVATION
        - generic [ref=f1e141]: Source-reported dimensions · idealized surfaces · lid placement, survey uncertainty and site transform UNKNOWN. No new metric registration or archaeological finding is asserted.
  - contentinfo [ref=f1e142]:
    - generic [ref=f1e143]: "DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP"
    - generic [ref=f1e144]: △ GIZA // NEXUS · v0.10.12 · KHAFRE · 56 KEY STRUCTURES
    - generic [ref=f1e145]: "● STATUS: READY"
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
  14 |   const study=await exported(page);expect(study.payload.presentation.explode).toBe(3);expect(study.payload.result.status).toBe('KNOWN');expect(study.payload.receipts).toHaveLength(1);expect(study.payload.presentation.bookmarks).toHaveLength(1);
  15 |   await page.reload();await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await page.getByRole('button',{name:'Investigate',exact:true}).click();await page.getByRole('button',{name:'Open saved snapshot',exact:true}).click();await expect(page.getByText('ARCHIVED INPUTS',{exact:false})).toBeVisible();
> 16 |   const reopened=await exported(page,'Export saved record');expect(reopened).toEqual(study);
     |                                                                              ^ Error: expect(received).toEqual(expected) // deep equality
  17 |   await page.getByLabel('Import saved investigation').setInputFiles({name:'synthetic-browser-study.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(study))});await expect(page.getByText(/Imported and replay-verified/)).toBeVisible();await expect(page.getByRole('button',{name:'Open saved snapshot',exact:true})).toHaveCount(1);
  18 |   await page.getByRole('button',{name:'← Workstation',exact:true}).click();await expect(page.locator('[data-evidence-workbench]')).toHaveCount(0);expect(errors).toEqual([]);
  19 | });
  20 | for(const size of [{width:1280,height:800},{width:390,height:844},{width:844,height:390}])test(`model-first layout and keyboard ${size.width}x${size.height}`,async({page})=>{
  21 |   await page.setViewportSize(size);await openAssembly(page);const box=await page.locator('[data-evidence-workbench] canvas').boundingBox();expect(box!.height).toBeGreaterThan(150);expect(box!.width).toBeGreaterThan(200);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  22 |   await page.locator('[data-evidence-workbench]').click({position:{x:5,y:5}});await page.keyboard.press('m');await expect(page.getByLabel('Measurement frame')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByLabel('Measurement frame')).not.toBeVisible();
  23 | });
  24 | for(const failure of ['slow','missing','malformed'])test(`optional atlas ${failure} does not block core or force workspace navigation`,async({page})=>{
  25 |   let finish:()=>void=()=>{};const gate=new Promise<void>(r=>{finish=r;});
  26 |   await page.route('**/model/maps/manifest.json',async route=>{if(failure==='slow'){await gate;await route.continue().catch(()=>{});}else await route.fulfill({status:failure==='missing'?404:200,contentType:'application/json',body:failure==='missing'?'{}':'{"layers":false}'});});
  27 |   await page.goto('/');await expect(page.locator('canvas').first()).toBeVisible({timeout:5000});await page.getByRole('button',{name:'Sarcophagus',exact:true}).click();await expect(page.locator('[data-evidence-workbench]')).toBeVisible();finish();await expect(page.getByLabel('Evidence feature')).toBeVisible();
  28 | });
  29 | 
```