import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));const errors=[];const need=(x,m)=>{if(!x)errors.push(m)};
const V='0.10.7';const facts=read('public/model/plan_concordance/facts.json');const matrix=read('public/model/plan_concordance/matrix.json');const manifest=read('public/model/plan_concordance/manifest.json');
const obs=new Set(read('public/model/observatory/observations.json').observations.map(o=>o.id));
need(facts.version===V&&matrix.version===V&&manifest.version===V,'concordance version drift');need(matrix.rows.length===facts.facts.length,'matrix/fact count drift');need(matrix.rows.length>=14,'concordance unexpectedly small');
for(const r of matrix.rows){need(r.support_count>0,`${r.id}: no support`);for(const id of r.support)need(obs.has(id),`${r.id}: missing observation ${id}`);need(r.geometry_write_authority==='NONE',`${r.id}: concordance may not write geometry`);if(r.independence_group_count>1)need(r.source_count>1||r.agreement==='DEPENDENCE_IDENTIFIED',`${r.id}: multiple independence groups but one source`)}
need(matrix.rows.some(r=>r.agreement.includes('DISPUTED')),'must preserve disputed reconstruction');need(matrix.rows.some(r=>r.agreement==='DEPENDENCE_IDENTIFIED'),'must preserve derivative-source dependence');
if(errors.length){console.error('PLAN CONCORDANCE validation FAILED');errors.forEach(e=>console.error('- '+e));process.exit(1)}console.log(`PLAN CONCORDANCE validation PASS facts=${matrix.rows.length} geometry_write=NONE`);
