import {canonicalJson,parseEvidenceGraph} from './graph';
import type {SpatialEvidenceGraph} from './graph';
import type {InvestigationCandidate} from './intelligence';

export const EVALUATION_RULE='giza.comparison-rules.v3';
/** Minimal calculation inputs, not UI labels, graph-wide annotations or archival snapshot identity. */
export function computationDependencies(candidate:InvestigationCandidate,graph:SpatialEvidenceGraph,rule:string=EVALUATION_RULE){
  if(!['giza.comparison-rules.v2',EVALUATION_RULE].includes(rule))throw new Error('Unsupported calculation rule');
  parseEvidenceGraph(graph);
  const ids=new Set([...candidate.evidenceIds,...candidate.computation.inputs.map(i=>i.id)]);
  if(candidate.computation.method==='LEGACY_DETAIL_AUDIT')ids.add(candidate.id.replace('candidate.transform:',''));
  if(candidate.computation.method==='ASSEMBLY_CONSTRAINT_REVIEW')ids.add(candidate.id.replace('candidate.constraint:',''));
  // Follow only relevant object frames towards their declared parents. Unrelated
  // object transforms must not invalidate a result merely by sharing an assembly.
  if(['LEGACY_DETAIL_AUDIT','ASSEMBLY_CONSTRAINT_REVIEW'].includes(candidate.computation.method)){
    const frames=new Set([candidate.frameId]);
    for(const n of graph.nodes)if(n.kind==='FEATURE'&&candidate.featureIds.includes(n.id)&&typeof n.data.frameId==='string')frames.add(n.data.frameId);
    let changed=true;
    while(changed){changed=false;for(const n of graph.nodes)if(n.kind==='TRANSFORM'&&typeof n.data.from==='string'&&frames.has(n.data.from)){
      ids.add(n.id);if(typeof n.data.to==='string'&&!frames.has(n.data.to)){frames.add(n.data.to);changed=true;}
    }}
    for(const id of frames)ids.add(id);
    for(const n of graph.nodes)if(ids.has(n.id)&&Array.isArray(n.data.observationIds))for(const id of n.data.observationIds)if(typeof id==='string')ids.add(id);
  }
  if(rule===EVALUATION_RULE)for(const n of graph.nodes)if(ids.has(n.id)&&n.kind==='OBSERVATION'&&typeof n.data.sourceId==='string')ids.add(n.data.sourceId);
  const nodes=graph.nodes.filter(n=>ids.has(n.id)).map(n=>({id:n.id,kind:n.kind,authority:n.authority,data:n.data})).sort((a,b)=>a.id.localeCompare(b.id));
  return {schema:'giza.computation-dependencies.v1',rule,assemblyId:graph.assemblyId,frameId:candidate.frameId,method:candidate.computation.method,unit:candidate.computation.unit,inputs:candidate.computation.inputs,nodes};
}
export async function dependencyFingerprint(candidate:InvestigationCandidate,graph:SpatialEvidenceGraph,rule:string=EVALUATION_RULE):Promise<string>{
  const bytes=new TextEncoder().encode(canonicalJson(computationDependencies(candidate,graph,rule)));
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
}
