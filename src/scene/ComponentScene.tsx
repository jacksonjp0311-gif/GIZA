import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as Controls } from 'three-stdlib';
import * as THREE from 'three';
import type { ModelBundle, Part } from '../lib/model';
import { burialDimensions, detailParts, isBurialDetail, type DetailContext } from '../lib/componentDetails';
import { BurialDetail, LowerChamberDetail } from './DetailGeometry';
import { MonumentLayer } from './MonumentLayer';
import { WebGLRecovery } from '../workstation/WorkspaceBoundary';

type V3=[number,number,number];
function DetailCamera({target,radius,revision,top}:{target:V3;radius:number;revision:number;top:boolean}) {
  const {camera,size}=useThree();
  const ref=useRef<Controls>(null);
  useEffect(()=>{
    if(!ref.current)return;
    const cam=camera as THREE.PerspectiveCamera;
    const vfov=THREE.MathUtils.degToRad(cam.fov);
    const hfov=2*Math.atan(Math.tan(vfov/2)*size.width/size.height);
    const distance=radius/Math.sin(Math.min(vfov,hfov)/2)*1.24;
    const direction=new THREE.Vector3(...(top?[0,-.001,1]:[.85,-1.3,.95]) as V3).normalize();
    cam.up.set(0,0,1);cam.near=Math.max(.005,radius/1500);cam.far=Math.max(3000,radius*80);cam.updateProjectionMatrix();
    ref.current.target.set(...target);camera.position.copy(direction.multiplyScalar(distance).add(ref.current.target));
    ref.current.update();
  },[camera,size.width,size.height,radius,target[0],target[1],target[2],revision,top]);
  return <OrbitControls ref={ref} makeDefault enableDamping dampingFactor={.12} zoomToCursor
    minDistance={Math.max(.15,radius*.12)} maxDistance={Math.max(30,radius*16)}
    rotateSpeed={.55} zoomSpeed={.8} panSpeed={.7} screenSpacePanning
    minPolarAngle={.02} maxPolarAngle={Math.PI-.02}/>;
}

export function ComponentScene({model,part,context,lidLift,dimensions,roof,survey,revision,top,wide,onSelect}:{
  model:ModelBundle;part:Part;context:DetailContext;lidLift:number;dimensions:boolean;roof:boolean;
  survey:boolean;revision:number;top:boolean;wide:boolean;onSelect:(id:string)=>void;
}) {
  const burial=isBurialDetail(part.id);
  const lower=part.id==='part.lower.chamber';
  const room=context==='ROOM' || part.id==='part.burial.chamber';
  const detailedBurial=burial&&(room||part.id.startsWith('part.sarcophagus.'));
  const localParts=useMemo(()=>{
    const [x,y,z]=part.spatial.origin_m;
    return detailParts(model,part,context).map(p=>({...p,detail_tier:'primary',spatial:{...p.spatial,
      origin_m:[p.spatial.origin_m[0]-x,p.spatial.origin_m[1]-y,p.spatial.origin_m[2]-z] as V3}}));
  },[model,part,context]);
  const bounds=useMemo(()=>{
    const box=new THREE.Box3();
    for(const p of localParts){
      const g=p.spatial.primitive;
      const size=g.kind==='box'?new THREE.Vector3(g.sx,g.sy,g.sz):new THREE.Vector3(g.radius*2,g.radius*2,g.height);
      const b=new THREE.Box3(size.clone().multiplyScalar(-.5),size.clone().multiplyScalar(.5));
      const matrix=new THREE.Matrix4().compose(new THREE.Vector3(...p.spatial.origin_m),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(...p.spatial.rpy_rad)),new THREE.Vector3(1,1,1));
      box.union(b.applyMatrix4(matrix));
    }
    return {target:box.getCenter(new THREE.Vector3()).toArray() as V3,radius:box.getSize(new THREE.Vector3()).length()/2};
  },[localParts]);
  let target:V3=bounds.target,radius=bounds.radius;
  if(detailedBurial){
    const d=burialDimensions(model);
    const coffer=part.id.startsWith('part.sarcophagus.');
    if(room && (!coffer||wide)){target=[0,0,d.wallHeight*.25];radius=Math.hypot(d.length,d.width,d.wallHeight)/2;}
    else {target=room?[-d.length/2+d.westClearance+d.outerWidth/2,d.width/2-d.northClearance-d.outerLength/2,-.12]:[0,0,-.15];radius=!room&&top?1.5:2.15;}
  }
  if(lower){const p=part.spatial.primitive;if(p.kind==='box'){target=[0,0,p.sz*.25];radius=Math.hypot(p.sx,p.sy,p.sz)/2;}}
  return <Canvas className="componentCanvas" dpr={[1,1.75]} gl={{antialias:true,alpha:false}} camera={{fov:42,near:.01,far:3000,up:[0,0,1]}}
    onCreated={({camera})=>{camera.up.set(0,0,1);}}>
    <color attach="background" args={['#080e11']}/>
    <WebGLRecovery/>
    <ambientLight intensity={1.25}/>
    <hemisphereLight args={['#fff1cf','#4d4135',1.6]}/>
    <directionalLight position={[12,-14,18]} intensity={2.4} color="#ffedc8"/>
    <directionalLight position={[-8,6,10]} intensity={1.25} color="#dceaf0"/>
    <Suspense fallback={null}>
      {detailedBurial ? <BurialDetail model={model} room={room} lidLift={lidLift} dimensions={dimensions} roof={roof} survey={survey} focusId={part.id} onSelect={onSelect}/>
      : lower && part.spatial.primitive.kind==='box' ? <LowerChamberDetail model={model} height={part.spatial.primitive.sz} dimensions={dimensions}/>
      : <MonumentLayer parts={localParts} explode={0} selectedId={null} showUnverified mode="EXPLORE" sectionAxis="OFF" sectionPos={0} xray={false} showLabels={false} onSelect={onSelect}/>}
    </Suspense>
    <DetailCamera target={target} radius={Math.max(.1,radius)} revision={revision} top={top}/>
  </Canvas>;
}
