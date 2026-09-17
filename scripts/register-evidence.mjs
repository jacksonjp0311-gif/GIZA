import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [kindRaw, inputPath, sourceId, targetId] = process.argv.slice(2);
if (!kindRaw || !inputPath || !sourceId) {
  console.error('Usage: node scripts/register-evidence.mjs <PHOTO|PLAN|POINT_CLOUD|MESH|DEM|DOCUMENT> <path> <source_id> [target_id]');
  process.exit(2);
}
const kind = kindRaw.toUpperCase();
const allowed = new Set(['PHOTO','PLAN','POINT_CLOUD','MESH','DEM','DOCUMENT']);
if (!allowed.has(kind)) { console.error(`Unsupported kind ${kind}`); process.exit(2); }
if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isFile()) { console.error(`File not found: ${inputPath}`); process.exit(2); }

const sources = JSON.parse(fs.readFileSync('public/model/evidence/source_registry.json','utf8')).sources ?? [];
if (!sources.some(s => s.id === sourceId)) { console.error(`Unknown source_id: ${sourceId}`); process.exit(2); }
const parts = JSON.parse(fs.readFileSync('public/model/parts.json','utf8')).parts ?? [];
if (targetId && !parts.some(p => p.id === targetId)) { console.error(`Unknown target_id: ${targetId}`); process.exit(2); }

const bytes = fs.readFileSync(inputPath);
const hash = crypto.createHash('sha256').update(bytes).digest('hex');
const ext = path.extname(inputPath).toLowerCase();
const destDir = path.resolve('public/model/evidence/inbox');
fs.mkdirSync(destDir,{recursive:true});
const destName = `${hash.slice(0,16)}${ext}`;
const dest = path.join(destDir,destName);
if (!fs.existsSync(dest)) fs.copyFileSync(inputPath,dest);

const registryPath='public/model/evidence/media_assets.json';
const registry=JSON.parse(fs.readFileSync(registryPath,'utf8'));
if (!registry.assets.some(a => a.sha256 === hash)) {
  registry.assets.push({
    id:`asset.${hash.slice(0,12)}`,
    kind,
    original_name:path.basename(inputPath),
    stored_path:`evidence/inbox/${destName}`,
    sha256:hash,
    bytes:bytes.length,
    source_id:sourceId,
    target_id:targetId ?? null,
    rights_status:'NEEDS_REVIEW',
    geometry_status:'QUARANTINED',
    evidence_maturity:'E0',
    registered_at:new Date().toISOString(),
    note:'Registration only. This asset is not authorized to mutate canonical geometry.'
  });
  fs.writeFileSync(registryPath,JSON.stringify(registry,null,2)+'\n');
}
console.log(JSON.stringify({sha256:hash,stored_path:`evidence/inbox/${destName}`,status:'QUARANTINED'},null,2));
