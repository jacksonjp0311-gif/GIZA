# CANON-01 — Exhaustive Evidence Expansion

## MISSION
Expand GIZA's evidence corpus using public/open research, archival, survey, photographic, geological, geospatial, and non-destructive-imaging sources. Convert discovery into machine-readable source authority, rights, object mappings, conflict records, and acquisition priorities.

## CANONICAL INPUTS
- `public/model/parts.json`
- `public/model/research/measurements.json`
- `public/model/evidence/source_registry.json`
- `public/model/evidence/evidence_items.json`
- `public/model/evidence/promotion_policy.json`
- `public/model/stone_registry.json`
- existing GIZA geometry and provenance contracts

## NON-NEGOTIABLE INVARIANTS
1. Never promote uncertain or controversial geometry because it is visually compelling.
2. Keep SOURCE/MEASURED, DERIVED, ASSUMED, SIMULATED, and UNVERIFIED distinct.
3. Keep source credibility, asset reuse rights, spatial resolution, and geometry authority as separate fields.
4. Public visibility is not redistribution permission.
5. Single-view photography cannot become metric geometry without calibration and uncertainty.
6. Satellite/DEM products cannot create stone-scale or chamber-scale geometry.
7. Khufu muography results are methodological precedents only; never write them into Khafre geometry.
8. The 31 deep-claim components remain UNVERIFIED absent independent reproduction.
9. Preserve conflicting measurements rather than averaging them silently.
10. Every canonical choice must state its precedence rule.

## ACCEPTANCE TESTS
- Source IDs are unique.
- Every source has access, rights, allowed action, authority scores, resolution, and roles.
- Every current model part has at least one source mapping or explicit claim-only mapping.
- All conflict records point to valid source IDs.
- All future-scope measurements are explicitly prevented from mutating the current 56-part model.
- All material-property values identify sample scope and solver limitations.
- All UNVERIFIED part provenance classes remain unchanged.
- A rights matrix and prioritized acquisition backlog are generated.
- Validator fails on illegal geometry authority or accidental deep-claim promotion.
- Human audit report explains what materially changed and what remains unresolved.
