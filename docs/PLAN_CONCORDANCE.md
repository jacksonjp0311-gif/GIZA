# GIZA v0.10.5 // PLAN CONCORDANCE

PLAN CONCORDANCE answers a question that ordinary plan aggregation hides:

> **Which room/plan facts are actually repeated across distinct source families, and which are reconstructions, derivatives, disagreements, or still byte-pending?**

It does not register plan images metrically. It is an evidence-comparison layer over the PRIMARY PLAN PARSER and ROOM GRAPH.

## Current state

The release tracks **14 concordance facts** across **10 source/independence groups**. Six are classified as strong or strong-topology convergence. Every fact retains the supporting observation IDs, source IDs, truth classes, locators, and dependence groups.

High-convergence examples include:

- two eastern entrances to the Khafre Valley Temple;
- the Valley Temple's T-shaped interior organization;
- twenty-three statuary/niche positions in the Valley Temple hall;
- sixteen granite pillars in the Valley Temple hall;
- the covered Khafre causeway;
- the broad Pyramid Temple room program of halls, court, chapels, and magazines.

Concordance does **not** flatten disagreement. The system preserves the non-unique reconstruction of Pyramid Temple court statuary and distinguishes the architectural existence of the five western chapels from reconstructed claims about their exact cult function.

## Independence rule

Agreement is not counted by raw citation count. Derivative sources can share the same underlying reconstruction, so PLAN CONCORDANCE tracks `independence_groups` and refuses to treat several descendants of one source family as independent replication.

```text
three records derived from one reconstruction ≠ three independent confirmations
```

## Geometry rule

`agreement = STRONG` still has `geometry_write_authority = NONE`.

A room/plan fact can become useful for prioritizing measurement and source acquisition, but metric promotion still requires exact source bytes, scale/frame interpretation, registration/control, residuals, and an explicit FIELD/VAULT promotion receipt.

## Canonical files

```text
public/model/plan_concordance/facts.json
public/model/plan_concordance/matrix.json
public/model/plan_concordance/manifest.json
scripts/plan_concordance/build.mjs
scripts/plan_concordance/validate.mjs
```

## Commands

```bash
npm run concordance:build
npm run validate:concordance
```

## Next test

Acquire the plan plates themselves, checksum them, identify explicit scales and registration anchors, and determine whether the strongest topological facts survive independent metric extraction rather than only catalog/scholarly description.
