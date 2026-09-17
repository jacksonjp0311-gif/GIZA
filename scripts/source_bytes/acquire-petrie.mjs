import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const cpath='public/model/source_byte_registration/candidates.json';
const doc=JSON.parse(fs.readFileSync(cpath,'utf8'));
const c=doc.candidates.find(x=>x.id==='bytes.petrie1883.public_domain_pdf');
if(!c) throw new Error('Petrie candidate missing');
if(c.rights_state!=='PUBLIC_DOMAIN') throw new Error('rights gate does not permit automated acquisition');
const urls=[c.byte_url,c.current_original_file_url,...(c.alternate_byte_urls||[])].filter(Boolean);
const tmp='public/vault/raw/.petrie1883-download.tmp.pdf'; fs.mkdirSync(path.dirname(tmp),{recursive:true});
const apath='public/model/source_byte_registration/acquisition_attempts.json';
function logFailure(url,error){const a=JSON.parse(fs.readFileSync(apath,'utf8'));a.attempts.push({id:`attempt.petrie.auto.${Date.now()}`,candidate_id:c.id,url,result:'FAILED',failure_class:'NETWORK_OR_PROVIDER_TRANSFER_FAILURE',local_file_created:false,sha256:null,authority_effect:'NONE',note:String(error)});a.attempt_count=a.attempts.length;fs.writeFileSync(apath,JSON.stringify(a,null,2)+'\n');}
let last='NO_URL_SUCCEEDED';
for(const url of urls){
  try{
    console.log(`GIZA acquire: ${url}`);
    const res=await fetch(url,{redirect:'follow',headers:{'User-Agent':'GIZA-NEXUS/0.10.11 research acquisition'}});
    if(!res.ok) throw new Error(`HTTP_${res.status}`);
    const buf=Buffer.from(await res.arrayBuffer()); fs.writeFileSync(tmp,buf);
    const r=spawnSync(process.execPath,['scripts/source_bytes/import-petrie.mjs','--file',tmp,'--origin',url],{stdio:'inherit'});
    fs.rmSync(tmp,{force:true});
    if(r.status!==0) throw new Error(`IMPORT_EXIT_${r.status}`);
    console.log('GIZA Petrie acquisition/import PASS'); process.exit(0);
  }catch(e){last=e?.message||String(e); if(fs.existsSync(tmp))fs.rmSync(tmp,{force:true}); logFailure(url,last); console.error(`ACQUISITION_PATH_FAILED ${url} ${last}`);}
}
console.error(`ACQUISITION_FAILED ${last}`); process.exit(2);
