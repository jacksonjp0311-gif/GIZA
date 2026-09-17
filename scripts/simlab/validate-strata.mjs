import fs from 'node:fs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const result=read('public/model/simlab/results/strata.deep-claim-screening.json');
const bench=read('public/model/simlab/benchmarks/strata_benchmark.json');
const manifest=read('public/model/simlab/simlab_manifest.json');
const errors=[];
if(manifest.version!=='0.9.3')errors.push('SIMLAB version must be 0.9.3');
if(!manifest.active_solvers.includes('solver.strata'))errors.push('solver.strata not active');
if(!bench.pass)errors.push('STRATA analytical benchmark failed');
if(result.provenance_class!=='SIMULATED')errors.push('STRATA output must remain SIMULATED');
if(result.truth_status!=='CONDITIONAL_UNVERIFIED_GEOMETRY')errors.push('truth guard changed');
if(!result.geometry_hash||!result.input_hash)errors.push('hash receipt missing');
if(result.field_points?.length<90)errors.push('STRATA field unexpectedly small');
if(result.geomechanics?.warning?.includes('factors of safety')!==true)errors.push('factor-of-safety guard missing');
if(result.hydraulics?.shaft_bottom?.flow_rate_status!=='NOT_COMPUTABLE_WITHOUT_PERMEABILITY_CONNECTIVITY_AND_BOUNDARY_HEAD')errors.push('flow gate weakened');
if(result.hydraulics?.dry_null_pressure_mpa!==0)errors.push('dry null changed');
console.log(`STRATA stress648=${result.geomechanics.shaft_bottom.vertical_overburden_proxy_mpa.toFixed(3)} MPa water648=${result.hydraulics.shaft_bottom.hypothetical_freshwater_pressure_mpa.toFixed(3)} MPa points=${result.field_points.length}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('PASS');
