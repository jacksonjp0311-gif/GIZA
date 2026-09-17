import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const errors=[]; const version='0.10.7';
const root='public/model/corpus';
const manifest=read(`${root}/manifest.json`); const knowledge=read(`${root}/knowledge_nodes.json`); const timeline=read(`${root}/historical_timeline.json`); const inventory=read(`${root}/monument_inventory.json`); const claims=read(`${root}/claim_matrix.json`); const receipts=read(`${root}/verification_receipts.json`); const media=read(`${root}/open_media_candidates.json`);
const sources=read('public/model/evidence/source_registry.json'); const obs=read('public/model/observatory/observations.json'); const findings=read('public/model/research/findings_registry.json');
const sourceIds=new Set(sources.sources.map(s=>s.id)); const obsIds=new Set(obs.observations.map(o=>o.id));
for(const d of [manifest,knowledge,timeline,inventory,claims,receipts,media]) if(d.version!==version) errors.push('ARCHIVE HARVEST artifact version drift');
if(knowledge.nodes.length<20) errors.push('confirmed knowledge corpus unexpectedly small');
if(timeline.events.length<12) errors.push('historical timeline unexpectedly small');
if(inventory.monuments.length<8) errors.push('monument inventory unexpectedly small');
if(claims.claims.length<6) errors.push('claim matrix unexpectedly small');
if(receipts.receipts.length<10) errors.push('verification receipts unexpectedly small');
const ids=new Set();
for(const n of knowledge.nodes){
  if(ids.has(n.id)) errors.push(`duplicate knowledge node ${n.id}`); ids.add(n.id);
  for(const k of ['domain','subject','label','value','truth_class','verification_state','geometry_write_authority','caveat','confirmed_on']) if(n[k]===undefined||n[k]===null||n[k]==='') errors.push(`${n.id}: missing ${k}`);
  if(!Array.isArray(n.source_ids)||!n.source_ids.length) errors.push(`${n.id}: source_ids missing`);
  for(const s of n.source_ids??[]) if(!sourceIds.has(s)) errors.push(`${n.id}: unknown source ${s}`);
  for(const o of n.observation_ids??[]) if(!obsIds.has(o)) errors.push(`${n.id}: unknown observation ${o}`);
}
for(const r of receipts.receipts){ if(!sourceIds.has(r.source_id)) errors.push(`${r.receipt_id}: unknown source`); if(r.canonical_mutation!==false) errors.push(`${r.receipt_id}: verification receipt claims canonical mutation`); }
for(const c of claims.claims){
  if(!c.status||!c.geometry_write_authority||!c.guard) errors.push(`${c.id}: incomplete claim guard`);
  for(const key of ['supporting_source_ids','contradicting_source_ids','contradicting_or_limiting_source_ids']) for(const s of c[key]??[]) if(!sourceIds.has(s)) errors.push(`${c.id}: unknown source ${s}`);
  if(c.id==='claim.giza.ai_technology' && c.status!=='NO_DIRECT_EVIDENCE_FOUND') errors.push('AI-technology evidence baseline changed without explicit corpus evidence');
  if(['claim.khafre.deep_shafts','claim.sar_doppler_validated','claim.khafre.acoustic_design','claim.khafre.hydraulic_machine'].includes(c.id) && c.geometry_write_authority!=='NONE') errors.push(`${c.id}: extraordinary claim gained geometry authority`);
}
if(!findings.entries.some(f=>f.id==='finding.archive.confirmed-does-not-imply-exotic')) errors.push('corpus baseline finding missing');
if(manifest.counts.knowledge_nodes!==knowledge.nodes.length||manifest.counts.timeline_events!==timeline.events.length||manifest.counts.claim_records!==claims.claims.length) errors.push('corpus manifest count drift');
if(!fs.existsSync(`${root}/knowledge_matrix.csv`)) errors.push('knowledge matrix CSV missing');
if(!fs.existsSync('scripts/corpus/harvest-authoritative.mjs')) errors.push('authoritative harvester missing');
console.log(`ARCHIVE HARVEST knowledge=${knowledge.nodes.length} timeline=${timeline.events.length} monuments=${inventory.monuments.length} claims=${claims.claims.length} receipts=${receipts.receipts.length} openMedia=${media.verified_files.length}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)} console.log('PASS');
