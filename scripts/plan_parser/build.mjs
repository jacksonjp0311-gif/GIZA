import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>{fs.mkdirSync(p.split('/').slice(0,-1).join('/'),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n')};
const V='0.10.7';
const obs=read('public/model/observatory/observations.json').observations;
const byObs=new Map(obs.map(o=>[o.id,o]));
const sourceIds=new Set(read('public/model/evidence/source_registry.json').sources.map(s=>s.id));
const src=read('public/model/plan_parser/plan_sources.json');
const ext=read('public/model/plan_parser/extractions.json');
for(const p of src.sources){if(!sourceIds.has(p.source_id)) throw new Error(`unknown plan source ${p.source_id}`);}
for(const e of ext.extractions){const o=byObs.get(e.observation_id);if(!o) throw new Error(`missing observation ${e.observation_id}`);if(o.source_id!==e.source_id)throw new Error(`source mismatch ${e.id}`);e.geometry_write_authority='NONE';e.raw_byte_verified=false;}
src.version=V;ext.version=V;ext.extraction_count=ext.extractions.length;ext.raw_byte_verified_count=ext.extractions.filter(e=>e.raw_byte_verified).length;
const conflicts=read('public/model/plan_parser/conflicts.json');conflicts.version=V;conflicts.conflict_count=conflicts.conflicts.length;
const manifest=read('public/model/plan_parser/manifest.json');manifest.version=V;manifest.codename='PRIMARY PLAN PARSER';manifest.counts={plan_sources:src.sources.length,extractions:ext.extractions.length,raw_byte_verified:ext.raw_byte_verified_count,preserved_conflicts:conflicts.conflicts.length};manifest.generated_at=new Date().toISOString();
write('public/model/plan_parser/plan_sources.json',src);write('public/model/plan_parser/extractions.json',ext);write('public/model/plan_parser/conflicts.json',conflicts);write('public/model/plan_parser/manifest.json',manifest);
console.log(`PRIMARY PLAN PARSER sources=${src.sources.length} extractions=${ext.extractions.length} raw_bytes=${ext.raw_byte_verified_count} conflicts=${conflicts.conflicts.length}`);
