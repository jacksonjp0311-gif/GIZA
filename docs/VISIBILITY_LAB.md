# GIZA v0.10.5 // VISIBILITY LAB

VISIBILITY LAB is a **pre-metric spatial-behavior analysis** over ROOM GRAPH. It asks where route depth, branching, merging, chokepoints, and environmental-state changes occur before pretending that schematic room coordinates can support real ray casting.

## Current state

```text
room spaces covered             24
threshold transitions           22
articulation/chokepoint nodes   12
maximum topological depth       12
metric visibility rays           0
canonical geometry writes        0
```

The lab computes:

- directed topological depth from exterior access;
- in-degree and out-degree;
- branch and merge points;
- articulation points in the room graph;
- qualitative environmental-state transitions;
- a simple transition-contrast heuristic used only for research triage and UI emphasis.

## What it does **not** compute

Until wall polygons, openings, heights, levels, and coordinate frames are registered, VISIBILITY LAB does **not** claim:

- line of sight;
- field of view;
- illumination;
- occlusion geometry;
- acoustic perception;
- crowd capacity;
- ritual restriction;
- psychological intensity;
- what an ancient participant actually experienced.

A topological chokepoint is not automatically a ritual gate. A high contrast index is not an emotional or symbolic intensity score.

## Why this matters

Even before metric registration, graph structure can identify the places where primary-plan acquisition has the highest information value. A branching entrance, articulation node, closure system, or exterior-to-enclosed transition becomes a priority target for exact plan geometry, elevations, door dimensions, and sightline measurement.

## Atlas view

VISIBILITY LAB is the tenth internal MAP ATLAS surface. It renders topological depth and chokepoint state over the schematic ROOM GRAPH while keeping the NEXUS shell unchanged.

## Canonical files

```text
public/model/visibility_lab/states.json
public/model/visibility_lab/route_metrics.json
public/model/visibility_lab/transition_analysis.json
public/model/visibility_lab/manifest.json
public/model/maps/layers/visibility_lab.json
scripts/visibility_lab/build.mjs
scripts/visibility_lab/validate.mjs
```

## Commands

```bash
npm run visibility:build
npm run validate:visibility
```

## Promotion gate

The next visibility phase must use registered metric plan geometry. No schematic map coordinate may be reused as a wall coordinate or visibility ray endpoint.

## v0.10.6 metric handoff

Visibility Lab remains pre-metric. METRIC VIEW LAB now owns the future ray gate. Current metric ray count is zero; schematic room coordinates cannot be reused as wall/opening geometry.
