import fs from 'node:fs';
const obs=JSON.parse(fs.readFileSync('public/model/observatory/observations.json','utf8')).observations;
function csv(rows,columns){
 const esc=v=>{if(v===null||v===undefined)return '';const s=typeof v==='object'?JSON.stringify(v):String(v);return /[",\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s};
 return [columns.join(','),...rows.map(r=>columns.map(c=>esc(typeof c==='string'?r[c]:c.get(r))).join(','))].join('\n')+'\n';
}
const cols=['id','domain','target','source_id','source_locator','truth_class','claim','geometry_write_authority','confidence','ingested_at','guard',{get:r=>r.numeric??null}];
const headers=['id','domain','target','source_id','source_locator','truth_class','claim','geometry_write_authority','confidence','ingested_at','guard','numeric_json'];
const rows=obs.map(r=>({id:r.id,domain:r.domain,target:r.target,source_id:r.source_id,source_locator:r.source_locator,truth_class:r.truth_class,claim:r.claim,geometry_write_authority:r.geometry_write_authority,confidence:r.confidence,ingested_at:r.ingested_at,guard:r.guard,numeric_json:r.numeric??null}));
fs.writeFileSync('public/model/observatory/observations.csv',csv(rows,headers));
const matrixHeaders=['observation_id','domain','target','source_id','truth_class','geometry_write_authority','confidence','source_locator','claim','numeric_json'];
const matrix=obs.map(r=>({observation_id:r.id,domain:r.domain,target:r.target,source_id:r.source_id,truth_class:r.truth_class,geometry_write_authority:r.geometry_write_authority,confidence:r.confidence,source_locator:r.source_locator,claim:r.claim,numeric_json:r.numeric??null}));
fs.writeFileSync('public/model/observatory/evidence_matrix.csv',csv(matrix,matrixHeaders));
console.log(`exported observations=${obs.length}`);
