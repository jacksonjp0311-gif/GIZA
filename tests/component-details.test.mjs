import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const read=p=>JSON.parse(fs.readFileSync(new URL('../public/model/'+p,import.meta.url),'utf8'));
const source=fs.readFileSync(new URL('../src/lib/componentDetails.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {burialDimensions,measurementValue,detailParts,detailCoverage,lowerDimensions,pinMarkers,uniquePhotos}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
const research=read('component_research.json');
const model={parts:read('parts.json').parts,measurements:read('research/measurements.json').measurements,
  photos:[...read('photo_index.json').photos,...research.photos],atlasObjects:read('atlas_objects.json').objects,componentResearch:research};
const coffer=model.parts.find(p=>p.id==='part.sarcophagus.body');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);

test('coffer body and lid distinguish object measurements from assembly context',()=>{
  const body=detailCoverage(model,coffer);
  const lid=detailCoverage(model,model.parts.find(p=>p.id==='part.sarcophagus.lid'));
  assert.equal(body.measurements.length,7);
  assert.ok(body.measurements.every(m=>!m.id.startsWith('m.coffer.lid_')));
  assert.equal(lid.measurements.length,4);
  assert.ok(lid.measurements.every(m=>m.id.startsWith('m.coffer.lid_')));
  assert.ok(body.contextMeasurements.every(m=>!body.measurements.includes(m)));
});

test('lower doorway closes the reported east wall without inventing a height',()=>{
  const d=lowerDimensions(model);
  near(d.width,123.1*.0254);near(d.doorWidth,41.2*.0254);
  near(d.width/2-d.doorEnd,40.9*.0254);near(d.doorStart+d.width/2,41.0*.0254);
  assert.ok(d.doorStart>-d.width/2&&d.doorEnd<d.width/2);
  assert.equal(d.height,undefined);
});
test('transcript pin markers stay within the west rim and have no inferred depth',()=>{
  const d=burialDimensions(model),markers=pinMarkers(model);
  assert.equal(markers.length,2);
  for(const p of markers){
    near(p.diameter,1.07*.0254);
    assert.ok(p.x-p.diameter/2>-d.outerWidth/2&&p.x+p.diameter/2<-d.innerWidth/2);
    assert.ok(Math.abs(p.y)<d.innerLength/2);assert.equal(p.depth,undefined);
  }
  near(markers[0].x+d.outerWidth/2,4.30*.0254);
  near(d.innerLength/2-markers[0].y,5.91*.0254);
});
test('photo deduplication preserves records and canonical source order',()=>{
  const a=model.photos[0],b={...a,id:'duplicate',page_url:a.page_url.replaceAll('_','%20')};
  const items=[a,b];assert.deepEqual(uniquePhotos(items),[a]);assert.equal(items.length,2);
});
test('supplement observations resolve sources, SI conversions and part bindings',()=>{
  const sources=new Set(research.sources.map(s=>s.id)),parts=new Set(model.parts.map(p=>p.id));
  for(const o of research.observations){
    assert.ok(sources.has(o.source));assert.ok(o.locator&&o.status);
    if(o.unit==='in')near(o.value*.0254,o.si_value);
    for(const id of o.bind??[])assert.ok(parts.has(id));
  }
});

test('coffer body and hollow cavity use Petrie inch dimensions in metres',()=>{
  const d=burialDimensions(model);
  near(d.outerLength,103.68*.0254);near(d.outerWidth,41.965*.0254);near(d.outerHeight,38.12*.0254);
  near(d.innerLength,84.73*.0254);near(d.innerWidth,26.69*.0254);near(d.innerDepth,29.58*.0254);
  assert.ok(d.innerLength<d.outerLength&&d.innerWidth<d.outerWidth&&d.innerDepth<d.outerHeight);
});
test('north-south coffer fits the room with source-reported west/north clearances',()=>{
  const d=burialDimensions(model);
  near(d.westClearance,43*.0254);near(d.northClearance,42.5*.0254);
  assert.ok(d.westClearance+d.outerWidth<d.length);
  assert.ok(d.northClearance+d.outerLength<d.width);
  near(d.length,557.65*.0254);near(d.width,195.85*.0254);
});
test('missing and nonfinite survey values fail closed',()=>{
  assert.throws(()=>measurementValue(model,'missing'),/Missing measured dimension/);
  assert.throws(()=>measurementValue({...model,measurements:[{id:'bad',si_value:NaN}]},'bad'));
  assert.throws(()=>burialDimensions({...model,componentResearch:{...research,observations:[]}}),/placement observation/);
});
test('object isolation never includes the full pyramid or unrelated parts',()=>{
  assert.deepEqual(detailParts(model,coffer,'OBJECT').map(p=>p.id),[coffer.id]);
  assert.ok(detailParts(model,coffer,'ROOM').every(p=>p.id===coffer.id||p.parent===coffer.parent));
});
test('every catalog part can be opened and retains its evidence distinction',()=>{
  for(const p of model.parts){
    assert.equal(detailParts(model,p,'OBJECT').length,1);
    const c=detailCoverage(model,p);
    if(p.provenance.class==='UNVERIFIED')assert.equal(c.quality,'UNVERIFIED GEOMETRY');
    assert.ok(c.photos.every(photo=>photo.bind.includes(p.id)));
  }
  assert.equal(model.parts.length,56);
  assert.ok(detailCoverage(model,coffer).measurements.some(m=>m.id==='m.coffer.inner_depth'));
});
test('new reference records have valid bindings, licenses, and no metric authority',()=>{
  const ids=new Set(model.parts.map(p=>p.id));
  for(const p of research.photos){
    assert.ok(p.author&&p.license&&p.license_url&&p.page_url&&p.image_url);
    assert.equal(p.geometry_authority,'VISUAL_REFERENCE_ONLY');
    assert.ok(p.bind.length>0);
    for(const id of p.bind)assert.ok(ids.has(id),`Unknown part ${id} in ${p.id}`);
  }
  assert.equal(new Set(model.photos.map(p=>p.id)).size,model.photos.length);
});
