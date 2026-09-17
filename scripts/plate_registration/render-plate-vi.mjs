import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
if(fs.existsSync('public/model/plate_registration/frozen_experiment.json')||fs.existsSync('public/model/plate_registration/first_plate_result.json'))throw new Error('EXPERIMENT_ALREADY_FROZEN');

const cdoc=JSON.parse(fs.readFileSync('public/model/source_byte_registration/candidates.json','utf8'));
const c=cdoc.candidates.find(x=>x.id==='bytes.petrie1883.public_domain_pdf');
if(!c?.raw_byte_verified||!c.local_path||!fs.existsSync(c.local_path)) throw new Error('SOURCE_BYTES_NOT_CHECKSUM_BOUND');
const sourceHash=crypto.createHash('sha256').update(fs.readFileSync(c.local_path)).digest('hex');
if(sourceHash!==c.sha256) throw new Error('SOURCE_SHA256_MISMATCH');
const dir='public/vault/derived'; fs.mkdirSync(dir,{recursive:true});
const prefix=path.join(dir,'petrie1883_plate_vi_p305');
for(const ext of ['.png','-305.png']){const p=prefix+ext;if(fs.existsSync(p))fs.rmSync(p)}
const r=spawnSync('pdftoppm',['-f','305','-l','305','-singlefile','-r','300','-png',c.local_path,prefix],{encoding:'utf8'});
if(r.status!==0) throw new Error(`PDFTOPPM_FAILED: ${r.stderr||r.stdout}`);
const out=prefix+'.png'; if(!fs.existsSync(out)) throw new Error('PLATE_RENDER_NOT_CREATED');
const b=fs.readFileSync(out), renderSha=crypto.createHash('sha256').update(b).digest('hex');
const hpath='public/model/plate_registration/custody_handoff.json'; const h=JSON.parse(fs.readFileSync(hpath,'utf8'));
h.local_custody.render_source_sha256=sourceHash; h.status='LOCAL_PLATE_RENDER_CREATED_AWAITING_VISUAL_CONFIRMATION'; h.local_custody.plate_vi_render_path=out; h.local_custody.plate_vi_render_sha256=renderSha; h.local_custody.visual_confirmation=false; h.local_custody.rendered_at=new Date().toISOString();
fs.writeFileSync(hpath,JSON.stringify(h,null,2)+'\n');
console.log(`PLATE VI RENDER PASS ${out} sha256=${renderSha}`);
