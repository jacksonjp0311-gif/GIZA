import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const pkg=read('package.json'),g=read('GIZA.json'),c=read('CONTINUITY.json');
if(pkg.version!=='0.11.1'||pkg.gizaVersion!==pkg.version||g.version!==pkg.version||c.current_version!==pkg.version)throw new Error('PRODUCT_VERSION_DRIFT');
if(g.codename!=='REGISTRATION WORKBENCH'||c.codename!==g.codename)throw new Error('PRODUCT_IDENTITY_DRIFT');
for(const p of c.release_contract.required_update_files)if(!fs.existsSync(p))throw new Error(`CONTINUITY_FILE_MISSING ${p}`);
for(const path of ['scripts/plate_registration/engine.mjs','public/workbench/index.html','tests/registration-repairs.test.mjs'])if(!fs.existsSync(path))throw new Error(`IMPLEMENTATION_MISSING ${path}`);
console.log(`CONTINUITY PASS version=${pkg.version}; evidence artifact versions preserved; workbench present.`);
