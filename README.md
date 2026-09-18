# GIZA NEXUS v0.12.0 — Live Evidence + Human Guidance

## 0.12.0 verification candidate

Start with **Tutorial / ?** in the header for the interactive, fifteen-chapter
tour. It uses the real workstation controls and protects unsaved research.
The model-first interface and existing specialized workspaces remain intact.

In **Sarcophagus → Compare**, a locally replayed and reviewed campaign can link
its exact **PLAN_2D_ONLY** relation to the live graph. Imported verification
flags cannot establish local verification. Hypothetical transforms are excluded
from ordinary physical measurements; an explicitly conditional calculation is
available separately. Impact/explain tools preserve original research records.

[Tutorial behavior and accessibility](docs/TUTORIAL_MODE.md) ·
[Live evidence contracts and limitations](docs/LIVE_EVIDENCE_INTEGRATION.md) ·
[Executed verification and release status](VALIDATION.md).
The real archaeological campaign remains **BLOCKED**, not synthetically completed.
Remote acceptance requires both platforms at the same sealed commit.

## Preserved 0.11.1 functionality and follow-ups

Centered interaction and media cleanup: scroll zoom keeps the orbit pivot fixed, pyramid framing stays on its central axis, and dimensions live inside Inspect / layers. Open **Hieroglyphs · Inscription Lab** for the Dream Stela photographs, labeled reproduction detail and source links. [Audit, credits and limitations](docs/MEDIA_ORBIT_CLEANUP.md).

Viewport controls tuck away automatically: hover **Inspect / layers** or **Explode** to expand them. Move away to collapse; keyboard focus or tap also opens them, with Escape/Close available.

Startup always opens the assembled Khafre pyramid centered and fitted to the 3-D viewport. Prior overview explosion, clipping, underground view and shell-hiding settings no longer displace the next launch. Saved research investigations and explicit archived views remain separate and unchanged.

Atlas/spatial follow-up: full-workspace maps, readable labels with a complete text index, map zoom/pan, contextual assembly explosion, and reversible **Spherical expansion** of the existing illustrative pyramid stone cells. [Controls, limitations and design references](docs/ATLAS_SPATIAL_PRESENTATION.md).

Layer-control follow-up: **Subterranean (Unverified)** and **Underground** explicitly reveal hypothetical underground geometry; fresh sessions still default it off. Reality layers can hide it independently, with an actionable explanation. Interior inspection respects the model-layer switches. Overview-only controls are disabled in separate detail/atlas views; use **Return to model layers**.

This reliability successor adds strict imported-graph semantics, point-to-feature membership, compatible uncertainty, deterministic rendered cap picking, and contextual **Explain / compare inputs** with linked reruns. No interface rebuild or new archaeological authority. See [0.11.1 handoff and demonstration](docs/RELIABILITY_0_11_1.md) and [actual verification status](VALIDATION.md).

## Preserved 0.11.0 capabilities

Select exact feature support separately from context; measure in a declared frame; preserve a replayable investigation with its original geometry, points and result; reopen historical inputs without silently rebasing them. New computations carry dependency fingerprints. Analytic section cuts are pickable, fitting uses visible geometry, and optional research data no longer blocks the initial model.

The focused source campaign reuses the shared registration engine for acquisition, immutable controls/holdouts, replay and reviewed **2-D-only** revisions. Its synthetic positive path works; the real coffer/chamber campaign is explicitly BLOCKED on independent source/control requirements. See the [fresh-user demonstration and exact limits](docs/SOURCE_CAMPAIGN.md), [checkpoint ledger](docs/EVIDENCE_BOUNDARY_EVOLUTION.md), and [validation record](VALIDATION.md).

## Historical 0.10.12 implementation checkpoint — 2026-09-17

At this historical checkpoint, evidence-boundary hardening was in progress; see [ordered implementation checkpoints](docs/EVIDENCE_BOUNDARY_EVOLUTION.md). Historical results below remain unchanged. New experiment receipts distinguish current calculations from historical snapshots.

### Evidence Assembly / 01 — Khafre sarcophagus

Open **Sarcophagus**, **Sarcophagus Lid**, **Burial Chamber** or **Interior** in Quick Views for the new full-width Evidence Assembly. Measure exact anchors or picked points, inspect orthogonal/oblique sections and hollow-body caps, compare preserved legacy coordinates, traverse feature-level evidence, and review deterministic Investigation Candidates into immutable computation/finding receipts. Reality layers are independently controlled. Selection and lid inspection motion never enter physical measurements or exports.

The known detail/overview disagreement is now an explicit frame audit, **not a silent correction**. The detached lid's physical placement, assembly-to-monument/site transform, raw primary-source custody and metric image registration remain unresolved. UNKNOWN is not zero. The older component viewer remains under **Views**; historical sources, experiments, Sphinx, Inscription Lab, simulations and atlas are preserved. See [Evidence Assembly contract and handoff](docs/EVIDENCE_ASSEMBLY.md) for capabilities, guarantees and limits.

`npm run check` now includes the Evidence Assembly, graph/receipt, presentation and runtime-resilience tests. `npm run validate:evidence-assembly` reproduces candidates from repository data; see `scripts/evidence/README.md` for immutable receipt output. That historical release identity was 0.10.12, with contract v1 and compile-time commit/source-hash/build metadata.

This project is maintained as **GIZA**. The model-first Explorer includes the original animated logo, searchable components, expanded viewing and component Quick Views. The repo-contained launcher now compiles TypeScript and production assets on every start, stamps the build outside the repository, and serves both Explorer and Registration Workbench. Historical verification artifacts retain their original results.

See [Spatial Engineering Audit and Roadmap](docs/SPATIAL_ENGINEERING_ROADMAP.md) for the original audit and all 56 component coverage rows. [Usability foundation](docs/USABILITY_FOUNDATION.md) tracks the first implemented tranche and remaining limits; the full archaeological roadmap is not complete.

The [Sphinx Explorer](docs/SPHINX_EXPLORER.md) adds a separate exterior study reconstruction with exploded regions, synthetic repair blocks, clipping, isolation and GLB export. It is explicitly not a scan or a per-stone survey.

An executable local workbench for importing a source plate, recording landmarks, freezing an experiment, and inspecting every holdout residual. This is a software release, not an inspection report.

The existing React / Three.js explorer, exploded-model controls, photo inspector, simulations and eleven-view atlas are retained. The new Registration surface opens from the central viewport; it does not replace the 3-D model or add another global navigation mode.

## Launch now

**Windows:** double-click `Start-GIZA.cmd`, or run:

```powershell
.\Start-GIZA.ps1
```

**macOS / Linux:**

```bash
./start-giza.sh
```

First install the locked dependencies once with `npm ci` (Node 22 recommended). All platforms can use `npm start`. Open `http://127.0.0.1:4173/` when the console says **GIZA READY**. Ctrl+C stops both services. Occupied ports produce an actionable error without killing an existing process. Override ports using `GIZA_EXPLORER_PORT` and `GIZA_PORT` if needed. `npm start -- --check` compiles without serving; `npm start -- --smoke` compiles, health-checks both services and stops.

For the standalone Registration Workbench only, run `npm run workbench` or `Start-GIZA.ps1 -Mode Workbench`, then open `http://127.0.0.1:4174/workbench/`. That standalone mode uses Node built-ins and shipped HTML/CSS/JavaScript: no dependency installation or compilation is required. The package retains its Node >=20.19 requirement.

PDF import additionally requires Poppler's `pdfinfo` and `pdftoppm` on PATH. Missing rendering tools do not prevent the workbench or its synthetic test from launching. The actual historical PDF is not bundled.

## What is usable

The workbench has a local PDF importer, source/render hash checks, an image viewer with zoom and click-to-place landmarks, control/holdout assignment, target-coordinate and scale-provenance forms, JSON draft import/export, an immutable freeze operation, a fit executor, and a residual-vector viewer with numerical gate results. A separately labelled synthetic test exercises the numerical display without writing archaeological results.

The service listens only on `127.0.0.1`. Mutation endpoints require the per-session token and an allowed origin. It performs no outbound network calls and never contacts GitHub.

## Real experiment workflow

1. Import the expected 315-page Petrie PDF. The importer checks PDF signature/page count, hashes the supplied bytes and renders page 305 locally.
2. Inspect the rendered plate and explicitly confirm its identity. Hashing proves which bytes are used; it does not prove historical authenticity.
3. Select landmarks. Click the image for source pixels, choose control or holdout, and enter independently sourced target coordinates.
4. Choose the registration profile and enter an independent meters-per-pixel expectation with source ID and locator.
5. Freeze the experiment. Source hash, render hash, profile, scale expectation, provenance, roles and coordinates are captured together in a content-hashed snapshot.
6. Execute the fit. The source and render bytes are rehashed, the frozen snapshot is checked, and the selected profile's actual minima and all numerical gates are enforced.
7. Review the residuals. Success is only a plate-local metric candidate requiring human review; failure retains every holdout. Neither mutates canonical geometry.

A frozen experiment or recorded fit cannot be overwritten. Make a separate project copy for a new experiment; preserve the original snapshot and result. Provenance and its independence assertion are operator-supplied, not authenticated historical facts.

## Repairs implemented

- The chosen profile governs control/holdout counts; modern 6/3 cannot pass through a hard-coded 4/2 check.
- Independent scale is mandatory and scale drift is evaluated.
- Actual source/render bytes are rehashed at both freeze and execution.
- Target coordinates require a registered source ID, locator and independence assertion. There is no unspecified-provenance fallback.
- Frozen experiments, profile snapshots and fit results are content-bound and non-overwritable through the application.
- The normalized-observation builder never relabels copied prose as raw-byte extraction just because an unrelated file is cached.
- Duplicate, nonfinite, out-of-bounds and collinear correspondence inputs are rejected.
- Atlas navigation no longer hides later tabs on narrower displays; internal scrolling no longer feeds an automatic parent focus/scroll loop.
- Release sealing regenerates current manifests in dependency order and verifies their hashes.

## Interior inspection and hieroglyph workspace

In the 3D overview, use **Remove shell / inspect inside** to expose the known internal system, select a subsystem, fit it, and isolate individual components. **Restore shell** returns the ordinary layer selections. The Sphinx offers **Expose carved bedrock**, not an invented hollow interior.

Open **Inscription Lab** from Quick Views or the Sphinx panel to inspect the bundled Dream Stela photo/facsimile, mark reading zones, trace marks, compose signs, and maintain a source-linked translation board. Drafts save locally and export to JSON. AI review packets and proposal import are manual handoffs; no automatic OCR/translation provider is connected. See `docs/INTERIORS_AND_EPIGRAPHY.md` for the current audit, workflow and next priorities.

## Existing 3-D explorer

On a networked desktop with the original dependencies installed:

```bash
npm install
npm run dev
```

Or use `Start-GIZA.ps1 -Mode Explorer`. The explorer runs on port 4173. Run the workbench in a second terminal to use the new **REGISTRATION** button (keyboard `H`); Vite proxies its local API and UI. `M` continues toggling the model and map atlas.

The original handoff environment lacked Explorer dependencies. Subsequent desktop verification passed its production build; see dated entries in VALIDATION.md. The standalone workbench remains independently executable.

## Tests

```bash
npm run test:repairs
npm run build:workbench
npm run check
npm run verify:release
```

`test:repairs` is dependency-free and covers all six inspection cases plus positive and negative registration paths. `check:legacy` also runs the historical scientific/static checks; its TypeScript syntax step requires TypeScript locally installed or available via NODE_PATH. `verify:release` verifies the sealed distribution; running generators or importing new data changes the working copy and requires resealing before distributing it.

Optional Python integration tests are in `tests/`. They use synthetic PDFs only and need ReportLab/Pillow or Playwright where noted. These are test dependencies, not workbench runtime dependencies.

## Verification scope

- 25 targeted registration/parser regression tests passed.
- The local HTTP service completed PDF import, rendering, confirmation, immutable freeze and fit using an isolated synthetic 315-page document; duplicate writes and invalid mutation tokens were rejected.
- Shipped HTML/CSS/JavaScript rendered and responded correctly in Chromium, including the synthetic residual view and 390px responsive layout. Managed Chromium disallowed URL navigation, so the browser test loaded the actual files and bridged requests to the real loopback API. It did not mock the API or use a generated UI image.
- No real Petrie PDF, archaeological registration, canonical wall geometry or archaeological metric ray was created in this release.

Previous release identities and manifests are preserved under `history/0.10.11/`. The project was first published to the private GitHub repository `jacksonjp0311-gif/GIZA` on 2026-09-17 with the user's authorization.
