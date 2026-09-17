import fs from 'node:fs';
import path from 'node:path';

const base = path.resolve('public/model');
const read = rel => JSON.parse(fs.readFileSync(path.join(base, rel), 'utf8'));
const parts = read('parts.json').parts ?? [];
const sources = read('evidence/source_registry.json').sources ?? [];
const items = read('evidence/evidence_items.json').items ?? [];
const maturity = read('evidence/evidence_maturity.json').levels ?? [];
const policy = read('evidence/promotion_policy.json');
const photoJobs = read('evidence/photo_metrology_jobs.json');
const pgJobs = read('evidence/photogrammetry_jobs.json');
const queue = read('evidence/promotion_queue.json').candidates ?? [];
const assets = read('evidence/media_assets.json').assets ?? [];
const spatial = read('evidence/spatial_registration.json');
const snapshot = read('evidence/geometry_snapshot.json');

const errors = [];
const ids = new Set(parts.map(p => p.id));
const sourceIds = new Set(sources.map(s => s.id));
const levels = new Set(maturity.map(m => m.id));

for (const s of sources) {
  for (const key of ['id','title','kind','url','access','rights','asset_action']) if (!s[key]) errors.push(`${s.id ?? '?'} missing ${key}`);
}
for (const item of items) {
  if (!levels.has(item.maturity)) errors.push(`${item.id}: unknown maturity ${item.maturity}`);
  for (const target of item.targets ?? []) if (!ids.has(target)) errors.push(`${item.id}: missing target ${target}`);
  for (const src of item.source_ids ?? []) if (!sourceIds.has(src)) errors.push(`${item.id}: missing source ${src}`);
}
for (const key of ['E0_to_E1','E1_to_E2','E2_to_E3','E3_to_E4','E4_to_E5']) if (!policy.gates?.[key]) errors.push(`missing promotion gate ${key}`);
if (photoJobs.schema?.output_maturity_max !== 'E1') errors.push('single-view photo metrology must max out at E1');
if (!Array.isArray(pgJobs.state_machine) || !pgJobs.state_machine.includes('PROMOTABLE')) errors.push('photogrammetry state machine incomplete');
for (const c of queue) if (!c.id || !c.current_maturity || !c.next_requirements?.length) errors.push(`promotion queue candidate malformed: ${c.id ?? '?'}`);
for (const a of assets) {
  if (a.geometry_status !== 'QUARANTINED' && !['REVIEWED','PROMOTED','REJECTED'].includes(a.geometry_status)) errors.push(`${a.id}: unknown geometry_status ${a.geometry_status}`);
  if (!sourceIds.has(a.source_id)) errors.push(`${a.id}: unknown source ${a.source_id}`);
}
if (spatial.canonical_engineering_frame?.units !== 'm' || spatial.canonical_engineering_frame?.up_axis !== 'Z') errors.push('canonical engineering frame drift');
if (!snapshot.geometry_hash || snapshot.geometry_hash.length !== 64) errors.push('geometry snapshot hash missing/invalid');

console.log(`GIZA v0.10.7 evidence validation sources=${sources.length} items=${items.length} maturityLevels=${maturity.length} queue=${queue.length} quarantinedAssets=${assets.length}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('PASS');
