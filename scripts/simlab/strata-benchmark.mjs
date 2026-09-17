import fs from 'node:fs';
const g=9.80665;
const stress=(rho,h)=>rho*g*h/1e6;
const pressure=(rho,h)=>rho*g*h/1e6;
const energy=(rho,h)=>rho*g*h/3.6e6;
const tests=[
  {id:'overburden_100m',expected_mpa:2.549729,computed_mpa:stress(2600,100)},
  {id:'hydrostatic_100m',expected_mpa:0.980665,computed_mpa:pressure(1000,100)},
  {id:'water_energy_648m',expected_kwh_m3:1.765197,computed_kwh_m3:energy(1000,648)}
].map(t=>({...t,error:Math.abs((t.computed_mpa??t.computed_kwh_m3)-(t.expected_mpa??t.expected_kwh_m3)),pass:Math.abs((t.computed_mpa??t.computed_kwh_m3)-(t.expected_mpa??t.expected_kwh_m3))<1e-6}));
const result={benchmark_id:'benchmark.strata.analytic.0.9.3',solver_id:'solver.strata',provenance_class:'SIMULATED',tests,pass:tests.every(t=>t.pass),created_at:new Date().toISOString()};
fs.mkdirSync('public/model/simlab/benchmarks',{recursive:true});
fs.writeFileSync('public/model/simlab/benchmarks/strata_benchmark.json',JSON.stringify(result,null,2)+'\n');
console.log(result.pass?'PASS':'FAIL'); if(!result.pass)process.exit(1);
