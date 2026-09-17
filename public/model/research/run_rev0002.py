#!/usr/bin/env python3
"""ARCHEON Model 02 rev.0002 deterministic physics baselines.
No external dependencies required for JSON/CSV calculations. Deep-geometry values are conditional hypotheses, not observations.
"""
from pathlib import Path
import csv, json, math
ROOT=Path(__file__).resolve().parents[1]
P=json.loads((ROOT/'research'/'model_parameters.json').read_text())
G=6.67430e-11; g=9.81
rho=2600.0; rho_w=1000.0
L=float(P['reported_subsurface']['shaft_depth_m']['value'])
r=float(P['reported_subsurface']['shaft_radius_m']['value'])
s=float(P['reported_subsurface']['terminal_size_m']['value'][0])
result={
 'revision':'rev.0002',
 'conditional':True,
 'shaft_volume_m3':math.pi*r*r*L,
 'hydrostatic_head_pa':rho_w*g*L,
 'terminal_pointmass_microgal':G*(rho*s**3)/(L**2)/1e-8,
 'air_halfwave_hz':343/(2*L),
}
out=ROOT/'research'/'results'/'rev0002_metrics_runtime.json'
out.write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
