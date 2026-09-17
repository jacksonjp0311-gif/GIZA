import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

if(fs.existsSync('public/model/plate_registration/frozen_experiment.json')||fs.existsSync('public/model/plate_registration/first_plate_result.json'))throw new Error('EXPERIMENT_ALREADY_FROZEN');

const arg = (name) => { const i=process.argv.indexOf(name); return i>=0 ? process.argv[i+1] : null; };
const src = arg('--file');
const origin = arg('--origin') || 'OPERATOR_PROVIDED_LOCAL_FILE';
if (!src) throw new Error('USAGE: node scripts/source_bytes/import-petrie.mjs --file <path> [--origin <source>]');
if (!fs.existsSync(src)) throw new Error(`FILE_NOT_FOUND: ${src}`);
const head=fs.readFileSync(src,{encoding:null,flag:'r'}).subarray(0,5).toString('ascii');
if (head!=='%PDF-') throw new Error('NOT_A_PDF');
const stat=fs.statSync(src);
if (stat.size < 1_000_000) throw new Error(`PDF_TOO_SMALL_FOR_EXPECTED_SCAN: ${stat.size}`);

const info=spawnSync('pdfinfo',[src],{encoding:'utf8'});
if (info.status!==0) throw new Error('PDFINFO_REQUIRED_FOR_CUSTODY_IMPORT');
const m=info.stdout.match(/^Pages:\s+(\d+)$/m);
if(!m) throw new Error('PDF_PAGE_COUNT_UNREADABLE');
const pages=Number(m[1]);
if(pages!==315) throw new Error(`UNEXPECTED_PAGE_COUNT: ${pages} (expected 315)`);

const bytes=fs.readFileSync(src);
const sha256=crypto.createHash('sha256').update(bytes).digest('hex');
const out='public/vault/raw/petrie1883_cu31924012038927.pdf';
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.copyFileSync(src,out);

const cpath='public/model/source_byte_registration/candidates.json';
const cdoc=JSON.parse(fs.readFileSync(cpath,'utf8'));
const c=cdoc.candidates.find(x=>x.id==='bytes.petrie1883.public_domain_pdf');
if(!c) throw new Error('PETRIE_CANDIDATE_MISSING');
c.local_path=out; c.sha256=sha256; c.raw_byte_verified=true; c.acquisition_state='LOCAL_CACHED_SHA256_VERIFIED';
fs.writeFileSync(cpath,JSON.stringify(cdoc,null,2)+'\n');

const hpath='public/model/plate_registration/custody_handoff.json';
const h=JSON.parse(fs.readFileSync(hpath,'utf8'));
h.local_custody={path:null,bytes:null,sha256:null,pdf_page_count:null,plate_vi_render_path:null,plate_vi_render_sha256:null,render_source_sha256:null,visual_confirmation:false}; h.status='LOCAL_BYTES_HASHED_AWAITING_PLATE_RENDER';
h.local_custody.path=out; h.local_custody.bytes=stat.size; h.local_custody.sha256=sha256; h.local_custody.pdf_page_count=pages;
h.local_custody.import_origin_assertion=origin; h.local_custody.imported_at=new Date().toISOString();
fs.writeFileSync(hpath,JSON.stringify(h,null,2)+'\n');

const apath='public/model/source_byte_registration/acquisition_attempts.json';
const adoc=JSON.parse(fs.readFileSync(apath,'utf8'));
adoc.attempts.push({id:`attempt.petrie.local_import.${Date.now()}`,candidate_id:c.id,url:null,result:'SUCCESS_LOCAL_IMPORT',failure_class:null,local_file_created:true,sha256,authority_effect:'BYTE_CUSTODY_ONLY_NO_GEOMETRY',note:`Imported operator-provided PDF; origin assertion=${origin}; pdfinfo pages=${pages}; bytes=${stat.size}.`});
adoc.attempt_count=adoc.attempts.length;
fs.writeFileSync(apath,JSON.stringify(adoc,null,2)+'\n');
console.log(`PETRIE IMPORT PASS pages=${pages} bytes=${stat.size} sha256=${sha256}`);
