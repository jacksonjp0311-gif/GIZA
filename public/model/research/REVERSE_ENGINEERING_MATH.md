# Reverse-engineering mathematics — rev.0003

## Epistemic rule

Geometry is not function. Surface/interior equations use sourced survey values; equations applied to the controversial deep geometry are **conditional predictions only**.

## Survey-constrained surface envelope

For a square-pyramid ideal envelope,

`V = b² h / 3`.

rev.0003 uses Petrie's adopted mean casing side `b = 215.26246 m` and his slope-derived original height `h = 143.8656 ± 0.3302 m`, giving

`V ≈ 2,222,144.5 m³`.

This is an ideal exterior geometric envelope, not a direct masonry-volume measurement.

The four surveyed casing-side lengths are retained independently instead of forcing a perfect square: N 215.18626 m, E 215.27008 m, S 215.31326 m, W 215.27770 m. Their spread is 0.12700 m (~590 ppm of the mean side).

## Passage reconstruction consistency

Legon Table-II node coordinates are converted to ARCHEON world coordinates using

`x = +12.45362 m east`, `y = y_north_base - s`, `z = -d`,

where `s` is distance south from the north base and `d` is level below base. For a centerline segment between nodes i and j,

`L_ij = sqrt((x_j-x_i)² + (y_j-y_i)² + (z_j-z_i)²)`.

The rev.0003 audit reproduces the Table-I segment lengths within about 0–4.1 mm, consistent with the 0.01 m rounding of the published node coordinates.

## Measured chamber envelopes

Burial chamber mean plan and wall height used by the model:

`14.16431 m × 4.97459 m × 5.24256 m` (wall-height envelope; gable handled separately).

Subsidiary/lower chamber measured plan:

`10.45337 m × 3.13309 m`.

Its vertical clear height is **not yet resolved from a primary metric source**, so the current 2.40 m render height is display-only and tagged accordingly.

## Deep-shaft conditional model

For a claimed shaft radius `r` and depth `L`,

`V_shaft = π r² L`.

With `r = 5.5 m` (model assumption) and `L = 648 m` (reported claim), one shaft envelope is `61,581 m³`. This does **not** imply the shaft exists.

## Geophysical testability

First-order gravity screening:

`Δg ≈ G ΔM / d²`, `ΔM = Δρ V`.

A representative 80 m cube-shaped void at 648 m with full limestone-to-air density contrast gives about `21.2 µGal` directly above its center in a point-mass approximation. A real test requires finite-prism/voxel forward modeling, topography, regional geology, lateral offsets, instrument noise, and survey design.

Hydrostatic scale: `P = ρ g h`; a connected 648 m water column gives `6.357 MPa`. That is stored head, not an energy source.

Idealized acoustic scale: `f_n = n c/(2L)` gives `0.2647 Hz` for an air half-wave fundamental and `1.1420 Hz` for water. Boundary conditions dominate interpretation.

## Magnetic/plasma gate

Single-particle gyro-radius:

`r_L = m v_perp / (|q| B)`.

This is necessary-not-sufficient. A magnetic/plasma interpretation must also close field generation/topology, ionization/input, plasma pressure and stability, losses, thermal management, and useful-energy extraction.

## Optimization / falsification

For any proposed resonant function, preregister an objective `J(g,m)` over geometry `g` and material model `m`, then perturb the measured geometry within uncertainty and compare against matched null ensembles. An apparent optimum is interesting only if it survives uncertainty propagation, multiple-objective correction, and independent solver/measurement replication.
