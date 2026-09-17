# GIZA v0.10.2 // RITUAL MAP

## Purpose

RITUAL MAP turns the central NEXUS viewport into a second, scrollable cartographic intelligence surface without changing the locked workstation shell. It is designed to answer spatial questions that are difficult to see in the 3-D model alone:

- how the Giza monuments relate across the plateau;
- how Khafre's lower and upper complex form a constrained sequence;
- where published survey control actually exists and where transforms are still unresolved;
- how geology/quarry relationships constrain construction sequence;
- how documentation evolved from historical exploration to modern 3-D recording;
- which physical features support or limit competing intent hypotheses;
- where open photography exists versus where real camera registration is still absent.

## UI contract

RITUAL MAP is **not** a sixth global navigation mode. The top-level NEXUS navigation remains:

`DISCOVER · EXPLORE · REVERSE ENGINEER · ANALYZE · SIMULATE`

Inside the central viewport, a local surface switch toggles between `3D MODEL` and `MAP ATLAS`. The right Object Inspector remains a docked grid column, Quick Views remain below the central viewport, and the atlas scrolls **inside** the viewport.

Keyboard shortcut: `M` toggles 3-D ↔ MAP ATLAS.

The Project Explorer now opens specific atlas views for Survey Data, Historical Maps, Sphinx/geology, Valley Temple/causeway, Open Source Photos and Intent Reconstruction.

## Seven map views

### 01 — Plateau Master

A cinematic topology-preserving schematic of Khufu, Khafre, Menkaure, the Sphinx, Sphinx Temple, Khafre Valley Temple, Pyramid Temple and broader work-infrastructure context.

**Truth class:** `SCHEMATIC_CONTEXT`  
**Geometry authority:** `NONE`

The positions are intentionally nonmetric. This view is for relationships and navigation. It must never be used as survey control.

### 02 — Ritual Route

A lower-to-upper architectural sequence:

`lower approach → Valley Temple → causeway → Pyramid Temple → pyramid/burial focus → continuing cult`

The surviving architecture and documented royal-pyramid-complex function are evidence. Exact ceremonies, words, theology and intended audience remain interpretive.

**Truth class:** `EVIDENCE_LINKED_INTERPRETATION`  
**Geometry authority:** `NONE`

### 03 — Survey Control

Plots published GPMP-native horizontal control records with exact stored eastings/northings and a separate Khafre orientation inset.

Current locked state:

- Khafre casing-foundation orientation prior: `-4.45 arcmin` from cardinal;
- side RMS residual: `0.7921489759 arcmin`;
- measured survey points represented by the orientation receipt: `54`;
- GPMP → Khafre local translation: `UNRESOLVED`;
- vertical datum/tie: `UNRESOLVED`.

The pyramid is **not** drawn onto the GPMP metric plot because that transform is not yet solved.

### 04 — Geology / Quarry

A relational geoarchaeological cross-section linking plateau bedrock, Khafre causeway foundation, Sphinx quarry/enclosure and lower temple terrace.

This view makes construction-order constraints visible while remaining explicitly nonmetric.

### 05 — Historical Record

A documentation stack from nineteenth-century exploration/survey through ARCE/GPMP and modern drone/photogrammetry/laser/muon work.

This is a history of **observation and recording**, not a construction chronology.

### 06 — Intent Reconstruction

A radial evidence map of all eight competing intent hypotheses around the Khafre complex. Existing `evidence_balance_index` and `coverage_index` values drive visualization only.

Scores are not probabilities.

### 07 — Photo Coverage

A coverage/readiness matrix for reviewed exterior, interior, masonry, lower-complex and historic-plan assets.

It keeps the critical distinction:

`photo exists` ≠ `camera solved` ≠ `geometry promoted`.

Current real solved camera poses: **0**.  
Current photo-derived geometry promotions: **0**.

## Atlas layers

The sticky atlas control exposes eight display layers:

- MON — monuments
- RIT — ritual sequence
- SUR — survey controls
- SRC — source evidence
- UNC — uncertainty / unresolved gates
- INT — intent models
- GEO — geology
- PHO — photo coverage

These are presentation layers only. Disabling or enabling a layer does not change evidence state.

## Data roots

```text
public/model/maps/
├── manifest.json
├── layers/
│   ├── plateau_master.json
│   ├── ritual_route.json
│   ├── survey_control.json
│   ├── geology_quarry.json
│   ├── historical_sources.json
│   ├── intent_map.json
│   └── photo_coverage.json
├── narratives/
│   └── ritual_sequence.json
└── styles/
    └── cartography_tokens.json
```

UI implementation:

```text
src/maps/
├── types.ts
├── AtlasNavigator.tsx
├── MapVisuals.tsx
└── MapAtlasPanel.tsx
```

Validation:

```text
scripts/maps/validate-maps.mjs
npm run validate:maps
```

## Evidence rules

1. Schematic coordinates are visual/topological only.
2. Metric coordinates retain native frame and datum state.
3. No map may write canonical geometry.
4. Ritual sequence is a hypothesis-bearing interpretation, not recovered testimony.
5. Intent-map scores remain triage indices, not probabilities.
6. Photo coverage has no camera-pose authority.
7. Published survey variants are preserved instead of silently averaged.
8. Cinematic styling may never obscure truth class, uncertainty or geometry authority.

## Design intent

The atlas is deliberately cinematic: glowing survey grids, animated ritual routes, source markers, uncertainty gates, scanlines, sticky indexing and internally scrollable large-format map sections. The visual language remains NEXUS blue/cyan with amber reserved for interpretation/caution and green/red reserved for readiness/critical semantics.

The atlas is extraordinary by **information density and legibility**, not by inventing terrain or geometry.

## Next phase

Recommended next phase: **v0.10.3 // SOURCE PARSER + ACTION GRAPH**.

The map system is now ready to receive exact room-level geometry, finds, inscriptions, thresholds and movement constraints once rights-cleared primary bytes are acquired and parsed with source locators. The next objective is to bind `place → action → evidence → likely ritual/function` edges to exact source provenance.

---

## v0.10.3 refinement — ACTION GRAPH

RITUAL MAP now has an eighth internal atlas view: **ACTION GRAPH**. It visualizes the source-addressed place → action → place model compiled from `public/model/action_graph/graph.json`.

The visual grammar is deliberately epistemic:

- cyan rounded rectangles = PLACE / physical or find context;
- amber diamonds = ACTION / behavioral reconstruction;
- source glyph = linked parser provenance exists;
- evidence ring = triage strength only, never probability;
- dashed/qualified edges = inferential or contextual connections.

ACTION GRAPH remains nonmetric and cannot mutate geometry. The map exists to expose what evidence supports an action hypothesis and where the model still has missing room-level data.


## v0.10.4 refinement — ROOM GRAPH

The atlas now contains nine views. ROOM GRAPH adds 24 source-addressed spaces and 21 thresholds with schematic coordinates only. Its purpose is to expose architectural grammar and research gaps, not to draw surveyed walls.

---

## v0.10.5 refinement — VISIBILITY LAB

MAP ATLAS now has ten internal evidence views. VISIBILITY LAB overlays ROOM GRAPH with topological depth, branch/merge state, articulation/chokepoint state, and qualitative environment transitions.

The view is explicitly pre-metric. It renders **zero metric sightline rays** and cannot infer illumination, occlusion, ritual restriction, or subjective experience from schematic node positions.

## v0.10.6 refinement — METRIC READINESS

The atlas now contains eleven views. METRIC READINESS exposes source-byte, rights, registration and residual blockers for Petrie, Perring, Hölscher and ARCE plan families. It displays workflow readiness but contains zero registered plan geometry and zero metric sightlines.
