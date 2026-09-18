# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: startup-camera.spec.ts >> startup centers assembled pyramid despite prior inspection 1280
- Location: tests\browser\startup-camera.spec.ts:2:95

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator: getByRole('slider', { name: 'Explosion distance', exact: true })
Expected: "0"
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toHaveValue" getByRole('slider', { name: 'Explosion distance', exact: true }) with timeout 15000ms
  - waiting for getByRole('slider', { name: 'Explosion distance', exact: true })

```

```yaml
- banner:
  - img "GIZA NEXUS pyramid logo"
  - text: GIZA
  - emphasis: NEXUS
  - text: · v0.11.1
  - heading "KHAFRE / FULL PYRAMID" [level=1]
  - text: GIZA, EGYPT · 29.976000° N · 31.130969° E · c. 2570 BCE
  - navigation "Viewport surface":
    - button "3D MODEL" [pressed]
    - button "MAP ATLAS"
    - button "REGISTRATION"
  - text: 24 reconstructions 1 assumed 31 unverified
- main:
  - complementary:
    - text: PROJECT EXPLORER ▱ ⌕
    - textbox "Find a component":
      - /placeholder: Find chamber, slab, passage…
    - text: ⌄ Giza Plateau
    - button "› Khufu (Context)"
    - button "⌄ Khafre (Active) ◉"
    - button "› Menkaure"
    - button "› Sphinx 3D"
    - button "› Valley Temple"
    - button "› Causeway"
    - button "› Mastabas & Tombs"
    - button "› Room / Threshold Graph MAP"
    - button "› Survey Data MAP"
    - button "› Historical Maps MAP"
    - button "› Plateau / Terrain MAP"
    - button "› Open Source Photos MAP"
    - button "› Intent Reconstruction MAP"
    - text: MODEL LAYERS ▱ ◈ Exterior (Current)
    - checkbox "Exterior (Current)" [checked]
    - text: ◈ Casing Stones
    - checkbox "Casing Stones" [checked]
    - text: ◈ Internal Architecture
    - checkbox "Internal Architecture" [checked]
    - text: ◈ Subterranean (Unverified)
    - checkbox "Subterranean (Unverified)"
    - text: ◈ Surrounding Terrain
    - checkbox "Surrounding Terrain" [checked]
    - text: ◈ Reference Photos
    - checkbox "Reference Photos" [checked]
    - text: ◈ Measurement Overlays
    - checkbox "Measurement Overlays" [checked]
    - text: ◈ Block / Slab Detail
    - checkbox "Block / Slab Detail" [checked]
    - text: ◈ X-Ray Mode
    - checkbox "X-Ray Mode"
    - text: ◈ FIELD Registration
    - checkbox "FIELD Registration" [checked]
    - text: ◈ Section Cut Plane
    - checkbox "◈ Section Cut Plane"
    - text: VIEW CONTROLS ▱
    - button "Perspective"
    - button "North"
    - button "East"
    - button "Top"
    - button "Interior"
    - button "Reset"
  - text: Khafre original casing envelope — Petrie mean · RECONSTRUCTED FIELD ORIGIN WGS84 context anchor · Z datum unresolved
  - button "Inspect / layers"
  - text: PERSPECTIVE · ASSEMBLED
  - button "Explode"
  - text: DRAG ROTATE · WHEEL ZOOM · RIGHT-DRAG PAN · CLICK SELECT QUICK VIEWS
  - button "Hieroglyphs · Inscription Lab"
  - button "Expand viewer"
  - button "Sphinx"
  - button "Full Pyramid" [pressed]
  - button "Exploded"
  - button "Interior"
  - button "Underground"
  - button "Cross Section"
  - button "Burial Chamber"
  - button "Sarcophagus"
  - button "Lower Chamber"
  - button "Sarcophagus Lid"
  - button "Roof & Chamber"
  - button "Upper Passage"
  - button "Portcullis"
  - button "Plateau View"
  - complementary:
    - text: OBJECT INSPECTOR DERIVED
    - heading "Khafre pyramid envelope" [level=2]
    - text: Khafre original casing envelope — Petrie mean
    - button "OVERVIEW"
    - button "SPECS"
    - button "PHOTOS"
    - button "EVIDENCE"
    - button "CANON"
    - button "FIELD"
    - button "SIMULATION"
    - button "FINDINGS"
    - img "Pyramid of Khafre — exterior"
    - button "‹"
    - text: 1 / 8
    - button "›"
    - paragraph: The reconstructed original geometric envelope of Khafre’s pyramid — the clean outer form before later erosion and casing loss.
    - text: Material mat.limestone.local Placement asm.surface Provenance DERIVED Revision rev.0003 Evidence maturity E3 · SURVEY_CONSTRAINED Evidence receipts 5 CANON source map 6 WHY IT IS IN THE MODEL
    - paragraph: Its dimensions come from historical survey measurements and surviving architectural evidence, not from the controversial deep-structure claims.
    - button "▣ View in Context"
    - button "◉ Isolate"
    - button "⌖ Measurements"
    - text: RELATED COMPONENTS 2
    - button "3D Artificially leveled plateau reference"
    - button "Lowest granite casing belt — measured SW course"
    - text: ANIMATION & ANALYSIS Overview camera speed
    - slider "Overview camera speed": "1"
    - text: 1.00x
    - checkbox "Show Labels" [checked]
    - text: Show Labels
    - checkbox "Show Dimensions"
    - text: Show Dimensions
    - checkbox "Show Photos" [checked]
    - text: Show Photos
- contentinfo: "DATA SOURCES: Petrie · Hölscher · Digital Giza · Open Context · Commons · ScIDEP △ GIZA // NEXUS · v0.11.1 · KHAFRE · 56 KEY STRUCTURES ● STATUS: READY"
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
  15 |   await page.getByRole('button',{name:'Explode',exact:true}).hover();await page.getByRole('slider',{name:'Explosion distance',exact:true}).fill('2');await page.reload();
> 16 |   await expect(page.getByRole('slider',{name:'Explosion distance',exact:true})).toHaveValue('0');await expect.poll(centered).toBe(true);
     |                                                                                 ^ Error: expect(locator).toHaveValue(expected) failed
  17 |   expect(await page.evaluate(()=>localStorage.getItem('giza.qa.research-preservation'))).toBe('untouched research sentinel');
  18 | });
  19 | 
```