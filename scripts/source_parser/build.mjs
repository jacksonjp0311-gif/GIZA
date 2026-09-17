import fs from 'node:fs';
import crypto from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>{fs.mkdirSync(p.split('/').slice(0,-1).join('/'),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n')};
const targets=read('public/model/source_parser/targets.json');
const observations=read('public/model/observatory/observations.json').observations;
const vault=read('public/vault/assets.json').assets;
const byObs=new Map(observations.map(o=>[o.id,o]));
const records=[]; const receipts=[];
for(const t of targets.targets){
  const o=byObs.get(t.observation_id); if(!o) throw new Error(`missing observation ${t.observation_id}`);
  const va=vault.find(a=>a.source_id===o.source_id) ?? null;
  const cached=Boolean(va && va.acquisition_state==='LOCAL_CACHED' && va.local_path && fs.existsSync(va.local_path));
  const sourceSha=cached?crypto.createHash('sha256').update(fs.readFileSync(va.local_path)).digest('hex'):null;
  const record={
    record_id:t.id, output_kind:t.output_kind, observation_id:o.id, source_id:o.source_id,
    source_locator:o.source_locator, truth_class:o.truth_class, claim:o.claim, numeric:o.numeric??null,
    input_mode:'NORMALIZED_OBSERVATION', raw_byte_verified:false,
    vault_asset_id:va?.id??null, source_sha256:null,
    custody_reference:{bytes_present:cached,observed_sha256:sourceSha,expected_hash_verified:Boolean(cached && va?.sha256 && va.sha256===sourceSha)},
    extraction_performed:false,
    geometry_write_authority:o.geometry_write_authority??'NONE', confidence:o.confidence??'UNSPECIFIED',
    parser:'GIZA_NORMALIZED_EVIDENCE_PARSER', parser_version:'0.10.12', generated_at:new Date().toISOString()
  };
  records.push(record);
  receipts.push({
    receipt_id:`receipt.${t.id}`, record_id:t.id, source_id:o.source_id, source_locator:o.source_locator,
    input_mode:record.input_mode, raw_byte_verified:false, source_sha256:null, extraction_performed:false,
    guard:'Normalized observation copied with provenance. Cached bytes do not imply that this statement was extracted from them.',
    geometry_authority_inherited:o.geometry_write_authority??'NONE'
  });
}
write('public/model/source_parser/parsed_records.json',{schema_version:'1.0.0',version:'0.10.7',record_count:records.length,records});
write('public/model/source_parser/parser_receipts.json',{schema_version:'1.0.0',version:'0.10.7',receipt_count:receipts.length,raw_byte_verified_count:receipts.filter(r=>r.raw_byte_verified).length,receipts});
const m=read('public/model/source_parser/manifest.json');m.counts={targets:targets.targets.length,parsed_records:records.length,receipts:receipts.length,raw_byte_verified:receipts.filter(r=>r.raw_byte_verified).length};m.generated_at=new Date().toISOString();m.generator_version='0.10.12';write('public/model/source_parser/manifest.json',m);
console.log(`SOURCE PARSER records=${records.length} raw_byte_verified=${receipts.filter(r=>r.raw_byte_verified).length}`);
