# GIZA v0.9.9 // ARCHIVE HARVEST

ARCHIVE HARVEST turns GIZA's evidence backend into a traceable cross-domain knowledge corpus. It does not treat web visibility as truth, and it does not allow a confirmed historical fact to become metric geometry merely because the source is reputable.

## Scope

The current harvest covers official Egyptian monument records, Digital Giza catalog records, Perring's 1840 primary survey/exploration volume, British Museum and Metropolitan Museum collection records, UNESCO heritage context, AERA/ARCE construction-sequence and workforce archaeology, peer-reviewed radiocarbon context, Giza geology/materials, open-media assets, modern survey/muography status, and the existing CONTROL NET.

## Four-layer truth model

1. **SOURCE** — who published it, access/rights, scientific authority and source status.
2. **OBSERVATION** — the normalized claim actually supported by that source.
3. **KNOWLEDGE NODE** — a cross-source statement with verification state, caveat and authority boundary.
4. **CLAIM MATRIX** — hypotheses/interpretations tracked independently from evidence.

A source can be authoritative for chronology and still have zero geometry-write authority. A museum record can establish object provenance without supplying survey coordinates. An open photograph can be reusable but still uncalibrated.

## New corpus entry points

- `public/model/corpus/knowledge_nodes.json`
- `public/model/corpus/knowledge_matrix.csv`
- `public/model/corpus/historical_timeline.json`
- `public/model/corpus/monument_inventory.json`
- `public/model/corpus/claim_matrix.json`
- `public/model/corpus/verification_receipts.json`
- `public/model/corpus/open_media_candidates.json`
- `public/model/corpus/harvest_status.json`

## Important confirmed/strongly supported additions

- Official Egyptian records describe Khafre's pyramid core as local limestone, preserved upper casing as fine Tura limestone, and the Valley Temple as massive limestone encased in granite with alabaster floors and monolithic granite pillars.
- Egyptian Ministry and AERA/ARCE sequencing strongly support a Khafre-period lower-complex program in which the Valley Temple predates the Sphinx Temple and causeway construction precedes the Sphinx quarry phase.
- Perring's 1840 primary record documents the burial chamber roof, sarcophagus setting, wall holes and a historical water stain; these are historical observations, not modern survey/hydrology.
- The British Museum independently records Belzoni's entry/discovery date as 2 March 1818.
- Digital Giza indexes 17 finds for the Valley Temple and 5 for the Pyramid Temple; those are catalog counts, not claims of excavation completeness.
- The Met records a Khafre-name architrave probably from the pyramid temple and later reused in Amenemhat I's pyramid at Lisht.
- AERA's Area C re-excavation favors storage/craft use rather than the older “workers barracks” label.
- Radiocarbon is retained as an independent chronology constraint with explicit old-wood/context caveats. More than 450 organic samples were collected across the wider Old/Middle Kingdom program; the count is not Khafre-specific.
- Aigner's geology identifies lithology, joints and faults as important controls on the Giza plateau morphology.
- The 2025 ScIDEP paper is stored as a peer-reviewed muography project/method status, not a completed hidden-void result.

## Extraordinary-technology baseline

The corpus now explicitly records the claim “Giza builders possessed AI/computers or modern-equivalent computational technology” as `NO_DIRECT_EVIDENCE_FOUND`. That is not a proof of impossibility. It is the current audited evidence state. Precision, scale, organization and repeatable geometry are evidence of sophisticated engineering; by themselves they are not evidence of digital computation.

## Harvester

`npm run corpus:harvest` performs a metadata/status/hash fetch against public registered URLs only. It does not bypass logins, paywalls, robots/access controls, or cache response bodies. In this chat sandbox Node networking remains unavailable, so the generated harvest status records `FETCH_ERROR`; the source facts in this release were verified using the available live web-research path instead.

## Promotion rule

No ARCHIVE HARVEST record modifies `public/model/parts.json`, the geometry snapshot, evidence maturity, or solved camera poses. Geometry changes still require the existing VAULT/FIELD/REGISTRATION/CONTROL NET promotion path.

## v0.10.3 downstream parser bridge

ARCHIVE HARVEST now feeds SOURCE PARSER. Confirmed-source knowledge nodes can be selected as behavioral evidence only after a source locator is preserved. The corpus has 35 knowledge nodes in this release. A normalized record remains distinct from raw source bytes; PRIMARY SOURCE VAULT is still the byte-custody authority.

## v0.10.5 concordance handoff

ARCHIVE HARVEST now feeds PLAN CONCORDANCE as well as SOURCE/PAN PARSER. The corpus remains at 40 knowledge nodes, but the plan evidence layer is deeper: exact plan/section records and source-lineage observations are compared for convergence, disagreement, and dependence before any metric-registration attempt.
