# Validation — rev.0003

**Status:** PASS  
**Parts:** 56  
**Assemblies:** 9  
**Interfaces:** 42  
**Survey datums:** 14  
**Measurement records:** 127  
**UNVERIFIED deep-claim parts:** 31

## Checks

- All JSON parsed locally.
- Every part parent resolves to an assembly.
- Every assembly child resolves to a part or assembly.
- Every interface endpoint resolves.
- Every referenced CAD preview exists.
- Every part under the deep-claim assemblies remains `UNVERIFIED`.
- Legon Table-II node distances reproduce Table-I passage lengths within rounding/reconstruction tolerance.
- `assembly_sequence.json` covers every part exactly once.
- Critical chamber-plan sentinels enforce lower chamber **10.45337 × 3.13309 m** and burial chamber **14.16431 × 4.97459 m** so passage-width variables cannot silently overwrite chamber widths.

### Passage reconstruction residuals

| Segment | Computed (m) | Table I (m) | Residual (mm) |
|---|---:|---:|---:|
| AB | 34.93867 | 34.94000 | -1.33 |
| BC | 7.88000 | 7.88000 | -0.00 |
| CE | 7.88000 | 7.88000 | +0.00 |
| EF | 14.65259 | 14.65000 | +2.59 |
| FG | 9.68593 | 9.69000 | -4.07 |
| GH | 39.37000 | 39.37000 | +0.00 |
| GI | 41.86000 | 41.86000 | +0.00 |
| GJ | 16.02000 | 16.02000 | -0.00 |
| JK | 2.58000 | 2.58000 | -0.00 |
| KL | 36.95331 | 36.95000 | +3.31 |
| CD | 6.70940 | 6.71000 | -0.60 |

## Deliberately unresolved

- **lower_passage.clear_height** — Not yet extracted from a primary metric table; rev.0003 uses 1.201166 m display envelope only.
- **lower_chamber.clear_height** — Primary-source vertical dimension not yet robustly extracted; render height 2.40 m is display-only.
- **lower_portcullis.dimensions_and_exact_position** — Existence documented by Petrie; current geometry is an ASSUMED visible placeholder.
- **passage_axis.azimuth_to_world_x_drift** — Petrie/Smyth azimuth retained; sign/frame reconciliation with local chamber placement deferred to joint fit rather than forcing false precision.
- **current_eroded_outer_surface** — No photogrammetric/current-surface mesh was ingested; main pyramid is original idealized survey envelope.

## Source disagreements preserved

- Petrie-derived original height: **143.8656 m**
- Egyptian Ministry summary: **143.5 m**
- Difference: **+0.3656 m**
- Petrie mean base vs ScIDEP rounded 215.3 m: **-0.0375 m**
- Petrie casing mean vs Smyth passage azimuth: **11 arcsec** difference.

See `research/results/rev0003_validation.json` for machine-readable results.
