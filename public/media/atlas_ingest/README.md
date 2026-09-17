# ATLAS INGEST media cache

This directory is intentionally empty in the chat-built release. The chat runtime cannot reliably materialize remote media bytes.

On a networked desktop, run:

```bash
npm run media:harvest
npm run media:harvest:download
```

The harvester queries the Wikimedia Commons API across the registered Khafre categories, deduplicates file titles, reads per-file license/attribution metadata, rejects files whose license is not recognized as free/public-domain, and optionally caches eligible originals under `cache/` with SHA-256 receipts.

A cached photograph remains visual evidence only. It cannot write metric geometry until camera/plan registration, scale/control, datum, uncertainty and residual checks pass.
