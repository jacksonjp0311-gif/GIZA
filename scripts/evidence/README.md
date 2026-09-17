# Evidence Assembly validation and reproducibility

Run the targeted validator without writing anything:

```sh
node scripts/evidence/validate.mjs
```

To preserve a new immutable validation artifact, choose a new filename:

```sh
node scripts/evidence/validate.mjs --output public/model/evidence_assembly/validation-20260917T120000Z.json
```

The command refuses an existing filename. Historical failed/superseded artifacts must remain unchanged. The root release manifest should be sealed **after** producing artifacts and running all relevant tests.

The output binds the actual source bytes with SHA-256, the base Git commit, dirty-worktree status, product version, Node/TypeScript/platform environment, canonical assembly, typed graph, candidate inputs, recomputed results and individually sealed experiment receipts. Uncommitted source hashes, not the base commit alone, identify the implementation that ran.

Checks cover assembly import/export round trips, graph relationship integrity, resolved transform round trips, deterministic candidates, candidate recomputation and receipt verification. This targeted command does not replace the full validation suite, browser checks or production build.

These are software/reconstruction receipts, not archaeological observations. A computation reproducing a published dimension does not create independent control. Source bytes, image registration, scale, holdouts, residuals, lid pose and the assembly-to-monument/site transform remain explicitly unresolved where the repository has no accepted evidence. Existing source custody and shared `scripts/plate_registration/engine.mjs` gates are unchanged.

The Investigation journal uses append-only receipt records. Corrupt storage is retained unchanged; writes pause until recovery. The optimistic localStorage baseline check detects stale writes but is not a multi-tab atomic transaction. Export receipts before closing when persistence fails.
