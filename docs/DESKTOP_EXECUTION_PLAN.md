# Desktop Execution Plan — Current v0.10.2

Use this order after extraction.

## 1. Runtime verification

```powershell
npm install
npm run check
npm run build
.\Start-GIZA.ps1
```

Capture the first true browser/GPU screenshot only after the production build succeeds.

## 2. Performance profile

Record:

- idle FPS/frame time
- 10,152-cell field assembled
- field at 80% explosion
- x-ray + section cut
- photo HUD active
- selection latency
- GPU memory

Do not increase visual LOD until these numbers are known.

## 3. Terrain bridge

Start with public SRTM 30 m for coarse context. Preserve its CRS/vertical metadata and create a transform receipt into the local GIZA engineering frame.

## 4. Photogrammetry pilot

Best first target: surviving upper casing because exterior imagery is abundant and the geometry has survey anchors.

Workflow:

1. register licensed images into quarantine
2. create photogrammetry job
3. solve cameras
4. lock scale
5. inspect reprojection residuals
6. produce candidate mesh
7. compare against pyramid envelope
8. only then evaluate promotion

## 5. Interior pilot

Use the sarcophagus as the calibration/control object because it is physically identifiable, photographed, and strongly dimensioned. Treat this as a pipeline validation target before trying to map difficult wall stones.

## 6. Solver runtime verification

Gravity, ECHO acoustics, and STRATA screening are already implemented at source/data level. After dependencies install, verify all three in the real browser/GPU runtime and preserve their run receipts. The next new solver phase is passive EM/MAXWELL, with analytical controls first. Muography remains forward-model-only until actual detector data are obtained.

## 7. Continuity checkpoint

Before any desktop release, review `public/model/research/findings_registry.json`, update `CONTINUITY.json`, and run `npm run validate:continuity`. A desktop-only change is not complete if the repository handoff state is stale.


## 8. Visual contract checkpoint

Run `npm run validate:visual`, then capture the **running** application at desktop resolution. Compare shell geometry with `docs/design/APPROVED-UI-TARGET.png` and `REFERENCE-RUNTIME-v0.9.2.png`. Do not substitute a mockup if capture fails; record the failure in `VALIDATION.md`.

## REGISTRATION LAB desktop pass

1. Cache licensed ATLAS originals with `npm run media:harvest:download`.
2. Acquire Dash/GPMP survey-control assets subject to rights review.
3. Import KML/KMZ-derived KML while retaining source CRS/datum metadata.
4. Mark image/world correspondences in the seeded registration jobs.
5. Run planar E1 solves where a common plane is defensible; use a calibrated PnP/photogrammetry tool for real E2 3-D pose.
6. Store residuals, holdouts and transform receipts before any evidence promotion.
7. Prefer authorized 2025 Khafre laser data over photograph-derived exterior geometry when available.


## 9. RITUAL MAP runtime pass

1. Run `npm run validate:maps`.
2. Launch the real browser runtime and press `M` to toggle 3-D ↔ MAP ATLAS.
3. Confirm the atlas scrolls internally while header, left rail, inspector, Quick Views and footer remain fixed.
4. Verify all seven map sections at 1672×941 and 1600×960-class desktop sizes.
5. Confirm the SURVEY CONTROL view does not draw the local Khafre model into GPMP native coordinates while translation/vertical tie remain unresolved.
6. Confirm Project Explorer routes open the requested map.
7. Capture a true runtime screenshot only after a successful build.

## v0.10.3 desktop campaign

1. `npm install`
2. `npm run source:parse`
3. `npm run action:build`
4. `npm run intent:evaluate`
5. `npm run check`
6. Launch NEXUS and inspect MAP ATLAS → ACTION GRAPH.
7. Acquire rights-cleared Petrie/Perring/Hölscher/ARCE/Dash primary assets into PRIMARY SOURCE VAULT, hash them, and rerun parser receipts before attempting room-level graph refinement.


## v0.10.4 desktop campaign

Prioritize checksum-bound acquisition of open/legal plan bytes, then parse source scale/frame and register with residuals before any room polygon is promoted.

## v0.10.5 desktop acquisition / metric-registration campaign

1. Install dependencies and pass the complete v0.10.5 check suite.
2. Inspect MAP ATLAS → VISIBILITY LAB in the real runtime.
3. Acquire rights-cleared primary plan/section bytes from authoritative repositories.
4. Record SHA-256, exact source URL/identifier, rights state, page/plate locator, and parser version.
5. Register scale/frame controls with holdouts and residuals before creating wall polygons.
6. Only after registration passes, enable metric visibility rays in a future release.

## v0.10.6 source-byte / metric campaign

1. Acquire legal Petrie/ARCE/Perring source bytes into PRIMARY SOURCE VAULT.
2. Compute SHA-256 and record provider/license metadata.
3. Register Petrie Plate VI and ARCE 1:100 independently with controls + holdouts.
4. Compare rather than force agreement.
5. Build wall/opening polygons only inside passing registered regions.
6. Run first metric sightline experiment with explicit observer/target heights and sensitivity bands.
