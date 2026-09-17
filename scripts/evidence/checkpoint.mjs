/** Complete check with append-only logs; preserve tracked historical benchmark bytes. */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const name=process.argv[2];
if(!name||!/^[a-z0-9-]+$/.test(name))throw new Error('Supply a unique lowercase checkpoint name');
const dir=path.join('verification','evidence-boundaries',name);
if(fs.existsSync(dir))throw new Error('Checkpoint exists; never overwrite a previous run');
fs.mkdirSync(dir,{recursive:true});
const paths=['public/model/control_net/benchmarks/projective_camera.json','public/model/registration/benchmarks/planar_homography.json'];
const originals=paths.map(p=>fs.readFileSync(p));
const result=spawnSync(process.platform==='win32'?'cmd.exe':'npm',process.platform==='win32'?['/d','/s','/c','npm run check']:['run','check'],{encoding:'utf8',windowsHide:true,maxBuffer:80_000_000});
fs.writeFileSync(path.join(dir,'full-check.log'),result.stdout+'\n'+result.stderr,{flag:'wx'});
for(let i=0;i<paths.length;i++){
  const current=fs.readFileSync(paths[i]);fs.writeFileSync(path.join(dir,path.basename(paths[i])),current,{flag:'wx'});
  const before=JSON.parse(originals[i]),after=JSON.parse(current);delete before.created_at;delete after.created_at;
  if(JSON.stringify(before)!==JSON.stringify(after))throw new Error(`Benchmark changed beyond timestamp: ${paths[i]}; retained for review`);
  fs.writeFileSync(paths[i],originals[i]);
}
fs.writeFileSync(path.join(dir,'run.json'),JSON.stringify({schema:'giza.software-checkpoint.v1',name,createdAt:new Date().toISOString(),node:process.version,platform:process.platform,exitCode:result.status,authority:'SOFTWARE_TESTS_ONLY',historicalBenchmarkBytesRestored:true},null,2),{flag:'wx'});
console.log(`${name}: ${result.status===0?'PASS':'FAIL'}; immutable log ${dir}/full-check.log`);
if(result.status!==0)console.log((result.stdout+'\n'+result.stderr).slice(-6000));
process.exitCode=result.status??1;
