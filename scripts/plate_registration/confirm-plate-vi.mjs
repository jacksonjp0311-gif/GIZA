import fs from 'node:fs';
import crypto from 'node:crypto';
if(!process.argv.includes('--confirm')) throw new Error('EXPLICIT_OPERATOR_CONFIRMATION_REQUIRED: inspect the local render, then rerun with --confirm');
if(fs.existsSync('public/model/plate_registration/frozen_experiment.json')||fs.existsSync('public/model/plate_registration/first_plate_result.json'))throw new Error('EXPERIMENT_ALREADY_FROZEN');

const hpath='public/model/plate_registration/custody_handoff.json'; const h=JSON.parse(fs.readFileSync(hpath,'utf8'));
const p=h.local_custody?.plate_vi_render_path; if(!p||!fs.existsSync(p)) throw new Error('LOCAL_PLATE_RENDER_MISSING');
const hash=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'); if(hash!==h.local_custody.plate_vi_render_sha256) throw new Error('PLATE_RENDER_SHA256_MISMATCH');
h.status='PLATE_VI_VISUALLY_CONFIRMED_AWAITING_LANDMARK_COORDINATES'; h.local_custody.visual_confirmation=true; h.local_custody.visual_confirmation_scope='Operator asserts the checksum-bound local render is Petrie Plate VI and visibly carries the expected title/1:200 scale. This is a human review receipt, not an archaeological accuracy claim.'; h.local_custody.confirmed_at=new Date().toISOString();
fs.writeFileSync(hpath,JSON.stringify(h,null,2)+'\n');
console.log('PLATE VI VISUAL CONFIRMATION RECORDED');
