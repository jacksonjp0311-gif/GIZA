import fs from 'node:fs';
import { G, MICROGAL_PER_MPS2, pointMassGzMicrogal, boxElements, gravityAtObservation } from './gravity-engine.mjs';

fs.mkdirSync('public/model/simlab/benchmarks',{recursive:true});

// Benchmark 1: exact point-mass equation.
const mass=1.25e9;
const center=[0,0,-250];
const observation=[0,0,0];
const expected=G*mass*(-250)/(250**3)*MICROGAL_PER_MPS2;
const computed=pointMassGzMicrogal(mass,center,observation);
const pointRel=Math.abs((computed-expected)/expected);

// Benchmark 2: convergence of an 80 m cube at 720 m center depth toward its point-mass far-field limit.
const part={spatial:{origin_m:[0,0,-720],rpy_rad:[0,0,0],primitive:{kind:'box',sx:80,sy:80,sz:80}}};
const rho=-2600;
const totalMass=rho*80**3;
const farPoint=pointMassGzMicrogal(totalMass,[0,0,-720],[0,0,5]);
const voxel=gravityAtObservation(boxElements(part,rho,10),[0,0,5]).upward_delta_g_microgal;
const cubeRel=Math.abs((voxel-farPoint)/farPoint);

const result={
  benchmark_id:'bench.gravity.v0.9.0',
  provenance_class:'SIMULATED',
  tests:[
    {id:'point_mass_exact',expected_microgal:expected,computed_microgal:computed,relative_error:pointRel,tolerance:1e-12,pass:pointRel<1e-12},
    {id:'deep_cube_far_field_convergence',point_mass_microgal:farPoint,voxel_microgal:voxel,relative_difference:cubeRel,tolerance:0.01,pass:cubeRel<0.01,note:'Voxel finite-body result should approach point-mass scale at depth; not an identity test.'}
  ]
};
result.pass=result.tests.every(t=>t.pass);
fs.writeFileSync('public/model/simlab/benchmarks/gravity_benchmark.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(!result.pass) process.exit(1);
