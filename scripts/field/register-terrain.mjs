import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [file, sourceId, nativeCrs, verticalDatum='UNKNOWN'] = process.argv.slice(2);
if (!file || !sourceId || !nativeCrs) {
  console.error('Usage: node scripts/field/register-terrain.mjs <file> <source_id> <native_crs> [vertical_datum]');
  process.exit(2);
}
if (!fs.existsSync(file)) { console.error(`Missing file: ${file}`); process.exit(2); }
const registryPath='public/model/field/terrain_registry.json';
const registry=JSON.parse(fs.readFileSync(registryPath,'utf8'));
if (!registry.layers.some(l=>l.source_id===sourceId)) {
  console.error(`Source ${sourceId} is not an approved terrain layer in terrain_registry.json`);
  process.exit(2);
}
const bytes=fs.readFileSync(file);
const sha256=crypto.createHash('sha256').update(bytes).digest('hex');
const destDir='public/model/field/imports';
fs.mkdirSync(destDir,{recursive:true});
const record={
  id:`terrain.import.${Date.now()}`,
  source_id:sourceId,
  original_name:path.basename(file),
  sha256,
  bytes:bytes.length,
  native_crs:nativeCrs,
  native_vertical_datum:verticalDatum,
  status:'QUARANTINED',
  qa_status:'PENDING',
  transform_receipt:null,
  display_allowed:false,
  rule:'Registration does not activate terrain. CRS/vertical metadata, transform receipt and QA must pass first.'
};
const receiptPath=path.join(destDir,`${record.id}.json`);
fs.writeFileSync(receiptPath,JSON.stringify(record,null,2)+'\n');
const importsPath='public/model/field/terrain_imports.json';
const imports=JSON.parse(fs.readFileSync(importsPath,'utf8'));
imports.imports.push({...record,receipt_path:receiptPath});
fs.writeFileSync(importsPath,JSON.stringify(imports,null,2)+'\n');
console.log(JSON.stringify({receipt:receiptPath,...record},null,2));
