import * as THREE from 'three';

/** Fit the displayed envelope, not the terrain or hypothetical underground extent. */
export function overviewCamera(base:number,height:number,aspect:number,fov:number){
  if(![base,height,aspect,fov].every(Number.isFinite)||base<=0||height<=0||aspect<=0||fov<=0||fov>=179)throw new Error('Invalid overview camera bounds');
  const vertices=[[-base/2,-base/2,0],[-base/2,base/2,0],[base/2,-base/2,0],[base/2,base/2,0],[0,0,height]].map(p=>new THREE.Vector3(...p));
  const camera=new THREE.PerspectiveCamera(fov,aspect,.1,10000);camera.up.set(0,0,1);
  const target=new THREE.Vector3(0,0,height/2),direction=new THREE.Vector3(.8,-.8,.55).normalize();
  const tan=Math.tan(THREE.MathUtils.degToRad(fov)/2);
  let distance=Math.hypot(base,base,height)/2/Math.sin(Math.min(Math.atan(tan*aspect),Math.atan(tan)))*1.1;
  for(let i=0;i<10;i++){
    camera.position.copy(target).addScaledVector(direction,distance);camera.lookAt(target);camera.updateMatrixWorld();
    const projected=vertices.map(p=>p.clone().project(camera)),xs=projected.map(p=>p.x),ys=projected.map(p=>p.y);
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    const up=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
    // Keep the orbit pivot on the monument axis. Lateral screen-centering offsets
    // make subsequent rotations orbit empty space beside the pyramid.
    target.z+=(minY+maxY)/2*distance*tan/up.z;
    // Keep the complete pyramid inside a centered 76% viewport footprint.
    distance*=Math.max((maxX-minX)/2,(maxY-minY)/2)/.76;
  }
  return {position:target.clone().addScaledVector(direction,distance).toArray() as [number,number,number],target:target.toArray() as [number,number,number]};
}
