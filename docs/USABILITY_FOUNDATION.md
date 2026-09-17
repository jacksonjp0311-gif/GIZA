# Usability foundation — 2026-09-17

This implements the first reliability/usability tranche of the spatial-engineering roadmap. It does not promote illustrative geometry into surveyed geometry.

## Everyday exploration

- Find components by name, ID or provenance in the left rail. Multiple words match together; Enter opens the first match, Escape clears, and Ctrl/Cmd+K focuses search. Empty results explain what to try.
- Expand viewer hides the side rails while retaining Quick Views. Restore panels or Escape returns to the normal workspace.
- Photos/catalogs share a split stage with the model rather than covering it; narrow stages stack them. View and inspection controls occupy their own rows outside the canvas.
- Selection highlights without changing object scale. Overview camera speed now affects preset transitions; reduced-motion makes those transitions immediate.
- One dimensions preference controls both component scenes and the overview envelope readout. The overview numbers are explicitly local preview extents, not surface measurements.
- Sarcophagus actions directly open the cavity or lid. Body records (7) and lid records (4) are separated; other assembly records remain available under a disclosure. The lifted lid is an inspection pose, not a historical opening animation.
- Header counts distinguish reconstructions, assumed parts and unverified parts. Reference Photos no longer claims phototexturing.
- Invalid saved settings are sanitized; model requests time out after 15 seconds. Loading/render errors offer reload and workspace reset instead of an unexplained blank screen.

## Launch and verification

Run `npm ci` once, then `npm start` or a repository launch shortcut. Each start checks TypeScript and compiles production assets before starting the Explorer and Workbench. A timestamped build receipt lives in the operating system temporary directory, outside the sealed source tree. Startup refuses occupied ports without terminating existing processes. Ctrl+C stops only its own service children.

The lockfile pins dependency resolution. GitHub Actions is configured for Windows and Linux, including release verification before generated outputs change, the full check suite, and compile/start/health/stop smoke testing. CI results must be checked separately; configuration alone is not a passing run.

## Still needed

- Independent survey control, licensed overlapping imagery, registered photogrammetry and uncertainty for each object; existing materials remain illustrative.
- Canonical-versus-detail frame reconciliation with explicit transforms. Canonical archaeological data is unchanged in this tranche.
- Runtime schemas and optional-dataset isolation beyond timeout/error recovery.
- Direct measurement binding for all remaining components (non-sarcophagus lists are still explicitly labeled associated records).
- Automated browser, accessibility and performance budgets; bundle splitting and wider device coverage.
- Every item in the original 56-part audit still needs its evidence/acquisition status tracked; no new survey/photo acquisition is claimed here.
