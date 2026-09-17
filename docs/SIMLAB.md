# GIZA v0.9.6 // SIMLAB

SIMLAB is GIZA's executable forward-physics layer. Its invariant is simple: **simulation is prediction, not observation**. Solver output cannot promote archaeological geometry, provenance, or evidence maturity.

## Active branches

### Gravity

Conditional density-contrast forward modeling with no-void and component-ablation controls, deterministic run receipts, a sensitivity sweep, and 3-D µGal visualization.

### ECHO acoustics

Known/derived interior analytical screening with rigid-wall cavity modes, passage mode families, perturbation controls, construction-aware nulls, 3-D normalized pressure visualization, and analytical benchmarks.

### STRATA

Combined first-order geomechanics + hydraulics screening. It computes vertical overburden and conditional hydrostatic head at declared depths, carries sample-level material priors, and explicitly blocks factor-of-safety, flooding, flow-rate, and usable-power claims until the missing evidence exists.

## Shared run contract

Every run binds solver version, geometry revision/hash, input hash, parameters, controls/nulls, uncertainty statement, status, timestamp, and `SIMULATED` provenance.

Heavy numerical calculations live in `scripts/simlab`; React only visualizes serialized results.

## Research memory

Important cross-solver patterns and gating results are summarized in `public/model/research/findings_registry.json` and exposed through the global FINDINGS inspector. The registry is intentionally provider-independent.

## Fidelity gates

Gravity needs terrain/geology/instrument noise before detectability claims. ECHO needs coupled-wave FEM and measured loss before acoustic design claims. STRATA needs a rock-mass/stress/discontinuity model for stability and evidence-bound permeability/head boundaries before flow calculations.
