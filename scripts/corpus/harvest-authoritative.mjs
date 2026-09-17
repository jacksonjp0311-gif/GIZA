import fs from 'node:fs'; import crypto from 'node:crypto';
const sources=JSON.parse(fs.readFileSync('public/model/evidence/source_registry.json','utf8')).sources;
const args=new Set(process.argv.slice(2)); const limitArg=process.argv.find(x=>x.startsWith('--limit=')); const limit=limitArg?Number(limitArg.split('=')[1]):25;
const allowed=sources.filter(s=>['PUBLIC_WEB','PUBLIC_DIGITIZED_VIEW','ABSTRACT_PUBLIC','ABSTRACT_PUBLIC_PDF_ACCESS_DEPENDS_SESSION'].includes(s.access)).slice(0,limit);
const out=[];
for(const s of allowed){
  try{
    const r=await fetch(s.url,{redirect:'follow',headers:{'user-agent':'GIZA-Archive-Harvest/0.10.1 (+research metadata verification)'}});
    const text=await r.text();
    const title=(text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]??'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,300);
    out.push({source_id:s.id,url:s.url,status:r.status,final_url:r.url,title,content_sha256:crypto.createHash('sha256').update(text).digest('hex'),bytes:Buffer.byteLength(text),retrieved_at:new Date().toISOString(),body_cached:false});
  }catch(e){out.push({source_id:s.id,url:s.url,status:'FETCH_ERROR',error:String(e?.message??e),retrieved_at:new Date().toISOString(),body_cached:false});}
}
const result={schema_version:'1.0.0',version:'0.10.1',policy:'Metadata/status/hash harvest only. No access controls are bypassed and response bodies are not cached by this command.',count:out.length,results:out};
fs.writeFileSync('public/model/corpus/harvest_status.json',JSON.stringify(result,null,2)+'\n');
console.log(`harvested metadata for ${out.length} public sources`);
if(args.has('--strict')&&out.some(x=>x.status==='FETCH_ERROR'||Number(x.status)>=400))process.exit(2);
