import fs from 'node:fs';
const d=JSON.parse(fs.readFileSync('public/model/corpus/knowledge_nodes.json','utf8'));
const esc=v=>`"${String(v??'').replaceAll('"','""')}"`;
const cols=['id','domain','subject','label','value','truth_class','verification_state','geometry_write_authority','source_ids','caveat'];
const rows=[cols.join(',')];
for(const n of d.nodes) rows.push([n.id,n.domain,n.subject,n.label,n.value,n.truth_class,n.verification_state,n.geometry_write_authority,(n.source_ids??[]).join(';'),n.caveat].map(esc).join(','));
fs.writeFileSync('public/model/corpus/knowledge_matrix.csv',rows.join('\n')+'\n');
console.log(`exported ${d.nodes.length} knowledge nodes`);
