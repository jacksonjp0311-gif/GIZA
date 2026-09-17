# FRAME module graph

```text
main.tsx
   │
   ▼
App.tsx  ─────────────── canonical application state
   │
   ├── WorkstationHeader
   ├── LeftRail
   ├── SpatialViewport
   │       │
   │       ▼
   │    GizaScene
   │       ├── MasonryLayer
   │       ├── MonumentLayer
   │       ├── FieldLayer
   │       ├── SimulationLayer  [v0.9 seam]
   │       └── CameraRig
   │
   ├── ObjectInspectorPanel
   │       ├── OVERVIEW
   │       ├── SPECS
   │       ├── PHOTOS
   │       ├── EVIDENCE
   │       ├── CANON
   │       └── FIELD
   │
   └── WorkstationFooter

public/model/
   ├── semantic geometry
   ├── research measurements
   ├── evidence / VAULT
   ├── CANON source authority
   ├── FIELD registration
   └── solver contracts
```

The direction of dependency is deliberate: scene rendering consumes canonical state; it does not create research truth.
