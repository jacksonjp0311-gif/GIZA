# Acoustic Lab — Technical Contract

## Analytical cavity model

For a rectangular rigid-wall cavity:

```text
f_mnp = c / 2 * sqrt((m/Lx)^2 + (n/Ly)^2 + (p/Lz)^2)
```

with `(m,n,p) != (0,0,0)`.

This is applied to the current burial-chamber and lower-chamber envelope geometry. The burial chamber's real gabled roof is **not** fully represented by the rectangular screening envelope.

## Passage screening model

For an open/open 1-D passage:

```text
f_n = n c / (2 L)
```

ECHO uses this only as a mode-family screen. It does not model junction scattering, higher-order cross-sectional modes, radiation impedance, or coupled-wave FEM.

## Sound speed

v0.9.2 uses:

```text
c = 331.3 + 0.606 * T_C
```

At 20 °C this is 343.42 m/s.

Humidity and pressure are explicitly unresolved in this release.

## Screening response

For visualization/comparison ECHO sums damped Lorentzian responses from the first modes of each component. `Q = 12` is a declared **screening parameter**, not a measured Khafre Q-factor.

Therefore the response curve is labeled:

`SUMMED_LORENTZIAN_SCREENING_NOT_TRANSFER_FUNCTION`

## Null models

ECHO runs two deterministic families with 200 cases each:

### Independent perturbation

Every modeled chamber dimension and passage length can vary independently by ±5%.

This is intentionally aggressive and destroys some repeated construction relations.

### Construction-aware perturbation

Selected repeated relationships are perturbed together, including the duplicated lower horizontal segments and near-paired entrance lengths.

This is the more conservative comparison for any claim of deliberate tuning.

## Pattern-watch metric

For the first 8 modes of each component, ECHO counts clusters where at least 3 different components have modes within ±0.35 Hz of a local center.

This metric is exploratory. It is not a posterior probability and is not corrected into a design-intent claim.

## Benchmarks

The solver must exactly reproduce the analytical formulas for:

- 10 m open/open tube fundamental
- 10 m closed/open tube fundamental
- rectangular cavity `(1,0,0)` mode

All three pass in v0.9.2.

## Upgrade path

The next acoustic fidelity tier should be a FEM/BEM or finite-difference solver that:

- meshes the actual gabled chamber
- models coupled passages and chamber junctions
- uses frequency-dependent boundary loss
- performs mesh convergence
- reproduces the analytical ECHO cases before running Khafre
