# GIZA v0.10.11 // RESIDUAL FIELD + CONSTRAINT HIERARCHY


**GIZA NEXUS — evidence-governed spatial reverse-engineering workstation for Khafre and the Giza complex.**

v0.10.11 hardens the transition from a remotely visible historical plan to a reproducible archaeological registration. The first target remains Petrie 1883 **Plate VI — The Granite Temple of Khafra, at Gizeh**.

> Remote file identity is not byte custody. Provider metadata is not a cryptographic checksum. A named landmark is not a pixel coordinate. A fitted historical plan is not automatically canonical geometry.

## What changed

### 1. The intended remote PDF is now fingerprinted without pretending it is hashed

Wikimedia Commons identifies the current Petrie PDF as a 315-page, 8.87 MB public-domain file associated with Internet Archive identifier `cu31924012038927`. The source page also records the current file-history event and PDF metadata.

GIZA stores those values as:

```text
REMOTE_PROVIDER_METADATA_FINGERPRINT_NONCRYPTOGRAPHIC
```

They identify the intended remote object, but they do **not** substitute for a SHA-256 computed over locally possessed bytes.

### 2. Two additional real byte-transfer attempts were made

On 2026-09-15 the current runtime attempted:

```text
Petrie Project PDF endpoint       FAILED — binary transfer unavailable
Wikimedia original-file endpoint FAILED — binary transfer unavailable
```

The research browser can read the PDF and Plate VI, but the container cannot place those external bytes into the working filesystem. GIZA records that operational distinction rather than fabricating custody.

Canonical frozen state:

```text
local Petrie PDF bytes              0
local Petrie SHA-256                NONE
checksum-bound Plate VI render      0
frozen archaeological controls      0
frozen archaeological holdouts      0
archaeological registered plans     0
metric wall polygons                 0
metric visibility rays               0
```

### 3. Local custody import is now deterministic

A networked/local operator can provide the exact PDF directly:

```bash
node scripts/source_bytes/import-petrie.mjs --file <petrie.pdf>
```

The importer:

1. checks the PDF signature;
2. verifies a 315-page document with `pdfinfo`;
3. computes SHA-256 from the exact received bytes;
4. copies those bytes into `public/vault/raw/`;
5. binds the hash/path/page count into the custody receipt;
6. grants byte custody only — **zero geometry authority**.

### 4. Plate VI must be rendered from those exact bytes

```bash
npm run plate:render-vi
```

The renderer extracts PDF page 305 at 300 dpi and hashes the resulting PNG. Landmark coordinates may bind only to that checksum-bound render.

The operator must inspect the local image and explicitly record confirmation:

```bash
npm run plate:confirm-vi
```

That confirmation is a human review receipt: it asserts the local render is visibly Plate VI with the expected title/scale. It does not assert that Petrie's plan is metrically correct.

### 5. Landmark names are preregistered before pixels exist

v0.10.11 defines ten distributed Plate VI landmark IDs across:

```text
WEST_LOCULI
TRANSVERSE_HALL
T_HALL
EAST_TRANSITION
CAUSEWAY
```

Every template coordinate remains `null` in the frozen release.

This lets us decide *what kinds of points count* before seeing fit residuals, while preserving zero pixel authority until the checksum-bound local render exists.

To freeze a real set:

```bash
npm run plate:freeze-landmarks -- --input <landmark-json>
```

The freeze gate requires:

- source PDF SHA-256 match;
- Plate VI render SHA-256 match;
- explicit visual confirmation;
- ≥4 controls;
- ≥2 holdouts;
- controls spanning ≥3 sectors;
- holdouts spanning ≥2 sectors;
- finite source-pixel and target-meter coordinates;
- controls/holdouts frozen before fitting.

### 6. The old fit gate remains unchanged in spirit

The first archaeological solve targets the local frame `PLATE_LOCAL_METERS` and is still restricted to a 2-D similarity transform with untouched holdouts and no automatic outlier deletion. A pass yields only:

```text
PLATE_LOCAL_METRIC_CANDIDATE_REQUIRES_MANUAL_REVIEW
```

It does not solve GPMP→Khafre translation and does not mutate canonical geometry.

## One-flow desktop handoff

```powershell
.\scripts\desktop\Invoke-GizaPlateVI.ps1 -LocalPdf "C:\path\to\petrie.pdf"
```

Then inspect:

```text
public/vault/derived/petrie1883_plate_vi_p305.png
```

After inspection, rerun with explicit confirmation and a completed landmark file:

```powershell
.\scripts\desktop\Invoke-GizaPlateVI.ps1 `
  -LocalPdf "C:\path\to\petrie.pdf" `
  -ConfirmPlate `
  -Landmarks ".\my_plate_vi_landmarks.json" `
  -RunFit
```

The script stops at the highest authority allowed by the supplied evidence.

## Current truth state

```text
registered sources                    73
normalized observations              129
source-parser records                  26
room spaces                            24
room thresholds                        21
plan concordance facts                 14
source-byte candidates                  4
acquisition attempt receipts            4
named Plate VI landmarks               10
source-qualified scalar dimensions     22
synthetic similarity benchmark       PASS

checksum-bound Petrie PDFs              0
checksum-bound Plate VI renders          0
frozen archaeological controls           0
frozen archaeological holdouts           0
archaeological registered plans          0
metric wall polygons                      0
metric visibility rays                    0
real solved camera poses                  0
GPMP → Khafre translation                 UNRESOLVED
vertical survey tie                       UNRESOLVED
```

## Scientific meaning

The release does not claim a new archaeological registration. Its advance is that the first registration is now **operationally reproducible and resistant to post-hoc landmark selection**.

The authority chain is explicit:

```text
remote source identity
    ↓
local exact bytes
    ↓ SHA-256
local Plate VI render
    ↓ render SHA-256
visual plate confirmation
    ↓
named landmark coordinates
    ↓ freeze controls + holdouts
SIMILARITY_2D fit
    ↓
untouched holdout residuals
    ↓
manual review
```

Any missing link keeps archaeological metric authority at zero.

## Commands

```bash
npm run plate:benchmark
npm run validate:source-bytes
npm run validate:plate-registration
npm run validate:metric-view
NODE_PATH=$(npm root -g) npm run check
npm run source-bytes:manifest
npm run plate:manifest
npm run release:manifest
```

## Next

**v0.10.11 // FIRST ARCHAEOLOGICAL FIT + RESIDUAL FIELD**, once local Petrie bytes are available.

The next meaningful transition is not a prettier overlay. It is a frozen, checksum-bound residual receipt that either passes or fails without tuning.


## v0.10.11 — Residual Field

The next archaeological fit will no longer collapse disagreement into one RMS number. Every untouched holdout residual vector is retained and analyzed spatially under preregistered diagnostic rules.

The first constraint-hierarchy hypothesis is also frozen before the Petrie residuals exist: internal hall/threshold relationships may be more protected than exterior approach/causeway transitions. Uniform survey error and random measurement error remain explicit nulls.

Current archaeological registered plans = **0** and metric rays = **0**.
