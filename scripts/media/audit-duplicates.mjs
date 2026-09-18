import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync('src/lib/mediaIdentity.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {mediaIdentity}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const root=path.resolve('public');
const groups=new Map(),hashes=new Map(),invalidJson=[];let images=0,records=0;
function add(map,key,value){const list=map.get(key)||[];list.push(value);map.set(key,list);}
function visit(value,file,locator='$'){
  if(!value||typeof value!=='object')return;
  if(!Array.isArray(value)){
    const url=value.image_url||value.download_url||value.page_url;
    if(typeof url==='string'){records++;add(groups,mediaIdentity(url),{file,locator,id:value.id});}
  }
  for(const [key,item] of Object.entries(value))visit(item,file,locator+'.'+key);
}
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,entry.name),relative=path.relative(root,file);
  if(entry.isDirectory())walk(file);
  else if(/\.(jpg|jpeg|png|webp|gif|tiff?)$/i.test(file)){images++;add(hashes,crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),relative);}
  else if(file.endsWith('.json')){try{visit(JSON.parse(fs.readFileSync(file,'utf8')),relative);}catch(error){invalidJson.push({file:relative,error:String(error)});}}
}}
walk(root);
const catalogCode=ts.transpileModule(fs.readFileSync('src/epigraphy/catalog.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {INSCRIPTION_IMAGES}=await import('data:text/javascript;base64,'+Buffer.from(catalogCode).toString('base64'));
for(const image of INSCRIPTION_IMAGES)visit({id:image.id,image_url:image.original},'src/epigraphy/catalog.ts');
console.log(JSON.stringify({scope:'All public raster bytes, JSON media references and inscription catalog; exact matches only, not perceptual similarity. Repeated references are not automatically duplicate evidence.',images,records,invalidJson,duplicateBytes:[...hashes].filter(([,v])=>v.length>1),repeatedReferences:[...groups].filter(([,v])=>v.length>1)},null,2));
if(invalidJson.length)process.exitCode=1;
