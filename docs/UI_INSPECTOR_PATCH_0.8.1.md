# Object Inspector Layout Patch — v0.8.1

## Problem
The FIELD inspector visually behaved like a separate overlay and the six-tab/data stack competed for vertical space. On constrained desktop widths it could appear to sit over the bottom analysis area rather than belonging to the same UI system.

## Correction
The entire right side is now one `inspectorDock` grid:

```text
OBJECT INSPECTOR HEADER
        ↓
TABS + CONTENT
        ↓
RELATED COMPONENTS
        ↓
ANIMATION & ANALYSIS
```

There is one outer frame and internal section dividers. The right dock never uses absolute or fixed positioning.

### Tab layout
Six modes are now 3 × 2 so labels remain readable:

```text
OVERVIEW   SPECS      PHOTOS
EVIDENCE   CANON      FIELD
```

`OVERVIEW` and `PHOTOS` reserve the photo area. The other tabs remove it and devote the space to scrollable technical data.

## Responsive contract
- >1450 px: ~410 px inspector
- 1201–1450 px: 370 px inspector
- 1021–1200 px: 350 px inspector, 2 × 3 tabs
- <=1020 px: inspector is hidden rather than overlapping the 3-D scene
