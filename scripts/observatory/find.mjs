import fs from 'node:fs';
const q=process.argv.slice(2).join(' ').trim().toLowerCase();
if(!q){console.error('usage: npm run observatory:find -- <term>');process.exit(2)}
const files=['observations.json','publication_catalog.json','media_catalog.json','cross_domain_graph.json','acquisition_queue.json','source_discrepancies.json','claims_registry.json','plan_register.json','material_samples_khafre.json','material_physical_khafre.json','source_status.json'];
let hits=0;
for(const f of files){
 const obj=JSON.parse(fs.readFileSync(`public/model/observatory/${f}`,'utf8'));
 const text=JSON.stringify(obj,null,2);
 const lines=text.split(/\r?\n/);
 lines.forEach((line,i)=>{if(line.toLowerCase().includes(q)){console.log(`${f}:${i+1}: ${line.trim()}`);hits++}});
}
if(!hits) console.log('No OBSERVATORY matches.');
