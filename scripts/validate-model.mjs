import fs from 'node:fs';
import path from 'node:path';
const base=path.resolve('public/model');
const read=f=>JSON.parse(fs.readFileSync(path.join(base,f),'utf8'));
const parts=read('parts.json').parts??[];
const assemblies=read('assemblies.json').assemblies??[];
const measurements=read('research/measurements.json').measurements??[];
const photos=read('photo_index.json').photos??[];
const stone=read('stone_field.json');
const errors=[];
const ids=new Set(parts.map(p=>p.id));
const aIds=new Set(assemblies.map(a=>a.id));
for(const p of parts){if(!p.id||!p.spatial?.primitive||!p.provenance?.class)errors.push(`Malformed part ${p.id??'?'}`);if(p.parent&&!aIds.has(p.parent))errors.push(`${p.id}: missing parent ${p.parent}`);const cad=p.spatial?.cad;if(cad?.path&&!fs.existsSync(path.join(base,cad.path)))errors.push(`${p.id}: missing ${cad.path}`)}
for(const a of assemblies)for(const child of a.children??[])if(!ids.has(child)&&!aIds.has(child))errors.push(`${a.id}: missing child ${child}`);
for(const ph of photos)for(const id of ph.bind??[])if(!ids.has(id))errors.push(`${ph.id}: missing binding ${id}`);
if(stone.provenance!=='ASSUMED')errors.push('stone field must remain ASSUMED');
if(stone.visual_course_count<1||stone.base_m<=0||stone.height_m<=0)errors.push('invalid stone field geometry');
const approximateCells=(()=>{let total=0;const h=stone.height_m,ch=h/stone.visual_course_count;for(let c=0;c<stone.visual_course_count;c++){const z=(c+.5)*ch;const span=Math.max(stone.target_block_width_m,stone.base_m*(1-z/h));const n=Math.max(1,Math.ceil(span/stone.target_block_width_m));total+=4*n}return total})();
console.log('GIZA v0.10.7 model validation');
console.log(`parts=${parts.length} assemblies=${assemblies.length} measurements=${measurements.length} media=${photos.length} stoneCells=${approximateCells}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('PASS');
