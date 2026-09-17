# GIZA v0.9.8 // CONTROL NET

CONTROL NET is the first survey-constrained registration backend in GIZA. It does **not** solve a real camera yet. It converts published survey measurements and GPMP frame/control information into explicit machine-readable constraints that Registration Lab can consume without silently changing canonical geometry.

## First survey-derived Khafre orientation receipt

Nell & Ruggles' December 2006 Total Station survey measured the Khafre casing-foundation sides independently:

| Side | points | DFC |
| --- | ---: | ---: |
| North | 13 | -3.8′ |
| East | 19 | -4.0′ |
| South | 11 | -5.8′ |
| West | 11 | -4.2′ |

CONTROL NET summarizes those four measurements with a common rigid-square yaw prior while retaining every side residual:

- common yaw: **-4.45 arcmin**
- degrees: **-0.0741667°**
- radians: **-0.00129445**
- RMS side residual: **0.792 arcmin**
- maximum side residual: **1.35 arcmin**
- side spread: **2.0 arcmin**
- measured points represented: **54**

The paper's independently repeated >10-point line agrees within 0.2′. GIZA stores that as repeatability context, **not** as the total absolute orientation uncertainty.

Receipt: `public/model/control_net/orientation_receipts.json`.

No `parts.json` coordinates were rotated.

## Coordinate frames

CONTROL NET separates four frames:

1. `frame.gpmp.native` — published GPMP northing/easting system; assigned origin N100000/E500000 at the computed Khufu center.
2. `frame.giza.local` — canonical Khafre engineering frame used by GIZA.
3. `frame.khafre.casing.2006` — orientation-only survey frame derived from the Total Station sides.
4. `frame.wgs84.context` — geographic context only.

The survey-to-Khafre-local **translation is still unresolved**. A yaw prior is not a full 2-D/3-D transform.

## Published control points

`survey_points.json` preserves published GPMP controls natively. Where a control has more than one published value, the values remain separate. In particular, G1.1 / Petrie Q has a 2012 publication value and a later 2015/re-established value separated by millimetres. CONTROL NET does not average them automatically.

SP4, south of the Khafre Valley Temple, is recorded at E500390.022 / N99459.759. No Z value is invented.

## Projective camera foundation

Registration Lab previously supported planar homography. CONTROL NET adds a pure-JS **PROJECTIVE_CAMERA_DLT** solver for >=6 3-D↔2-D correspondences.

This solves a 3×4 projective camera matrix only. It is **not calibrated PnP** and does not claim focal length, lens distortion, metric Euclidean pose or camera position.

Synthetic benchmark:

- exact fit RMSE: ~1e-12 px
- exact holdout RMSE: ~1e-12 px
- ±0.25 px deterministic-noise fit RMSE: ~0.073 px
- noisy holdout RMSE: ~0.284 px

Benchmark: `public/model/control_net/benchmarks/projective_camera.json`.

## Real-photo status

All real photo jobs remain unsolved:

- marked real pixel correspondences: **0**
- promoted real camera poses: **0**
- photo-derived geometry promotions: **0**

Exterior jobs now know that a survey-backed Khafre orientation prior exists. That is useful metadata, not a pose.

## Acquisition gate

The next concrete assets are already named and queued:

- `Giza-Corner-Points-2v17.kmz`
- `GPMP-Control-Monuments.kmz`
- `Petries-Stations.kmz`
- `GDFS-2015-Master-25iii17-edited-child.xlsx`

They are not represented as cached until their bytes are actually acquired and hashed.

## Commands

```bash
npm run controlnet:orientation
npm run controlnet:benchmark
npm run controlnet:build
npm run validate:controlnet
```

## Promotion firewall

A photo can only move toward metric geometry after:

`survey/control asset -> native frame record -> transform receipt -> pixel correspondences -> fit residual -> independent holdout -> review -> VAULT/FIELD promotion`

CONTROL NET v0.9.8 deliberately stops before the first real camera pose.
