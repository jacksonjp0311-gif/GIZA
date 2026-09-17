import type {CanonicalPoint,EvidenceAssembly,RealityAuthority,SectionPlane,SpatialResult} from './types';
import {assertSafeDocument} from './observationContract';
import {importCanonicalAssembly,measureAngle,measurePoints,pointInFrame} from './spatial';
import {canonicalJson} from './graph';
import {sha256Json,verifyReceipt,type EvidenceReceipt} from './receipts';
import {validateBookmark,type CameraBookmark} from './presentation';

export interface InvestigationDraft {selectedId:string;points:CanonicalPoint[];frameId:string;mode:'DISTANCE'|'ANGLE';section:SectionPlane|null}
export interface InvestigationPresentation {purpose:'PRESENTATION_ONLY';room:boolean;isolated:string|null;layers:Record<RealityAuthority,boolean>;explode:number;bookmarks:CameraBookmark[];camera?:CameraBookmark|null}
export interface SavedInvestigation {schema:'giza.saved-investigation.v1';id:string;sha256:string;payload:{title:string;createdAt:string;assemblySnapshot:EvidenceAssembly;snapshotSha256:string;dependencyFingerprint:string;draft:InvestigationDraft;result:SpatialResult;receipts:EvidenceReceipt[];presentation:InvestigationPresentation}}
function checkDraft(d:InvestigationDraft,a:EvidenceAssembly){
  if(!d||!['DISTANCE','ANGLE'].includes(d.mode)||!a.frames.some(f=>f.id===d.frameId)||!a.features.some(f=>f.id===d.selectedId)||!Array.isArray(d.points)||d.points.length!==(d.mode==='ANGLE'?3:2))throw new Error('Investigation requires a complete measurement in a declared frame');
  const checkPlane=(p:SectionPlane)=>{if(!p||!a.frames.some(f=>f.id===p.frameId)||!Array.isArray(p.normal)||p.normal.length!==3||p.normal.some(v=>typeof v!=='number'||!Number.isFinite(v))||Math.hypot(...p.normal)<1e-10||!Number.isFinite(p.offset))throw new Error('Invalid investigation section');};
  if(d.section!==null)checkPlane(d.section);
  for(const p of d.points){
    const feature=a.features.find(f=>f.id===p.featureId);
    if(!feature||feature.frameId!==p.frameId||feature.geometry.kind==='unknown'||!Array.isArray(p.position)||p.position.length!==3||p.position.some(v=>typeof v!=='number'||!Number.isFinite(v)))throw new Error('Point lacks its original feature/frame');
    if(p.origin){
      if(p.origin.kind!=='COMPUTED_SECTION'||p.origin.surfaceAuthority!=='RECONSTRUCTED')throw new Error('Invalid computed-surface authority');
      checkPlane(p.origin.section);const at=pointInFrame(a,p,p.origin.section.frameId);
      if(!at||Math.abs(at.reduce((s,v,i)=>s+v*p.origin!.section.normal[i],-p.origin.section.offset))>1e-5)throw new Error('Section point is off its archived plane');
    }
  }
}
function checkPresentation(p:InvestigationPresentation,a:EvidenceAssembly){
  if(!p||p.purpose!=='PRESENTATION_ONLY'||typeof p.room!=='boolean'||!Number.isFinite(p.explode)||p.explode<0||p.explode>3||!p.layers||['OBSERVED','RECONSTRUCTED','HYPOTHESIS'].some(k=>typeof p.layers[k as RealityAuthority]!=='boolean')||!Array.isArray(p.bookmarks)||p.bookmarks.length>12||(p.isolated!==null&&!a.features.some(f=>f.objectId===p.isolated)))throw new Error('Invalid presentation state');
  p.bookmarks.forEach(validateBookmark);
  if(p.camera!=null)validateBookmark(p.camera);
}
function compute(a:EvidenceAssembly,d:InvestigationDraft){return d.mode==='ANGLE'?measureAngle(a,d.points[0],d.points[1],d.points[2],d.frameId):measurePoints(a,d.points[0],d.points[1],d.frameId);}
async function fingerprint(a:EvidenceAssembly,d:InvestigationDraft){
  const features=a.features.filter(f=>d.points.some(p=>p.featureId===f.id)),frames=new Set([d.frameId,...d.points.map(p=>p.frameId)]),transforms=new Set<string>();
  let changed=true;while(changed){changed=false;for(const t of a.transforms)if(t.scope==='AUTHORITATIVE_RECONSTRUCTION'&&frames.has(t.from)){transforms.add(t.id);if(!frames.has(t.to)){frames.add(t.to);changed=true;}}}
  const ts=a.transforms.filter(t=>transforms.has(t.id)),observations=new Set([...features.flatMap(f=>f.observationIds),...ts.flatMap(t=>t.observationIds)]);
  return sha256Json({rule:'canonical-measurement.v1',points:d.points,mode:d.mode,frameId:d.frameId,features,frames:a.frames.filter(f=>frames.has(f.id)),transforms:ts,observations:a.observations.filter(o=>observations.has(o.id))});
}
export async function saveInvestigation(title:string,assembly:EvidenceAssembly,draft:InvestigationDraft,presentation:InvestigationPresentation,receipts:readonly EvidenceReceipt[]):Promise<SavedInvestigation>{
  const a=importCanonicalAssembly(assembly);checkDraft(draft,a);checkPresentation(presentation,a);
  if(!title.trim()||title.length>160)throw new Error('Use a title of 1–160 characters');
  const verified=await Promise.all(receipts.map(verifyReceipt));
  if(verified.some(r=>r.payload.assemblyId!==a.id))throw new Error('Linked receipt belongs to another assembly');
  const payload={title,createdAt:new Date().toISOString(),assemblySnapshot:a,snapshotSha256:await sha256Json(a),dependencyFingerprint:await fingerprint(a,draft),draft,result:compute(a,draft),receipts:verified,presentation};
  const sha256=await sha256Json(payload);return JSON.parse(canonicalJson({schema:'giza.saved-investigation.v1',id:`investigation:${sha256}`,sha256,payload}));
}
export async function restoreInvestigation(input:unknown):Promise<SavedInvestigation>{
  if(typeof input==='string'&&new TextEncoder().encode(input).length>8_000_000)throw new Error('Investigation exceeds 8 MB');
  const value=typeof input==='string'?JSON.parse(input):input;assertSafeDocument(value);
  const s=JSON.parse(canonicalJson(value)) as SavedInvestigation;
  if(s.schema!=='giza.saved-investigation.v1'||!s.payload||s.sha256!==await sha256Json(s.payload)||s.id!==`investigation:${s.sha256}`)throw new Error('Investigation identity/checksum mismatch');
  const p=s.payload,a=importCanonicalAssembly(p.assemblySnapshot);checkDraft(p.draft,a);checkPresentation(p.presentation,a);
  if(typeof p.title!=='string'||!p.title.trim()||p.title.length>160||!Number.isFinite(Date.parse(p.createdAt))||!Array.isArray(p.receipts)||p.receipts.length>100)throw new Error('Invalid investigation metadata');
  if(p.snapshotSha256!==await sha256Json(a)||p.dependencyFingerprint!==await fingerprint(a,p.draft)||canonicalJson(p.result)!==canonicalJson(compute(a,p.draft)))throw new Error('Investigation does not reproduce against archived inputs');
  for(const r of p.receipts)if((await verifyReceipt(r)).payload.assemblyId!==a.id)throw new Error('Linked receipt assembly mismatch');
  return s;
}
export async function investigationApplicability(s:SavedInvestigation,current:EvidenceAssembly){
  try{const checked=await restoreInvestigation(s);checkDraft(checked.payload.draft,current);return await fingerprint(current,checked.payload.draft)===checked.payload.dependencyFingerprint?'CURRENT':'HISTORICAL';}catch{return 'UNVERIFIABLE';}
}
export async function readInvestigations(raw:string|null):Promise<SavedInvestigation[]>{
  if(raw===null)return [];if(new TextEncoder().encode(raw).length>8_000_000)throw new Error('Stored investigations exceed 8 MB; preserve original bytes');
  const rows=JSON.parse(raw);assertSafeDocument(rows);if(!Array.isArray(rows)||rows.length>100)throw new Error('Invalid investigation collection');
  const unique=new Map<string,SavedInvestigation>();
  for(const row of rows){const verified=await restoreInvestigation(row),prior=unique.get(verified.id);if(prior&&canonicalJson(prior)!==canonicalJson(verified))throw new Error('Conflicting same-ID investigation');unique.set(verified.id,verified);}
  return [...unique.values()];
}
export async function appendInvestigation(storage:Pick<Storage,'getItem'|'setItem'>,key:string,baseline:string|null,record:SavedInvestigation){
  const rows=await readInvestigations(baseline),verified=await restoreInvestigation(record);
  const prior=rows.find(r=>r.id===verified.id);if(prior&&canonicalJson(prior)!==canonicalJson(verified))throw new Error('Conflicting same-ID investigation');
  if(!prior)rows.push(verified);const raw=canonicalJson(rows);assertSafeDocument(rows);
  if(storage.getItem(key)!==baseline)throw new Error('Another tab changed saved research. Export this investigation, then reload before appending.');
  storage.setItem(key,raw);return {rows,baseline:raw};
}
