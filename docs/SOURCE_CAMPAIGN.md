# 0.12.0 live integration addendum

The existing acquisition/freeze/fit/replay/review/rollback engine remains the
only fitting path. [Live Evidence Integration](LIVE_EVIDENCE_INTEGRATION.md)
documents the new governed PLAN_2D graph bridge, session verification capability
and impact behavior. Earlier sidecar-only descriptions below describe the
historical implementation. Imported campaign inspection is still claim-only
until local replay. The real campaign remains BLOCKED on archaeological inputs.

# Scoped Khafre source-to-result workflow

Historical 0.11.1 implementation: The campaign engine/2-D claim scope is preserved; see the 0.11.1 integration-status section below and `RELIABILITY_0_11_1.md` for current investigation rule identities.

## Claim boundary

This workflow binds source bytes, attributable identity, permitted-use declarations, feature locators, independent scale/control assertions, frozen holdouts and shared-engine results. It adds reviewed **local 2-D plan evidence**, not a guessed 3-D transform. Body/lid seating and assembly-to-monument/site placement remain unresolved. Reviews are operator-attributed, not authenticated scholarly endorsement. Source/render association is explicitly operator-confirmed; this adapter does not claim automatic page extraction or photogrammetry.

The existing `scripts/plate_registration/engine.mjs` remains the sole fitting/gate implementation. Profile files and sector minima are copied unchanged into each isolated campaign and checked against the originals. No old Plate VI campaign is reused. Historical `plate_vi_render_*` keys occur only inside the documented legacy-engine custody adapter; the candidate, source bytes, page locator and campaign ID are independently scoped to the new campaign.

## Actual software path

Normal launcher: `npm start`. In the Evidence Assembly, **Compare → Open scoped Khafre source campaign** opens the local registration workbench page. The page supports acquisition JSON, identified landmark JSON, freezing, fitting, packet export, replay, scoped review and rollback. It uses the existing loopback/token-protected server. Private research directories under `.giza-research/` are excluded from Git and release manifests.

An acquisition document contains:

- `config`: `giza.scoped-campaign.v1`, unique ID, assembly ID, preregistered question and acceptance question, `PLAN_2D_ONLY`, target local-plan frame, metres, page locator, feature identification, source identities/rights/underlying-source lineage, existing threshold profile ID, and landmark-to-feature bindings.
- `assembly`: the exported physical assembly contract; it is strictly validated and hashed.
- `sourcePdfBase64`, `renderPngBase64`: exact source/render bytes; checksums are recomputed, not accepted from an imported success flag.
- `controlAssets`: source-ID-bound independent control bytes.
- `visualConfirmation: true`: explicit operator page-identification assertion, not automatic authentication.

Landmark inputs preserve `source_px`, `target_m`, source ID/locator/independence, CONTROL/HOLDOUT role and declared uncertainty (`BOUND`, `STANDARD_UNCERTAINTY`, or UNKNOWN with null value). Scale expectation must be independently attributable. `INDEPENDENT_CONTROLLED` rejects controls without preserved independent-source bytes, sources sharing the primary underlying-source lineage, and model-derived targets. It additionally requires stated control uncertainty for review. `DOCUMENTARY_CONSISTENCY` is a weaker, explicitly named claim, never independent archaeological confirmation. `SYNTHETIC_SOFTWARE_QA` never becomes archaeology.

The acquisition, identified-input snapshot, engine freeze and result remain separate records. Export includes bytes, source attribution, configuration, original assembly, frozen inputs, result and available revision/rollback records. Replay creates a **new directory**, rehashes bytes, reruns the shared engine and compares numerical output without requiring identical execution timestamps. Imported historical review records remain historical; replay is not re-authentication of the reviewer.

An accepted revision adds a source-pixel→local-plan relationship, lists affected features, records the original assembly hash, and states the visible difference. It does not change any 3-D geometry. Rollback is another retained record restoring base-assembly interpretation; it does not delete the original review, fit, failed holdouts or source bytes.

## Reproducible positive demonstration (software only)

Run from the repository, choosing a new directory each time:

```powershell
npm run evidence:campaign -- demo .giza-research/qa-example
npm run evidence:campaign -- replay .giza-research/qa-replay .giza-research/qa-example/packet.json
npm run evidence:campaign -- rollback .giza-research/qa-example "Software rollback demonstration"
```

The generated point-layout/custody fixture is conspicuously synthetic, not a historical scan. The positive run uses four controls and two untouched holdouts; it recovers the known 0.02 m/pixel similarity. Its exact zero residual is a software-fixture result, **not an archaeological measurement or accuracy certification**. The current retained example is under `verification/evidence-boundaries/source-positive-0-11-0/`; the earlier custody-prefix fixture remains preserved as an earlier software artifact. The current fixture generates a structured PDF and a PNG point layout. Tests also perturb a holdout, remove scale, alter bytes, forge results, and assert false source independence. They do not lower profile minima or omit failed holdouts. `negative NEW_DIRECTORY` generates a retained failed-holdout packet and denied review.

Other CLI commands:

```text
acquire NEW_DIRECTORY ACQUISITION.json
freeze DIRECTORY LANDMARKS.json
fit DIRECTORY
export DIRECTORY NEW_PACKET.json
replay NEW_DIRECTORY PACKET.json
review DIRECTORY REVIEW.json
rollback DIRECTORY REASON
```

`REVIEW.json` supplies reviewer, substantive note and `acceptPlanScope: true`. Review replays before acceptance. Existing campaign directories, freezes, results and accepted revision files cannot be overwritten. CLI rejection attempts are retained where an acquired campaign exists. Export/replay is a local research operation; it never publishes source bytes to GitHub.

## Real archaeological campaign: BLOCKED

The preregistered question is whether a correctly identified historical coffer/chamber plan agrees with independently surveyed corresponding features in a declared local 2-D frame. The complete machine-readable assessment is `public/model/evidence_assembly/campaign-khafre-plan-blocked-20260917.json`.

Relevant leads were checked at [Digital Giza](https://giza.fas.harvard.edu/pubdocs/551/full/) and [the Petrie Project text](https://petrieproject.com/book/the-pyramids-and-temples-of-gizeh). Digital Giza's citation describes a 1990 reprint of the 1883 work, so edition/page identity and permitted use cannot be assumed from the catalog title. Existing assembly observations identify Petrie §§75–77, pp.105–108. Neither a citation nor the same measurements copied into another catalog provides independent control.

Missing: confirmed and checksum-preserved relevant image bytes/usage scope, identifiable feature correspondences, an independent control source and its bytes/lineage, independent scale, declared local datum/axes and uncertainty, and preregistered distributed controls/holdouts. No archaeological fit was attempted through unmet gates. No unrelated valley-temple authority was borrowed.

## Storage and compatibility

Browser investigations use `giza.saved-investigation.v2`: canonical points/frame/mode/result/section and original assembly are physical research inputs; selection, visibility, inspection separation, camera and bookmarks are presentation. Existing v1 studies remain readable with their original hash, treating the old `draft.selectedId` as a compatibility-only selection field. Studies without a dependency-rule field replay under `canonical-measurement.v1`; new studies explicitly declare v2, which excludes display labels from calculation identity. Old v1 experiment receipts replay but are UNVERIFIABLE for current applicability; v2 receipts record dependency fingerprints. Local storage has corruption preservation, duplicate validation, quota reporting and stale-tab checks—not atomic multi-user or archival durability.

## Fresh-user assembly demonstration

1. Run `npm start`; choose **Sarcophagus** in Quick Views.
2. In **Evidence**, select a feature. Choose **Direct observation support**, then **Related context**, to see why shared-assembly context does not become support.
3. In **Measure**, select the coffer or lid local frame and two exact anchors, or select a section and pick its cut surface. The output declares its frame; a body-to-lid measurement remains UNKNOWN.
4. In **Investigate**, select **Lid/body length compatibility**, then **Run reproducible computation**. The 1.27 mm arithmetic difference is not a seated clearance or tolerance.
5. **Save investigation**, then **Export saved record**. Reload, reenter Investigate, and **Open saved snapshot**. The header identifies original archived inputs. **Import investigation** verifies/replays exported files and safely handles identical duplicates.
6. Run `npm run test:browser` for the reproducible challenge: a clearly labelled browser-only synthetic revision changes the lid measurement. The old computation becomes HISTORICAL and current review is blocked until rerun. Opening the old study still restores its original geometry. No archaeological file is changed by that test.
## 0.11.1 integration status

The shared acquisition/fit/replay implementation is preserved. The Explorer comparison panel explicitly labels imported campaigns SIDECAR ONLY — NOT CONSUMED BY LIVE GRAPH, shows claimed snapshot/revision/source/frame identities, and does not claim local replay. Its workbench link uses the configured launcher proxy. A successful reviewed 2-D campaign still does not change 3-D archaeological geometry. See `RELIABILITY_0_11_1.md` for the connected investigation workflow and smallest next acquisition. Existing v2 saved studies now use measurement-rule v3; earlier rule identities replay historically without being backfilled.
