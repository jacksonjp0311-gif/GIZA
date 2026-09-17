# CHECKSUM HANDOFF — v0.10.11

## Purpose

Convert the remotely identified Petrie PDF into reproducible local byte custody without allowing remote metadata, filenames or browser rendering to masquerade as a cryptographic source seal.

## Remote identity fingerprint

The current remote provider record identifies:

- work: W. M. Flinders Petrie, *The Pyramids and Temples of Gizeh* (1883);
- Internet Archive identifier: `cu31924012038927`;
- provider page count: 315;
- provider file-size display: 8.87 MB;
- current Wikimedia file history event: 13 Dec 2020;
- PDF format metadata: 1.5;
- Plate VI target: PDF page 305.

These values are `REMOTE_PROVIDER_METADATA_FINGERPRINT_NONCRYPTOGRAPHIC`.

## Local import contract

`source-bytes:import-petrie` requires an actual PDF file. It checks the PDF signature and requires `pdfinfo` to report 315 pages before copying the file into the vault and computing SHA-256.

Success changes only:

```text
REMOTE_FILE_IDENTITY_LOCKED_LOCAL_BYTES_UNAVAILABLE
→ LOCAL_CACHED_SHA256_VERIFIED
```

It does not change canonical geometry.

## Render contract

`plate:render-vi` requires the source SHA-256 to recompute correctly. It then renders page 305 at 300 dpi and hashes the PNG. Pixel landmarks may reference only that render hash.

## Review contract

`plate:confirm-vi` requires an explicit operator `--confirm`. The receipt states only that the operator inspected the checksum-bound render and found the expected Plate VI title/scale.

## Failure behavior

A transfer, import, page-count, hash, render or confirmation failure stops downstream authority. No fallback screenshot, generated drawing or remote browser image is promoted.
