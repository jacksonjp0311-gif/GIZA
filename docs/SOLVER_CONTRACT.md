# Solver Contract

Every solver consumes a frozen geometry snapshot and writes a separate run receipt.

## Frozen geometry

```bash
npm run freeze:geometry
```

This hashes:

- project
- parts
- assemblies
- parameters
- stone field
- mapped stone registry

The resulting `geometry_hash` lives in `public/model/evidence/geometry_snapshot.json`.

## New run

```bash
npm run new:solver-run -- solver.gravity
```

Available contracts:

- `solver.gravity`
- `solver.acoustic`
- `solver.em`
- `solver.hydraulic`
- `solver.geomechanics`
- `solver.muography`

## Mandatory discipline

Every run contains:

- solver ID/version
- geometry revision/hash
- input hash
- parameters
- null/control model
- output
- uncertainty
- status
- timestamp
- `provenance_class: SIMULATED`

A solver may identify an interesting prediction. It may not rewrite an archaeological fact.

## Falsification-first rule

Each domain contract includes a discriminating control. Examples:

- gravity: no-void/null-density control
- acoustics: perturbed geometry + simple reference cavity
- EM: perturbed geometry + homogeneous-material reference
- hydraulics: disconnected network + alternative head conditions
- geomechanics: no-cavity reference + alternate fracture assumptions
- muography: known-geometry-only + synthetic-void injection
