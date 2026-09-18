# Pre-repair reproduction — 2026-09-18

Base HEAD: 3074047ce8c39950b5d03814b1a40408f55c7739, plus preserved uncommitted UI/media repairs.
Command: node --test tests/live-evidence.test.mjs
Environment: Windows, Node 24.18.0.
Result before repair: 3 tests, 0 passed, 3 failed.

1. Synthetic H-04: HYPOTHESIS + RESOLVED + AUTHORITATIVE_RECONSTRUCTION + rigid translation [100,0,0]. measurePoints returned KNOWN, not UNKNOWN.
2. Graph built from a transform whose record authority was HYPOTHESIS wrapped it as RECONSTRUCTED.
3. A feature-owned synthetic constraint referencing a non-direct observation was absent from DERIVED_DEPENDENCIES. DIRECT_SUPPORT correctly excluded it.

These are software fixtures, not archaeological evidence. This record preserves the original failed checkpoint; subsequent test outcomes do not replace it.
