import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
async function load(file){const code=ts.transpileModule(fs.readFileSync(new URL('../src/lib/'+file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));}
const {sanitizeWorkspace,startupWorkspace,DEFAULT_WORKSPACE}=await load('workspace.ts');
const {searchParts}=await load('search.ts');
const parts=JSON.parse(fs.readFileSync(new URL('../public/model/parts.json',import.meta.url))).parts;
test('corrupt workspace inputs fall back safely',()=>{for(const value of [null,[],true,'oops',{version:99}])assert.deepEqual(sanitizeWorkspace(value),DEFAULT_WORKSPACE);});
test('nonfinite controls and invalid enums cannot crash camera',()=>{const s=sanitizeWorkspace({version:1,viewPreset:'oops',mode:'bad',sectionAxis:'bad',explode:NaN,animationSpeed:Infinity,showDimensions:'yes',layers:{xray:'true',photos:false}});assert.equal(s.viewPreset,'PERSPECTIVE');assert.equal(s.explode,0);assert.equal(s.animationSpeed,1);assert.equal(s.layers.xray,false);assert.equal(s.layers.photos,false);assert.equal(s.showDimensions,false);});
test('numeric workspace values clamp to control limits',()=>{const s=sanitizeWorkspace({version:1,explode:99,animationSpeed:-5,sectionPos:1e8});assert.equal(s.explode,2.75);assert.equal(s.animationSpeed,.25);assert.equal(s.sectionPos,1000);});
test('workspace sanitizer does not mutate shared defaults',()=>{const s=sanitizeWorkspace({version:1,layers:{xray:true}});s.layers.photos=false;assert.equal(DEFAULT_WORKSPACE.layers.xray,false);assert.equal(DEFAULT_WORKSPACE.layers.photos,true);});
test('search matches all words across names and IDs',()=>{assert.equal(searchParts(parts,'granite sarcophagus').length,1);assert.equal(searchParts(parts,'  SARCOPhagus ').length,2);assert.equal(searchParts(parts,'no-such-object').length,0);assert.equal(searchParts(parts,' ').length,0);});
test('search never upgrades hypothesis status',()=>{const found=searchParts(parts,'UNVERIFIED');assert.equal(found.length,31);assert.ok(found.every(p=>p.provenance.class==='UNVERIFIED'));});
test('selection cannot change monument geometry scale',()=>{const source=fs.readFileSync(new URL('../src/scene/MonumentLayer.tsx',import.meta.url),'utf8');assert.ok(!source.includes('1.018'));});
test('startup discards transient camera and explosion while retaining display preferences',()=>{
  const saved=sanitizeWorkspace({version:1,selectedId:'part.shaft.alpha.1',viewPreset:'UNDERGROUND',explode:2.75,sectionAxis:'Z',sectionPos:15,layers:{exterior:false,subsurface:true,xray:true,simulation:true,photos:false},showLabels:false});
  const bytes=JSON.stringify(saved),opened=startupWorkspace(saved);
  assert.equal(opened.selectedId,'part.pyramid.khafre');assert.equal(opened.viewPreset,'PERSPECTIVE');assert.equal(opened.explode,0);assert.equal(opened.sectionAxis,'OFF');assert.equal(opened.layers.exterior,true);
  for(const key of ['subsurface','xray','simulation'])assert.equal(opened.layers[key],false);
  assert.equal(opened.layers.photos,false);assert.equal(opened.showLabels,false);assert.equal(JSON.stringify(saved),bytes);
});
