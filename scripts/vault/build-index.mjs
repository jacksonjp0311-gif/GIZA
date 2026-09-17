import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root='public/vault';
const sha256=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=JSON.parse(fs.readFileSync(`${root}/manifest.json`,'utf8'));
const snaps=fs.readdirSync(`${root}/snapshots`).filter(x=>x.endsWith('.json')).sort().map(name=>{const p=`${root}/snapshots/${name}`;return {path:p,sha256:sha256(p),bytes:fs.statSync(p).size}});
const receipts=JSON.parse(fs.readFileSync(`${root}/receipts/verification_receipts.json`,'utf8'));
for(const r of receipts.receipts){ if(!fs.existsSync(r.artifact_path)) throw new Error(`missing receipt artifact ${r.artifact_path}`); r.snapshot_sha256=sha256(r.artifact_path); }
fs.writeFileSync(`${root}/receipts/verification_receipts.json`,JSON.stringify(receipts,null,2)+'\n');
manifest.snapshots=snaps;
manifest.counts.normalized_snapshots=snaps.length;
manifest.counts.verification_receipts=receipts.receipts.length;
manifest.generated_at=new Date().toISOString();
fs.writeFileSync(`${root}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
console.log(`PRIMARY SOURCE VAULT index snapshots=${snaps.length} receipts=${receipts.receipts.length}`);
