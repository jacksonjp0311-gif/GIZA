import fs from 'node:fs';
import crypto from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const V='0.10.1'; const errors=[];
const manifest=read('public/vault/manifest.json'); const assets=read('public/vault/assets.json'); const rights=read('public/vault/rights_policy.json'); const locks=read('public/vault/remote_locks.json'); const cache=read('public/vault/cache_status.json'); const receipts=read('public/vault/receipts/verification_receipts.json'); const sources=read('public/model/evidence/source_registry.json');
const sourceIds=new Set(sources.sources.map(s=>s.id));
const states=new Set(assets.states); const ids=new Set();
for(const d of [manifest,assets,rights,locks,cache,receipts]) if(d.version!==V) errors.push(`vault artifact version drift ${d.version}`);
for(const a of assets.assets){
 if(ids.has(a.id)) errors.push(`duplicate asset ${a.id}`); ids.add(a.id);
 for(const k of ['source_id','title','kind','landing_url','native_identifier','license','redistribution','acquisition_state','coordinate_frame','parser','geometry_write_authority','notes']) if(a[k]===undefined||a[k]===null||a[k]==='') errors.push(`${a.id}: missing ${k}`);
 if(!sourceIds.has(a.source_id)) errors.push(`${a.id}: unknown source ${a.source_id}`);
 if(!states.has(a.acquisition_state)) errors.push(`${a.id}: invalid state ${a.acquisition_state}`);
 if(a.acquisition_state==='ACCESS_RESTRICTED' && a.download_url) errors.push(`${a.id}: restricted asset has download URL`);
 if(a.acquisition_state==='DOWNLOAD_URL_UNRESOLVED' && a.download_url) errors.push(`${a.id}: unresolved URL state has URL`);
 if(a.acquisition_state==='REMOTE_HASH_LOCKED' && !a.expected_checksum) errors.push(`${a.id}: hash locked without checksum`);
 if(a.acquisition_state==='LOCAL_CACHED') {
   const row=cache.assets?.[a.id]; if(!row||!fs.existsSync(row.path)) errors.push(`${a.id}: LOCAL_CACHED missing local file`);
   else { const got=crypto.createHash('sha256').update(fs.readFileSync(row.path)).digest('hex'); if(got!==row.sha256) errors.push(`${a.id}: local SHA mismatch`); if(!String(a.redistribution).startsWith('ALLOWED')) errors.push(`${a.id}: release cache without redistribution authority`); }
 }
 if(a.geometry_write_authority==='DIRECT') errors.push(`${a.id}: vault caching cannot grant DIRECT geometry authority`);
}
for(const l of locks.locks){ if(!ids.has(l.asset_id)) errors.push(`remote lock unknown asset ${l.asset_id}`); if(!l.expected_checksum?.algorithm||!l.expected_checksum?.value) errors.push(`remote lock incomplete ${l.asset_id}`); }
for(const r of receipts.receipts){
 if(!sourceIds.has(r.source_id)) errors.push(`${r.receipt_id}: unknown source`);
 if(r.snapshot_class!=='DERIVED_NORMALIZED_SNAPSHOT') errors.push(`${r.receipt_id}: snapshot class invalid`);
 if(r.canonical_mutation!==false) errors.push(`${r.receipt_id}: canonical mutation claimed`);
 if(!fs.existsSync(r.artifact_path)) errors.push(`${r.receipt_id}: artifact missing`);
 else { const obj=read(r.artifact_path); if(obj.snapshot_class!=='DERIVED_NORMALIZED_SNAPSHOT') errors.push(`${r.receipt_id}: artifact mislabeled`); const got=crypto.createHash('sha256').update(fs.readFileSync(r.artifact_path)).digest('hex'); if(got!==r.snapshot_sha256) errors.push(`${r.receipt_id}: snapshot hash drift`); }
}
const rawFiles=fs.readdirSync('public/vault/raw').filter(x=>!['README.md','.gitkeep'].includes(x));
if(rawFiles.length!==cache.raw_primary_binaries_present) errors.push(`raw cache count drift files=${rawFiles.length} status=${cache.raw_primary_binaries_present}`);
if(manifest.counts.assets!==assets.assets.length||manifest.counts.verification_receipts!==receipts.receipts.length||manifest.counts.remote_hash_locks!==locks.locks.length) errors.push('vault manifest count drift');
console.log(`PRIMARY SOURCE VAULT assets=${assets.assets.length} snapshots=${manifest.counts.normalized_snapshots} locks=${locks.locks.length} localRaw=${rawFiles.length}`);
console.log(`cache=${cache.status}`);
if(errors.length){ console.error(errors.join('\n')); process.exit(1); }
console.log('PASS');
