# GIZA // VAULT Evidence Pipeline

VAULT makes evidence maturity an axis separate from provenance.

A photograph can be an authentic SOURCE while still being only E0 for metric geometry. A reconstructed passage can be DERIVED yet E3 because it is tightly survey-constrained.

## Maturity ladder

- **E0 REFERENCE_ONLY** — useful context; no metric geometry mutation.
- **E1 CALIBRATED_SINGLE_VIEW** — local 2-D estimate from calibrated pixels; DERIVED only.
- **E2 MULTIVIEW_RECONSTRUCTION** — camera-solved, scaled multi-view geometry with QA.
- **E3 SURVEY_CONSTRAINED** — tied to published/direct survey dimensions and a coordinate frame.
- **E4 MAPPED_ELEMENT** — a specific slab/stone/object boundary is metrically identified.
- **E5 INDEPENDENTLY_VALIDATED** — independently reproduced by a second modality/team.

## Promotion invariants

1. Appearance alone never promotes geometry.
2. A single photograph cannot promote a stone to E4.
3. Simulation never promotes UNVERIFIED geometry to MEASURED.
4. Every mutation cites immutable evidence IDs.
5. Every mutation creates a new revision; old geometry remains auditable.
6. Solver output is always SIMULATED.

## Local evidence registration

Register a local file without promoting it:

```bash
npm run register:evidence -- PHOTO ./my-photo.jpg src.commons.khafre.interior part.burial.chamber
```

The file is hashed and copied into `public/model/evidence/inbox/`. The record starts as:

```text
rights_status: NEEDS_REVIEW
geometry_status: QUARANTINED
evidence_maturity: E0
```

That quarantine step is deliberate. Registration is not model mutation.

## Promotion evaluation

```bash
npm run evaluate:promotion -- part.sarcophagus.body
```

The evaluator reports the highest explicit maturity receipt currently bound to that target.

## Current examples

- Pyramid geometric envelope: E3 survey-constrained.
- Passage network: E3 survey-constrained.
- Burial chamber: E3 survey-constrained.
- Sarcophagus body/lid: E4 mapped element.
- Open photographs by themselves: E0 until calibrated/reconstructed.
