# Atlas and reversible spatial presentation — 0.11.1 follow-up

This extends the current workstation in place. It does not add archaeological observations, stone inventories, registrations or physical placements.

## Atlas

MAP ATLAS occupies the workspace below the existing header. Overview rails and quick views return when the model is selected. Existing eleven maps, source warnings, layer filters and M navigation remain available. Map tabs use readable wrapped text; layer controls are progressively disclosed. Drawings retain a minimum 1000-unit viewing width and scroll horizontally on narrow screens rather than crushing text. Zoom enlarges the drawing without changing map coordinates.

ReadableMap measures rendered text rectangles after layout/font readiness. In authored order it suppresses overlapping labels, retaining every label in the expandable Complete map text index. Show overlapping labels restores the authored labeling. This is screen-space presentation only, not a new map registration. Numerical/source text remains unchanged. The index is context, not a new observation source.

## Explosion

- Evidence Assembly: Explode / restore is accessible in the viewport toolbar regardless of the selected research panel. It reuses the existing detached-lid inspection displacement and saved presentation state. Zero restores the inspection stand, not a historical lid closure. Monolithic body surfaces are not fabricated into separate stones.
- Component explorer: every component entry exposes the same contextual control. Separate modeled objects and room cutaway panels can separate; a single-piece object stays intact. These transient display offsets are not canonical coordinates, measurement endpoints, contact surfaces or evidence of construction joints. Existing Sphinx inspection controls remain intact.
- Pyramid: Stone arrangement → Spherical expansion uses the existing ASSUMED procedural outer analysis cells, not all historical masonry. A deterministic Fibonacci distribution assigns each cell a point on a 240 m display-radius sphere centered at display Z=70 m. The slider interpolates between its original center and that display point. Individual cell dimensions and source records remain unchanged. The sphere is a presentation arrangement, not a spatial finding. Grid/shell/terrain clutter is suppressed during expansion; Assemble restores course mode and the overview camera. Layer switches remain authoritative for whether the cells render.

The instanced renderer updates only while the presentation amount or selection changes, recomputes bounds, respects reduced-motion preferences and uses color-only selection in spherical mode. No frame-rate or memory improvement is claimed.

## Interaction continuity

DOM panels and React Three Fiber commit independently. Real scene picks dispatch through the latest committed research callback so a just-selected Measure mode cannot be interpreted as the previous Evidence mode. This does not bypass raycasting or computed-section provenance. Existing save/export/restore and physical-measurement invariance tests remain required.

## Design reference

Reviewed Perception's primary [Iron Man 2 technology design case study](https://www.experienceperception.com/work/iron-man-2/) and its interface/hologram approach. The implementation takes reversible manipulation and contextual controls as inspiration; it does not claim film-style AI reasoning, holographic hardware, or scientific capabilities beyond GIZA's validated computations.

## Try it

1. Open MAP ATLAS. Use the index, Map zoom, horizontal pan, and Complete map text. Return using 3D MODEL or M.
2. In the model enable Exterior and Block / Slab Detail. Select Spherical expansion and move Explosion distance to 275%. Select a cell or zoom in. ASSEMBLE restores the pyramid arrangement.
3. Open Sarcophagus, expand Explode / restore and move the detached lid. Measurements still use the declared physical frame; its physical placement remains UNKNOWN.
4. Open Upper Passage or Lower Chamber and use the component Explode / restore control. It separates modeled context/panels only, without inventing geometry.

See VALIDATION.md for executed tests, preserved failures and environment limitations.
