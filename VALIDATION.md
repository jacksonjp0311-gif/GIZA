# 0.12.0 live evidence + guidance — 2026-09-18

Base commit: 3074047ce8c39950b5d03814b1a40408f55c7739. The working tree
included subsequent centered-camera, media, layer and drawer improvements;
those were preserved. This section is a dated verification record, not a claim
that synthetic campaign success establishes archaeology.

## Reproduced and repaired

- A RESOLVED HYPOTHESIS rigid transform produced an ordinary KNOWN result.
- Its graph wrapper incorrectly became RECONSTRUCTED.
- A feature-owned constraint's observation was absent from derived traversal.
- Imported registration verification flags were not a local replay capability.

The first three pre-repair failures are retained in
verification/live-evidence-012/reproduction.md. New adversarial tests cover
conditional chains/assumptions, imported claims, owned constraints, unrelated
context and deterministic impact. Synthetic campaign tests retain custody,
untouched holdouts, scoped review and rollback. No canonical archaeological
data was adjusted to make tests pass.

## Executed local verification

Environment: Windows, Node 24.18.0, Chromium 153.0.8010.12, headless
SwiftShader, AMD Ryzen 5 3500. Complete check checkpoints integrity-a and
integrity-b passed. The version-transition integrity-final failed on the
hard-coded old release identity; both identity fields were corrected without
weakening the check. live-evidence-012-integrity-final-b passed: 201 tests,
TypeScript, inherited validators, Evidence Assembly validation and workbench
build. npm start -- --smoke compiled 0.12.0, reached both services and exited
successfully on dedicated ports 4183/4184.

Browser checkpoint live-evidence-012-browser-a: 24 passed, 4 failed because the
first-use welcome covered controls. The welcome moved into a dedicated header
row. Checkpoint browser-b: 28 passed. Checkpoint browser-c: 29 passed, including
the actual campaign-to-live-graph/rollback path and tutorial keyboard/resize
behavior. Additional targeted tutorial/campaign run: 9 passed, including
scroll targeting and an unavailable optional Atlas. Earlier failures and their
artifacts remain preserved. live-evidence-012-browser-final passed all 31
tests, including measurement-fingerprint invariance across tutorial use.
Screenshots cover 1280×800, 390×844, 844×390 and 1440×900 at device scale 2.
The final focused contract/campaign rerun passed all 14 tests.

Large new failure trace ZIPs remain intact locally and are listed with
SHA-256/size in verification/live-evidence-012/local-traces.json. They are not
Git release objects; prior tracked historical traces remain unchanged.

## Performance observations, not certification

Comparable environment and readiness criterion, four fresh browser contexts:
the retained 0.11.1 profile had ordinary-start samples 880.0, 622.1, 642.9 ms;
the current implementation measured 1032.7, 436.7, 473.5 ms. The 5-second
optional-Atlas delay sample reached usable core at 677.4 ms before and 622.2 ms
now. Each recorded 64 requests, including 55 model requests. These few samples
do not support a general startup-speed claim.

Current idle RAF p95 samples: 93.4, 50.3, 50.2, 35.0 ms. Real-drag scheduling
p95: 67.9, 63.0, 57.8, 60.9 ms. These measure page scheduling under SwiftShader,
not GPU frame duration. Heap estimates were 19.3–20.5 MB, not process memory.
Tutorial layout updates measured 0.5–1.7 ms maximum per sample (1–2 updates),
not a continuous per-frame React loop.

Idle CPU profile, ten samples: graph validation median 18.777 ms; fresh receipt
replay 58.441 ms; immutable verified reuse 0.001 ms; contextual explanation
54.720 ms; impact analysis 65.591 ms. The earlier impact profile ran alongside
browser verification and was contended; do not compare it as an optimization
baseline. Raw profiles remain in verification/evidence-boundaries.

## Remote verification and limits

The baseline Ubuntu job succeeded. Its Windows browser stage was cancelled at
the timing envelope; setup, contracts, compilation and smoke succeeded. The
retained artifact was inspected, not relabelled as a product failure. Details:
verification/live-evidence-012/windows-baseline.md.

The first successor CI run separated contracts/build/smoke and four browser groups
on each OS, with streaming bounded logs and 14-day artifacts. Run 35374930729
at sealed commit 63cde09 passed both OS contracts/build/smoke jobs and Ubuntu
core/Atlas. Ubuntu evidence failed at a 149.5 px portrait canvas; guidance
failed when a real keyboard click arrived before the first target-measurement
RAF. Public failure logs are retained under
verification/live-evidence-012/remote-63cde09; original remote traces remain
in workflow artifacts.

Repairs: the first-use welcome is shown only on the ordinary model, not inside
an opened research workspace; click-driven tutorial progression identifies the
real event target directly rather than waiting for the layout observer's cached
element. No viewport assertion or timeout was weakened. A successor sealed
commit must complete both remote platforms before acceptance; local passes do
not override the recorded remote failures.

The same run's Windows evidence shard passed section-cap picking but exceeded
the 60-second aggregate budget for the complete save/reload/compare/import
journey. The retained trace shows successful individual actions taking
3.1–7.2 seconds and the assertions continuing through the final return to the
workstation; it does not show a stalled pick or failed arithmetic assertion.
That one long test now has a bounded 120-second budget. All interactions and
15-second expectations remain unchanged. This measured environment adjustment
is not a claim of improved application performance.

The Windows core shard finished in 9.2 minutes with three failures (settling
assertion, Inscription Lab timeout, layer workflow timeout) and trace teardown
errors reporting truncated ZIPs. Its public log is preserved alongside the
other first-run failures. The successor separates navigation and spatial core
tests, for five exhaustive groups per OS. Trace recording keeps DOM/action
snapshots and source while disabling the continuous screenshot filmstrip;
explicit failure PNGs and tutorial/layout screenshots remain. This bounds
diagnostic overhead, not interaction coverage. The original exact camera
settling assertion is retained, with a bounded numeric diagnostic attachment
on failure so a repeat failure can be investigated rather than guessed.

Local repair checkpoint live-evidence-012-remote-repair-contracts passed the
full 201-test pipeline. live-evidence-012-remote-repair passed all 31 browser
tests. With bounded tracing, live-evidence-012-bounded-tracing again passed all
31 (2.9 minutes on this machine). Read-only overview diagnostics now avoid
writing an unchanged JSON attribute every frame; their values and all spatial
assertions are unchanged.
The final seal-contracts checkpoint passed all 201 tests and inherited checks;
the affected spatial shard passed all four actual browser interactions after
the diagnostic-write change.

The real Khafre archaeological campaign remains BLOCKED on identified
permitted-use plan bytes, independent local control/scale, datum, uncertainty,
distributed frozen controls and untouched holdouts. Local dimensions remain
usable; lid placement and monument/site transforms remain unresolved.

# GIZA NEXUS 0.11.1 — Software validation

## Centered orbit, media audit and overlapping controls — 2026-09-18

- Reproduced two display causes: preview dimensions occupied the same top-left position as the inspection tab; overview screen-fitting translated the orbit target off the monument axis, while zoom-to-cursor could move targets during wheel zoom. Dimensions are now nested in the drawer, the overview pivot remains on-axis, and all four spatial viewers use fixed-target zoom. Explicit panning remains intentional.
- `node scripts/evidence/checkpoint.mjs media-orbit-full-final`: PASS, 193 tests plus TypeScript, inherited validators and workbench build. The earlier `media-orbit-full-a` missing-import compilation failure is preserved; `media-orbit-full-b` passed before the final axial-camera refinement.
- `node scripts/media/audit-duplicates.mjs`: 17 public raster files, 75 media references including the inscription catalog; zero byte-duplicate local files and zero invalid JSON files. Sixteen identities recur across attribution/catalog records, with no within-catalog repeated identity. This does not establish that all remote or perceptually similar images are unique. No historical records were deleted.
- Existing source-image hashes remain asserted; two new unchanged image hashes, author/license/source metadata and explicit reproduction caveats are recorded. Browser coverage includes opening the reproduction through the actual Inscription Lab and checking loaded image dimensions.
- Initial browser checkpoint `media-orbit-browser-a`: 21 passed, one failed. The new orbit test sampled startup interpolation before settling. It now waits for stable camera/target samples before real wheel and pointer gestures; the numeric target-invariance assertion was not relaxed.
- `node scripts/evidence/browser-checkpoint.mjs media-orbit-browser-final`: PASS, all 23 actual-browser tests plus production build, 2.5 minutes. Includes fixed-axis target, real off-center wheel/drag invariance, hidden nested dimensions, locally loaded reproduction image, all existing assembly/registration workflows and desktop/narrow/short layouts. No forced clicks or increased timeouts. Local HTTP 4173 returned 200 after the new production build.
- Local environment: Windows, Node v24.18.0, Chromium with SwiftShader. No Ubuntu or remote CI run for this follow-up. No archaeological data, measurement frames, registration gates or source authority changed. Details: `docs/MEDIA_ORBIT_CLEANUP.md`.

## Hover-collapsing viewport drawers — 2026-09-18

- Shell/reality and explosion controls start collapsed, reveal on hover/focus/tap, and close after pointer departure. Active range drags retain the drawer until release; Escape and explicit Close work without hover. Tabs remain stationary as panels expand, with available-height constraints for short viewports. Geometry and research storage are unchanged.
- `node scripts/evidence/checkpoint.mjs hover-drawers-full-final`: PASS, 192 tests, TypeScript, inherited validation and workbench build. Initial `hover-drawers-full-a` also passed.
- `node scripts/evidence/browser-checkpoint.mjs hover-drawers-browser-final`: PASS, 21 actual-browser tests with production build. New checks exercise mouse departure, real pointer down/drag outside/up, keyboard open/Escape and touch open/close. Startup/reload centering, layer switches, spherical expansion and all research workflows remain passing.
- Initial `hover-drawers-browser-a` retained: two startup assertions attempted to use the newly hidden slider after reload, and a short-landscape hover exposed the expanding tab moving under the header. Tests now explicitly hover the tab after reload; stationary tab/absolute-panel layout fixes the real overlap. No forced interaction or numerical assertion was removed.
- Local Windows / Chromium SwiftShader / Node v24.18.0; no remote CI or Ubuntu execution for this change. Short-landscape screenshot visually reviewed. Previous uncommitted centered-startup work is preserved.

## Centered startup repair — 2026-09-18

- Reproduced in code: startup reused the saved overview explosion, clipping, hidden exterior and camera preset; a saved explosion could translate the pyramid hundreds of display metres away from the fixed camera. The perspective preset also aimed at Z=35 regardless of viewport aspect ratio. STL bounds were inspected and agree with the declared centered envelope; no archaeological geometry was changed.
- `node scripts/evidence/checkpoint.mjs centered-startup-full-a`: PASS, 192 tests, TypeScript, inherited validation and workbench build. New tests cover immutable startup preferences and projected-envelope fitting across five aspect ratios.
- `node scripts/evidence/browser-checkpoint.mjs centered-startup-browser-a`: PASS, 19 actual-browser tests including production compilation. Three new tests seed an exploded, clipped, hidden-exterior underground state, open and reload the app, and assert assembled visible geometry plus actual rendered-mesh projection bounds centered within 0.015 NDC at 1280×800, 390×844 and 844×390. A separate storage sentinel survives. Desktop startup screenshot visually reviewed; screenshots for all sizes retained with the checkpoint.
- Local Windows / Node v24.18.0 / Chromium SwiftShader only; no remote CI or Ubuntu run for this repair. Research snapshots, canonical data, measurement frames and explicit saved investigations were not altered. Display preferences remain available; transient overview pose is deliberately not resumed at startup.

## Atlas and spatial presentation — 2026-09-18 UTC

- Final full pipeline: `node scripts/evidence/checkpoint.mjs atlas-sphere-final-contracts` PASS, 190 tests, TypeScript, inherited validators and workbench compilation. `atlas-sphere-full-b` and `atlas-sphere-full-checked` also passed. The initial `atlas-sphere-full-a` failed on a source-string guard looking for an obsolete viewport caption; the guard now requires both the actual header switch and atlas component, plus the full-page layout. No numerical gate was weakened.
- Final actual-browser pipeline: `node scripts/evidence/browser-checkpoint.mjs atlas-sphere-final` PASS, 16 tests, production build. Atlas checks cover full workspace width, hidden overview rails, drawing height, non-overlapping visible text, complete text index, zoom and return navigation at 1280×800, 390×844 and 844×390. Sphere checks cover rendered instanced mode/count/settled amount and restore, plus contextual explosion controls in Evidence Assembly and ordinary components. All inherited layer, measurement, section-cap pick/save/export/restore, candidate, optional-data and campaign tests pass.
- Screenshots of actual Atlas drawings at three sizes and the spherical presentation are preserved in the final browser checkpoint and were visually reviewed. Earlier `atlas-sphere-browser-b` passed its narrower assertions but visual review found a collapsed SVG container; an explicit drawing-height regression and positioning repair were added. It is not represented as a successful visual certification. `atlas-sphere-browser-a` preserves the prior section-picking mode race; picks now route through the current committed callback, with an additional visible Measure-panel synchronization assertion. No forced clicks, injected picks, skipped tests or increased timeouts.
- The new deterministic sphere test asserts unique display positions, spherical radius, exact zero restoration, nonfinite rejection and unmodified cell records. Cells remain ASSUMED procedural illustrations. Canonical parts, measurements, assemblies and stone-field files have no diff. Physical lid placement and source campaign limitations remain unchanged.
- Executed locally on Windows / Node v24.18.0 / Chromium headless SwiftShader. No Ubuntu or remote CI execution for this follow-up; no frame-rate, memory or archaeological discovery claim. The failed attempt to reuse a checkpoint name was rejected before running checks; final contract and browser logs use distinct append-only paths.
- Handoff and design references: `docs/ATLAS_SPATIAL_PRESENTATION.md`. Product identity remains 0.11.1 with explicitly dated follow-up changes.

## Layer-control follow-up — 2026-09-18 UTC

- `node scripts/evidence/checkpoint.mjs layer-controls-full-final`: PASS, 189 tests, TypeScript, inherited validation and workbench build. Earlier `layer-controls-full-a` also passed.
- `node scripts/evidence/browser-checkpoint.mjs layer-controls-browser-checked`: PASS, 12 actual Chromium tests, including production build. New regressions inspect the actual rendered scene through opt-in read-only `?layerDiagnostics=1`: eight shaft objects appear/disappear; authority hiding and explicit reveal work; exterior hides masonry; internal inspection honors its layer; terrain/casing hide; preview dimensions and reference photos follow controls; separate detail views disable overview controls; keyboard Space operates switches. Existing investigation, section picking, optional-data and responsive tests also pass.
- Environment: local Windows, Node v24.18.0, Chromium headless SwiftShader. This follow-up has not run on Ubuntu or remote CI. No new frame-rate or memory claim; X-ray material appearance and FIELD overlay alignment were source-reviewed, not independently visually certified by the new tests.
- Preserve failures: `layer-controls-pointer-failure` retains the original non-actionable input trace; `layer-controls-browser-b` exposed decorative `3D` in the Underground accessible name; `layer-controls-browser-final` exposed the new test's incorrect assumption that Show Dimensions defaults on. The checked test explicitly enables that preference. No forced clicks or weakened assertions.
- Canonical parts, measurements, assemblies and stone-field bytes retain their previous SHA-256 values. No archaeological authority, coordinates, dimensions or source records changed. This is a follow-up to product identity 0.11.1, not a new archaeological release.

## Current reliability release — 2026-09-18 UTC

- `node scripts/evidence/checkpoint.mjs release-0-11-1-final-checked`: **PASS, 189 tests**, strict TypeScript, all inherited validators, semantic receipt replay and workbench build. Earlier `reliability-0-11-1-a` and `-c` failures remain preserved. The former exposed a legitimate promotion-index endpoint omitted by the new validator; the latter exposed an old uncertainty expectation superseded by explicit rule v3. The revised test also asserts the archived original value remains unchanged; no historical result or acceptance gate was deleted.
- `node scripts/evidence/browser-checkpoint.mjs release-0-11-1-browser-checked`: **10 actual-browser tests passed**, including production compilation, exact dependency difference and linked rerun, section-cap pointer pick through save/export/reload/restore, isolated fitting, authority visibility, draft navigation, keyboard routing, optional-data faults and three viewport dimensions. Before that, `npx playwright test -g "actual pointer cut" --repeat-each=3` passed three fresh Windows contexts (10.4/9.1/10.9 seconds). No timeout increase, forced click or injected result. Final checked cap workflow took 9.1 seconds.
- Executed locally on Windows, Node v24.18.0, Chromium headless SwiftShader. The successor's **Ubuntu and remote Windows CI have not run**. No usable Ubuntu distribution was available locally. CI now retains public logs, screenshots, traces and HTML reports for 14 days, with distinct dependency/contract/compilation/browser/smoke stages. Smoke can execute after browser failure if compilation succeeded. Artifact upload behavior itself awaits the next remote run.
- Historical remote baseline correction: run `35290841094` at `91b738a` passed Ubuntu checks/browser/smoke; Windows passed checks but failed the cap-search browser test and skipped smoke. Its failed log is preserved. Prior local successes below do not override this remote failure.
- Current CPU profile (`profile-release-0-11-1.json`): ten samples each; median graph validation 35.95 ms, fresh receipt replay 246.98 ms, verified immutable receipt reuse 0.0011 ms, contextual explanation 162.30 ms. These are current contract costs, not before/after frame-rate certification. Explanations are contextual; graph construction remains memoized by assembly; receipt reuse only trusts recursively frozen verified objects. No workers/runtime dependencies were added.
- Canonical parts, research measurements, assemblies and stone-field SHA-256 values match the pre-evolution baseline. Real archaeology remains BLOCKED: missing verified relevant source bytes/usage, independent local control/scale and uncertainty, and frozen identified holdouts. Campaigns remain explicit 2-D sidecars, not live 3-D graph integration. No new fit, discovery or surveyed placement is claimed.

See `docs/RELIABILITY_0_11_1.md` for reproduced issues, current/legacy rule contracts, historical inspection, remaining limitations and the executable explain-and-compare demonstration.

- Final compile/start smoke: `GIZA_EXPLORER_PORT=4183 GIZA_PORT=4184 node scripts/ci-stage.mjs smoke` **PASS**, 694 production modules, both services ready and clean shutdown. Public log/environment receipt is retained as `release-0-11-1-smoke.log/.json`. The legacy engine banner remains 0.10.12 by historical module identity; product build is 0.11.1. Vite's large-core warning is not suppressed.
- Current production-preview samples (`performance-release-0-11-1.json`), same Windows CPU/Chromium/SwiftShader setup: usable model 880.0 / 622.1 / 642.9 ms; with a five-second optional atlas delay 677.4 ms. RAF p95 95.6 / 48.3 / 48.3 / 39.8 ms; page errors empty. Resource counts and Chromium heap estimates remain in the raw JSON. Earlier 0.11.0 samples were 1099.2 / 492.9 / 620.2 ms and delayed 679.8 ms, with different background-load conditions. This supports continued absence of the optional startup barrier, not a controlled frame-rate, memory or general speedup claim.
- A last explanation-state guard clears stale displayed explanations and discards late responses when their model identity changes. Final full/browser checkpoint names are `release-0-11-1-final-checked` and `release-0-11-1-browser-checked`. Release manifests are generated only after final documentation, with old seals preserved; verify with `npm run verify:release`.

## Evidence-boundary release — 2026-09-17

- Final full pipeline: `node scripts/evidence/checkpoint.mjs release-0-11-0-full-b` passed: **179 tests**, strict TypeScript, inherited validators, semantic evidence replay and native workbench build. Final browser checkpoint `release-0-11-0-browser-b` passed **10 actual Chromium tests**, including production compilation. Earlier failures and generated benchmark outputs remain archived; historical benchmark bytes were restored after timestamp-only comparison.
- Browser coverage includes entry/exit, isolated fitting and authority visibility, measurement invariance, actual section-cap pointer picking through save/export, historical input changes, review-draft detours, export/reload/restore, optional slow/missing/malformed atlas, keyboard routing and 1280×800, 390×844, 844×390 layouts. These tests are separate from inherited source-pattern/visual guards. CI is configured; remote CI execution and other browser engines were not observed here.
- `GIZA_EXPLORER_PORT=4183 GIZA_PORT=4184 npm start -- --smoke` passed on Windows/Node v24.18.0: compiled 691 modules, served both application and workbench, then stopped its own services. Existing user services were not terminated. The legacy registration engine retains its historical 0.10.12 identity; product release is 0.11.0. Vite's large-core warning remains visible.
- Same-machine Chromium/SwiftShader production-preview samples are preserved in `verification/evidence-boundaries/performance-*.json`. Baseline usable-model times: 983.9/474.5/468.6 ms; final: 1099.2/492.9/620.2 ms. With a five-second optional atlas delay: **5761.8 → 679.8 ms**. This establishes removal of that startup barrier, not a general startup speedup. Final RAF p95: 67.4/82.8/64.1/53.0 ms versus baseline 108.7/61.1/57.1/58.8 ms. RAF scheduling is not GPU timing; heap values are Chromium estimates. Final sampling overlapped launch compilation, so no controlled frame-rate improvement is claimed.
- Scoped campaign positive and failed-holdout negative packets are retained under `source-positive-0-11-0` and `source-negative-0-11-0`. Both are explicitly **synthetic software QA**, not archaeological evidence. The positive path exercises bytes, freeze, shared-engine fit, replay and reviewed 2-D sidecar revision; browser coverage additionally exercises rollback. Failed holdouts and denied promotion are preserved.
- Real Khafre coffer/chamber campaign: **BLOCKED**, before fitting. Missing verified relevant source/render bytes and permitted use, independently attributable control/scale with uncertainty, identified correspondences and local datum/axes, and frozen untouched holdouts. Local dimensions remain usable; lid placement and assembly-to-site transforms remain unresolved. See `docs/SOURCE_CAMPAIGN.md` for reproducible workflow and exact limitations.
- Executable contracts use assembly v1, quantity v1, receipt v2, saved-investigation v2 and scoped-campaign v1. Historical receipt v1 and saved-investigation v1 interpretation is retained; absent historical metadata is not fabricated. Browser-local persistence is not archival or atomic multi-user storage. Operator attribution is not authenticated scholarly review.

The sections below are preserved historical validation records, not current release claims.

## Historical evidence-boundary checkpoint

See [checkpoint ledger](docs/EVIDENCE_BOUNDARY_EVOLUTION.md). Full check `increment-1-20260917-b` passed 163 tests; preceding failed run is preserved. Subsequent work requires fresh validation. These numerical/contract checks are not browser or performance certification.

## Evidence Assembly / 01 evolution — 2026-09-17

- Implemented the sarcophagus/lid/burial-chamber Evidence Assembly in place: explicit rigid frames, 50 features, 39 observations, a 260-node/520-edge evidence graph and 13 deterministic Investigation Candidates. Canonical archaeological files are unchanged. The comparison-only adapter discloses legacy/detail orientation, rim elevation and position disagreements; it cannot resolve authoritative measurements. Actual lid placement and assembly-to-monument/site ties remain UNKNOWN.
- Complete `npm run check` passed **154 tests** (89 inherited, 52 evidence/graph/view and 13 runtime), strict TypeScript, all existing validators, targeted candidate reproduction and workbench build. No test gates were weakened. Final production compilation uses the normal compile-first launcher. Logs are appended under `verification/evidence-assembly/`; final run is `20260917-residual-focus-2bf59a9c`. Earlier runs and previously recorded validation results remain preserved.
- Browser checks used the actual localhost application: source-linked feature selection, actual pointer picking, exact-anchor distance, right angle, explicit frame selection, clipping/oblique cap area, reversible lid separation, fit-to-exploded bounds, orbit/zoom, keyboard M/C/Escape, candidate evidence navigation, immutable computation/review append and journal restoration. Observed results include coffer length **2.633472 m**, lid length **2.634742 m** unchanged at 3 m inspection separation, cross-frame lid measurement **UNKNOWN**, and reconstructed angle **90°**. These are software computations, not new archaeological measurements.
- Responsive QA at 1280×800, 390×844 and 844×390 found and fixed a short-landscape regression: the 844×390 canvas increased from 542×33.5 to **542×203 px**, with no horizontal document overflow. The 390×844 layout retained a stacked inspector and 378×205.5 px canvas. Review drafts now remain mounted while following evidence or closing contextual panels; a temporary unsaved QA draft was cleared after verification.
- Actual local file selection tested a clearly named synthetic residual fixture. Control/holdout filtering and keyboard inspection retained **IMPORTED_UNVERIFIED / metric authority NONE**. A discovered SVG focus-ring scaling defect was corrected with non-scaling focus markers. Missing optional registration output now reports UNKNOWN even when the static server returns HTML with HTTP 200. No accepted archaeological fit, source-photo projection, survey control or metric promotion was fabricated.
- Reloaded the two-record software-QA research journal without changes: its experiment and explicitly inconclusive “Automated software QA” finding remain historical test records. Content-bound receipts include base commit, working-tree/source hashes, version and environment. Corrupt/stale/quota/mismatched journal conditions, forged receipt semantics, missing/malformed optional datasets, transform drift, selection/explosion invariance and export preservation are covered by automated tests.
- The original main bundle was 1,228,904 bytes; the final core is approximately **1,207,874 bytes** before gzip (1.71% reduction). Assembly, atlas, detail, Sphinx and Inscription Lab use separate optional chunks. The core still exceeds Vite's size recommendation. This is a bundle-size profile, not a measured startup/frame-rate certification.
- Limits: no real archaeological registration/source acquisition, authenticated scholarly review, complete propagated spatial covariance, metric passage walkthrough, actual GPU-driver-loss exercise, physical touch-device test or comprehensive screen-reader audit. Orthogonal/oblique sections describe idealized source-constrained solids, not surveyed irregular surfaces. Current browser comparison results and final build identity are recorded in `verification/evidence-assembly/browser-validation-20260917.json`; targeted immutable computation output is `public/model/evidence_assembly/validation-20260917-evolution-v1.json`.
- Historical benchmark outputs and pre-evolution seals are retained separately before current seal regeneration. README, CHANGELOG, CONTINUITY, the Evidence Assembly contract and manifests document the handoff. No GitHub commit/push was performed in this evolution.

## Sphinx surface and reference-desk refinement — 2026-09-17

- Replaced chest/neck and foreleg/toe primitives with capped continuous profile meshes; refined body silhouette, facial relief and curved/flared headdress. Added seam-shared indexing, filtered fine stone shading and shadow normal bias. These are manually photo-informed display coordinates, not measured geometry. The separate anatomical regions overlap; a fused print-ready monument is not claimed. No missing nose, beard or hidden chambers were reconstructed.
- Added two unchanged offline photographs with visible author/date/license/source links and tested SHA-256 receipts (`public/sphinx/SOURCES.md`), plus zoomable comparison and focus-in-context. Added a collapsible explosion drawer for close-ups. Geology display now reaches chest/head/headdress but remains schematic. Existing canonical parts, measurements, assemblies and stone-field hashes are unchanged.
- Split Sphinx and Inscription Lab into on-demand modules with loading/error recovery. Compiler output separates approximately 26.5 KB Sphinx and 52.9 KB inscription JavaScript. The main bundle still measures approximately 1.23 MB minified and retains Vite's large-chunk warning. No frame-rate, memory or complete performance certification is claimed.
- Full `npm run check` passed: strict TypeScript, inherited validators, 25 registration, 11 component, 7 usability, 11 Sphinx and 12 epigraphy tests (66 total), plus workbench build. Added checks for finite geometry, closed loft topology, opposing shared-edge winding, positive enclosed volume, paired paw envelopes, licensed image hashes, lazy entry points and modal Escape guard. Final Sphinx tests and desktop TypeScript/Vite compilation passed again as `0.10.12+dev.41`.
- Browser checks covered photo switching/zoom, focus, assembled and 200% exploded fit, head isolation, wireframe, section cut, drag rotation, reset and on-demand Inscription Lab entry. Escape closed the inscription dialog while retaining the Sphinx photo panel. Desktop side-by-side comparison was checked at 1280×800; the compact stacked comparison at 812×912 was refined to show the photograph immediately. At 812 px, document width equals viewport width and the body photograph reports 4288×2848 natural pixels. Temporary viewport override was reset. No errors were returned during the inspected dev.39 rendering session; final dev.41 smoke checked rendering/layout. Physical touch, full accessibility, reduced-motion emulation and every region's export were not comprehensively tested in this pass.
- AERA's Sphinx project/archive is linked as a future survey-acquisition path. No licensed monument scan, calibrated photographic alignment, archaeological fit, connected OCR, expert-reviewed translation or new metric authority was acquired. No GitHub push was performed in this pass.

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

### GitHub publication preflight — 2026-09-17

- User explicitly requested pushing the accumulated Sphinx, internal-inspection and Dream Stela workspace changes to the existing GIZA repository. Fetched origin/main and confirmed no divergence before preparing the commit; no force push or history rewrite is intended.
- Re-ran npm run check successfully: strict TypeScript, inherited validators, 89 tests and Workbench build. The previously verified desktop production build is dev.46; publication does not change the root release version. git diff --check passed. Source photographs, fonts and the separate AI prediction retain their attribution/license/provenance receipts. Browser-local notebooks and generated build/dependency directories are not part of the publication.
- Regenerate the current manifests after these records and verify before committing. This local preflight is not a GitHub Actions result; remote CI completion is not asserted here. Earlier no-push statements describe the historical implementation passes, not this newly authorized publication.
- The staged check also includes formerly untracked assets and reports two nonfunctional whitespace notices: a trailing space in the preserved upstream OFL license and a final blank line in the generated Unicode palette. These bytes are retained; there are no merge-conflict markers or substantive publication blockers in the targeted review.

### Connected artifact workflow and notebook safety — 2026-09-17

- Added a source-led Dream Stela overview, original-image collection, published-height/alternate summary disclosure, local annotation counts and three explicit evidence/interpretation/prediction paths. The overview connects to an isolated stela plus its original source photo; selected stela controls link back into the artifact workspace. Existing HoremWeb image bytes are reused with credit, not claimed as new acquisition. No texture projection, sign-to-mesh registration, reviewed translation or new metric evidence is asserted.
- Added source-photo drag panning, keyboard navigation and selected-zone framing bounded to 100–400%. Display fitting leaves image coordinates and source bytes unchanged. Scoped legacy text-color overrides away from the epigraphy dialog to restore intended contrast. The stela material no longer includes limestone bedding and the face no longer receives the large scene shadow map; browser comparison confirmed removal of false horizontal shadow bands. The dimension label no longer crosses the object.
- Added optimistic baseline-checked notebook persistence, malformed-storage preservation, stale-tab warning, guarded reload/exit, draft export and retained-raw recovery backup. Data edits are bounded to 2 MB UTF-8; compact notebook export and bounded source-metadata import allowance avoid formatting overhead breaking backups. Async imports merge with the latest notebook. This is not an atomic multi-tab lock, collaborative merge, or authenticated review service.
- Final npm run check passed: TypeScript, inherited validators, 25 registration, 11 component, 7 usability, 12 Sphinx, and 34 epigraphy/storage/navigation tests (89 total), plus Workbench build. New tests cover finite/clamped/nonmutating fit math (7), malformed/unavailable/oversized/quota/stale/competing storage behavior (11). Desktop production compiler passed as 0.10.12+dev.46; existing large-main-chunk warning remains.
- Browser checks exercised the overview-to-stela/photo and return routes, source selection, fit to a selected zone (237% in the test layout), drag and keyboard scroll position changes, trace/undo, and a two-tab stale edit. The conflicting draft remained unsaved; close warned; guarded reload recovered the earlier saved version without the stale text. Temporary QA zones were removed and the temporary second tab closed. Inspected 812x912, 1280x800 and 390x844 layouts. Final dev.46 stela rendered without the shadow bands. No actual notebook file-chooser round trip, corrupted browser-storage UI injection, touch device, full screen-reader audit or quantitative frame-time benchmark was performed; these limits are not replaced by unit-test success.
- Rehashed the four canonical archaeological files unchanged. No new source-photo bytes, survey registration, GitHub push or live CI run. Release manifests are regenerated after the final tests/docs and verified before delivery.
- Final browser error-log query returned no errors. Restored the normal viewport and left the dev.46 artifact overview open; no temporary QA annotations remain in the saved notebook.

### Source-bound dimensions, predicted color and story workspace — 2026-09-17

- Added published-dimension references and limits in the Sphinx workspace. The hindquarter envelope now targets SIS's approximate 19.3 m width; a rounded-top Dream Stela mesh is constrained to ARCE's reported 3.5 m height. Harvard's approximate 3.6 m alternate is displayed, not silently discarded. Local profiles, stela width/thickness/position, foreleg definitions and repair blocks remain illustrative; no registered surface or real metric fit was acquired.
- Added Inspect/Restoration/Story navigation to the Inscription Lab. The restoration workspace compares untouched originals with either a separate manual color layer or a pre-generated AI example, offers 100–300% zoom, brush/undo, notes and alternatives, and persists bounded prediction strokes in backward-compatible v1 notebooks. Prediction authority is forced on import and cannot be promoted by translation review. Manual review packets include visual predictions and warnings; no live model provider/OCR/automatic translation is connected.
- The built-in image-generation tool produced one Kurohito-photo-based educational color adaptation. Its baked warning, original/output hashes, CC BY-SA 3.0 attribution, exact prompt and visual limitations are documented in public/epigraphy/RECONSTRUCTION-RECEIPT.md. It is excluded from the evidence-image catalog. Fine marks/contours may be altered; no recovered signs, authentic pigment map or calibrated confidence is claimed. Story cards distinguish ministry context, Harvard's narrative paraphrase, ARCE's contextual pigment and a linked-only Digital Giza squeeze record.
- Final npm run check passed: strict TypeScript, inherited scientific/static validators, 25 registration tests, 11 component tests, 7 usability tests, 12 Sphinx tests and 16 epigraphy tests (71 total), plus Workbench build. New tests exercise stela height/source conflict, legacy notebook migration, prediction round trip/non-promotion, malformed/injected/bounded strokes and generated asset identity. Desktop compiler passed as 0.10.12+dev.43. The existing large-main-chunk warning remains.
- Browser checks at 1280x800 exercised source/prediction comparison, manual stroke/undo, persisted rationale across close/reopen, story navigation, source-bound dimension disclosure, isolated rounded-top stela, and final dev.43 zoom at 100/300%. All test-only zones were removed after verifying persistence. Final error-log query returned none; temporary viewport override was reset and the AI comparison left open. Narrow/touch/accessibility flows and actual notebook file chooser exchange were not re-tested in this pass; import/export schema behavior is unit tested. Fixed shell-control styling to load globally before the lazily loaded inscription stylesheet.
- All four canonical archaeological hashes were rehashed and remain unchanged. No new authoritative photograph or survey scan was acquired this pass; previously bundled licensed photos remain available. No GitHub push or live CI run was performed. Release manifests are regenerated and verified after these records, using the repository's normal seal process.

### Internal-system inspection and Dream Stela epigraphy — 2026-09-17

- Added temporary shell-removal inspection: external envelopes and procedural masonry are hidden together; 22 non-hidden/non-UNVERIFIED internal components can be filtered by system, fitted to view and opened in existing isolated detail models. Layer choices are preserved for restoration. Full-workspace reset and return from a detail model clear the temporary inspection mode. Sphinx bedrock exposure hides the synthetic repair layer and freestanding stela; no hollow Sphinx interior is asserted.
- Added a native-dialog Inscription Lab reachable from Quick Views and Sphinx controls. It provides source-bound normalized reading zones, fit/zoom/contrast/grayscale, interpretive traces/undo, 1,072 searchable base-block Unicode sign identities, transliteration/translation/interpretation fields, citations, operator review, local drafts and JSON exchange. Bounded imports append as drafts; AI/external proposals stay separate and unreviewed. No OCR/model provider or automatic translation is connected; no validated reading or missing-text recovery is claimed.
- Acquired three unchanged licensed image files: Kurohito Dream Stela detail photograph (CC BY-SA 3.0), HoremWeb context photograph (CC BY-SA 4.0), and Lepsius facsimile (public domain). Credits, source links, licenses, dimensions and SHA-256 hashes are in `public/epigraphy/SOURCES.md`. Bundled unmodified Noto Egyptian font with OFL notice and Unicode data license. The font character map covers every palette sign. No source image was interpreted as a registered surface scan.
- Final `npm run check` passed: strict TypeScript, inherited validators, 25 registration tests, 11 component tests, 7 usability tests, 7 Sphinx tests and 12 new inspection/epigraphy tests (62 total). New tests cover subset filtering/nonmutation, normalized explosion bounds, coordinate validation, malformed imports, draft/review boundaries, proposal isolation, image hashes, sign identities and font coverage. Desktop TypeScript/Vite build passed as `0.10.12+dev.36`. The pre-existing large-main-chunk warning remains; this is not a performance certification.
- Browser checks exercised whole-interior and burial/lower subsystem filters, selected-object detail opening, reset to full shell, Sphinx bedrock exposure, entry/exit of the lab, three-column and narrow stacked layouts, photo/facsimile switching, saved annotation restoration, code search, 400% zoom, trace/undo, incomplete-review rejection, unreviewed AI proposal import, and removal of test-only zones. The bundled font fixed a missing-glyph system-font fallback seen during testing. Checks included 812×912 and 1280×800 layouts plus the final dev.36 page; final error-log query returned none. Temporary viewport override was reset. Sphinx left open on dev.36. Touch gestures, screen-reader flow, multi-tab draft conflicts, storage exhaustion, actual file-chooser notebook import/export and full accessibility/performance coverage were not end-to-end tested; schema/round-trip functions are covered by unit tests.
- Rechecked all four canonical archaeological file hashes unchanged. Explorer/font HTTP checks and Workbench health passed. No GitHub push or live CI run was performed for these changes. Current audit and next priorities are in `docs/INTERIORS_AND_EPIGRAPHY.md`; the earlier roadmap remains a dated snapshot.

### Sphinx exterior study workspace — 2026-09-17

- Added a dedicated Sphinx workspace reachable from Project Explorer and Quick Views. Ten selectable/hidden/isolated anatomical or study regions, animated explosion, 250 instanced synthetic repair blocks, section clipping, wireframe, schematic geology palette, overall-dimension annotations, preset cameras, expanded viewing, optional turntable and JSON/GLB export. Existing Khafre controls/data remain separate.
- Source links and limitations are recorded in `src/sphinx/catalog.ts` and `docs/SPHINX_EXPLORER.md`. Geometry is hand-parameterized ILLUSTRATIVE_RECONSTRUCTION, not a registered surface scan or mapped stone inventory. Exploded bedrock regions are inspection aids. No unknown chambers, tunnels, intact missing features, exact inscriptions, or measured repair chronology are asserted. No third-party mesh/photo assets were repackaged.
- Full `npm run check` passed: strict TypeScript, inherited validators, 25 registration tests, 11 component tests, 7 usability tests and 7 Sphinx tests (50 total). Sphinx tests cover deterministic/clamped explosion, source-region identity, block transforms, finite indexed geometry and display extents. Final desktop compiler build dev.30 passed; large main-bundle warning remains. No CI result is claimed for these unpushed changes.
- Browser checks at 812×912 (initial build) and 1280×720 exercised Sphinx entry, exploded/assembled poses, repair layer, front/head isolation, clipping, geology/wireframe controls and expanded/restored controls. Final dev.30 left open on the Sphinx; error-log query returned none. Individual block picking/highlighting, continuous manual drag/zoom, reduced-motion preference and narrow mobile layouts are implemented but not exhaustively interactively tested.
- Exported an exploded GLB with repair instancing and an assembled dev.30 GLB; both reloaded successfully using Three.js GLTFLoader. Final assembled file: 2,012,256 bytes; computed display extent 73.5 × 20.1656 × 19 m in glTF Y-up. The 20.1656 m extent includes illustrative bevels, not a new measurement. Source links/authority/frame metadata survived export. Shader grain, text labels and section clipping are not baked. Assembled copy delivered outside the repository as `GIZA-Sphinx-Exterior-dev30.glb`.
- Rechecked all four canonical SHA-256 hashes unchanged. Scientific registration and geometry-promotion gates were not altered. Root release remains 0.10.12, with development build stamps external to sealed files.

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
