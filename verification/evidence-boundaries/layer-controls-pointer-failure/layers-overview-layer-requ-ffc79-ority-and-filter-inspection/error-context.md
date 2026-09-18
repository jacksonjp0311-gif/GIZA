# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: layers.spec.ts >> overview layer requests render underground, respect authority and filter inspection
- Location: tests\browser\layers.spec.ts:2:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.check: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('checkbox', { name: 'Subterranean (Unverified)', exact: true })
    - locator resolved to <input type="checkbox" aria-label="Subterranean (Unverified)"/>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <span class="layerName">◈ Subterranean (Unverified)</span> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <span class="layerName">◈ Subterranean (Unverified)</span> intercepts pointer events
    - retrying click action
      - waiting 100ms
    127 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
        - done scrolling
        - <span class="layerName">◈ Subterranean (Unverified)</span> intercepts pointer events
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
          - checkbox "Exterior (Current)" [checked]
        - generic [ref=e76]:
          - generic [ref=e77]: ◈ Casing Stones
          - checkbox "Casing Stones" [checked]
        - generic [ref=e79]:
          - generic [ref=e80]: ◈ Internal Architecture
          - checkbox "Internal Architecture" [checked]
        - generic [ref=e82]:
          - generic [ref=e83]: ◈ Subterranean (Unverified)
          - checkbox "Subterranean (Unverified)"
        - generic [ref=e85]:
          - generic [ref=e86]: ◈ Surrounding Terrain
          - checkbox "Surrounding Terrain" [checked]
        - generic [ref=e88]:
          - generic [ref=e89]: ◈ Reference Photos
          - checkbox "Reference Photos" [checked]
        - generic [ref=e91]:
          - generic [ref=e92]: ◈ Measurement Overlays
          - checkbox "Measurement Overlays" [checked]
        - generic [ref=e94]:
          - generic [ref=e95]: ◈ Block / Slab Detail
          - checkbox "Block / Slab Detail" [checked]
        - generic [ref=e97]:
          - generic [ref=e98]: ◈ X-Ray Mode
          - checkbox "X-Ray Mode"
        - generic [ref=e100]:
          - generic [ref=e101]: ◈ FIELD Registration
          - checkbox "FIELD Registration" [checked]
        - generic [ref=e103]:
          - generic [ref=e104]: ◈ Section Cut Plane
          - checkbox "◈ Section Cut Plane"
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
        - generic [ref=e128]:
          - button "Remove shell / inspect inside" [ref=e129] [cursor=pointer]
          - group [ref=e130]:
            - generic "Reality layers" [ref=e131] [cursor=pointer]
        - generic: PERSPECTIVE · ASSEMBLED
        - generic [ref=e132]:
          - generic [ref=e133]:
            - generic [ref=e134]: EXPLOSION DISTANCE
            - generic [ref=e135]: 0%
          - slider "Explosion distance" [ref=e136]: "0"
          - button "ASSEMBLE" [ref=e137] [cursor=pointer]
        - generic [ref=e138]: DRAG ROTATE · WHEEL ZOOM · RIGHT-DRAG PAN · CLICK SELECT
      - generic [ref=e139]:
        - generic [ref=e140]:
          - text: QUICK VIEWS
          - button "Hieroglyphs · Inscription Lab" [ref=e141] [cursor=pointer]
          - button "Expand viewer" [ref=e142] [cursor=pointer]
        - generic [ref=e143]:
          - button "3D Sphinx" [ref=e144] [cursor=pointer]:
            - generic [ref=e145]: 3D
            - generic [ref=e147]: Sphinx
          - button "Full Pyramid" [pressed] [ref=e148] [cursor=pointer]
          - button "Exploded" [ref=e151] [cursor=pointer]
          - button "Interior" [ref=e154] [cursor=pointer]
          - button "3D Underground" [ref=e157] [cursor=pointer]:
            - generic [ref=e158]: 3D
            - generic [ref=e160]: Underground
          - button "Cross Section" [ref=e161] [cursor=pointer]
          - button "Burial Chamber" [ref=e164] [cursor=pointer]
          - button "Sarcophagus" [ref=e167] [cursor=pointer]
          - button "Lower Chamber" [ref=e170] [cursor=pointer]
          - button "Sarcophagus Lid" [ref=e173] [cursor=pointer]
          - button "Roof & Chamber" [ref=e176] [cursor=pointer]
          - button "Upper Passage" [ref=e179] [cursor=pointer]
          - button "3D Portcullis" [ref=e182] [cursor=pointer]:
            - generic [ref=e183]: 3D
            - generic [ref=e185]: Portcullis
          - button "3D Plateau View" [ref=e186] [cursor=pointer]:
            - generic [ref=e187]: 3D
            - generic [ref=e189]: Plateau View
    - complementary [ref=e190]:
      - generic [ref=e191]:
        - generic [ref=e192]:
          - generic [ref=e193]: OBJECT INSPECTOR
          - generic [ref=e194]: DERIVED
        - heading "Khafre pyramid envelope" [level=2] [ref=e195]
        - generic [ref=e196]: Khafre original casing envelope — Petrie mean
      - generic [ref=e197]:
        - generic [ref=e198]:
          - button "OVERVIEW" [ref=e199] [cursor=pointer]
          - button "SPECS" [ref=e200] [cursor=pointer]
          - button "PHOTOS" [ref=e201] [cursor=pointer]
          - button "EVIDENCE" [ref=e202] [cursor=pointer]
          - button "CANON" [ref=e203] [cursor=pointer]
          - button "FIELD" [ref=e204] [cursor=pointer]
          - button "SIMULATION" [ref=e205] [cursor=pointer]
          - button "FINDINGS" [ref=e206] [cursor=pointer]
        - generic [ref=e207]:
          - img "Pyramid of Khafre — exterior" [ref=e208]
          - generic [ref=e209]:
            - button "‹" [ref=e210] [cursor=pointer]
            - generic [ref=e211]: 1 / 8
            - button "›" [ref=e212] [cursor=pointer]
        - generic [ref=e213]:
          - paragraph [ref=e214]: The reconstructed original geometric envelope of Khafre’s pyramid — the clean outer form before later erosion and casing loss.
          - generic [ref=e215]:
            - generic [ref=e216]:
              - generic [ref=e217]: Material
              - generic [ref=e218]: mat.limestone.local
            - generic [ref=e219]:
              - generic [ref=e220]: Placement
              - generic [ref=e221]: asm.surface
            - generic [ref=e222]:
              - generic [ref=e223]: Provenance
              - generic [ref=e224]: DERIVED
            - generic [ref=e225]:
              - generic [ref=e226]: Revision
              - generic [ref=e227]: rev.0003
            - generic [ref=e228]:
              - generic [ref=e229]: Evidence maturity
              - generic [ref=e230]: E3 · SURVEY_CONSTRAINED
            - generic [ref=e231]:
              - generic [ref=e232]: Evidence receipts
              - generic [ref=e233]: "5"
            - generic [ref=e234]:
              - generic [ref=e235]: CANON source map
              - generic [ref=e236]: "6"
          - generic [ref=e237]:
            - text: WHY IT IS IN THE MODEL
            - paragraph [ref=e238]: Its dimensions come from historical survey measurements and surviving architectural evidence, not from the controversial deep-structure claims.
        - generic [ref=e239]:
          - button "▣ View in Context" [ref=e240] [cursor=pointer]
          - button "◉ Isolate" [ref=e241] [cursor=pointer]
          - button "⌖ Measurements" [ref=e242] [cursor=pointer]
      - generic [ref=e243]:
        - generic [ref=e244]:
          - text: RELATED COMPONENTS
          - generic [ref=e245]: "2"
        - generic [ref=e246]:
          - button "3D Artificially leveled plateau reference" [ref=e247] [cursor=pointer]:
            - generic [ref=e248]: 3D
            - generic [ref=e250]: Artificially leveled plateau reference
          - button "Lowest granite casing belt — measured SW course" [ref=e251] [cursor=pointer]
      - generic [ref=e254]:
        - generic [ref=e255]: ANIMATION & ANALYSIS
        - generic [ref=e256]:
          - generic [ref=e257]: Overview camera speed
          - slider "Overview camera speed" [ref=e258]: "1"
          - generic [ref=e259]: 1.00x
        - generic [ref=e260]:
          - generic [ref=e261]:
            - checkbox "Show Labels" [checked] [ref=e262]
            - text: Show Labels
          - generic [ref=e263]:
            - checkbox "Show Dimensions" [ref=e264]
            - text: Show Dimensions
          - generic [ref=e265]:
            - checkbox "Show Photos" [checked] [ref=e266]
            - text: Show Photos
  - contentinfo [ref=e267]:
    - generic [ref=e268]: "DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP"
    - generic [ref=e269]: △ GIZA // NEXUS · v0.11.1 · KHAFRE · 56 KEY STRUCTURES
    - generic [ref=e270]: "● STATUS: READY"
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
> 8  |   await page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true}).check();await expect.poll(underground).toBe(8);
     |                                                                                  ^ Error: locator.check: Test timeout of 60000ms exceeded.
  9  |   await page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true}).uncheck();await expect.poll(underground).toBe(0);
  10 |   await page.getByRole('button',{name:'Underground',exact:true}).click();await expect.poll(underground).toBe(8);
  11 |   await page.getByText('Reality layers',{exact:true}).click();await page.getByRole('checkbox',{name:'HYPOTHESIS',exact:true}).uncheck();await expect.poll(underground).toBe(0);
  12 |   await expect(page.getByText(/Subterranean layer is enabled but hidden/)).toBeVisible();await page.getByRole('button',{name:'Show hypothetical underground'}).click();await expect.poll(underground).toBe(8);
  13 |   await page.getByRole('checkbox',{name:'Exterior (Current)',exact:true}).uncheck();await expect.poll(async()=>(await ids()).includes('part.pyramid.khafre')).toBe(false);await expect.poll(async()=>JSON.parse((await canvas.getAttribute('data-layer-diagnostics'))!).instanced).toBe(0);
  14 |   await page.getByRole('checkbox',{name:'Internal Architecture',exact:true}).uncheck();await page.getByRole('button',{name:'Remove shell / inspect inside'}).click();await expect.poll(async()=>(await ids()).length).toBe(0);
  15 |   await page.getByRole('checkbox',{name:'Internal Architecture',exact:true}).check();await expect.poll(async()=>(await ids()).some(id=>id.startsWith('part.burial.'))).toBe(true);await expect.poll(underground).toBe(0);
  16 |   await page.getByRole('button',{name:'Restore shell',exact:true}).click();await page.getByRole('checkbox',{name:'Surrounding Terrain',exact:true}).uncheck();await expect.poll(async()=>(await ids()).includes('part.plateau.reference')).toBe(false);
  17 |   await page.getByRole('checkbox',{name:'Casing Stones',exact:true}).uncheck();await expect.poll(async()=>(await ids()).includes('part.casing.granite.lower')).toBe(false);
  18 | });
  19 | 
```