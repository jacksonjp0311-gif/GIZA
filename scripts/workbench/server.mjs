/** Local-only workbench. Node built-ins only. No dependency install or outbound calls. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {ROOTS, VERSION, GateError, readJson, inside, atomicJson, freezeLandmarks, fitFrozen, sha, hashObject} from '../plate_registration/engine.mjs';
import {fitSimilarity,applySimilarity,residuals,summarizeResiduals,frameDiagonal} from '../plate_registration/math.mjs';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const root=path.resolve(process.env.GIZA_ROOT||repo),port=Number(process.env.GIZA_PORT||4174);
const token=crypto.randomBytes(32).toString('hex');
const has=rel=>fs.existsSync(inside(root,rel));
function readOptional(rel){return has(rel)?readJson(root,rel):null;}
const commandPresent=c=>spawnSync(c,['-v'],{encoding:'utf8',timeout:3000}).error?.code!=='ENOENT';
const rendererAvailable=commandPresent('pdfinfo')&&commandPresent('pdftoppm');
function state(){
  const c=readJson(root,ROOTS.candidates).candidates.find(c=>c.id==='bytes.petrie1883.public_domain_pdf');
  const h=readJson(root,ROOTS.handoff),campaign=readJson(root,ROOTS.campaign),result=readOptional(ROOTS.result);
  const statuses=[];let sourceOK=false,renderOK=false;
  try {sourceOK=Boolean(c.raw_byte_verified&&c.local_path&&has(c.local_path)&&sha(fs.readFileSync(inside(root,c.local_path)))===c.sha256);}catch{}
  try {const p=h.local_custody.plate_vi_render_path;renderOK=Boolean(sourceOK&&p&&has(p)&&sha(fs.readFileSync(inside(root,p)))===h.local_custody.plate_vi_render_sha256&&h.local_custody.render_source_sha256===c.sha256);}catch{}
  for(const [id,label,ok] of [['source','Source PDF in local custody',sourceOK],['render','Plate render bound to PDF',renderOK],['review','Plate identity confirmed',renderOK&&h.local_custody.visual_confirmation===true],['freeze','Landmarks and profile frozen',has(ROOTS.frozen)],['result','Fit result recorded',Boolean(result)]])statuses.push({id,label,ok});
  return {version:VERSION,token,source_kind:'PROJECT_STATE',renderer_available:rendererAvailable,source:{present:sourceOK,sha256:sourceOK?c.sha256:null,bytes:h.local_custody.bytes??null},render:{present:renderOK,sha256:renderOK?h.local_custody.plate_vi_render_sha256:null},confirmed:renderOK&&h.local_custody.visual_confirmation===true,campaign,profiles:readJson(root,ROOTS.profile).profiles,landmarks:readJson(root,ROOTS.template).landmarks,sources:readJson(root,ROOTS.sources).sources.map(s=>({id:s.id,title:s.title})),steps:statuses,result,frozen:has(ROOTS.frozen),canonical_geometry_changed:false,archaeological_metric_rays:0};
}
function demo(){
  const truth={a:.02,b:0,tx:1,ty:2};const pixels=[[100,100],[850,130],[180,620],[820,680],[380,290],[650,480],[300,700],[680,180],[920,450]];
  const noise=[[.02,-.01],[-.01,.015],[.01,.01],[-.018,-.012],[.012,-.018],[-.009,.008],[.10,-.05],[-.015,.035],[.055,-.04]];
  const pts=pixels.map(([x,y],i)=>{const t=applySimilarity(truth,{x,y});return {id:`demo-${i+1}`,sector:i<6?'CONTROLS':'HOLDOUTS',source:{x,y},target:{x:t.x+noise[i][0],y:t.y+noise[i][1]}};});
  const fit=fitSimilarity(pts.slice(0,6)),hr=residuals(fit,pts.slice(6)),cr=residuals(fit,pts.slice(0,6)),diag=frameDiagonal(pts),hs=summarizeResiduals(hr,diag),p=readJson(root,ROOTS.profile).profiles[0];
  const drift=Math.abs(fit.scale/.02-1),gates={holdout_rms:hs.rms<=p.acceptance.absolute_holdout_rms_m_max,normalized_rms:hs.normalized_rms<=p.acceptance.normalized_holdout_rms_max,worst_holdout:hs.normalized_max<=p.acceptance.normalized_holdout_max_max,independent_scale:drift<=p.acceptance.scale_drift_fraction_max};
  return {version:VERSION,source_kind:'SYNTHETIC_DEMO',label:'Synthetic software test — not Giza measurements',points:pts,fit,control_residuals:cr,holdout_residuals:hr,holdout_summary:hs,control_summary:summarizeResiduals(cr,diag),gates,passed:Object.values(gates).every(Boolean),scale_check:{evaluated:true,expected_meters_per_pixel:.02,actual_meters_per_pixel:fit.scale,relative_drift:drift},canonical_geometry_mutated:false,geometry_authority:'NONE_SYNTHETIC_ONLY'};
}
function send(res,code,obj){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(obj));}
async function body(req,limit){const chunks=[];let count=0;for await(const b of req){count+=b.length;if(count>limit)throw new GateError('UPLOAD_TOO_LARGE');chunks.push(b);}return Buffer.concat(chunks);}
function runner(rel,args=[]){const r=spawnSync(process.execPath,[path.join(repo,rel),...args],{cwd:root,encoding:'utf8',timeout:60000,maxBuffer:1024*1024});if(r.status!==0)throw new GateError('PROCESS_FAILED',(r.stderr||r.error?.message||r.stdout||'Process failed').slice(-1200));return r.stdout;}
function staticFile(res,full){const ext=path.extname(full),types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.json':'application/json'};res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(full).pipe(res);}
const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; connect-src 'self'; frame-ancestors 'self' http://127.0.0.1:4173 http://localhost:4173; object-src 'none'; base-uri 'none'");
  try {
    const host=(req.headers.host||'').split(':')[0]; if(!['127.0.0.1','localhost'].includes(host))throw new GateError('HOST_NOT_ALLOWED');
    const url=new URL(req.url,'http://127.0.0.1');
    if(req.method==='POST'){
      if(req.headers['x-giza-token']!==token)throw new GateError('TOKEN_REQUIRED');
      if(req.headers.origin&&!['http://127.0.0.1:'+port,'http://localhost:'+port,'http://127.0.0.1:4173','http://localhost:4173'].includes(req.headers.origin))throw new GateError('ORIGIN_NOT_ALLOWED');
      if(url.pathname==='/api/import'){
        if(has(ROOTS.frozen)||has(ROOTS.result))throw new GateError('EXPERIMENT_ALREADY_FROZEN');
        const b=await body(req,64*1024*1024);if(b.subarray(0,5).toString()!=='%PDF-')throw new GateError('SOURCE_NOT_PDF');
        const temp=fs.mkdtempSync(path.join(os.tmpdir(),'giza-import-'));try{const p=path.join(temp,'upload.pdf');fs.writeFileSync(p,b);runner('scripts/source_bytes/import-petrie.mjs',['--file',p,'--origin','OPERATOR_LOCAL_UPLOAD']);runner('scripts/plate_registration/render-plate-vi.mjs');}finally{fs.rmSync(temp,{recursive:true,force:true});}
        return send(res,200,state());
      }
      const payload=JSON.parse((await body(req,1024*1024)).toString()||'{}');
      if(url.pathname==='/api/confirm'){if(payload.confirm!==true)throw new GateError('EXPLICIT_CONFIRMATION_REQUIRED');runner('scripts/plate_registration/confirm-plate-vi.mjs',['--confirm']);return send(res,200,state());}
      if(url.pathname==='/api/freeze'){const out=freezeLandmarks(root,payload);return send(res,200,{...out,status:state()});}
      if(url.pathname==='/api/fit'){const out=fitFrozen(root);return send(res,200,out);}
      return send(res,404,{error:'NOT_FOUND'});
    }
    if(req.method!=='GET')return send(res,405,{error:'METHOD_NOT_ALLOWED'});
    if(url.pathname==='/api/status')return send(res,200,state());
    if(url.pathname==='/api/demo')return send(res,200,demo());
    if(url.pathname==='/api/result')return send(res,200,readOptional(ROOTS.result));
    if(url.pathname==='/api/plate'){
      const s=state();if(!s.render.present)throw new GateError('VERIFIED_RENDER_MISSING');
      return staticFile(res,inside(root,readJson(root,ROOTS.handoff).local_custody.plate_vi_render_path));
    }
    if(url.pathname==='/api/health')return send(res,200,{ok:true,version:VERSION,loopback_only:true});
    const route=url.pathname==='/'||url.pathname==='/workbench'||url.pathname==='/workbench/'?'/index.html':url.pathname.replace(/^\/workbench/,'');
    const base=path.join(repo,'public/workbench'); const full=path.resolve(base,'.'+decodeURIComponent(route));
    if(!full.startsWith(base+path.sep)||!fs.existsSync(full)||!fs.statSync(full).isFile())return send(res,404,{error:'NOT_FOUND'});
    return staticFile(res,full);
  }catch(e){return send(res,e instanceof GateError?409:500,{error:e.code??'INTERNAL_ERROR',message:e.message});}
});
server.on('error',e=>{console.error(e.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`GIZA ${VERSION} Registration Workbench: http://127.0.0.1:${port}/workbench/`));
