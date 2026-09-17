# GIZA v0.10.0 // PRIMARY SOURCE VAULT

PRIMARY SOURCE VAULT is the chain-of-custody layer between a cited source and a datum used by GIZA.

## Why this exists

A URL, a citation, a normalized observation and a local source file are not the same thing. Reproducible research requires the exact source artifact—or an explicit statement that it has not been acquired—plus rights, checksum, parser version, locator and a receipt for every derived datum.

## Acquisition states

- `REMOTE_VERIFIED` — landing/download identity verified, bytes not present locally.
- `REMOTE_HASH_LOCKED` — an upstream record supplies a checksum, but bytes are not locally present.
- `LOCAL_CACHED` — exact source bytes exist locally and their SHA-256 is recorded.
- `REFERENCE_ONLY` — source may be cited/read but rights or access do not authorize bundling.
- `ACCESS_RESTRICTED` — authenticated/member/paywalled source; GIZA must not bypass the gate.
- `DOWNLOAD_URL_UNRESOLVED` — source names an asset but the exact download URL has not been verified; GIZA does not invent one.

## Release paths

```text
public/vault/
├── manifest.json
├── assets.json
├── rights_policy.json
├── remote_locks.json
├── cache_status.json
├── snapshots/
├── receipts/
└── raw/
```

`public/vault/raw/` may contain only redistributable primary artifacts. Lawful local-analysis files that cannot be redistributed belong in `.vault-cache/`, which is excluded from the release.

## Normalized snapshots

The JSON files in `public/vault/snapshots/` are `DERIVED_NORMALIZED_SNAPSHOT` records. They preserve verified source facts and acquisition metadata. **They are not raw source bytes.** Every snapshot is SHA-256 bound to a verification receipt.

Current snapshots cover Petrie's 1883 scan identity, the Open Context ARCE Sphinx project frame/method metadata, Dash's Giza survey-asset index, the 2020 Giza materials study, and the 2025 ScIDEP Khafre muography method paper.

## Important ARCE frame fact

The Open Context ARCE Sphinx project documents a local Sphinx grid with N3000/E500 references, orientation to magnetic north on 20 February 1978, a local +10 m elevation marker, and an approximate +9.331 m relationship used to convert Sphinx-local elevations to mean sea level according to the project tie. This is preserved as a **Sphinx-project datum**, not automatically applied to Khafre or GPMP.

## Fetching on a networked desktop

```bash
npm run vault:fetch:dry
npm run vault:fetch -- --source vault.petrie1883.pdf
npm run vault:fetch -- --source vault.opencontext.arce_sphinx.project_json
npm run validate:vault
```

`vault:fetch` fails closed on checksum mismatch. It refuses restricted/unresolved sources and skips release bundling when redistribution permission is not explicit. `--private-cache` is available only for lawful local analysis of a source that has a verified direct URL but may not be redistributed.

## Parser receipts

A cached byte file is still not a datum. Extraction must create a receipt binding:

```text
asset ID
+ exact input SHA-256
+ parser name/version
+ page/table/record locator
+ output path
+ truth class
+ geometry authority
```

Use `npm run vault:receipt -- ...` after a parser has produced an output. Geometry promotion remains a separate VAULT/CANON process.

## Chat-sandbox status

This release contains **zero raw primary binaries**. Direct container network/DNS acquisition is unavailable here, so GIZA records sources as remote-verified/hash-locked/reference-only instead of falsely claiming they were downloaded. The architecture and fetch/checksum path are implemented and ready for a networked desktop.

## v0.10.6 plan-byte acquisition boundary

SOURCE-BYTE REGISTRATION tracks four priority plan families separately from PRIMARY SOURCE VAULT. Petrie public-domain bytes are remotely located; Perring IIIF/facsimile is remotely located with provider-terms review; Hölscher facsimile imagery is rights-gated; ARCE 1:100 plan class is archive-confirmed but exact item bytes are unresolved. **No new raw plan file is locally cached in this release.** Failed/unsupported download attempts do not change custody state.
