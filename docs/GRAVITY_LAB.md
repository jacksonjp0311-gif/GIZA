# Gravity Lab v0.9

## Sign convention

GIZA uses +Z upward. The engine reports both:

- `upward_delta_g_microgal`
- `conventional_downward_delta_g_microgal`

A missing mass/void has negative density contrast. Its conventional downward anomaly is therefore negative.

## Scientific guardrails

- The modeled deep structures are unverified.
- Density contrast is an assumed screening value.
- A predicted anomaly is not a detected anomaly.
- No geological background model is active yet.
- No instrument/noise model is active yet.
- This solver cannot change source geometry or evidence maturity.

## Desktop next steps

1. run density/depth/size sensitivity sweeps;
2. add terrain correction;
3. add regional geology density field;
4. compare with plausible instrument sensitivity and station spacing;
5. add finite rectangular-prism analytic benchmark;
6. design a pre-registered observation pattern before comparing with measurements.
