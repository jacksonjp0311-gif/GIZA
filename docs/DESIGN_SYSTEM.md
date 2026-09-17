# GIZA NEXUS Design System Contract — product v0.10.2 / shell baseline v0.9.3.1

GIZA is one cinematic spatial reverse-engineering workstation. **Feature phases extend the workstation; they do not rename or redesign it.**

## Canonical identity

Primary brand: **GIZA NEXUS**.

Primary navigation is locked to five modes: **DISCOVER · EXPLORE · REVERSE ENGINEER · ANALYZE · SIMULATE**. FIELD, FINDINGS, solvers and RITUAL MAP are workflows/surfaces inside those modes rather than extra global navigation modes.

The approved visual-intent baseline is `docs/design/APPROVED-UI-TARGET.png`. Machine-readable shell geometry is `docs/design/LAYOUT_CONTRACT.json` and component policy is `docs/design/COMPONENT_CONTRACT.json`.

## Visual language

Dark industrial blue/black surfaces; cyan information/navigation; amber/orange active interpretation and caution; green runtime readiness; red critical/unverified semantics; compact engineering typography; thin luminous borders; restrained glow; dense but readable information.

## Layout invariants

Desktop shell: header → three-column workspace → footer. Workspace: fixed left dock, fluid dominant central viewport, fixed docked right inspector. Quick Views remain below the central viewport. The Object Inspector never overlays the scene.

RITUAL MAP may replace **central viewport content** through a local `3D MODEL / MAP ATLAS` switch. This is permitted content evolution, not a shell redesign. The atlas must scroll internally and may not move the global header, left rail, inspector, Quick Views or footer.

## NEXUS Cartography R1

Map design adds:
- sticky internal map index;
- source/evidence glyphs;
- thin engineering grid;
- animated route dashes/scanline;
- truth-class + geometry-authority badges;
- unresolved-transform gates;
- map-specific layer strip;
- large-format internally scrollable map sections.

Cinematic treatment must never imply evidence strength. A schematic map must look obviously labeled as schematic; a metric survey map must expose frame/transform state; an interpretive route must carry a guard.

## Human readability

Lead with what a result means, what is measured vs interpreted, and what remains unresolved. Equations, hashes and solver internals follow.

## Screenshot rule

A runtime freeze must come from the running application. A mockup or hand-composed image may be useful as a concept artifact, but it must be labeled and may never replace runtime verification. If the environment cannot run GIZA, record `RUNTIME_CAPTURE_UNAVAILABLE`.

## Validation

- `npm run validate:ui` — shell/docked-inspector rules.
- `npm run validate:visual` — approved baseline hashes, product identity, navigation count and locked shell geometry.
- `npm run validate:maps` — atlas count, source linkage, survey mirroring, transform guards, intent linkage and scroll integration.

## v0.10.3 ACTION GRAPH visual contract

ACTION GRAPH is an internal RITUAL MAP atlas surface and does not change the NEXUS shell. PLACE nodes use the established cyan/data family; ACTION nodes use amber/interpretive styling. Evidence strength is shown as a secondary ring but the textual epistemic label must remain visible. No visual confidence cue may be rendered as a probability or as archaeological certainty.


## v0.10.4 ROOM GRAPH visual contract

ROOM GRAPH is the ninth internal atlas view. Cyan carries source/topology state; amber rings mark reconstruction or uncertainty. It must show the nonmetric watermark and may not alter the locked NEXUS shell.

## v0.10.5 VISIBILITY LAB visual contract

VISIBILITY LAB is an internal MAP ATLAS view. It may visualize topological depth, branch/merge state, and articulation/chokepoint status using the NEXUS cartographic language, but it must display `PREMETRIC`/authority guards prominently. No glow, depth gradient, or transition emphasis may imply a measured sightline or ritual intensity.

## v0.10.6 METRIC READINESS visual contract

METRIC READINESS is atlas view #11. Cyan/amber/red progress conveys workflow state only, never evidence probability. The panel must always display registered-plan count and metric-ray count; both remain zero until actual gates pass.
