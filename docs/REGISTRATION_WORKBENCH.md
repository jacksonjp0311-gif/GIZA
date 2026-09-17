# Registration Workbench implementation

## Runtime

`node scripts/workbench/server.mjs` serves the native browser application in `public/workbench/` on loopback port 4174. No runtime npm dependencies or outbound requests are used. `GIZA_PORT` changes the port and `GIZA_ROOT` selects a separate experiment directory. The default root is the project containing the server.

The React explorer adds a local Registration surface, with a Vite proxy for `/workbench` and `/api`. It preserves the 3-D canvas path and global five-mode navigation. A separate workbench window is available when the embedded surface is too narrow.

## Shared engine

The browser API and `plate:freeze-landmarks` / `plate:register` CLI wrappers call `scripts/plate_registration/engine.mjs`. This prevents policy differences between the UI and CLI. The centered similarity solver avoids the previous uncentered normal equations.

A frozen experiment includes source/render hashes, declared pixel-Y orientation, selected profile snapshot, independent scale expectation, point coordinates, point roles, sectors and provenance. A second file records the content hash. The executor revalidates those objects and rehashes the actual files, rather than comparing only stored strings.

JSON target provenance must have a known `source_id`, a non-placeholder `locator`, and `independent_of_fit: true`. This is an operator declaration; the software cannot establish genuine historical independence from a declaration alone.

Example:

```json
{
  "source_sha256": "<hash of imported PDF>",
  "render_sha256": "<hash of its local plate PNG>",
  "pixel_axis": "Y_DOWN",
  "threshold_profile_id": "threshold.historical_plan_similarity.v1",
  "scale_expectation": {
    "meters_per_pixel": 0.02,
    "source_id": "src.petrie1883",
    "locator": "<independent scale reference; replace this example>",
    "independent_of_fit": true
  },
  "landmarks": []
}
```

The numerical scale above is illustrative, not a measurement of Petrie Plate VI. Each landmark needs `id`, `role`, `source_px`, `target_m` and structured `target_source`. Select enough points and sectors for the active profile.

## Mutability

Drafts remain editable in the browser and can be exported. Freeze and fit outputs are exclusive writes. Changing a file outside the application invalidates its seal; a new experiment needs a separate preserved project copy. These are local integrity checks, not a cryptographic attestation against an administrator who can rewrite the whole project.

## Security boundary

Loopback bind, Host validation, per-session mutation token, origin checking, body limits, safe paths and symlink checks protect the local service. No general shell or arbitrary-file-read endpoint exists. PDF utilities are invoked with argument arrays, not command interpolation. This is a single-user research application, not a hosted multi-user service.

## Scientific boundary

A passed local fit is not archaeological authenticity, a global Giza survey tie or a recovered ritual. A matching page count is only an import check. The built-in demo is separately labelled synthetic and cannot write canonical results.
