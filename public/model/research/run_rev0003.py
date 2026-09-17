from pathlib import Path
import json, math, csv
ROOT=Path(__file__).resolve().parent.parent
meas=json.loads((ROOT/'research/measurements.json').read_text())['measurements']
nodes=json.loads((ROOT/'research/survey_nodes.json').read_text())['nodes']
print(f"measurements={len(meas)} nodes={len(nodes)}")
print((ROOT/'research/results/rev0003_validation.json').read_text())
