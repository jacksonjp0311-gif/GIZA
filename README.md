# GIZA NEXUS v0.10.12 — Registration Workbench

## Current repository status — 2026-09-17

This project is now maintained as **GIZA**. The Explorer has since passed TypeScript and production compilation, with a model-first header, animated original logo and component Quick Views. The portable scripts below still differ from the external desktop compile/version launcher; a fresh clone does not include that external launcher. Historical verification artifacts are preserved with their original results.

See [Spatial Engineering Audit and Roadmap](docs/SPATIAL_ENGINEERING_ROADMAP.md) for code findings, all 56 component coverage rows, and the proposed evolution plan. These recommendations are not yet implemented.

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

Then open `http://127.0.0.1:4174/workbench/` in your browser. The console prints the address. Ctrl+C stops the local service.

The Registration Workbench uses Node.js built-ins and shipped HTML/CSS/JavaScript. **It does not require `npm install`, Vite or a network connection.** Node.js 22.16 was used for verification; the package retains its Node >=20.19 requirement.

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
