> v0.9.9 ARCHIVE HARVEST note: this subsystem remains active beneath the new confirmed-source corpus. Shared OBSERVATORY artifacts were versioned to 0.9.9; scientific/sample semantics are unchanged unless explicitly listed in `docs/ARCHIVE_HARVEST.md`.

# GIZA v0.9.6 // REGISTER

REGISTER is the strict evidence-normalization layer over OBSERVATORY.

Its job is not to collect the largest number of links. Its job is to make every useful fact computationally inspectable with: source ID, exact locator, scope, truth class, geometry-write authority, confidence, discrepancy state, rights status and acquisition path.

## New registers

- `material_samples_khafre.json`: exact mechanical sample rows.
- `material_physical_khafre.json`: exact petro-physical sample rows.
- `source_discrepancies.json`: unresolved conflicts that must not be averaged away.
- `claims_registry.json`: claims kept separate from observations/evidence.
- `source_status.json`: retractions and other publication-status changes.
- `plan_register.json`: stable archival-plan identifiers and scopes.
- `evidence_matrix.csv`: flat cross-domain index for analysis/software ingestion.
- `public/media/observatory/ATTRIBUTION.json`: per-asset attribution contract for later caching.

## Promotion rule

Nothing in REGISTER directly edits `parts.json`. Geometry promotion still requires VAULT/CANON/FIELD review. A high-quality plan can cross-check geometry. A licensed photo can support photogrammetry. A sample can improve solver priors. None of those actions silently converts the source into monument truth.

## v0.9.6 media registration extension

REGISTER now carries media collection scope, per-asset rights/attribution and photo-observation truth classes. The strict boundary is unchanged: registration is not promotion. See `docs/ATLAS_INGEST.md`.
