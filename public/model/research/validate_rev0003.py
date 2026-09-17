from pathlib import Path
import json, math, sys
ROOT=Path(__file__).resolve().parent.parent
def load(name): return json.loads((ROOT/name).read_text(encoding="utf-8"))
parts=load("parts.json")["parts"]; assemblies=load("assemblies.json")["assemblies"]; ij=load("interfaces.json")
interfaces=ij.get("interfaces",[]); ports=ij.get("ports",[])
part_ids={p["id"] for p in parts}; asm_ids={a["id"] for a in assemblies}; port_ids={p["id"] for p in ports}; all_ids=part_ids|asm_ids|port_ids
errors=[]
for p in parts:
    if p.get("parent") not in asm_ids: errors.append(f"missing parent: {p['id']} -> {p.get('parent')}")
    cad=p.get("spatial",{}).get("cad")
    if cad:
        rel=cad.get("preview") or (cad.get("path") if cad.get("format")=="stl" else None)
        if rel and not (ROOT/rel).exists(): errors.append(f"missing CAD: {p['id']} -> {rel}")
for a in assemblies:
    for c in a.get("children",[]):
        if c not in part_ids and c not in asm_ids: errors.append(f"missing child: {a['id']} -> {c}")
for i in interfaces:
    for k in ("a","b"):
        if i.get(k) not in all_ids: errors.append(f"missing interface endpoint: {i['id']} {k}={i.get(k)}")
claim_parents={"asm.upper","asm.deep.alpha","asm.deep.beta","asm.terminals"}
claim=[p for p in parts if p.get("parent") in claim_parents]
for p in claim:
    if p.get("provenance",{}).get("class")!="UNVERIFIED": errors.append(f"claim promoted: {p['id']}")
# Critical source-dimension sentinels catch variable collisions/document drift.
by_id={p["id"]:p for p in parts}
lc=by_id["part.lower.chamber"]["spatial"]["primitive"]
if abs(lc.get("sx",0)-10.45337)>1e-4 or abs(lc.get("sy",0)-3.13309)>1e-4:
    errors.append(f"lower chamber plan drift: {lc}")
bc=by_id["part.burial.chamber"]["spatial"]["primitive"]
if abs(bc.get("sx",0)-14.16431)>1e-4 or abs(bc.get("sy",0)-4.97459)>1e-4:
    errors.append(f"burial chamber plan drift: {bc}")
seq=load("assembly_sequence.json")["sequence"]
if len(seq)!=len(set(seq)) or set(seq)!=part_ids: errors.append("assembly_sequence does not cover parts exactly once")
measurements=json.loads((ROOT/"research/measurements.json").read_text())["measurements"]
print(json.dumps({"status":"PASS" if not errors else "FAIL","parts":len(parts),"assemblies":len(assemblies),"interfaces":len(interfaces),"measurements":len(measurements),"unverified_claim_parts":len(claim),"errors":errors},indent=2))
sys.exit(1 if errors else 0)
