import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url);
async function load(name){
  const source=fs.readFileSync(new URL('../src/sphinx/'+name,import.meta.url),'utf8');
  const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace(/from ['"]three['"]/g,`from '${pathToFileURL(require.resolve('three')).href}'`);
  return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
}
const {SPHINX_REGIONS,SPHINX_SOURCES,regionOffset,repairBlocks}=await load('catalog.ts');
const {bodyGeometry,chestGeometry,pawGeometry,headGeometry,nemesGeometry,tailGeometry,stelaGeometry}=await load('geometry.ts');
const {SPHINX_DIMENSIONS}=await load('specifications.ts');
const {SPHINX_PHOTOS}=await load('references.ts');
const lofts=[bodyGeometry,chestGeometry,headGeometry,()=>pawGeometry(1),()=>pawGeometry(-1),()=>nemesGeometry(1),()=>nemesGeometry(-1)];
test('Sphinx catalog has unique explicit study regions and authoritative source links',()=>{
  assert.equal(SPHINX_REGIONS.length,10);assert.equal(new Set(SPHINX_REGIONS.map(r=>r.id)).size,10);
  for(const r of SPHINX_REGIONS){assert.ok(r.note.length>30);assert.ok(r.target.every(Number.isFinite));assert.ok(r.radius>0);}
  assert.equal(SPHINX_SOURCES.length,4);for(const s of SPHINX_SOURCES)assert.ok(s.url.startsWith('https://'));
});
test('assembled pose is unshifted and explosion clamps nonfinite/out-of-range values',()=>{
  for(const r of SPHINX_REGIONS){assert.ok(regionOffset(r.id,0).every(v=>v===0));assert.ok(regionOffset(r.id,NaN).every(v=>v===0));assert.deepEqual(regionOffset(r.id,100),regionOffset(r.id,2));assert.ok(regionOffset(r.id,-1).every(v=>v===0));}
});
test('explosion is deterministic, reversible, and leaves source offsets untouched',()=>{
  const before=JSON.stringify(SPHINX_REGIONS);assert.deepEqual(regionOffset('head',1),[8,0,17]);regionOffset('head',2);assert.deepEqual(regionOffset('head',1),[8,0,17]);assert.equal(JSON.stringify(SPHINX_REGIONS),before);
});
test('repair-block field is deterministic, finite, bounded and nonrandom',()=>{
  const blocks=repairBlocks();assert.equal(blocks.length,250);assert.deepEqual(blocks,repairBlocks());
  for(const b of blocks){assert.ok(b.position.every(Number.isFinite));assert.ok(b.size.every(n=>n>0));assert.ok(b.course>=0&&b.course<5);}
});
test('Sphinx surfaces have finite positions, normals and triangle indices',()=>{
  for(const build of [...lofts,tailGeometry]){
    const g=build(),p=g.getAttribute('position'),n=g.getAttribute('normal');assert.ok(p.count>100);assert.equal(p.count,n.count);
    assert.ok([...p.array,...n.array].every(Number.isFinite));if(g.index)assert.ok([...g.index.array].every(i=>i>=0&&i<p.count));g.dispose();
  }
});
test('every anatomical loft has closed topology and outward winding',()=>{
  for(const build of lofts){
    const g=build(),p=g.getAttribute('position'),ix=g.index.array,edges=new Map();let volume=0;
    for(let i=0;i<ix.length;i+=3){
      const [a,b,c]=[ix[i],ix[i+1],ix[i+2]];
      for(const [u,v] of [[a,b],[b,c],[c,a]]){const key=[Math.min(u,v),Math.max(u,v)].join(':');const e=edges.get(key)??[0,0];e[0]++;e[1]+=u<v?1:-1;edges.set(key,e);}
      volume+=(p.getX(a)*(p.getY(b)*p.getZ(c)-p.getZ(b)*p.getY(c))+p.getY(a)*(p.getZ(b)*p.getX(c)-p.getX(b)*p.getZ(c))+p.getZ(a)*(p.getX(b)*p.getY(c)-p.getY(b)*p.getX(c)))/6;
    }
    for(const [count,balance] of edges.values()){assert.equal(count,2);assert.equal(balance,0);}
    assert.ok(volume>1,`Positive enclosed volume: ${volume}`);g.dispose();
  }
});
test('flattened paws preserve bilateral position and overall eastward envelope',()=>{
  const north=pawGeometry(1),south=pawGeometry(-1),a=north.getAttribute('position'),b=south.getAttribute('position');
  assert.equal(a.count,b.count);for(let i=0;i<a.count;i++){assert.equal(a.getX(i),b.getX(i));assert.equal(a.getZ(i),b.getZ(i));assert.ok(Math.abs(a.getY(i)-b.getY(i)-10)<.00001);}
  assert.equal(north.boundingBox.max.x,40.5);assert.ok(north.boundingBox.min.z>=0);north.dispose();south.dispose();
});
test('offline comparison photographs have credited licenses and matching source-byte hashes',()=>{
  assert.equal(SPHINX_PHOTOS.length,3);
  for(const p of SPHINX_PHOTOS){
    assert.ok(p.author.length>5);assert.match(p.licenseUrl,/^https:\/\/creativecommons.org\//);assert.ok(p.width>1000&&p.height>1000);
    const bytes=fs.readFileSync(new URL('../public'+p.file,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),p.sha256);
    assert.ok(SPHINX_REGIONS.some(r=>r.id===p.region));
  }
});
test('heavy viewers load on demand and Escape respects the inscription modal',()=>{
  const read=p=>fs.readFileSync(new URL('../src/'+p,import.meta.url),'utf8');
  assert.match(read('sphinx/SphinxEntry.tsx'),/lazy\(\(\)=>import\('\.\/SphinxWorkbench'\)/);
  assert.match(read('epigraphy/InscriptionLauncher.tsx'),/lazy\(\(\)=>import\('\.\/InscriptionLab'\)/);
  assert.ok(read('sphinx/SphinxWorkbench.tsx').includes("!document.querySelector('[data-epigraphy]')"));
});
test('interpreted body and head stay in the documented display envelope',()=>{
  const body=bodyGeometry(),head=headGeometry();body.computeBoundingBox();head.computeBoundingBox();
  assert.equal(body.boundingBox.min.x,-33);assert.equal(body.boundingBox.max.x,19);assert.ok(body.boundingBox.min.z>=0);assert.equal(head.boundingBox.max.z,20);assert.ok(head.boundingBox.min.z>13);body.dispose();head.dispose();
});
test('new workspace does not write to canonical archaeological data',()=>{
  const app=fs.readFileSync(new URL('../src/sphinx/SphinxWorkbench.tsx',import.meta.url),'utf8');
  assert.ok(app.includes('ILLUSTRATIVE_RECONSTRUCTION'));assert.ok(app.includes('not_a_survey:true'));assert.ok(!app.includes('fetch('));
});
test('stela mesh obeys its chosen published height while preserving conflicting source summaries',()=>{
  const g=stelaGeometry();assert.ok(Math.abs(g.boundingBox.max.z-g.boundingBox.min.z-3.5)<.00001);
  assert.equal(SPHINX_DIMENSIONS.find(d=>d.id==='stela').metres,3.5);assert.equal(SPHINX_DIMENSIONS.find(d=>d.id==='stela-alt').metres,3.6);
  assert.ok(SPHINX_DIMENSIONS.every(d=>d.source.startsWith('https://')&&d.binding));g.dispose();
});
