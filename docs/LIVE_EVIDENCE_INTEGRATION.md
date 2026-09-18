# Live evidence integration — 0.12.0 implementation checkpoint

Base: 3074047ce8c39950b5d03814b1a40408f55c7739 (0.11.1).
This document describes implemented contracts, not a completed remote release.

## Transform authority

giza.transform-authority.v2 checks resolution, calculation scope and epistemic
authority separately. AUTHORITATIVE_RECONSTRUCTION traverses only resolved
OBSERVED or RECONSTRUCTED rigid relations. HYPOTHESIS cannot yield ordinary
KNOWN physical results. Existing COMPARISON_ONLY behavior remains separate.

measureConditionalPoints provides giza.conditional-measurement.v1. It retains
input points, frame chains, matrices, transform IDs/authority, assumption IDs and
unpropagated uncertainty. Hypothetical edges require explicit assumption IDs.
Results are CONDITIONAL or UNKNOWN, never ordinary KNOWN. This is currently a
separate advanced disclosure in Measure, not the default measurement or saved
physical result.

Saved measurements use canonical-measurement.v4. Earlier rules retain archived
replay behavior against copied historical inputs and are historical for current
applicability. Original snapshots and checksums are not rewritten.

## Verification states

NO REGISTRATION means no supplied record. Imported flags or hashes remain
IMPORTED CLAIM, not local execution. The local replay-verification endpoint
reproduces preserved bytes through the shared engine. REPLAY VERIFIED is not
review or permission to integrate. The live-relation endpoint additionally
requires the accepted scoped revision and operator review.

The browser mints a non-serializable session capability only after the local
replay response passes its hash and exact assembly-snapshot binding.
REVIEWED SCOPED RELATION is therefore not obtainable by importing a JSON flag.
Export/import does not preserve that capability; replay is required again.

The chain retains source identity, source/render/freeze/result hashes, frozen
controls and untouched holdouts, scale classification/provenance, engine
identity, fit rule, target plan frame, uncertainty, affected features, review,
revision and rollback identity. Hashes establish bytes, not historical
authenticity. Rights and review remain operator-attributed declarations.

## Campaign to graph

PLAN_RELATION represents SOURCE_RENDER_PIXELS to the declared local PLAN_2D
frame. REGISTERED_PLAN_CONTEXT connects explicitly affected features. It is not
a rigid 3-D transform, surveyed surface, lid placement or site registration.
Synthetic QA remains HYPOTHESIS. Documentary consistency is distinguished from
independent control. Canonical physical exports are unchanged.

Graph semantic validation preserves wrapper/record authority and exact feature
bindings. Imported relations may be inspected as claims, not activated. Direct
support remains exact observation bindings. Derived dependencies may follow a
feature's own constraint; unrelated assembly constraints remain context only.

## Impact

giza.evidence-impact.v1 compares graph records and uses existing reproducible
explanations and dependency fingerprints for experiments and saved investigations.
It reports affected frames/features/constraints/candidates and research rows:
CURRENT, HISTORICAL, UNVERIFIABLE or UNAFFECTED. Exact dependency differences and
paths accompany changed results. Labels and camera state do not become physical
inputs. A newly linked plan context alone leaves existing 3-D calculations
UNAFFECTED: no current 3-D calculation consumes it as a physical transform.

The Compare panel links local campaigns, shows impact and opens existing
explain/compare and computation tools. Original records remain immutable.

## Rollback and limitations

Registration rollback appends a record; it does not delete source bytes or
receipts. Replaying a rolled-back campaign cannot mint a live relation and
removes its matching session link. Detach removes only the browser-session link.
On window focus/visibility return, session links recheck revision identity and
rollback state. Changed, rolled-back or unavailable status detaches the link
with an actionable message. This is not continuous multi-user synchronization;
replay remains necessary after importing or reopening. No physical calculation
presently consumes these context links.

The real Khafre campaign remains BLOCKED. Needed: an identified coffer/chamber
plan; permitted-use preserved bytes; independent local scale/control; datum and
uncertainty; distributed frozen controls; untouched holdouts. Synthetic positive
tests prove software execution, not archaeology.

## Reproducible software demonstration

Use the synthetic campaign browser test or registration fixture, explicitly
labelled SYNTHETIC_SOFTWARE_QA. Acquire, freeze, run the unchanged shared engine,
review and export. In the model open Sarcophagus → Compare, enter its local
campaign ID and Replay & link scoped evidence. Inspect the PLAN_2D relation and
unchanged physical research dependencies. Roll back in Registration and replay
again: the session relation must be removed, while all archived records remain.
