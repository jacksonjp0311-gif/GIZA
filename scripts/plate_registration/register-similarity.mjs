import {fitFrozen} from './engine.mjs';
try { const out=fitFrozen(process.cwd());console.log(JSON.stringify(out,null,2));if(!out.passed)process.exitCode=2; }
catch(e){console.error(JSON.stringify({error:e.code??'FIT_FAILED',message:e.message}));process.exitCode=1;}
