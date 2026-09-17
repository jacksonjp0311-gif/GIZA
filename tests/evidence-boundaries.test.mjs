import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
async function load(file){const r=await build({entryPoints:[new URL('../src/evidence/'+file,import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1')],bundle:true,write:false,format:'esm',platform:'node'});return import('data:text/javascript;base64,'+Buffer.from(r.outputFiles[0].text).toString('base64'));}
const {buildKhafreAssembly}=await load('assembly.ts'),{importCanonicalAssembly}=await load('spatial.ts');
const {buildEvidenceGraph,traverseEvidence,parseEvidenceGraph}=await load('graph.ts');
const {generateInvestigationCandidates}=await load('intelligence.ts');
const {runCandidateExperiment,experimentApplicability,reviewCurrentExperiment,verifyReceipt,sha256Json}=await load('receipts.ts');
const {validateObservation,adaptObservation,lengthValue,assertSafeDocument}=await load('observationContract.ts');
const {dependencyFingerprint}=await load('dependencies.ts');
const read=p=>JSON.parse(fs.readFileSync(new URL('../public/model/'+p,import.meta.url),'utf8'));
const base={parts:read('parts.json').parts,measurements:read('research/measurements.json').measurements,componentResearch:read('component_research.json'),sourceRegistry:read('evidence/source_registry.json').sources};
const copy=x=>structuredClone(x),assembly=buildKhafreAssembly(base),graph=buildEvidenceGraph(assembly);
const candidate=generateInvestigationCandidates(assembly,graph).find(c=>c.id==='candidate.coffer.lid-length-fit');
const context={version:'boundary-test',commit:'SYNTHETIC_SOFTWARE_QA',environment:'Node',createdAt:'2026-09-17T00:00:00Z'};
test('recognized lower-authority observations cannot generate observed or reconstructed physical solids',()=>{
  for(const status of ['UNVERIFIED','HYPOTHESIS','ASSUMED','SIMULATED']){
    const model=copy(base);model.measurements.find(o=>o.id==='m.coffer.outer_length').status=status;
    const a=buildKhafreAssembly(model),o=a.observations.find(o=>o.id==='m.coffer.outer_length');
    assert.equal(o.authority,'HYPOTHESIS');assert.equal(o.status,status);
    assert.ok(!a.features.some(f=>f.objectId==='part.sarcophagus.body'&&f.geometry.kind==='box'));
    assert.ok(a.features.filter(f=>f.observationIds.includes(o.id)).every(f=>f.authority!=='OBSERVED'));
  }
});
test('hypothetical placement descriptions do not resolve a physical chamber relationship',()=>{
  for(const id of ['coffer.orientation','coffer.floor']){
    const model=copy(base);model.componentResearch.observations.find(o=>o.id===id).status='HYPOTHESIS';
    const a=buildKhafreAssembly(model);
    assert.equal(a.transforms.find(t=>t.id==='transform.coffer.assembly').status,'UNRESOLVED');
    assert.ok(a.features.some(f=>f.objectId==='part.sarcophagus.body'&&f.geometry.kind==='box'));
  }
});

test('unsupported source statuses reject rather than default to observation',()=>{
  for(const status of ['', 'unexpected','DERIVED_BUT_UNKNOWN']){
    const model=copy(base);model.measurements[0].status=status;
    const row=copy(base.measurements.find(o=>o.id==='m.coffer.outer_length'));row.status=status;
    assert.throws(()=>adaptObservation(row),/status/);
  }
});
test('observation value union is identical in direct, assembly, graph and checksum-valid receipt boundaries',async()=>{
  const original=await runCandidateExperiment(candidate,graph,context);
  for(const value of [true,false,[],{},undefined,NaN,Infinity]){
    const a=copy(assembly),o=a.observations.find(o=>o.id==='m.coffer.outer_length');o.value=value;
    assert.throws(()=>validateObservation(o));assert.throws(()=>importCanonicalAssembly(a));
    const g=copy(graph);g.nodes.find(n=>n.id===o.id).data.value=value;assert.throws(()=>parseEvidenceGraph(g));
    if(value!==undefined&&typeof value!=='number'){
      const r=copy(original);r.payload.data.graphSnapshot=g;r.payload.data.graphSha256=await sha256Json(g);
      r.sha256=await sha256Json({schema:r.schema,kind:r.kind,payload:r.payload});r.id=`receipt:experiment:${r.sha256}`;
      await assert.rejects(verifyReceipt(r));
    }
  }
});
test('zero and null stay distinct; source, units, duplicate IDs and dangerous keys fail closed',()=>{
  const row=copy(base.measurements.find(o=>o.id==='m.coffer.outer_length'));row.native_value=0;row.si_value=0;
  assert.equal(adaptObservation(row).value,0);row.si_value=null;assert.equal(adaptObservation(row).value,null);
  const a=copy(assembly);a.observations.push(copy(a.observations[0]));assert.throws(()=>importCanonicalAssembly(a),/duplicate/);
  for(const key of ['sourceId','locator','unit']){const o=copy(assembly.observations[0]);o[key]='';assert.throws(()=>validateObservation(o));}
  assert.throws(()=>assertSafeDocument(JSON.parse('{"constructor":{}}')),/Unsafe/);
  let deep={};for(let i=0;i<45;i++)deep={next:deep};assert.throws(()=>assertSafeDocument(deep),/nesting/);
});
test('metre centimetre and inch source inputs produce equivalent geometry; angles do not',()=>{
  const original=base.measurements.find(o=>o.id==='m.coffer.outer_length');
  for(const [unit,factor] of [['m',1],['cm',100],['in',1/.0254]]){
    const model=copy(base),row=model.measurements.find(o=>o.id===original.id);
    row.native_value=original.si_value*factor;row.native_unit=unit;row.si_value=original.si_value*factor;row.si_unit=unit;
    const a=buildKhafreAssembly(model),box=a.features.find(f=>f.id==='feature.coffer.base').geometry;
    assert.ok(Math.abs(box.max[1]-box.min[1]-original.si_value)<1e-12);
  }
  const o=adaptObservation({...original,native_value:12,native_unit:'deg',si_value:12,si_unit:'deg'});
  assert.throws(()=>lengthValue(o),/requires LENGTH/);
  const supplemental=adaptObservation({id:'angle',source:'s',locator:'p1',status:'REPORTED_MEASUREMENT',value:2,unit:'deg',si_value:2},true);
  assert.equal(supplemental.unit,'deg');assert.throws(()=>lengthValue(supplemental));
});
test('observed scalar endpoints retain reconstructed geometry authority',()=>{
  const id='feature.dimension.m.coffer.outer_length',f=graph.nodes.find(n=>n.id===id),g=graph.nodes.find(n=>n.id==='geometry:'+id);
  assert.equal(f.authority,'OBSERVED');assert.equal(g.authority,'RECONSTRUCTED');assert.equal(g.data.coordinateAuthority,'RECONSTRUCTED');
});
test('adding unrelated constraint context cannot expand direct supporting evidence',()=>{
  const id='feature.dimension.m.coffer.outer_length';
  const support=g=>traverseEvidence(g,id).nodes.filter(n=>n.kind==='OBSERVATION').map(n=>n.id);
  const expanded=copy(graph);expanded.edges.push({from:assembly.id,to:'m.coffer.lid_width',relationship:'RELATED_CONTEXT'});
  assert.deepEqual(support(expanded),support(graph));assert.deepEqual(support(graph),['m.coffer.outer_length']);
  assert.ok(traverseEvidence(expanded,id,8,'RELATED_CONTEXT').nodes.length>traverseEvidence(expanded,id).nodes.length);
});
test('dependency fingerprint ignores unrelated context but changes with relevant inputs',async()=>{
  const r=await runCandidateExperiment(candidate,graph,context),unrelated=copy(graph);unrelated.limitations.push('Unrelated annotation');
  assert.equal(await experimentApplicability(r,candidate,unrelated),'CURRENT');
  assert.equal(await dependencyFingerprint(candidate,graph),await dependencyFingerprint({...candidate,title:'UI wording'},graph));
  const model=copy(base),row=model.measurements.find(o=>o.id==='m.coffer.outer_length');row.native_value+=.1;row.si_value=row.native_value*.0254;
  const next=buildKhafreAssembly(model),nextGraph=buildEvidenceGraph(next),nextCandidate=generateInvestigationCandidates(next,nextGraph).find(c=>c.id===candidate.id);
  assert.equal(await experimentApplicability(r,nextCandidate,nextGraph),'HISTORICAL');
  await assert.rejects(reviewCurrentExperiment(r,nextCandidate,nextGraph,{reviewer:'QA',outcome:'SUPPORTED',note:'This must not silently rebase.'},context),/matching current/);
  assert.equal((await verifyReceipt(r)).payload.data.result,candidate.computation.result);
});
test('actual archived v1 computations remain replayable without inventing new identity metadata',async()=>{
  const archive=read('evidence_assembly/validation-20260917-evolution-v1.json');
  const r=archive.experiments.find(r=>r.payload.data.candidate.id===candidate.id);
  const before=JSON.stringify(r);await verifyReceipt(r);assert.equal(await experimentApplicability(r,candidate,graph),'UNVERIFIABLE');assert.equal(JSON.stringify(r),before);
});
