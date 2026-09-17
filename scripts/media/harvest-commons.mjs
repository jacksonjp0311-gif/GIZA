import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const API='https://commons.wikimedia.org/w/api.php';
const OUT='public/model/observatory/commons_harvest.json';
const CACHE='public/media/atlas_ingest/cache';
const DOWNLOAD=process.argv.includes('--download');
const CATEGORIES=[
  'Pyramid of Khafra',
  'Interior of Khafra Pyramid',
  'Details of Khafra Pyramid',
  'Historical images of Khafra Pyramid',
  'Drawings of Khafra Pyramid',
  'Mortuary complex of Khafra',
  'Mortuary Temple of Khafra',
  'Valley Temple of Khafra',
  'Interior of Valley Temple of Khafra'
];

const userAgent='GIZA-NEXUS-ATLAS-INGEST/0.10.1 (research evidence harvester; Wikimedia Commons API)';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const clean=s=>String(s??'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const v=(meta,key)=>clean(meta?.[key]?.value);

function isFree(meta){
  const license=(v(meta,'LicenseShortName')+' '+v(meta,'UsageTerms')+' '+v(meta,'License')).toLowerCase();
  const tokens=['cc by','cc-by','cc0','public domain','pd-old','pd-art','gfdl','copyrighted free use','creative commons attribution'];
  return tokens.some(t=>license.includes(t));
}
function safeName(title){
  return title.replace(/^File:/,'').replace(/[\\/:*?"<>|]/g,'_');
}
async function getJson(params){
  const q=new URLSearchParams({format:'json',formatversion:'2',origin:'*',...params});
  const res=await fetch(`${API}?${q}`,{headers:{'User-Agent':userAgent}});
  if(!res.ok) throw new Error(`Commons API ${res.status}: ${res.statusText}`);
  return res.json();
}
async function categoryFiles(category){
  let cont; const titles=[];
  do{
    const data=await getJson({action:'query',list:'categorymembers',cmtitle:`Category:${category}`,cmnamespace:'6',cmtype:'file',cmlimit:'500',...(cont?{cmcontinue:cont}:{})});
    titles.push(...(data.query?.categorymembers??[]).map(x=>x.title));
    cont=data.continue?.cmcontinue;
    if(cont) await sleep(40);
  }while(cont);
  return titles;
}
async function infoBatch(titles){
  if(!titles.length) return [];
  const data=await getJson({action:'query',prop:'imageinfo|coordinates',titles:titles.join('|'),iiprop:'url|size|mime|extmetadata|metadata',iilimit:'1'});
  return data.query?.pages??[];
}
async function download(url,dest){
  const res=await fetch(url,{headers:{'User-Agent':userAgent}});
  if(!res.ok) throw new Error(`download ${res.status}`);
  const buf=Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest,buf);
  return {bytes:buf.length,sha256:crypto.createHash('sha256').update(buf).digest('hex')};
}

async function main(){
fs.mkdirSync(CACHE,{recursive:true});
const membership=new Map();
for(const category of CATEGORIES){
  console.log(`category ${category}`);
  const titles=await categoryFiles(category);
  for(const title of titles){
    if(!membership.has(title)) membership.set(title,new Set());
    membership.get(title).add(category);
  }
}
const titles=[...membership.keys()].sort();
const records=[]; const rejected=[];
for(let i=0;i<titles.length;i+=50){
  const pages=await infoBatch(titles.slice(i,i+50));
  for(const page of pages){
    const ii=page.imageinfo?.[0]; if(!ii) continue;
    const meta=ii.extmetadata??{};
    const rec={
      title:page.title,
      categories:[...membership.get(page.title)??[]].sort(),
      page_url:`https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g,'_')).replace(/%3A/,':')}`,
      original_url:ii.url,
      description_url:ii.descriptionurl,
      width:ii.width,height:ii.height,size_bytes:ii.size,mime:ii.mime,
      author:v(meta,'Artist'),credit:v(meta,'Credit'),description:v(meta,'ImageDescription'),date_time:v(meta,'DateTimeOriginal')||v(meta,'DateTime'),
      license_short_name:v(meta,'LicenseShortName'),usage_terms:v(meta,'UsageTerms'),license_url:v(meta,'LicenseUrl'),
      attribution_required:v(meta,'AttributionRequired'),restrictions:v(meta,'Restrictions'),
      camera_location:page.coordinates?.[0]?{lat:page.coordinates[0].lat,lon:page.coordinates[0].lon,primary:page.coordinates[0].primary??false}:null,
      free_license:isFree(meta),storage:'REMOTE_REFERENCE_ONLY'
    };
    if(!rec.free_license){ rejected.push({...rec,reject_reason:'LICENSE_NOT_RECOGNIZED_AS_FREE_BY_AUTOMATED_FILTER'}); continue; }
    if(DOWNLOAD && ii.url){
      const filename=safeName(page.title); const dest=path.join(CACHE,filename);
      try{ const dl=await download(ii.url,dest); rec.storage='CACHED_ORIGINAL'; rec.cached_path=dest; rec.content_hash=dl.sha256; rec.cached_bytes=dl.bytes; }
      catch(err){ rec.download_error=String(err); }
    }
    records.push(rec);
  }
  console.log(`processed ${Math.min(i+50,titles.length)}/${titles.length}`);
  await sleep(60);
}
const output={
  schema_version:'1.0.0',version:'0.10.1',generated_at:new Date().toISOString(),
  provider:'Wikimedia Commons',api:API,categories:CATEGORIES,
  category_file_memberships:titles.length,accepted_free_assets:records.length,rejected_unverified_license:rejected.length,
  download_mode:DOWNLOAD?'CACHE_ELIGIBLE_ORIGINALS':'METADATA_ONLY',
  policy:'Category membership is discovery only. Only files whose API license metadata matches a recognized free/PD license are accepted automatically; all attribution/license metadata is retained. Geometry extraction remains separately gated by calibration and registration.',
  assets:records,rejected
};
fs.writeFileSync(OUT,JSON.stringify(output,null,2)+'\n');
console.log(`wrote ${OUT} accepted=${records.length} rejected=${rejected.length} download=${DOWNLOAD}`);
}

main().catch(err=>{
  console.error('ATLAS harvest could not reach Wikimedia Commons. No partial harvest was promoted.');
  console.error(String(err?.cause?.code ?? err?.message ?? err));
  console.error('Run this command again on a networked desktop.');
  process.exit(2);
});
