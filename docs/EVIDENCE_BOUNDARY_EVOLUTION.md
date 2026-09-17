# Evidence boundary evolution — implementation checkpoints

Baseline: `557cbc275f60d801ba461f187fa33ebe173f040a`. The historical release identity 0.10.12 and 154-test result are not assertions about subsequent work. No audit ZIP was available at the checked Downloads path.

## Increment 1 — current implementation

Reproduced: permissive observation authority fallback, malformed observation values accepted by canonical import, numeric supplemental values assigned metres indiscriminately, geometry graph nodes inheriting scalar authority, shared-assembly traversal broadening support, and candidate-ID-only experiment selection.

Repairs use `observationContract.ts` across source adapters, runtime loading, canonical imports, graph parsing and receipt snapshot verification. Unsupported statuses fail closed. Recognized assumptions/simulations remain HYPOTHESIS and cannot construct the measured body. A null remains unknown; zero remains a legitimate scalar. Numeric observations require explicit compatible units; normalized quantities retain native values and conversion metadata. Reference endpoints and surfaces remain reconstructed independently of reported scalar authority. Hypothetical floor/orientation descriptions cannot resolve chamber placement.

Evidence queries declare DIRECT_SUPPORT, DERIVED_DEPENDENCIES, PLACEMENT or RELATED_CONTEXT. Context is not support. New receipts use `giza.evidence-receipt.v2`, evaluation rule `giza.comparison-rules.v2`, and a calculation dependency fingerprint distinct from the full archived graph hash. The interface permits current review only after a matching computation. Historical results retain original snapshots; old v1 receipts replay under their original semantics but cannot establish current applicability because they never recorded a dependency fingerprint. No archived receipt is upgraded in place.

The graph and assembly envelopes remain v1-compatible; additive quantity and geometry authority fields do not change canonical source records. A reviewer name records operator attribution, not authenticated scholarly review. There is no new archaeological registration, physical lid placement or site-frame resolution.

## Executed checkpoints

- `increment-1-20260917-a`: FAILED; new validator dependency was not resolved by the runtime test's in-memory module loader. Preserved unchanged.
- `increment-1-20260917-b`: complete `npm run check` PASS, including nine new boundary tests (163 total). Logs and generated benchmark outputs are retained under `verification/evidence-boundaries/`. Historical benchmark bytes were restored after checking that only generated timestamps differed.
- `increment-1-20260917-c`: complete `npm run check` PASS, 164 tests, including the additional placement regression and narrower positional dependency collection. This is the increment-1 software checkpoint, not a final release seal.

## Remaining ordered work

Increment 2 is not complete: shared visible-geometry fitting, analytic cap picking, saved investigation restore, independent optional loading, actual browser CI and measured performance remain required. Increment 3 is not complete: scoped acquisition/replay/revision workflow, positive/negative fixtures and real-source campaign assessment remain required. No performance improvement or archaeological completion is certified by the integrity tests.

Before release: complete remaining increments, update product/schema identities as appropriate, run full validation and browser suite, preserve historical seals, regenerate current manifests after final edits, then verify. Do not present this intermediate working tree as a sealed release.
