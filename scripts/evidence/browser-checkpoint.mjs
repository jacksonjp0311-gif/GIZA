import fs from 'node:fs';
import {spawnSync,execFileSync} from 'node:child_process';
const name=process.argv[2];if(!name||!/^[a-z0-9-]+$/.test(name))throw new Error('Unique checkpoint name required');
const dir=`verification/evidence-boundaries/${name}`;if(fs.existsSync(dir))throw new Error('Never overwrite a checkpoint');fs.mkdirSync(dir,{recursive:true});
const r=spawnSync(process.platform==='win32'?'cmd.exe':'npm',process.platform==='win32'?['/d','/s','/c','npm run test:browser']:['run','test:browser'],{encoding:'utf8',windowsHide:true,maxBuffer:20_000_000});
fs.writeFileSync(`${dir}/browser.log`,r.stdout+'\n'+r.stderr,{flag:'wx'});
if(fs.existsSync('test-results'))fs.cpSync('test-results',`${dir}/artifacts`,{recursive:true,errorOnExist:true,force:false});
fs.writeFileSync(`${dir}/run.json`,JSON.stringify({schema:'giza.browser-checkpoint.v1',createdAt:new Date().toISOString(),commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),node:process.version,platform:process.platform,exitCode:r.status,command:'npm run test:browser',authority:'SOFTWARE_TESTS_ONLY'},null,2),{flag:'wx'});
console.log(r.stdout.slice(-6000));console.log(dir);process.exitCode=r.status??1;
