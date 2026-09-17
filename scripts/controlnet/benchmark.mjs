import fs from 'node:fs';
import {solveProjectiveCamera,projectPoint,residualReport,deterministicRng} from './projective-camera.mjs';
fs.mkdirSync('public/model/control_net/benchmarks',{recursive:true});
const truth=[[820,18,42,930],[14,790,-35,540],[0.002,-0.001,0.004,1]];
const world=[
 [-3,-2,0],[3,-2,0],[3,2,0],[-3,2,0],[-2,-1,3],[2,-1,4],[2,2,5],[-2,2,4],[0,-3,2],[4,0,2],[-4,0,1],[0,3,6]
];
const exact=world.map((w,i)=>({id:`p${i}`,world:w,pixel:projectPoint(truth,w)}));
const fit=exact.slice(0,9),holdout=exact.slice(9);
const solved=solveProjectiveCamera(fit);
const exactFit=residualReport(solved.matrix_3x4,fit), exactHold=residualReport(solved.matrix_3x4,holdout);
const rng=deterministicRng(9801);
const noisy=exact.map(c=>({...c,pixel:[c.pixel[0]+(rng()*2-1)*0.25,c.pixel[1]+(rng()*2-1)*0.25]}));
const noisySolved=solveProjectiveCamera(noisy.slice(0,9));
const noisyFit=residualReport(noisySolved.matrix_3x4,noisy.slice(0,9));
const noisyHold=residualReport(noisySolved.matrix_3x4,noisy.slice(9));
const tests=[
 {id:'exact_fit_rmse',value:exactFit.rmse_px,tolerance_px:1e-7,pass:exactFit.rmse_px<1e-7},
 {id:'exact_holdout_rmse',value:exactHold.rmse_px,tolerance_px:1e-6,pass:exactHold.rmse_px<1e-6},
 {id:'noise_0.25px_fit_rmse',value:noisyFit.rmse_px,tolerance_px:0.5,pass:noisyFit.rmse_px<0.5},
 {id:'noise_0.25px_holdout_rmse',value:noisyHold.rmse_px,tolerance_px:1.5,pass:noisyHold.rmse_px<1.5}
];
const result={benchmark_id:'benchmark.controlnet.projective_camera.0.9.8',version:'0.9.8',solver_kind:'PROJECTIVE_CAMERA_DLT',provenance_class:'SIMULATED',truth_matrix_3x4:truth,fit_control_count:9,holdout_count:3,tests,exact:{fit:exactFit,holdout:exactHold},noise_sensitivity:{noise_bound_px:0.25,fit:noisyFit,holdout:noisyHold},pass:tests.every(t=>t.pass),guard:'This benchmark validates an uncalibrated projective camera matrix only. It does not validate focal length, distortion, metric Euclidean pose, or any real Khafre photograph.',created_at:new Date().toISOString()};
fs.writeFileSync('public/model/control_net/benchmarks/projective_camera.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({pass:result.pass,tests},null,2));
if(!result.pass)process.exit(1);
