import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const assetsDoc = read('public/vault/assets.json');
const statusPath = 'public/vault/cache_status.json';
const args = process.argv.slice(2);
const sourceArg = args.indexOf('--source');
const requestedId = sourceArg >= 0 ? args[sourceArg + 1] : null;
const all = args.includes('--all');
const privateCache = args.includes('--private-cache');
const dryRun = args.includes('--dry-run');

if (!requestedId && !all) {
  console.error('Usage: node scripts/vault/fetch-primary.mjs --source <asset-id> | --all [--private-cache] [--dry-run]');
  process.exit(2);
}

const releaseAllowed = a => String(a.redistribution).startsWith('ALLOWED');
const fetchEligible = a => Boolean(a.download_url) && !['ACCESS_RESTRICTED','DOWNLOAD_URL_UNRESOLVED'].includes(a.acquisition_state);
const selected = requestedId ? assetsDoc.assets.filter(a => a.id === requestedId) : assetsDoc.assets.filter(fetchEligible);
if (requestedId && !selected.length) { console.error(`Unknown asset ${requestedId}`); process.exit(2); }

function digest(buf, alg) { return crypto.createHash(alg.toLowerCase()).update(buf).digest('hex'); }
function filenameFor(a) {
  try {
    const u = new URL(a.download_url);
    const b = path.basename(u.pathname);
    return b && b !== '/' ? b : `${a.id.replaceAll('.','_')}.bin`;
  } catch { return `${a.id.replaceAll('.','_')}.bin`; }
}

let status = fs.existsSync(statusPath) ? read(statusPath) : {version: assetsDoc.version};
status.assets ??= {};
let failures = 0;

for (const a of selected) {
  if (!fetchEligible(a)) {
    console.log(`SKIP ${a.id}: state=${a.acquisition_state} download_url=${a.download_url ?? 'null'}`);
    continue;
  }
  const canBundle = releaseAllowed(a);
  if (!canBundle && !privateCache) {
    console.log(`SKIP ${a.id}: rights do not authorize release bundling; use --private-cache only when lawful local analysis is intended.`);
    continue;
  }
  const destDir = canBundle ? 'public/vault/raw' : '.vault-cache';
  fs.mkdirSync(destDir, {recursive:true});
  const dest = path.join(destDir, filenameFor(a));
  console.log(`${dryRun?'DRY ':''}FETCH ${a.id} -> ${dest}`);
  if (dryRun) continue;
  try {
    const r = await fetch(a.download_url, {redirect:'follow', headers:{'User-Agent':'GIZA-PrimarySourceVault/0.10.1 (+evidence-preservation)'}});
    if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
    const buf = Buffer.from(await r.arrayBuffer());
    if (a.expected_size_bytes && Math.abs(buf.length - a.expected_size_bytes) > Math.max(1024, a.expected_size_bytes*0.20)) {
      console.warn(`WARN ${a.id}: received size ${buf.length}, expected approximate ${a.expected_size_bytes}`);
    }
    if (a.expected_checksum) {
      const got = digest(buf, a.expected_checksum.algorithm);
      if (got.toLowerCase() !== a.expected_checksum.value.toLowerCase()) throw new Error(`CHECKSUM_MISMATCH expected ${a.expected_checksum.value} got ${got}`);
    }
    fs.writeFileSync(dest, buf);
    const sha256 = digest(buf, 'sha256');
    status.assets[a.id] = {path:dest, bytes:buf.length, sha256, cached_at:new Date().toISOString(), redistribution: a.redistribution, release_bundled:canBundle};
    console.log(`OK ${a.id} bytes=${buf.length} sha256=${sha256}`);
  } catch (e) {
    failures++;
    console.error(`FAIL ${a.id}: ${e.message}`);
  }
}

const releaseRows = Object.values(status.assets).filter(x=>x.release_bundled && fs.existsSync(x.path));
const privateRows = Object.values(status.assets).filter(x=>!x.release_bundled && fs.existsSync(x.path));
status.schema_version='1.0.0'; status.version=assetsDoc.version;
status.local_cached_release_assets=releaseRows.length;
status.local_cached_private_assets=privateRows.length;
status.raw_primary_binaries_present=releaseRows.length;
status.status=releaseRows.length?'LOCAL_CACHE_PRESENT':'EMPTY_OR_PRIVATE_ONLY';
status.last_checked=new Date().toISOString();
fs.writeFileSync(statusPath, JSON.stringify(status,null,2)+'\n');
if (failures) process.exit(1);
