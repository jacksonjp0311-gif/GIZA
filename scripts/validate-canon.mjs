import fs from 'node:fs';
import path from 'node:path';

const base = path.resolve('public/model');
const read = f => JSON.parse(fs.readFileSync(path.join(base,f),'utf8'));
const registry = read('evidence/source_registry.json');
const rights = read('evidence/rights_matrix.json');
const map = read('evidence/object_source_map.json');
const conflicts = read('evidence/conflict_matrix.json');
const parts = read('parts.json').parts ?? [];
const props = read('research/material_properties.json');
const future = read('research/complex_measurements.json');
const errors = [];
const warnings = [];

const ids = new Set();
for (const s of registry.sources ?? []) {
  if (ids.has(s.id)) errors.push(`duplicate source id ${s.id}`);
  ids.add(s.id);
  for (const k of ['access','rights_class','asset_action','authority','resolution','roles']) {
    if (s[k] === undefined) errors.push(`${s.id}: missing ${k}`);
  }
  if (s.targets?.includes('deep_claim_layer') && (s.authority?.geometry ?? 0) > 0)
    errors.push(`${s.id}: deep-claim source illegally has geometry authority`);
}

const partIds = new Set(parts.map(p=>p.id));
for (const p of parts) {
  if (!map.parts?.[p.id]) errors.push(`missing object-source mapping: ${p.id}`);
  if (p.provenance?.class === 'UNVERIFIED') {
    const rows = map.parts?.[p.id] ?? [];
    if (rows.some(r => !['NONE'].includes(r.write_authority) && !['METHOD_RISK_CONTEXT','GEOLOGICAL_NULL_CONTEXT'].includes(r.role)))
      warnings.push(`review unverified mapping ${p.id}`);
  }
}
for (const id of Object.keys(map.parts ?? {})) if (!partIds.has(id)) errors.push(`mapping references missing part ${id}`);

for (const r of rights.rows ?? []) if (!ids.has(r.source_id)) errors.push(`rights references missing source ${r.source_id}`);
for (const c of conflicts.conflicts ?? []) for (const o of c.observations ?? []) if (o.source_id && !ids.has(o.source_id)) errors.push(`${c.id}: missing source ${o.source_id}`);
for (const m of future.measurements ?? []) {
  if (!ids.has(m.source_id)) errors.push(`${m.id}: missing source ${m.source_id}`);
  if (m.geometry_use !== 'FUTURE_SCOPE_ONLY') errors.push(`${m.id}: future scope measurement not locked`);
}
if (props.status !== 'MATERIAL_CONTEXT_NOT_UNIVERSAL_BLOCK_PROPERTY') errors.push('material properties lost context guard');
const deep = parts.filter(p=>p.provenance?.class==='UNVERIFIED');
if (deep.length !== 31) errors.push(`deep claim count changed: ${deep.length}`);

console.log('GIZA v0.10.7 CANON validation');
console.log(`sources=${registry.sources.length} parts=${parts.length} rights=${rights.rows.length} conflicts=${conflicts.conflicts.length}`);
console.log(`futureMeasurements=${future.measurements.length} materialProperties=${props.properties.length} unverifiedParts=${deep.length}`);
if (warnings.length) console.warn('WARNINGS\n'+warnings.join('\n'));
if (errors.length) { console.error('ERRORS\n'+errors.join('\n')); process.exit(1); }
console.log('PASS');
