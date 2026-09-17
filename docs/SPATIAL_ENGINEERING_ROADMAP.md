# GIZA — repository audit and spatial engineering roadmap
Date: 2026-09-17
Repository: https://github.com/jacksonjp0311-gif/GIZA (private, main)
Scope: source/data inspection, existing automated checks, publishing/clone integrity. This is an engineering audit, not an archaeological survey. Recommendations below have not been implemented.

## Executive assessment

GIZA is a promising evidence-aware spatial workstation, not yet a survey-grade digital twin. Its strongest foundation is the immutable source-registration workflow, explicit uncertainty/provenance, separate components, and synthetic regression controls. The next leap should be one fully traceable sarcophagus–lid–room experience, not a larger catalog of visually convincing unsupported structures.

Snapshot: 56 catalog parts = 24 DERIVED + 1 ASSUMED + 31 UNVERIFIED. There are 127 original measurement records and 22 supplemental observations. Runtime media combine 13 original + 15 supplemental records (28 records / 27 distinct normalized source pages, including drawings). 37 parts have no bound media; that includes all 31 unverified components. Thirteen parts reference CAD, but eight of those are unverified helices: CAD presence is not evidence of reality. The 10,152 masonry instances are procedural analysis cells, not individually surveyed ancient stones.

## Findings, ranked by impact

| Priority | Finding and code evidence | Consequence / recommended change |
|---|---|---|
| P1 | LeftRail.tsx renders static projectTree; App.tsx stores filter but does not apply it. | Search appears functional but has no result filtering. Connect it to a real part index, results, keyboard navigation and no-results state. |
| P1 | App.tsx passes animationSpeed and showDimensions only to ObjectInspectorPanel.tsx; neither reaches SpatialViewport/GizaScene. ComponentWorkbench maintains a separate dimensions state. | Visible controls have no corresponding global scene effect. Make each control target explicit; wire or remove it and test behavior, not just markup. |
| P1 | DetailGeometry.tsx has local source-derived sarcophagus orientation/placement; overview uses canonical Part spatial data. The earlier component audit records their orientation disagreement. | Overview-to-detail transition is not a single engineering frame. Introduce reviewed object-to-assembly transforms and compare both representations before promotion; do not silently rewrite canonical data. |
| P1 | detailCoverage in componentDetails.ts filters by broad atlas measurement_components. Many passage parts each display the same 59 rows. | Counts exaggerate component-specific coverage. Bind observations to face/edge/feature IDs and distinguish direct, assembly-context and unrelated measurements. |
| P1 | MonumentLayer.tsx scales selected geometry by 1.018. | Selection changes displayed dimensions by 1.8%. Use outline/highlight-only selection; future measurement tools must operate on canonical geometry, not presentation transforms. |
| P1 | Header counts every non-UNVERIFIED part as evidence-bound, including the ASSUMED lower portcullis. | Presence of a record does not equal evidential support. Split measured/derived/assumed/unverified counts and expose authority per feature. |
| P1 | loadModel in model.ts fetches the entire bundle with one Promise.all; getJson casts JSON without runtime schema validation. No React error boundary was found. workspace.ts shallow-merges stored values without validating enum/number domains. | One optional dataset failure or bad persisted view can disable the workstation. Validate inputs, load core model first, isolate optional panels, add recoverable errors and WebGL-context recovery tests. |
| P2 | Desktop Launch-GIZA.ps1 is outside this repository; in-repo Start-GIZA.ps1 defaults to Workbench and Explorer starts dev server without compile/version workflow. No tracked package-lock.json or CI workflow. | A clone does not reproduce the desktop experience. Add a portable repo-relative launcher, locked dependency install and Windows/Linux CI; never copy personal absolute paths into the launcher. |
| P2 | README contains superseded claims that the Explorer build was unverified; verification/explorer-build.log preserves an older failed build. | Separate historical evidence from current run receipts with date, commit and environment. Preserve history but publish an authoritative current startup/verification guide. |
| P2 | 'Photo Textures' affects gallery/thumbnail visibility; MonumentLayer uses colors and DetailMaterial procedural grain. | Rename this control until calibrated texture mapping exists; documentary photos are not registered surface textures. |
| P2 | DetailGeometry uses mean lid thickness, inspection lift, illustrative wall thickness and doorway height; lower height remains assumed. | Keep parametric simplifications explicit and feature-level. Exact replicas require registered scans/plates, not more decimal places or generated texture detail. |
| P2 | styles.css contains many layered overrides and !important rules; static layout validators largely search source strings. | Consolidate design tokens/component styles and add browser assertions at 390/812/1280/1920 px, including pointer/touch and reduced motion. Existing tests do not establish all of these behaviors. |
| P2 | Asset loading is mostly eager; production build has reported ~1.2 MB JS with a large-chunk warning. Masonry updates all instance transforms/colors on selection; selected outline does not reproduce every explode rotation/scale. | Profile real hardware, lazy-load atlas/detail/solvers, update selection color independently, and share transform computation for mesh and outline. No measured frame-rate regression is claimed by this audit. |

Relevant files: src/App.tsx; src/workstation/LeftRail.tsx; src/workstation/ObjectInspectorPanel.tsx; src/workstation/ComponentWorkbench.tsx; src/scene/ComponentScene.tsx; src/scene/DetailGeometry.tsx; src/scene/MonumentLayer.tsx; src/scene/MasonryLayer.tsx; src/lib/model.ts; src/lib/componentDetails.ts; src/lib/workspace.ts.

## What each Quick View should become

| View | Engineering destination | Evidence required / release gate |
|---|---|---|
| Full Pyramid | Original / surviving / evidence overlays, facade navigation, per-stone selection and LOD | Control network + mapped joints; procedural cells remain visibly distinct |
| Exploded | Hierarchical course/face/assembly separation, travel limits, reassembly and saved sequence | Shared transforms; no invented historical construction sequence |
| Interior | Connected hollow spaces, collision-aware first-person and overview navigation | Room/passage cross sections and registered junctions |
| Underground | Isolated hypothesis comparison lab with uncertainty and falsification tests | Independent evidence before any promotion; unverified structures stay off by default |
| Cross Section | Movable orthogonal/oblique section planes with cap surfaces, dimensions and export | Intersections computed from canonical coordinate-aware geometry |
| Burial Chamber | Surveyed walls, photo stations, annotated defects, roof/floor cutaways | Wall/door/roof control, present-condition capture and uncertainty |
| Sarcophagus | Hollow measured body, scan/parametric comparison, tool-mark and pin/groove inspection | Scaled overlapping photos or licensed scan, bore profiles and registration residuals |
| Lower Chamber | Complete measured room/door profile and connected route | Missing height and doorway elevation; assumed values cannot pass the gate |
| Sarcophagus Lid | Tapered lid, edges and fit/clearance study; assembled vs inspection pose | Thickness distribution, closure constraints and present-day position |
| Roof & Chamber | Individually addressable roof beams, bearings and sectioned support relationships | Surveyed joints, beam extents and material properties before structural analysis |
| Upper Passage | Traversable granite corridor with slope/profile measurements | Segment-specific geometry and photo-camera stations |
| Portcullis | Slab/groove assembly with measurable clearance and collision-aware inspection | Slab/groove dimensions, missing portions marked unknown |
| Plateau View | Georeferenced terrain, survey stations and monument context | Resolved vertical datum and horizontal translation; flat reference is not terrain |

Khufu, Menkaure, Sphinx, Valley Temple, Causeway and Mastabas in the left tree currently route to atlas context rather than independent detailed 3D models. Give each a truthful availability badge and a separate acquisition/model package before marketing it as a complete model.

## A repeatable component contract

Every component should carry: stable ID; source and rights receipts; coordinate frame and units; feature-level observations with uncertainty; observed vs reconstructed vs hypothetical geometry; parametric source plus delivery mesh; material/texture provenance; parent-child constraints; selectable measurement anchors; LODs; and reproducible verification.

Use three distinct layers: **observed condition**, **historical reconstruction**, **hypothesis**. A beautiful model may exist in any layer, but switching layers must never silently upgrade its scientific authority. Make source photos, orthographic comparisons and residual maps available directly on a selected feature.

Proposed acceptance gates:
1. File hashes and rights are resolved; source-page attribution stays accessible.
2. Independent scale/control and held-out checks pass declared tolerances. Tolerances must come from acquisition capability and intended use, not be invented to make a fit pass.
3. Coordinate transforms and units survive import/export without drift.
4. Dimension/section tests pass; selected highlighting does not change physical size.
5. Geometry defects and uncertain regions are visible; no generated chips or joints are presented as observed.
6. On an agreed reference machine, target p95 interaction frame time <=33 ms at 1080p; record hardware, scene, DPR and warm/cold load metrics. This is a proposed target, not an achieved benchmark.

## Technology direction

- Use glTF/GLB for runtime assets and physically based materials while retaining source CAD/survey files and provenance sidecars. Khronos defines glTF PBR parameters; they improve material representation, not measurement authority. [Khronos PBR](https://www.khronos.org/gltf/pbr)
- Evaluate COLMAP on a licensed, overlapping, textured capture set for one small object first. Its SfM/MVS workflow does not make scattered web photos or an unscaled reconstruction metrically trustworthy. Add independent scale/control and inspection before promotion. [COLMAP tutorial](https://colmap.github.io/tutorial)
- Consider 3D Tiles only when real terrain/point-cloud/photogrammetric scale warrants streaming. Do not introduce a second rendering platform solely for the present 56-part catalog. [OGC 3D Tiles](https://www.ogc.org/standards/3dtiles/)
- Defer production structural/acoustic conclusions until mesh, material, boundary-condition and solver validation gates exist. Current analytical/synthetic controls are useful software checks, not validation of the actual monument.

## Recommended delivery sequence

**Phase 1 — trustworthy workstation.** Repair inert controls/search, isolate load failures, validate persisted state, unify selection and frames, make the launcher portable, lock dependencies, add CI/browser tests and current run receipts. Exit: fresh clone launches Explorer and workbench and passes checks without relying on desktop files.

**Phase 2 — flagship object.** Finish sarcophagus + lid + immediate burial-room context. Acquire missing surfaces legally; build one constrained asset with observed/reconstructed layers, meaningful clearances, sections, source hotspots and scan residuals. Exit: one exemplar passes the component contract, with every unresolved detail visible.

**Phase 3 — connected architecture.** Burial roof/floor, lower chamber, upper/lower passages and portcullis. Model hollow space and assembly connections; add measurements, camera bookmarks and reversible explode sequences. Exit: continuous navigation without frame jumps or false measurements.

**Phase 4 — stone and site scale.** Start with one surveyed facade patch, promote real mapped stones individually, then expand to terrain and other monuments. Exit: stone provenance survives LOD/export and geospatial control is established.

**Phase 5 — engineering experiments.** Parameter studies, conservative mass/volume estimates with uncertainty, and validated solver integrations. Exit: reproducible inputs/results and domain review; hypotheses remain separate.

No bulk geometry rewrite, new scans, solver upgrade or GitHub issues were created during this audit. The audit documents recommendations, not an implementation commitment.

## Per-component inventory

Counts below are UI-bound media references (photos **and drawings**, deduplicated by source page) and context-bound measurement rows. They are NOT counts of independent calibrated observations. A row with 59 measurements usually inherits a passage-group binding. CAD means a file reference, not validated geometry.

| Component ID / name | Provenance | CAD | Media refs | Bound rows | Missing / next evolution |
|---|---|---:|---:|---:|---|
| `part.plateau.reference` — Artificially leveled plateau reference | DERIVED | no | 0 | 0 | Bind survey control and vertical datum; replace flat reference with surveyed terrain. Keep coarse DEM context separate. |
| `part.pyramid.khafre` — Khafre original casing envelope — Petrie mean | DERIVED | yes | 8 | 21 | Separate surviving masonry, original casing reconstruction and analysis cells; acquire facade overlap and map joints with stable stone IDs. |
| `part.casing.granite.lower` — Lowest granite casing belt — measured SW course | DERIVED | yes | 3 | 2 | Survey individual granite boundaries and material zones; replace the belt envelope with evidenced blocks and uncertainty. |
| `part.upper.entrance.reconstructed` — Upper entrance — lost casing extension | DERIVED | no | 0 | 8 | Maintain a ghosted historic reconstruction; dimension lost extension from registered plates, never present as surviving stone. |
| `part.upper.entrance.existing` — Upper entrance — surviving granite passage | DERIVED | no | 6 | 59 | Create traversable hollow passage with survey-backed cross sections, granite joints and matched photo stations. |
| `part.upper.roll` — Upper half-round roof roll | DERIVED | no | 0 | 8 | Acquire scaled profile and end views; replace simplified roll with constrained curved profile. |
| `part.upper.portcullis.slab` — Upper granite portcullis slab | DERIVED | no | 0 | 8 | Measure slab, grooves and clearances; add collision-aware sliding inspection with an explicitly hypothetical motion path. |
| `part.upper.horizontal.kj` — Upper horizontal K–J | DERIVED | no | 2 | 59 | Survey segment-specific profile, slope and endpoints; split shared measurement bindings; build connected hollow passage with sections and photo stations. |
| `part.upper.horizontal.jg` — Upper horizontal J–G | DERIVED | no | 2 | 59 | Survey segment-specific profile, slope and endpoints; split shared measurement bindings; build connected hollow passage with sections and photo stations. |
| `part.upper.horizontal.gh` — Upper horizontal G–H | DERIVED | no | 2 | 59 | Survey segment-specific profile, slope and endpoints; split shared measurement bindings; build connected hollow passage with sections and photo stations. |
| `part.lower.entrance.reconstructed` — Lower entrance — reconstructed pavement extension | DERIVED | no | 0 | 7 | Register pavement/entrance historical plans and attach uncertainty to the missing extension. |
| `part.lower.entrance.existing` — Lower entrance — surviving rock passage | DERIVED | no | 6 | 59 | Survey rough rock cross sections and doorway transitions; use navigable hollow mesh instead of solid envelope. |
| `part.lower.horizontal.bc` — Lower horizontal B–C | DERIVED | no | 2 | 59 | Survey segment-specific profile, slope and endpoints; split shared measurement bindings; build connected hollow passage with sections and photo stations. |
| `part.lower.horizontal.ce` — Lower horizontal C–E | DERIVED | no | 2 | 59 | Survey segment-specific profile, slope and endpoints; split shared measurement bindings; build connected hollow passage with sections and photo stations. |
| `part.lower.turning_recess` — Lower-route turning recess | DERIVED | no | 1 | 2 | Measure recess plan/elevation and clearance; retain drawing as interpretation until registered. |
| `part.lower.branch.cd` — Lower chamber branch C–D | DERIVED | no | 2 | 59 | Connect chamber branch with surveyed junction and wall profiles; retain independent uncertainty per segment. |
| `part.lower.chamber` — Lower / subsidiary chamber | DERIVED | no | 5 | 14 | Resolve height, roof and east doorway elevation; replace assumed 2.40 m cutaway with measured geometry. |
| `part.lower.portcullis.slab` — Lower granite portcullis — envelope only | ASSUMED | no | 0 | 2 | Verify existence, dimensions and position before replacing ASSUMED envelope; no fabricated slab detail. |
| `part.lower.connect.ef` — Connecting passage E–F | DERIVED | no | 2 | 59 | Survey segment-specific profile, slope and endpoints; split shared measurement bindings; build connected hollow passage with sections and photo stations. |
| `part.lower.connect.fg` — Connecting passage F–G | DERIVED | no | 2 | 59 | Survey segment-specific profile, slope and endpoints; split shared measurement bindings; build connected hollow passage with sections and photo stations. |
| `part.burial.chamber` — Great / burial chamber wall-volume envelope | DERIVED | no | 13 | 8 | Unify overview/detail coordinates; register walls, door and roof; add first-person navigation, section views and photo hotspots. |
| `part.burial.gable_envelope` — Burial chamber gable roof envelope | DERIVED | yes | 3 | 8 | Map each limestone beam and bearing; replace translucent roof planes with individually evidenced members. |
| `part.burial.floor_paving` — Burial chamber fine-limestone floor paving | DERIVED | no | 2 | 8 | Capture present paving and recess independently of original-floor reconstruction; map thickness range and disturbed areas. |
| `part.sarcophagus.body` — Khafre granite sarcophagus body | DERIVED | yes | 6 | 11 | Highest-priority exemplar: scaled multi-view capture, ledges, pin bores, edge damage and tool marks; compare scan against parametric model with residuals. |
| `part.sarcophagus.lid` — Khafre sarcophagus sliding lid | DERIVED | yes | 2 | 11 | Replace mean-thickness box with measured taper/edges, groove fit and condition; distinguish observed placement from inspection lift. |
| `part.upper.1` — Reported Upper Structure 1 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.upper.2` — Reported Upper Structure 2 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.upper.3` — Reported Upper Structure 3 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.upper.4` — Reported Upper Structure 4 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.upper.5` — Reported Upper Structure 5 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.shaft.alpha.1` — Reported Shaft Alpha 1 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.helix.alpha.1` — Reported Helical Path Alpha 1 | UNVERIFIED | yes | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.connector.alpha.1` — Reported Connector Alpha 1 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.shaft.alpha.2` — Reported Shaft Alpha 2 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.helix.alpha.2` — Reported Helical Path Alpha 2 | UNVERIFIED | yes | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.connector.alpha.2` — Reported Connector Alpha 2 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.shaft.alpha.3` — Reported Shaft Alpha 3 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.helix.alpha.3` — Reported Helical Path Alpha 3 | UNVERIFIED | yes | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.connector.alpha.3` — Reported Connector Alpha 3 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.shaft.alpha.4` — Reported Shaft Alpha 4 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.helix.alpha.4` — Reported Helical Path Alpha 4 | UNVERIFIED | yes | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.connector.alpha.4` — Reported Connector Alpha 4 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.shaft.beta.1` — Reported Shaft Beta 1 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.helix.beta.1` — Reported Helical Path Beta 1 | UNVERIFIED | yes | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.connector.beta.1` — Reported Connector Beta 1 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.shaft.beta.2` — Reported Shaft Beta 2 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.helix.beta.2` — Reported Helical Path Beta 2 | UNVERIFIED | yes | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.connector.beta.2` — Reported Connector Beta 2 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.shaft.beta.3` — Reported Shaft Beta 3 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.helix.beta.3` — Reported Helical Path Beta 3 | UNVERIFIED | yes | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.connector.beta.3` — Reported Connector Beta 3 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.shaft.beta.4` — Reported Shaft Beta 4 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.helix.beta.4` — Reported Helical Path Beta 4 | UNVERIFIED | yes | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.connector.beta.4` — Reported Connector Beta 4 | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.terminal.alpha` — Reported Terminal Chamber Alpha | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |
| `part.terminal.beta` — Reported Terminal Chamber Beta | UNVERIFIED | no | 0 | 0 | Hypothesis sandbox only: independent raw observations and registered location must precede geometry detail. Keep translucent, off by default and excluded from verified analysis. |

## Publication and verification

The user authorized creation/push on 2026-09-17. Repository visibility is private; default branch is main. Git identity uses the authenticated account's noreply address. Credential-pattern and sensitive-filename scans found no matches requiring exclusion; these scans are not a formal security audit. node_modules, dist, local vault bytes and environment/credential files are excluded. Historical verification logs are intentionally tracked because release manifests reference them. .gitattributes disables automatic line-ending conversion to preserve checksum-bound evidence.

Current automated checks include TypeScript, inherited model/evidence validators, 25 registration regression tests and 10 component tests. Release integrity verification checks all current manifest hashes. Historical verification files have not been relabeled as new results.

