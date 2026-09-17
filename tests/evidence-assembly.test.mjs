import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {build} from 'esbuild';
async function load(file){const result=await build({entryPoints:[new URL('../src/evidence/'+file,import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')],bundle:true,write:false,format:'esm',platform:'node'});return import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));}
const {buildKhafreAssembly,visibleFeatures,REALITY_STYLES,ASSEMBLY_FRAME,BODY_FRAME,LID_FRAME,MONUMENT_FRAME,SITE_FRAME}=await load('assembly.ts');
const {rigidMatrix,identityMatrix,invertRigid,transformPoint,validateRigidMatrix,multiplyMatrices,resolveTransform,pointInFrame,measurePoints,measureAngle,sectionBox,polygonArea,exportCanonicalAssembly,importCanonicalAssembly}=await load('spatial.ts');
const {legacyObjectAuthority,sphinxObjectAuthority,objectVisibleInRealityLayer,DEFAULT_REALITY_LAYERS}=await load('authority.ts');
const read=p=>JSON.parse(fs.readFileSync(new URL('../public/model/'+p,import.meta.url),'utf8'));
const model={parts:read('parts.json').parts,measurements:read('research/measurements.json').measurements,componentResearch:read('component_research.json'),sourceRegistry:read('evidence/source_registry.json').sources};
const assembly=buildKhafreAssembly(model), near=(a,b,epsilon=1e-9)=>assert.ok(Math.abs(a-b)<epsilon,`${a} != ${b}`);
const feature=id=>assembly.features.find(f=>f.id===id);
const point=(position,frameId=BODY_FRAME)=>({position,frameId});
const scalar=id=>assembly.observations.find(o=>o.id===id).value;

test('building assembly preserves exact canonical input and deterministic contract',()=>{
  const before=JSON.stringify(model);assert.deepEqual(buildKhafreAssembly(model),assembly);assert.equal(JSON.stringify(model),before);
  const expected={'parts.json':'a7a1ce355cd3da7256ae5793b9ce7b3fa317908ff25a219a4845c3c65bc4e21a','research/measurements.json':'8f6bc61927821986d0982dd672b7be4920ce28420f690f6fbd7638490261c793'};
  for(const [file,hash] of Object.entries(expected))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../public/model/'+file,import.meta.url))).digest('hex'),hash);
});
test('rigid transforms round trip after 10000 iterations without scale/drift',()=>{
  const m=rigidMatrix([103.124,-211.782,.002],.583),inverse=invertRigid(m),original=[.201,2.346,-.612];let p=[...original];
  for(let i=0;i<10000;i++)p=transformPoint(inverse,transformPoint(m,p));p.forEach((v,i)=>near(v,original[i],1e-8));
  multiplyMatrices(inverse,m).forEach((v,i)=>near(v,identityMatrix()[i]));
});
test('metric transforms reject scale, shear, reflection, NaN and non-affine matrices',()=>{
  for(const change of [[0,1.01],[1,.1],[0,-1],[3,NaN],[15,0]]){const m=identityMatrix();m[change[0]]=change[1];assert.throws(()=>validateRigidMatrix(m));}
});
test('explicit frame hierarchy blocks unresolved monument/world and detached lid',()=>{
  assert.ok(resolveTransform(assembly.frames,assembly.transforms,BODY_FRAME,ASSEMBLY_FRAME));
  for(const [a,b] of [[BODY_FRAME,MONUMENT_FRAME],[ASSEMBLY_FRAME,SITE_FRAME],[LID_FRAME,ASSEMBLY_FRAME]])assert.equal(resolveTransform(assembly.frames,assembly.transforms,a,b),null);
  assert.ok(resolveTransform(assembly.frames,assembly.transforms,ASSEMBLY_FRAME,MONUMENT_FRAME,'COMPARISON_ONLY'));
});
test('frame graph rejects inconsistent alternative transform paths',()=>{
  const resolved=assembly.transforms.find(t=>t.id==='transform.coffer.assembly');
  assert.throws(()=>resolveTransform(assembly.frames,[resolved,{...resolved,id:'bad',matrix:rigidMatrix([0,0,0])}],BODY_FRAME,ASSEMBLY_FRAME),/Conflicting/);
});
test('legacy/detail disagreements are quantified without canonical rewrite',()=>{
  const axis=assembly.audit.find(a=>a.id==='audit.coffer.axis'),rim=assembly.audit.find(a=>a.id==='audit.coffer.floor-rim');
  near(axis.difference,Math.PI/2);near(rim.difference,-scalar('m.coffer.outer_height'));
  for(const a of assembly.audit)if(a.difference!==null)near(a.difference,a.detailValue-a.legacyValue);
  assert.ok(assembly.transforms.find(t=>t.id==='comparison.assembly.legacy-floor').scope==='COMPARISON_ONLY');
});
test('detail agreement is constrained by exact west/north clearance records',()=>{
  const m=resolveTransform(assembly.frames,assembly.transforms,BODY_FRAME,ASSEMBLY_FRAME);
  const west=feature('feature.chamber.west').geometry.vertices[0][0],north=feature('feature.chamber.north').geometry.vertices[0][1];
  const box=feature('feature.coffer.wall.west').geometry,northBox=feature('feature.coffer.wall.north').geometry;
  near(transformPoint(m,box.min)[0]-west,scalar('coffer.west_clearance'));
  near(north-transformPoint(m,northBox.max)[1],scalar('coffer.north_clearance'));
});
test('measurement invariance under selection, isolation, explosion and animation',()=>{
  const a=point([-scalar('m.coffer.outer_width')/2,0,0]),b=point([scalar('m.coffer.outer_width')/2,0,0]);
  const baseline=measurePoints(assembly,a,b,ASSEMBLY_FRAME),serialized=exportCanonicalAssembly(assembly);
  for(const selected of [null,'feature.coffer.wall.west'])for(const explode of [0,.5,12]){
    const ui={...assembly,selection:selected,explode,isolate:true,animationTime:132,presentationPose:{translation:[99,-60,25],scale:50}};
    assert.deepEqual(measurePoints(ui,a,b,ASSEMBLY_FRAME),baseline);assert.equal(exportCanonicalAssembly(ui),serialized);
  }
  near(baseline.value,scalar('m.coffer.outer_width'));assert.equal(baseline.frameId,ASSEMBLY_FRAME);
});
test('cross-object lid/body measurements are UNKNOWN, local lid dimensions remain measurable',()=>{
  const unknown=measurePoints(assembly,point([0,0,0]),point([0,0,0],LID_FRAME),ASSEMBLY_FRAME);
  assert.equal(unknown.status,'UNKNOWN');assert.equal(unknown.value,null);
  near(measurePoints(assembly,point([0,0,0],LID_FRAME),point([0,scalar('m.coffer.lid_length'),0],LID_FRAME),LID_FRAME).value,scalar('m.coffer.lid_length'));
  assert.equal(pointInFrame(assembly,point([0,0,0]),SITE_FRAME),null);
});
test('angles use canonical coordinates and reject coincident or unresolved inputs',()=>{
  near(measureAngle(assembly,point([1,0,0]),point([0,0,0]),point([0,1,0]),BODY_FRAME).value,90);
  assert.equal(measureAngle(assembly,point([0,0,0]),point([0,0,0]),point([0,1,0]),BODY_FRAME).value,null);
  assert.equal(measureAngle(assembly,point([1,0,0]),point([0,0,0]),point([0,1,0],LID_FRAME),BODY_FRAME).value,null);
});
test('reality layers isolate actual spatial objects independently',()=>{
  for(const authority of ['OBSERVED','RECONSTRUCTED','HYPOTHESIS']){
    const only=visibleFeatures(assembly,{OBSERVED:authority==='OBSERVED',RECONSTRUCTED:authority==='RECONSTRUCTED',HYPOTHESIS:authority==='HYPOTHESIS'});
    assert.ok(only.length);assert.ok(only.every(f=>f.authority===authority));
  }
  assert.deepEqual(visibleFeatures(assembly,{OBSERVED:false,RECONSTRUCTED:false,HYPOTHESIS:false}),[]);
  assert.equal(new Set(Object.values(REALITY_STYLES).map(s=>s.color)).size,3);
  assert.ok(assembly.features.filter(f=>f.geometry.kind==='box'||f.geometry.kind==='surface').every(f=>f.authority==='RECONSTRUCTED'));
});
test('measured dimension features bind their exact scalar, units, locator and recorded uncertainty',()=>{
  const f=feature('feature.dimension.m.coffer.outer_length');assert.deepEqual(f.observationIds,['m.coffer.outer_length']);
  near(f.value,103.68*.0254);near(f.uncertainty.value,.000508);assert.equal(f.unit,'m');assert.equal(f.coordinateAuthority,'RECONSTRUCTED');
  const record=assembly.observations.find(o=>o.id===f.observationIds[0]);assert.match(record.locator,/77/);assert.equal(record.sourceId,'src.petrie1883');
  const width=feature('feature.dimension.m.coffer.outer_width');assert.equal(width.uncertainty.status,'UNKNOWN');assert.equal(width.uncertainty.value,null);
});
test('every feature resolves observations and every observation resolves source metadata',()=>{
  for(const f of assembly.features)for(const id of f.observationIds)assert.ok(assembly.observations.some(o=>o.id===id),`${f.id} => ${id}`);
  for(const o of assembly.observations)assert.ok(assembly.sources.some(s=>s.id===o.sourceId));
  assert.ok(assembly.sources.every(s=>s.byteStatus==='UNKNOWN'));
  assert.ok(assembly.features.filter(f=>f.authority==='OBSERVED').every(f=>f.geometry.kind!=='box'&&f.geometry.kind!=='surface'));
});
test('lid fit, physical pose and unmapped pin/groove/recess geometry remain UNKNOWN',()=>{
  const fit=assembly.constraints.find(c=>c.id==='constraint.lid.fit');assert.equal(fit.status,'UNKNOWN');assert.equal(fit.value,null);
  assert.equal(feature('feature.lid.closure-hypothesis').geometry.kind,'unknown');
  for(const p of ['feature.coffer.pin.n','feature.coffer.pin.s']){assert.equal(feature(p).geometry.kind,'point');assert.match(feature(p).unknowns.join(' '),/depth/);}
  assert.match(feature('feature.chamber.floor').unknowns.join(' '),/recess/);
});
test('body solid decomposition preserves hollow cavity without overlap or invented fill',()=>{
  const boxes=assembly.features.filter(f=>f.objectId==='part.sarcophagus.body'&&f.geometry.kind==='box').map(f=>f.geometry);
  assert.equal(boxes.length,5);
  const volume=boxes.reduce((sum,b)=>sum+b.max.map((v,i)=>v-b.min[i]).reduce((a,b)=>a*b,1),0);
  near(volume,scalar('m.coffer.outer_width')*scalar('m.coffer.outer_length')*scalar('m.coffer.outer_height')-scalar('m.coffer.inner_width')*scalar('m.coffer.inner_length')*scalar('m.coffer.inner_depth'));
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const overlap=[0,1,2].map(k=>Math.max(0,Math.min(boxes[i].max[k],boxes[j].max[k])-Math.max(boxes[i].min[k],boxes[j].min[k]))).reduce((a,b)=>a*b,1);near(overlap,0);}
});
test('orthogonal section caps preserve cavity opening and exact model section area',()=>{
  const boxes=assembly.features.filter(f=>f.objectId==='part.sarcophagus.body'&&f.geometry.kind==='box').map(f=>f.geometry);
  const area=boxes.reduce((sum,b)=>sum+polygonArea(sectionBox(b,{frameId:BODY_FRAME,normal:[0,0,1],offset:-.3})),0);
  near(area,scalar('m.coffer.outer_width')*scalar('m.coffer.outer_length')-scalar('m.coffer.inner_width')*scalar('m.coffer.inner_length'));
});
test('oblique sections are ordered coplanar polygons with no invented caps outside volume',()=>{
  const cube={kind:'box',min:[-1,-1,-1],max:[1,1,1]},polygon=sectionBox(cube,{frameId:BODY_FRAME,normal:[1,1,1],offset:0});
  assert.equal(polygon.length,6);for(const p of polygon)near(p.reduce((a,b)=>a+b,0),0);near(polygonArea(polygon),3*Math.sqrt(3));
  assert.deepEqual(sectionBox(cube,{frameId:BODY_FRAME,normal:[0,0,1],offset:3}),[]);
  assert.throws(()=>sectionBox(cube,{frameId:BODY_FRAME,normal:[0,0,0],offset:0}));
});
test('coordinate export/import round trip preserves units, axes, datums, unknowns and all receipts',()=>{
  const roundtrip=importCanonicalAssembly(exportCanonicalAssembly(assembly));assert.deepEqual(roundtrip,assembly);
  assert.equal(roundtrip.frames.find(f=>f.id===SITE_FRAME).status,'UNRESOLVED');assert.equal(roundtrip.frames[0].units,'m');
  roundtrip.frames[0].datum='changed';assert.notEqual(roundtrip.frames[0].datum,assembly.frames[0].datum);
});
test('trust boundary rejects malformed frames, invalid geometry and forged finite certainty',()=>{
  for(const mutate of [a=>a.frames[0].units='mm',a=>a.frames[0].axes.z='-UP',a=>a.frames[0].handedness='LEFT_HANDED',a=>a.features[0].geometry.min[0]=NaN,a=>a.observations[0].uncertainty={status:'KNOWN',value:null,unit:'m',note:'bad'},a=>a.transforms[0].matrix[0]=2,a=>a.features[0].observationIds=['missing'],a=>a.features[0].coordinateAuthority='OBSERVED',a=>a.observations[0].sourceId='missing',a=>a.sources[0].url='javascript:alert(1)',a=>a.constraints[0].featureIds=['missing'],a=>a.audit[0].difference=Infinity]){
    const changed=structuredClone(assembly);mutate(changed);assert.throws(()=>importCanonicalAssembly(changed));
  }
});
test('malformed points and planes fail closed rather than returning NaN geometry',()=>{
  assert.throws(()=>transformPoint(identityMatrix(),[0,1]));assert.throws(()=>transformPoint(identityMatrix(),[0,1,NaN]));
  assert.throws(()=>sectionBox({kind:'box',min:[0,0],max:[1,1,1]},{frameId:BODY_FRAME,normal:[0,0,1],offset:0}));
  assert.throws(()=>sectionBox({kind:'box',min:[0,0,0],max:[1,1,1]},{frameId:BODY_FRAME,normal:[1,0],offset:0}));
});
test('missing optional observations become explicit unknown graph records without crashing core',()=>{
  const incomplete=buildKhafreAssembly({...model,componentResearch:{...model.componentResearch,observations:[],sources:[]}});
  assert.equal(incomplete.transforms.find(t=>t.id==='transform.coffer.assembly').status,'UNRESOLVED');
  assert.equal(incomplete.observations.find(o=>o.id==='coffer.west_clearance').status,'MISSING');
  assert.ok(incomplete.features.some(f=>f.geometry.kind==='box'));assert.doesNotThrow(()=>importCanonicalAssembly(incomplete));
});
test('missing/invalid core dimensions never invent a replacement body',()=>{
  for(const bad of [undefined,NaN,-1]){
    const measurements=model.measurements.filter(m=>m.id!=='m.coffer.inner_depth');if(bad!==undefined)measurements.push({...model.measurements.find(m=>m.id==='m.coffer.inner_depth'),si_value:bad});
    const incomplete=buildKhafreAssembly({...model,measurements});assert.ok(!incomplete.features.some(f=>f.objectId==='part.sarcophagus.body'&&f.geometry.kind==='box'));
    assert.equal(incomplete.features.find(f=>f.id==='feature.coffer.body.unknown').geometry.kind,'unknown');assert.doesNotThrow(()=>importCanonicalAssembly(incomplete));
  }
});
test('chamber surfaces are hollow-space boundaries, not solid wall envelopes or invented connected tunnels',()=>{
  const chamber=assembly.features.filter(f=>f.objectId==='part.burial.chamber');assert.ok(chamber.every(f=>f.geometry.kind!=='box'));
  assert.equal(assembly.constraints.find(c=>c.id==='constraint.chamber.connection').status,'UNKNOWN');
  assert.match(feature('feature.chamber.doorway').unknowns.join(' '),/height/);
});
test('legacy measured-provenance meshes cannot be promoted to observed survey surfaces',()=>{
  const before=JSON.stringify(model.parts);
  for(const part of model.parts){const object=legacyObjectAuthority(part);assert.notEqual(object.authority,'OBSERVED');assert.equal(object.surfaceSurvey,'NOT_ESTABLISHED');assert.equal(object.positionUncertainty,'UNKNOWN');if(part.provenance.class==='UNVERIFIED')assert.equal(object.authority,'HYPOTHESIS');}
  const body=model.parts.find(p=>p.id==='part.sarcophagus.body');
  assert.equal(legacyObjectAuthority({...body,provenance:{...body.provenance,class:'MEASURED'}}).authority,'RECONSTRUCTED');
  assert.equal(JSON.stringify(model.parts),before);
});
test('Sphinx photo-informed meshes and synthetic repairs have independently gated authority',()=>{
  for(const id of ['core','chest','head','nemes','north-paw','south-paw','haunches','tail','stela']){const object=sphinxObjectAuthority(id);assert.equal(object.authority,'RECONSTRUCTED');assert.equal(object.surfaceSurvey,'NOT_ESTABLISHED');assert.equal(objectVisibleInRealityLayer(object,{OBSERVED:true,RECONSTRUCTED:false,HYPOTHESIS:true}),false);}
  const repairs=sphinxObjectAuthority('repairs');assert.equal(repairs.authority,'HYPOTHESIS');assert.equal(objectVisibleInRealityLayer(repairs,DEFAULT_REALITY_LAYERS),false);assert.equal(objectVisibleInRealityLayer(repairs,{OBSERVED:false,RECONSTRUCTED:false,HYPOTHESIS:true}),true);
});
test('Sphinx view and GLB exports retain governed object authority and presentation status',()=>{
  const app=fs.readFileSync(new URL('../src/sphinx/SphinxWorkbench.tsx',import.meta.url),'utf8'),scene=fs.readFileSync(new URL('../src/sphinx/SphinxScene.tsx',import.meta.url),'utf8');
  assert.match(app,/evidenceObjects:SPHINX_REGIONS.map/);assert.match(app,/presentation_export:true/);assert.match(app,/realityLayers=\{realityLayers\}/);
  assert.match(scene,/objectVisibleInRealityLayer\(sphinxObjectAuthority/);assert.match(scene,/coordinate_authority:'RECONSTRUCTED'/);assert.match(scene,/geometry_authority:'HYPOTHETICAL_GEOMETRY'/);
});
