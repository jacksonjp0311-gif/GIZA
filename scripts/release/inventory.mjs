import fs from 'node:fs';
import path from 'node:path';
/** Private custody and transient browser reports are never release artifacts. */
export const excludedDirectories=['node_modules','.git','.cache','dist','.vite','.vault-cache','.giza-research','test-results','playwright-report'];
export function releaseTree(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{if(excludedDirectories.includes(e.name)||e.name.endsWith('.tmp'))return [];const p=path.posix.join(dir,e.name);return e.isDirectory()?releaseTree(p):[p.replace(/^\.\//,'')];});}
