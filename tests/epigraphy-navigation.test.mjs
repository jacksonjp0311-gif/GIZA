import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync(new URL('../src/epigraphy/navigation.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {fitZoneToViewport}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const image={width:1000,height:1000},viewport={width:500,height:500};
test('selected-zone fit centers the normalized target with display-only padding',()=>{
  const fit=fitZoneToViewport([.25,.25,.5,.5],image,viewport);
  assert.equal(fit.zoom,180);assert.equal(fit.baseWidth,500);assert.equal(fit.scrollLeft,200);assert.equal(fit.scrollTop,200);
});
test('small zones respect the 400 percent zoom ceiling',()=>{
  const fit=fitZoneToViewport([.7,.2,.002,.003],image,viewport);
  assert.equal(fit.zoom,400);assert.equal(fit.scrollLeft,1152);assert.equal(fit.scrollTop,153);
});
test('full-image framing never zooms below 100 percent',()=>{
  assert.deepEqual(fitZoneToViewport([0,0,1,1],image,viewport),{zoom:100,baseWidth:500,scrollLeft:0,scrollTop:0});
});
test('portrait and landscape sources fit without invalid letterbox scrolling',()=>{
  const portrait=fitZoneToViewport([0,.6,1,.2],{width:400,height:2000},{width:800,height:400});
  assert.equal(portrait.zoom,400);assert.equal(portrait.scrollLeft,0);assert.equal(portrait.scrollTop,920);
  const landscape=fitZoneToViewport([.6,0,.2,1],{width:2000,height:400},{width:400,height:800});
  assert.equal(landscape.zoom,400);assert.equal(landscape.scrollLeft,920);assert.equal(landscape.scrollTop,0);
});
test('corner-zone framing clamps to actual image scroll bounds',()=>{
  assert.deepEqual(fitZoneToViewport([0,0,.1,.1],image,viewport),{zoom:400,baseWidth:500,scrollLeft:0,scrollTop:0});
  const fit=fitZoneToViewport([.9,.9,.1,.1],image,viewport);assert.equal(fit.scrollLeft,1500);assert.equal(fit.scrollTop,1500);
});
test('invalid extents and coordinates yield finite bounded display values',()=>{
  for(const zone of [[NaN,Infinity,-3,0],[1,1,0,0],[-10,-10,Infinity,Infinity]])for(const dimensions of [{width:NaN,height:0},{width:Infinity,height:-5},{width:1e300,height:1e-300}]){
    const fit=fitZoneToViewport(zone,dimensions,dimensions,Infinity);
    assert.ok(Object.values(fit).every(Number.isFinite));assert.ok(fit.zoom>=100&&fit.zoom<=400);assert.ok(fit.scrollLeft>=0&&fit.scrollTop>=0);
  }
});
test('fitting does not mutate normalized observations or source dimensions',()=>{
  const zone=Object.freeze([.1,.2,.3,.4]),source=Object.freeze({width:3264,height:2448}),frame=Object.freeze({width:520,height:450});
  const before=JSON.stringify({zone,source,frame});fitZoneToViewport(zone,source,frame);assert.equal(JSON.stringify({zone,source,frame}),before);
});
