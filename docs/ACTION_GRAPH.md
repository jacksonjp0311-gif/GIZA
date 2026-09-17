# ACTION GRAPH — v0.10.4

ACTION GRAPH asks a narrower and more testable question than “what did the pyramid mean?”:

> **What movements and interactions were physically enabled, constrained, or contextually supported by the documented architecture and finds?**

The graph is not a reconstructed ceremony. It is a source-addressed behavioral hypothesis network.

## Node classes

### PLACE
A documented architectural component or evidence context: Valley Temple, causeway, Pyramid Temple court, burial chamber, etc.

### ACTION
A candidate human operation tied to evidence: enter, encounter royal images, traverse/ascend, cross a marked threshold, offer/recite, transition to burial, maintain cult.

Every ACTION node must cite at least one SOURCE PARSER record.

## Important new evidence

v0.10.3 adds independent object/catalog evidence that strengthens several behavioral constraints:

- Digital Giza catalogs multiple Khafre statues/fragments from the Valley Temple.
- The Egyptian Museum records a 168 cm diorite Khafre statue discovered there and describes it as one of about 23 similar statues.
- The same official object record describes sema-tawy unification imagery and a protective Horus falcon.
- Digital Giza indexes a limestone statue head from the Khafre Causeway.
- The Met reconstructs a Khafre red-granite architrave as spanning a Pyramid Temple court doorway, with royal titulary and associated falcon/statue imagery.
- Digital Giza's broader royal-pyramid synthesis describes funeral/processional use and later offerings/readings to royal statues.

These facts make **royal-image encounter, controlled movement, marked thresholds and post-burial cult** stronger graph candidates. They still do not reveal the exact spoken ritual or original statue positions.

## Current graph

The graph contains 14 nodes: 7 PLACE and 7 ACTION nodes, connected by 14 edges. The primary sequence is:

```text
Lower approach
→ enter lower complex
→ Valley Temple
→ encounter royal images
→ royal statuary context
→ traverse / ascend
→ causeway
→ cross royal threshold
→ Pyramid Temple court
→ funeral transition
→ burial chamber / sarcophagus
→ post-burial cult
→ upper cult zone
```

A parallel cult action links the Pyramid Temple court to offerings/readings and the upper cult zone.

## Epistemic classes

The UI and JSON keep distinct:

- `DIRECT_ARCHITECTURE`
- `DIRECT_BURIAL_ARCHITECTURE`
- `FIND_PROVENANCE`
- `ARCHAEOLOGICAL_CONTEXT`
- `EVIDENCE_SUPPORTED_ACTION`
- `ARCHITECTURE_PLUS_FUNCTION_INFERENCE`
- `THRESHOLD_INFERENCE`
- `CONTEXTUAL_RITUAL_FUNCTION`
- `SCHOLARLY_FUNCTIONAL_SYNTHESIS`

The `evidence_strength_index` is a display/triage heuristic only. It is not a historical probability.

## UI

ACTION GRAPH is the eighth RITUAL MAP atlas surface. PLACE nodes are cyan; ACTION nodes are amber. Source glyphs expose provenance, while strength rings communicate evidence class without hiding the textual status.

It lives inside the existing NEXUS central viewport. No global shell geometry changed.

## Commands

```bash
npm run action:build
npm run validate:action-graph
npm run validate:maps
```

## Biggest unresolved question

The graph is still **component-level**. The next serious step is to parse primary plans and excavation records down to rooms, doorways, statue bases, findspots, sightlines, changes in elevation and restricted-access thresholds. That is what can turn “ritual route” into a defensible room-by-room action model.

## v0.10.4 downstream refinement

SOURCE PARSER now emits 26 locator-bound records and feeds ROOM GRAPH / PRIMARY PLAN PARSER. ACTION GRAPH remains 14 nodes / 14 edges; room-scale topology is resolved separately so behavioral inference does not masquerade as measured architecture.
