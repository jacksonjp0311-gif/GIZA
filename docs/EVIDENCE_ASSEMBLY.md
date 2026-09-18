# Khafre Evidence Assembly / contract v1

Current 0.12.0 behavior is specified in [Live Evidence Integration](LIVE_EVIDENCE_INTEGRATION.md).
The dated 0.10.12 implementation description below is historical, not the
current product version. Measurement applicability now uses
canonical-measurement.v4; archived rules remain explicitly replayable.

The [boundary evolution addendum](EVIDENCE_BOUNDARY_EVOLUTION.md) documents shared observation validation, quantity metadata, query purpose and v2 receipt applicability. The original contract and historical results below remain preserved.

Implemented 2026-09-17 in place. The sealed product identity remains 0.10.12; the compile-first launcher produces a distinct development build. This module is `giza.evidence-assembly.v1`, not a revision of archaeological measurements. Historical module versions and failed registration receipts remain historical.

## Entry and scope

Quick Views → Sarcophagus, Sarcophagus Lid, Burial Chamber or Interior opens the lazy, full-width Evidence Assembly. Evidence / Measure / Section / Compare / Investigate / Views are contextual panels; close a panel for an unobstructed viewport. The preserved component viewer remains available under Views. Atlas, registration workbench, simulations, Sphinx, Inscription Lab and existing reference catalogs remain available.

The primary model is a **dimension-constrained idealization**, not an exact scan. The coffer is hollow, assembled from nonoverlapping analytic wall/base volumes for interrogation; these partitions are computational solids, **not separate ancient stones**. The chamber has zero-thickness boundary references, not invented wall thickness. The floor is an outline datum, not an invented complete paving slab/recess. The lid uses a mean-thickness envelope; taper and contact geometry remain unknown. Material grain is deterministic illustration, not a sampled archaeological surface.

## Audit and explicit frame hierarchy

| Frame | Datum / axes | Relation |
| --- | --- | --- |
| Coffer object | Rim centre, Z=0; X east, Y north, Z up; metres | Reconstructed local placement into assembly from source clearances; uncertainty UNKNOWN |
| Lid object | Underside centre, Z=0, metres | Physical pose in chamber UNKNOWN; parked inspection pose lives only in presentation code |
| Burial assembly | Mean room-plan centre; reconstructed paving/rim Z=0 | Archaeological transform into overview monument UNKNOWN |
| Monument overview | Original `parts.json` coordinates, unchanged | Existing FIELD orientation prior does not resolve translation/vertical datum |
| Site/world | Existing local ENU context | Metric assembly-to-world export blocked until control/datum evidence exists |

The legacy coffer has its long dimension east–west; the detail model follows the north–south source description. The legacy rim is 0.968248 m above the legacy chamber floor. Reconstructed north/south and west/east offsets also differ. These are separate, signed `detail − legacy` audit candidates, not automatically corrected archaeological positions. A **comparison-only** adapter aligns the reconstructed room datum with the legacy chamber floor to show both envelopes; it cannot enter measurement APIs.

Only rigid, right-handed metre transforms are accepted. Nonfinite values, scale/shear/reflections, conflicting paths, undeclared frames and inconsistent cycles are rejected. Unresolved edges are never identity transforms. Import/export preserves axes, units, datums, authority and nulls; it does not normalize unknown metadata by guessing. `importCanonicalAssembly` is a validation/exchange API, not a UI button that replaces the live canonical model.

## Presentation / physical invariant

`spatial.ts` accepts an Evidence Assembly, canonical points and an explicit frame. It has no selection, camera, isolation or explosion arguments. `presentation.ts` and `viewGeometry.ts` handle display parking and inverse pick mapping. Selection changes material/outline only. Camera bookmarks are session display state. Canonical export has an explicit top-level allowlist and excludes display state.

The lid never has a measured closed position in this release. Restoring its inspection pose is **not assembling a historical closure**. Cross-object body↔lid measurements return UNKNOWN. Same-object lid dimensions remain computable in the lid frame, unchanged by its parking/explode offset. A displayed connecting measurement line does not grant a physical transform.

## Spatial interrogation

- Point distance and A–B–C angle, actual surface picking or exact reconstructed corner/endpoint anchors; explicit output frame and coordinate readout. M opens measurement; F fits; C opens section; E toggles inspection separation; Escape closes the contextual panel. Form controls retain ordinary keyboard behavior.
- X/Y/Z or arbitrary azimuth/inclination section planes with exact numeric offset and slider, clipping, analytic caps and a 2-D section area preview. Cuts use declared physical frames. Unresolved objects are excluded from cross-frame cuts, not silently transformed. Caps preserve the cavity. A positive retained-half-space convention avoids counting a shared wall/base interface twice.
- Reversible object isolation, room context, top view, fit-to-current displayed assembly, session camera bookmarks and optional observation callouts.
- Reported scalar uncertainty is shown as an interval where supplied; otherwise UNKNOWN has a distinct dashed treatment. No covariance ellipsoid or confidence map is invented. Reported scalar intervals are not positional uncertainty.
- The comparison overlay uses preserved legacy dimensions/poses under the explicit comparison adapter. It is separately marked, never treated as observed geometry.

## Authority layers

OBSERVED = cited observations/scalars, not automatically observed spatial surfaces. RECONSTRUCTED = derived/idealized geometry and its anchors. HYPOTHESIS = untested proposals / assumptions. These states are encoded on features, observations and scene metadata, with independent visibility controls, distinct shapes/colors and explicit receipt-gated promotion requests. HYPOTHESIS is off initially.

Legacy meshes carrying MEASURED provenance are still reconstructed envelopes unless a direct surface survey is established. Procedural masonry and simulations are hypothetical analysis geometry. Existing UNVERIFIED underground visibility needs both its old explicit layer and HYPOTHESIS. The Sphinx adapter keeps photo-informed anatomy reconstructed, synthetic repair layout hypothetical, and published dimension annotations distinct from their reconstructed anchor positions. Sphinx GLB/view exports include authority and presentation-export metadata.

Promotion does not happen because a user likes a rendering. An explicit reviewer, rationale and evidence-gate evaluation produce a new receipt. Current spatial OBSERVED promotion is denied: this assembly has no authenticated direct feature survey/registration. Original records are never rewritten; even an allowed future reconstructed proposal would require a reviewed assembly revision.

## Feature evidence and UNKNOWN

Every measurable dimension/feature names exact observation IDs, sources, locators, native and SI units, reported uncertainty and derivation. Dimension callouts use reconstructed reference lines; they are not surveyed edge endpoints. The source-reported body/cavity/lid extents, opposing chamber dimensions, pin markers, ledge ranges and clearances remain separately addressable.

Pin depth/axis, groove profile, contact surfaces, actual lid placement, precise recess, beam joints, surface chips and present floor profile remain UNKNOWN. A reported scalar without a mapped location stays available as a scalar but produces no invented surface. Missing optional observations become explicit unavailable records, not numeric defaults.

The north doorway has a source-constrained plan interval and an explicit unresolved connection constraint to the existing upper-route interpretation. Its height/elevation tie is not supplied. The system does **not yet** offer a metrically connected walkthrough through all passages; unsupported spaces have not been generated to achieve one.

## Spatial Evidence Graph and investigations

`graph.ts` serializes typed nodes and directed relationships for features, observations, sources, source-byte state, registrations, frames, transforms, uncertainties, geometry, constraints, assembly, experiments, findings and receipts. A feature is not granted a neighbour's evidence merely because both share a model. Raw primary bytes/hash and assembly registration nodes explicitly remain UNKNOWN when unavailable. Source URLs and normalized observations are not custody receipts.

`intelligence.ts` emits deterministic **Investigation Candidates**, never discoveries: lid/body dimensional compatibility, thickness range, opposing chamber differences, legacy/detail transform discrepancies, unresolved constraints and independent-control gaps. Each includes exact inputs, computation, authority, uncertainty, null alternatives and falsification requirements. No statistical significance or ancient intentionality is inferred from a numerical coincidence.

Investigate → select candidate → inspect exact evidence / 3-D location → run computation → immutable experiment receipt → operator review → separate finding receipt. Reproducing arithmetic is not an independent archaeological test. Findings remain unauthenticated operator interpretations with no geometry-write authority.

Review drafts and the last sealed receipt remain mounted across contextual-panel/evidence detours. Unsealed draft text is session-only: leaving the assembly or reloading discards it. Sealed journal receipts persist; export for durable retention. Unreadable local journal bytes have a separate recovery-export action and are never overwritten by an empty journal.

Receipts include exact graph/input snapshot, SHA-256, release/build source hash, base commit plus dirty-state marker, environment and timestamp. Journal graph indexes are compact; full receipts remain in exported journals. Browser-local storage uses bounded schema/checksum/semantic validation, immutable ordered append, scope checks and optimistic stale-tab detection. Corrupt bytes are retained for export; quota/permission conflicts pause saving. This is not atomic multi-user storage or archival custody. Export receipts for durable retention. Hash validity proves content identity, not provenance authenticity.

## Registration comparison

The existing `scripts/plate_registration/engine.mjs` remains the sole governed fit engine. No profile minima, independent-scale gate, byte rehashing, freeze or holdout rules were forked or weakened. Compare can inspect the actual shared-engine result format in a separate plate-local control/holdout residual viewer, including selected residual coordinates and errors. Imports remain **IMPORTED_UNVERIFIED / metric authority NONE** even when a JSON record claims pass.

The repository's Plate VI campaign concerns the valley temple, not the sarcophagus. There is no accepted assembly image fit, registered photographic overlay, independent scale/control, holdout field, or frame tie to display. The UI reports this absence; it does not turn an uncalibrated reference photograph into metric evidence. Future source-byte-bound assembly campaigns must use the shared engine and add the explicit assembly-frame tie before model projection or metric promotion.

The residual display auto-fits supplied points, uses image-style Y-down display coordinates, and retains exact plate-local values. Keyboard-selected markers use non-scaling focus strokes. Imported campaign/frame/hash strings remain visible as unverified claims, not custody verification. Synthetic browser fixtures are never installed as archaeological datasets.

## Runtime and verification

For current 0.11.1 behavior, read `RELIABILITY_0_11_1.md`: strict graph semantic consistency, shared geometry membership, uncertainty-unit validation, measurement/comparison rules v3, explicit historical inspection and contextual dependency explanations supersede current-looking descriptions in older checkpoint sections. Existing schema envelopes and immutable historical records are retained.

Release 0.11.0 adds shared strict observation/quantity contracts, purpose-specific evidence queries, separate scalar/surface/placement authority, dependency-bound receipt v2, saved-investigation v2 with original-snapshot restore, and scoped campaign v1. Historical v1 records retain their original interpretation; missing metadata is not backfilled. See `EVIDENCE_BOUNDARY_EVOLUTION.md` and `SOURCE_CAMPAIGN.md` for executable contracts, compatibility rules and the fresh-user demonstration. Core startup now returns after the five required datasets; 45 optional datasets load independently with explicit status. Browser tests supplement rather than rename the historical visual contract checks.

All 50 startup dataset shapes have runtime contracts. Required geometry fails closed; optional unavailable/malformed data is quarantined with visible diagnostics and affected consumers gated. Sphinx, inscriptions, component detail, atlas and the new assembly are optional lazy workspaces with recoverable boundaries. WebGL context interruption preserves evidence/UI state and offers restoration/recreation where supported. Actual GPU driver recovery is browser-dependent.

Run `npm run check`, `npm run build` and `npm start -- --check`. New commands: `npm run test:evidence-assembly`, `npm run test:runtime`, `npm run validate:evidence-assembly`. To append an immutable targeted computation receipt: `node scripts/evidence/validate.mjs --output public/model/evidence_assembly/<new-unique-name>.json`. Exclusive creation refuses overwrites. This is not a replacement for the complete validation suite.

See VALIDATION.md and the new verification run receipt for executed tests and untested limits. Root release sealing happens only after final tests/documentation. Canonical archaeological JSON and frozen source/registration experiments must remain byte-identical.

## Next engineer

Read `AGENTS.md`, this document, `types.ts`, `assembly.ts`, `spatial.ts`, `graph.ts`, `receipts.ts`, then the existing registration engine. Preserve specializations; use adapters, not bulk relabeling. Highest-value next evidence is licensed primary coffer/chamber plate bytes, independently identified feature controls, uncertainty definitions, and physical lid contact/placement data. Do not resolve archaeological frames merely to match the older visual layout. For performance, the remaining large core is dominated by Three/React rendering; split the large legacy inspector before claiming comprehensive startup optimization.
