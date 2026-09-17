# PLATE VI LANDMARK PROTOCOL — v0.10.11

## Why names freeze before coordinates

Landmark selection can itself become a source of researcher degrees of freedom. If points are chosen after residuals are visible, the fit can be made to look artificially good.

v0.10.11 therefore preregisters named landmark *classes* before checksum-bound pixels exist.

## Sectors

The template distributes candidate points over five sectors:

- `WEST_LOCULI`
- `TRANSVERSE_HALL`
- `T_HALL`
- `EAST_TRANSITION`
- `CAUSEWAY`

The frozen release stores every pixel and target coordinate as `null`.

## Freeze requirements

A real landmark file must bind:

```text
source_sha256 = exact local Petrie PDF
render_sha256 = exact locally rendered Plate VI PNG
```

Each selected landmark then stores:

```text
id
role = CONTROL | HOLDOUT
source_px = {x,y}
target_m = {x,y}
target_source = explicit provenance
```

Minimum distribution:

- controls ≥ 4;
- holdouts ≥ 2;
- controls span ≥ 3 sectors;
- holdouts span ≥ 2 sectors.

## Target-coordinate rule

`target_m` must have explicit provenance. It may come from an independently registered survey source or a separately documented historical metric construction. It must not be invented from the same fit it is being used to test.

## Holdout rule

Holdouts are invisible to the solve. They are evaluated only after the similarity transform has been fit to controls.

## Non-claim

A low residual shows geometric agreement within the declared local frame. It does not establish original ritual choreography, ancient intent, a perfect master grid or global plateau georeferencing.
