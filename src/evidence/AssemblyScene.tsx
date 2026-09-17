import { useEffect,useMemo,useRef } from 'react';
import { Canvas,useThree,type ThreeEvent } from '@react-three/fiber';
import { Html,Line,OrbitControls } from '@react-three/drei';
import type {OrbitControls as Controls} from 'three-stdlib';
import * as THREE from 'three';
import type {CanonicalPoint,EvidenceAssembly,EvidenceFeature,RealityAuthority,SectionPlane,Vec3} from './types';
import type {CameraBookmark} from './presentation';
import {bodyOrigin,featureAnchors,featureCenter,pickCanonical,pointForDisplay,assemblySections} from './viewGeometry';
import {resolveTransform} from './spatial';
import {WebGLRecovery} from '../workstation/WorkspaceBoundary';
import {GraniteMaterial} from '../scene/DetailMaterial';

export interface CameraCommand {revision:number;mode:'OBJECT'|'ROOM'|'TOP'|'BOOKMARK'|'SAVE';bookmark?:CameraBookmark}
function CameraRig({assembly,command,explode,onBookmark}:{assembly:EvidenceAssembly;command:CameraCommand;explode:number;onBookmark:(b:CameraBookmark)=>void}){
  const {camera,size}=useThree(),ref=useRef<Controls>(null);
  useEffect(()=>{
    const controls=ref.current;if(!controls)return;
    if(command.mode==='SAVE'){onBookmark({name:`View ${command.revision}`,position:camera.position.toArray() as Vec3,target:controls.target.toArray() as Vec3});return;}
    if(command.mode==='BOOKMARK'&&command.bookmark){camera.position.set(...command.bookmark.position);controls.target.set(...command.bookmark.target);}
    else{
      const room=command.mode==='ROOM',bounds=new THREE.Box3();
      for(const f of assembly.features.filter(f=>(room||f.objectId.includes('sarcophagus'))&&(f.geometry.kind==='box'||f.geometry.kind==='surface')))for(const p of featureAnchors(f))bounds.expandByPoint(new THREE.Vector3(...pointForDisplay(assembly,f,p,explode)));
      const target=bounds.isEmpty()?bodyOrigin(assembly):bounds.getCenter(new THREE.Vector3()).toArray() as Vec3;
      const aspect=size.width/Math.max(1,size.height),fov=42*Math.PI/180,radius=bounds.isEmpty()?2.5:Math.max(.5,bounds.getSize(new THREE.Vector3()).length()/2);
      const distance=radius/Math.sin(Math.min(fov,2*Math.atan(Math.tan(fov/2)*aspect))/2);
      const direction=new THREE.Vector3(...(command.mode==='TOP'?[0,-.001,1]:[1,-1.3,1.05]) as Vec3).normalize();
      controls.target.set(...target);camera.position.copy(direction.multiplyScalar(distance).add(controls.target));
    }
    camera.up.set(0,0,1);controls.update();
  // Resize doesn't move a researcher's camera; the next Fit command uses the new aspect.
  },[command.revision,assembly]);
  return <OrbitControls ref={ref} makeDefault enableDamping dampingFactor={.12} rotateSpeed={.6} zoomSpeed={.7} panSpeed={.7} zoomToCursor screenSpacePanning minDistance={.08} maxDistance={150} minPolarAngle={.015} maxPolarAngle={Math.PI-.015}/>;
}
function polygonGeometry(vertices:Vec3[]){
  const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(vertices.flat(),3));
  const ix:number[]=[];for(let i=1;i<vertices.length-1;i++)ix.push(0,i,i+1);geom.setIndex(ix);geom.computeVertexNormals();return geom;
}
const COLORS:Record<RealityAuthority,string>={OBSERVED:'#72e8bb',RECONSTRUCTED:'#c6a273',HYPOTHESIS:'#ce91d9'};
function PhysicalFeature({assembly,feature,selected,explode,plane,hotspots,onPick}:{assembly:EvidenceAssembly;feature:EvidenceFeature;selected:boolean;explode:number;plane:SectionPlane|null;hotspots:boolean;onPick:(feature:EvidenceFeature,point:CanonicalPoint)=>void}){
  const anchors=featureAnchors(feature),g=feature.geometry;
  const pts=anchors.map(p=>pointForDisplay(assembly,feature,p,explode));
  const color=selected?'#ffe2a1':COLORS[feature.authority];
  const clip=useMemo(()=>{
    if(!plane)return [];
    const intoPlane=resolveTransform(assembly.frames,assembly.transforms,feature.frameId,plane.frameId);if(!intoPlane)return [];
    // Build the plane in displayed world from three physical frame points. Unknown lid↔room never clips by accident.
    const frame=assembly.frames.find(f=>f.id===plane.frameId);if(!frame)return [];
    const origin=pointForDisplay(assembly,{...feature,frameId:frame.id},[0,0,0],explode);
    const end=pointForDisplay(assembly,{...feature,frameId:frame.id},plane.normal,explode);
    const n=new THREE.Vector3(...end).sub(new THREE.Vector3(...origin)).normalize();
    return [new THREE.Plane(n, -plane.offset/Math.hypot(...plane.normal)-new THREE.Vector3(...origin).dot(n))];
  },[assembly,feature,plane,explode]);
  const geometry=useMemo(()=>g.kind==='surface'?polygonGeometry(pts):null,[g,explode]);
  useEffect(()=>()=>geometry?.dispose(),[geometry]);
  const pick=(e:ThreeEvent<MouseEvent>)=>{if(clip.some(p=>p.distanceToPoint(e.point)<-1e-7))return;e.stopPropagation();onPick(feature,pickCanonical(assembly,feature,e.point.toArray() as Vec3,explode));};
  if(!anchors.length)return null;
  const center=pointForDisplay(assembly,feature,featureCenter(feature),explode);
  const box=g.kind==='box'?g:null;
  const matrix=resolveTransform(assembly.frames,assembly.transforms,feature.frameId,assembly.authoritativeFrameId);
  const rotation=matrix?new THREE.Euler().setFromRotationMatrix(new THREE.Matrix4().set(...matrix)):new THREE.Euler();
  return <group userData={{evidenceFeatureId:feature.id,authority:feature.authority,physicalFrame:feature.frameId,presentationOnly:false}}>
    {box?<mesh position={center} rotation={rotation} onClick={pick}>
      <boxGeometry args={box.max.map((v,i)=>v-box.min[i]) as Vec3}/>
      {feature.objectId.includes('sarcophagus')&&feature.authority==='RECONSTRUCTED'?<GraniteMaterial color={selected?'#ead8b3':'#bd9d82'} clippingPlanes={clip}/>:<meshStandardMaterial color={color} roughness={.87} metalness={0} clippingPlanes={clip} side={THREE.DoubleSide}/>}
    </mesh>:g.kind==='surface'&&feature.id==='feature.chamber.floor'?<Line points={[...pts,pts[0]]} color={color} dashed dashSize={.15} gapSize={.1}/>:g.kind==='surface'&&geometry?<mesh geometry={geometry} onClick={pick}><meshStandardMaterial color={color} roughness={.93} transparent opacity={selected?.65:.18} depthWrite={false} clippingPlanes={clip} side={THREE.DoubleSide}/></mesh>:g.kind==='segment'?(hotspots||selected)&&<Line points={pts} color={color} lineWidth={selected?2:1} dashed={feature.authority==='HYPOTHESIS'} onClick={pick}/>:<mesh position={center} onClick={pick}><sphereGeometry args={[.018,12,12]}/><meshBasicMaterial color={color}/></mesh>}
    {selected&&box&&!plane&&<Line points={[pts[0],pts[1],pts[3],pts[2],pts[0],pts[4],pts[5],pts[7],pts[6],pts[4],pts[5],pts[1],pts[3],pts[7],pts[6],pts[2]]} color="#f3d8a2" lineWidth={1}/>}
    {hotspots&&feature.authority==='OBSERVED'&&<Html position={center} center distanceFactor={7}><div className="evidenceCallout"><button onClick={()=>onPick(feature,{frameId:feature.frameId,position:featureCenter(feature),featureId:feature.id})}>{feature.label}</button></div></Html>}
  </group>;
}
function Cap({points}:{points:Vec3[]}){
  const geometry=useMemo(()=>polygonGeometry(points),[points]);useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry}><meshBasicMaterial color="#d9a45c" side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-2}/></mesh>;
}
export interface LegacyEnvelope {position:Vec3;size:Vec3;rotation:Vec3}
export function AssemblyScene({assembly,selectedId,layers,room,isolated,explode,plane,caps,hotspots,points,camera,onBookmark,onPick,onLost,onRestored,comparison,legacy}:{
  assembly:EvidenceAssembly;selectedId:string;layers:Record<RealityAuthority,boolean>;room:boolean;isolated:string|null;explode:number;plane:SectionPlane|null;caps:boolean;hotspots:boolean;points:CanonicalPoint[];camera:CameraCommand;onBookmark:(b:CameraBookmark)=>void;onPick:(f:EvidenceFeature,p:CanonicalPoint)=>void;onLost:()=>void;onRestored:()=>void;comparison:boolean;legacy:LegacyEnvelope|null;
}){
  const features=assembly.features.filter(f=>layers[f.authority]&&(!isolated||f.objectId===isolated)&&(room||f.objectId.includes('sarcophagus')));
  const cuts=plane?assemblySections(assembly,plane):[];
  const displayPoints=points.map(p=>{const f=assembly.features.find(f=>f.id===p.featureId)??assembly.features.find(f=>f.frameId===p.frameId);return f?pointForDisplay(assembly,f,p.position,explode):p.position;});
  return <Canvas dpr={[1,1.75]} gl={{antialias:true,alpha:false}} camera={{fov:42,near:.008,far:500,up:[0,0,1]}} onCreated={({gl})=>{gl.localClippingEnabled=true;}}>
    <color attach="background" args={['#080f14']}/><ambientLight intensity={1.1}/><hemisphereLight args={['#ffe6ba','#3e4d49',1.65]}/><directionalLight position={[2,-6,10]} intensity={2} color="#ffe8c7"/><directionalLight position={[-8,4,6]} intensity={1.1} color="#d7e9ec"/>
    {features.map(f=><PhysicalFeature key={f.id} assembly={assembly} feature={f} selected={f.id===selectedId} explode={explode} plane={plane} hotspots={hotspots} onPick={onPick}/>)}
    {caps&&layers.RECONSTRUCTED&&cuts.filter(c=>features.some(f=>f.id===c.featureId)).map(c=>{const f=features.find(f=>f.id===c.featureId)!;return <Cap key={c.featureId} points={c.polygon.map(p=>pointForDisplay(assembly,f,p,explode))}/>;})}
    {displayPoints.length>1&&<Line points={displayPoints} color="#7eeac4" lineWidth={2} dashed dashSize={.055} gapSize={.025}/>}
    {displayPoints.map((p,i)=><group key={i} position={p}><mesh><sphereGeometry args={[.025,12,12]}/><meshBasicMaterial color="#7eeac4" depthTest={false}/></mesh><Html center position={[0,0,.1]}><span className="evidenceMark">{String.fromCharCode(65+i)}</span></Html></group>)}
    {comparison&&legacy&&<group position={legacy.position} rotation={legacy.rotation}><mesh><boxGeometry args={legacy.size}/><meshBasicMaterial wireframe color="#c397db" transparent opacity={.8}/></mesh><Html position={[0,0,legacy.size[2]/2+.2]} center><span className="evidenceMark">Legacy envelope · floor-aligned comparison ONLY</span></Html></group>}
    <CameraRig assembly={assembly} command={camera} explode={explode} onBookmark={onBookmark}/><WebGLRecovery onLost={onLost} onRestored={onRestored}/>
  </Canvas>;
}
