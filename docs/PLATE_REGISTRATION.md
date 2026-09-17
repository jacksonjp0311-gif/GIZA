# PLATE REGISTRATION — v0.10.7

## Purpose

v0.10.7 freezes the **first archaeological plan-registration protocol before seeing archaeological residuals**.

The system deliberately separates two authorities:

```text
PLATE_LOCAL_METERS
  └─ room-scale metric geometry / openings / intra-building rays

KHAFRE / GPMP GLOBAL FRAME
  └─ plateau placement / monument alignment / geodesy
```

A valid plate-local registration does **not** solve the global Giza transform. Conversely, unresolved GPMP→Khafre translation does not prevent a checksum-bound, scale-correct plan from supporting internal metric visibility.

## Fit model

The first campaign is restricted to a 2-D similarity transform:

\[
\begin{bmatrix}X\\Y\end{bmatrix}
=
\begin{bmatrix}a&-b\\b&a\end{bmatrix}
\begin{bmatrix}x\\y\end{bmatrix}
+
\begin{bmatrix}t_x\\t_y\end{bmatrix}.
\]

This preserves one uniform scale, rotation and translation. It cannot shear the source to make it agree.

Affine or projective escalation is forbidden after observing a failed similarity fit unless a **new protocol is preregistered** and scan distortion is independently justified.

## Frozen historical-plan gate

`threshold.historical_plan_similarity.v1` requires:

- ≥4 fit controls;
- ≥2 holdouts excluded from the fit;
- controls distributed across both axes and the usable plate footprint;
- normalized holdout RMS ≤ 0.0075 of target-frame diagonal;
- normalized worst holdout ≤ 0.015;
- absolute holdout RMS ≤ 0.30 m when target coordinates are metric;
- scale drift ≤ 1% where an independent scale expectation exists;
- no automatic outlier deletion.

The numerical thresholds are **engineering acceptance gates**, not archaeological probabilities. They are frozen before the first Petrie fit specifically to prevent tuning them after seeing the result.

## Synthetic benchmark

`npm run plate:benchmark` fits a known similarity transform with deterministic millimetric noise using six controls and three unseen holdouts. The benchmark must pass, but its authority effect is explicitly `false`.

It validates the algorithm and receipt structure only.

## Real registration

`npm run plate:register` refuses to run unless:

1. source bytes exist locally;
2. their SHA-256 matches the candidate receipt;
3. control and holdout coordinates have been frozen before fit;
4. minimum counts are satisfied.

The first real result is emitted as a **plate-local metric candidate requiring manual review**, never directly into canonical geometry.

---

## v0.10.11 custody/render extension

The registration protocol now binds pixel coordinates to two hashes: the exact local Petrie PDF SHA-256 and the SHA-256 of the locally rendered Plate VI image. Named landmark classes are preregistered while their coordinates remain null. This blocks both remote-screenshot substitution and post-hoc point selection.
