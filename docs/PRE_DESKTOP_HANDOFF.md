# GIZA // NEXUS v0.4.2 — Historical Pre-desktop Handoff

> Historical phase document. For current handoff use `CONTINUITY.json`, `AGENTS.md`, `docs/CONTINUATION_PROTOCOL.md`, and `VALIDATION.md`.

This revision is intentionally focused on foundations that are expensive to retrofit after the project moves to a local workstation.

## Hardened in this pass

- Cross-platform TypeScript syntax checker; no sandbox-specific global path.
- Node.js version gate in the PowerShell launcher.
- One-command `npm run check` preflight.
- Workspace state persistence via localStorage.
- Keyboard command layer for fast operation.
- Camera preset architecture with animated transitions.
- Quick views now drive real camera presets.
- Selected procedural masonry cell is visibly highlighted.
- Stone field uses InstancedMesh and DynamicDrawUsage; it no longer casts 10k individual shadows.
- Canvas uses bounded DPR and high-performance WebGL preference.
- Drei remote environment preset removed so the 3-D scene does not depend on an external HDR download.

## Keyboard

- `1` Discover
- `2` Explore
- `3` Reverse Engineer
- `E` toggle assembled/exploded
- `B` toggle block/slab analysis field
- `X` toggle X-ray
- `U` toggle unverified subsurface claim layer
- `L` labels
- `P` perspective camera
- `N` north camera
- `T` top camera
- `I` interior camera
- `G` underground camera
- `R` reset workspace state

## Desktop priority after pull

1. Install dependencies and run `npm run check`.
2. Run `npm run build`; resolve any bundler/type issues that transpile-only validation cannot catch.
3. Capture the first genuine runtime screenshot and compare it to `docs/APPROVED-UI-TARGET.png`.
4. Profile GPU frame time with block field on/off and exploded/collapsed.
5. Replace procedural analysis cells with mapped stones only where evidence supports the boundary.
6. Add local terrain/photogrammetry assets and offline thumbnails.
7. Add solver adapters only after the spatial/evidence contracts are frozen.

## Evidence rule

A procedural cell is never automatically promoted to a historical stone. Promotion requires an evidence record and provenance change.
