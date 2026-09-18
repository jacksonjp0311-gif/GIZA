# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: startup-camera.spec.ts >> startup centers assembled pyramid despite prior inspection 844
- Location: tests\browser\startup-camera.spec.ts:2:95

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.hover: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Explode', exact: true })
    - locator resolved to <button aria-expanded="true" class="viewportDrawerTab" aria-controls="viewport-explosion">…</button>
  - attempting hover action
    2 × waiting for element to be visible and stable
      - element is visible and stable
      - scrolling into view if needed
      - done scrolling
      - <nav class="surfaceSwitch" aria-label="Viewport surface">…</nav> from <header class="topbar edgeTop compactModelHeader">…</header> subtree intercepts pointer events
    - retrying hover action
    - waiting 20ms
    2 × waiting for element to be visible and stable
      - element is visible and stable
      - scrolling into view if needed
      - done scrolling
      - <nav class="surfaceSwitch" aria-label="Viewport surface">…</nav> from <header class="topbar edgeTop compactModelHeader">…</header> subtree intercepts pointer events
    - retrying hover action
      - waiting 100ms
    136 × waiting for element to be visible and stable
        - element is visible and stable
        - scrolling into view if needed
        - done scrolling
        - <nav class="surfaceSwitch" aria-label="Viewport surface">…</nav> from <header class="topbar edgeTop compactModelHeader">…</header> subtree intercepts pointer events
      - retrying hover action
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
  - main [ref=e18]:
    - complementary [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e21]:
          - generic [ref=e22]: PROJECT EXPLORER
          - generic [ref=e23]: ▱
        - generic [ref=e24]:
          - text: ⌕
          - textbox "Find a component" [ref=e25]:
            - /placeholder: Find chamber, slab, passage…
        - generic [ref=e26]:
          - generic [ref=e27]: ⌄ Giza Plateau
          - button "› Khufu (Context)" [ref=e28] [cursor=pointer]:
            - text: ›
            - generic [ref=e29]: Khufu (Context)
          - button "⌄ Khafre (Active) ◉" [ref=e30] [cursor=pointer]:
            - text: ⌄
            - generic [ref=e31]: Khafre (Active)
            - generic [ref=e32]: ◉
          - button "› Menkaure" [ref=e33] [cursor=pointer]:
            - text: ›
            - generic [ref=e34]: Menkaure
          - button "› Sphinx 3D" [ref=e35] [cursor=pointer]:
            - text: ›
            - generic [ref=e36]: Sphinx
            - generic [ref=e37]: 3D
          - button "› Valley Temple" [ref=e38] [cursor=pointer]:
            - text: ›
            - generic [ref=e39]: Valley Temple
          - button "› Causeway" [ref=e40] [cursor=pointer]:
            - text: ›
            - generic [ref=e41]: Causeway
          - button "› Mastabas & Tombs" [ref=e42] [cursor=pointer]:
            - text: ›
            - generic [ref=e43]: Mastabas & Tombs
          - button "› Room / Threshold Graph MAP" [ref=e44] [cursor=pointer]:
            - text: ›
            - generic [ref=e45]: Room / Threshold Graph
            - generic [ref=e46]: MAP
          - button "› Survey Data MAP" [ref=e47] [cursor=pointer]:
            - text: ›
            - generic [ref=e48]: Survey Data
            - generic [ref=e49]: MAP
          - button "› Historical Maps MAP" [ref=e50] [cursor=pointer]:
            - text: ›
            - generic [ref=e51]: Historical Maps
            - generic [ref=e52]: MAP
          - button "› Plateau / Terrain MAP" [ref=e53] [cursor=pointer]:
            - text: ›
            - generic [ref=e54]: Plateau / Terrain
            - generic [ref=e55]: MAP
          - button "› Open Source Photos MAP" [ref=e56] [cursor=pointer]:
            - text: ›
            - generic [ref=e57]: Open Source Photos
            - generic [ref=e58]: MAP
          - button "› Intent Reconstruction MAP" [ref=e59] [cursor=pointer]:
            - text: ›
            - generic [ref=e60]: Intent Reconstruction
            - generic [ref=e61]: MAP
      - generic [ref=e62]:
        - generic [ref=e63]:
          - generic [ref=e64]: MODEL LAYERS
          - generic [ref=e65]: ▱
        - generic [ref=e66]:
          - generic [ref=e67]: ◈ Exterior (Current)
          - checkbox "Exterior (Current)" [checked] [ref=e68] [cursor=pointer]
        - generic [ref=e69]:
          - generic [ref=e70]: ◈ Casing Stones
          - checkbox "Casing Stones" [checked] [ref=e71] [cursor=pointer]
        - generic [ref=e72]:
          - generic [ref=e73]: ◈ Internal Architecture
          - checkbox "Internal Architecture" [checked] [ref=e74] [cursor=pointer]
        - generic [ref=e75]:
          - generic [ref=e76]: ◈ Subterranean (Unverified)
          - checkbox "Subterranean (Unverified)" [ref=e77] [cursor=pointer]
        - generic [ref=e78]:
          - generic [ref=e79]: ◈ Surrounding Terrain
          - checkbox "Surrounding Terrain" [checked] [ref=e80] [cursor=pointer]
        - generic [ref=e81]:
          - generic [ref=e82]: ◈ Reference Photos
          - checkbox "Reference Photos" [checked] [ref=e83] [cursor=pointer]
        - generic [ref=e84]:
          - generic [ref=e85]: ◈ Measurement Overlays
          - checkbox "Measurement Overlays" [checked] [ref=e86] [cursor=pointer]
        - generic [ref=e87]:
          - generic [ref=e88]: ◈ Block / Slab Detail
          - checkbox "Block / Slab Detail" [checked] [ref=e89] [cursor=pointer]
        - generic [ref=e90]:
          - generic [ref=e91]: ◈ X-Ray Mode
          - checkbox "X-Ray Mode" [ref=e92] [cursor=pointer]
        - generic [ref=e93]:
          - generic [ref=e94]: ◈ FIELD Registration
          - checkbox "FIELD Registration" [checked] [ref=e95] [cursor=pointer]
        - generic [ref=e96]:
          - generic [ref=e97]: ◈ Section Cut Plane
          - checkbox "◈ Section Cut Plane" [ref=e98] [cursor=pointer]
      - generic [ref=e99]:
        - generic [ref=e100]:
          - generic [ref=e101]: VIEW CONTROLS
          - generic [ref=e102]: ▱
        - generic [ref=e103]:
          - button "Perspective" [ref=e104] [cursor=pointer]
          - button "North" [ref=e105] [cursor=pointer]
          - button "East" [ref=e106] [cursor=pointer]
          - button "Top" [ref=e107] [cursor=pointer]
          - button "Interior" [ref=e108] [cursor=pointer]
          - button "Reset" [ref=e109] [cursor=pointer]
    - generic [ref=e110]:
      - generic [ref=e111]:
        - generic [ref=e112]:
          - generic: Khafre original casing envelope — Petrie mean · RECONSTRUCTED
          - generic [ref=e118]:
            - generic [ref=e119]: FIELD ORIGIN
            - generic [ref=e120]: WGS84 context anchor · Z datum unresolved
        - button "Inspect / layers" [ref=e122] [cursor=pointer]: Inspect / layers ▾
        - generic: PERSPECTIVE · ASSEMBLED
        - generic [ref=e123]:
          - button "Explode" [expanded] [ref=e124] [cursor=pointer]: Explode ▴
          - generic [ref=e125]:
            - generic [ref=e126]:
              - generic [ref=e127]:
                - text: Stone arrangement
                - combobox "Stone arrangement" [ref=e128]:
                  - option "Course separation" [selected]
                  - option "Spherical expansion"
              - generic [ref=e129]:
                - generic [ref=e130]: EXPLOSION DISTANCE
                - generic [ref=e131]: 0%
              - slider "Explosion distance" [ref=e132]: "0"
              - button "ASSEMBLE" [ref=e133] [cursor=pointer]
            - button "Close explode" [ref=e134] [cursor=pointer]
        - generic [ref=e135]: DRAG ROTATE · WHEEL ZOOM · RIGHT-DRAG PAN · CLICK SELECT
      - generic [ref=e136]:
        - generic [ref=e137]:
          - text: QUICK VIEWS
          - button "Hieroglyphs · Inscription Lab" [ref=e138] [cursor=pointer]
          - button "Expand viewer" [ref=e139] [cursor=pointer]
        - generic [ref=e140]:
          - button "Sphinx" [ref=e141] [cursor=pointer]:
            - generic [ref=e143]: 3D
          - button "Full Pyramid" [pressed] [ref=e145] [cursor=pointer]
          - button "Exploded" [ref=e148] [cursor=pointer]
          - button "Interior" [ref=e151] [cursor=pointer]
          - button "Underground" [ref=e154] [cursor=pointer]:
            - generic [ref=e156]: 3D
          - button "Cross Section" [ref=e158] [cursor=pointer]
          - button "Burial Chamber" [ref=e161] [cursor=pointer]
          - button "Sarcophagus" [ref=e164] [cursor=pointer]
          - button "Lower Chamber" [ref=e167] [cursor=pointer]
          - button "Sarcophagus Lid" [ref=e170] [cursor=pointer]
          - button "Roof & Chamber" [ref=e173] [cursor=pointer]
          - button "Upper Passage" [ref=e176] [cursor=pointer]
          - button "Portcullis" [ref=e179] [cursor=pointer]:
            - generic [ref=e181]: 3D
          - button "Plateau View" [ref=e183] [cursor=pointer]:
            - generic [ref=e185]: 3D
  - contentinfo [ref=e187]:
    - generic [ref=e188]: "DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP"
    - generic [ref=e189]: △ GIZA // NEXUS · v0.11.1 · KHAFRE · 56 KEY STRUCTURES
    - generic [ref=e190]: "● STATUS: READY"
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | for(const viewport of [{width:1280,height:800},{width:390,height:844},{width:844,height:390}])test('startup centers assembled pyramid despite prior inspection '+viewport.width,async({page})=>{
  3  |   await page.setViewportSize(viewport);
  4  |   await page.addInitScript(()=>{
  5  |     localStorage.setItem('giza.nexus.workspace.v1',JSON.stringify({version:1,selectedId:'part.shaft.alpha.1',explode:2.75,sectionAxis:'Z',sectionPos:22,viewPreset:'UNDERGROUND',layers:{exterior:false,subsurface:true,xray:true,simulation:true}}));
  6  |     localStorage.setItem('giza.qa.research-preservation','untouched research sentinel');
  7  |   });
  8  |   await page.goto('/?layerDiagnostics=1');const canvas=page.locator('canvas').first();
  9  |   await page.getByRole('button',{name:'Explode',exact:true}).hover();await expect(page.getByRole('slider',{name:'Explosion distance',exact:true})).toHaveValue('0');
  10 |   await expect(page.getByRole('checkbox',{name:'Exterior (Current)',exact:true})).toBeChecked();
  11 |   await expect(page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true})).not.toBeChecked();
  12 |   const centered=async()=>{const p=JSON.parse(await canvas.getAttribute('data-layer-diagnostics')??'{}').pyramid;return !!p&&Math.abs(p.minX+p.maxX)<.015&&Math.abs(p.minY+p.maxY)<.015&&p.minX>-.82&&p.maxX<.82&&p.minY>-.82&&p.maxY<.82;};
  13 |   await expect.poll(centered).toBe(true);
  14 |   await page.screenshot({path:test.info().outputPath('centered-startup.png')});
> 15 |   await page.getByRole('button',{name:'Explode',exact:true}).hover();await page.getByRole('slider',{name:'Explosion distance',exact:true}).fill('2');await page.reload();
     |                                                              ^ Error: locator.hover: Test timeout of 60000ms exceeded.
  16 |   await page.getByRole('button',{name:'Explode',exact:true}).hover();await expect(page.getByRole('slider',{name:'Explosion distance',exact:true})).toHaveValue('0');await expect.poll(centered).toBe(true);
  17 |   expect(await page.evaluate(()=>localStorage.getItem('giza.qa.research-preservation'))).toBe('untouched research sentinel');
  18 | });
  19 | 
```