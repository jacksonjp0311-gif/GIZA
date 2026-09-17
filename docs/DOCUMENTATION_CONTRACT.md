# GIZA Documentation Contract — v0.10.2

Every release must keep README, CHANGELOG, GIZA, CONTINUITY, validation, architecture, roadmap, findings, phase documentation and machine-readable manifests mutually consistent.

For RITUAL MAP specifically:

- label every map with a truth class and geometry authority;
- never describe schematic coordinates as survey coordinates;
- preserve native survey frame and unresolved translation/vertical state;
- never infer a camera position from photo availability;
- never call a ritual route recovered testimony;
- never call intent-map indices historical probabilities;
- map animation/glow may not imply stronger evidence;
- document all map source IDs in the canonical source registry;
- keep the atlas inside the central viewport and preserve five-mode global navigation + docked inspector;
- map interaction may select/navigate objects but may not promote geometry/evidence maturity.

## v0.10.3 documentation requirement

Any release that changes SOURCE PARSER or ACTION GRAPH must synchronize parser targets/receipts, action seeds/compiled graph, map layer, findings, README, ROADMAP, ARCHITECTURE, CONTINUITY, validation and both release manifests. Claims of raw-byte parsing require exact source SHA-256 and vault asset IDs.


## v0.10.4 documentation requirement

Any room/plan claim must preserve source ID, locator, custody state, truth class, geometry authority, and whether coordinates are schematic or metric.

## v0.10.5 documentation requirement

PLAN CONCORDANCE releases must document source-family dependence, reconstruction conflicts, and zero geometry-write authority. VISIBILITY LAB releases must state whether geometry is schematic or metric and must report the number of metric rays explicitly. A nonzero metric-visibility claim requires registered wall/opening geometry, source/frame provenance, uncertainty, and residual validation.

## v0.10.6 documentation requirement

Any plan registration claim must report byte custody, rights gate, hash, page/plate locator, scale/frame interpretation, controls, holdouts, fit model, residuals, outlier policy, uncertainty and review state. Any metric-view claim must identify the exact registered geometry and height assumptions used.

## v0.10.7 registration documentation rule

Any archaeological registration must publish source SHA-256, exact page/plate locator, crop receipt, frame definition, frozen fit controls, frozen holdouts, fit model, full residual table, threshold profile ID, pass/fail state and manual-review outcome. A screenshot overlay without those receipts is not a GIZA registration.
