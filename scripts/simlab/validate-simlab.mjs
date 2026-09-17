import fs from 'node:fs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const manifest=read('public/model/simlab/simlab_manifest.json');
const bench=read('public/model/simlab/benchmarks/gravity_benchmark.json');
const result=read('public/model/simlab/results/gravity.deep-claim-conditional.json');
const known=read('public/model/simlab/results/gravity.known-interiors-screening.json');
const sens=read('public/model/simlab/results/gravity.deep-claim-sensitivity.json');
const index=read('public/model/simlab/run_index.json');
const parts=read('public/model/parts.json').parts;
const errors=[];
if(!['0.9.0','0.9.2','0.9.3'].includes(manifest.version)) errors.push('SIMLAB manifest version mismatch');
if(!manifest.active_solvers.includes('solver.gravity')) errors.push('gravity not active');
if(!manifest.active_solvers.includes('solver.acoustic')) errors.push('acoustic not active');
if(!bench.pass) errors.push('gravity analytical benchmark failed');
for(const run of [result,known]){
  if(run.provenance_class!=='SIMULATED') errors.push(`${run.experiment_id}: provenance must be SIMULATED`);
  if(!run.geometry_hash || !run.input_hash) errors.push(`${run.experiment_id}: hashes missing`);
  if(!run.controls?.primary_null) errors.push(`${run.experiment_id}: null model missing`);
  if(!Array.isArray(run.points) || run.points.length<100) errors.push(`${run.experiment_id}: gravity output grid missing`);
}
if(result.truth_status!=='CONDITIONAL_UNVERIFIED_GEOMETRY') errors.push('deep claim result lost conditional truth guard');
if(known.truth_status!=='CONDITIONAL_DERIVED_GEOMETRY') errors.push('known interior screening lost derived-geometry guard');
const unv=new Set(parts.filter(p=>p.provenance.class==='UNVERIFIED').map(p=>p.id));
for(const c of result.components) if(!unv.has(c.id)) errors.push(`conditional deep run includes non-UNVERIFIED component ${c.id}`);
if(parts.filter(p=>p.provenance.class==='UNVERIFIED').length!==31) errors.push('deep claim provenance count changed');
if(sens.kind!=='SCENARIO_SENSITIVITY_NOT_POSTERIOR' || sens.scenario_count!==27) errors.push('sensitivity guard/count invalid');
if(index.runs.length<4) errors.push('run index missing expected gravity controls');
console.log('GIZA // SIMLAB validation');
console.log(`gravity map points=${result.points.length} elements=${result.element_count} peak=${result.summary.max_magnitude_microgal.toFixed(3)} microGal`);
console.log(`controls shafts=${result.component_control_summary.shafts_only_peak_microgal.toFixed(3)} terminals=${result.component_control_summary.terminals_only_peak_microgal.toFixed(3)} microGal`);
console.log(`knownInteriorScreen=${known.summary.max_magnitude_microgal.toFixed(3)} microGal sensitivityScenarios=${sens.scenario_count}`);
console.log(`benchmark=${bench.pass?'PASS':'FAIL'} runs=${index.runs.length} null=${result.controls.primary_null}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('PASS');
