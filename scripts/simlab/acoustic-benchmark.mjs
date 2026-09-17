import fs from 'node:fs';
import { cavityModes, ductModes, soundSpeedDryAir } from './acoustic-engine.mjs';
const c=soundSpeedDryAir(20);
const tubeL=10;
const expectedTube=c/(2*tubeL);
const tube=ductModes({length:tubeL,soundSpeed:c,maxHz:100})[0].frequency_hz;
const cavity=cavityModes({lx:10,ly:8,lz:6,soundSpeed:c,maxHz:100,maxOrder:3});
const c100=cavity.find(m=>m.mode[0]===1&&m.mode[1]===0&&m.mode[2]===0)?.frequency_hz;
const expectedC100=c/(2*10);
const closedOpen=ductModes({length:tubeL,soundSpeed:c,maxHz:100,boundary:'CLOSED_OPEN'})[0].frequency_hz;
const expectedClosedOpen=c/(4*tubeL);
const tests=[
  {id:'open_open_tube_fundamental',expected_hz:expectedTube,actual_hz:tube,relative_error:Math.abs(tube-expectedTube)/expectedTube,pass:Math.abs(tube-expectedTube)<1e-12},
  {id:'rectangular_cavity_100',expected_hz:expectedC100,actual_hz:c100,relative_error:Math.abs(c100-expectedC100)/expectedC100,pass:Math.abs(c100-expectedC100)<1e-12},
  {id:'closed_open_tube_fundamental',expected_hz:expectedClosedOpen,actual_hz:closedOpen,relative_error:Math.abs(closedOpen-expectedClosedOpen)/expectedClosedOpen,pass:Math.abs(closedOpen-expectedClosedOpen)<1e-12},
];
const out={benchmark_id:'benchmark.acoustic.analytic.v1',solver_id:'solver.acoustic',provenance_class:'SIMULATED',sound_speed_m_s:c,tests,pass:tests.every(t=>t.pass),created_at:new Date().toISOString()};
fs.mkdirSync('public/model/simlab/benchmarks',{recursive:true});
fs.writeFileSync('public/model/simlab/benchmarks/acoustic_benchmark.json',JSON.stringify(out,null,2)+'\n');
console.log(`acoustic benchmark ${out.pass?'PASS':'FAIL'} c=${c.toFixed(3)} m/s`);
if(!out.pass) process.exit(1);
