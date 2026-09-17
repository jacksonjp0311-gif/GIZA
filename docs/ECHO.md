# GIZA v0.9.2 // ECHO

ECHO is the first executable acoustic branch inside GIZA SIMLAB.

Its job is not to prove that the Pyramid of Khafre was designed as an acoustic machine. Its job is to ask a narrower, testable question:

> Does the known / derived Khafre interior exhibit acoustic behavior that is unusually geometry-specific when compared with reasonable controls?

## What ECHO currently models

ECHO v0.9.2 uses a **screening-level analytical model**:

- rigid-wall rectangular cavity modes for the burial and lower chambers
- 1-D open/open passage mode families for known passage segments
- a first-order dry-air sound-speed model at 20 °C
- a visualization-only screening Q of 12
- deterministic ±5% geometry perturbation controls
- a construction-aware perturbation family that preserves selected repeated passage relationships
- a 3-D pressure-mode visualization for the burial chamber

This is intentionally simpler than FEM. It is benchmarkable, fast, transparent, and useful for deciding what deserves higher-fidelity simulation.

## Human-readable result

The current screening run gives:

- burial chamber lowest rectangular-envelope mode: **12.12 Hz**
- lower chamber lowest rectangular-envelope mode: **16.43 Hz**
- analytical modes below 150 Hz across the 12 modeled components: **354**
- near-coincidence clusters among the first 8 modes/component: **7**
- simple independent ±5% null mean: **3.825 clusters**
- construction-aware ±5% null mean: **4.850 clusters**

The actual model lies near the **97th percentile** of the simple independent-perturbation control and around the **91st percentile** of the construction-aware control.

That is a **PATTERN WATCH**, not evidence of deliberate tuning. Repeated passage dimensions and construction relationships naturally increase spectral coincidence. The construction-aware null reduces the apparent outlier status, which is exactly why both controls are required.

## What the 3-D colors mean

In ECHO mode the burial chamber displays a simulated pressure mode:

- **orange** — positive pressure phase
- **blue** — negative pressure phase
- **dark / small** — near a pressure node

The field is normalized. It is not a measured sound-pressure level.

## What would strengthen the result

A higher-fidelity acoustic conclusion requires:

1. better constraint on lower-chamber clear height
2. explicit gabled-roof geometry in the acoustic mesh
3. measured or defensible wall-absorption / loss parameters
4. junction scattering and coupled-volume physics
5. mesh-convergence testing against the analytical screen
6. ideally, in-situ impulse-response or reverberation measurements

## Truth invariant

`SIMULATED` output cannot promote archaeology.

The existence of resonance is expected in enclosed spaces. A deliberate-design claim requires behavior that remains unusual under realistic uncertainty and construction-aware null models.
