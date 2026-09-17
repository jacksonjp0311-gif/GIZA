# Spatial Registration

GIZA's canonical engineering frame is right-handed, Z-up, and measured in metres.

Geographic data must never be dropped directly into this frame.

Every DEM, satellite raster, point cloud, or georeferenced mesh needs a transform receipt containing:

- source CRS
- source vertical datum
- target local frame
- control points
- transform model
- residuals
- uncertainty
- evidence/source IDs

WGS84 latitude/longitude degrees are not local XYZ metres. A visual alignment is not a datum transformation.
