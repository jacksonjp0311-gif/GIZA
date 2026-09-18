/** Seal from leaves to root. Old seals are archived, not silently represented as current. */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {releaseTree as tree,excludedDirectories} from './inventory.mjs';
const pkg=JSON.parse(fs.readFileSync('package.json','utf8')),g=JSON.parse(fs.readFileSync('GIZA.json','utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const row=p=>({path:p,sha256:hash(p),bytes:fs.statSync(p).size});
const save=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
const now=new Date().toISOString();
if(fs.existsSync('GIZA_MANIFEST.json')){
 const archive=`verification/release-seals/${hash('GIZA_MANIFEST.json')}`;fs.mkdirSync(archive,{recursive:true});
 for(const file of fs.readdirSync('.').filter(p=>p.endsWith('MANIFEST.json'))){const dest=`${archive}/${file}`;if(!fs.existsSync(dest))fs.copyFileSync(file,dest,fs.constants.COPYFILE_EXCL);else if(hash(dest)!==hash(file))throw new Error(`Historical seal archive differs: ${file}`);}
}
const keys=['artifacts','files','modules','required_handoff_files'];
if(fs.existsSync('EVIDENCE_ASSEMBLY_MANIFEST.json')){
 const p='EVIDENCE_ASSEMBLY_MANIFEST.json',d=JSON.parse(fs.readFileSync(p,'utf8'));
 const paths=new Set([...(d.artifacts??[]).map(r=>r.path),...tree('src/evidence'),...tree('scripts/evidence'),...tree('tests/browser'),'tests/evidence-boundaries.test.mjs','tests/evidence-workflow.test.mjs','tests/evidence-campaign.test.mjs','docs/EVIDENCE_BOUNDARY_EVOLUTION.md','docs/SOURCE_CAMPAIGN.md','docs/RELIABILITY_0_11_1.md','public/model/evidence_assembly/campaign-khafre-plan-blocked-20260917.json']);
 d.version=pkg.version;d.schemas={assembly:'giza.evidence-assembly.v1',quantity:'giza.quantity.v1',receipt:'giza.evidence-receipt.v2',investigation:'giza.saved-investigation.v2',campaign:'giza.scoped-campaign.v1',comparisonRule:'giza.comparison-rules.v3',measurementRule:'canonical-measurement.v3'};d.artifacts=[...paths].sort().map(row);save(p,d);
}
const top=fs.readdirSync('.').filter(p=>/MANIFEST\.json$/.test(p)&&!['GIZA_MANIFEST.json','CONTINUITY_MANIFEST.json','TRANSITION_MANIFEST.json'].includes(p));
for(const p of top){const d=JSON.parse(fs.readFileSync(p));for(const k of keys){if(!Array.isArray(d[k]))continue;d[k]=d[k].map(x=>x?.path&&fs.existsSync(x.path)?{...x,...row(x.path)}:x);}
 d.release_version=pkg.version;d.sealed_at=now;save(p,d);}
save('TRANSITION_MANIFEST.json',{version:pkg.version,codename:'TRANSITION STATE — NOT GEOMETRY PROMOTION',files:['public/model/plate_registration/transition_gate.json','docs/TRANSITION_GATE.md'].map(row)});
const workbench=tree('public/workbench').concat(tree('scripts/workbench'),['scripts/plate_registration/engine.mjs','scripts/plate_registration/math.mjs','scripts/plate_registration/freeze-landmarks.mjs','scripts/plate_registration/register-similarity.mjs','scripts/source_parser/build.mjs','tests/registration-repairs.test.mjs','docs/REGISTRATION_WORKBENCH.md']);
save('WORKBENCH_MANIFEST.json',{version:pkg.version,codename:g.codename,sealed_at:now,runtime:'Native browser modules; Node shared engine; scoped campaigns lazily compile shared contracts with existing esbuild',new_runtime_npm_dependencies:0,archaeological_fit_created:false,artifacts:workbench.concat(tree('scripts/evidence'),['docs/EVIDENCE_BOUNDARY_EVOLUTION.md','docs/SOURCE_CAMPAIGN.md']).map(row)});
const c=JSON.parse(fs.readFileSync('CONTINUITY.json','utf8'));
save('CONTINUITY_MANIFEST.json',{version:pkg.version,codename:g.codename,sealed_at:now,required_handoff_files:c.release_contract.required_update_files.map(row)});
const files=tree('.').filter(p=>p!=='GIZA_MANIFEST.json');
save('GIZA_MANIFEST.json',{schema_version:'2.0.0',name:'GIZA NEXUS',version:pkg.version,codename:g.codename,sealed_at:now,file_count:files.length,exclude:['GIZA_MANIFEST.json',...excludedDirectories.map(p=>p+'/')],files:files.map(row)});
console.log(`SEALED ${pkg.version}: ${files.length} files; phase → continuity → root order.`);
