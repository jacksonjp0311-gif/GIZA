/** Repo-relative, compile-first startup. Owns only the child processes it starts. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import net from 'node:net';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawn,spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const options=new Set(process.argv.slice(2));
if([...options].some(x=>!['--check','--smoke'].includes(x)))throw new Error('Usage: npm start [-- --check | --smoke]. Ports: GIZA_EXPLORER_PORT / GIZA_PORT.');
function port(value,fallback){const n=Number(value??fallback);if(!Number.isInteger(n)||n<1024||n>65535)throw new Error('Ports must be integers from 1024 to 65535.');return n;}
const explorer=port(process.env.GIZA_EXPLORER_PORT,4173),workbench=port(process.env.GIZA_PORT,4174);
if(explorer===workbench)throw new Error('Explorer and workbench need different ports.');
const free=p=>new Promise((resolve,reject)=>{const s=net.createServer();s.once('error',()=>reject(new Error(`Port ${p} is in use. Stop the existing service or choose GIZA_EXPLORER_PORT and GIZA_PORT. No existing process was stopped.`)));s.listen(p,'127.0.0.1',()=>s.close(resolve));});
const packageInfo=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const stamp=new Date().toISOString().replace(/[-:TZ.]/g,'');
const env={...process.env,GIZA_PORT:String(workbench),VITE_GIZA_RELEASE_VERSION:packageInfo.version,VITE_GIZA_DEV_BUILD:stamp};
const run=script=>{const result=spawnSync(process.execPath,[path.join(root,script),...(script.includes('typescript')?['--noEmit']:['build'])],{cwd:root,env,stdio:'inherit',windowsHide:true});if(result.error||result.status!==0)throw new Error('Compilation failed. Run npm ci first if dependencies are missing. No new services started.');};
const children=[];let stopping=false;
function stop(code=0){if(stopping)return;stopping=true;process.exitCode=code;for(const child of children)if(child.exitCode===null)child.kill();}
try{
  if(!options.has('--check'))await Promise.all([free(explorer),free(workbench)]);
  run('node_modules/typescript/bin/tsc');run('node_modules/vite/bin/vite.js');
  const runtime=path.join(os.tmpdir(),'giza-runtime',crypto.createHash('sha256').update(root).digest('hex').slice(0,12));
  fs.mkdirSync(runtime,{recursive:true});
  fs.writeFileSync(path.join(runtime,'build-stamp.json'),JSON.stringify({release:packageInfo.version,build:stamp,compiled_at:new Date().toISOString()},null,2));
  console.log(`Compiled ${packageInfo.version}+dev.${stamp}. Receipt: ${runtime}`);
  if(!options.has('--check')){
    for(const args of [['scripts/workbench/server.mjs'],['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(explorer),'--strictPort']]){
      const child=spawn(process.execPath,args,{cwd:root,env,stdio:'inherit',windowsHide:true});children.push(child);
      child.on('error',e=>{console.error(e.message);stop(1);});child.on('exit',()=>{if(!stopping){console.error('A GIZA service exited; stopping its companion.');stop(1);}});
    }
    process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
    let ready=false;
    for(let i=0;i<80&&!stopping;i++){
      try{const responses=await Promise.all([fetch(`http://127.0.0.1:${explorer}/`,{signal:AbortSignal.timeout(1000)}),fetch(`http://127.0.0.1:${workbench}/api/health`,{signal:AbortSignal.timeout(1000)})]);if(responses.every(r=>r.ok)){ready=true;break;}}catch{}
      await new Promise(r=>setTimeout(r,250));
    }
    if(!ready)throw new Error('Services did not become ready.');
    console.log(`GIZA READY — http://127.0.0.1:${explorer}/ — Ctrl+C stops both services.`);
    if(options.has('--smoke'))stop();
  }
}catch(error){console.error(error.message);stop(1);}
