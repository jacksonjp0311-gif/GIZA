import fs from 'node:fs';
const items = JSON.parse(fs.readFileSync('public/model/evidence/evidence_items.json','utf8')).items ?? [];
const target = process.argv[2] ?? 'part.sarcophagus.body';
const order = ['E0','E1','E2','E3','E4','E5'];
const matched = items.filter(x => x.targets?.includes(target) && x.status !== 'REJECTED');
const maturity = matched.reduce((best,x) => order.indexOf(x.maturity)>order.indexOf(best)?x.maturity:best,'E0');
console.log(JSON.stringify({target,maturity,evidence_ids:matched.map(x=>x.id),source_ids:[...new Set(matched.flatMap(x=>x.source_ids ?? []))]},null,2));
