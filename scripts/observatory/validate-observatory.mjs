import fs from 'node:fs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const root='public/model/observatory';
const manifest=read(`${root}/manifest.json`);
const obs=read(`${root}/observations.json`);
const pubs=read(`${root}/publication_catalog.json`);
const media=read(`${root}/media_catalog.json`);
const graph=read(`${root}/cross_domain_graph.json`);
const queue=read(`${root}/acquisition_queue.json`);
const receipts=read(`${root}/ingest_receipts.json`);
const sources=read('public/model/evidence/source_registry.json');
const sourceIds=new Set(sources.sources.map(s=>s.id));
const errors=[];
if(manifest.version!=='0.10.7') errors.push('manifest version drift');
if(obs.version!=='0.10.7') errors.push('observation version drift');
if(manifest.counts.observations!==obs.observations.length) errors.push('observation count drift');
if(manifest.counts.publications!==pubs.publications.length) errors.push('publication count drift');
if(manifest.counts.media_assets!==media.assets.length) errors.push('media count drift');
const ids=new Set();
for(const o of obs.observations){
  if(ids.has(o.id)) errors.push(`duplicate observation ${o.id}`); ids.add(o.id);
  for(const k of ['domain','target','source_id','truth_class','claim','geometry_write_authority','confidence','ingested_at']) if(!o[k]) errors.push(`${o.id}: missing ${k}`);
  if(!sourceIds.has(o.source_id)) errors.push(`${o.id}: unknown source ${o.source_id}`);
  if(o.geometry_write_authority==='DIRECT' && !['MEASURED','SURVEYED'].includes(o.truth_class)) errors.push(`${o.id}: non-measured observation cannot have direct geometry authority`);
}
for(const p of pubs.publications) if(!sourceIds.has(p.source_id)) errors.push(`${p.id}: unknown source ${p.source_id}`);
for(const m of media.assets){
  if(!sourceIds.has(m.source_id)) errors.push(`${m.id}: unknown source ${m.source_id}`);
  if(!m.page_url || !m.license || !m.storage || !m.asset_action) errors.push(`${m.id}: incomplete media rights record`);
}
for(const s of graph.cross_domain_summaries){
  if(!Array.isArray(s.evidence)||!s.evidence.length) errors.push(`${s.id}: empty evidence list`);
  for(const id of s.evidence) if(!ids.has(id)) errors.push(`${s.id}: missing observation ${id}`);
}
for(const q of queue.queue) if(!sourceIds.has(q.source_id)) errors.push(`${q.id}: unknown source ${q.source_id}`);
for(const r of receipts.receipts) if(r.canonical_mutation!==false) errors.push(`${r.artifact}: ingest receipt must not claim canonical mutation`);
const forbidden=obs.observations.filter(o=>o.source_id.includes('deep_claim') && !String(o.geometry_write_authority).startsWith('NONE'));
if(forbidden.length) errors.push('deep-claim source gained observatory geometry authority');
if(!obs.observations.some(o=>o.id==='obs.dash.khafre_corner_control_dataset')) errors.push('Dash survey-control observation missing');
if(!obs.observations.some(o=>o.id==='obs.khafre.laser_survey_2025_exists')) errors.push('Khafre laser-survey metadata observation missing');
console.log(`OBSERVATORY observations=${obs.observations.length} publications=${pubs.publications.length} media=${media.assets.length} cross_domain=${graph.cross_domain_summaries.length} acquisition=${queue.queue.length}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('PASS');
