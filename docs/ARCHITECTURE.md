# GIZA Architecture — v0.10.6 SOURCE-BYTE REGISTRATION + METRIC VIEW LAB

## v0.11.0 additive evolution

See [evidence boundaries](EVIDENCE_BOUNDARY_EVOLUTION.md) and [scoped source campaigns](SOURCE_CAMPAIGN.md). Shared observation validation now spans runtime/assembly/graph/receipt boundaries; computation fingerprints differ from full archival hashes; saved studies restore original geometry; optional loading is independent of core model entry. Existing specialized workspaces and the shared registration engine are retained. The historical architecture below remains documented rather than rewritten.

v0.10.6 inserts a hard custody/registration boundary between PLAN CONCORDANCE / ROOM GRAPH and any future metric viewshed claim.

```text
remote / archival sources
        ↓
PRIMARY SOURCE VAULT + rights policy
        ↓
PLAN PARSER + PLAN CONCORDANCE
        ↓
SOURCE-BYTE REGISTRATION
(bytes → SHA-256 → plate locator → scale/frame → controls/holdouts → residual receipt)
        ↓
registered walls / openings [CURRENTLY EMPTY]
        ↓
METRIC VIEW LAB [CURRENTLY 0 RAYS]
        ↓
visibility / reveal / access tests
        ↓
INTENT / ACTION hypotheses (never automatic promotion)
```

Parallel physical-control branches remain CONTROL NET, FIELD, REGISTRATION LAB and SIMLAB.

## Current authority state

- Remote source candidates: 4.
- Local checksum-bound plan candidates: 0.
- Registered metric plans: 0.
- Metric wall/opening polygons: 0.
- Metric sightline rays: 0.

The existing ROOM GRAPH and VISIBILITY LAB remain valid as **topological** analysis only.

## Registration rule

A metric plan registration must preserve source-specific scale/frame interpretation, at least four control correspondences, at least two holdouts, the fit model, residuals, an outlier policy chosen before inspection, uncertainty and manual review. Agreement between two sources is measured after independent registration; one source may not be warped to make another look correct.

## UI

METRIC READINESS is atlas view #11. It exposes blockers instead of synthesizing missing geometry. The global NEXUS shell and five primary modes remain locked.

---

## v0.10.7 frame authority split

The registration architecture now distinguishes local metric authority from global geodetic authority:

```text
SOURCE BYTES + SHA-256
        ↓
PLATE CROP / SCALE
        ↓
FROZEN CONTROLS ── fit ──> PLATE_LOCAL_METERS
        │                       │
        └─ FROZEN HOLDOUTS ─────┤
                                ↓
                     wall/opening candidates
                                ↓
                   intra-building metric rays

PLATE_LOCAL_METERS  ≠  KHAFRE_LOCAL  ≠  GPMP_NATIVE
```

Only a separately reviewed transform may bridge these frames. This prevents room-scale visibility work from silently acquiring plateau-wide alignment authority.
