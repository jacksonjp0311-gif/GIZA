> v0.9.9 ARCHIVE HARVEST note: this subsystem remains active beneath the new confirmed-source corpus. Shared OBSERVATORY artifacts were versioned to 0.9.9; scientific/sample semantics are unchanged unless explicitly listed in `docs/ARCHIVE_HARVEST.md`.

# GIZA v0.9.6 // ATLAS INGEST

ATLAS INGEST expands the OBSERVATORY/REGISTER backend from source records into a rights-aware visual evidence atlas. It does **not** turn photographs into geometry automatically.

## Discovery surfaces

The registered discovery layer now includes:

- Digital Giza — Khafre Pyramid `All Photos` catalog (406 records at access time)
- Wikimedia Commons — Pyramid of Khafra root category
- Interior of Khafra Pyramid
- Details of Khafra Pyramid
- Historical images of Khafra Pyramid
- Drawings of Khafra Pyramid
- Mortuary complex of Khafra
- Mortuary Temple of Khafra
- Valley Temple of Khafra
- Interior of Valley Temple of Khafra

Commons category counts overlap. `media_collections.json` therefore preserves each count separately and explicitly forbids summing them into a unique-image total.

## Three layers of visual evidence

### 1. Collection discovery

`public/model/observatory/media_collections.json` records collection URLs, access-time counts, rights model and harvest method. Collection visibility is not a reuse license.

### 2. Individually rights-reviewed assets

`media_catalog.json` contains selected files whose license/permission, source page, author, dimensions and intended research use were individually reviewed. The current set includes exterior/casing, passage, chamber, sarcophagus, historical section, causeway, high-resolution interior and Valley Temple context.

`public/media/observatory/ATTRIBUTION.json` is the attribution sidecar that must travel with any later cached bytes.

### 3. Photo observations

`photo_observations.json` stores what an image can actually support. Every record has a truth class, metrology status and guard. Examples:

- visible casing/core context: `PHOTO_OBSERVATION`
- a passage photograph: `PHOTO_METROLOGY_CANDIDATE`
- 1821 section drawing: `REFERENCE_CROSSCHECK_ONLY`
- a consumer geotag: `CAMERA_CONTEXT_NOT_SURVEY_CONTROL`

No uncalibrated image may write metric geometry.

## Desktop Commons harvester

The release includes a MediaWiki API harvester:

```bash
npm run media:harvest
npm run media:harvest:download
```

It walks the registered Khafre categories, deduplicates file titles, retrieves dimensions/URLs/EXIF-style metadata/license metadata, automatically accepts only recognized free/public-domain license families, and can cache eligible originals with SHA-256 hashes.

The chat build does **not** claim those remote bytes were downloaded. This environment cannot reliably materialize Commons originals. The harvester is intended to run on the networked desktop.

## Facade condition literature

ATLAS INGEST adds the 2016 open-access Procedia Engineering paper by Seglins & Kukela, DOI `10.1016/j.proeng.2016.08.777`. The paper reports photographic documentation of Khafre facades during 2009–2012 and in-situ verification of major crack/fracture locations in 2012.

GIZA stores this as structural-condition/method evidence only. It does not modify nominal pyramid geometry and does not infer crack causes beyond the source.

## Time-series opportunity

The important cross-domain opportunity is not “look at lots of photos.” It is:

```text
archival image + modern image + known plan/survey
        ↓
camera / feature registration
        ↓
transform residuals + uncertainty
        ↓
repeat-view condition comparison
```

That can eventually support defensible studies of visible casing loss, crack/fracture persistence, masonry surface change and viewpoint-consistent condition records. Until registration passes, it remains a research priority rather than a measurement claim.
