import {canonicalJson,type SpatialEvidenceGraph} from './graph';
import {computationDependencies,EVALUATION_RULE} from './dependencies';
import {verifyReceipt,experimentApplicability,type EvidenceReceipt} from './receipts';
import {restoreInvestigation,measurementDependencies,investigationApplicability,type SavedInvestigation} from './investigations';
import type {EvidenceAssembly} from './types';
import type {InvestigationCandidate} from './intelligence';
export interface DependencyChange {path:string;original:unknown;current:unknown}
/** Stable structural diff; keyed collections use IDs rather than incidental array positions. */
export function dependencyChanges(original:unknown,current:unknown,path='inputs'):DependencyChange[]{
  if(canonicalJson(original??null)===canonicalJson(current??null))return [];
  const keyed=(v:unknown)=>Array.isArray(v)&&v.every(x=>x&&typeof x==='object'&&typeof x.id==='string');
  if(keyed(original)&&keyed(current)){const a=Object.fromEntries((original as {id:string}[]).map(x=>[x.id,x])),b=Object.fromEntries((current as {id:string}[]).map(x=>[x.id,x]));return dependencyChanges(a,b,path);}
  if(original&&current&&typeof original==='object'&&typeof current==='object'&&!Array.isArray(original)&&!Array.isArray(current)){
    const a=original as Record<string,unknown>,b=current as Record<string,unknown>;return [...new Set([...Object.keys(a),...Object.keys(b)])].sort().flatMap(k=>dependencyChanges(a[k],b[k],`${path}.${k}`));
  }
  return [{path,original:original??null,current:current??null}];
}
export interface InvestigationExplanation {status:string;reason:string;rule:string;frame:string;original:unknown;current:unknown;changes:DependencyChange[];featureIds:string[];result:unknown;uncertainty:unknown}
export async function explainSaved(record:SavedInvestigation,current:EvidenceAssembly):Promise<InvestigationExplanation>{
  const base={rule:record.payload.dependencyRule??'canonical-measurement.v1',frame:record.payload.draft.frameId,featureIds:record.payload.draft.points.flatMap(p=>p.featureId?[p.featureId]:[]),result:record.payload.result,uncertainty:record.payload.result.uncertainty};
  try{await restoreInvestigation(record);const original=measurementDependencies(record.payload.assemblySnapshot,record.payload.draft,base.rule),now=measurementDependencies(current,record.payload.draft,'canonical-measurement.v4'),changes=dependencyChanges(original,now),status=await investigationApplicability(record,current);
    return {...base,status,reason:status==='CURRENT'?'The archived result replays and every calculation dependency is unchanged. Camera, selection and unrelated labels are not dependencies.':status==='HISTORICAL'?'Relevant calculation inputs changed. The original result remains attached to its archived snapshot.':'A current point, feature or frame no longer satisfies membership/transform requirements. Inspect the differences; old points were not moved.',original,current:now,changes};
  }catch(error){return {...base,status:'UNVERIFIABLE',reason:String(error),original:null,current:null,changes:[]};}
}
export async function explainExperiment(record:EvidenceReceipt,candidate:InvestigationCandidate,graph:SpatialEvidenceGraph):Promise<InvestigationExplanation>{
  const base={rule:String(record.payload.data.evaluationRule??'UNRECORDED_V1'),frame:record.payload.frameId,featureIds:candidate.featureIds,result:record.payload.data.result,uncertainty:(record.payload.data.candidate as unknown as InvestigationCandidate)?.uncertainty??null};
  try{await verifyReceipt(record);if(record.schema==='giza.evidence-receipt.v1')return {...base,status:'UNVERIFIABLE',reason:'Historical v1 arithmetic replays, but this record did not capture a dependency rule/fingerprint. No metadata has been backfilled.',original:record.payload.data.candidate,current:null,changes:[]};
    const prior=record.payload.data.candidate as unknown as InvestigationCandidate,original=computationDependencies(prior,record.payload.data.graphSnapshot as unknown as SpatialEvidenceGraph,base.rule),current=computationDependencies(candidate,graph,EVALUATION_RULE),changes=dependencyChanges(original,current),status=await experimentApplicability(record,candidate,graph);
    return {...base,status,reason:status==='CURRENT'?'Matching rule and identified inputs; original computation replays.':'The listed inputs or evaluation rule changed. Run a new linked computation; do not replace the original.',original,current,changes};
  }catch(error){return {...base,status:'UNVERIFIABLE',reason:String(error),original:null,current:null,changes:[]};}
}
