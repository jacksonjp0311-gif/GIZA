# GIZA visual regression contract

The canonical UI is the **GIZA NEXUS workstation shell**. Feature releases are not design releases.

## Baselines

- `APPROVED-UI-TARGET.png` is the canonical visual-intent baseline established during NEXUS UI versioning.
- `REFERENCE-RUNTIME-v0.9.2.png` is a source-faithful reference showing the evolved application using the same shell.
- `docs/archive/REJECTED-v0.9.3-DESIGN-FREEZE.png` is intentionally retained only as an audit artifact. It is **not** an approved UI target and must never be used as a future baseline.

## Release rule

Before a release may claim "UI preserved":

1. `npm run validate:visual` must pass.
2. The application must build when dependencies are available.
3. Capture the **running application**, not a manually recreated mockup, at 1920×1080 and 1600×900/960 when practical.
4. Compare shell geometry against the baseline: header, left rail, central viewport, right inspector, Quick Views, footer.
5. Feature-specific content may differ; shell position and hierarchy may not drift without an explicitly approved design-version change.

If runtime capture is impossible in the current environment, record `RUNTIME_CAPTURE_UNAVAILABLE` in `VALIDATION.md`. Do not generate a substitute image and call it a runtime freeze.

## Human readability

The 3-D viewport remains visually dominant. Technical detail belongs inside independently scrolling panels. Headline interpretation precedes hashes, equations, or solver internals. New functionality should appear native to the existing panel system.
