# NEXUS UI implementation map — v0.4.1

The approved cinematic target is stored as `APPROVED-UI-TARGET.png`.

Implemented in actual React/Three.js source:

- Top brand / mode rail -> `src/App.tsx` + `.edgeTop` styles
- Project Explorer -> `projectCard`
- Model Layers toggles -> `layerCard`
- View Controls -> `viewCard`
- Hero 3-D viewport -> `GizaScene`
- Exploded masonry field -> `StoneFieldMesh` in `src/components/GizaScene.tsx`
- Block / Slab Detail toggle -> `layers.blocks`
- Clickable analysis cells -> `StoneCellInfo` + `onSelectStone`
- Quick Views -> `quickViewsBar`
- Object Inspector -> `rightRail / mainInspector`
- Photo carousel -> `heroPhoto`
- Overview / Specs / Photos / Sources -> `InspectorTab`
- Related Components -> `relatedCard`
- Animation & Analysis -> `analysisCard`
- Section-cut plane -> `sectionAxis / sectionPos`
- Unverified deep layer -> `layers.subsurface`, off by default

The procedural block field contains 10,152 runtime-generated analysis cells at the current 72-course visual LOD. They are provenance-locked `ASSUMED`, not asserted historical stone joints.
