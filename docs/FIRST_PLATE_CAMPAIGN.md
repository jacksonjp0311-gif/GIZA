# FIRST PLATE CAMPAIGN — Petrie Plate VI

## Target

**W. M. Flinders Petrie, _The Pyramids and Temples of Gizeh_ (1883), Plate VI: “Plan of the Granite Temple.”**

The Granite Temple is the Khafre Valley Temple in the historical terminology represented in the current corpus.

## Remote identity state

Two independent source families establish the document identity:

- Wikimedia Commons exposes the Internet Archive scan `cu31924012038927`, reports 315 pages / 8.87 MB, and marks the file public domain.
- Digital Giza catalogs Petrie’s 1883 volume as a published document in the Giza corpus.

These facts establish **remote source identity and acquisition legality**, not local byte possession.

Two automated byte-transfer attempts were made in this execution environment. Both failed because external binary transfer was unavailable. Therefore:

```text
raw_byte_verified = false
local_path        = null
sha256            = null
registered_plan   = 0
metric_rays       = 0
```

No substitute image or reconstructed plate is allowed.

## Campaign sequence

```text
remote provider identity
        ↓
legal byte acquisition
        ↓ SHA-256
visual confirmation of Plate VI scan page
        ↓
freeze fit controls + independent holdouts
        ↓
SIMILARITY_2D fit on controls only
        ↓
evaluate frozen holdouts
        ↓
PASS ──→ manual review ──→ plate-local wall/opening extraction
FAIL ──→ preserve failure; do not tune threshold/model post hoc
```

## Cross-source holdout

The modern ARCE Sphinx Project archive independently reports detailed Khafre Valley Temple mapping at **1:100**. The future comparison is deliberately not “warp ARCE to Petrie.” Each source must be registered independently first.

At least five shared architectural holdouts will then be compared across sectors:

- east entrances;
- T-hall junction;
- west wall;
- north arm;
- south arm.

That gives GIZA a way to discover systematic historical survey offsets instead of forcing two plans to agree.

## What would count as progress

The first meaningful transition is not a prettier overlay. It is:

```text
actual_registered_plans: 0 → 1
```

with a checksum-bound source, frozen holdouts and a residual receipt that was not tuned after the fact.

---

## v0.10.11 execution handoff

The current runtime again failed direct binary transfer even though the research browser can read the 315-page PDF. The campaign therefore adds a deterministic local import path, page-305 renderer, explicit human confirmation receipt and landmark-freeze gate. The frozen release still contains zero Petrie bytes and zero archaeological coordinates.
