import type { EvidenceAssembly } from './types';
import {assertSafeDocument,validateObservation,validateFeatureSupport} from './observationContract';
import type {EvidenceFeature,EvidenceObservation} from './types';
import {importCanonicalAssembly} from './spatial';

export type EvidenceNodeKind = 'FEATURE' | 'OBSERVATION' | 'SOURCE' | 'SOURCE_BYTES' | 'REGISTRATION' | 'FRAME' | 'TRANSFORM' | 'UNCERTAINTY' | 'GEOMETRY' | 'ASSEMBLY' | 'CONSTRAINT' | 'EXPERIMENT' | 'FINDING' | 'RECEIPT' | 'PLAN_RELATION';
export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
export interface EvidenceNode { id: string; kind: EvidenceNodeKind; label: string; authority: 'OBSERVED' | 'RECONSTRUCTED' | 'HYPOTHESIS' | null; data: Record<string, JsonValue> }
const relationships=['CITES','HAS_UNCERTAINTY','HAS_CUSTODY_STATE','IMAGE_METRIC_AUTHORITY_STATE','REGISTRATION_REQUIRES_BYTES','COMPUTED_FROM','TRANSFORMS_BY','TARGET_FRAME','DECLARES_TRANSFORM','REPRESENTED_BY','EXPRESSED_IN','MEMBER_OF','CONSTRAINED_BY','HAS_CONSTRAINT','HAS_TRANSFORM_AUDIT','HAS_RESEARCH_RECORD','SEALED_BY','REVIEWS_EXPERIMENT','RELATED_CONTEXT','REGISTERED_PLAN_CONTEXT'] as const;
export type EvidenceRelationship=typeof relationships[number];
export interface EvidenceEdge { from: string; to: string; relationship: EvidenceRelationship }
export interface SpatialEvidenceGraph { schema: 'giza.spatial-evidence-graph.v1'; assemblyId: string; authoritativeFrameId: string; nodes: EvidenceNode[]; edges: EvidenceEdge[]; limitations: string[] }

const kinds: EvidenceNodeKind[] = ['FEATURE', 'OBSERVATION', 'SOURCE', 'SOURCE_BYTES', 'REGISTRATION', 'FRAME', 'TRANSFORM', 'UNCERTAINTY', 'GEOMETRY', 'ASSEMBLY', 'CONSTRAINT', 'EXPERIMENT', 'FINDING', 'RECEIPT', 'PLAN_RELATION'];
const safeKey = (s: string) => s !== '__proto__' && s !== 'constructor' && s !== 'prototype';

/** Stable, finite JSON only. Used for reproducible receipts, not archaeology authority. */
export function canonicalJson(value: unknown, depth = 0): string {
  if (depth > 40) throw new Error('Evidence JSON nesting exceeds 40 levels');
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(v => canonicalJson(v, depth + 1)).join(',')}]`;
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map(key => {
      if (!safeKey(key)) throw new Error('Unsafe evidence JSON key');
      return `${JSON.stringify(key)}:${canonicalJson(record[key], depth + 1)}`;
    }).join(',')}}`;
  }
  throw new Error('Evidence JSON must contain only finite JSON values');
}

function data(value: unknown): Record<string, JsonValue> {
  return JSON.parse(canonicalJson(value)) as Record<string, JsonValue>;
}

/** Graph includes explicit UNKNOWN custody/registration nodes; absence is not zero residual. */
export function buildEvidenceGraph(assembly: EvidenceAssembly): SpatialEvidenceGraph {
  const nodes: EvidenceNode[] = [], edges: EvidenceEdge[] = [];
  const add = (id: string, kind: EvidenceNodeKind, label: string, authority: EvidenceNode['authority'], value: unknown) => nodes.push({ id, kind, label, authority, data: data(value) });
  const edge = (from: string, to: string, relationship: EvidenceRelationship) => edges.push({ from, to, relationship });
  add(assembly.id, 'ASSEMBLY', assembly.title, 'RECONSTRUCTED', { authoritativeFrameId: assembly.authoritativeFrameId, limitations: assembly.limitations });
  for (const source of assembly.sources) {
    add(source.id, 'SOURCE', source.title, null, source);
    add(`bytes:${source.id}`, 'SOURCE_BYTES', 'Raw source custody · UNKNOWN', null, { sourceId: source.id, sha256: null, byteStatus: 'UNKNOWN', verification: 'NOT_REHASHED', note: 'Citation/transcript availability is not raw-byte verification.' });
    add(`registration:${source.id}`, 'REGISTRATION', 'Metric image registration · UNKNOWN', null, { sourceId: source.id, status: 'NO_ACCEPTED_ASSEMBLY_REGISTRATION', controls: null, holdouts: null, independentScale: null, residual: null, targetFrame: null, geometryAuthority: 'NONE', note: 'No registration has been inferred from a photograph, source text or an unrelated valley-temple campaign.' });
    edge(source.id, `bytes:${source.id}`, 'HAS_CUSTODY_STATE');
    edge(`bytes:${source.id}`, `registration:${source.id}`, 'REGISTRATION_REQUIRES_BYTES');
  }
  for (const observation of assembly.observations) {
    add(observation.id, 'OBSERVATION', observation.id, observation.authority, observation);
    add(`uncertainty:${observation.id}`, 'UNCERTAINTY', 'Observation uncertainty', null, observation.uncertainty);
    edge(observation.id, observation.sourceId, 'CITES');
    edge(observation.id, `uncertainty:${observation.id}`, 'HAS_UNCERTAINTY');
    edge(observation.id, `registration:${observation.sourceId}`, 'IMAGE_METRIC_AUTHORITY_STATE');
  }
  for (const frame of assembly.frames) add(frame.id, 'FRAME', frame.id, null, frame);
  for (const transform of assembly.transforms) {
    add(transform.id, 'TRANSFORM', transform.id, transform.authority, transform);
    add(`uncertainty:${transform.id}`, 'UNCERTAINTY', 'Transform uncertainty', null, transform.uncertainty);
    edge(transform.id, `uncertainty:${transform.id}`, 'HAS_UNCERTAINTY');
    for (const id of transform.observationIds) edge(transform.id, id, 'COMPUTED_FROM');
    const record = transform as unknown as Record<string, unknown>;
    const from = record.fromFrameId ?? record.from, to = record.toFrameId ?? record.to;
    if (typeof from === 'string') edge(from, transform.id, 'TRANSFORMS_BY');
    if (typeof to === 'string') edge(transform.id, to, 'TARGET_FRAME');
    edge(assembly.id, transform.id, 'DECLARES_TRANSFORM');
  }
  for (const feature of assembly.features) {
    add(feature.id, 'FEATURE', feature.label, feature.authority, feature);
    const geometryAuthority=feature.coordinateAuthority==='UNKNOWN'?null:feature.authority==='HYPOTHESIS'?'HYPOTHESIS':'RECONSTRUCTED';
    add(`geometry:${feature.id}`, 'GEOMETRY', feature.label, geometryAuthority, { geometry: feature.geometry, frameId: feature.frameId, coordinateAuthority:feature.coordinateAuthority, scalarAuthority:feature.authority, surfaceAuthority:feature.geometry.kind==='unknown'?'UNKNOWN':geometryAuthority, placementAuthority:'RECONSTRUCTED_OR_UNRESOLVED_SEE_TRANSFORMS', reviewStatus:'NOT_AUTHENTICATED', derivation: feature.derivation, unknowns: feature.unknowns });
    add(`uncertainty:${feature.id}`, 'UNCERTAINTY', 'Feature uncertainty', null, feature.uncertainty);
    edge(feature.id, `geometry:${feature.id}`, 'REPRESENTED_BY');
    edge(feature.id, `uncertainty:${feature.id}`, 'HAS_UNCERTAINTY');
    edge(`geometry:${feature.id}`, feature.frameId, 'EXPRESSED_IN');
    edge(`geometry:${feature.id}`, assembly.id, 'MEMBER_OF');
    for (const id of feature.observationIds) edge(feature.id, id, 'CONSTRAINED_BY');
  }
  for (const constraint of assembly.constraints) {
    add(constraint.id, 'CONSTRAINT', constraint.id, 'RECONSTRUCTED', constraint);
    edge(assembly.id, constraint.id, 'HAS_CONSTRAINT');
    for (const id of constraint.featureIds) edge(id, constraint.id, 'CONSTRAINED_BY');
    for (const id of constraint.observationIds) edge(constraint.id, id, 'COMPUTED_FROM');
  }
  for (const audit of assembly.audit) {
    add(audit.id, 'CONSTRAINT', audit.label, 'RECONSTRUCTED', audit);
    edge(assembly.id, audit.id, 'HAS_TRANSFORM_AUDIT');
    for (const id of audit.observationIds) edge(audit.id, id, 'COMPUTED_FROM');
  }
  const graph: SpatialEvidenceGraph = { schema: 'giza.spatial-evidence-graph.v1', assemblyId: assembly.id, authoritativeFrameId: assembly.authoritativeFrameId, nodes: nodes.sort((a, b) => a.id.localeCompare(b.id)), edges: edges.sort((a, b) => `${a.from}:${a.relationship}:${a.to}`.localeCompare(`${b.from}:${b.relationship}:${b.to}`)), limitations: [...assembly.limitations] };
  return parseEvidenceGraph(graph);
}

export function parseEvidenceGraph(value: unknown,contract:'CURRENT'|'HISTORICAL_V1'='CURRENT'): SpatialEvidenceGraph {
  assertSafeDocument(value,5_000_000);
  const serialized = canonicalJson(value);
  if (new TextEncoder().encode(serialized).length > 5_000_000) throw new Error('Evidence graph exceeds 5 MB');
  const graph = JSON.parse(serialized) as SpatialEvidenceGraph;
  if (graph.schema !== 'giza.spatial-evidence-graph.v1' || !Array.isArray(graph.nodes) || graph.nodes.length > 20000 || !Array.isArray(graph.edges) || graph.edges.length > 100000 || !Array.isArray(graph.limitations) || !graph.limitations.every(s => typeof s === 'string')) throw new Error('Unsupported evidence graph');
  const ids = new Set<string>();
  for (const node of graph.nodes) {
    if (!node || typeof node.id !== 'string' || !node.id || ids.has(node.id) || !kinds.includes(node.kind) || typeof node.label !== 'string' || ![null, 'OBSERVED', 'RECONSTRUCTED', 'HYPOTHESIS'].includes(node.authority) || !node.data || Array.isArray(node.data) || typeof node.data !== 'object') throw new Error('Invalid or duplicate evidence node');
    ids.add(node.id);
  }
  if (!ids.has(graph.assemblyId) || !ids.has(graph.authoritativeFrameId)) throw new Error('Graph lacks assembly/frame identity');
  const sources=new Set(graph.nodes.filter(n=>n.kind==='SOURCE').map(n=>n.id));
  for(const node of graph.nodes)if(node.kind==='OBSERVATION'){validateObservation(node.data,sources);if(node.id!==node.data.id||node.authority!==node.data.authority)throw new Error('Observation graph identity/authority mismatch');}
  for(const node of graph.nodes)if(node.kind==='FEATURE')validateFeatureSupport(node.data as unknown as EvidenceFeature,graph.nodes.filter(n=>n.kind==='OBSERVATION').map(n=>n.data as unknown as EvidenceObservation));
  for (const edge of graph.edges) if (!edge || !ids.has(edge.from) || !ids.has(edge.to) || !relationships.includes(edge.relationship)) throw new Error('Dangling or unsupported evidence relationship');
  if(contract==='CURRENT')validateGraphSemantics(graph);
  return graph;
}

/** Historical inspection does not authorize current calculations or repair old bytes. */
export function inspectHistoricalGraph(value:unknown){
  const graph=parseEvidenceGraph(value,'HISTORICAL_V1');
  try{validateGraphSemantics(graph);return {graph,currentEligible:true,reason:'Current internal consistency satisfied; authenticity is not established.'};}
  catch(error){return {graph,currentEligible:false,reason:String(error)};}
}
function validateGraphSemantics(g:SpatialEvidenceGraph){
  const byId=new Map(g.nodes.map(n=>[n.id,n]));
  const requireKind=(id:unknown,kind:EvidenceNodeKind)=>{if(typeof id!=='string'||byId.get(id)?.kind!==kind)throw new Error(`Expected ${kind} reference: ${String(id)}`);};
  requireKind(g.assemblyId,'ASSEMBLY');requireKind(g.authoritativeFrameId,'FRAME');
  if(byId.get(g.assemblyId)!.data.authoritativeFrameId!==g.authoritativeFrameId)throw new Error('Assembly frame identity mismatch');
  const endpointKinds:Record<Exclude<EvidenceRelationship,'RELATED_CONTEXT'>,[EvidenceNodeKind[],EvidenceNodeKind[]]>={
    REGISTERED_PLAN_CONTEXT:[['FEATURE'],['PLAN_RELATION']],CITES:[['OBSERVATION'],['SOURCE']],HAS_UNCERTAINTY:[['OBSERVATION','FEATURE','TRANSFORM'],['UNCERTAINTY']],HAS_CUSTODY_STATE:[['SOURCE'],['SOURCE_BYTES']],IMAGE_METRIC_AUTHORITY_STATE:[['OBSERVATION'],['REGISTRATION']],REGISTRATION_REQUIRES_BYTES:[['SOURCE_BYTES'],['REGISTRATION']],COMPUTED_FROM:[['TRANSFORM','CONSTRAINT'],['OBSERVATION']],TRANSFORMS_BY:[['FRAME'],['TRANSFORM']],TARGET_FRAME:[['TRANSFORM'],['FRAME']],DECLARES_TRANSFORM:[['ASSEMBLY'],['TRANSFORM']],REPRESENTED_BY:[['FEATURE'],['GEOMETRY']],EXPRESSED_IN:[['GEOMETRY'],['FRAME']],MEMBER_OF:[['GEOMETRY'],['ASSEMBLY']],CONSTRAINED_BY:[['FEATURE'],['OBSERVATION','CONSTRAINT']],HAS_CONSTRAINT:[['ASSEMBLY'],['CONSTRAINT']],HAS_TRANSFORM_AUDIT:[['ASSEMBLY'],['CONSTRAINT']],HAS_RESEARCH_RECORD:[['ASSEMBLY'],['EXPERIMENT','FINDING']],SEALED_BY:[['EXPERIMENT','FINDING'],['RECEIPT']],REVIEWS_EXPERIMENT:[['FINDING'],['RECEIPT']]};
  endpointKinds.HAS_RESEARCH_RECORD[1].push('CONSTRAINT');endpointKinds.SEALED_BY[0].push('CONSTRAINT');
  const seen=new Set<string>();
  for(const e of g.edges){const key=canonicalJson(e);if(seen.has(key))throw new Error('Duplicate graph relationship');seen.add(key);if(e.relationship==='RELATED_CONTEXT')continue;const [from,to]=endpointKinds[e.relationship];if(!from.includes(byId.get(e.from)!.kind)||!to.includes(byId.get(e.to)!.kind))throw new Error(`Wrong-kind endpoints: ${e.relationship}`);}
  const exact=(id:string,relationship:EvidenceRelationship,expected:string[],targetKind?:EvidenceNodeKind)=>{const actual=g.edges.filter(e=>e.from===id&&e.relationship===relationship&&(!targetKind||byId.get(e.to)?.kind===targetKind)).map(e=>e.to).sort();if(new Set(expected).size!==expected.length||canonicalJson(actual)!==canonicalJson([...expected].sort()))throw new Error(`Declared bindings disagree with ${relationship}: ${id}`);};
  const research=new Set(g.edges.filter(e=>e.relationship==='HAS_RESEARCH_RECORD').map(e=>e.to));
  const records=(kind:EvidenceNodeKind)=>g.nodes.filter(n=>n.kind===kind&&!research.has(n.id)).map(n=>n.data);
  // Reuse the assembly contract for feature geometry, frames, transform cycles and references.
  importCanonicalAssembly({schemaVersion:'giza.evidence-assembly.v1',id:g.assemblyId,title:byId.get(g.assemblyId)!.label,authoritativeFrameId:g.authoritativeFrameId,frames:records('FRAME'),transforms:records('TRANSFORM'),sources:records('SOURCE'),observations:records('OBSERVATION'),features:records('FEATURE'),constraints:records('CONSTRAINT').filter(d=>Array.isArray(d.featureIds)),audit:records('CONSTRAINT').filter(d=>!Array.isArray(d.featureIds)),limitations:g.limitations});
  for(const n of g.nodes){
    if(research.has(n.id)){
      const seals=g.edges.filter(e=>e.from===n.id&&e.relationship==='SEALED_BY');if(seals.length!==1)throw new Error('Research index requires one receipt');const receipt=byId.get(seals[0].to)!;
      if(n.kind==='CONSTRAINT'&&(receipt.data.kind!=='PROMOTION'||n.data.mutatesCanonicalData!==false||typeof n.data.featureId!=='string'))throw new Error('Research constraint must be a non-mutating promotion index');
      continue;
    }
    if(['FEATURE','OBSERVATION','SOURCE','FRAME','TRANSFORM','CONSTRAINT'].includes(n.kind)&&n.data.id!==n.id)throw new Error('Node identity differs from record identity');
    if(n.kind==='OBSERVATION'){exact(n.id,'CITES',[n.data.sourceId as string]);exact(n.id,'IMAGE_METRIC_AUTHORITY_STATE',[`registration:${n.data.sourceId}`]);}
    if(['OBSERVATION','FEATURE','TRANSFORM'].includes(n.kind)){const id=`uncertainty:${n.id}`;exact(n.id,'HAS_UNCERTAINTY',[id]);if(canonicalJson(byId.get(id)?.data)!==canonicalJson(n.data.uncertainty))throw new Error('Uncertainty node contradicts owner');}
    if(n.kind==='FEATURE'){
      const f=n.data as unknown as EvidenceFeature;if(n.authority!==f.authority)throw new Error('Feature node authority differs');
      exact(n.id,'CONSTRAINED_BY',f.observationIds,'OBSERVATION');exact(n.id,'REPRESENTED_BY',[`geometry:${n.id}`]);
    }
    if(n.kind==='GEOMETRY'){
      const owner=g.edges.filter(e=>e.to===n.id&&e.relationship==='REPRESENTED_BY');if(owner.length!==1)throw new Error('Geometry requires exactly one owning feature');
      const f=byId.get(owner[0].from)!.data as unknown as EvidenceFeature;
      const authority=f.coordinateAuthority==='UNKNOWN'?null:f.authority==='HYPOTHESIS'?'HYPOTHESIS':'RECONSTRUCTED';
      if(n.authority!==authority||n.data.coordinateAuthority!==f.coordinateAuthority||n.data.scalarAuthority!==f.authority||n.data.surfaceAuthority!==(f.geometry.kind==='unknown'?'UNKNOWN':authority)||n.data.frameId!==f.frameId||canonicalJson(n.data.geometry)!==canonicalJson(f.geometry))throw new Error('Geometry authority/frame/representation contradicts its feature');
      exact(n.id,'EXPRESSED_IN',[f.frameId]);exact(n.id,'MEMBER_OF',[g.assemblyId]);
    }
    if(n.kind==='TRANSFORM'){if(n.authority!==n.data.authority)throw new Error('Transform wrapper/record authority mismatch');exact(n.id,'COMPUTED_FROM',n.data.observationIds as string[]);exact(n.id,'TARGET_FRAME',[n.data.to as string]);const origins=g.edges.filter(e=>e.to===n.id&&e.relationship==='TRANSFORMS_BY');if(origins.length!==1||origins[0].from!==n.data.from)throw new Error('Transform origin mismatch');}
    if(n.kind==='CONSTRAINT'){exact(n.id,'COMPUTED_FROM',n.data.observationIds as string[]);if(Array.isArray(n.data.featureIds)){const incoming=g.edges.filter(e=>e.to===n.id&&e.relationship==='CONSTRAINED_BY').map(e=>e.from).sort();if(canonicalJson(incoming)!==canonicalJson([...n.data.featureIds].sort()))throw new Error('Constraint feature ownership mismatch');}}
    if(n.kind==='SOURCE_BYTES'||n.kind==='REGISTRATION'){requireKind(n.data.sourceId,'SOURCE');if(n.id!==`${n.kind==='SOURCE_BYTES'?'bytes':'registration'}:${n.data.sourceId}`)throw new Error('Source custody/registration ownership mismatch');}
    if(n.kind==='REGISTRATION'&&(n.data.status!=='NO_ACCEPTED_ASSEMBLY_REGISTRATION'||n.data.geometryAuthority!=='NONE'||n.data.passed===true||n.authority!==null||(n.data.verificationState!==undefined&&!['IMPORTED_CLAIM','NO_REGISTRATION'].includes(String(n.data.verificationState)))))throw new Error('Imported registration verification claim is not local replay verification; use the scoped campaign bridge');
    if(n.kind==='PLAN_RELATION'){
      const d=n.data;if(d.schema!=='giza.live-plan-relation.v1'||d.dimensionalScope!=='PLAN_2D_ONLY'||d.assemblyId!==g.assemblyId||d.physical3DPlacement!=='UNRESOLVED'||n.authority!==d.authority||!Array.isArray(d.affectedFeatures)||!['SYNTHETIC_SOFTWARE_QA','DOCUMENTARY_CONSISTENCY','INDEPENDENT_CONTROLLED'].includes(String(d.classification)))throw new Error('Invalid scoped plan relation');
      if(d.classification==='SYNTHETIC_SOFTWARE_QA'&&n.authority!=='HYPOTHESIS')throw new Error('Synthetic relation cannot gain archaeological authority');
      if(d.classification!=='SYNTHETIC_SOFTWARE_QA'&&n.authority!=='RECONSTRUCTED')throw new Error('A fitted plan relation is reconstructed, not an observed surface');
      if(typeof d.revisionId!=='string'||!/^revision:[a-f0-9]{64}$/.test(d.revisionId)||n.id!=='plan-relation:'+d.revisionId.slice(9)||d.id!==n.id||d.from!=='SOURCE_RENDER_PIXELS'||typeof d.targetFrame!=='string'||!d.targetFrame.trim()||d.targetFrame===g.authoritativeFrameId||d.fitRule!=='SHARED_SIMILARITY_2D')throw new Error('Invalid plan relation identity or dimensional frame');
      for(const key of ['sourceIdentity','custody','controls','holdouts'])if(!Array.isArray(d[key])||!(d[key] as JsonValue[]).length)throw new Error('Incomplete plan relation chain: '+key);
      for(const key of ['rule','fit','frozenInput','independentScale','reviewReceipt','rollbackLink','replay'])if(!d[key]||typeof d[key]!=='object'||Array.isArray(d[key]))throw new Error('Incomplete plan relation chain: '+key);
      for(const id of d.affectedFeatures)requireKind(id,'FEATURE');
      for(const key of ['assemblySha256','sourceSha256','renderSha256','freezeSha256','numericalResultSha256'])if(typeof d[key]!=='string'||!/^[a-f0-9]{64}$/.test(d[key] as string))throw new Error('Missing plan relation custody identity');
      const incoming=g.edges.filter(e=>e.relationship==='REGISTERED_PLAN_CONTEXT'&&e.to===n.id).map(e=>e.from).sort();if(canonicalJson(incoming)!==canonicalJson([...d.affectedFeatures].sort()))throw new Error('Plan feature bindings disagree');
    }
    if(n.kind==='SOURCE')exact(n.id,'HAS_CUSTODY_STATE',[`bytes:${n.id}`]);
    if(n.kind==='SOURCE_BYTES')exact(n.id,'REGISTRATION_REQUIRES_BYTES',[`registration:${n.data.sourceId}`]);
  }
}

/** Directed by default: a feature does not inherit a neighbouring feature's evidence. */
export type EvidenceQueryPurpose='DIRECT_SUPPORT'|'DERIVED_DEPENDENCIES'|'PLACEMENT'|'RELATED_CONTEXT';
export function traverseEvidence(graph: SpatialEvidenceGraph, startId: string, maxDepth = 8, purpose:EvidenceQueryPurpose='DIRECT_SUPPORT'): { nodes: EvidenceNode[]; edges: EvidenceEdge[] } {
  if (!graph.nodes.some(n => n.id === startId)) return { nodes: [], edges: [] };
  if (!Number.isInteger(maxDepth) || maxDepth < 0 || maxDepth > 40) throw new Error('Invalid traversal depth');
  const visited = new Set([startId]); let frontier = [startId];
  const byId=new Map(graph.nodes.map(n=>[n.id,n]));
  const allowed=(e:EvidenceEdge)=>{
    if(purpose==='RELATED_CONTEXT')return true;
    const target=byId.get(e.to)!;
    if(['CITES','HAS_UNCERTAINTY','HAS_CUSTODY_STATE','IMAGE_METRIC_AUTHORITY_STATE','REGISTRATION_REQUIRES_BYTES'].includes(e.relationship))return true;
    if(e.relationship==='CONSTRAINED_BY')return target.kind==='OBSERVATION'||(purpose==='DERIVED_DEPENDENCIES'&&target.kind==='CONSTRAINT'&&Array.isArray(target.data.featureIds)&&target.data.featureIds.includes(e.from));
    if(purpose!=='DIRECT_SUPPORT'&&e.relationship==='COMPUTED_FROM')return true;
    return purpose==='PLACEMENT'&&(['REPRESENTED_BY','EXPRESSED_IN','TARGET_FRAME'].includes(e.relationship)||(e.relationship==='TRANSFORMS_BY'&&target.data.scope==='AUTHORITATIVE_RECONSTRUCTION'));
  };
  for (let depth = 0; depth < maxDepth && frontier.length; depth++) {
    const next: string[] = [];
    for (const id of frontier) for (const edge of graph.edges) if (edge.from === id && allowed(edge) && !visited.has(edge.to)) { visited.add(edge.to); next.push(edge.to); }
    frontier = next;
  }
  return { nodes: graph.nodes.filter(n => visited.has(n.id)), edges: graph.edges.filter(e => allowed(e)&&visited.has(e.from) && visited.has(e.to)) };
}

/** Append-only graph extension; collisions are errors, never replacements. */
export function appendEvidenceNodes(graph: SpatialEvidenceGraph, nodes: EvidenceNode[], edges: EvidenceEdge[]): SpatialEvidenceGraph {
  return parseEvidenceGraph({ ...graph, nodes: [...graph.nodes, ...nodes], edges: [...graph.edges, ...edges] });
}
