import fs from 'node:fs';

const V='0.10.7';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
const hypotheses=read('public/model/intent/hypotheses.json');
const links=read('public/model/intent/evidence_links.json');

const byHyp=new Map();
for(const l of links.links){
  if(!byHyp.has(l.hypothesis_id)) byHyp.set(l.hypothesis_id,[]);
  byHyp.get(l.hypothesis_id).push(l);
}
const results=[];
for(const h of hypotheses.hypotheses){
  const groups=new Map();
  for(const l of byHyp.get(h.id)??[]){
    const k=`${l.independence_group}::${l.polarity}`;
    groups.set(k,Math.max(groups.get(k)??0,Number(l.weight)));
  }
  let support=0, limit=0, missing=0;
  for(const [k,w] of groups){
    if(k.endsWith('::SUPPORT')) support+=w;
    if(k.endsWith('::LIMIT')) limit+=w;
    if(k.endsWith('::MISSING_EXPECTED')) missing+=w;
  }
  const denom=support+limit+0.5*missing;
  const balance=denom? support/denom:0;
  const coverage=Math.min(1,(support+limit+missing)/Math.max(1,h.critical_expected_evidence.length));
  results.push({
    hypothesis_id:h.id,
    label:h.label,
    prior_status:h.prior_status,
    support_weight:+support.toFixed(3),
    limitation_weight:+limit.toFixed(3),
    missing_expected_weight:+missing.toFixed(3),
    evidence_balance_index:+balance.toFixed(3),
    coverage_index:+coverage.toFixed(3),
    interpretation_guard:'Indices are triage metrics, not probabilities or recovered ancient intent.'
  });
}
const out={schema_version:'1.0.0',version:V,generated_by:'scripts/intent/evaluate.mjs',policy:'Evidence balance and coverage are triage indices only. Historical intent status remains source- and review-governed.',results};
write('public/model/intent/synthesis.json',out);
console.log(`INTENT RECONSTRUCTION evaluated hypotheses=${results.length}`);
for(const r of results) console.log(`${r.hypothesis_id}\tbalance=${r.evidence_balance_index}\tcoverage=${r.coverage_index}\t${r.prior_status}`);
