import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const identity=JSON.parse(fs.readFileSync(path.join(root,'GIZA.json'),'utf8'));
function walk(dir){
  const out=[];
  for(const name of fs.readdirSync(dir)){
    if(name==='node_modules'||name==='.git')continue;
    const p=path.join(dir,name); const st=fs.statSync(p);
    if(st.isDirectory())out.push(...walk(p)); else out.push(p);
  }
  return out;
}
const files=walk(root).filter(p=>{
  const rel=path.relative(root,p).replaceAll('\\','/');
  return rel!=='GIZA_MANIFEST.json'&&!rel.endsWith('.zip')&&!rel.endsWith('.sha256.txt');
}).sort();
const rows=files.map(p=>{
  const buf=fs.readFileSync(p); return {path:path.relative(root,p).replaceAll('\\','/'),sha256:crypto.createHash('sha256').update(buf).digest('hex'),bytes:buf.length};
});
const manifest={product:'GIZA',version:identity.version,codename:identity.codename,generated_at:new Date().toISOString(),file_count:rows.length,files:rows};
fs.writeFileSync(path.join(root,'GIZA_MANIFEST.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`GIZA manifest ${identity.version} ${identity.codename} files=${rows.length}`);
