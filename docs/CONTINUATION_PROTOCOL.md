# GIZA Continuation Protocol — v0.10.2

This protocol exists so development can move between providers/models or human maintainers without hidden conversation state.

## Cold-start procedure

1. Read `README.md` for current scope.
2. Read `CONTINUITY.json` for machine-readable state/invariants.
3. Read `AGENTS.md` for coding/release rules.
4. Read `docs/ARCHITECTURE.md`.
5. Read `docs/DESIGN_SYSTEM.md` and every file under `docs/design/` before changing UI.
6. Read `docs/RESEARCH_FINDINGS.md` and the JSON registry before proposing experiments.
7. Read `VALIDATION.md`; run `npm run check` and `npm run validate:visual` before modifying anything.

No conversation history is required.

## Version evolution

Preserve the previous version. Increment product/release identity coherently. Add numerical behavior outside React, bind it through typed data loaders, integrate visualization through existing scene layers, and expose controls through the existing NEXUS workstation.

A feature version may change panel content. It may **not** silently change the NEXUS shell. Moving docks, changing primary navigation, replacing the brand, changing global proportions, or replacing typography hierarchy requires explicit human approval as a design-version change.

## Truth firewall

`SOURCE`, `MEASURED`, `DERIVED`, `ASSUMED`, `SIMULATED`, and `UNVERIFIED` have stable meanings across providers. A model/provider change must never relabel evidence merely because a simulation is compelling.

## Handoff success condition

A fresh maintainer with only this repository should be able to state: current product/release identity, architecture, truth invariants, visual invariants, active solvers, current findings, unresolved gates, next phase and exact validation commands.

## Registration checkpoint

Before treating any ATLAS image as metric evidence, inspect `public/model/registration/manifest.json`, camera priors, world-control candidates, registration jobs and survey-control sources. A new provider/model must preserve the distinction between a camera prior, an image correspondence, a solved transform and a promoted evidence candidate. Run `npm run registration:benchmark` and `npm run validate:registration` before modifying registration math or promotion logic.


## CONTROL NET cold-start note

Before changing photo registration, read `docs/CONTROL_NET.md`, `public/model/control_net/frames.json`, `survey_points.json`, `orientation_receipts.json` and `quality_gates.json`. A survey yaw prior is not a survey translation, and projective DLT is not calibrated PnP.

## ARCHIVE HARVEST checkpoint

Before making broad historical/technology claims, read `docs/ARCHIVE_HARVEST.md`, `public/model/corpus/knowledge_nodes.json`, and `claim_matrix.json`. A confirmed source is not automatically a measured fact, and a strongly supported archaeological interpretation is not a metric survey. Run `npm run validate:corpus` after any corpus edit.

## v0.10.0 primary-source checkpoint

Before extracting a new high-authority datum, read `docs/PRIMARY_SOURCE_VAULT.md` and `public/vault/assets.json`. Prefer an exact locally hashed asset. If only a remote verified source exists, preserve that state and do not invent byte-level provenance. Restricted access must never be bypassed.

## v0.10.1 intent-reconstruction checkpoint

INTENT RECONSTRUCTION is an interpretive layer above evidence/geometry. It contains competing hypotheses, evidence-independence groups, falsifiers and test programs. Never quote the generated indices as probabilities. The strongest current baseline is royal mortuary transition + continuing royal cult; solar/cosmic and state-integration interpretations are contextual; distant-future message, machine function and advanced computation remain unestablished/unsupported pending direct evidence.


## v0.10.2 ritual-map checkpoint

RITUAL MAP is a central-viewport cartographic surface, not a sixth global mode. Read `docs/RITUAL_MAP.md` and `public/model/maps/manifest.json` before editing maps. Preserve schematic-vs-metric distinction, GPMP native-frame state, unresolved horizontal translation/vertical tie, zero photo georeference authority without solved camera poses, and intent-score non-probabilistic semantics. Run `npm run validate:maps` after any map data/UI edit.

## v0.10.3 continuation checkpoint

Continue from SOURCE PARSER + ACTION GRAPH only after reading `docs/SOURCE_PARSER.md`, `docs/ACTION_GRAPH.md`, and the parser/action manifests. Do not convert `NORMALIZED_OBSERVATION` receipts into `RAW_PRIMARY_BYTES` claims unless checksum-bound local vault assets actually exist. ACTION GRAPH is behavioral reconstruction, not ancient testimony; every new ACTION node must cite parser records and keep geometry authority at NONE.

## v0.10.4 continuation checkpoint

Continue from ROOM GRAPH + PRIMARY PLAN PARSER only after reading `docs/PRIMARY_PLAN_PARSER.md` and `docs/ROOM_GRAPH.md`. The plan parser currently contains normalized remote/source-derived records, not locally checksum-bound plan bytes. ROOM GRAPH coordinates are schematic. No future provider may treat them as surveyed walls, distances, sightlines, room areas or geometry authority. The next legitimate promotion path is source bytes → checksum → frame/scale parse → residual-controlled registration → review.

## v0.10.5 continuation checkpoint

Read `docs/PLAN_CONCORDANCE.md` and `docs/VISIBILITY_LAB.md` before extending room/plan analysis. Preserve source-family independence groups and conflict records. The current VISIBILITY LAB is pre-metric: zero line-of-sight rays, no wall polygons, and no experiential claims. The next valid escalation is checksum-bound source-plan registration, not reuse of schematic UI coordinates.

## v0.10.6 continuation checkpoint

Read `docs/SOURCE_BYTE_REGISTRATION.md`, `docs/METRIC_VIEW_LAB.md`, and `docs/EMERGENCE_REPORT.md` before metric work. Remote visibility of a PDF/IIIF asset is not custody. Never set `raw_byte_verified=true` without local bytes + SHA-256. Never cast metric rays from ROOM GRAPH schematic coordinates.

## v0.10.7 first-plate checkpoint

Before continuing, read `docs/PLATE_REGISTRATION.md`, `docs/FIRST_PLATE_CAMPAIGN.md`, `public/model/plate_registration/preregistered_thresholds.json`, and `public/model/plate_registration/first_plate_campaign.json`.

Do not alter the frozen similarity model, holdout minimums, outlier policy or acceptance thresholds after archaeological residuals are observed. If the Petrie fit fails, preserve the failure and design a separately preregistered follow-up experiment.
