# GIZA v0.10.1 // INTENT RECONSTRUCTION

## Mission

INTENT RECONSTRUCTION asks a different question from geometry reconstruction:

> **What combination of functions, beliefs, political objectives and intended communications best explains the Khafre/Giza complex as a whole?**

The subsystem does **not** claim that ancient intent can be read directly from geometry. It treats intent as a set of competing explanatory models that must survive independent archaeology, architecture, chronology, iconography, texts, spatial measurements and negative evidence.

## Core rule

```text
geometry ≠ meaning
precision ≠ technology
symbolism ≠ future message
passive physical behavior ≠ machine function
institutional synthesis ≠ primary ancient testimony
```

A hypothesis may be plausible, supported or strongly supported, but it cannot become a geometric fact or evidence-maturity promotion.

## Current competing hypotheses

The first governed set contains eight models:

1. **Royal mortuary transformation** — the complex conducts the dead king through funeral and afterlife transition.
2. **Perpetual royal cult maintenance** — temples/statues/offerings sustain the king posthumously.
3. **Cosmic-order / solar kingship expression** — orientation and monument form participate in Old Kingdom cosmic/solar ideology.
4. **State integration and royal legitimacy** — construction and maintenance materialize centralized state power.
5. **Staged ritual landscape** — valley temple → causeway → pyramid temple → pyramid form a deliberate processional/ritual sequence.
6. **Distant-future encoded message** — the complex contains a technical/scientific payload intended for far-future people.
7. **Machine / power-system function** — hydraulic/acoustic/EM/power production was a primary function.
8. **Advanced computational technology** — AI/digital or modern-equivalent computational machinery was used.

The last three remain visible because they are testable questions, not because the current corpus supports them.

## Evidence-independence rule

Multiple facts copied through one modern synthesis do not become multiple independent confirmations. Every evidence link has an `independence_group`; evaluation uses at most the maximum weight from each group/polarity.

The generated `evidence_balance_index` and `coverage_index` are **triage metrics only**. They are not Bayesian probabilities and must never be quoted as “X% likely what the Egyptians intended.”

## Current synthesis

The present corpus makes **royal mortuary transition** and **continuing royal cult** the strongest baseline explanations. A **staged ritual landscape**, **solar/cosmic kingship context**, and **state-integration function** are also supported, but important Khafre-specific textual and room-level evidence remains missing.

The **distant-future message** hypothesis remains `NOT_ESTABLISHED`. Monumental durability and precision are compatible with communication across time, but GIZA currently has no explicit far-future audience marker or independently decodable technical payload.

The **machine/power** hypothesis is `NOT_SUPPORTED` by the present evidence. ECHO/STRATA/Gravity remain useful because they quantify passive physical consequences and tell us what machine claims would have to explain.

The **advanced-computation** hypothesis remains `NO_DIRECT_EVIDENCE`. Precision and organizational complexity imply sophisticated procedures; they do not imply digital computation or AI.

## Tests, not stories

INTENT RECONSTRUCTION includes five explicit test programs:

- room/function mapping across the complete Khafre complex;
- comparative orientation analysis across pyramids and associated structures;
- preregistered future-message encoding/null tests;
- machine-signature testing using residues, wear, fluid connectivity and energy balance;
- computational-technology signature search across artifacts, tools, workshops and administrative records.

For future-message tests, candidate encodings must be preregistered **before** searching geometry. Multiple-comparisons correction, construction/metrology nulls and independent monument holdouts are mandatory.

## Files

```text
public/model/intent/manifest.json
public/model/intent/hypotheses.json
public/model/intent/evidence_links.json
public/model/intent/test_matrix.json
public/model/intent/synthesis.json
scripts/intent/evaluate.mjs
scripts/intent/summary.mjs
scripts/intent/validate-intent.mjs
```

## Commands

```bash
npm run intent:evaluate
npm run intent:summary
npm run validate:intent
```

## Next evidence target

The next high-value phase is not another speculative model. It is **SOURCE PARSER + RITUAL MAP**: acquire exact source bytes on a networked desktop, parse excavation plans/finds/inscriptions/survey records with byte/locator receipts, then bind those records to individual complex components so intent hypotheses can make room-by-room predictions.

## v0.10.3 action evidence refinement

Two independent evidence links were added without changing hypothesis status vocabulary: Valley Temple repeated royal statuary modestly strengthens the perpetual-cult model, and the Khafre Pyramid Temple architrave/doorway context modestly strengthens the staged-ritual-landscape model. Updated coverage indices are triage values, not probabilities. Future-message, machine/power and advanced-computation baselines remain unchanged.

---

## v0.10.5 plan/visibility constraints

Plan concordance and room-topology evidence modestly improve coverage for the perpetual-cult and staged-ritual-landscape models, but status semantics do not change: the generated indices remain triage values, not probabilities. PLAN CONCORDANCE and VISIBILITY LAB cannot establish a future-targeted message, machine function, or advanced computation without direct evidence.

## v0.10.6 metric-readiness update

The cross-source room/threshold program increases **coverage** for perpetual royal cult and staged ritual landscape, but does not change their categorical status or make the scores probabilities. Current evaluator output is 0.525 coverage for perpetual royal cult and 0.575 for staged ritual landscape. Future-message, machine/power and advanced-computation statuses remain unchanged. SOURCE-BYTE REGISTRATION must precede any geometry-based strengthening.
