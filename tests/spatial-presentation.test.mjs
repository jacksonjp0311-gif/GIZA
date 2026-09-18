import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const bundle=await build({entryPoints:['src/scene/sphericalExpansion.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {sphericalCellPosition}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
test('spherical presentation is deterministic, reversible and does not mutate cell geometry',()=>{
  const cell={id:'synthetic.cell',center_m:[12,34,56],width_m:2,height_m:3,depth_m:4,provenance:'ASSUMED'};
  const original=JSON.stringify(cell),positions=new Set();
  for(let i=0;i<500;i++){
    assert.deepEqual(sphericalCellPosition(cell,i,500,0),cell.center_m);
    const p=sphericalCellPosition(cell,i,500,1);
    assert.ok(Math.abs(Math.hypot(p[0],p[1],p[2]-70)-240)<1e-9);
    assert.deepEqual(p,sphericalCellPosition(cell,i,500,1));positions.add(JSON.stringify(p));
    assert.deepEqual(sphericalCellPosition(cell,i,500,-1),cell.center_m);
  }
  assert.equal(positions.size,500);assert.equal(JSON.stringify(cell),original);
  for(const invalid of [NaN,Infinity])assert.throws(()=>sphericalCellPosition(cell,0,500,invalid));
  assert.throws(()=>sphericalCellPosition(cell,500,500,1));
});
