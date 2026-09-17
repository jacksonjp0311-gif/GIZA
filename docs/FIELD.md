# GIZA v0.8 // FIELD

FIELD is the reality-binding layer of GIZA.

It does **not** replace NEXUS, FORGE, VAULT, or CANON. It consumes them:

```text
NEXUS  -> interaction / camera / HUD
FORGE  -> spatial entities / analysis cells
VAULT  -> evidence maturity / receipts / promotion gates
CANON  -> source authority / conflicts / rights
FIELD  -> world registration / terrain / photo graph / uncertainty / mapped-stone promotion
```

## 1. WGS84 context anchor

FIELD now carries a context-grade WGS84 anchor for the Pyramid of Khafre:

- latitude: `29.976000° N`
- longitude: `31.130969444° E`
- source: Wikidata record for the Pyramid of Khafre
- vertical datum: **UNRESOLVED**
- precision status: **CONTEXT_ANCHOR_ONLY**

The anchor is not allowed to overwrite the local survey geometry. It establishes a geographic bridge only.

`src/lib/field.ts` provides a WGS84 small-area EN conversion for context plotting. Z remains unresolved until a vertical datum and survey tie are supplied.

## 2. Terrain

FIELD knows about the approved coarse terrain/site-context products, but no DEM bytes are bundled in this release.

Therefore:

```text
terrain_active = false
render_status = NO_DEM_BYTES_INGESTED
```

The existing flat plateau reference remains a clearly labeled reference plane.

A desktop terrain file must pass:

```text
SOURCE BYTES
 -> SHA-256
 -> NATIVE CRS
 -> VERTICAL DATUM / EXPLICIT UNKNOWN
 -> LOCAL TRANSFORM RECEIPT
 -> QA
 -> DISPLAY
```

Use:

```bash
npm run field:terrain -- <file> <source_id> <native_crs> [vertical_datum]
```

Registration creates a quarantined receipt. It does not turn the layer on.

## 3. Photo graph

Every current GIZA photo/diagram is now a graph node with:

- target objects
- view class
- calibration status
- camera pose status
- photogrammetry role
- source page
- license

Edges are conservative. A shared target does **not** mean two photos overlap geometrically.

Current graph:

- 6 nodes
- 5 semantic/candidate edges
- 3 view clusters
- 0 solved cameras

No 3-D camera frustum is rendered until a camera solve exists.

## 4. 3-D uncertainty

FIELD does not treat missing uncertainty as zero.

Numeric envelopes currently exist only where explicit uncertainty was already present in the model:

- Khafre reconstructed height / slope / azimuth
- lowest granite casing course height
- sarcophagus body length
- sarcophagus lid length

In Reverse Engineer mode the scene can render a wireframe uncertainty envelope around the selected object.

## 5. Mapped stones

The 10,152 FORGE cells remain `ASSUMED` analysis cells.

A stone-promotion chain is:

```text
ASSUMED ANALYSIS CELL
 -> PHOTO-CONSTRAINED CANDIDATE
 -> MULTIVIEW / SURVEY-CONSTRAINED
 -> E4 MAPPED ELEMENT
 -> REVIEW
 -> CANONICAL REPLACEMENT
```

Creating a candidate does not mutate geometry:

```bash
npm run field:stone-candidate -- cell.c049.N.022 <evidence_item_id>
```

Evidence below E4 produces a blocked candidate.

## 6. FIELD inspector

The actual application now includes a sixth object-inspector tab:

```text
OVERVIEW | SPECS | PHOTOS | EVIDENCE | CANON | FIELD
```

FIELD answers:

- Where is this object relative to the geographic anchor?
- Is the local/world tie survey-grade or context-grade?
- Which photos potentially observe it?
- Are camera poses solved?
- What explicit numeric uncertainty exists?
- What is its current promotion state?
- What observations are missing?
- Is real terrain active?

## 7. Hard truth guards

- No DEM bytes -> no real terrain claim.
- No camera solution -> no camera frustum claim.
- No numeric uncertainty -> not `±0`.
- No E4 receipt -> no mapped-stone promotion.
- No vertical datum -> no geodetic Z.
- No survey tie -> WGS84 anchor remains context-grade.
- The 31 deep-claim entities remain `UNVERIFIED`.
