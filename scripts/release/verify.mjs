import fs from 'node:fs';import crypto from 'node:crypto';
import {releaseTree as tree} from './inventory.mjs';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const errors=[];let refs=0,manifests=0;
for(const p of fs.readdirSync('.').filter(p=>p.endsWith('MANIFEST.json'))){const d=JSON.parse(fs.readFileSync(p));manifests++;for(const key of ['artifacts','files','modules','required_handoff_files'])for(const r of d[key]??[]){if(!r?.path||!r.sha256)continue;refs++;if(!fs.existsSync(r.path))errors.push(`${p}: missing ${r.path}`);else if(hash(r.path)!==r.sha256)errors.push(`${p}: mismatch ${r.path}`);}}
const manifest=JSON.parse(fs.readFileSync('GIZA_MANIFEST.json'));const indexed=new Set(manifest.files.map(r=>r.path));const actual=tree('.').filter(p=>p!=='GIZA_MANIFEST.json');for(const p of actual)if(!indexed.has(p))errors.push('Unsealed file: '+p);if(manifest.file_count!==actual.length)errors.push('File count mismatch');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`RELEASE INTEGRITY PASS: ${manifests} current manifests, ${refs} file-hash references, 0 mismatches.`);
