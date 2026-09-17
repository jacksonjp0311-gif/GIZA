# SOURCE PARSER — v0.10.4

SOURCE PARSER is the provenance bridge between GIZA's evidence corpus and machine-actionable behavioral reconstruction.

## Why it exists

Earlier releases correctly accumulated sources, observations, primary-source targets, rights state and source locators. The missing layer was an explicit distinction between:

1. a web/source record that has been verified;
2. a normalized observation copied from that record;
3. a datum parsed from checksum-bound primary bytes;
4. an interpretation derived from that datum.

v0.10.3 makes those states machine-readable.

## Current release state

The sandbox still has **zero newly acquired raw primary binaries**. Therefore the ten current parser records use `NORMALIZED_OBSERVATION` mode and set `raw_byte_verified=false`. This is deliberate. A locator-bound observation is useful provenance, but it is not a byte-level parser receipt.

Current parser targets cover:

- royal-funeral/afterlife function;
- post-burial offering cult;
- Valley Temple find inventory;
- the official Khafre statue record and iconography;
- a causeway statue-head find;
- surveyed causeway width;
- Pyramid Temple find inventory;
- the reconstructed royal doorway/architrave context;
- Perring's sarcophagus setting.

## Authority rule

```text
REMOTE SOURCE
    ↓
NORMALIZED OBSERVATION + SOURCE LOCATOR
    ↓
SOURCE PARSER RECORD
    ↓
ACTION GRAPH / SYNTHESIS
```

This path cannot increase geometry authority.

The stronger path is future work:

```text
LOCAL PRIMARY BYTES
    ↓ SHA-256
BYTE PARSER + PAGE/PLATE/TABLE LOCATOR
    ↓
PARSER RECEIPT
    ↓
REVIEWED DATUM
    ↓
SEPARATE PROMOTION GATE
```

Only the second path may claim `RAW_PRIMARY_BYTES` input mode.

## Commands

```bash
npm run source:parse
npm run validate:source-parser
```

## Canonical artifacts

- `public/model/source_parser/targets.json`
- `public/model/source_parser/parsed_records.json`
- `public/model/source_parser/parser_receipts.json`
- `public/model/source_parser/locator_contract.json`
- `scripts/source_parser/build.mjs`
- `scripts/source_parser/validate.mjs`

## Non-negotiable guard

SOURCE PARSER is a lineage system, not an OCR-confidence laundering system. If primary bytes are absent, the release must say so.

## v0.10.4 downstream refinement

SOURCE PARSER now emits 26 locator-bound records and feeds ROOM GRAPH / PRIMARY PLAN PARSER. ACTION GRAPH remains 14 nodes / 14 edges; room-scale topology is resolved separately so behavioral inference does not masquerade as measured architecture.
