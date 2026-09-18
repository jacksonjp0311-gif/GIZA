import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
async function load(file){const r=await build({entryPoints:[new URL('../src/evidence/'+file,import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')],bundle:true,write:false,format:'esm',platform:'node'});return import('data:text/javascript;base64,'+Buffer.from(r.outputFiles[0].text).toString('base64'));}
const {buildKhafreAssembly}=await load('assembly.ts'),{visibleGeometry,featureAnchors,pointForDisplay,pickSectionCanonical}=await load('viewGeometry.ts');
const {saveInvestigation,restoreInvestigation,investigationApplicability,appendInvestigation,readInvestigations}=await load('investigations.ts');
const {sha256Json}=await load('receipts.ts');
const {belongsToGeometry}=await load('membership.ts');
const {explainSaved}=await load('explanation.ts');
const {inspectHistoricalInvestigation,measurementDependencies}=await load('investigations.ts');
const read=p=>JSON.parse(fs.readFileSync(new URL('../public/model/'+p,import.meta.url),'utf8'));
const model={parts:read('parts.json').parts,measurements:read('research/measurements.json').measurements,componentResearch:read('component_research.json'),sourceRegistry:read('evidence/source_registry.json').sources};
const a=buildKhafreAssembly(model),f=a.features.find(f=>f.id==='feature.lid.envelope');
const presentation={purpose:'PRESENTATION_ONLY',room:false,isolated:f.objectId,layers:{OBSERVED:true,RECONSTRUCTED:true,HYPOTHESIS:false},explode:0,bookmarks:[]};
const draft={selectedId:f.id,points:featureAnchors(f).slice(0,2).map(position=>({frameId:f.frameId,featureId:f.id,position})),frameId:f.frameId,mode:'DISTANCE',section:null};

test('save rejects distant segment, polygon and point membership, not just boxes',async()=>{
  for(const geometry of [{kind:'segment',a:[0,0,0],b:[1,0,0]},{kind:'surface',vertices:[[0,0,0],[1,0,0],[1,1,0],[0,1,0]]},{kind:'point',point:[0,0,0]}]){
    const source=structuredClone(a);source.features.find(g=>g.id===f.id).geometry=geometry;
    const d=structuredClone(draft);d.points.forEach(p=>p.position=[99,99,99]);
    await assert.rejects(saveInvestigation('False membership',source,d,presentation,[]));
  }
});
test('membership deliberately includes edges, rejects outside/degenerate and handles concave polygons',()=>{
  const segment={kind:'segment',a:[0,0,0],b:[1,0,0]};assert.equal(belongsToGeometry(segment,[1,0,0]),true);assert.equal(belongsToGeometry(segment,[1.00001,0,0]),false);assert.equal(belongsToGeometry({...segment,b:[0,0,0]},[0,0,0]),false);
  const polygon={kind:'surface',vertices:[[0,0,0],[2,0,0],[2,1,0],[1,1,0],[1,2,0],[0,2,0]]};
  assert.equal(belongsToGeometry(polygon,[.5,1.5,0]),true);assert.equal(belongsToGeometry(polygon,[1.5,1.5,0]),false);assert.equal(belongsToGeometry(polygon,[1,1,0]),true);assert.equal(belongsToGeometry(polygon,[.5,.5,.001]),false);
  assert.throws(()=>belongsToGeometry({kind:'surface',vertices:[[0,0,0],[1,1,0],[0,1,0],[1,0,0]]},[.2,.2,0]),/intersect/);
  assert.equal(belongsToGeometry({kind:'point',point:[0,0,0]},[1e-5,0,0]),false);assert.equal(belongsToGeometry({kind:'unknown',reason:'Missing'},[0,0,0]),false);
});
test('checksum-valid saved imports cannot assign distant points to non-box geometry',async()=>{
  const record=await saveInvestigation('Original',a,draft,presentation,[]);
  for(const geometry of [{kind:'segment',a:[0,0,0],b:[1,0,0]},{kind:'surface',vertices:[[0,0,0],[1,0,0],[1,1,0]]},{kind:'point',point:[0,0,0]}]){
    const forged=structuredClone(record);forged.payload.assemblySnapshot.features.find(g=>g.id===f.id).geometry=geometry;forged.payload.draft.points.forEach(p=>p.position=[99,99,99]);forged.sha256=await sha256Json(forged.payload);forged.id=`investigation:${forged.sha256}`;
    await assert.rejects(restoreInvestigation(forged),/originating physical surface/);
    const inspected=await inspectHistoricalInvestigation(JSON.stringify(forged));assert.equal(inspected.state,'CHECKSUM_ONLY_NOT_REPLAYED');assert.equal(inspected.currentAuthority,'NONE');
  }
});
test('older saved dependency rule replays historically without silently upgrading its checksum',async()=>{
  const record=await saveInvestigation('Older rule fixture',a,draft,presentation,[]),old=structuredClone(record);old.payload.dependencyRule='canonical-measurement.v2';old.payload.dependencyFingerprint=await sha256Json(measurementDependencies(a,old.payload.draft,'canonical-measurement.v2'));old.sha256=await sha256Json(old.payload);old.id=`investigation:${old.sha256}`;
  assert.deepEqual(await restoreInvestigation(old),old);assert.equal(await investigationApplicability(old,a),'HISTORICAL');assert.ok((await explainSaved(old,a)).changes.some(c=>c.path==='inputs.rule'));
});
test('scaled section planes have identical membership and unknown cuts cannot manufacture surfaces',async()=>{
  const middle=(f.geometry.min[2]+f.geometry.max[2])/2,d=structuredClone(draft);d.points=d.points.map(p=>({...p,position:[0,0,middle],origin:{kind:'COMPUTED_SECTION',surfaceAuthority:'RECONSTRUCTED',section:{frameId:f.frameId,normal:[0,0,1e6],offset:middle*1e6}}}));
  await restoreInvestigation(await saveInvestigation('Scaled normal',a,d,presentation,[]));d.points[0].position[0]=99;await assert.rejects(saveInvestigation('Infinite plane is not a cap',a,d,presentation,[]),/surface/);
});
test('explanations identify exact relevant changes; labels and local-frame parent transforms do not stale new studies',async()=>{
  const record=await saveInvestigation('Explained',a,draft,presentation,[]),current=structuredClone(a);current.features.find(g=>g.id===f.id).geometry.max[0]+=.01;
  const explained=await explainSaved(record,current);assert.equal(explained.status,'HISTORICAL');assert.ok(explained.changes.some(c=>c.path.includes(f.id)&&c.path.endsWith('geometry.max')));
  const renamed=structuredClone(a);renamed.features.find(g=>g.id===f.id).label='Display only';renamed.transforms.find(t=>t.id==='transform.coffer.assembly').derivation='Unrelated parent relation';assert.equal((await explainSaved(record,renamed)).status,'CURRENT');
  const rerun=await saveInvestigation('Linked',current,draft,presentation,[],record.id);assert.equal(rerun.payload.supersedes,record.id);assert.notEqual(rerun.id,record.id);assert.deepEqual((await restoreInvestigation(record)).payload.assemblySnapshot,a);
});
test('visible geometry is exactly isolated and authority filtered; camera bounds share this set',()=>{
  const state={...presentation,hotspots:false,selectedId:f.id};
  assert.ok(visibleGeometry(a,state).length>0);assert.ok(visibleGeometry(a,state).every(g=>g.objectId===f.objectId));
  assert.equal(visibleGeometry(a,{...state,layers:{OBSERVED:false,RECONSTRUCTED:false,HYPOTHESIS:false}}).length,0);
});
test('computed cap picks preserve canonical position and section provenance under inspection movement',()=>{
  const plane={frameId:f.frameId,normal:[0,0,1],offset:(f.geometry.min[2]+f.geometry.max[2])/2},physical=[0,0,plane.offset];
  for(const explode of [0,1,3]){
    const pick=pickSectionCanonical(a,f,pointForDisplay(a,f,physical,explode),explode,plane);
    assert.ok(pick.position.every((n,i)=>Math.abs(n-physical[i])<1e-12));assert.equal(pick.origin.kind,'COMPUTED_SECTION');assert.deepEqual(pick.origin.section,plane);
  }
  assert.throws(()=>pickSectionCanonical(a,f,[0,0,100],0,plane),/plane/);
});
test('saved investigations round trip original geometry, result, points and separate presentation',async()=>{
  const record=await saveInvestigation('SOFTWARE QA — not archaeology',a,draft,presentation,[]),restored=await restoreInvestigation(JSON.stringify(record));
  assert.deepEqual(restored,record);assert.equal(await investigationApplicability(restored,a),'CURRENT');
  assert.deepEqual(restored.payload.draft.points,draft.points);assert.equal(restored.payload.result.status,'KNOWN');
  const moved=await saveInvestigation('Moved display',a,draft,{...presentation,explode:3},[]);
  assert.equal(moved.payload.dependencyFingerprint,record.payload.dependencyFingerprint);assert.deepEqual(moved.payload.result,record.payload.result);
});
test('relevant revised geometry makes a saved investigation historical without changing its snapshot',async()=>{
  const record=await saveInvestigation('Archived',a,draft,presentation,[]),current=structuredClone(a);
  current.features.find(g=>g.id===f.id).geometry.max[0]+=.01;
  assert.equal(await investigationApplicability(record,current),'HISTORICAL');
  assert.deepEqual((await restoreInvestigation(record)).payload.assemblySnapshot,a);
  current.features.find(g=>g.id!==f.id).label='Unrelated label';
  assert.equal(await investigationApplicability(record,a),'CURRENT');
});
test('checksum-valid false result or off-plane cap cannot pass restore',async()=>{
  const record=await saveInvestigation('Adversarial QA',a,draft,presentation,[]);
  const tampered=structuredClone(record);tampered.payload.result.value+=1;tampered.sha256=await sha256Json(tampered.payload);tampered.id=`investigation:${tampered.sha256}`;
  await assert.rejects(restoreInvestigation(tampered),/reproduce/);
  const d=structuredClone(draft);d.points[0].origin={kind:'COMPUTED_SECTION',surfaceAuthority:'RECONSTRUCTED',section:{frameId:f.frameId,normal:[0,0,1],offset:100}};
  await assert.rejects(saveInvestigation('Bad cap',a,d,presentation,[]),/plane/);
});
test('presentation labels and active selection do not invalidate current measurement dependencies',async()=>{
  const record=await saveInvestigation('Label QA',a,draft,presentation,[]),renamed=structuredClone(a);
  renamed.features.find(g=>g.id===f.id).label='A different UI caption';renamed.frames.find(g=>g.id===f.frameId).label='Renamed frame label';
  assert.equal(await investigationApplicability(record,renamed),'CURRENT');assert.equal(record.payload.draft.selectedId,undefined);assert.equal(record.payload.presentation.selectedId,f.id);
});
test('storage protects duplicates, stale tabs, corrupt bytes and quota failures',async()=>{
  let stored=null;const storage={getItem:()=>stored,setItem:(k,v)=>{stored=v;}};
  const record=await saveInvestigation('Storage QA',a,draft,presentation,[]);
  const first=await appendInvestigation(storage,'qa',null,record),second=await appendInvestigation(storage,'qa',first.baseline,record);
  assert.equal(second.rows.length,1);await assert.rejects(appendInvestigation(storage,'qa',null,record),/Another tab/);
  const bytes=stored;await assert.rejects(appendInvestigation({...storage,setItem:()=>{throw new Error('Quota exceeded');}},'qa',bytes,record),/Quota/);assert.equal(stored,bytes);
  await assert.rejects(readInvestigations('{corrupt'));assert.equal(stored,bytes);
  const conflicting=structuredClone(record);conflicting.payload.title='Not the same content';await assert.rejects(appendInvestigation(storage,'qa',bytes,conflicting),/checksum/);
});
