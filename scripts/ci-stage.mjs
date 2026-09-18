/** Bounded public software logs only; never copies source custody/research folders. */
import fs from 'node:fs';import {spawnSync} from 'node:child_process';
const stage=process.argv[2];const commands={dependencies:'npm ci',contracts:'npm run check',compilation:'npm run build',browserSetup:'npx playwright install --with-deps chromium',browser:'npm run test:browser',smoke:'npm start -- --smoke'};
if(!Object.hasOwn(commands,stage))throw new Error('Unknown CI stage');
fs.mkdirSync('verification-ci',{recursive:true});
const r=spawnSync(commands[stage],{shell:true,encoding:'utf8',windowsHide:true,maxBuffer:40_000_000});
const log=(r.stdout??'')+'\n'+(r.stderr??'');process.stdout.write(log);fs.writeFileSync(`verification-ci/${stage}.log`,log);
fs.writeFileSync(`verification-ci/${stage}.json`,JSON.stringify({stage,exitCode:r.status,error:r.error?.message??null,platform:process.platform,node:process.version,at:new Date().toISOString()}));
if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,`\n- ${stage}: ${r.status===0?'PASS':'FAIL'} (${process.platform}, ${process.version}). See stage log and browser artifacts.\n`);
process.exitCode=r.status??1;
