/** Seal from leaves to root. Old seals are archived, not silently represented as current. */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const pkg=JSON.parse(fs.readFileSync('package.json','utf8')),g=JSON.parse(fs.readFileSync('GIZA.json','utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const row=p=>({path:p,sha256:hash(p),bytes:fs.statSync(p).size});
const save=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
const now=new Date().toISOString();
function tree(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{if(['node_modules','.git','.cache','dist'].includes(e.name)||e.name.endsWith('.tmp'))return [];const p=path.posix.join(dir,e.name);return e.isDirectory()?tree(p):[p.replace(/^\.\//,'')];});}
const keys=['artifacts','files','modules','required_handoff_files'];
const top=fs.readdirSync('.').filter(p=>/MANIFEST\.json$/.test(p)&&!['GIZA_MANIFEST.json','CONTINUITY_MANIFEST.json','TRANSITION_MANIFEST.json'].includes(p));
for(const p of top){const d=JSON.parse(fs.readFileSync(p));for(const k of keys){if(!Array.isArray(d[k]))continue;d[k]=d[k].map(x=>x?.path&&fs.existsSync(x.path)?{...x,...row(x.path)}:x);}
 d.release_version=pkg.version;d.sealed_at=now;save(p,d);}
save('TRANSITION_MANIFEST.json',{version:pkg.version,codename:'TRANSITION STATE — NOT GEOMETRY PROMOTION',files:['public/model/plate_registration/transition_gate.json','docs/TRANSITION_GATE.md'].map(row)});
const workbench=tree('public/workbench').concat(tree('scripts/workbench'),['scripts/plate_registration/engine.mjs','scripts/plate_registration/math.mjs','scripts/plate_registration/freeze-landmarks.mjs','scripts/plate_registration/register-similarity.mjs','scripts/source_parser/build.mjs','tests/registration-repairs.test.mjs','docs/REGISTRATION_WORKBENCH.md']);
save('WORKBENCH_MANIFEST.json',{version:pkg.version,codename:g.codename,sealed_at:now,runtime:'Node.js built-ins + native browser modules',new_runtime_npm_dependencies:0,archaeological_fit_created:false,artifacts:workbench.map(row)});
const c=JSON.parse(fs.readFileSync('CONTINUITY.json','utf8'));
save('CONTINUITY_MANIFEST.json',{version:pkg.version,codename:g.codename,sealed_at:now,required_handoff_files:c.release_contract.required_update_files.map(row)});
const files=tree('.').filter(p=>p!=='GIZA_MANIFEST.json');
save('GIZA_MANIFEST.json',{schema_version:'2.0.0',name:'GIZA NEXUS',version:pkg.version,codename:g.codename,sealed_at:now,file_count:files.length,exclude:['GIZA_MANIFEST.json','node_modules/','.git/','dist/'],files:files.map(row)});
console.log(`SEALED ${pkg.version}: ${files.length} files; phase → continuity → root order.`);
