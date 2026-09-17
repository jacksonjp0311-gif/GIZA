import fs from 'node:fs';
import crypto from 'node:crypto';
const solverId=process.argv[2];
if(!solverId){console.error('Usage: node scripts/new-solver-run.mjs solver.gravity');process.exit(2)}
const registry=JSON.parse(fs.readFileSync('public/model/solvers/solver_registry.json','utf8'));
const solver=registry.solvers.find(s=>s.id===solverId);
if(!solver){console.error(`Unknown solver: ${solverId}`);process.exit(2)}
const snapshot=JSON.parse(fs.readFileSync('public/model/evidence/geometry_snapshot.json','utf8'));
const runId=`run.${solverId.split('.').pop()}.${Date.now()}.${crypto.randomBytes(3).toString('hex')}`;
const run={
  run_id:runId,solver_id:solverId,solver_version:'UNSET',geometry_revision:snapshot.geometry_revision,
  geometry_hash:snapshot.geometry_hash,input_hash:'UNSET',parameters:{},controls:{},outputs:{},uncertainty:{},
  status:'DRAFT',created_at:new Date().toISOString(),provenance_class:'SIMULATED',
  note:'Scaffold only. Populate inputs/parameters/controls before execution; results cannot mutate canonical geometry.'
};
const path=`public/model/solvers/runs/${runId}.json`;fs.writeFileSync(path,JSON.stringify(run,null,2)+'\n');console.log(path);
