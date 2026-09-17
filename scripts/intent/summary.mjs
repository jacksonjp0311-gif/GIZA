import fs from 'node:fs';
const d=JSON.parse(fs.readFileSync('public/model/intent/synthesis.json','utf8'));
const hyps=JSON.parse(fs.readFileSync('public/model/intent/hypotheses.json','utf8'));
const map=new Map(hyps.hypotheses.map(h=>[h.id,h]));
console.log('GIZA v0.10.7 // INTENT RECONSTRUCTION');
console.log('Scores are triage indices, not probabilities.\n');
for(const r of [...d.results].sort((a,b)=>b.evidence_balance_index-a.evidence_balance_index)){
  const h=map.get(r.hypothesis_id);
  console.log(`${h.label}\n  status=${h.prior_status} balance=${r.evidence_balance_index} coverage=${r.coverage_index}\n  question=${h.question}\n`);
}
