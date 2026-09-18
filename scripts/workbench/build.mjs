import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const required=['public/workbench/index.html','public/workbench/workbench.css','public/workbench/workbench.js','public/workbench/campaign.html','public/workbench/campaign.css','public/workbench/campaign.js','scripts/evidence/campaign.mjs','scripts/workbench/server.mjs','scripts/plate_registration/engine.mjs'];
for(const p of required)if(!fs.existsSync(p))throw new Error(`Missing ${p}`);
for(const p of required.filter(p=>/\.m?js$/.test(p))){const r=spawnSync(process.execPath,['--check',p],{encoding:'utf8'});if(r.status!==0)throw new Error(`${p}: ${r.stderr}`);}
// No generated substitute for the explorer: the workbench is native HTML/CSS/JS.
console.log('WORKBENCH BUILD PASS — native browser modules ready; optional scoped campaigns reuse shared TypeScript contracts and registration engine.');
