# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: layers.spec.ts >> overview overlays and detail controls match their scope
- Location: tests\browser\layers.spec.ts:19:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Selected preview dimensions', { exact: true })
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Selected preview dimensions', { exact: true }) with timeout 15000ms
  - waiting for getByText('Selected preview dimensions', { exact: true })

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
  - button "Remove shell / inspect inside"
  - group: Reality layers
  - text: PERSPECTIVE · ASSEMBLED EXPLOSION DISTANCE 0%
  - slider "Explosion distance": "0"
  - button "ASSEMBLE"
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
  2  | test('overview layer requests render underground, respect authority and filter inspection',async({page})=>{
  3  |   await page.goto('/?layerDiagnostics=1');
  4  |   const canvas=page.locator('canvas').first();await expect(canvas).toBeVisible();
  5  |   const ids=async()=>JSON.parse(await canvas.getAttribute('data-layer-diagnostics')??'{"ids":[]}').ids as string[];
  6  |   const underground=async()=>(await ids()).filter(id=>id.startsWith('part.shaft.')).length;
  7  |   await expect(page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true})).not.toBeChecked();await expect.poll(underground).toBe(0);
  8  |   await page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true}).check();await expect.poll(underground).toBe(8);
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
  19 | test('overview overlays and detail controls match their scope',async({page})=>{
  20 |   await page.goto('/?layerDiagnostics=1');
  21 |   await page.getByRole('button',{name:'Full Pyramid',exact:true}).click();
> 22 |   await expect(page.getByText('Selected preview dimensions',{exact:true})).toBeVisible();
     |                                                                            ^ Error: expect(locator).toBeVisible() failed
  23 |   await page.getByRole('checkbox',{name:'Measurement Overlays',exact:true}).uncheck();
  24 |   await expect(page.getByText('Selected preview dimensions',{exact:true})).toHaveCount(0);
  25 |   await page.getByRole('checkbox',{name:'Measurement Overlays',exact:true}).check();
  26 |   await expect(page.getByText('Selected preview dimensions',{exact:true})).toBeVisible();
  27 |   await page.getByRole('checkbox',{name:'Reference Photos',exact:true}).uncheck();
  28 |   await expect(page.locator('.thumb img')).toHaveCount(0);
  29 |   await page.getByRole('checkbox',{name:'Reference Photos',exact:true}).check();
  30 |   await expect.poll(()=>page.locator('.thumb img').count()).toBeGreaterThan(0);
  31 |   await page.getByRole('button',{name:'Upper Passage',exact:true}).click();
  32 |   await expect(page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true})).toBeDisabled();
  33 |   await page.getByRole('button',{name:'Return to model layers',exact:true}).click();
  34 |   await expect(page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true})).toBeEnabled();
  35 |   await page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true}).focus();
  36 |   await page.keyboard.press('Space');
  37 |   await expect(page.getByRole('checkbox',{name:'Subterranean (Unverified)',exact:true})).toBeChecked();
  38 | });
  39 | 
```