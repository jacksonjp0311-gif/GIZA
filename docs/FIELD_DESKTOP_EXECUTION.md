# FIELD Desktop Execution Order

## Gate 1 — Real terrain

1. Acquire SRTM or another approved DEM source.
2. Save original bytes unchanged.
3. Run `field:terrain` to create a quarantine receipt.
4. Record native CRS and vertical datum.
5. Crop only in a derived working copy.
6. Establish geographic -> local GIZA transform from control data.
7. Compute horizontal and vertical residuals.
8. Only after QA may `display_allowed` become true.

## Gate 2 — Photo graph expansion

1. Crawl metadata before originals.
2. License-filter each file.
3. Hash originals.
4. Extract EXIF when present.
5. Group by semantic target and likely viewpoint.
6. Run feature matching.
7. Create edges only from actual match evidence.
8. Solve cameras.
9. Lock scale using survey-backed dimensions.
10. Store reprojection error and coverage metrics.

## Gate 3 — First mapped masonry

Recommended first targets:

1. surviving summit casing — multi-view exterior coverage
2. burial-chamber roof beams — constrained interior target
3. sarcophagus — validation benchmark because direct dimensions already exist

Do not start with the entire core masonry field.

## Gate 4 — Site expansion

After the Khafre local frame is tied to a site control network, expand toward:

- pyramid temple
- causeway
- valley temple
- Sphinx Temple / Sphinx
- subsidiary pyramid
- quarries and known surrounding archaeological features

Each enters at its actual evidence maturity.
