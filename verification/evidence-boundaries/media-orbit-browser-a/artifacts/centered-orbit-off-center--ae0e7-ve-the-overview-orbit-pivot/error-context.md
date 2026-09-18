# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: centered-orbit.spec.ts >> off-center wheel zoom and real drag preserve the overview orbit pivot
- Location: tests\browser\centered-orbit.spec.ts:2:1

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 3

  Array [
-   6.430227343029549,
-   -18.84242352320531,
-   34.18556277565479,
+   6.433825455984182,
+   -18.829311860763948,
+   34.202289120250946,
  ]
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
    - complementary [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - generic [ref=e29]: PROJECT EXPLORER
          - generic [ref=e30]: ▱
        - generic [ref=e31]:
          - text: ⌕
          - textbox "Find a component" [ref=e32]:
            - /placeholder: Find chamber, slab, passage…
        - generic [ref=e33]:
          - generic [ref=e34]: ⌄ Giza Plateau
          - button "› Khufu (Context)" [ref=e35] [cursor=pointer]:
            - text: ›
            - generic [ref=e36]: Khufu (Context)
          - button "⌄ Khafre (Active) ◉" [ref=e37] [cursor=pointer]:
            - text: ⌄
            - generic [ref=e38]: Khafre (Active)
            - generic [ref=e39]: ◉
          - button "› Menkaure" [ref=e40] [cursor=pointer]:
            - text: ›
            - generic [ref=e41]: Menkaure
          - button "› Sphinx 3D" [ref=e42] [cursor=pointer]:
            - text: ›
            - generic [ref=e43]: Sphinx
            - generic [ref=e44]: 3D
          - button "› Valley Temple" [ref=e45] [cursor=pointer]:
            - text: ›
            - generic [ref=e46]: Valley Temple
          - button "› Causeway" [ref=e47] [cursor=pointer]:
            - text: ›
            - generic [ref=e48]: Causeway
          - button "› Mastabas & Tombs" [ref=e49] [cursor=pointer]:
            - text: ›
            - generic [ref=e50]: Mastabas & Tombs
          - button "› Room / Threshold Graph MAP" [ref=e51] [cursor=pointer]:
            - text: ›
            - generic [ref=e52]: Room / Threshold Graph
            - generic [ref=e53]: MAP
          - button "› Survey Data MAP" [ref=e54] [cursor=pointer]:
            - text: ›
            - generic [ref=e55]: Survey Data
            - generic [ref=e56]: MAP
          - button "› Historical Maps MAP" [ref=e57] [cursor=pointer]:
            - text: ›
            - generic [ref=e58]: Historical Maps
            - generic [ref=e59]: MAP
          - button "› Plateau / Terrain MAP" [ref=e60] [cursor=pointer]:
            - text: ›
            - generic [ref=e61]: Plateau / Terrain
            - generic [ref=e62]: MAP
          - button "› Open Source Photos MAP" [ref=e63] [cursor=pointer]:
            - text: ›
            - generic [ref=e64]: Open Source Photos
            - generic [ref=e65]: MAP
          - button "› Intent Reconstruction MAP" [ref=e66] [cursor=pointer]:
            - text: ›
            - generic [ref=e67]: Intent Reconstruction
            - generic [ref=e68]: MAP
      - generic [ref=e69]:
        - generic [ref=e70]:
          - generic [ref=e71]: MODEL LAYERS
          - generic [ref=e72]: ▱
        - generic [ref=e73]:
          - generic [ref=e74]: ◈ Exterior (Current)
          - checkbox "Exterior (Current)" [checked] [ref=e75] [cursor=pointer]
        - generic [ref=e76]:
          - generic [ref=e77]: ◈ Casing Stones
          - checkbox "Casing Stones" [checked] [ref=e78] [cursor=pointer]
        - generic [ref=e79]:
          - generic [ref=e80]: ◈ Internal Architecture
          - checkbox "Internal Architecture" [checked] [ref=e81] [cursor=pointer]
        - generic [ref=e82]:
          - generic [ref=e83]: ◈ Subterranean (Unverified)
          - checkbox "Subterranean (Unverified)" [ref=e84] [cursor=pointer]
        - generic [ref=e85]:
          - generic [ref=e86]: ◈ Surrounding Terrain
          - checkbox "Surrounding Terrain" [checked] [ref=e87] [cursor=pointer]
        - generic [ref=e88]:
          - generic [ref=e89]: ◈ Reference Photos
          - checkbox "Reference Photos" [checked] [ref=e90] [cursor=pointer]
        - generic [ref=e91]:
          - generic [ref=e92]: ◈ Measurement Overlays
          - checkbox "Measurement Overlays" [checked] [ref=e93] [cursor=pointer]
        - generic [ref=e94]:
          - generic [ref=e95]: ◈ Block / Slab Detail
          - checkbox "Block / Slab Detail" [checked] [ref=e96] [cursor=pointer]
        - generic [ref=e97]:
          - generic [ref=e98]: ◈ X-Ray Mode
          - checkbox "X-Ray Mode" [ref=e99] [cursor=pointer]
        - generic [ref=e100]:
          - generic [ref=e101]: ◈ FIELD Registration
          - checkbox "FIELD Registration" [checked] [ref=e102] [cursor=pointer]
        - generic [ref=e103]:
          - generic [ref=e104]: ◈ Section Cut Plane
          - checkbox "◈ Section Cut Plane" [ref=e105] [cursor=pointer]
      - generic [ref=e106]:
        - generic [ref=e107]:
          - generic [ref=e108]: VIEW CONTROLS
          - generic [ref=e109]: ▱
        - generic [ref=e110]:
          - button "Perspective" [ref=e111] [cursor=pointer]
          - button "North" [ref=e112] [cursor=pointer]
          - button "East" [ref=e113] [cursor=pointer]
          - button "Top" [ref=e114] [cursor=pointer]
          - button "Interior" [ref=e115] [cursor=pointer]
          - button "Reset" [ref=e116] [cursor=pointer]
    - generic [ref=e117]:
      - generic [ref=e118]:
        - generic [ref=e119]:
          - generic: Khafre original casing envelope — Petrie mean · RECONSTRUCTED
          - generic [ref=e125]:
            - generic [ref=e126]: FIELD ORIGIN
            - generic [ref=e127]: WGS84 context anchor · Z datum unresolved
        - button "Inspect / layers" [ref=e129] [cursor=pointer]: Inspect / layers ▾
        - generic: PERSPECTIVE · ASSEMBLED
        - button "Explode" [ref=e131] [cursor=pointer]: Explode ▾
        - generic [ref=e132]: DRAG ROTATE · WHEEL ZOOM · RIGHT-DRAG PAN · CLICK SELECT
      - generic [ref=e133]:
        - generic [ref=e134]:
          - text: QUICK VIEWS
          - button "Hieroglyphs · Inscription Lab" [ref=e135] [cursor=pointer]
          - button "Expand viewer" [ref=e136] [cursor=pointer]
        - generic [ref=e137]:
          - button "Sphinx" [ref=e138] [cursor=pointer]:
            - generic [ref=e140]: 3D
          - button "Full Pyramid" [pressed] [ref=e142] [cursor=pointer]
          - button "Exploded" [ref=e145] [cursor=pointer]
          - button "Interior" [ref=e148] [cursor=pointer]
          - button "Underground" [ref=e151] [cursor=pointer]:
            - generic [ref=e153]: 3D
          - button "Cross Section" [ref=e155] [cursor=pointer]
          - button "Burial Chamber" [ref=e158] [cursor=pointer]
          - button "Sarcophagus" [ref=e161] [cursor=pointer]
          - button "Lower Chamber" [ref=e164] [cursor=pointer]
          - button "Sarcophagus Lid" [ref=e167] [cursor=pointer]
          - button "Roof & Chamber" [ref=e170] [cursor=pointer]
          - button "Upper Passage" [ref=e173] [cursor=pointer]
          - button "Portcullis" [ref=e176] [cursor=pointer]:
            - generic [ref=e178]: 3D
          - button "Plateau View" [ref=e180] [cursor=pointer]:
            - generic [ref=e182]: 3D
    - complementary [ref=e184]:
      - generic [ref=e185]:
        - generic [ref=e186]:
          - generic [ref=e187]: OBJECT INSPECTOR
          - generic [ref=e188]: DERIVED
        - heading "Khafre pyramid envelope" [level=2] [ref=e189]
        - generic [ref=e190]: Khafre original casing envelope — Petrie mean
      - generic [ref=e191]:
        - generic [ref=e192]:
          - button "OVERVIEW" [ref=e193] [cursor=pointer]
          - button "SPECS" [ref=e194] [cursor=pointer]
          - button "PHOTOS" [ref=e195] [cursor=pointer]
          - button "EVIDENCE" [ref=e196] [cursor=pointer]
          - button "CANON" [ref=e197] [cursor=pointer]
          - button "FIELD" [ref=e198] [cursor=pointer]
          - button "SIMULATION" [ref=e199] [cursor=pointer]
          - button "FINDINGS" [ref=e200] [cursor=pointer]
        - generic [ref=e201]:
          - img "Pyramid of Khafre — exterior" [ref=e202]
          - generic [ref=e203]:
            - button "‹" [ref=e204] [cursor=pointer]
            - generic [ref=e205]: 1 / 8
            - button "›" [ref=e206] [cursor=pointer]
        - generic [ref=e207]:
          - paragraph [ref=e208]: The reconstructed original geometric envelope of Khafre’s pyramid — the clean outer form before later erosion and casing loss.
          - generic [ref=e209]:
            - generic [ref=e210]:
              - generic [ref=e211]: Material
              - generic [ref=e212]: mat.limestone.local
            - generic [ref=e213]:
              - generic [ref=e214]: Placement
              - generic [ref=e215]: asm.surface
            - generic [ref=e216]:
              - generic [ref=e217]: Provenance
              - generic [ref=e218]: DERIVED
            - generic [ref=e219]:
              - generic [ref=e220]: Revision
              - generic [ref=e221]: rev.0003
            - generic [ref=e222]:
              - generic [ref=e223]: Evidence maturity
              - generic [ref=e224]: E3 · SURVEY_CONSTRAINED
            - generic [ref=e225]:
              - generic [ref=e226]: Evidence receipts
              - generic [ref=e227]: "5"
            - generic [ref=e228]:
              - generic [ref=e229]: CANON source map
              - generic [ref=e230]: "6"
          - generic [ref=e231]:
            - text: WHY IT IS IN THE MODEL
            - paragraph [ref=e232]: Its dimensions come from historical survey measurements and surviving architectural evidence, not from the controversial deep-structure claims.
        - generic [ref=e233]:
          - button "▣ View in Context" [ref=e234] [cursor=pointer]
          - button "◉ Isolate" [ref=e235] [cursor=pointer]
          - button "⌖ Measurements" [ref=e236] [cursor=pointer]
      - generic [ref=e237]:
        - generic [ref=e238]:
          - text: RELATED COMPONENTS
          - generic [ref=e239]: "2"
        - generic [ref=e240]:
          - button "3D Artificially leveled plateau reference" [ref=e241] [cursor=pointer]:
            - generic [ref=e242]: 3D
            - generic [ref=e244]: Artificially leveled plateau reference
          - button "Lowest granite casing belt — measured SW course" [ref=e245] [cursor=pointer]
      - generic [ref=e248]:
        - generic [ref=e249]: ANIMATION & ANALYSIS
        - generic [ref=e250]:
          - generic [ref=e251]: Overview camera speed
          - slider "Overview camera speed" [ref=e252]: "1"
          - generic [ref=e253]: 1.00x
        - generic [ref=e254]:
          - generic [ref=e255]:
            - checkbox "Show Labels" [checked] [ref=e256]
            - text: Show Labels
          - generic [ref=e257]:
            - checkbox "Show Dimensions" [ref=e258]
            - text: Show Dimensions
          - generic [ref=e259]:
            - checkbox "Show Photos" [checked] [ref=e260]
            - text: Show Photos
  - contentinfo [ref=e261]:
    - generic [ref=e262]: "DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP"
    - generic [ref=e263]: △ GIZA // NEXUS · v0.11.1 · KHAFRE · 56 KEY STRUCTURES
    - generic [ref=e264]: "● STATUS: READY"
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | test('off-center wheel zoom and real drag preserve the overview orbit pivot',async({page})=>{
  3  |   await page.goto('/?layerDiagnostics=1');
  4  |   const canvas=page.locator('canvas').first();
  5  |   const state=async()=>JSON.parse(await canvas.getAttribute('data-layer-diagnostics')??'{}');
  6  |   await expect.poll(async()=>(await state()).orbitTarget?.length).toBe(3);
  7  |   const before=await state(),box=(await canvas.boundingBox())!;
  8  |   await page.mouse.move(box.x+box.width*.75,box.y+box.height*.55);
  9  |   await page.mouse.wheel(0,-220);
  10 |   await expect.poll(async()=>Math.hypot(...(await state()).cameraPosition.map((n:number,i:number)=>n-before.cameraPosition[i]))).toBeGreaterThan(1);
> 11 |   expect((await state()).orbitTarget).toEqual(before.orbitTarget);
     |                                       ^ Error: expect(received).toEqual(expected) // deep equality
  12 |   await page.mouse.down();await page.mouse.move(box.x+box.width*.60,box.y+box.height*.58,{steps:12});await page.mouse.up();
  13 |   expect((await state()).orbitTarget).toEqual(before.orbitTarget);
  14 |   await page.getByRole('button',{name:'Full Pyramid',exact:true}).click();
  15 |   await page.getByRole('checkbox',{name:'Show Dimensions',exact:true}).check();
  16 |   await page.getByRole('button',{name:'Inspect / layers',exact:true}).hover();
  17 |   await expect(page.locator('.viewportDrawer.inspection .dimensionReadout')).toBeVisible();
  18 |   await page.mouse.move(box.x+box.width*.6,box.y+box.height*.6);
  19 |   await expect(page.getByText('Selected preview dimensions',{exact:true})).toBeHidden();
  20 | });
  21 | 
```