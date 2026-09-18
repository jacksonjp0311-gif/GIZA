import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
async function load(file){const b=await build({entryPoints:['src/evidence/'+file],bundle:true,write:false,format:'esm',platform:'node'});return import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));}
const spatial=await load('spatial.ts'),graph=await load('graph.ts'),{buildKhafreAssembly}=await load('assembly.ts');
const read=p=>JSON.parse(fs.readFileSync('public/model/'+p,'utf8'));
const fixture=()=>buildKhafreAssembly({parts:read('parts.json').parts,measurements:read('research/measurements.json').measurements,componentResearch:read('component_research.json'),sourceRegistry:read('evidence/source_registry.json').sources});
test('hypothetical resolved transform cannot yield authoritative distance',()=>{
  const a=fixture(),t=a.transforms.find(t=>t.status==='RESOLVED'&&t.scope==='AUTHORITATIVE_RECONSTRUCTION');
  a.transforms=[{...t,id:'H-04',authority:'HYPOTHESIS',matrix:spatial.rigidMatrix([100,0,0]),assumptionIds:['assumption.H-04']}];
  const r=spatial.measurePoints(a,{frameId:t.from,position:[0,0,0]},{frameId:t.to,position:[0,0,0]},t.to);
  assert.equal(r.status,'UNKNOWN');assert.equal(r.value,null);
});
test('graph transform wrapper must preserve and agree with record authority',()=>{
  const a=fixture();a.transforms[0].authority='HYPOTHESIS';
  const g=graph.buildEvidenceGraph(a),n=g.nodes.find(n=>n.id===a.transforms[0].id);
  assert.equal(n.authority,'HYPOTHESIS');n.authority='RECONSTRUCTED';assert.throws(()=>graph.parseEvidenceGraph(g),/authority/i);
});
test('derived traversal follows only feature-owned constraints',()=>{
  const a=fixture(),f=a.features.find(f=>f.observationIds.length),o=a.observations.find(o=>!f.observationIds.includes(o.id));
  a.constraints.push({id:'synthetic.owned',kind:'TEST_ONLY',featureIds:[f.id],observationIds:[o.id],status:'UNKNOWN',value:null,unit:null,note:'Synthetic QA'});
  const g=graph.buildEvidenceGraph(a);
  assert.ok(!graph.traverseEvidence(g,f.id,8,'DIRECT_SUPPORT').nodes.some(n=>n.id===o.id));
  assert.ok(graph.traverseEvidence(g,f.id,8,'DERIVED_DEPENDENCIES').nodes.some(n=>n.id===o.id));
});
test('conditional calculations retain chain, authority, assumptions and unknown uncertainty',()=>{
  const a=fixture(),t=a.transforms.find(t=>t.status==='RESOLVED'&&t.scope==='AUTHORITATIVE_RECONSTRUCTION');
  a.transforms=[{...t,id:'H-04',authority:'HYPOTHESIS',matrix:spatial.rigidMatrix([100,0,0]),assumptionIds:['assumption.H-04']}];
  const p={frameId:t.from,position:[0,0,0]},q={frameId:t.to,position:[0,0,0]};
  const result=spatial.measureConditionalPoints(a,p,q,t.to);
  assert.equal(result.status,'CONDITIONAL');assert.equal(result.value,100);assert.equal(result.scope,'CONDITIONAL_HYPOTHESIS');
  assert.deepEqual(result.assumptionIds,['assumption.H-04']);assert.equal(result.transforms[0].authority,'HYPOTHESIS');assert.equal(result.uncertainty.status,'UNKNOWN');
  assert.deepEqual(result.frameChains[0],[t.from,t.to]);assert.match(result.reason,/H-04/);
  delete a.transforms[0].assumptionIds;assert.equal(spatial.measureConditionalPoints(a,p,q,t.to).status,'UNKNOWN');
  assert.equal(spatial.measurePoints(a,p,q,t.to).status,'UNKNOWN');
});
test('imported registration pass flags and authority claims cannot become local verification',()=>{
  for(const patch of [{passed:true},{status:'ENGINE_VERIFIED'},{geometryAuthority:'OBSERVED'},{verificationState:'ENGINE_VERIFIED'},{verificationState:'REPLAY_VERIFIED'},{verificationState:'REVIEWED_SCOPED_RELATION'}]){
    const g=graph.buildEvidenceGraph(fixture());Object.assign(g.nodes.find(n=>n.kind==='REGISTRATION').data,patch);assert.throws(()=>graph.parseEvidenceGraph(g),/verification claim/);
  }
});
test('unrelated constraints and contextual links do not contaminate derived or direct support',()=>{
  const a=fixture(),f=a.features.find(f=>f.observationIds.length),other=a.features.find(n=>n.id!==f.id),o=a.observations.find(o=>!f.observationIds.includes(o.id));
  const before=graph.buildEvidenceGraph(a);
  a.constraints.push({id:'synthetic.unrelated',kind:'QA',featureIds:[other.id],observationIds:[o.id],status:'UNKNOWN',value:null,unit:null,note:'Software only'});
  const after=graph.buildEvidenceGraph(a);after.edges.push({from:f.id,to:'synthetic.unrelated',relationship:'RELATED_CONTEXT'});graph.parseEvidenceGraph(after);
  for(const purpose of ['DIRECT_SUPPORT','DERIVED_DEPENDENCIES'])assert.deepEqual(graph.traverseEvidence(after,f.id,8,purpose).nodes.map(n=>n.id),graph.traverseEvidence(before,f.id,8,purpose).nodes.map(n=>n.id));
});
test('imported live relation claims cannot mint a session replay capability',async()=>{
  const api=await load('liveEvidence.ts'),a=fixture(),g=graph.buildEvidenceGraph(a);
  const claim={payload:{verificationClaim:'REVIEWED_SCOPED_RELATION',replay:{reproduced:true}},sha256:'a'.repeat(64)};
  assert.equal(api.registrationVerification(claim),'IMPORTED_CLAIM');
  assert.throws(()=>api.integrateLiveRelation(g,claim,a),/Imported claims/);
});
test('impact reuses exact saved dependencies and excludes context and labels',async()=>{
  const {saveInvestigation}=await load('investigations.ts'),{analyzeEvidenceImpact}=await load('impact.ts'),a=fixture();
  const f=a.features.find(f=>f.geometry.kind==='segment'),draft={points:[{featureId:f.id,frameId:f.frameId,position:f.geometry.a},{featureId:f.id,frameId:f.frameId,position:f.geometry.b}],mode:'DISTANCE',frameId:f.frameId,section:null};
  const presentation={purpose:'PRESENTATION_ONLY',room:false,isolated:null,layers:{OBSERVED:true,RECONSTRUCTED:true,HYPOTHESIS:false},explode:0,bookmarks:[]};
  const saved=await saveInvestigation('Synthetic impact test',a,draft,presentation,[]),before=graph.buildEvidenceGraph(a);
  const label=structuredClone(a);label.features.find(n=>n.id===f.id).label+=' display annotation';
  const irrelevant=await analyzeEvidenceImpact(before,graph.buildEvidenceGraph(label),label,[],[],[saved]);
  assert.equal(irrelevant.rows[0].status,'UNAFFECTED');
  const changed=structuredClone(a),observation=changed.observations.find(o=>f.observationIds.includes(o.id));
  observation.locator+=' corrected locator';
  const report=await analyzeEvidenceImpact(before,graph.buildEvidenceGraph(changed),changed,[],[],[saved]);
  assert.equal(report.rows[0].status,'HISTORICAL');assert.ok(report.rows[0].paths.some(p=>p.includes(observation.id)));
  assert.deepEqual(report,await analyzeEvidenceImpact(before,graph.buildEvidenceGraph(changed),changed,[],[],[saved]));
});
