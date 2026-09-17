import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
async function load(file){const r=await build({entryPoints:[new URL('../src/evidence/'+file,import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')],bundle:true,write:false,format:'esm',platform:'node'});return import('data:text/javascript;base64,'+Buffer.from(r.outputFiles[0].text).toString('base64'));}
const {buildKhafreAssembly,BODY_FRAME,LID_FRAME,ASSEMBLY_FRAME}=await load('assembly.ts');
const {pointForDisplay,pickCanonical,featureAnchors,assemblySections}=await load('viewGeometry.ts');
const {inspectionPose,displayPoint,physicalPoint,validateBookmark}=await load('presentation.ts');
const {measurePoints}=await load('spatial.ts');
const read=p=>JSON.parse(fs.readFileSync(new URL('../public/model/'+p,import.meta.url),'utf8'));
const assembly=buildKhafreAssembly({parts:read('parts.json').parts,measurements:read('research/measurements.json').measurements,componentResearch:read('component_research.json'),sourceRegistry:read('evidence/source_registry.json').sources});
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('physical picks round trip through display poses at every explosion distance',()=>{
  for(const f of assembly.features)for(const p of featureAnchors(f))for(const explode of [0,.2,1,3]){
    const shown=pointForDisplay(assembly,f,p,explode),picked=pickCanonical(assembly,f,shown,explode);
    picked.position.forEach((v,i)=>near(v,p[i]));assert.equal(picked.frameId,f.frameId);
  }
});
test('lid visual parking never resolves its physical placement or changes local distance',()=>{
  const f=assembly.features.find(f=>f.id==='feature.dimension.m.coffer.lid_length');
  const [a,b]=featureAnchors(f);
  for(const explode of [0,.8,2,3]){
    const p=pickCanonical(assembly,f,pointForDisplay(assembly,f,a,explode),explode),q=pickCanonical(assembly,f,pointForDisplay(assembly,f,b,explode),explode);
    near(measurePoints(assembly,p,q,LID_FRAME).value,f.value);
    assert.equal(measurePoints(assembly,p,q,ASSEMBLY_FRAME).status,'UNKNOWN');
  }
});
test('section cap excludes the cavity and unknown lid, with no shared-base double count',()=>{
  const value=id=>assembly.observations.find(o=>o.id===id).value;
  const ring=value('m.coffer.outer_length')*value('m.coffer.outer_width')-value('m.coffer.inner_length')*value('m.coffer.inner_width');
  for(const offset of [-.3,-value('m.coffer.inner_depth')]){
    const cuts=assemblySections(assembly,{frameId:BODY_FRAME,normal:[0,0,1],offset});
    near(cuts.reduce((s,c)=>s+c.area,0),ring);assert.ok(cuts.every(c=>!c.featureId.includes('lid')));
  }
});
test('section results agree in object and assembly frames and support non-unit normals',()=>{
  const object=assemblySections(assembly,{frameId:BODY_FRAME,normal:[0,0,1],offset:-.3});
  const shared=assemblySections(assembly,{frameId:ASSEMBLY_FRAME,normal:[0,0,2],offset:-.6});
  near(object.reduce((s,c)=>s+c.area,0),shared.reduce((s,c)=>s+c.area,0));
});
test('bookmark and display input guards reject nonfinite data and cameras at target',()=>{
  for(const value of [null,{}, {name:'a',position:[0,0,0],target:[0,0,0]}, {name:'x',position:[Infinity,0,0],target:[0,0,0]}])assert.throws(()=>validateBookmark(value));
  assert.deepEqual(validateBookmark({name:'View',position:[1,2,3],target:[0,0,0]}),{name:'View',position:[1,2,3],target:[0,0,0]});
  assert.deepEqual(inspectionPose('lid',NaN),inspectionPose('lid',0));
  const pose=inspectionPose('lid',2),p=[.1,.2,.3];physicalPoint(displayPoint(p,pose),pose).forEach((v,i)=>near(v,p[i]));
});
test('contextual tool keyboard routing and selections cannot modify physical geometry',()=>{
  const scene=fs.readFileSync(new URL('../src/evidence/AssemblyScene.tsx',import.meta.url),'utf8'),app=fs.readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
  assert.ok(app.includes('[data-evidence-workbench]'));assert.ok(!scene.includes('scale='));assert.ok(scene.includes('clip.some(p=>p.distanceToPoint(e.point)'));
  assert.ok(scene.includes('rotation={rotation}'));assert.ok(scene.includes('plane.offset/Math.hypot(...plane.normal)'));
});
test('short landscape keeps a viewport-focused layout and honest candidate uncertainty',()=>{
  const css=fs.readFileSync(new URL('../src/evidence/evidence.css',import.meta.url),'utf8'),panel=fs.readFileSync(new URL('../src/evidence/InvestigationPanel.tsx',import.meta.url),'utf8');
  assert.ok(css.includes('@media(max-height:560px)'));assert.ok(css.includes('.app:has(.evidenceWorkbench)>.topbar'));
  assert.ok(panel.includes('formatValue(candidate.uncertainty.value,candidate.uncertainty.unit)'));
});
test('investigation drafts stay mounted while following evidence or closing a panel',()=>{
  const workbench=fs.readFileSync(new URL('../src/evidence/AssemblyWorkbench.tsx',import.meta.url),'utf8');
  assert.ok(workbench.includes('className="evidencePanel" hidden={!panel}'));
  assert.ok(workbench.includes('<div hidden={panel!==\'INVESTIGATE\'}>'));
  assert.ok(!workbench.includes("{panel==='INVESTIGATE'&&"));
});
test('residual keyboard focus uses a non-scaling marker, not a metre-sized CSS outline',()=>{
  const css=fs.readFileSync(new URL('../src/evidence/evidence.css',import.meta.url),'utf8'),panel=fs.readFileSync(new URL('../src/evidence/ComparisonPanel.tsx',import.meta.url),'utf8');
  assert.ok(css.includes('.evidenceCompareViewport g:focus-visible{outline:none}'));
  assert.ok(css.includes('vector-effect:non-scaling-stroke'));
  assert.ok(panel.includes('role="group"'));assert.ok(panel.includes('aria-pressed={active===v.id}'));
  assert.ok(panel.includes('e.preventDefault();setActive(v.id)'));
});
