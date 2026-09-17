# ROOM GRAPH — v0.10.4

ROOM GRAPH resolves Khafre from monument-scale labels into a source-addressed network of rooms, installation fields, passages, branches, closure points and transitions.

It asks:

> At a particular architectural state, what other state could a person physically reach, and what evidence supports that connection?

## Current graph

- 24 spaces
- 21 thresholds
- 4 zones: Valley Temple, Causeway, Pyramid Temple, Pyramid Interior
- 3 visibility constraints
- 3 movement constraints
- 3 findspot-to-space links with placement caveats

## Important direct constraints

The graph carries evidence for dual eastern Valley Temple entrances, a T-shaped/pillared interior program, a major statuary installation field, a constrained ascending causeway, a branch at the upper temple entry, a sequence of pillared/court/cult spaces, two pyramid entrance/passage systems, a portcullis closure feature, a lower chamber, and the burial chamber.

The portcullis feature is especially useful because it is a **physical access-control mechanism**, not merely a symbolic interpretation. Perring's historical survey records three portcullis slabs and associated handling/closure architecture. The graph nevertheless does not infer who controlled it or what ceremony accompanied its closure.

## Schematic coordinates

`x` / `y` values exist only to make the NEXUS atlas readable. They do not encode wall locations, room dimensions, azimuths, distances, visibility rays or elevations.

`coordinate_mode = SCHEMATIC_TOPOLOGY_NOT_SURVEY`

## Findspot rule

A find recovered in a temple can establish association/provenance without establishing its exact original architectural position. Every findspot link therefore keeps a placement caveat.

## Ritual rule

A repeated sequence of thresholds can support a hypothesis of staged movement, but it does not recover ancient choreography, actors, spoken liturgy or social permissions.

## Map UI

ROOM GRAPH is the ninth map in RITUAL MAP. It uses:

- cyan source/topology nodes;
- threshold arrows;
- source glyphs;
- amber uncertainty rings on reconstructed states;
- zone labels;
- an explicit nonmetric watermark.

## Next measurement gate

The next useful upgrade is to replace schematic nodes with plan-registered room polygons and door openings only after legal source bytes are acquired and controlled. That enables visibility, route-choice, doorway-angle, elevation and spatial-access experiments with uncertainty.

---

## v0.10.5 concordance / visibility handoff

ROOM GRAPH now feeds PLAN CONCORDANCE and VISIBILITY LAB. Its 24 spaces and 21 thresholds remain the topology substrate; their UI coordinates remain schematic. PLAN CONCORDANCE may increase confidence that a room-program fact is repeated across source families, while VISIBILITY LAB may calculate graph depth or articulation. Neither operation changes a room into surveyed metric geometry.
