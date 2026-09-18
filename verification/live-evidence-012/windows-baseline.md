# Remote baseline inspection — not a new product failure

Inspected GitHub run 35300535042, commit 3074047ce8c39950b5d03814b1a40408f55c7739.
Windows job: 2026-09-18 02:44:28Z–02:59:59Z, cancelled.
Browser installation: 02:45:57Z–02:49:28Z, success.
Browser stage: 02:49:28Z–02:59:31Z, cancelled at the job timing envelope.
Startup smoke: success, artifact reports exitCode 0 on win32 Node v22.23.2.
Ubuntu job completed successfully.

Downloaded retained artifact 10529768058 (verification-windows-latest-1, 26,371,484 bytes) for local inspection.
Its contracts/build/setup/smoke logs exist. The prior synchronous browser wrapper did not flush browser.log before cancellation. Browser traces/screenshots include Atlas and Evidence Assembly coverage. Retained files are under verification/remote-3074047-windows locally; the original remote artifact is unchanged.

Successor design separates contracts/build/smoke from four exhaustive browser groups on each OS; each retains its own bounded logs and traces. Logging now streams and marks a started-but-unfinished stage RUNNING_OR_INTERRUPTED. A local result is not a claim that the successor remote pipeline has completed.
