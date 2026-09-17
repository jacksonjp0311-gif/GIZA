#!/usr/bin/env node
/** Reproducible Evidence Assembly contract/graph/candidate validation.
 * This is a software validation run, NOT a new archaeological registration or fit.
 * --output is optional. When specified, output is exclusive/append-only.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('node scripts/evidence/validate.mjs [--output public/model/evidence_assembly/validation-UNIQUE.json]');
  process.exit(0);
}
if (args.length && (args.length !== 2 || args[0] !== '--output' || !args[1])) throw new Error('Use --output <new relative file>; existing outputs are never overwritten.');
const outputRelative = args[1] ?? null;
let output = null;
if (outputRelative) {
  if (path.isAbsolute(outputRelative)) throw new Error('Output must be relative to this repository');
  output = path.resolve(root, outputRelative);
  const allowed = path.resolve(root, 'public/model/evidence_assembly');
  if (!output.startsWith(allowed + path.sep) || path.extname(output) !== '.json') throw new Error('Output must be a JSON file inside public/model/evidence_assembly/');
  if (fs.existsSync(output)) throw new Error('VALIDATION_RECEIPT_ALREADY_EXISTS');
}

const compiled = new Map();
function moduleUrl(name) {
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) throw new Error('Unsafe module name');
  const full = path.join(root, 'src/evidence', `${name}.ts`);
  if (compiled.has(full)) return compiled.get(full);
  let source = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  source = source.replace(/from ['"]\.\/([^'"]+)['"]/g, (_, dependency) => `from '${moduleUrl(dependency)}'`);
  const url = `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
  compiled.set(full, url); return url;
}
const { buildKhafreAssembly } = await import(moduleUrl('assembly'));
const { buildEvidenceGraph, parseEvidenceGraph, canonicalJson } = await import(moduleUrl('graph'));
const { generateInvestigationCandidates } = await import(moduleUrl('intelligence'));
const { runCandidateExperiment, verifyReceipt, sha256Json } = await import(moduleUrl('receipts'));
const { exportCanonicalAssembly, importCanonicalAssembly, invertRigid, transformPoint, distance } = await import(moduleUrl('spatial'));
const relative = file => path.relative(root, file).split(path.sep).join('/');
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const packageJson = readJson('package.json');
const sourceFiles = [
  'package.json', 'scripts/evidence/validate.mjs',
  'public/model/parts.json', 'public/model/assemblies.json', 'public/model/stone_field.json',
  'public/model/research/measurements.json', 'public/model/component_research.json', 'public/model/evidence/source_registry.json',
  'public/model/source_byte_registration/candidates.json', 'public/model/plate_registration/custody_handoff.json',
  ...fs.readdirSync(path.join(root, 'src/evidence')).filter(name => /\.(ts|tsx)$/.test(name)).map(name => `src/evidence/${name}`),
].sort();
const sourceHashes = sourceFiles.map(file => { const bytes = fs.readFileSync(path.join(root, file)); return { path: file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }; });
const git = (...argv) => { try { return execFileSync('git', argv, { cwd: root, encoding: 'utf8', windowsHide: true }).trim(); } catch { return 'UNKNOWN'; } };
const gitStatus = git('status', '--porcelain');
const context = { version: packageJson.version, commit: git('rev-parse', 'HEAD'), environment: `${process.platform}/${process.arch}; Node ${process.version}; TypeScript ${ts.version}`, createdAt: new Date().toISOString() };
const model = { parts: readJson('public/model/parts.json').parts, measurements: readJson('public/model/research/measurements.json').measurements, componentResearch: readJson('public/model/component_research.json'), sourceRegistry: readJson('public/model/evidence/source_registry.json').sources };
const assembly = buildKhafreAssembly(model);
assert.equal(canonicalJson(importCanonicalAssembly(exportCanonicalAssembly(assembly))), canonicalJson(assembly));
const graph = buildEvidenceGraph(assembly);
assert.equal(canonicalJson(parseEvidenceGraph(graph)), canonicalJson(graph));
const roundTrips = [];
for (const transform of assembly.transforms.filter(t => t.status === 'RESOLVED' && t.matrix)) {
  const point = [.271, -1.23, .44];
  const returned = transformPoint(invertRigid(transform.matrix), transformPoint(transform.matrix, point));
  const drift = distance(point, returned);
  assert.ok(drift < 1e-10, `Transform drift ${transform.id}: ${drift}`);
  roundTrips.push({ transformId: transform.id, scope: transform.scope, point, returned, drift_m: drift });
}
const candidates = generateInvestigationCandidates(assembly, graph);
assert.equal(canonicalJson(candidates), canonicalJson(generateInvestigationCandidates(assembly, graph)));
const experiments = [];
for (const candidate of candidates) {
  const experiment = await runCandidateExperiment(candidate, graph, context);
  assert.equal((await verifyReceipt(experiment)).sha256, experiment.sha256);
  experiments.push(experiment);
}
const result = {
  schema: 'giza.evidence-assembly-validation.v1', context,
  worktree: { dirty: gitStatus === 'UNKNOWN' ? null : gitStatus.length > 0, note: 'Commit identifies the base. Source hashes below bind the actual bytes used, including uncommitted engineering changes.' },
  authority: 'SOFTWARE_VALIDATION_ONLY_NOT_ARCHAEOLOGICAL_EVIDENCE',
  checks: { contract_round_trip: true, graph_integrity: true, resolved_transform_round_trips: true, deterministic_candidates: true, all_candidate_computations_reproduced: true, experiment_checksums_verified: true },
  counts: { features: assembly.features.length, observations: assembly.observations.length, graph_nodes: graph.nodes.length, graph_edges: graph.edges.length, investigation_candidates: candidates.length, experiments: experiments.length },
  blockedAuthoritativeTransforms: assembly.transforms.filter(t => t.scope === 'AUTHORITATIVE_RECONSTRUCTION' && t.status === 'UNRESOLVED').map(t => ({ id: t.id, from: t.from, to: t.to, reason: t.derivation })),
  archaeologicalRegistration: { status: 'NOT_PRODUCED', independentScale: 'UNKNOWN', controls: 'UNKNOWN', holdouts: 'UNKNOWN', residual: 'UNKNOWN', note: 'Reproducing cited scalar arithmetic does not supply independent evidence or source-byte custody.' },
  sourceHashes, roundTrips, assembly, graph, candidates, experiments,
};
const receipt = { ...result, sha256: await sha256Json(result) };
if (output) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  // Resolve ancestors after creation so symlink/reparse redirection cannot escape the repository.
  const realRoot = fs.realpathSync(root), realParent = fs.realpathSync(path.dirname(output));
  if (!realParent.startsWith(realRoot + path.sep)) throw new Error('Output ancestor escapes repository');
  fs.writeFileSync(output, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
}
console.log(JSON.stringify({ passed: true, ...receipt.counts, sha256: receipt.sha256, output: output ? relative(output) : null, archaeological_registration: 'NOT_PRODUCED', note: 'This targeted contract validator does not replace npm run check, browser tests or production build.' }, null, 2));
