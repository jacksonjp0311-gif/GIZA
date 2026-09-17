# GIZA NEXUS 0.10.12 — Software validation

## Executed

- `npm run test:repairs`: **25/25 passed**. Includes all six inspection cases, positive profile-specific fits, scale/provenance failures, immutable snapshots, duplicate/degenerate/nonfinite inputs and real file tampering.
- `npm run check`: **passed** with TypeScript available through NODE_PATH. Includes the inherited scientific/static checks, the new regressions, and native workbench module validation.
- `npm run simlab:benchmarks` and `npm run plate:benchmark`: **passed**. These are synthetic/analytical controls, not archaeological registrations.
- Local HTTP API end-to-end: **passed** with an isolated synthetic 315-page PDF. Import, hashing, page-305 rendering, explicit confirmation, immutable freeze and fitting completed. Repeated fit/refreeze and invalid mutation tokens were rejected.
- Browser client: **passed** for exact shipped HTML/CSS/JavaScript and real Node API responses. Verified disabled precondition actions, 10 landmarks, synthetic residual display, zero JavaScript errors and no horizontal overflow at 390px. Managed Chromium blocks URL navigation: the harness loads the actual files and bridges requests to the real loopback service; it does not mock the API or synthesize a UI image.
- Explorer production build: **passed** with the pinned React 19 / Three.js / Vite dependency set installed locally. Vite transformed 624 modules and emitted the production bundle successfully.
- Desktop launch workflow: **passed**. Each launch now compiles the Explorer before serving it, advances an external development build counter, writes a build stamp and compiler log under `%LOCALAPPDATA%\\GIZA-NEXUS`, and displays the resulting `0.10.12+dev.N` identifier without modifying the sealed release version.
- Live 3D visual check: **passed** at 1895×953 with no horizontal overflow. Confirmed the 3D model is the default surface, the explosion control is inside the viewport, individual masonry blocks separate at 175%, the control extends to 275%, and distance fog no longer fades the model while zooming out. Rechecked assembled, interior, subterranean and exploded states after the limestone/sand material pass; the inspector photo remains contained and readable. Replaced the infinite high-frequency ground grid with a finite 20 m / 100 m survey grid below the plateau plane to eliminate distant shimmer and surface z-fighting.
- 3D navigation interaction check: **passed**. Wheel zoom now follows the cursor with expanded near/far limits, left-drag rotation uses damped motion, right-drag and two-finger gestures pan, and layer toggles no longer recenter the camera. Re-selecting an already-active view preset was verified to restore its canonical camera position.

## Component Explorer addition — 2026-09-16

- `npm run check`: **passed**, now including full strict TypeScript checking, the inherited validators, 25 registration repair tests, six new component tests, and workbench module validation.
- Production build through the desktop launcher: **passed** (`tsc --noEmit && vite build`, 629 transformed modules). Each launch remains compiled/version-stamped externally. Vite still reports the existing large-bundle warning; no bundle-size optimization is claimed.
- Component tests: **6/6 passed**. Verified coffer/cavity inch-to-metre dimensions, source-derived north/south placement and clearances, missing/nonfinite dimension rejection, isolated selection, catalog/evidence distinctions for all 56 parts, and photo rights/bindings.
- Browser interaction checks: sarcophagus quick view, object-only and chamber context, room-fit/focus, lid-only model with separate dimensions, roof/chamber cutaway, lower chamber, searchable portcullis isolation, evidence drawer, wheel zoom, drag rotation and top view were exercised. At 1895×953, document width equals viewport width. At 812×912 the component toolbar and quick-view labels remain readable. No console errors/warnings were returned during the inspected component session. Physical touch gestures and every individual catalog geometry were not interactively tested.
- All five added remote Wikimedia image references loaded with nonzero natural widths, alongside the existing coffer photograph. Remote availability and licenses remain source-dependent; no offline availability is claimed.
- Rehashed the four canonical model files against the recorded archive hashes: **all unchanged**. No registration/metric authority was promoted. The detailed coffer's north–south placement is local to its viewer; the legacy overview orientation discrepancy is disclosed, not silently rewritten.
- These are dimension-constrained idealized models, not exact scans. Most catalog items reuse existing CAD/envelopes. Lower chamber height, material grain, display wall thickness and inspection lid pose are expressly illustrative/unverified. See `docs/COMPONENT_EXPLORER_AUDIT.md` for code findings, primary-source links and acquisition gaps.

## Canonical preservation details

### Second research/refinement pass — 2026-09-16

- `npm run check`: **passed**, including strict TypeScript, inherited validators, 25 registration repair tests and **10/10 component tests**. The four added tests cover doorway closure, pin annotation bounds, photo deduplication and supplement source/unit/binding integrity.
- Desktop production compilation: **passed**. No changes to canonical parts, measurements, assemblies or stone fields; all four archive hashes were rechecked unchanged.
- Added four licensed close-up photographs and one licensed interpretive junction drawing. All five loaded in the browser with nonzero image widths. These are remote references, not offline assets or calibrated imagery.
- Browser checks exercised the photo-only filter, new sarcophagus evidence, optional pin markers, lower-chamber east doorway and its dimension, and floor/junction reference bindings. Lower doorway elevation and pin-bore depths remain unmeasured; the UI explicitly distinguishes cutaway/annotation from physical reconstructed detail.
- Ten added survey observations retain native units, SI values, source locators and measured/derived status. Original 127-row measurements and historical source receipts are untouched. The media supplement is now version 2, with ten reference records.

Four canonical files are byte-identical to the supplied v0.10.11 archive: `parts.json`, `research/measurements.json`, `assemblies.json`, and `stone_field.json`. No real Petrie PDF, archaeological fit, canonical wall geometry or metric ray was created. The demo and integration tests are isolated synthetic computations.

## Explicit limits

### Third research collection pass — 2026-09-16

- Supplement version 3 adds two documentary photographs, one interpretive plan and six source-located survey/condition observations (13 supplemental media records, 22 observations total). Credits, dates and rights are retained. Ambiguous segment identification is not used to bind the Holt interior photo to a specific passage.
- `npm run check`: passed, including TypeScript, inherited validators, 25 registration tests and 10 component tests. Desktop launcher production compilation passed. The served supplement reports version 3.
- All three new remote image URLs returned HTTP 200 with image/jpeg content type. This pass checks link availability, not browser decoding or photogrammetric calibration; remote images are not bundled for offline use.
- Canonical parts, measurements, assemblies and stone-field SHA-256 hashes rechecked unchanged. No geometry changes or new metric authority. Historical floor thickness/tool-mark descriptions remain observations, not exact mapped surfaces.

The Explorer production bundle and local preview were verified. The per-launch `+dev.N` counter is intentionally stored outside the sealed repository; `0.10.12` remains the release version represented by the manifests.

The new Registration Workbench is independently executable with Node.js and no npm install. Import/render of a real PDF additionally requires Poppler's pdfinfo/pdftoppm. Import checks local bytes, syntax/page count and operator-reviewed plate identity; it does not authenticate historical content. Target provenance and its independence assertion remain operator-supplied.

No GitHub commits were made.

## Reproducible evidence

`verification/full-preflight.log`, `scientific-benchmarks.log`, `api-end-to-end.json`, `browser-smoke.json`, `canonical-model-preserved.json`, `explorer-build.log`, and the workbench PNG captures contain the executed results. Test code is included under `tests/`.

## Sealing

### Usability foundation and portable startup — 2026-09-17

- Implemented searchable component navigation with empty states, expanded viewer mode, shared dimensions controls, functional overview camera speed, reduced-motion transitions, unscaled selection highlights, sanitized saved settings, request timeouts and render-error recovery. Header evidence counts now distinguish derived/assumed/unverified.
- Sarcophagus cavity/lid actions and separate body (7) versus lid (4) survey records are implemented. Reference/catalog drawers and inspection controls have dedicated layout space instead of covering the canvas. Source captions are larger. No new archaeological measurements, scans or photographs were acquired in this tranche.
- Repo-relative `npm start` and default platform launchers compile before serving Explorer and Workbench; external build receipts do not alter sealed source. Lockfile added, Vite updated to 7.3.6, and Windows/Linux CI configured. `npm audit` reports zero known vulnerabilities; this is not a comprehensive security audit.
- Full `npm run check` passed after final source changes: strict TypeScript, inherited scientific/static checks, 25 registration repair tests, 11 component tests and 7 usability tests. A compile/start/health/stop smoke run passed on alternate ports 4185/4186. Occupied default ports failed with the intended message without stopping their existing processes. Final desktop compilation passed as dev.25; the pre-existing large-bundle warning remains.
- Browser checks exercised search success and no-results, expanded/restored panels, cavity and lid navigation, and body/lid counts. Final 1280×720 dev.25 screenshot verified the model, photo panel and controls do not overlap in expanded mode. Earlier 812×912 checks exercised component search/cavity navigation. Browser logs returned no errors during those checks. Narrow stacked evidence layout and reduced-motion preference are implemented but not comprehensively browser-tested. Automated tests do not replace a full accessibility/performance audit.
- All four canonical hashes (parts, measurements, assemblies, stone field) remain unchanged. Runtime schemas, canonical/detail frame reconciliation, wider direct-record binding and evidence acquisition remain open in `docs/USABILITY_FOUNDATION.md`. The 56-item roadmap is not claimed complete.

### GitHub publication and code/data audit — 2026-09-17

- User authorized repository creation and push. Created private jacksonjp0311-gif/GIZA, main branch; no existing repository/history was overwritten. Added environment/private-key ignore rules, retained checksum-referenced historical verification logs, and preserved bytes via .gitattributes.
- Credential-pattern and sensitive-filename scans found no actionable matches; not a comprehensive security audit. No node_modules, dist or local raw-vault assets were staged.
- `npm run check` passed again: strict TypeScript, inherited validators, 25 repair tests and 10 component tests. No runtime feature changes in this publication/audit pass.
- Added SPATIAL_ENGINEERING_ROADMAP.md with all 56 part coverage rows, concrete code gaps and phased recommendations. Missing controls/geometry/acquisition work is documented, not claimed fixed.

### Restored icon identity and selection title — 2026-09-17

- Copied the existing desktop GIZA-NEXUS.png icon artwork unchanged into public assets and reused it for the header and favicon. Header logo has CSS floating tilt and an orbit accent; reduced-motion disables both animations. No generated replacement artwork.
- Quick View labels now drive the top title and exactly one active card, including shared-part views such as Full Pyramid / Exploded and Interior / Cross Section. Detail catalog navigation uses the part name; return-to-pyramid/reset restores the full-pyramid title.
- `npm run check` passed (25 repair and 10 component tests plus TypeScript/inherited checks). Desktop compiler build dev.23 passed. Browser at 812×912 confirmed the logo beside the name, titles for Sarcophagus Lid and Exploded, and return to Full Pyramid without reintroducing the old tabs. Reduced-motion branch is implemented, not interactively emulated. Canonical scientific data not edited.

### Model-first header and detail refinement — 2026-09-17

- User explicitly approved removing five mode tabs and moving model identity/surface navigation to the top. Updated the design contract and its assertions; historical screenshot hashes remain intact. Analysis/simulation remain in the docked inspector.
- Removed the duplicate title/metrics overlay from SpatialViewport, moved evidence counts to the header, removed old atlas/registration top offsets and retained three working surface controls. Final 1280×720 browser screenshot shows the 76 px header with all controls on one row and no title overlay. Narrow breakpoints are implemented but not interactively verified in this pass.
- Sarcophagus material distinguishes polished sides from rough underside using illustrative roughness, not measured surface microgeometry. Object-only cavity dimensions appear in a stable readout; geometry labels now default off to avoid clutter. Object-only view and readout exercised in the browser. Existing dimensions and canonical meshes/data remain unchanged.
- Added two credited remote photo references (Belzoni inscription, additional Petrosyan interior reference); both image URLs returned HTTP 200. Supplement v4 contains 15 media and 22 observations. The latter photo is bound at pyramid level because exact component identification is unresolved.
- Full `npm run check` passed: strict TypeScript, inherited validators, 25 repair tests, 10 component tests. Final compiler build passed, dev.22; existing large-bundle warning remains. Browser surface switching MODEL → ATLAS → REGISTRATION → MODEL exercised; no error logs returned. Final full pyramid left open. Rechecked all four canonical SHA-256 hashes unchanged.

Current manifests are regenerated after tests and edits, in phase → continuity → root order. Historical input manifests are archived separately. `npm run verify:release` checks current hashes and root file coverage. Rebuilding mutable outputs or importing new data requires resealing before redistribution.
