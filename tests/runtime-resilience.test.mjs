import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const compile=s=>ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const uri=s=>'data:text/javascript;base64,'+Buffer.from(s).toString('base64');
const runtimeURI=uri(compile(read('src/lib/runtimeData.ts')));
const {runtimeContracts,requiredDatasets,validateRuntimeDocument,createRuntimeLoader,unavailable}=await import(runtimeURI);
const {watchWebGLContext}=await import(uri(compile(read('src/lib/runtimeWebGL.ts'))));
const modelSource=compile(read('src/lib/model.ts')).replace("'./runtimeData'",JSON.stringify(runtimeURI));
const {loadModel}=await import(uri(modelSource));
const fixture=url=>JSON.parse(read('public'+url));
const response=value=>({ok:true,status:200,json:async()=>value});

test('every shipped startup dataset satisfies its runtime contract without rewriting records',()=>{
  assert.equal(Object.keys(runtimeContracts).length,50);
  for(const url of Object.keys(runtimeContracts)){
    const doc=fixture(url),before=JSON.stringify(doc);
    validateRuntimeDocument(url,doc);assert.equal(JSON.stringify(doc),before,url);
  }
});
test('shape validation rejects wrong containers, row types, and nested numeric corruption',()=>{
  for(const url of Object.keys(runtimeContracts))assert.throws(()=>validateRuntimeDocument(url,null),/expected/);
  const frame=fixture('/model/field/geospatial_frame.json');frame.reference_anchor.latitude_deg='29.976';
  assert.throws(()=>validateRuntimeDocument('/model/field/geospatial_frame.json',frame),/latitude_deg/);
  const simulation=fixture('/model/simlab/results/acoustic.known-interiors-screening.json');simulation.response.points[0].frequency_hz=null;
  assert.throws(()=>validateRuntimeDocument('/model/simlab/results/acoustic.known-interiors-screening.json',simulation),/frequency_hz/);
  const photos=fixture('/model/component_research.json');photos.photos[0].bind='part.sarcophagus.body';
  assert.throws(()=>validateRuntimeDocument('/model/component_research.json',photos),/bind/);
});
test('required canonical geometry fails closed on malformed vectors and primitive sizes',()=>{
  const parts=fixture('/model/parts.json');parts.parts[0].spatial.origin_m=[1,2];
  assert.throws(()=>validateRuntimeDocument('/model/parts.json',parts),/3 coordinates/);
  parts.parts[0].spatial.origin_m=[1,2,3];parts.parts[0].spatial.primitive.sx=0;
  assert.throws(()=>validateRuntimeDocument('/model/parts.json',parts),/primitive dimensions/);
  parts.parts[0].spatial.primitive.sx=NaN;
  assert.throws(()=>validateRuntimeDocument('/model/parts.json',parts),/primitive dimensions/);
});
test('duplicate IDs, unknown provenance and invalid masonry cannot enter canonical rendering',()=>{
  const url='/model/parts.json',parts=fixture(url);parts.parts.push(parts.parts[0]);
  assert.throws(()=>validateRuntimeDocument(url,parts),/duplicate record identifiers/);
  parts.parts.pop();parts.parts[0].provenance.class='OBSERVED_BECAUSE_REALISTIC';
  assert.throws(()=>validateRuntimeDocument(url,parts),/unknown provenance/);
  const stone=fixture('/model/stone_field.json');stone.visual_course_count=0;
  assert.throws(()=>validateRuntimeDocument('/model/stone_field.json',stone),/construction dimensions/);
});
test('missing optional bytes yield explicit unavailable diagnostics, never a passing benchmark or zero result',async()=>{
  const diagnostics=[];
  const get=createRuntimeLoader(diagnostics,async()=>({ok:false,status:404}));
  const benchmark=await get('/model/simlab/benchmarks/gravity_benchmark.json');
  assert.equal(benchmark.pass,false);assert.equal(benchmark.benchmark_id,'UNAVAILABLE');
  const gravity=await get('/model/simlab/results/gravity.deep-claim-conditional.json');
  assert.ok(Number.isNaN(gravity.summary.max_magnitude_microgal));
  assert.equal(gravity.status,'UNAVAILABLE');assert.ok(unavailable(diagnostics,'SIMULATION'));
  assert.equal(diagnostics.length,2);assert.ok(diagnostics.every(d=>d.reason==='HTTP 404'));
});
test('invalid JSON, rejected fetches, and malformed optional schemas are quarantined',async()=>{
  for(const fetcher of [async()=>{throw new Error('offline');},async()=>({ok:true,json:async()=>{throw new SyntaxError('invalid JSON');}}),async()=>response({records:'wrong'})]){
    const diagnostics=[],get=createRuntimeLoader(diagnostics,fetcher);
    const result=await get('/model/field/uncertainty_envelopes.json');
    assert.deepEqual(result.records,[]);assert.equal(result.policy,'UNAVAILABLE');
    assert.equal(diagnostics[0].scope,'FIELD');assert.equal(diagnostics[0].status,'UNAVAILABLE');
  }
});
test('missing mandatory data is actionable and cannot be replaced with fabricated defaults',async()=>{
  for(const url of requiredDatasets){
    const diagnostics=[],get=createRuntimeLoader(diagnostics,async()=>({ok:false,status:500}));
    await assert.rejects(get(url),/Required dataset .* unavailable: HTTP 500/);assert.deepEqual(diagnostics,[]);
  }
});
test('malformed observations and orphan source bindings are quarantined without authority fallback',async()=>{
  const url='/model/component_research.json';
  for(const mutate of [doc=>{doc.observations[0].si_value='1.2';},doc=>{doc.observations[0].source='unknown-source';},doc=>{doc.observations[0].value={observed:true};}]){
    const doc=fixture(url);mutate(doc);const diagnostics=[];
    const data=await createRuntimeLoader(diagnostics,async()=>response(doc))(url);
    assert.deepEqual(data.observations,[]);assert.deepEqual(data.sources,[]);assert.equal(data.reviewed,'UNAVAILABLE');
    assert.equal(diagnostics[0].scope,'COMPONENT');assert.match(diagnostics[0].reason,/observation/);
  }
});
test('healthy loader preserves source objects and unrecognized extension fields byte-equivalently',async()=>{
  const url='/model/component_research.json',doc=fixture(url);doc.future_contract={authority:'HYPOTHESIS'};
  const diagnostics=[],get=createRuntimeLoader(diagnostics,async()=>response(doc));
  assert.equal(await get(url),doc);assert.deepEqual(diagnostics,[]);
});
test('complete workstation loads when all optional research datasets are unavailable',async()=>{
  const original=globalThis.fetch;
  globalThis.fetch=async url=>requiredDatasets.has(url)?response(fixture(url)):({ok:false,status:503});
  try{
    const model=await loadModel();assert.equal(model.parts.length,56);assert.equal(model.runtimeDiagnostics.length,45);
    assert.equal(model.simlab.acoustic.status,'UNAVAILABLE');assert.equal(model.maps.manifest.title,'UNAVAILABLE');
    assert.deepEqual(model.field.uncertaintyCatalog.records,[]);assert.deepEqual(model.componentResearch.observations,[]);
    assert.ok(model.runtimeDiagnostics.some(d=>d.scope==='COMPONENT'));
  }finally{globalThis.fetch=original;}
});
test('diagnostics do not leak between retries and healthy load retains the full research corpus',async()=>{
  const original=globalThis.fetch;globalThis.fetch=async url=>response(fixture(url));
  try{const model=await loadModel();assert.deepEqual(model.runtimeDiagnostics,[]);assert.ok(model.findings.entries.length>30);assert.ok(model.componentResearch.photos.length>0);}
  finally{globalThis.fetch=original;}
});
test('WebGL loss is cancelable, restoration clears status, and unmount removes listeners',()=>{
  const canvas=new EventTarget(),states=[],cleanup=watchWebGLContext(canvas,state=>states.push(state));
  const loss=new Event('webglcontextlost',{cancelable:true});canvas.dispatchEvent(loss);
  assert.equal(loss.defaultPrevented,true);canvas.dispatchEvent(new Event('webglcontextrestored'));assert.deepEqual(states,[true,false]);
  cleanup();canvas.dispatchEvent(new Event('webglcontextlost'));assert.deepEqual(states,[true,false]);
});
test('heavy optional workspaces have lazy entries, recoverable boundaries and data guards',()=>{
  const source=read('src/workstation/OptionalWorkspaces.tsx');assert.match(source,/lazy\(\(\)=>import\('\.\/ComponentWorkbench'\)/);assert.match(source,/lazy\(\(\)=>import\('\.\.\/maps\/MapAtlasPanel'\)/);
  assert.match(source,/WorkspaceBoundary/);assert.match(source,/UnavailableDataset/);
  const viewport=read('src/workstation/SpatialViewport.tsx');assert.match(viewport,/simulationVisible=\{showSimulation&&!inspection&&simulationAvailable&&reality.HYPOTHESIS\}/);
  assert.match(viewport,/showStoneField=\{showStoneField&&!inspection&&reality.HYPOTHESIS\}/);
  assert.match(viewport,/showUnverified=\{showUnverified&&!inspection&&reality.HYPOTHESIS\}/);
  const inspector=read('src/workstation/ObjectInspectorPanel.tsx');assert.match(inspector,/tab === 'SIMULATION' && !blockedScope/);
});
