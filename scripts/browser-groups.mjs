import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const groups={navigation:['startup-camera','viewport-drawers'],spatial:['layers','centered-orbit'],evidence:['evidence-workflow'],atlas:['atlas-expansion'],guidance:['source-campaign','tutorial']};
const all=fs.readdirSync('tests/browser').filter(f=>f.endsWith('.spec.ts')).sort(),assigned=Object.values(groups).flat().map(n=>n+'.spec.ts').sort();
if(JSON.stringify(all)!==JSON.stringify(assigned))throw new Error('Every browser test file must belong to exactly one CI group; update browser-groups.mjs.');
const group=process.argv[2];if(!Object.hasOwn(groups,group))throw new Error('Unknown browser group');
const r=spawnSync('npx playwright test '+groups[group].map(n=>'tests/browser/'+n+'.spec.ts').join(' '),{shell:true,stdio:'inherit',windowsHide:true});process.exitCode=r.status??1;
