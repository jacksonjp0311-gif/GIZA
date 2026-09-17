# PRIMARY SOURCE VAULT raw cache

This directory is reserved for **redistributable primary-source bytes** acquired by `npm run vault:fetch`.

Current chat-sandbox release contains **zero raw primary binaries** because direct container network/DNS acquisition is unavailable. A source being remotely verified does not mean its bytes are locally cached.

Rules:

- Only assets whose rights explicitly permit bundling may be stored here.
- Every cached artifact requires a SHA-256 in `cache_status.json`.
- Restricted/reference-only material belongs outside the release in `.vault-cache/` when lawful local analysis is allowed.
- Checksum mismatch is a hard failure.
- Caching never changes geometry or evidence maturity.
