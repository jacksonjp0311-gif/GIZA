# 0.11.1: aligned investigation contracts

## Scope and reproduced audit findings

The starting tree was clean at `91b738a82b2a2d5529be70694e2fdb7bac418e71` (0.11.0). New adversarial assertions initially failed: imported geometry could overclaim authority, an edge could add undeclared observation support, inherited unit keys were accepted, and distant non-box points could be saved. They now reject at shared boundaries. Subsequent full-check failures are retained, including an over-restricted promotion-index relationship and the explicitly revised uncertainty expectation.

Remote run `35290841094` was inspected, not inferred from local tests. Ubuntu checks/browser/smoke passed. Windows checks passed, browser cap hunting timed out (nine other tests passed), and smoke was skipped. Its failed log is preserved as `verification/evidence-boundaries/remote-91b738a-windows-failure.log`. A new local success does not rewrite that remote failure. No new remote run is claimed without publication and actual execution.

## Executable contracts

- `graph.ts`: feature `observationIds` is the authoritative direct-support representation. Imported edges must agree exactly. Relationship endpoint kinds, identities, geometry ownership/authority/frame, uncertainty ownership, source custody ownership, transform endpoints and constraint membership are checked. RELATED_CONTEXT remains legitimate but never becomes direct support. Assembly validation is reused, including transform cycles. Promotion research indexes remain non-mutating indexes, not physical constraints. Internal consistency is not historical authenticity.
- `membership.ts` and `validateCanonicalMembership`: metre-frame numerical tolerance is `max(1e-7 m, 64 * machine epsilon * coordinate scale)`, independent of archaeological uncertainty. Boxes require bounded surfaces; segments require bounded projections and supporting-line distance; points require coincidence; simple planar polygons use closed boundaries and concave-aware point inclusion. Degenerate, self-crossing and nonplanar polygons fail. Renderer triangulation now uses the same validated polygon projection instead of assuming convexity. Computed cap points additionally require their archived plane and actual retained originating box volume. Unknown geometry/coordinates cannot supply located picks. No stored point is moved.
- Unit tables have no prototype. Native and normalized conversions, overflow and uncertainty dimensions are checked even without optional quantity metadata. Original uncertainty representation remains intact. Bounds, standard uncertainty, rounding, unspecified magnitude and unknown remain distinct.
- New calculations use `giza.comparison-rules.v3`: normalize compatible units, include attributable source records in dependency identity, and sum only explicitly declared uncertainty bounds. Other supplied magnitudes are not silently propagated as statistical uncertainty. v1/v2 replay keeps original arithmetic/interpretation; old rules are not silently current.
- New saved studies retain envelope `giza.saved-investigation.v2` and declare `canonical-measurement.v3`. Source attribution is included; local-only measurements do not depend on unrelated parent transforms. v1/v2 measurement rules remain available for archived fingerprint replay. Original snapshot hash and dependency fingerprint are separate. New linked results identify their original; neither is overwritten.

## Historical access

Graph parsing defaults to current semantic validation. `inspectHistoricalGraph` explicitly separates original-v1 structural readability from current eligibility. Receipt v1 archived replay never grants current applicability. Receipt v2 reproduces its recorded v2 or v3 calculation rule. No archived checksum or metadata is rewritten.

Saved studies restore only when checksum, snapshot, geometry membership and original calculation reproduce. The contextual **Inspect historical file without restoring** route preserves bytes and distinguishes ARCHIVED_REPLAY_VERIFIED from CHECKSUM_ONLY_NOT_REPLAYED. The latter shows the recorded result as historical data, grants no authority, and does not attach points to live geometry. The original file can be exported. A checksum alone never proves that an ambiguous record was valid under a former contract.

## Explain and compare

The existing Investigate panel, not a new workspace, offers **Explain / compare inputs** for experiments and saved studies. Structured record comparison identifies exact dependency paths and original/current values, rule, frame, source attribution, feature geometry, uncertainty, authority and necessary transforms/derivations. Unrelated presentation labels, camera movement and contextual annotations are not computational changes.

No unsupported physical overlay is introduced. Locating an experiment feature uses the existing 3-D/evidence navigation and retains the investigation panel state. A linked rerun creates another immutable record. Saved-point reruns reuse the exact points only if they remain valid in current geometry; otherwise they reject and require an explicit new measurement.

### Reproducible researcher demonstration

1. `npm start`; select **Sarcophagus**, select **feature.lid.envelope**, and open **Measure**. Choose the lid local frame and Anchor 1/Anchor 2.
2. Open **Investigate**, select **Lid/body length compatibility**, and run the reproducible computation. Save the investigation and export its saved record.
3. Reload and open the saved snapshot. The archived-input indicator remains visible. Use **Explain / compare inputs** to inspect the original result and exact dependencies.
4. Run `npm run test:browser`. The actual-application test uses a clearly labelled browser-only synthetic lid-measurement revision, then asserts the exact difference `inputs.nodes.m.coffer.lid_length.data.value`, HISTORICAL applicability and a new linked computation. It reopens and exports the untouched original study. No archaeological dataset is changed.
5. Numerical regressions change only a display label and an unrelated local-frame parent relation: the new local measurement remains CURRENT. They also verify older-rule replay without silently upgrading the record.

### Deterministic section demonstration

The browser test enables read-only `?spatialDiagnostics=1`, establishes the actual section, waits for four stable rendered camera/layout frames, projects triangle-interior points from actual cap meshes, and performs real pointer clicks. It asserts feature/frame identity, computed-section provenance and canonical z = -0.3 m, then measures, saves, exports, reloads and restores. Receiving the computed cap rather than the clipped exterior verifies the ray was not captured by that discarded surface. There is no injected pick, forced click, timeout increase or broad screen search. Diagnostics are off in ordinary use.

## Source campaign handoff

The acquisition/freeze/fit/replay/review/rollback engine is unchanged. Campaign inspection explicitly says **SIDECAR ONLY — NOT CONSUMED BY LIVE GRAPH** and shows imported assembly-snapshot, revision, target-frame and source identities. This panel has not replayed source bytes and says so; verification remains in the shared local engine. A reviewed plan relation is still 2-D and does not establish lid seating, 3-D surfaces or site placement. The scoped workbench link now respects the launcher proxy/custom ports and is tested through that proxy.

The smallest next real acquisition is a correctly identified, permitted-use coffer/chamber plan image with preserved bytes/page identity and a documented independent local scale/control source. First resolve a narrowly defined local-plan correspondence question with frozen controls/holdouts and uncertainty. Copying Petrie's dimensions into target points is documentary consistency, not independent control. The real campaign remains BLOCKED; no new archaeological fit was attempted.

## Performance and CI

Core-first startup is preserved. Graph construction remains memoized against assembly inputs; explanations are requested contextually rather than rebuilt on viewport frames. Receipt reuse is cached only for recursively frozen, previously verified objects; mutable/imported objects still pass verification. No workers or new runtime dependencies were added. No startup/frame-rate improvement is claimed from these changes alone.

CI separates dependency setup, contracts, compilation, browser installation/interaction and compile/start smoke. Smoke runs after a browser failure if compilation succeeded. Public stage logs, browser HTML reports, screenshots and traces upload with 14-day retention. Only dedicated verification output paths are included; private source custody and local research folders are excluded. Logs live outside Playwright's automatically cleared test-results directory. Rendering/environment failure classification still requires inspecting the artifacts, not guessing from a timeout.

See root VALIDATION.md for exact final executions, environment, successor Ubuntu limitations and release integrity results. All earlier failure records and manifests remain historical.
