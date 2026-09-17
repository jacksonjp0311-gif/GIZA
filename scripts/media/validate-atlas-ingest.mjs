import fs from 'node:fs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const errors=[];
const version='0.10.1';
const media=read('public/model/observatory/media_catalog.json');
const collections=read('public/model/observatory/media_collections.json');
const photoObs=read('public/model/observatory/photo_observations.json');
const photos=read('public/model/photo_index.json');
const sources=read('public/model/evidence/source_registry.json');
const rights=read('public/model/evidence/rights_matrix.json');
const pubs=read('public/model/observatory/publication_catalog.json');
const obs=read('public/model/observatory/observations.json');
const parts=read('public/model/parts.json').parts;
const findings=read('public/model/research/findings_registry.json');
const sourceIds=new Set(sources.sources.map(x=>x.id));
const partIds=new Set(parts.map(x=>x.id));
const mediaIds=new Set();
if(media.version!==version||collections.version!==version||photoObs.version!==version)errors.push('ATLAS version drift');
if(media.assets.length<14)errors.push('expected at least 14 individually rights-reviewed media assets');
for(const a of media.assets){
  if(mediaIds.has(a.id))errors.push(`duplicate media id ${a.id}`); mediaIds.add(a.id);
  if(!sourceIds.has(a.source_id))errors.push(`${a.id}: unknown source ${a.source_id}`);
  for(const k of ['page_url','license','storage','asset_action','rights_verified_on']) if(!a[k])errors.push(`${a.id}: missing ${k}`);
  if(a.download_eligible===true && !a.download_url)errors.push(`${a.id}: download eligible but no download URL`);
}
if(collections.collections.length<9)errors.push('open-media collection registry unexpectedly small');
if(!collections.overlap_guard?.includes('not sum'))errors.push('category overlap guard missing');
for(const p of photos.photos){
  if(!p.page_url||!p.license||!Array.isArray(p.bind))errors.push(`${p.id}: incomplete UI photo record`);
  for(const id of p.bind) if(!partIds.has(id))errors.push(`${p.id}: unknown bound part ${id}`);
}
for(const o of photoObs.observations){
  if(o.media_id && !mediaIds.has(o.media_id))errors.push(`${o.id}: missing media ${o.media_id}`);
  if(o.source_id && !sourceIds.has(o.source_id))errors.push(`${o.id}: missing source ${o.source_id}`);
  if(!o.guard||!o.metrology_status||!o.truth_class)errors.push(`${o.id}: incomplete truth/metrology guard`);
}
if(!sourceIds.has('src.procedia2016.khafre_deformations'))errors.push('facade-condition publication source missing');
if(!rights.rows.some(x=>x.source_id==='src.procedia2016.khafre_deformations'))errors.push('facade-condition rights row missing');
if(!pubs.publications.some(x=>x.id==='pub.seglins_kukela2016'))errors.push('facade-condition publication record missing');
if(!obs.observations.some(x=>x.id==='obs.khafre.facade_photo_condition_2009_2012'))errors.push('facade-condition observation missing');
if(!findings.entries.some(x=>x.id==='finding.atlas.open-media-time-series'))errors.push('persistent open-media time-series finding missing');
if(!fs.existsSync('scripts/media/harvest-commons.mjs'))errors.push('desktop Commons harvester missing');
if(!fs.existsSync('public/media/atlas_ingest/README.md'))errors.push('media cache README missing');
console.log(`ATLAS media=${media.assets.length} collections=${collections.collections.length} photoObs=${photoObs.observations.length} uiPhotos=${photos.photos.length}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('PASS');
