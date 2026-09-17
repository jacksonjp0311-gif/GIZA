# GIZA v0.9.3 // STRATA

STRATA is the first combined geomechanics + hydraulic screening branch inside SIMLAB.

## Question

If the current **UNVERIFIED** deep geometry were literal, what first-order mechanical load and hydrostatic-head regime would its stated depths imply?

STRATA does **not** answer whether those structures exist, whether they are stable, whether they contain water, or whether they can deliver useful flow/power.

## Mechanical screen

The first-order vertical overburden proxy is:

`σv = ρrock g h`

Using 2600 kg/m³:

- 648 m: ~16.52 MPa
- 720 m: ~18.36 MPa

The current CANON material prior for tested Khafre backing-limestone samples is 12.1–17.8 MPa UCS. The overlap is scientifically important because it makes rock-mass structure and confinement first-order questions, but the ratio is **not a factor of safety**. The current screen omits horizontal stress, joints, bedding, cavity stress concentration, support, scale effects, water weakening and excavation history.

## Hydraulic screen

For a hypothetical connected fresh-water column:

`p = ρwater g h`

- 648 m: ~6.35 MPa
- 720 m: ~7.06 MPa
- 648 m gravitational potential: ~1.77 kWh per cubic metre

These are conditional head calculations. GIZA has no current evidence that such a connected water column exists. STRATA deliberately refuses to compute flow because permeability, fracture connectivity, hydraulic gradient and recharge/discharge boundaries are unresolved.

## Upgrade gate

The next mechanical fidelity level requires site-specific stratigraphy/discontinuities, rock-mass parameters, an in-situ stress model, groundwater state and mesh-converged FEA. Hydraulic flow requires evidence-bound permeability/connectivity and boundary heads before Darcy-type calculations are enabled.
