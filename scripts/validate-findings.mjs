import fs from 'node:fs';
const r=JSON.parse(fs.readFileSync('public/model/research/findings_registry.json','utf8'));
const errors=[];
if(r.version!=='0.10.11'||r.last_reviewed_version!=='0.10.11')errors.push('findings version/review mismatch');
if(!Array.isArray(r.entries)||r.entries.length<6)errors.push('findings registry unexpectedly small');
const ids=new Set();
for(const f of r.entries){
  if(ids.has(f.id))errors.push(`duplicate finding ${f.id}`); ids.add(f.id);
  for(const key of ['title','status','truth_class','summary','why_interesting','next_test','guard']) if(!f[key])errors.push(`${f.id}: missing ${key}`);
  if(!Array.isArray(f.controls)||!f.controls.length)errors.push(`${f.id}: controls missing`);
  if(f.status==='CONFIRMED_OBSERVATION' && f.truth_class==='SIMULATED')errors.push(`${f.id}: simulated finding promoted to observation`);
}
console.log(`findings=${r.entries.length} pattern_watch=${r.entries.filter(x=>x.status==='PATTERN_WATCH').length} research_priority=${r.entries.filter(x=>x.status==='RESEARCH_PRIORITY').length}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('PASS');
