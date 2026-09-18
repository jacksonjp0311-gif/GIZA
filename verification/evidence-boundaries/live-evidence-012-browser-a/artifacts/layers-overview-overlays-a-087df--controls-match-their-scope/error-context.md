# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: layers.spec.ts >> overview overlays and detail controls match their scope
- Location: tests\browser\layers.spec.ts:19:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.check: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('checkbox', { name: 'Show Dimensions', exact: true })
    - locator resolved to <input type="checkbox"/>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <aside class="tutorialWelcome" data-tutorial-root="true" aria-label="New to GIZA?">…</aside> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <b>NEW TO GIZA?</b> from <aside class="tutorialWelcome" data-tutorial-root="true" aria-label="New to GIZA?">…</aside> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <b>NEW TO GIZA?</b> from <aside class="tutorialWelcome" data-tutorial-root="true" aria-label="New to GIZA?">…</aside> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <aside class="tutorialWelcome" data-tutorial-root="true" aria-label="New to GIZA?">…</aside> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <b>NEW TO GIZA?</b> from <aside class="tutorialWelcome" data-tutorial-root="true" aria-label="New to GIZA?">…</aside> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <b>NEW TO GIZA?</b> from <aside class="tutorialWelcome" data-tutorial-root="true" aria-label="New to GIZA?">…</aside> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

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
        - heading "KHAFRE / FULL PYRAMID" [level=1] [ref=e12]
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
    - complementary [ref=e31]:
      - generic [ref=e32]:
        - generic [ref=e33]:
          - generic [ref=e34]: PROJECT EXPLORER
          - generic [ref=e35]: ▱
        - generic [ref=e36]:
          - text: ⌕
          - textbox "Find a component" [ref=e37]:
            - /placeholder: Find chamber, slab, passage…
        - generic [ref=e38]:
          - generic [ref=e39]: ⌄ Giza Plateau
          - button "› Khufu (Context)" [ref=e40] [cursor=pointer]:
            - text: ›
            - generic [ref=e41]: Khufu (Context)
          - button "⌄ Khafre (Active) ◉" [ref=e42] [cursor=pointer]:
            - text: ⌄
            - generic [ref=e43]: Khafre (Active)
            - generic [ref=e44]: ◉
          - button "› Menkaure" [ref=e45] [cursor=pointer]:
            - text: ›
            - generic [ref=e46]: Menkaure
          - button "› Sphinx 3D" [ref=e47] [cursor=pointer]:
            - text: ›
            - generic [ref=e48]: Sphinx
            - generic [ref=e49]: 3D
          - button "› Valley Temple" [ref=e50] [cursor=pointer]:
            - text: ›
            - generic [ref=e51]: Valley Temple
          - button "› Causeway" [ref=e52] [cursor=pointer]:
            - text: ›
            - generic [ref=e53]: Causeway
          - button "› Mastabas & Tombs" [ref=e54] [cursor=pointer]:
            - text: ›
            - generic [ref=e55]: Mastabas & Tombs
          - button "› Room / Threshold Graph MAP" [ref=e56] [cursor=pointer]:
            - text: ›
            - generic [ref=e57]: Room / Threshold Graph
            - generic [ref=e58]: MAP
          - button "› Survey Data MAP" [ref=e59] [cursor=pointer]:
            - text: ›
            - generic [ref=e60]: Survey Data
            - generic [ref=e61]: MAP
          - button "› Historical Maps MAP" [ref=e62] [cursor=pointer]:
            - text: ›
            - generic [ref=e63]: Historical Maps
            - generic [ref=e64]: MAP
          - button "› Plateau / Terrain MAP" [ref=e65] [cursor=pointer]:
            - text: ›
            - generic [ref=e66]: Plateau / Terrain
            - generic [ref=e67]: MAP
          - button "› Open Source Photos MAP" [ref=e68] [cursor=pointer]:
            - text: ›
            - generic [ref=e69]: Open Source Photos
            - generic [ref=e70]: MAP
          - button "› Intent Reconstruction MAP" [ref=e71] [cursor=pointer]:
            - text: ›
            - generic [ref=e72]: Intent Reconstruction
            - generic [ref=e73]: MAP
      - generic [ref=e74]:
        - generic [ref=e75]:
          - generic [ref=e76]: MODEL LAYERS
          - generic [ref=e77]: ▱
        - generic [ref=e78]:
          - generic [ref=e79]: ◈ Exterior (Current)
          - checkbox "Exterior (Current)" [checked] [ref=e80] [cursor=pointer]
        - generic [ref=e81]:
          - generic [ref=e82]: ◈ Casing Stones
          - checkbox "Casing Stones" [checked] [ref=e83] [cursor=pointer]
        - generic [ref=e84]:
          - generic [ref=e85]: ◈ Internal Architecture
          - checkbox "Internal Architecture" [checked] [ref=e86] [cursor=pointer]
        - generic [ref=e87]:
          - generic [ref=e88]: ◈ Subterranean (Unverified)
          - checkbox "Subterranean (Unverified)" [ref=e89] [cursor=pointer]
        - generic [ref=e90]:
          - generic [ref=e91]: ◈ Surrounding Terrain
          - checkbox "Surrounding Terrain" [checked] [ref=e92] [cursor=pointer]
        - generic [ref=e93]:
          - generic [ref=e94]: ◈ Reference Photos
          - checkbox "Reference Photos" [checked] [ref=e95] [cursor=pointer]
        - generic [ref=e96]:
          - generic [ref=e97]: ◈ Measurement Overlays
          - checkbox "Measurement Overlays" [checked] [ref=e98] [cursor=pointer]
        - generic [ref=e99]:
          - generic [ref=e100]: ◈ Block / Slab Detail
          - checkbox "Block / Slab Detail" [checked] [ref=e101] [cursor=pointer]
        - generic [ref=e102]:
          - generic [ref=e103]: ◈ X-Ray Mode
          - checkbox "X-Ray Mode" [ref=e104] [cursor=pointer]
        - generic [ref=e105]:
          - generic [ref=e106]: ◈ FIELD Registration
          - checkbox "FIELD Registration" [checked] [ref=e107] [cursor=pointer]
        - generic [ref=e108]:
          - generic [ref=e109]: ◈ Section Cut Plane
          - checkbox "◈ Section Cut Plane" [ref=e110] [cursor=pointer]
      - generic [ref=e111]:
        - generic [ref=e112]:
          - generic [ref=e113]: VIEW CONTROLS
          - generic [ref=e114]: ▱
        - generic [ref=e115]:
          - button "Perspective" [ref=e116] [cursor=pointer]
          - button "North" [ref=e117] [cursor=pointer]
          - button "East" [ref=e118] [cursor=pointer]
          - button "Top" [ref=e119] [cursor=pointer]
          - button "Interior" [ref=e120] [cursor=pointer]
          - button "Reset" [ref=e121] [cursor=pointer]
    - generic [ref=e122]:
      - generic [ref=e123]:
        - generic [ref=e124]:
          - generic: Khafre original casing envelope — Petrie mean · RECONSTRUCTED
          - generic [ref=e130]:
            - generic [ref=e131]: FIELD ORIGIN
            - generic [ref=e132]: WGS84 context anchor · Z datum unresolved
        - button "Inspect / layers" [ref=e134] [cursor=pointer]: Inspect / layers ▾
        - generic: PERSPECTIVE · ASSEMBLED
        - button "Explode" [ref=e136] [cursor=pointer]: Explode ▾
        - generic [ref=e137]: DRAG ROTATE · WHEEL ZOOM · RIGHT-DRAG PAN · CLICK SELECT
      - generic [ref=e138]:
        - generic [ref=e139]:
          - text: QUICK VIEWS
          - button "Hieroglyphs · Inscription Lab" [ref=e140] [cursor=pointer]
          - button "Expand viewer" [ref=e141] [cursor=pointer]
        - generic [ref=e142]:
          - button "Sphinx" [ref=e143] [cursor=pointer]:
            - generic [ref=e145]: 3D
          - button "Full Pyramid" [active] [pressed] [ref=e147] [cursor=pointer]
          - button "Exploded" [ref=e150] [cursor=pointer]
          - button "Interior" [ref=e153] [cursor=pointer]
          - button "Underground" [ref=e156] [cursor=pointer]:
            - generic [ref=e158]: 3D
          - button "Cross Section" [ref=e160] [cursor=pointer]
          - button "Burial Chamber" [ref=e163] [cursor=pointer]
          - button "Sarcophagus" [ref=e166] [cursor=pointer]
          - button "Lower Chamber" [ref=e169] [cursor=pointer]
          - button "Sarcophagus Lid" [ref=e172] [cursor=pointer]
          - button "Roof & Chamber" [ref=e175] [cursor=pointer]
          - button "Upper Passage" [ref=e178] [cursor=pointer]
          - button "Portcullis" [ref=e181] [cursor=pointer]:
            - generic [ref=e183]: 3D
          - button "Plateau View" [ref=e185] [cursor=pointer]:
            - generic [ref=e187]: 3D
    - complementary [ref=e189]:
      - generic [ref=e190]:
        - generic [ref=e191]:
          - generic [ref=e192]: OBJECT INSPECTOR
          - generic [ref=e193]: DERIVED
        - heading "Khafre pyramid envelope" [level=2] [ref=e194]
        - generic [ref=e195]: Khafre original casing envelope — Petrie mean
      - generic [ref=e196]:
        - generic [ref=e197]:
          - button "OVERVIEW" [ref=e198] [cursor=pointer]
          - button "SPECS" [ref=e199] [cursor=pointer]
          - button "PHOTOS" [ref=e200] [cursor=pointer]
          - button "EVIDENCE" [ref=e201] [cursor=pointer]
          - button "CANON" [ref=e202] [cursor=pointer]
          - button "FIELD" [ref=e203] [cursor=pointer]
          - button "SIMULATION" [ref=e204] [cursor=pointer]
          - button "FINDINGS" [ref=e205] [cursor=pointer]
        - generic [ref=e206]:
          - img "Pyramid of Khafre — exterior" [ref=e207]
          - generic [ref=e208]:
            - button "‹" [ref=e209] [cursor=pointer]
            - generic [ref=e210]: 1 / 8
            - button "›" [ref=e211] [cursor=pointer]
        - generic [ref=e212]:
          - paragraph [ref=e213]: The reconstructed original geometric envelope of Khafre’s pyramid — the clean outer form before later erosion and casing loss.
          - generic [ref=e214]:
            - generic [ref=e215]:
              - generic [ref=e216]: Material
              - generic [ref=e217]: mat.limestone.local
            - generic [ref=e218]:
              - generic [ref=e219]: Placement
              - generic [ref=e220]: asm.surface
            - generic [ref=e221]:
              - generic [ref=e222]: Provenance
              - generic [ref=e223]: DERIVED
            - generic [ref=e224]:
              - generic [ref=e225]: Revision
              - generic [ref=e226]: rev.0003
            - generic [ref=e227]:
              - generic [ref=e228]: Evidence maturity
              - generic [ref=e229]: E3 · SURVEY_CONSTRAINED
            - generic [ref=e230]:
              - generic [ref=e231]: Evidence receipts
              - generic [ref=e232]: "5"
            - generic [ref=e233]:
              - generic [ref=e234]: CANON source map
              - generic [ref=e235]: "6"
          - generic [ref=e236]:
            - text: WHY IT IS IN THE MODEL
            - paragraph [ref=e237]: Its dimensions come from historical survey measurements and surviving architectural evidence, not from the controversial deep-structure claims.
        - generic [ref=e238]:
          - button "▣ View in Context" [ref=e239] [cursor=pointer]
          - button "◉ Isolate" [ref=e240] [cursor=pointer]
          - button "⌖ Measurements" [ref=e241] [cursor=pointer]
      - generic [ref=e242]:
        - generic [ref=e243]:
          - text: RELATED COMPONENTS
          - generic [ref=e244]: "2"
        - generic [ref=e245]:
          - button "3D Artificially leveled plateau reference" [ref=e246] [cursor=pointer]:
            - generic [ref=e247]: 3D
            - generic [ref=e249]: Artificially leveled plateau reference
          - button "Lowest granite casing belt — measured SW course" [ref=e250] [cursor=pointer]
      - generic [ref=e253]:
        - generic [ref=e254]: ANIMATION & ANALYSIS
        - generic [ref=e255]:
          - generic [ref=e256]: Overview camera speed
          - slider "Overview camera speed" [ref=e257]: "1"
          - generic [ref=e258]: 1.00x
        - generic [ref=e259]:
          - generic [ref=e260]:
            - checkbox "Show Labels" [checked] [ref=e261]
            - text: Show Labels
          - generic [ref=e262]:
            - checkbox "Show Dimensions" [ref=e263]
            - text: Show Dimensions
          - generic [ref=e264]:
            - checkbox "Show Photos" [checked] [ref=e265]
            - text: Show Photos
  - contentinfo [ref=e266]:
    - generic [ref=e267]: "DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP"
    - generic [ref=e268]: △ GIZA // NEXUS · v0.11.1 · KHAFRE · 56 KEY STRUCTURES
    - generic [ref=e269]: "● STATUS: READY"
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | test('overview layer requests render underground, respect authority and filter inspection',async({page})=>{
  3  |   await page.goto('/?layerDiagnostics=1');
  4  |   const canvas=page.locator('canvas').first();await expect(canvas).toBeVisible();
  5  |   const ids=async()=>JSON.parse(await canvas.getAttribute('data-layer-diagnostics')??'{"ids":[]}').ids as string[];
  6  |   const underground=async()=>(await ids()).filter(id=>id.startsWith('part.shaft.')).length;
  7  |   await expect(page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true})).not.toBeChecked();await expect.poll(underground).toBe(0);
  8  |   await page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true}).check();await expect.poll(underground).toBe(8);
  9  |   await page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true}).uncheck();await expect.poll(underground).toBe(0);
  10 |   await page.getByRole('button',{name:'Underground',exact:true}).click();await expect.poll(underground).toBe(8);
  11 |   await page.getByRole('button',{name:'Inspect / layers',exact:true}).hover();await page.getByText('Reality layers',{exact:true}).click();await page.getByRole('checkbox',{name:'HYPOTHESIS',exact:true}).uncheck();await expect.poll(underground).toBe(0);
  12 |   await expect(page.getByText(/Subterranean layer is enabled but hidden/)).toBeVisible();await page.getByRole('button',{name:'Show hypothetical underground'}).click();await expect.poll(underground).toBe(8);
  13 |   await page.getByRole('checkbox',{name:'Exterior (Current)',exact:true}).uncheck();await expect.poll(async()=>(await ids()).includes('part.pyramid.khafre')).toBe(false);await expect.poll(async()=>JSON.parse((await canvas.getAttribute('data-layer-diagnostics'))!).instanced).toBe(0);
  14 |   await page.getByRole('checkbox',{name:'Internal Architecture',exact:true}).uncheck();await page.getByRole('button',{name:'Inspect / layers',exact:true}).hover();await page.getByRole('button',{name:'Remove shell / inspect inside'}).click();await expect.poll(async()=>(await ids()).length).toBe(0);
  15 |   await page.getByRole('checkbox',{name:'Internal Architecture',exact:true}).check();await expect.poll(async()=>(await ids()).some(id=>id.startsWith('part.burial.'))).toBe(true);await expect.poll(underground).toBe(0);
  16 |   await page.getByRole('button',{name:'Inspect / layers',exact:true}).hover();await page.getByRole('button',{name:'Restore shell',exact:true}).click();await page.getByRole('checkbox',{name:'Surrounding Terrain',exact:true}).uncheck();await expect.poll(async()=>(await ids()).includes('part.plateau.reference')).toBe(false);
  17 |   await page.getByRole('checkbox',{name:'Casing Stones',exact:true}).uncheck();await expect.poll(async()=>(await ids()).includes('part.casing.granite.lower')).toBe(false);
  18 | });
  19 | test('overview overlays and detail controls match their scope',async({page})=>{
  20 |   await page.goto('/?layerDiagnostics=1');
  21 |   await page.getByRole('button',{name:'Full Pyramid',exact:true}).click();
> 22 |   await page.getByRole('checkbox',{name:'Show Dimensions',exact:true}).check();
     |                                                                        ^ Error: locator.check: Test timeout of 60000ms exceeded.
  23 |   await page.getByRole('button',{name:'Inspect / layers',exact:true}).hover();
  24 |   await expect(page.getByText('Selected preview dimensions',{exact:true})).toBeVisible();
  25 |   await page.getByRole('checkbox',{name:'Measurement Overlays',exact:true}).uncheck();
  26 |   await expect(page.getByText('Selected preview dimensions',{exact:true})).toHaveCount(0);
  27 |   await page.getByRole('checkbox',{name:'Measurement Overlays',exact:true}).check();
  28 |   await page.getByRole('button',{name:'Inspect / layers',exact:true}).hover();
  29 |   await expect(page.getByText('Selected preview dimensions',{exact:true})).toBeVisible();
  30 |   await page.getByRole('checkbox',{name:'Reference Photos',exact:true}).uncheck();
  31 |   await expect(page.locator('.thumb img')).toHaveCount(0);
  32 |   await page.getByRole('checkbox',{name:'Reference Photos',exact:true}).check();
  33 |   await expect.poll(()=>page.locator('.thumb img').count()).toBeGreaterThan(0);
  34 |   await page.getByRole('button',{name:'Upper Passage',exact:true}).click();
  35 |   await expect(page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true})).toBeDisabled();
  36 |   await page.getByRole('button',{name:'Return to model layers',exact:true}).click();
  37 |   await expect(page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true})).toBeEnabled();
  38 |   await page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true}).focus();
  39 |   await page.keyboard.press('Space');
  40 |   await expect(page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true})).toBeChecked();
  41 | });
  42 | 
```