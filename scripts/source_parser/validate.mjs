import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const errors=[];const need=(x,m)=>{if(!x)errors.push(m)};
const manifest=read('public/model/source_parser/manifest.json');
const records=read('public/model/source_parser/parsed_records.json').records;
const receipts=read('public/model/source_parser/parser_receipts.json').receipts;
const sources=new Set(read('public/model/evidence/source_registry.json').sources.map(s=>s.id));
need(manifest.version==='0.10.7','source parser version drift');
need(records.length>=10,`expected >=10 parsed records, got ${records.length}`);
need(receipts.length===records.length,'receipt count mismatch');
for(const r of records){
  need(Boolean(r.record_id), 'parsed record missing id'); need(sources.has(r.source_id),`${r.record_id}: unknown source`);
  need(Boolean(r.source_locator?.trim()),`${r.record_id}: empty source locator`);
  need(['RAW_PRIMARY_BYTES','NORMALIZED_SOURCE_SNAPSHOT','NORMALIZED_OBSERVATION'].includes(r.input_mode),`${r.record_id}: bad input mode`);
  need(r.input_mode==='NORMALIZED_OBSERVATION' && r.raw_byte_verified===false,`${r.record_id}: normalized builder may not claim raw extraction`);
  if(r.raw_byte_verified){need(Boolean(r.source_sha256)&&r.source_sha256.length===64,`${r.record_id}: raw verified without sha256`);need(Boolean(r.vault_asset_id),`${r.record_id}: raw verified without vault asset`)}
  need(!String(r.geometry_write_authority).includes('FULL'),`${r.record_id}: parser may not grant FULL geometry authority`);
}
need(records.filter(r=>r.raw_byte_verified).length===0,'sandbox release must not claim newly cached primary bytes');
if(errors.length){console.error('SOURCE PARSER validation FAILED');errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log(`SOURCE PARSER validation PASS records=${records.length} raw_byte_verified=0 locators=BOUND`);
