import fs from 'node:fs';
import crypto from 'node:crypto';
const files=[
  'public/model/project.json','public/model/parts.json','public/model/assemblies.json',
  'public/model/parameters.json','public/model/stone_field.json','public/model/stone_registry.json'
];
const hash=crypto.createHash('sha256');
const entries=[];
for(const file of files){const bytes=fs.readFileSync(file);const sha=crypto.createHash('sha256').update(bytes).digest('hex');entries.push({path:file,sha256:sha,bytes:bytes.length});hash.update(file);hash.update(bytes)}
const project=JSON.parse(fs.readFileSync('public/model/project.json','utf8'));
const snapshot={version:'1.0.0',geometry_revision:project.revision_id??'unknown',created_at:new Date().toISOString(),geometry_hash:hash.digest('hex'),files:entries};
fs.writeFileSync('public/model/evidence/geometry_snapshot.json',JSON.stringify(snapshot,null,2)+'\n');
console.log(snapshot.geometry_hash);
