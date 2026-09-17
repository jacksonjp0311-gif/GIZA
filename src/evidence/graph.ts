import type { EvidenceAssembly } from './types';
import {assertSafeDocument,validateObservation,validateFeatureSupport} from './observationContract';
import type {EvidenceFeature,EvidenceObservation} from './types';

export type EvidenceNodeKind = 'FEATURE' | 'OBSERVATION' | 'SOURCE' | 'SOURCE_BYTES' | 'REGISTRATION' | 'FRAME' | 'TRANSFORM' | 'UNCERTAINTY' | 'GEOMETRY' | 'ASSEMBLY' | 'CONSTRAINT' | 'EXPERIMENT' | 'FINDING' | 'RECEIPT';
export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
export interface EvidenceNode { id: string; kind: EvidenceNodeKind; label: string; authority: 'OBSERVED' | 'RECONSTRUCTED' | 'HYPOTHESIS' | null; data: Record<string, JsonValue> }
export interface EvidenceEdge { from: string; to: string; relationship: string }
export interface SpatialEvidenceGraph { schema: 'giza.spatial-evidence-graph.v1'; assemblyId: string; authoritativeFrameId: string; nodes: EvidenceNode[]; edges: EvidenceEdge[]; limitations: string[] }

const kinds: EvidenceNodeKind[] = ['FEATURE', 'OBSERVATION', 'SOURCE', 'SOURCE_BYTES', 'REGISTRATION', 'FRAME', 'TRANSFORM', 'UNCERTAINTY', 'GEOMETRY', 'ASSEMBLY', 'CONSTRAINT', 'EXPERIMENT', 'FINDING', 'RECEIPT'];
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
  const edge = (from: string, to: string, relationship: string) => edges.push({ from, to, relationship });
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
    add(transform.id, 'TRANSFORM', transform.id, 'RECONSTRUCTED', transform);
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
    add(`geometry:${feature.id}`, 'GEOMETRY', feature.label, feature.coordinateAuthority==='UNKNOWN'?null:feature.authority==='HYPOTHESIS'?'HYPOTHESIS':'RECONSTRUCTED', { geometry: feature.geometry, frameId: feature.frameId, coordinateAuthority:feature.coordinateAuthority, scalarAuthority:feature.authority, surfaceAuthority:feature.geometry.kind==='unknown'?'UNKNOWN':'RECONSTRUCTED', placementAuthority:'RECONSTRUCTED_OR_UNRESOLVED_SEE_TRANSFORMS', reviewStatus:'NOT_AUTHENTICATED', derivation: feature.derivation, unknowns: feature.unknowns });
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

export function parseEvidenceGraph(value: unknown): SpatialEvidenceGraph {
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
  for (const edge of graph.edges) if (!edge || !ids.has(edge.from) || !ids.has(edge.to) || typeof edge.relationship !== 'string' || !edge.relationship) throw new Error('Dangling evidence relationship');
  return graph;
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
    if(e.relationship==='CONSTRAINED_BY')return target.kind==='OBSERVATION';
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
