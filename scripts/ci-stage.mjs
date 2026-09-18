/** Stream bounded public software logs so cancellation retains completed progress. */
import fs from 'node:fs';import {spawn} from 'node:child_process';
const stage=process.argv[2],group=process.env.GIZA_BROWSER_GROUP;
const commands={dependencies:'npm ci',contracts:'npm run check',compilation:'npm run build',browserSetup:'npx playwright install --with-deps chromium',browser:group?'node scripts/browser-groups.mjs '+group:'npm run test:browser',smoke:'npm start -- --smoke'};
if(!Object.hasOwn(commands,stage)||group&&!['navigation','spatial','evidence','atlas','guidance'].includes(group))throw new Error('Unknown CI stage/group');
fs.mkdirSync('verification-ci',{recursive:true});
const started=new Date().toISOString(),file='verification-ci/'+stage+'.log';
fs.writeFileSync(file,'');fs.writeFileSync('verification-ci/'+stage+'.json',JSON.stringify({stage,group,status:'RUNNING_OR_INTERRUPTED',started,platform:process.platform,node:process.version}));
const child=spawn(commands[stage],{shell:true,windowsHide:true}),limit=40_000_000;let bytes=0;
const output=chunk=>{process.stdout.write(chunk);if(bytes<limit){const b=Buffer.from(chunk).subarray(0,limit-bytes);fs.appendFileSync(file,b);bytes+=b.length;}};
child.stdout.on('data',output);child.stderr.on('data',output);
let error=null;child.on('error',e=>{error=e.message;output(e.message);});
child.on('close',code=>{
  fs.writeFileSync('verification-ci/'+stage+'.json',JSON.stringify({stage,group,status:code===0?'PASS':'FAIL',exitCode:code,error,started,completed:new Date().toISOString(),platform:process.platform,node:process.version,logTruncated:bytes>=limit}));
  if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'\n- '+stage+(group?' / '+group:'')+': '+(code===0?'PASS':'FAIL')+' ('+process.platform+'). See streamed stage log and browser artifacts.\n');
  process.exitCode=code??1;
});
