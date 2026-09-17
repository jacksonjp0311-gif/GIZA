import fs from 'node:fs';
import path from 'node:path';
const catalog=JSON.parse(fs.readFileSync('public/model/observatory/media_catalog.json','utf8'));
const outDir='public/model/evidence/media/observatory';
fs.mkdirSync(outDir,{recursive:true});
const eligible=catalog.assets.filter(a=>a.download_eligible && a.download_url && a.suggested_filename);
if(!eligible.length){console.log('No eligible media.');process.exit(0)}
const attribution=[];
for(const a of eligible){
  console.log(`fetch ${a.id}`);
  const res=await fetch(a.download_url,{redirect:'follow'});
  if(!res.ok) throw new Error(`${a.id}: HTTP ${res.status}`);
  const buf=Buffer.from(await res.arrayBuffer());
  const file=path.join(outDir,a.suggested_filename);
  fs.writeFileSync(file,buf);
  attribution.push({id:a.id,file,page_url:a.page_url,author:a.author,license:a.license,downloaded_at:new Date().toISOString(),bytes:buf.length});
}
fs.writeFileSync(path.join(outDir,'ATTRIBUTION.json'),JSON.stringify({schema_version:'1.0.0',assets:attribution},null,2)+'\n');
console.log(`downloaded=${eligible.length} output=${outDir}`);
console.log('Review each file page/license before redistribution; fetching does not promote geometry.');
