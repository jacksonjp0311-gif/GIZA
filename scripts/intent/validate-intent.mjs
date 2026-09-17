import fs from 'node:fs';
const V='0.10.7';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const errors=[];
const root='public/model/intent';
const manifest=read(`${root}/manifest.json`);
const hyps=read(`${root}/hypotheses.json`);
const links=read(`${root}/evidence_links.json`);
const tests=read(`${root}/test_matrix.json`);
const synthesis=read(`${root}/synthesis.json`);
const knowledge=read('public/model/corpus/knowledge_nodes.json');
const claims=read('public/model/corpus/claim_matrix.json');
const findings=read('public/model/research/findings_registry.json');
const monuments=read('public/model/corpus/monument_inventory.json');
const kid=new Set(knowledge.nodes.map(x=>x.id));
const cid=new Set(claims.claims.map(x=>x.id));
const fid=new Set(findings.entries.map(x=>x.id));
const mid=new Set(monuments.monuments.map(x=>x.id));
const hypid=new Set(hyps.hypotheses.map(x=>x.id));
for(const d of [manifest,hyps,links,tests,synthesis]) if(d.version!==V) errors.push('INTENT artifact version drift');
if(hyps.hypotheses.length<8) errors.push('intent hypothesis set unexpectedly small');
if(tests.tests.length<5) errors.push('intent test matrix unexpectedly small');
for(const h of hyps.hypotheses){
  for(const k of ['id','label','question','prior_status','critical_expected_evidence','falsifier']) if(!h[k]||!String(h[k]).length) errors.push(`${h.id??'?'} missing ${k}`);
}
for(const l of links.links){
  if(!hypid.has(l.hypothesis_id)) errors.push(`link unknown hypothesis ${l.hypothesis_id}`);
  if(!['SUPPORT','LIMIT','MISSING_EXPECTED'].includes(l.polarity)) errors.push(`bad polarity ${l.polarity}`);
  if(!(Number(l.weight)>0&&Number(l.weight)<=1)) errors.push(`bad link weight ${l.hypothesis_id}`);
  if(!l.independence_group) errors.push(`missing independence group ${l.hypothesis_id}`);
  const e=l.evidence_id;
  if(!(kid.has(e)||cid.has(e)||fid.has(e)||mid.has(e)||e.startsWith('missing.'))) errors.push(`unknown evidence id ${e}`);
}
for(const t of tests.tests){
  for(const h of t.targets??[]) if(!hypid.has(h)) errors.push(`${t.id}: unknown target ${h}`);
  if(!t.method||!(t.required_data??[]).length||!t.status) errors.push(`${t.id}: incomplete test`);
}
if(synthesis.results.length!==hyps.hypotheses.length) errors.push('intent synthesis result count drift');
const future=hyps.hypotheses.find(h=>h.id==='intent.future_audience_message');
const machine=hyps.hypotheses.find(h=>h.id==='intent.machine_or_power_system');
const ai=hyps.hypotheses.find(h=>h.id==='intent.advanced_computation');
if(future?.prior_status!=='NOT_ESTABLISHED') errors.push('future-message baseline changed without evidence review');
if(machine?.prior_status!=='NOT_SUPPORTED') errors.push('machine baseline changed without evidence review');
if(ai?.prior_status!=='NO_DIRECT_EVIDENCE') errors.push('advanced-computation baseline changed without evidence review');
for(const r of synthesis.results){
  if(r.evidence_balance_index<0||r.evidence_balance_index>1) errors.push(`${r.hypothesis_id}: bad balance index`);
  if(r.coverage_index<0||r.coverage_index>1) errors.push(`${r.hypothesis_id}: bad coverage index`);
}
if(!findings.entries.some(f=>f.id==='finding.intent.mortuary-cult-convergence')) errors.push('intent baseline finding missing');
if(!findings.entries.some(f=>f.id==='finding.intent.future-message-unresolved')) errors.push('future-message finding missing');
if(manifest.counts.hypotheses!==hyps.hypotheses.length||manifest.counts.evidence_links!==links.links.length||manifest.counts.tests!==tests.tests.length) errors.push('intent manifest count drift');
console.log(`INTENT RECONSTRUCTION hypotheses=${hyps.hypotheses.length} links=${links.links.length} tests=${tests.tests.length}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('PASS');
