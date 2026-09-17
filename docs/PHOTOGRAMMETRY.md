# Photogrammetry and Photo Metrology Contract

## Single-image measurement

A single image may generate **E1** local estimates only.

Required:

- source/licensing record
- native pixel dimensions
- at least one real-world metric anchor
- anchor pixel endpoints
- target pixel endpoints
- same-plane assessment
- explicit uncertainty
- perspective warning

Do not imply perspective correction unless a camera model or planar rectification was actually solved.

## Multi-view photogrammetry

State machine:

```text
DRAFT
  -> MEDIA_VALIDATED
  -> CAMERA_SOLVED
  -> SCALE_LOCKED
  -> QA_PASSED
  -> CANDIDATE_MESH
  -> REVIEWED
  -> PROMOTABLE
```

A job may also become `REJECTED` at any stage.

Project defaults:

- minimum images: 3
- recommended independent scale anchors: 2
- default reprojection-RMSE review gate: <= 2 px
- coverage-diversity review required
- coordinate-frame receipt required

The 2 px gate is a project QA default, not a universal scientific law. Difficult imagery can require a different threshold, but changing it must be recorded.

## Stone promotion

Photogrammetry should first produce a candidate mesh/point cloud. It does not overwrite the procedural stone lattice.

A specific cell becomes a mapped stone only when the evidence identifies that physical element, defines its boundary/scale, states uncertainty, and receives a review receipt.
