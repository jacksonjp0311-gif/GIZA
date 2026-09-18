import {canonicalJson,parseEvidenceGraph,type SpatialEvidenceGraph,type EvidenceNode} from './graph';
import {sha256Json} from './receipts';
import {assertSafeDocument} from './observationContract';
import type {EvidenceAssembly} from './types';
/** Session capabilities are minted ONLY by a response from the local replay endpoint.
 * JSON import cannot mint one. Exported verification fields remain imported claims. */
const sessions=new WeakSet<object>();
const replays=new WeakSet<object>();
const assemblyBindings=new WeakMap<object,string>();
export interface LiveRelation {payload:EvidenceNode['data'];sha256:string}
/** Recheck only revision status on workspace/window return; never on viewport frames. */
export async function isLiveRevisionActive(record:LiveRelation):Promise<boolean>{
  try{
    const status=await fetch('/api/status',{cache:'no-store',signal:AbortSignal.timeout(5000)});
    if(!status.ok)throw new Error('Workbench unavailable');
    const {token}=await status.json();
    const response=await fetch('/api/evidence-campaign',{method:'POST',headers:{'Content-Type':'application/json','X-Giza-Token':token},body:JSON.stringify({id:record.payload.campaignId,action:'revision-state'}),signal:AbortSignal.timeout(5000)});
    const state=await response.json();
    if(response.ok&&state.active===true&&state.revisionId===record.payload.revisionId)return true;
  }catch{/* No current status means no active session authority. Archived campaign remains. */}
  sessions.delete(record);return false;
}
export function registrationVerification(record:unknown){
  return record&&typeof record==='object'&&sessions.has(record)?'REVIEWED_SCOPED_RELATION':record&&typeof record==='object'&&replays.has(record)?'REPLAY_VERIFIED':record?'IMPORTED_CLAIM':'NO_REGISTRATION';
}
/** Reproduce a campaign without treating numerical replay as review or promotion. */
export async function replayLocalVerification(id:string){
  if(!/^[a-z][a-z0-9.-]{2,100}$/.test(id))throw new Error('Enter a local campaign ID.');
  const status=await fetch('/api/status',{cache:'no-store',signal:AbortSignal.timeout(15000)});
  if(!status.ok)throw new Error('Local workbench unavailable. Start GIZA with npm start.');
  const {token}=await status.json();
  const response=await fetch('/api/evidence-campaign',{method:'POST',headers:{'Content-Type':'application/json','X-Giza-Token':token},body:JSON.stringify({id,action:'replay-verification'}),signal:AbortSignal.timeout(60000)});
  const record=await response.json();if(!response.ok)throw new Error(record.message??record.error??'Replay failed');
  assertSafeDocument(record,5_000_000);
  if(record.campaignId!==id||record.verificationState!=='REPLAY_VERIFIED'||record.acceptedForLiveGraph!==false)throw new Error('Replay response has an inconsistent scope.');
  const freeze=(v:unknown)=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}};freeze(record);
  replays.add(record);return record as {campaignId:string;reason:string;acceptedForLiveGraph:false;verificationState:'REPLAY_VERIFIED'};
}
export async function replayLocalCampaign(id:string,assembly:EvidenceAssembly):Promise<LiveRelation>{
  if(!/^[a-z][a-z0-9.-]{2,100}$/.test(id))throw new Error('Enter a campaign ID created in the local registration workbench.');
  const status=await fetch('/api/status',{cache:'no-store',signal:AbortSignal.timeout(15000)});
  if(!status.ok)throw new Error('Local workbench is unavailable. Start GIZA with npm start, then retry.');
  const {token}=await status.json();
  const response=await fetch('/api/evidence-campaign',{method:'POST',headers:{'Content-Type':'application/json','X-Giza-Token':token},body:JSON.stringify({id,action:'live-relation'}),signal:AbortSignal.timeout(60000)});
  const record=await response.json();if(!response.ok)throw new Error(record.message??record.error??'Campaign replay failed');
  assertSafeDocument(record,5_000_000);
  if(record.sha256!==await sha256Json(record.payload)||record.payload?.assemblySha256!==await sha256Json(assembly))throw new Error('Relation bytes or base assembly snapshot differ. Review a revision against the current assembly before integrating.');
  if(record.payload?.campaignId!==id||record.payload?.verificationClaim!=='REVIEWED_SCOPED_RELATION'||record.payload?.replay?.reproduced!==true)throw new Error('Local replay response lacks its scoped review chain.');
  const immutable=JSON.parse(canonicalJson(record)) as LiveRelation;
  // Freeze nested records too: capability identity cannot survive payload mutation.
  const freeze=(v:unknown)=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}};freeze(immutable);
  sessions.add(immutable);assemblyBindings.set(immutable,canonicalJson(assembly));return immutable;
}
export function integrateLiveRelation(graph:SpatialEvidenceGraph,record:LiveRelation,assembly:EvidenceAssembly):SpatialEvidenceGraph{
  if(!sessions.has(record)||assemblyBindings.get(record)!==canonicalJson(assembly))throw new Error('Imported claims cannot activate live evidence. Replay through the local workbench.');
  const p=record.payload,id=String(p.id);
  if(graph.nodes.some(n=>n.id===id))return graph;
  return parseEvidenceGraph({...graph,nodes:[...graph.nodes,{id,kind:'PLAN_RELATION',label:String(p.campaignId)+' · PLAN 2-D ONLY',authority:p.authority,data:p}],edges:[...graph.edges,...(p.affectedFeatures as string[]).map(from=>({from,to:id,relationship:'REGISTERED_PLAN_CONTEXT'}))]});
}
/** Context relation alone changes no dimensional calculation; only consumed inputs
 * may make a result historical. This index explains potential, not invented impact. */
export function relationImpact(graph:SpatialEvidenceGraph,record:LiveRelation){
  const features=record.payload.affectedFeatures as string[],nodes=new Map(graph.nodes.map(n=>[n.id,n]));
  return features.map(id=>({featureId:id,status:nodes.has(id)?'UNAFFECTED':'UNVERIFIABLE',path:[id,String(nodes.get(id)?.data.frameId??'MISSING_FRAME'),String(record.payload.id)],reason:nodes.has(id)?'Scoped plan context added. Existing 3-D geometry, transforms and calculation dependencies are unchanged.':'Bound feature is absent; do not attach the relation to revised geometry.'}));
}
