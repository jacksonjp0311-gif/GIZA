import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync,readdirSync } from 'node:fs';
const workbench = `http://127.0.0.1:${process.env.GIZA_PORT || 4174}`;
const git=(args:string[])=>{try{return execFileSync('git',args,{encoding:'utf8',windowsHide:true}).trim();}catch{return 'UNKNOWN';}};
const files=(dir:string):string[]=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(`${dir}/${e.name}`):[`${dir}/${e.name}`]);
const sourceDigest=createHash('sha256');
for(const file of [...files('src'),'package.json','package-lock.json','vite.config.ts'].sort())sourceDigest.update(file).update('\0').update(readFileSync(file)).update('\0');

export default defineConfig({
  plugins: [react()],
  define:{__GIZA_BUILD_METADATA__:JSON.stringify({commit:git(['rev-parse','HEAD']),dirty:git(['status','--porcelain'])!=='',sourceSha256:sourceDigest.digest('hex'),builtAt:new Date().toISOString()})},
  server: { port: 4173, proxy: { '/workbench': workbench, '/api': workbench } },
  preview: { port: 4173, proxy: { '/workbench': workbench, '/api': workbench } },
});
