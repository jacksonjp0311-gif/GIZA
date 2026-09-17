# Component Explorer: code and source audit

Reviewed 2026-09-16. Product release remains 0.10.12; local launches receive an external +dev.N build identifier.

## Findings and implemented changes

- Quick Views previously selected an interior preset on the entire pyramid. Sarcophagus, burial chamber, and lower chamber now open a dedicated component scene. Additional lid, roof/context, upper-passage and portcullis shortcuts are included.
- Inspector View in Context and Isolate buttons previously had no handlers. They now open component scenes; Measurements opens the existing specifications. Related-component tiles open individual models.
- The separate camera frames local component bounds, preserving useful zoom precision for metre-scale objects without the full pyramid's framing. Recenter, top view, object/context toggles and a room-fit control are explicit actions. Lid and dimension changes do not reset the camera.
- Every one of the 56 canonical parts is available through a searchable component catalog. Existing CAD or primitive geometry is reused without claiming new surface detail. Unverified geometry remains labeled unverified.
- The burial chamber is a cutaway interior using existing measured dimensions. The coffer is hollow with separately inspectable body/lid. The lower chamber has measured plan extents but its inherited 2.40 m display height remains explicitly unverified.
- Removed the inspector's arbitrary 16-measurement truncation. The new evidence drawer exposes component-bound photographs, measurements, source locators, placement observations, licenses, and limitations.
- Added five licensed photographic/diagram reference records in a separate research supplement. Existing indexes and source receipts are preserved. The supplement merges into the runtime photo library (13 existing + 5 added records); the historic ingest validator still correctly reports 13 for its original index.
- TypeScript now runs before every production build and during preflight. Fixed numeric props in MapVisuals and included Vite environment declarations. Declaration files are type-checked, not fed into the transpile-only syntax checker.

## Survey basis and a discovered discrepancy

Primary text: W. M. Flinders Petrie, *The Pyramids and Temples of Gizeh* (1883), chapter IX §§75–78, pp.105–109:
https://petrieproject.com/book/the-pyramids-and-temples-of-gizeh

The existing 127-row measurement dataset already includes coffer outside dimensions 103.68 × 41.965 × 38.12 inches and cavity dimensions 84.73 × 26.69 × 29.58 inches. The new geometry reads those records directly in SI units; it does not copy rounded display numbers back into the scientific data. The lid uses measured length/width and mean reported thickness; its taper is not reconstructed.

The transcript reports west clearances 43.1/42.9 inches and north clearance 42.5 inches. Their relationship to the chamber dimensions indicates a north–south coffer axis near the west wall. The old overview preview places its long axis east–west. The component scene uses the source-derived local placement; the frozen overview coordinates are unchanged. This distinction is recorded in the supplement and shown in the evidence drawer.

Petrie describes the coffer recessed to lid level in the original paving and the detached lid on the chamber floor. The detail scene's floor aperture is schematic, and a floating/lifted lid is explicitly an inspection pose. It is not a current-condition reconstruction. Display wall thickness, doorway display height, floor aperture clearance, material grain and lighting are illustrative. No individual roof-beam joints or unmeasured damage are invented. Two pin bores are recorded as research observations but not modeled until ledge and bore placement can be checked against scan/plate evidence.

## Photographs and other references

Existing coffer reference: Jon Bodsworth, 2007, free-use license:
https://commons.wikimedia.org/wiki/File:07_khafre_coffer.jpg

Added records (author, license, source page and nonmetric authority retained individually in `public/model/component_research.json`):

1. Franck Monnier, chamber axonometric, CC BY 2.5: https://commons.wikimedia.org/wiki/File:Khephren-axono-chambre.jpg
2. Onceinawhile, 2022 chamber interior, CC BY-SA 4.0: https://commons.wikimedia.org/wiki/File:Interior_of_Khafra_Pyramid_2022.jpg
3. Hispalois, 2006 roof detail, CC BY-SA 3.0: https://commons.wikimedia.org/wiki/File:PiramideKefren_-_interior_-_detalle_01.JPG
4. Agostino Aglio, 1821 historical illustration, public domain: https://commons.wikimedia.org/wiki/File:Great_Chamber_in_the_second_pyramid_of_Gizeh.jpg
5. Franck Monnier, chamber/passage section, public domain: https://commons.wikimedia.org/wiki/File:Khephren-plan.jpg

Harvard Digital Giza reconstruction catalog reference: https://giza.fas.harvard.edu/photos/88582/full/
This is a work-in-progress reconstruction still, not a measured mesh. It is all-rights-reserved; no image or mesh was copied into the repository.

## Remaining work before exact replicas are defensible

The catalog supplies individual inspection of all existing parts, not 56 newly surveyed replicas. Many remain simplified envelopes and 31 parts retain UNVERIFIED provenance. Photographs are visual references, not camera-calibrated geometry. No scan, photogrammetric fit, raw primary PDF registration, metric ray, or geometry promotion was produced.

Next acquisition priorities are a checked primary plate for coffer ledges/bores, calibrated overlapping modern imagery or licensed scans, present-day paving/lid positions, surveyed room/roof stone joints, and passage wall profiles. Each component needs its own coverage record and uncertainty review before replacing an envelope. Synthetic masonry cells are not a brick-by-brick archaeological inventory.

## Research refinement, second pass — 2026-09-16

Added four photographs by Hispalois (2006-03-30, CC BY-SA 3.0): Commons files `PiramideKefren - interior - detalle 03.JPG` (opening), `04.JPG` (coffer detail), `05.JPG` (another coffer detail), and `06.JPG` (chamber floor). Full source-page URLs, authors, dates, license links and descriptive limits are in each supplement record. Added Franck Monnier's `Khephren-axono-embranchement.jpg` (2007-05-05, CC BY-SA 3.0) for the lower junction. The latter's source requests commercial-use notification; no third party was contacted and no separate commercial clearance was obtained. These are visual references, not metric geometry.

Ten additional observations were transcribed from Petrie chapter IX §§77–78: four pin-hole center offsets derived from reported edge ranges, four north/south ledge width endpoints, and two lower-chamber doorway offsets. Native inches, converted metres, locators, derivation statuses and component bindings are stored. No new scientific measurement campaign is claimed. The primary scan and metric registration remain pending.

The optional coffer pin overlay shows the reported mean diameter (1.07 in / 27.178 mm) at derived midpoint positions. These are labeled annotations, not boolean-cut bores; no depth is invented. Ledge width ranges remain evidence records, not uniform modeled grooves.

The lower room now uses the measured east-wall width, mean north/south length, and east-door plan: 40.9 in north clearance + 41.2 in opening + 41.0 in south clearance = 123.1 in east width. Its doorway is shown as a full-height cutaway because doorway elevation is unverified. The 2.40 m display wall height remains an assumption.

Gallery refinement: photograph/drawing filters, visible dates/licenses, clear failed-preview links, and source-page deduplication in both inspector and detail gallery. All original records remain intact; the duplicate 2022 photograph is suppressed only in display. Runtime storage now has 23 media records (22 distinct source pages), including the 10-record research supplement. Added regression checks for doorway closure, pin location bounds, unit conversions, bindings, source resolution and non-mutating deduplication.

## Reproducible checks

`npm run check` includes strict TypeScript, existing scientific/static checks, 25 registration repairs tests, ten component tests, and workbench module validation. `npm run build` type-checks and produces the Explorer. Four canonical files retain the SHA-256 hashes recorded in `verification/canonical-model-preserved.json`. Current browser checks and any limits are recorded in `VALIDATION.md`.
# Additional collection — 2026-09-16

Supplement v3 adds David Holt's catalogued 1995 interior photograph, Leon Petrosyan's 2021 burial-chamber photograph, and Franck Monnier's funerary-apartments plan. Each record links its Commons source page and license. Holt's exact passage segment is unresolved, so its binding stays at pyramid level. The plan is interpretive, not a registered survey plate.

Six observations from Petrie Chapter IX §§75–76 record the limestone floor-paving range (9–14 in), reported underside saw overcut (0.20 in), coffer surface finish, chamber wall/roof construction and historical floor disturbance. SI conversions are tested. These records do not alter meshes or canonical measurements.

Rejected/deferred candidates: `Inside the Pyramid - Flickr - liber.jpg` already exists in the original index; `Detail-axe-khephren.jpg` has unresolved reuse-provenance concerns; `The Pyramid of Khofru 1.jpg` has insufficiently specific description for a safe component binding. No duplicate or uncertain-rights image was added.
