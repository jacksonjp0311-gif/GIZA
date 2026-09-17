# PRIMARY PLAN PARSER — v0.10.4

PRIMARY PLAN PARSER is the custody and extraction boundary between **a plan being known to exist** and **a plan being allowed to contribute metric geometry**.

## Current state

- 7 registered plan/source families
- 25 normalized plan/room extractions
- 3 explicit reconstruction/measurement conflicts
- 0 checksum-bound raw plan files newly cached in this runtime
- 0 plan-derived geometry promotions

## Source families

1. Hölscher 1912 Plate III — Khafre Pyramid Temple overview plan
2. Hölscher 1912 Plate X — causeway / lower-complex sections
3. ARCE Sphinx Project — Khafre Valley Temple detailed map, published inventory scale 1:100
4. Perring 1840 Vol. II Plates I–IV — Second Pyramid section/passages/chambers
5. Maragioglio & Rinaldi Khafre plates — acquisition target
6. Digital Giza Pyramid Temple reconstruction/bibliographic surface
7. Digital Giza Valley Temple reconstruction/bibliographic surface

## Truth boundary

`REMOTE_DIGITIZED_VIEW_NOT_CACHED`, OCR text, archive inventory metadata, and published scale labels are useful evidence, but none are equivalent to parsing the original image/PDF bytes.

A metric extraction may be promoted only after:

1. rights/access state is known;
2. source bytes are locally possessed;
3. SHA-256 is recorded;
4. source page/plate is identified;
5. source scale and coordinate assumptions are parsed;
6. calibration/control residuals are stored;
7. an independent check succeeds;
8. FIELD/VAULT authorizes promotion.

## Conflict policy

The parser preserves competing reconstructions. In particular, the Khafre Pyramid Temple statue court is not treated as having one unquestionable reconstruction. Architectural traces, emplacement evidence, later scholarly reconstructions, and inferred statue form/placement remain separate.

The five western chapel spaces are architecture; exact cult contents/function remain interpretation unless direct evidence strengthens them.

## Machine-readable artifacts

- `public/model/plan_parser/plan_sources.json`
- `public/model/plan_parser/extractions.json`
- `public/model/plan_parser/conflicts.json`
- `public/model/plan_parser/manifest.json`
- `PRIMARY_PLAN_PARSER_MANIFEST.json`

## Non-negotiable invariant

**Plan availability is not metric geometry.**

---

## v0.10.5 source expansion

The registered plan/source layer now contains **13 plan/source records and 34 normalized extractions**, including more exact Digital Giza records for Maragioglio & Rinaldi Khafre Valley Temple, Sphinx/Valley, Pyramid Temple, and pyramid-interior plans/sections, plus explicit model-source-lineage metadata.

Raw-byte verification remains zero in this runtime. Cataloged plan identity and plan-title metadata are not substitutes for downloading, hashing, scaling, and registering the actual plate image.

## v0.10.6 source-byte handoff

PRIMARY PLAN PARSER remains a normalized fact/locator layer. SOURCE-BYTE REGISTRATION now owns local-byte custody, SHA-256, rights gates and plan-registration jobs. No plan-parser extraction is allowed to bypass that boundary.
