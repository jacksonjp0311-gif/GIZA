# Interior inspection and inscription lab — 2026-09-17

## Implemented

**Khafre:** `Remove shell / inspect inside` is a temporary inspection mode. It hides both the canonical external envelopes and the independent procedural masonry instances, terrain, registration overlays, and simulations. It shows 22 non-hidden, non-UNVERIFIED internal components regardless of the ordinary internal-layer switch. Filter the upper system, lower system, or burial/sarcophagus assembly; fit the visible envelopes; select a component and isolate it in the existing object workspace. Explosion remains available. Restore shell reinstates the ordinary layer selections in an assembled pose. Inspection never edits canonical part geometry or provenance.

**Sphinx:** `Expose carved bedrock` removes the synthetic repair skin and the freestanding stela, assembles the display regions, and enables the schematic geology palette. This is not a hollow-shell or chamber reconstruction. Existing region isolation and section controls remain available. The hand-parameterized surface is still illustrative, not a registered scan.

**Inscription Lab:** available from Quick Views and the Sphinx controls. The Dream Stela is the initial artifact. Bundled Kurohito detail and HoremWeb context photographs plus a Lepsius historical facsimile carry visible author/date/license/source metadata; source bytes are unchanged. See `public/epigraphy/SOURCES.md` for rights, acquisition date, dimensions and hashes.

- Source inspection: zoom 100–400%, independent contrast/grayscale adjustments, scrolling, source-image-specific reading zones, freehand interpretive traces, overlay visibility and undo trace. Display enhancement is not image reconstruction or recovery of erased marks.
- Reconstruction: 1,072 character identities from the Unicode 17.0.0 Egyptian Hieroglyphs base block (U+13000–U+1342F), searchable by Gardiner-style identifier/category, with code labels and sign undo. This excludes Extended-A; linear rendering does not implement historical quadrat composition or mirrored sign forms. Unicode data license and an unmodified Noto Egyptian font with its OFL license are bundled. The font character map is tested against every palette sign; system fallbacks and code labels remain available if font loading fails.
- Translation board: observations/damage, proposed signs, direction, transliteration, translation, interpretation/alternatives, source locator and operator review. No translation is prefilled. An operator attestation requires a translation, citation and reviewer; it is not independently authenticated. Subsequent edits return it to draft.
- Drafts: local browser persistence; JSON backup; bounded/schema-validated append-only imports; source identity and coordinates checked. Imports become drafts. Removing a zone offers one-step undo while the lab remains open. Local storage is not a multi-user repository or archival backup.
- AI bridge: export a bounded source-linked review packet, then paste an external JSON proposal into a separate unreviewed field. Copying that proposal into the working reading requires an explicit click and does not validate it. No model provider, OCR, remote inference, automatic upload or automatic translation is connected. External outputs remain untrusted data and never modify canonical geometry.

## Audit: what to evolve next

### Connected Dream Stela artifact workflow — 2026-09-17

The lab now opens on **Artifact overview**: an unchanged credited context photo, a published-height reference with its unresolved alternate, notebook counts and routes into source inspection, interpretation and visual prediction. **Locate in the 3D Sphinx** opens the stela in isolation with the existing original photograph in the reference desk and a published-height annotation. Select the stela in the Sphinx workspace and choose **Explore this artifact** to return. This is a navigation link, not image-to-mesh registration; the display mesh remains an uninscribed envelope.

Source inspection adds Navigate-mode drag panning, arrow keys / Shift-arrow / Page Up/Down / Home / End, and **Fit selected zone**. Fitting is display-only and bounded to 100–400%; it never changes normalized observations. Tracing and zone marking remain separate modes. An artifact-specific style scope prevents the legacy global sand-text override from flattening hierarchy or reducing primary-button contrast.

Notebook saving compares the current stored bytes with the bytes loaded by this tab. A stale tab cannot perform an ordinary sequential overwrite; a banner offers draft export, stored-byte backup and explicitly guarded reload. Unreadable saved notebooks are preserved, and the original loaded bytes remain available as a recovery snapshot if later access fails. Unsaved drafts are guarded on lab exit and browser unload. This is optimistic detection, not an atomic lock or collaborative merge service; truly simultaneous writes are not guaranteed conflict-free.

Notebook data is limited to 2,000,000 UTF-8 bytes; an edit that exceeds the limit is rejected without changing the working notebook. Compact exports retain source/authority metadata; imports permit an additional bounded 64,000 bytes for that envelope, then enforce the data limit after parsing and merging. Async file imports merge against the latest open notebook rather than the state before the file read. File imports still append as drafts, never replace source data or automatically validate a reading. A download action is not proof the operator retained a backup.

### Restoration hypotheses and story integration — 2026-09-17

The lab now has three workspaces: **Inspect & translate**, **Restoration hypotheses**, and **Story & sources**. The existing three licensed evidence images remain unchanged. A separate pre-generated AI color concept is available only for the Kurohito detail photograph; it is never an evidence-image or reading-coordinate source. Original and prediction appear side by side with 100–300% comparison zoom, persistent prediction labels, source attribution and the full generation receipt at `public/epigraphy/RECONSTRUCTION-RECEIPT.md`.

The manual color workspace stores up to 100 bounded normalized strokes per reading zone, with palette, brush width, display opacity, undo, rationale and alternative interpretations. These are whole-image coordinates grouped under a reading zone, not a calibrated stone surface. Existing v1 notebooks migrate to an empty prediction layer. Imports validate points/colors/size and force PREDICTION / NOT_ESTABLISHED authority; operator translation review cannot validate pigment. Local storage and JSON include the sketch and notes, and the manual AI review packet includes them with their warning. Zoom and brush/display settings are session controls, not archival properties.

The AI example was made with the built-in image-generation tool, not an application inference endpoint. Fine marks and contours may change. Do not transcribe, translate or measure generated marks. The watermark, source/output hashes, CC BY-SA 3.0 adaptation credit, exact prompt and limitations are preserved. There is no live OCR, automatic reconstruction or automatic translation; all proposed readings still require a cited human review.

The story board links the Ministry's monument context, Harvard's paraphrase of Thutmose IV's dream narrative, ARCE's contextual pigment discussion and a Digital Giza Berlin squeeze record. The latter is linked only, not acquired or licensed for local redistribution. Contextual pigment is not a mapped pigment assignment to a glyph; a paraphrase is not a critical line translation. No missing sign or complete translation is asserted.

The earlier roadmap is a dated snapshot; search, camera controls, startup, shell inspection and the initial epigraphy workflow have since advanced. The main open engineering gaps are now:

| Priority | Current limitation / evidence | Next delivery and acceptance gate |
|---|---|---|
| 1 | Overview internal geometry is mostly solid envelopes; detailed burial/coffer geometry uses a separate local frame (`MonumentLayer`, `DetailGeometry`). | Registered object-to-assembly transforms and connected hollow passage meshes. Demonstrate consistent placement and dimensions across overview/detail before offering an accurate walkthrough. |
| 1 | Sphinx surface, erosion and repair blocks are procedural (`src/sphinx`). | Acquire rights-cleared survey elevations / overlapping photographs or an independently scaled scan. Register to control with holdouts; publish residuals and missing coverage. Do not call the current mesh exact. |
| 1 | Dream Stela images have different viewpoints and evidential roles; neither is registered to the 3D stela. | Trace reviewed sign polygons, document line IDs and a rights-cleared critical edition, then add camera-to-surface mapping. A historical facsimile must remain distinct from surviving marks. |
| 1 | Sign identity, language reading and translation are currently manual. | Connect a chosen OCR/vision provider through a server-side adapter only after evaluating it on expert-labeled lines. Store alternatives, model/version, input hashes and abstentions; never auto-promote machine output. No provider should receive user notes/images without explicit user initiation. |
| 2 | Unicode reconstruction is linear and lacks quadrat placement/rotation/mirroring. | Add a structured sign-layout editor with uncertain/restored/lost-sign notation, Unicode formatting controls or a documented encoding, and a separate diplomatic versus normalized edition. |
| 2 | `loadModel` casts fetched records; optional datasets are still part of a broad load. Local inscription drafts are browser-bound. | Runtime schemas, independent optional-workspace loading, storage migrations, merge history and repository-backed review records. Malformed optional data must not prevent core 3D use. |
| 2 | Large main bundle, procedural stone update cost and many legacy CSS overrides remain. | Lazy-load workspaces, profile real interaction/frame times, introduce instancing/LOD budgets, consolidate component styles, and automate keyboard, pointer, touch and responsive-layout checks. |

## Research references

- Dream Stela photograph / CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Dream-stela.jpg
- Dream Stela carved detail / CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:Gizeh-Stele_du_reve.jpg
- Lepsius facsimile / public domain: https://commons.wikimedia.org/wiki/File:Giseh_Traumstele_(Lepsius)_01.jpg
- Unicode sign identities, not phonetic translations: https://www.unicode.org/Public/17.0.0/ucd/UnicodeData.txt
- TLA scholarly corpus and dictionary: https://thesaurus-linguae-aegyptiae.de/search?lang=en
- Digital Rosetta Stone text/image alignment research: https://www.digital-rosetta-stone.org/
- Sphinx survey/archive acquisition starting point: https://aeraweb.org/publications/data/

The next meaningful milestone is a reviewed, source-linked Dream Stela line mapped onto a registered 3D surface—not an uncited full translation or invented internal chambers.

### Subsequent Sphinx refinement

The Sphinx now has photo-informed profile meshes, a credited offline photo-comparison desk, and focus-in-context controls. Its mesh is still interpretive; the survey-registration gate above is unchanged. The Sphinx and Inscription Lab now load on demand, addressing the first part of the bundle recommendation. Legacy main-bundle size, frame-time profiling, registered interiors, quadrat composition and connected OCR remain open. See `SPHINX_EXPLORER.md` for the refinement's exact scope and limits.

## Verification

`npm run test:epigraphy` covers shell filters, reversible subset selection, fit bounds, image coordinates, notebook schemas, invalid imports, review downgrading, AI-proposal isolation, source-byte hashes and Unicode identities. Run the full `npm run check`, compiler build and release seal/verification before redistribution. Dated results and browser coverage are in `VALIDATION.md`.
