import {canonicalJson,type SpatialEvidenceGraph} from './graph';
import {explainExperiment,explainSaved,type InvestigationExplanation} from './explanation';
import type {EvidenceAssembly} from './types';
import type {EvidenceReceipt} from './receipts';
import type {SavedInvestigation} from './investigations';
import type {InvestigationCandidate} from './intelligence';
export const IMPACT_RULE='giza.evidence-impact.v1';
export interface ImpactRow {id:string;kind:'EXPERIMENT'|'SAVED_INVESTIGATION';status:'CURRENT'|'HISTORICAL'|'UNVERIFIABLE'|'UNAFFECTED';reason:string;paths:string[][];explanation:InvestigationExplanation|null}
/** Event relevance never substitutes for replay and exact dependency applicability. */
export async function analyzeEvidenceImpact(previous:SpatialEvidenceGraph,current:SpatialEvidenceGraph,assembly:EvidenceAssembly,candidates:InvestigationCandidate[],experiments:readonly EvidenceReceipt[],saved:readonly SavedInvestigation[]){
  const prior=new Map(previous.nodes.map(n=>[n.id,n]));
  const changedIds=new Set([...previous.nodes,...current.nodes].map(n=>n.id).filter(id=>{
    const a=prior.get(id),b=current.nodes.find(n=>n.id===id);
    // Display labels outside physical record data are intentionally excluded.
    return canonicalJson(a?{kind:a.kind,authority:a.authority,data:a.data}:null)!==canonicalJson(b?{kind:b.kind,authority:b.authority,data:b.data}:null);
  }));
  const paths=(e:InvestigationExplanation)=>{
    const all=e.changes.map(c=>c.path);
    const routes=(start:string,end:string)=>{
      const queue=[[start]],visited=new Set([start]);
      while(queue.length){const route=queue.shift()!,at=route[route.length-1];if(at===end)return route;
        for(const edge of current.edges){if(edge.from!==at||!['CONSTRAINED_BY','REPRESENTED_BY','EXPRESSED_IN','TRANSFORMS_BY','TARGET_FRAME','COMPUTED_FROM','CITES'].includes(edge.relationship)||visited.has(edge.to))continue;
          if(route.length>=20)continue;visited.add(edge.to);queue.push([...route,edge.to]);
        }
      }return [start,'dependency change',end];
    };
    return [...changedIds].sort().filter(id=>all.some(p=>p.includes(id))).flatMap(id=>e.featureIds.map(feature=>routes(feature,id)));
  };
  const row=(id:string,kind:ImpactRow['kind'],e:InvestigationExplanation):ImpactRow=>{
    const relevant=paths(e);
    return {id,kind,status:e.status==='CURRENT'?(changedIds.size&&relevant.length===0?'UNAFFECTED':'CURRENT'):e.status==='HISTORICAL'?'HISTORICAL':'UNVERIFIABLE',reason:e.status==='CURRENT'&&changedIds.size?'The archived computation replays with unchanged calculation inputs. This graph event changes context, not its physical dependencies.':e.reason,paths:relevant,explanation:e};
  };
  const rows:ImpactRow[]=[];
  for(const receipt of [...experiments].sort((a,b)=>a.id.localeCompare(b.id))){
    if(receipt.kind!=='EXPERIMENT')continue;
    const priorCandidate=receipt.payload.data.candidate as unknown as InvestigationCandidate;
    const candidate=candidates.find(c=>c.id===priorCandidate?.id);
    if(!candidate){rows.push({id:receipt.id,kind:'EXPERIMENT',status:'UNVERIFIABLE',reason:'The original candidate no longer has a supported current computation. Inspect the archived receipt.',paths:[],explanation:null});continue;}
    rows.push(row(receipt.id,'EXPERIMENT',await explainExperiment(receipt,candidate,current)));
  }
  for(const record of [...saved].sort((a,b)=>a.id.localeCompare(b.id)))rows.push(row(record.id,'SAVED_INVESTIGATION',await explainSaved(record,assembly)));
  const changedFrames=current.nodes.filter(n=>n.kind==='FRAME'&&changedIds.has(n.id)).map(n=>n.id);
  for(const t of current.nodes.filter(n=>n.kind==='TRANSFORM'&&changedIds.has(n.id)))for(const id of [t.data.from,t.data.to])if(typeof id==='string'&&!changedFrames.includes(id))changedFrames.push(id);
  const changedFeatures=current.nodes.filter(n=>n.kind==='FEATURE'&&(changedIds.has(n.id)||changedFrames.includes(String(n.data.frameId))||Array.isArray(n.data.observationIds)&&n.data.observationIds.some(id=>changedIds.has(String(id)))));
  const changedConstraints=current.nodes.filter(n=>n.kind==='CONSTRAINT'&&(changedIds.has(n.id)||Array.isArray(n.data.featureIds)&&n.data.featureIds.some(id=>changedFeatures.some(f=>f.id===id)))).map(n=>n.id);
  const affectedCandidates=candidates.filter(c=>changedIds.has(c.id)||c.evidenceIds.some(id=>changedIds.has(id))||c.featureIds.some(id=>changedFeatures.some(f=>f.id===id))||changedFrames.includes(c.frameId)||changedConstraints.some(id=>c.id==='candidate.constraint:'+id)).map(c=>c.id).sort();
  return {rule:IMPACT_RULE,changedIds:[...changedIds].sort(),affectedFrames:changedFrames.sort(),affectedFeatures:changedFeatures.map(f=>f.id).sort(),affectedConstraints:changedConstraints.sort(),affectedCandidates,rows};
}
