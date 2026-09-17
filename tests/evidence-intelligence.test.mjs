import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const compiled = new Map();
function moduleUrl(name) {
  const full = path.join(root, 'src/evidence', `${name}.ts`);
  if (compiled.has(full)) return compiled.get(full);
  let source = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  source = source.replace(/from ['"]\.\/([^'"]+)['"]/g, (_, dependency) => `from '${moduleUrl(dependency)}'`);
  const url = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  compiled.set(full, url); return url;
}
const { buildKhafreAssembly } = await import(moduleUrl('assembly'));
const { buildEvidenceGraph, traverseEvidence, parseEvidenceGraph, canonicalJson } = await import(moduleUrl('graph'));
const { generateInvestigationCandidates } = await import(moduleUrl('intelligence'));
const { runCandidateExperiment, reviewExperiment, verifyReceipt, createPromotionReceipt, graphWithReceipt, appendReceipt, sha256Json, loadReceiptJournal, saveReceiptJournal, parseReceiptJournal } = await import(moduleUrl('receipts'));
const { parseRegistrationComparison, unavailableRegistration, loadRegistrationComparison } = await import(moduleUrl('registration'));
const json = file => JSON.parse(fs.readFileSync(path.join(root, 'public/model', file), 'utf8'));
const model = { parts: json('parts.json').parts, measurements: json('research/measurements.json').measurements, componentResearch: json('component_research.json'), sourceRegistry: json('evidence/source_registry.json').sources };
const assembly = buildKhafreAssembly(model), graph = buildEvidenceGraph(assembly), candidates = generateInvestigationCandidates(assembly, graph);
const context = { version: 'test-fixture', commit: 'SYNTHETIC_TEST_NOT_A_RELEASE', environment: `node ${process.version}`, createdAt: '2026-09-17T00:00:00.000Z' };
const clone = value => JSON.parse(JSON.stringify(value));
const reseal = async value => {
  const receipt = clone(value);
  receipt.sha256 = await sha256Json({ schema: receipt.schema, kind: receipt.kind, payload: receipt.payload });
  receipt.id = `receipt:${receipt.kind.toLowerCase()}:${receipt.sha256}`;
  return receipt;
};

test('feature evidence graph reaches exact observation, locator, source and explicit unknown custody', () => {
  const feature = assembly.features.find(f => f.id === 'feature.dimension.m.coffer.outer_length');
  const direct = graph.edges.filter(e => e.from === feature.id && e.relationship === 'CONSTRAINED_BY');
  assert.deepEqual(direct.map(e => e.to), ['m.coffer.outer_length']);
  const traversed = traverseEvidence(graph, feature.id);
  assert.ok(traversed.nodes.some(n => n.kind === 'OBSERVATION' && n.id === 'm.coffer.outer_length' && n.data.locator));
  assert.ok(traversed.nodes.some(n => n.kind === 'SOURCE' && n.id === 'src.petrie1883'));
  assert.ok(traversed.nodes.some(n => n.kind === 'SOURCE_BYTES' && n.data.sha256 === null && n.data.verification === 'NOT_REHASHED'));
  assert.ok(traversed.nodes.some(n => n.kind === 'REGISTRATION' && n.data.residual === null));
  assert.ok(!traversed.nodes.some(n => n.kind === 'TRANSFORM'));
  assert.ok(traverseEvidence(graph,feature.id,8,'PLACEMENT').nodes.some(n=>n.kind==='TRANSFORM'));
  assert.ok(traversed.nodes.some(n => n.kind === 'UNCERTAINTY'));
});

test('graph trust boundary rejects dangling relations, duplicates, nonfinite data and prototype keys', () => {
  const dangling = clone(graph); dangling.edges.push({ from: 'unknown', to: graph.assemblyId, relationship: 'bad' });
  assert.throws(() => parseEvidenceGraph(dangling), /Dangling/);
  const duplicate = clone(graph); duplicate.nodes.push(duplicate.nodes[0]);
  assert.throws(() => parseEvidenceGraph(duplicate), /duplicate/);
  assert.throws(() => canonicalJson({ value: NaN }), /finite/);
  assert.throws(() => canonicalJson(JSON.parse('{"__proto__":{}}')), /Unsafe/);
  assert.deepEqual(traverseEvidence(graph, 'not-present'), { nodes: [], edges: [] });
});

test('candidates are deterministic and carry evidence, computation, alternatives, falsifiers and authority', () => {
  assert.deepEqual(candidates, generateInvestigationCandidates(assembly, graph));
  assert.ok(candidates.length >= 10);
  for (const candidate of candidates) {
    assert.equal(candidate.status, 'REVIEW_REQUIRED');
    assert.ok(candidate.detected && candidate.computation.method && candidate.computation.expression);
    assert.ok(candidate.alternatives.length && candidate.falsification.test && candidate.falsification.neededEvidence.length);
    assert.ok(['RECONSTRUCTED', 'HYPOTHESIS'].includes(candidate.authority));
    for (const id of candidate.evidenceIds) assert.ok(graph.nodes.some(node => node.id === id), id);
    assert.equal(candidate.frameId, graph.authoritativeFrameId);
  }
});

test('lid fit is a scalar compatibility candidate, not observed clearance or statistical discovery', () => {
  const length = candidates.find(c => c.id === 'candidate.coffer.lid-length-fit');
  assert.ok(Math.abs(length.computation.result - 0.00127) < 1e-10);
  assert.equal(length.uncertainty.status, 'KNOWN');
  assert.ok(Math.abs(length.uncertainty.value - 0.001016) < 1e-10);
  const width = candidates.find(c => c.id === 'candidate.coffer.lid-width-fit');
  assert.equal(width.uncertainty.status, 'UNKNOWN');
  assert.equal(width.uncertainty.value, null);
  assert.match(width.detected, /not an observed edge clearance/);
  assert.equal(candidates.find(c => c.id === 'candidate.constraint:constraint.lid.fit').computation.result, null);
});

test('missing optional observations remain UNKNOWN and graph/candidates still load', () => {
  const partial = buildKhafreAssembly({ ...model, componentResearch: { ...model.componentResearch, observations: [] } });
  const partialGraph = buildEvidenceGraph(partial);
  assert.ok(partialGraph.nodes.some(n => n.kind === 'OBSERVATION' && n.data.value === null));
  assert.ok(generateInvestigationCandidates(partial, partialGraph).length > 0);
});

test('every candidate computation reproduces into an immutable versioned content-hashed receipt', async () => {
  for (const candidate of candidates) {
    const before = canonicalJson(graph), receipt = await runCandidateExperiment(candidate, graph, context);
    assert.equal(receipt.kind, 'EXPERIMENT');
    assert.match(receipt.sha256, /^[a-f0-9]{64}$/);
    assert.equal(receipt.payload.context.commit, context.commit);
    assert.equal(receipt.payload.data.result, candidate.computation.result);
    assert.equal(canonicalJson(graph), before);
    assert.ok(Object.isFrozen(receipt.payload.data));
    assert.equal((await verifyReceipt(JSON.parse(JSON.stringify(receipt)))).id, receipt.id);
  }
});

test('tampered candidate, receipt, input graph and wrong declared frame fail closed', async () => {
  const candidate = candidates.find(c => c.id === 'candidate.coffer.lid-length-fit');
  await assert.rejects(runCandidateExperiment({ ...candidate, computation: { ...candidate.computation, result: 999 } }, graph, context), /result changed/);
  await assert.rejects(runCandidateExperiment({ ...candidate, frameId: 'world' }, graph, context), /frame/);
  const receipt = clone(await runCandidateExperiment(candidate, graph, context));
  receipt.payload.data.result = 999;
  await assert.rejects(verifyReceipt(receipt), /checksum/);
  const changed = clone(graph); changed.nodes.find(n => n.id === candidate.evidenceIds[0]).data.value = 8;
  await assert.rejects(runCandidateExperiment(candidate, changed, context), /input differs/);
});

test('review produces an append-only nonauthoritative finding and traversable graph records', async () => {
  const experiment = await runCandidateExperiment(candidates[0], graph, context);
  const original = canonicalJson(experiment);
  const finding = await reviewExperiment(experiment, { reviewer: 'Synthetic test reviewer', outcome: 'INCONCLUSIVE', note: 'Independent observations are still unavailable.' }, context);
  assert.equal(finding.kind, 'FINDING');
  assert.equal(finding.payload.authority, 'HYPOTHESIS');
  assert.equal(finding.payload.data.geometryAuthority, 'NONE');
  assert.equal(canonicalJson(experiment), original);
  const expanded = graphWithReceipt(graphWithReceipt(graph, experiment), finding);
  const chain = traverseEvidence(expanded, 'feature.coffer.base',8,'RELATED_CONTEXT');
  assert.ok(chain.nodes.some(n => n.kind === 'EXPERIMENT'));
  assert.ok(chain.nodes.some(n => n.kind === 'FINDING'));
  assert.ok(chain.nodes.some(n => n.id === finding.id));
  const journal = await appendReceipt([], experiment);
  await assert.rejects(appendReceipt(journal, experiment), /already exists/);
});

test('realistic reconstruction cannot become OBSERVED through review or imported pass flags', async () => {
  const feature = assembly.features.find(f => f.id === 'feature.lid.envelope');
  const receipt = await createPromotionReceipt(feature, 'OBSERVED', graph, { reviewer: 'Synthetic reviewer', outcome: 'SUPPORTED', note: 'It looks realistic but that is not a source.' }, context);
  assert.equal(receipt.payload.data.allowed, false);
  assert.equal(receipt.payload.data.resultingAuthority, 'RECONSTRUCTED');
  assert.match(receipt.payload.data.note, /independent control/);
  assert.equal(feature.authority, 'RECONSTRUCTED');
  assert.equal((await verifyReceipt(receipt)).id, receipt.id);
});

test('checksum-valid finding forgeries cannot promote authority or change referenced experiment semantics', async () => {
  const experiment = await runCandidateExperiment(candidates[0], graph, context);
  const finding = await reviewExperiment(experiment, { reviewer: 'Test reviewer', outcome: 'SUPPORTED', note: 'The arithmetic reproduces, independent evidence pending.' }, context);
  const observed = clone(finding); observed.payload.authority = 'OBSERVED';
  await assert.rejects(verifyReceipt(await reseal(observed)), /cannot claim/);
  const metric = clone(finding); metric.payload.data.geometryAuthority = 'SURVEY';
  await assert.rejects(verifyReceipt(await reseal(metric)), /cannot claim/);
  const emptyReview = clone(finding); emptyReview.payload.data.review.note = '';
  await assert.rejects(verifyReceipt(await reseal(emptyReview)), /reviewer.*outcome.*note/);
  const swapped = clone(finding); swapped.payload.data.candidateId = 'candidate.not-the-experiment';
  await assert.rejects(parseReceiptJournal({ schema: 'giza.investigation-journal.v1', receipts: [experiment, await reseal(swapped)] }), /matching experiment/);
  const unknown = clone(finding); unknown.payload.data.experimentSha256 = '0'.repeat(64); unknown.payload.data.experimentReceiptId = `receipt:experiment:${'0'.repeat(64)}`;
  await assert.rejects(appendReceipt([experiment], await reseal(unknown)), /matching experiment/);
});

test('journal requires an earlier matching experiment and rejects cross-assembly/frame records', async () => {
  const experiment = await runCandidateExperiment(candidates[0], graph, context);
  const finding = await reviewExperiment(experiment, { reviewer: 'Test reviewer', outcome: 'INCONCLUSIVE', note: 'Control observations remain missing from this test.' }, context);
  await assert.rejects(parseReceiptJournal({ schema: 'giza.investigation-journal.v1', receipts: [finding, experiment] }), /earlier/);
  for (const key of ['assemblyId', 'frameId']) {
    const foreign = clone(finding); foreign.payload[key] = 'OTHER';
    await assert.rejects(parseReceiptJournal({ schema: 'giza.investigation-journal.v1', receipts: [experiment, await reseal(foreign)] }), /different assembly or authoritative frame/);
  }
  const raw = JSON.stringify({ schema: 'giza.investigation-journal.v1', receipts: [experiment, finding] });
  let writes = 0;
  const storage = { getItem: () => raw, setItem: () => { writes++; } };
  const loaded = await loadReceiptJournal(storage, 'test', { assemblyId: 'OTHER', frameId: graph.authoritativeFrameId });
  assert.equal(loaded.state, 'UNREADABLE'); assert.equal(loaded.raw, raw); assert.equal(loaded.baseline, undefined); assert.equal(writes, 0);
});

test('promotion gates are replayed against the sealed graph, not trusted from hash-valid flags', async () => {
  const feature = assembly.features.find(f => f.id === 'feature.lid.envelope');
  const receipt = await createPromotionReceipt(feature, 'OBSERVED', graph, { reviewer: 'Test reviewer', outcome: 'SUPPORTED', note: 'Request observed authority for a reconstructed lid.' }, context);
  const forged = clone(receipt); forged.payload.data.allowed = true; forged.payload.data.resultingAuthority = 'OBSERVED'; forged.payload.data.gates.targetSupportedByCurrentContract = true;
  await assert.rejects(verifyReceipt(await reseal(forged)), /gates do not reproduce/);
  const moved = clone(receipt); moved.payload.frameId = graph.authoritativeFrameId;
  await assert.rejects(verifyReceipt(await reseal(moved)), /feature\/frame\/authority mismatch/);
  const changedGraph = clone(receipt); changedGraph.payload.data.graphSnapshot.nodes[0].label = 'tampered';
  await assert.rejects(verifyReceipt(await reseal(changedGraph)), /graph\/frame mismatch/);
  assert.throws(() => graphWithReceipt(graph, clone(receipt)), /Verify imported/);
  assert.ok(graphWithReceipt(graph, await verifyReceipt(clone(receipt))).nodes.some(n => n.id === receipt.id));
});

test('research graph is compact and full replay snapshots stay exclusively in immutable receipts', async () => {
  let expanded = graph;
  const receipts = [];
  for (let i = 0; i < 12; i++) {
    const receipt = await runCandidateExperiment(candidates[0], graph, { ...context, createdAt: `2026-09-17T00:00:${String(i).padStart(2, '0')}.000Z` });
    receipts.push(receipt); expanded = graphWithReceipt(expanded, receipt);
  }
  assert.ok(canonicalJson(expanded).length < canonicalJson(graph).length + receipts.length * 20000);
  for (const node of expanded.nodes.filter(n => ['EXPERIMENT', 'RECEIPT'].includes(n.kind))) assert.equal(node.data.graphSnapshot, undefined);
  for (const receipt of receipts) assert.ok(receipt.payload.data.graphSnapshot);
  assert.equal((await parseReceiptJournal({ schema: 'giza.investigation-journal.v1', receipts })).length, 12);
});

test('canonical graph hash is stable under object key ordering, not coordinate changes', async () => {
  assert.equal(await sha256Json({ b: 2, a: 1 }), await sha256Json({ a: 1, b: 2 }));
  assert.notEqual(await sha256Json({ x: 1.001 }), await sha256Json({ x: 1.002 }));
});

test('append-only persisted journal preserves corrupted data and refuses stale/deleting writes', async () => {
  let raw = '{corrupted', writes = 0;
  const storage = { getItem: () => raw, setItem: (_, value) => { raw = value; writes++; } };
  const broken = await loadReceiptJournal(storage, 'test');
  assert.equal(broken.state, 'UNREADABLE'); assert.equal(broken.raw, '{corrupted');
  assert.equal((await saveReceiptJournal(storage, 'test', broken.baseline, [])).ok, false);
  assert.equal(writes, 0);
  raw = null;
  const empty = await loadReceiptJournal(storage, 'test');
  const experiment = await runCandidateExperiment(candidates[0], graph, context);
  const saved = await saveReceiptJournal(storage, 'test', empty.baseline, [experiment]);
  assert.equal(saved.ok, true);
  assert.equal((await loadReceiptJournal(storage, 'test')).receipts.length, 1);
  const protectedRaw = raw;
  assert.equal((await saveReceiptJournal(storage, 'test', saved.baseline, [])).reason, 'INVALID');
  assert.equal(raw, protectedRaw);
  assert.equal((await saveReceiptJournal(storage, 'test', null, [experiment])).reason, 'CONFLICT');
  assert.equal(raw, protectedRaw);
});

const fixture = () => ({ campaign_id: 'SYNTHETIC_NOT_ARCHAEOLOGY', fit_model: 'SIMILARITY_2D', target_frame: 'PLATE_LOCAL_METERS', source_sha256: 'a'.repeat(64), render_sha256: 'b'.repeat(64), freeze_sha256: 'c'.repeat(64), result_sha256: 'd'.repeat(64), passed: true, scale_check: { evaluated: true }, control_residuals: [{ id: 'control.test', target: { x: 1, y: 2 }, predicted: { x: 1.03, y: 2.04 }, dx: .03, dy: .04, error: .05 }], holdout_residuals: [{ id: 'holdout.test', target: { x: 2, y: 3 }, predicted: { x: 2, y: 3.1 }, dx: 0, dy: .1, error: .1 }] });
test('registration comparison preserves control/holdout vectors and has NO imported metric authority', () => {
  const result = parseRegistrationComparison(fixture());
  assert.equal(result.status, 'IMPORTED_UNVERIFIED');
  assert.equal(result.metricAuthority, 'NONE');
  assert.equal(result.vectors[0].role, 'CONTROL');
  assert.equal(result.vectors[1].role, 'HOLDOUT');
  assert.deepEqual(result.vectors[1].target, [2, 3]);
  assert.equal(result.targetFrame, 'PLATE_LOCAL_METERS');
  assert.equal(unavailableRegistration().vectors.length, 0);
  assert.match(unavailableRegistration().note, /UNKNOWN, not zero/);
});

test('malformed residuals and counterfeit fit shapes are isolated, never rendered as evidence', async () => {
  const bad = fixture(); bad.control_residuals[0].dx = 7;
  assert.throws(() => parseRegistrationComparison(bad), /Inconsistent/);
  const duplicate = fixture(); duplicate.holdout_residuals[0].id = duplicate.control_residuals[0].id;
  assert.throws(() => parseRegistrationComparison(duplicate), /Duplicate/);
  assert.throws(() => parseRegistrationComparison({ passed: true }), /Unsupported/);
  const previous = globalThis.fetch;
  try {
    globalThis.fetch = async () => ({ ok: true, json: async () => bad }); assert.equal((await loadRegistrationComparison()).status, 'UNAVAILABLE');
    globalThis.fetch = async () => new Response('<!doctype html><title>SPA fallback</title>', { headers: { 'content-type': 'text/html' } });
    const absent = await loadRegistrationComparison(); assert.equal(absent.status, 'UNAVAILABLE'); assert.match(absent.note, /No registration result is installed/); assert.deepEqual(absent.vectors, []);
  }
  finally { globalThis.fetch = previous; }
});
