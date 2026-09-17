# SIMLAB seam — activated in v0.9.0

FRAME created `src/scene/SimulationLayer.tsx` as an inert seam in v0.8.2. SIMLAB v0.9.0 activates that seam for the first executable gravity field overlay.

The architecture remains one-way:

```text
canonical geometry + material/solver inputs
        ↓
SIMLAB forward solver
        ↓
SIMULATED run receipt + visualization
```

Simulation output cannot mutate geometry, provenance, or evidence maturity.
