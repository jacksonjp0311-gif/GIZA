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
test('overview camera centers and contains the actual five envelope vertices across aspect ratios',async()=>{
  const THREE=await import('three');
  const b=await build({entryPoints:['src/scene/overviewCamera.ts'],bundle:true,write:false,platform:'node',format:'esm'});
  const {overviewCamera}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));
  for(const aspect of [.3,.6,1,1.8,3]){
    const pose=overviewCamera(215.26246,143.8656,aspect,36),camera=new THREE.PerspectiveCamera(36,aspect,.1,10000);camera.up.set(0,0,1);camera.position.set(...pose.position);camera.lookAt(new THREE.Vector3(...pose.target));camera.updateMatrixWorld();
    const p=[[-107.63123,-107.63123,0],[-107.63123,107.63123,0],[107.63123,-107.63123,0],[107.63123,107.63123,0],[0,0,143.8656]].map(v=>new THREE.Vector3(...v).project(camera));
    for(const axis of ['x','y']){const min=Math.min(...p.map(v=>v[axis])),max=Math.max(...p.map(v=>v[axis]));assert.ok(Math.abs(min+max)<.005);assert.ok(min>-.8&&max<.8);}
  }
});
test('media identity suppresses URL aliases but preserves distinct crops and evidence records',async()=>{
  const b=await build({entryPoints:['src/lib/mediaIdentity.ts'],bundle:true,write:false,platform:'node',format:'esm'});
  const {mediaIdentity,uniqueMedia}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));
  const urls=['https://commons.wikimedia.org/wiki/File:Test_image.jpg','https://commons.wikimedia.org/wiki/Special:Redirect/file/Test%20image.jpg','https://upload.wikimedia.org/wikipedia/commons/a/ab/Test_image.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Test_image.jpg/300px-Test_image.jpg'];
  assert.equal(new Set(urls.map(mediaIdentity)).size,1);
  const records=urls.map((image_url,i)=>({id:String(i),image_url}));const before=JSON.stringify(records);
  assert.equal(uniqueMedia(records).length,1);assert.equal(JSON.stringify(records),before);
  assert.notEqual(mediaIdentity(urls[0]),mediaIdentity('https://commons.wikimedia.org/wiki/File:Test_image_(cropped).jpg'));
});
