# GIZA v0.10.6 // SOURCE-BYTE REGISTRATION

SOURCE-BYTE REGISTRATION is the custody and registration gate between a plan that exists on the web and geometry that GIZA is allowed to treat as metric.

## Current result

Four high-value source families are now registered as acquisition/registration candidates:

| Target | Current state | Use now |
|---|---|---|
| Petrie 1883 public-domain scan | `REMOTE_PUBLIC_DOMAIN_BYTES_LOCATED_NOT_CACHED` | citation / locator / acquisition target |
| Perring 1840 Part II | `REMOTE_IIIF_MANIFEST_LOCATED_NOT_CACHED` | OCR/facsimile locator / acquisition target |
| Hölscher 1912 | `RIGHTS_BLOCKED_FOR_BUNDLED_FACSIMILE` | OCR, metadata and remote reference only |
| ARCE Khafre Valley Temple 1:100 | `ITEM_URI_AND_EXACT_DRAWING_BYTES_UNRESOLVED` | archive-level survey target |

**Local checksum-bound source bytes in this release: 0.**

That number is intentionally not papered over. A remotely visible PDF, IIIF canvas or archive record is not source-byte custody.

## Registration contract

Metric promotion requires, in order:

1. legal local bytes;
2. SHA-256;
3. exact page / plate / drawing locator;
4. scale parse;
5. declared target coordinate frame;
6. at least four registration controls;
7. at least two independent holdout controls;
8. a preregistered residual/outlier policy;
9. manual review;
10. a separate geometry-promotion decision.

Registration cannot promote geometry automatically.

## High-priority locators

- Petrie: **Plate VI — Plan of Granite Temple**.
- Perring: **Plate I — section and plan of the Second Pyramid**, plus burial chamber / portcullis plates.
- Hölscher: **Plate III — Pyramid Temple overview** and gateway/Valley Temple material-light reconstruction; image reuse is rights-gated.
- ARCE/AERA/Open Context: detailed **Khafre Valley Temple mapping at 1:100**, exact item URI still to resolve.

See `public/model/source_byte_registration/` for machine-readable states.

---

## v0.10.7 acquisition receipts

The Petrie 1883 public-domain scan is now backed by explicit remote-identity receipts from Wikimedia Commons and Digital Giza plus two failed local-acquisition receipts. Failure to transfer bytes in this runtime leaves `raw_byte_verified=false`; it does not reduce the historical/source identity of the scan.

A desktop acquisition entry point is provided:

```powershell
.\scripts\desktop\Invoke-GizaFirstPlate.ps1
```

On a networked machine this flow downloads the allowed Petrie scan, computes SHA-256 locally, reruns the synthetic holdout benchmark and validates the custody state. Archaeological controls are still not invented automatically; they must be selected from the actual plate and frozen before fitting.

---

## v0.10.11 remote fingerprint vs local checksum

Provider-displayed page count, file size, pixel dimensions, file history and PDF metadata are now stored as a noncryptographic remote fingerprint. They help identify the intended object but carry zero checksum authority. Only a SHA-256 computed from local bytes can clear the source-byte gate.
