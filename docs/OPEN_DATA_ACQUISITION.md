# Open Data Acquisition — Desktop Queue

The canonical queue is `public/model/evidence/acquisition_backlog.json`.

The first desktop acquisition should be **metadata-first** rather than downloading every available image. Recommended order:

1. Open Context ARCE Sphinx Project metadata/API.
2. Wikimedia Khafre interior per-file metadata and licensed originals.
3. Petrie page-level source snapshots/locators.
4. Hölscher locator audit.
5. Digital Giza record graph for Khafre plates/plans.
6. SRTM terrain tile and coordinate transform.
7. Copernicus DEM crosscheck.
8. ScIDEP data request if desired.
9. Material-prior solver ingestion.
10. Smithsonian IIIF metadata references.

Large media should remain quarantined until deduplication, hashing, rights verification, and target-object assignment are complete.
