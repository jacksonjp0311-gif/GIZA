import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
const geo = read('public/model/field/geospatial_frame.json');
const terrain = read('public/model/field/terrain_registry.json');
const photos = read('public/model/field/photo_graph.json');
const uncertainty = read('public/model/field/uncertainty_envelopes.json');
const promotion = read('public/model/field/promotion_state.json');
const acquisition = read('public/model/field/acquisition_targets.json');
const manifest = read('public/model/field/field_manifest.json');
const clusters = read('public/model/field/photo_clusters.json');
const mapped = read('public/model/field/mapped_stone_candidates.json');
const terrainImports = read('public/model/field/terrain_imports.json');
const parts = read('public/model/parts.json').parts ?? [];
const sources = read('public/model/evidence/source_registry.json').sources ?? [];
const errors = [];
const warnings = [];
const partIds = new Set(parts.map(p => p.id));
const sourceIds = new Set(sources.map(s => s.id));

if (geo.reference_anchor.status !== 'CONTEXT_ANCHOR_ONLY') errors.push('WGS84 anchor must remain context-only before survey tie');
if (geo.reference_anchor.vertical_authority !== 'NONE') errors.push('vertical authority must remain NONE until datum is solved');
if (!sourceIds.has(geo.reference_anchor.source_id)) errors.push('geospatial anchor source missing from registry');
if (terrain.active_layer && terrain.render_status === 'NO_DEM_BYTES_INGESTED') errors.push('terrain active without ingested DEM bytes');
for (const layer of terrain.layers ?? []) {
  if (layer.display_allowed && (!layer.local_asset || !layer.transform_receipt)) errors.push(`${layer.id}: display enabled without asset/transform receipt`);
}
const photoIds = new Set((photos.nodes ?? []).map(n => n.id));
for (const edge of photos.edges ?? []) {
  if (!photoIds.has(edge.a) || !photoIds.has(edge.b)) errors.push(`photo edge references missing node: ${edge.a} -> ${edge.b}`);
  if (edge.overlap_status === 'CONFIRMED' && edge.photogrammetry_use === 'NONE') errors.push(`confirmed overlap cannot be NONE: ${edge.a}/${edge.b}`);
}
for (const record of uncertainty.records ?? []) {
  if (!partIds.has(record.target)) errors.push(`uncertainty target missing: ${record.target}`);
  for (const p of record.parameters ?? []) {
    if (!sourceIds.has(p.source_id)) errors.push(`${record.target}: uncertainty source missing ${p.source_id}`);
    if (!(p.uncertainty > 0)) errors.push(`${record.target}: non-positive numeric uncertainty ${p.quantity}`);
  }
}
for (const state of promotion.states ?? []) {
  if (!partIds.has(state.target_id)) errors.push(`promotion target missing: ${state.target_id}`);
}
for (const target of acquisition.targets ?? []) {
  if (target.target.startsWith('part.') && !partIds.has(target.target)) errors.push(`acquisition target missing: ${target.target}`);
}
const deep = parts.filter(p => p.provenance?.class === 'UNVERIFIED');
if (deep.length !== 31) errors.push(`deep claim count changed: ${deep.length}`);
if (manifest.terrain_active !== false) errors.push('FIELD manifest terrain_active must be false until actual DEM ingestion');
if (manifest.photo_nodes !== photos.nodes.length) errors.push('photo node count mismatch');
if (manifest.numeric_uncertainty_targets !== uncertainty.records.length) errors.push('uncertainty count mismatch');
for (const cluster of clusters.clusters ?? []) {
  for (const id of cluster.media ?? []) if (!photoIds.has(id)) errors.push(`${cluster.id}: missing media ${id}`);
  if (cluster.known_overlap && cluster.status === 'INSUFFICIENT_VIEWS') errors.push(`${cluster.id}: contradictory overlap state`);
}
for (const c of mapped.candidates ?? []) {
  if (!/^cell\.c\d{3}\.[NESW]\.\d{3}$/.test(c.analysis_cell_id)) errors.push(`${c.id}: invalid cell id`);
  if (c.canonical_mutation !== false) errors.push(`${c.id}: FIELD candidate may not auto-mutate canon`);
}
for (const imp of terrainImports.imports ?? []) {
  if (imp.display_allowed !== false || imp.status !== 'QUARANTINED') errors.push(`${imp.id}: imported terrain must remain quarantined before QA`);
}

console.log('GIZA // FIELD validation');
console.log(`parts=${parts.length} sources=${sources.length} photoNodes=${photos.nodes.length} photoEdges=${photos.edges.length}`);
console.log(`uncertaintyTargets=${uncertainty.records.length} promotionTargets=${promotion.states.length} acquisitionTargets=${acquisition.targets.length}`);
console.log(`photoClusters=${clusters.clusters.length} mappedCandidates=${mapped.candidates.length} terrainImports=${terrainImports.imports.length}`);
console.log(`terrainActive=${terrain.active_layer ?? 'NONE'} unverifiedParts=${deep.length}`);
if (warnings.length) console.warn(warnings.join('\n'));
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('PASS');
