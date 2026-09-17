# GIZA v0.8.2 // FRAME

FRAME is a non-visual architecture refactor immediately before SIMLAB.

## Objective

Preserve the v0.8.1 user experience and research state while separating UI orchestration, scene rendering, geometry utilities, and research inspectors into stable modules.

## Before

```text
App.tsx                         ~39.7 KB / 639 lines
components/GizaScene.tsx        ~17.4 KB / 402 lines
```

Both files were becoming change hotspots.

## After

```text
App.tsx                         ~10.2 KB / 215 lines
components/GizaScene.tsx         ~3.6 KB / 88 lines

src/workstation/
  WorkstationHeader.tsx
  LeftRail.tsx
  SpatialViewport.tsx
  ObjectInspectorPanel.tsx
  WorkstationFooter.tsx
  types.ts

src/scene/
  MonumentLayer.tsx
  MasonryLayer.tsx
  FieldLayer.tsx
  CameraRig.tsx
  SimulationLayer.tsx           # inert v0.9 mount point
  geometry.ts
  types.ts
```

## Responsibility boundaries

### `App.tsx`
Owns application state and coordinates modules. It must not render Three.js primitives or contain evidence/CANON/FIELD inspector markup.

### Workstation modules
Own screen regions and interaction presentation. Research state is read through the canonical model bundle.

### `GizaScene.tsx`
Composes scene layers. It must not decide evidence authority or geometry promotion.

### MonumentLayer
Canonical/derived/assumed semantic monument parts.

### MasonryLayer
FORGE analysis-cell generation, instancing, selection, and explosion.

### FieldLayer
World-reference marker and uncertainty geometry.

### CameraRig
Camera presets and animated transitions.

### SimulationLayer
Intentionally returns `null` in FRAME. SIMLAB visualizations mount here so simulation output remains distinct from canonical geometry.

## Invariants

- 56 semantic parts unchanged.
- 9 assemblies unchanged.
- 127 measurement records unchanged.
- 10,152 FORGE analysis cells unchanged.
- 31 deep-claim objects remain `UNVERIFIED`.
- FIELD/CANON/VAULT records unchanged.
- Object Inspector remains docked and follows v0.8.1 layout contract.
- No simulation result may mutate canonical geometry.
