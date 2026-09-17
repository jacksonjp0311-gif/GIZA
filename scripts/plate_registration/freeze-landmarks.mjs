import fs from 'node:fs';
import {freezeLandmarks} from './engine.mjs';
try {
  const index=process.argv.indexOf('--input');
  if(index<0||!process.argv[index+1])throw new Error('Provide --input <landmark-json>. See docs/REGISTRATION_WORKBENCH.md.');
  const out=freezeLandmarks(process.cwd(),JSON.parse(fs.readFileSync(process.argv[index+1],'utf8')));
  console.log(JSON.stringify(out,null,2));
} catch(e) { console.error(JSON.stringify({error:e.code??'FREEZE_FAILED',message:e.message}));process.exitCode=1; }
