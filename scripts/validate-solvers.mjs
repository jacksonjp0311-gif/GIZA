import fs from 'node:fs';
import path from 'node:path';
const base = path.resolve('public/model/solvers');
const registry = JSON.parse(fs.readFileSync(path.join(base,'solver_registry.json'),'utf8'));
const errors = [];
for (const s of registry.solvers ?? []) {
  const p = path.join(base, s.contract);
  if (!fs.existsSync(p)) { errors.push(`${s.id}: missing ${s.contract}`); continue; }
  const c = JSON.parse(fs.readFileSync(p,'utf8'));
  if (c.solver_id !== s.id) errors.push(`${s.id}: contract solver_id mismatch`);
  for (const k of ['inputs_required','controls_required','outputs_required','uncertainty_required','falsification']) if (!c[k]) errors.push(`${s.id}: missing ${k}`);
}
console.log(`GIZA v0.10.7 solver validation solvers=${registry.solvers?.length ?? 0}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('PASS');
