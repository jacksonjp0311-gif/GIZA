import { appendEvidenceNodes, canonicalJson, parseEvidenceGraph } from './graph';
import type { JsonValue, SpatialEvidenceGraph } from './graph';
import type { InvestigationCandidate } from './intelligence';
import type { EvidenceFeature, RealityAuthority } from './types';

export interface ReceiptContext { version: string; commit: string; environment: string; createdAt: string }
export interface EvidenceReceipt {
  schema: 'giza.evidence-receipt.v1'; id: string; kind: 'EXPERIMENT' | 'FINDING' | 'PROMOTION'; sha256: string;
  payload: { context: ReceiptContext; assemblyId: string; frameId: string; authority: RealityAuthority; data: Record<string, JsonValue> };
}
export interface ResearchReview { reviewer: string; outcome: 'SUPPORTED' | 'FALSIFIED' | 'INCONCLUSIVE'; note: string }
const verifiedReceipts = new WeakSet<object>();

function plain(value: unknown): Record<string, JsonValue> { return JSON.parse(canonicalJson(value)) as Record<string, JsonValue>; }
function freeze<T>(value: T): T { if (value && typeof value === 'object') { for (const child of Object.values(value)) freeze(child); Object.freeze(value); } return value; }
function contextChecked(context: ReceiptContext): ReceiptContext {
  if (!context || ![context.version, context.commit, context.environment].every(s => typeof s === 'string' && s.trim().length > 0) || typeof context.createdAt !== 'string' || !Number.isFinite(Date.parse(context.createdAt))) throw new Error('Receipt requires version, commit (or explicit UNKNOWN), environment and timestamp');
  return { ...context };
}
function reviewChecked(value: unknown): ResearchReview {
  const review = value as ResearchReview;
  if (!review || typeof review.reviewer !== 'string' || !review.reviewer.trim() || typeof review.note !== 'string' || review.note.trim().length < 10 || !['SUPPORTED', 'FALSIFIED', 'INCONCLUSIVE'].includes(review.outcome)) throw new Error('Finding/promotion requires a named reviewer, outcome and substantive note');
  return review;
}
function promotionGates(feature: EvidenceFeature, target: RealityAuthority, graph: SpatialEvidenceGraph, review: ResearchReview) {
  if (!['OBSERVED', 'RECONSTRUCTED', 'HYPOTHESIS'].includes(target)) throw new Error('Unsupported requested authority');
  const node = graph.nodes.find(n => n.id === feature.id);
  if (!node || node.kind !== 'FEATURE' || node.authority !== feature.authority || canonicalJson(node.data) !== canonicalJson(feature)) throw new Error('Promotion feature differs from governed graph');
  return {
    explicitReview: review.outcome === 'SUPPORTED',
    featureEvidence: feature.observationIds.length > 0 && feature.observationIds.every(id => graph.nodes.some(n => n.id === id && n.kind === 'OBSERVATION' && n.data.value !== null && typeof n.data.locator === 'string' && n.data.locator !== 'UNKNOWN' && graph.nodes.some(s => s.id === n.data.sourceId && s.kind === 'SOURCE' && s.id !== 'source.unknown'))),
    declaredDerivation: feature.derivation.trim().length > 0,
    notUnknownGeometry: feature.geometry.kind !== 'unknown',
    targetSupportedByCurrentContract: target === 'RECONSTRUCTED' && feature.authority === 'HYPOTHESIS',
  };
}
export async function sha256Json(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalJson(value));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), v => v.toString(16).padStart(2, '0')).join('');
}
async function seal(kind: EvidenceReceipt['kind'], payload: EvidenceReceipt['payload']): Promise<EvidenceReceipt> {
  const sha256 = await sha256Json({ schema: 'giza.evidence-receipt.v1', kind, payload });
  const receipt: EvidenceReceipt = { schema: 'giza.evidence-receipt.v1', id: `receipt:${kind.toLowerCase()}:${sha256}`, kind, sha256, payload };
  verifiedReceipts.add(receipt);
  return freeze(receipt);
}

function reCompute(candidate: InvestigationCandidate, graph: SpatialEvidenceGraph): number | string | null {
  const byId = new Map(graph.nodes.map(node => [node.id, node]));
  if (!candidate.id || !candidate.falsification.test || !candidate.alternatives.length || !candidate.falsification.neededEvidence.length || candidate.status !== 'REVIEW_REQUIRED' || !['RECONSTRUCTED', 'HYPOTHESIS'].includes(candidate.authority)) throw new Error('Candidate lacks review/falsification metadata');
  for (const id of candidate.evidenceIds) if (!byId.has(id)) throw new Error(`Candidate evidence missing: ${id}`);
  for (const id of candidate.featureIds) if (byId.get(id)?.kind !== 'FEATURE') throw new Error(`Candidate feature missing: ${id}`);
  if (candidate.frameId !== graph.authoritativeFrameId) throw new Error('Candidate frame mismatch');
  switch (candidate.computation.method) {
    case 'DIRECT_DIFFERENCE': {
      if (candidate.computation.inputs.length !== 2) throw new Error('Difference needs exactly two inputs');
      const inputs = candidate.computation.inputs.map(input => {
        const node = byId.get(input.id);
        if (node?.kind !== 'OBSERVATION' || typeof node.data.value !== 'number' || node.data.value !== input.value || node.data.unit !== input.unit || input.unit !== candidate.computation.unit) throw new Error('Candidate input differs from graph observation');
        return node.data.value;
      });
      return inputs[0] - inputs[1];
    }
    case 'ASSEMBLY_CONSTRAINT_REVIEW': {
      const node = byId.get(candidate.id.replace('candidate.constraint:', ''));
      if (node?.kind !== 'CONSTRAINT') throw new Error('Constraint input missing');
      return node.data.value as number | null;
    }
    case 'LEGACY_DETAIL_AUDIT': {
      const node = byId.get(candidate.id.replace('candidate.transform:', ''));
      if (node?.kind !== 'CONSTRAINT') throw new Error('Transform audit missing');
      const a = node.data.legacyValue, b = node.data.detailValue;
      return typeof a === 'number' && typeof b === 'number' ? b - a : null;
    }
    case 'AUTHORITY_GATE_AUDIT': return graph.nodes.filter(n => n.kind === 'REGISTRATION' && n.data.status !== 'ENGINE_VERIFIED').length;
    default: throw new Error('Unsupported experiment computation');
  }
}

/** Freeze exact inputs and graph snapshot, rerun deterministic computation, retain UNKNOWN. */
export async function runCandidateExperiment(candidate: InvestigationCandidate, graphInput: SpatialEvidenceGraph, context: ReceiptContext): Promise<EvidenceReceipt> {
  const graph = parseEvidenceGraph(graphInput), result = reCompute(candidate, graph);
  if (typeof result === 'number' && typeof candidate.computation.result === 'number' ? Math.abs(result - candidate.computation.result) > 1e-10 : result !== candidate.computation.result) throw new Error('Candidate result changed; regenerate candidate from current evidence');
  return seal('EXPERIMENT', { context: contextChecked(context), assemblyId: graph.assemblyId, frameId: graph.authoritativeFrameId, authority: candidate.authority, data: plain({ candidate, graphSha256: await sha256Json(graph), graphSnapshot: graph, result, outcome: 'COMPUTATION_REPRODUCED_NOT_INDEPENDENTLY_CONFIRMED', metricAuthority: 'NONE', note: 'Reproducing source arithmetic is not an independent archaeological test. Candidate still requires review.' }) });
}

export async function verifyReceipt(value: unknown): Promise<EvidenceReceipt> {
  if (new TextEncoder().encode(canonicalJson(value)).length > 8_000_000) throw new Error('Receipt exceeds 8 MB');
  const receipt = JSON.parse(canonicalJson(value)) as EvidenceReceipt;
  if (receipt.schema !== 'giza.evidence-receipt.v1' || !['EXPERIMENT', 'FINDING', 'PROMOTION'].includes(receipt.kind) || !receipt.payload || !receipt.payload.data || typeof receipt.payload.data !== 'object' || Array.isArray(receipt.payload.data) || typeof receipt.payload.assemblyId !== 'string' || !receipt.payload.assemblyId || typeof receipt.payload.frameId !== 'string' || !receipt.payload.frameId || !['OBSERVED', 'RECONSTRUCTED', 'HYPOTHESIS'].includes(receipt.payload.authority)) throw new Error('Unsupported evidence receipt');
  contextChecked(receipt.payload.context);
  const expected = await sha256Json({ schema: receipt.schema, kind: receipt.kind, payload: receipt.payload });
  if (receipt.sha256 !== expected || receipt.id !== `receipt:${receipt.kind.toLowerCase()}:${expected}`) throw new Error('Receipt checksum mismatch');
  if (receipt.kind === 'EXPERIMENT') {
    const graph = parseEvidenceGraph(receipt.payload.data.graphSnapshot);
    if (await sha256Json(graph) !== receipt.payload.data.graphSha256 || graph.assemblyId !== receipt.payload.assemblyId || graph.authoritativeFrameId !== receipt.payload.frameId) throw new Error('Experiment graph/frame mismatch');
    const candidate = receipt.payload.data.candidate as unknown as InvestigationCandidate;
    if (receipt.payload.authority !== candidate.authority || receipt.payload.data.metricAuthority !== 'NONE' || receipt.payload.data.outcome !== 'COMPUTATION_REPRODUCED_NOT_INDEPENDENTLY_CONFIRMED') throw new Error('Experiment authority does not match its candidate');
    const result = reCompute(candidate, graph);
    if (result !== receipt.payload.data.result || result !== candidate.computation.result) throw new Error('Experiment no longer reproduces');
  } else if (receipt.kind === 'FINDING') {
    const data = receipt.payload.data;
    reviewChecked(data.review);
    if (receipt.payload.authority !== 'HYPOTHESIS' || data.geometryAuthority !== 'NONE' || data.classification !== 'OPERATOR_REVIEW_NOT_AUTHENTICATED') throw new Error('Finding cannot claim observed or metric authority');
    if (typeof data.experimentSha256 !== 'string' || !/^[a-f0-9]{64}$/.test(data.experimentSha256) || data.experimentReceiptId !== `receipt:experiment:${data.experimentSha256}` || typeof data.candidateId !== 'string' || !data.candidateId) throw new Error('Finding experiment reference is malformed');
  } else {
    const data = receipt.payload.data, graph = parseEvidenceGraph(data.graphSnapshot), review = reviewChecked(data.review);
    if (await sha256Json(graph) !== data.graphSha256 || graph.assemblyId !== receipt.payload.assemblyId || data.authoritativeFrameId !== graph.authoritativeFrameId) throw new Error('Promotion graph/frame mismatch');
    const feature = graph.nodes.find(n => n.id === data.featureId && n.kind === 'FEATURE')?.data as unknown as EvidenceFeature | undefined;
    if (!feature || feature.frameId !== receipt.payload.frameId || feature.authority !== receipt.payload.authority || data.previousAuthority !== feature.authority || data.mutatesCanonicalData !== false) throw new Error('Promotion feature/frame/authority mismatch');
    const gates = promotionGates(feature, data.requestedAuthority as RealityAuthority, graph, review), allowed = Object.values(gates).every(Boolean);
    if (canonicalJson(gates) !== canonicalJson(data.gates) || data.allowed !== allowed || data.resultingAuthority !== (allowed ? data.requestedAuthority : feature.authority)) throw new Error('Promotion gates do not reproduce');
  }
  verifiedReceipts.add(receipt);
  return freeze(receipt);
}

/** User review is a new immutable record, not evidence promotion or a historical rewrite. */
export async function reviewExperiment(experimentInput: EvidenceReceipt, review: ResearchReview, context: ReceiptContext): Promise<EvidenceReceipt> {
  const experiment = await verifyReceipt(experimentInput);
  if (experiment.kind !== 'EXPERIMENT') throw new Error('A finding must cite an experiment receipt');
  reviewChecked(review);
  return seal('FINDING', { context: contextChecked(context), assemblyId: experiment.payload.assemblyId, frameId: experiment.payload.frameId, authority: 'HYPOTHESIS', data: plain({ experimentReceiptId: experiment.id, experimentSha256: experiment.sha256, candidateId: (experiment.payload.data.candidate as Record<string, JsonValue>).id, review, classification: 'OPERATOR_REVIEW_NOT_AUTHENTICATED', geometryAuthority: 'NONE', note: 'A finding records an interpretation; neither a supportive review nor a content hash promotes geometry to observed.' }) });
}

/** Promotion requests are always receipted, including denied requests. Source data is never mutated. */
export async function createPromotionReceipt(feature: EvidenceFeature, target: RealityAuthority, graph: SpatialEvidenceGraph, review: ResearchReview, context: ReceiptContext): Promise<EvidenceReceipt> {
  reviewChecked(review);
  const gates = promotionGates(feature, target, graph, review);
  const allowed = Object.values(gates).every(Boolean);
  return seal('PROMOTION', { context: contextChecked(context), assemblyId: graph.assemblyId, frameId: feature.frameId, authority: feature.authority, data: plain({ featureId: feature.id, requestedAuthority: target, previousAuthority: feature.authority, allowed, gates, review, graphSha256: await sha256Json(graph), graphSnapshot: graph, authoritativeFrameId: graph.authoritativeFrameId, resultingAuthority: allowed ? target : feature.authority, mutatesCanonicalData: false, note: target === 'OBSERVED' ? 'DENIED: observed spatial authority needs authenticated source bytes, independent control/scale, holdouts, residuals and a direct feature observation; the current assembly has no such survey receipt.' : 'Receipt is a promotion proposal only; applying it requires a new reviewed assembly revision. Original evidence and geometry are unchanged.' }) });
}

export function graphWithReceipt(graph: SpatialEvidenceGraph, receipt: EvidenceReceipt): SpatialEvidenceGraph {
  if (!verifiedReceipts.has(receipt)) throw new Error('Verify imported receipt before adding it to the graph');
  if (graph.assemblyId !== receipt.payload.assemblyId) throw new Error('Receipt assembly mismatch');
  if (receipt.kind === 'PROMOTION' ? receipt.payload.data.authoritativeFrameId !== graph.authoritativeFrameId || !graph.nodes.some(n => n.id === receipt.payload.frameId && n.kind === 'FRAME') : receipt.payload.frameId !== graph.authoritativeFrameId) throw new Error('Receipt authoritative frame mismatch');
  const nodeId = `${receipt.kind.toLowerCase()}:${receipt.sha256}`;
  const links = [{ from: graph.assemblyId, to: nodeId, relationship: 'HAS_RESEARCH_RECORD' }, { from: nodeId, to: receipt.id, relationship: 'SEALED_BY' }];
  const cited = receipt.kind === 'FINDING' ? receipt.payload.data.experimentReceiptId : null;
  if (typeof cited === 'string') { const prior = graph.nodes.find(n => n.id === cited && n.kind === 'RECEIPT'); if (!prior || prior.data.kind !== 'EXPERIMENT' || prior.data.sha256 !== receipt.payload.data.experimentSha256 || prior.data.candidateId !== receipt.payload.data.candidateId) throw new Error('Finding requires its matching experiment receipt in the graph'); links.push({ from: nodeId, to: cited, relationship: 'REVIEWS_EXPERIMENT' }); }
  // Index sealed records, do not recursively copy complete graph snapshots twice per experiment.
  // The journal/export preserves the full immutable receipt and its replayable snapshot.
  const { graphSnapshot: _snapshot, ...recordData } = receipt.payload.data;
  return appendEvidenceNodes(graph, [{ id: nodeId, kind: receipt.kind === 'PROMOTION' ? 'CONSTRAINT' : receipt.kind, label: receipt.kind === 'EXPERIMENT' ? 'Reproducible investigation experiment' : receipt.kind === 'FINDING' ? 'Operator-reviewed finding' : 'Authority promotion gate', authority: receipt.payload.authority, data: plain(recordData) }, { id: receipt.id, kind: 'RECEIPT', label: 'SHA-256 receipt reference', authority: null, data: plain({ id: receipt.id, sha256: receipt.sha256, kind: receipt.kind, context: receipt.payload.context, assemblyId: receipt.payload.assemblyId, frameId: receipt.payload.frameId, candidateId: receipt.kind === 'EXPERIMENT' ? (receipt.payload.data.candidate as Record<string, JsonValue>).id : receipt.payload.data.candidateId ?? null, fullReceiptLocation: 'Append-only investigation journal / exported sealed receipt', snapshotEmbedded: false }) }], links);
}

/** Append-only journal. Import verifies all checksums; existing IDs can never be replaced. */
export async function appendReceipt(journal: readonly EvidenceReceipt[], receipt: EvidenceReceipt): Promise<readonly EvidenceReceipt[]> {
  if (journal.some(row => row.id === receipt.id)) throw new Error('Receipt already exists; immutable records cannot be overwritten');
  return parseReceiptJournal({ schema: 'giza.investigation-journal.v1', receipts: [...journal, receipt] });
}

export const MAX_JOURNAL_BYTES = 4_000_000;
export type ReceiptStorage = Pick<Storage, 'getItem' | 'setItem'>;
export interface ReceiptJournalLoad { state: 'READY' | 'UNREADABLE' | 'UNAVAILABLE'; receipts: readonly EvidenceReceipt[]; raw: string | null; baseline: string | null | undefined; message: string }
export type ReceiptJournalSave = { ok: true; baseline: string } | { ok: false; reason: 'CONFLICT' | 'UNAVAILABLE' | 'INVALID'; message: string };
export interface ReceiptJournalScope { assemblyId: string; frameId: string }

export async function parseReceiptJournal(value: unknown, expected?: ReceiptJournalScope): Promise<readonly EvidenceReceipt[]> {
  if (new TextEncoder().encode(canonicalJson(value)).length > MAX_JOURNAL_BYTES) throw new Error('Investigation journal exceeds 4 MB; export receipts separately');
  const row = value as { schema?: unknown; receipts?: unknown };
  if (!row || row.schema !== 'giza.investigation-journal.v1' || !Array.isArray(row.receipts) || row.receipts.length > 500) throw new Error('Unsupported investigation journal');
  const receipts = await Promise.all(row.receipts.map(verifyReceipt));
  if (new Set(receipts.map(r => r.id)).size !== receipts.length) throw new Error('Duplicate immutable journal receipt');
  const seen = new Map<string, EvidenceReceipt>();
  let scope = expected;
  for (const receipt of receipts) {
    const frameId = receipt.kind === 'PROMOTION' ? String(receipt.payload.data.authoritativeFrameId) : receipt.payload.frameId;
    scope ??= { assemblyId: receipt.payload.assemblyId, frameId };
    if (scope.assemblyId !== receipt.payload.assemblyId || scope.frameId !== frameId) throw new Error('Journal belongs to a different assembly or authoritative frame');
    if (receipt.kind === 'FINDING') {
      const experiment = seen.get(String(receipt.payload.data.experimentReceiptId));
      if (!experiment || experiment.kind !== 'EXPERIMENT' || experiment.sha256 !== receipt.payload.data.experimentSha256 || (experiment.payload.data.candidate as Record<string, JsonValue>).id !== receipt.payload.data.candidateId) throw new Error('Finding requires its matching experiment earlier in the journal');
    }
    seen.set(receipt.id, receipt);
  }
  return freeze(receipts);
}

/** Never repairs, clears or overwrites malformed persisted research. Export raw before recovery. */
export async function loadReceiptJournal(storage: ReceiptStorage | null | undefined, key: string, expected?: ReceiptJournalScope): Promise<ReceiptJournalLoad> {
  let raw: string | null = null;
  if (!storage) return { state: 'UNAVAILABLE', receipts: [], raw, baseline: undefined, message: 'Storage unavailable; export receipts before closing.' };
  try { raw = storage.getItem(key); }
  catch { return { state: 'UNAVAILABLE', receipts: [], raw, baseline: undefined, message: 'Stored research could not be read; saving paused.' }; }
  if (raw === null) return { state: 'READY', receipts: [], raw, baseline: null, message: '' };
  try {
    if (new TextEncoder().encode(raw).length > MAX_JOURNAL_BYTES) throw new Error('Size limit');
    const receipts = await parseReceiptJournal(JSON.parse(raw), expected);
    return { state: 'READY', receipts, raw, baseline: raw, message: '' };
  } catch { return { state: 'UNREADABLE', receipts: [], raw, baseline: undefined, message: 'Stored research is unreadable or fails checksum verification. Original content is preserved; saving paused. Export the raw copy before recovery.' }; }
}

/** Optimistic append-only storage; not a multi-tab transaction. Compare immediately before write. */
export async function saveReceiptJournal(storage: ReceiptStorage | null | undefined, key: string, baseline: string | null | undefined, next: readonly EvidenceReceipt[]): Promise<ReceiptJournalSave> {
  if (!storage || baseline === undefined) return { ok: false, reason: 'UNAVAILABLE', message: 'Saving paused; safely load the stored journal or export this draft.' };
  let serialized: string;
  try {
    const previous = baseline === null ? [] : await parseReceiptJournal(JSON.parse(baseline));
    const checked = await parseReceiptJournal({ schema: 'giza.investigation-journal.v1', receipts: [...next] });
    if (checked.length < previous.length || previous.some((receipt, i) => canonicalJson(receipt) !== canonicalJson(checked[i]))) throw new Error('Existing receipt deletion, replacement or reordering is forbidden');
    serialized = JSON.stringify({ schema: 'giza.investigation-journal.v1', receipts: checked });
  } catch (error) { return { ok: false, reason: 'INVALID', message: error instanceof Error ? error.message : 'Invalid journal; stored data unchanged.' }; }
  try {
    if (storage.getItem(key) !== baseline) return { ok: false, reason: 'CONFLICT', message: 'Another tab changed this journal. Export this draft and reload; no records overwritten.' };
    if (serialized !== baseline) storage.setItem(key, serialized);
    if (storage.getItem(key) !== serialized) return { ok: false, reason: 'CONFLICT', message: 'Journal verification found a concurrent change. Keep and export this draft.' };
    return { ok: true, baseline: serialized };
  } catch { return { ok: false, reason: 'UNAVAILABLE', message: 'Could not save/verify research (storage blocked or full). Export the current receipts; do not assume they were saved.' }; }
}
