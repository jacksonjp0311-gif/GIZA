# GIZA v0.9.8 // REGISTRATION LAB

REGISTRATION LAB turns ATLAS INGEST from a media archive into a spatial-evidence workflow. Its purpose is **not** to make photographs look aligned with the model; it is to solve, quantify and audit the mapping between image space and GIZA's engineering frame.

## Core rule

A photograph can influence metric geometry only after the relevant camera/control problem is solved and the residuals are stored.

```text
rights-reviewed image
    + camera prior / calibration
    + image-space control points
    + world / survey control points
        ↓
registration solve
        ↓
residuals + holdout review + transform receipt
        ↓
E1 rectified measurement or E2 pose/mesh candidate
        ↓
VAULT / FIELD review
        ↓
possible promotion
```

A visual match is never a datum transformation.

## What v0.9.8 implements

### Camera-prior registry

`public/model/registration/camera_priors.json`

Every rights-reviewed ATLAS asset now receives a camera prior assembled from available dimensions, EXIF focal length/camera model and consumer GPS. Important limits are explicit:

- EXIF focal length is a prior, not a calibrated intrinsic matrix.
- sensor dimensions remain unresolved unless independently known.
- the principal point defaults to image center only as an assumption.
- distortion remains unresolved.
- consumer GPS remains `CONTEXT_ONLY_NOT_SURVEY_CONTROL`.

### Candidate world controls

`world_control_candidates.json` contains derived model anchors that can be used for correspondence marking once their visibility is confirmed:

- Khafre base-corner candidates and summit from the current Petrie-derived envelope
- burial-chamber box corners
- sarcophagus corners
- lower-chamber corners
- selected passage centerline endpoints

These are **candidate anchors**, not claimed image matches. Modern survey control should supersede derived model anchors where available.

### Registration jobs

Ten photo jobs are seeded from the strongest ATLAS assets. Jobs begin at `CONTROL_CANDIDATES_READY`; no pixel correspondences are fabricated.

State machine:

```text
DISCOVERED
→ MEDIA_VERIFIED
→ CONTROL_CANDIDATES_READY
→ PIXEL_CONTROLS_MARKED
→ SOLVED
→ QA_PASSED
→ REVIEWED
→ E1_RECTIFIED_CANDIDATE / E2_POSE_CANDIDATE
→ PROMOTABLE
```

Any job can become `REJECTED`.

### Planar-registration solver

For same-plane work, GIZA now includes a dependency-free homography solver:

```bash
npm run registration:benchmark
npm run registration:solve-planar -- <job-id>
```

The default QA gate remains 2 px reprojection RMSE, inherited from the earlier photogrammetry contract, but it is a **project review default**, not a universal law. Control spread and holdout review are also required before an E1 candidate is accepted.

This solver is appropriate for rectifying walls, slabs, inscriptions or other defensibly planar surfaces. It is not a substitute for a 3-D camera pose.

### Survey-control bridge

REGISTRATION LAB adds an acquisition register for high-value external controls:

- `Giza-Corner-Points-2v17.kmz`
- `GPMP-Control-Monuments.kmz`
- GDFS 2015/2016 survey datasets
- the documented 2025 first laser survey of Khafre

The public Dash survey index states that the Khafre corner/center estimates in its corner file derive from Petrie's 1880–1881 survey, while AERA describes the GPMP as a high-precision survey-control network. These resources are therefore high-value registration inputs, but **their coordinates are not present in GIZA until the files are actually acquired and imported**.

Use:

```bash
npm run registration:import-kml -- path/to/file.kml
```

Imported longitude/latitude/elevation remain in their native geographic context until a transform receipt states source CRS, vertical datum, target local frame, controls, residuals and uncertainty.

## QA philosophy

Every registration should answer:

1. What source geometry/control was used?
2. Are image points actually visible and unambiguous?
3. What camera parameters were fixed, assumed or solved?
4. What is the reprojection residual?
5. Are controls distributed across the image/target rather than clustered?
6. Was at least one holdout feature checked?
7. What metric uncertainty follows from the residual/control uncertainty?
8. Is this E1 local rectification or a real E2 multi-view/pose solution?

If those answers are missing, the photo remains documentary evidence only.

## Highest-value next execution

On the networked desktop:

1. run `npm run media:harvest:download`;
2. acquire the public Dash/GPMP survey-control files subject to rights review;
3. import controls and write CRS/datum receipts;
4. mark pixel controls in the best exterior images;
5. solve the first Khafre exterior cameras;
6. compare holdout residuals against the current Petrie-derived envelope;
7. pursue authorized 2025 laser-survey data as the preferred modern geometry constraint.

That is the route from “many photographs” to **measurable spatial evidence**.


## v0.9.8 CONTROL NET binding

Registration Lab now consumes `public/model/control_net/` for published survey orientation/frame constraints. Existing real photo jobs remain unsolved; no pixel controls or camera poses were invented. See `docs/CONTROL_NET.md`.
