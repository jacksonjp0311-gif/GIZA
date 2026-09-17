import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Line, Html } from '@react-three/drei';
import type { OrbitControls as Controls } from 'three-stdlib';
import * as THREE from 'three';
import { SPHINX_REGIONS, regionOffset, repairBlocks, type RegionId, type Vec3 } from './catalog';
import { bodyGeometry, chestGeometry, pawGeometry, headGeometry, nemesGeometry, tailGeometry, stelaGeometry } from './geometry';
import { SphinxMaterial } from './SphinxMaterial';
import { WebGLRecovery } from '../workstation/WorkspaceBoundary';
import {DEFAULT_REALITY_LAYERS,objectVisibleInRealityLayer,sphinxObjectAuthority,type RealityLayers} from '../evidence/authority';

export type SphinxView='Perspective'|'Front'|'Side'|'Top';
export interface SphinxSceneProps {
  explosion:number;selected:RegionId|null;isolated:boolean;hidden:RegionId[];geology:boolean;wireframe:boolean;
  section:number|null;ground:boolean;dimensions:boolean;turntable:boolean;view:SphinxView;revision:number;
  onSelect:(id:RegionId,block?:number)=>void;
  selectedBlock?:number;
  focused:RegionId|null;
  onReady?:(scene:THREE.Scene)=>void;
  realityLayers?:RealityLayers;
}
function Region({id,explosion,onSelect,children}:{id:RegionId;explosion:number;onSelect:SphinxSceneProps['onSelect'];children:ReactNode}){
  const ref=useRef<THREE.Group>(null);const target=useMemo(()=>new THREE.Vector3(...regionOffset(id,explosion)),[id,explosion]);
  const motion=useMemo(()=>window.matchMedia('(prefers-reduced-motion: reduce)'),[]);
  useFrame((_,dt)=>{ref.current?.position.lerp(target,motion.matches?1:1-Math.exp(-dt*7));});
  return <group ref={ref} name={id} userData={{region:id,geometry_authority:'ILLUSTRATIVE_RECONSTRUCTION',evidenceObject:sphinxObjectAuthority(id)}} onClick={e=>{if(e.delta<4){e.stopPropagation();onSelect(id);}}}>{children}</group>;
}
function Repairs({explosion,clip,wireframe,onSelect,selectedBlock}:{explosion:number;clip:THREE.Plane[];wireframe:boolean;onSelect:SphinxSceneProps['onSelect'];selectedBlock?:number}){
  const ref=useRef<THREE.InstancedMesh>(null);const blocks=useMemo(repairBlocks,[]),dummy=useMemo(()=>new THREE.Object3D(),[]),current=useRef(-1);
  const motion=useMemo(()=>window.matchMedia('(prefers-reduced-motion: reduce)'),[]);
  useEffect(()=>{if(!ref.current)return;blocks.forEach((_,i)=>ref.current!.setColorAt(i,new THREE.Color(i===selectedBlock?'#ff9933':'#ffffff')));if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;},[selectedBlock,blocks]);
  useFrame((_,dt)=>{
    if(!ref.current||Math.abs(current.current-explosion)<.00001)return;
    current.current=current.current<0||motion.matches?explosion:THREE.MathUtils.damp(current.current,explosion,7,dt);
    blocks.forEach((b,i)=>{const [x,y,z]=b.position,t=current.current;dummy.position.set(x*(1+t*.22),y+b.side*t*(8+b.course*1.3),z+t*(b.course*2+2));dummy.scale.set(...b.size);dummy.updateMatrix();ref.current!.setMatrixAt(i,dummy.matrix);});
    ref.current.instanceMatrix.needsUpdate=true;ref.current.computeBoundingSphere();
  });
  return <instancedMesh ref={ref} args={[undefined,undefined,blocks.length]} userData={{evidenceObject:sphinxObjectAuthority('repairs'),geometry_authority:'HYPOTHETICAL_GEOMETRY'}} onClick={(e:ThreeEvent<MouseEvent>)=>{if(e.delta<4){e.stopPropagation();onSelect('repairs',e.instanceId);}}}>
    <boxGeometry/><meshStandardMaterial color="#bca0d3" roughness={.93} clippingPlanes={clip} wireframe={wireframe}/>
  </instancedMesh>;
}
function Camera({view,revision,selected,isolated,focused,explosion,turntable}:SphinxSceneProps){
  const {camera,size}=useThree(),ref=useRef<Controls>(null);
  const motion=useMemo(()=>window.matchMedia('(prefers-reduced-motion: reduce)'),[]);
  // User zoom/rotation is never overwritten by the explode slider or selection.
  useEffect(()=>{
    if(!ref.current)return;
    const region=SPHINX_REGIONS.find(r=>r.id===(isolated?selected:focused));
    const target=region?new THREE.Vector3(...region.target).add(new THREE.Vector3(...regionOffset(region.id,explosion))):new THREE.Vector3(3.75,0,10.1+12*explosion);
    const cam=camera as THREE.PerspectiveCamera,v=THREE.MathUtils.degToRad(cam.fov),h=2*Math.atan(Math.tan(v/2)*size.width/size.height);
    const direction:Vec3=view==='Front'?[1,0,.12]:view==='Side'?[0,-1,.13]:view==='Top'?[0,-.001,1]:[1,-1.6,.7];
    const dir=new THREE.Vector3(...direction).normalize(),right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,0,1),dir).normalize(),up=new THREE.Vector3().crossVectors(dir,right).normalize();
    let distance=0;
    const bounds=region?new THREE.Box3(target.clone().addScalar(-region.radius),target.clone().addScalar(region.radius)):new THREE.Box3(new THREE.Vector3(-33-14*explosion,-10-14*explosion,0),new THREE.Vector3(40.5+14*explosion,10+14*explosion,20.2+24*explosion));
    for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
      const p=new THREE.Vector3(x,y,z).sub(target);distance=Math.max(distance,p.dot(dir)+Math.max(Math.abs(p.dot(right))/Math.tan(h/2),Math.abs(p.dot(up))/Math.tan(v/2)));
    }
    cam.up.set(0,0,1);ref.current.target.copy(target);cam.position.copy(dir.multiplyScalar(distance*1.12).add(target));cam.updateProjectionMatrix();ref.current.update();
  },[view,revision,isolated,focused,size.width,size.height,camera]);
  return <OrbitControls ref={ref} makeDefault enableDamping dampingFactor={.1} zoomToCursor rotateSpeed={.55} zoomSpeed={.8} panSpeed={.75} minDistance={2} maxDistance={600} minPolarAngle={.03} maxPolarAngle={Math.PI*.88} autoRotate={turntable&&!motion.matches} autoRotateSpeed={.65}/>;
}
function Geometry(p:SphinxSceneProps){
  const body=useMemo(bodyGeometry,[]),head=useMemo(headGeometry,[]),north=useMemo(()=>nemesGeometry(1),[]),south=useMemo(()=>nemesGeometry(-1),[]),tail=useMemo(tailGeometry,[]);
  const chest=useMemo(chestGeometry,[]),northPaw=useMemo(()=>pawGeometry(1),[]),southPaw=useMemo(()=>pawGeometry(-1),[]);
  const stela=useMemo(stelaGeometry,[]);useEffect(()=>()=>stela.dispose(),[stela]);
  useEffect(()=>()=>{for(const g of [body,head,north,south,tail,chest,northPaw,southPaw])g.dispose();},[body,head,north,south,tail,chest,northPaw,southPaw]);
  const clip=useMemo(()=>p.section===null?[]:[new THREE.Plane(new THREE.Vector3(0,-1,0),p.section)],[p.section]);
  const layers=p.realityLayers??DEFAULT_REALITY_LAYERS;
  const visible=(id:RegionId)=>objectVisibleInRealityLayer(sphinxObjectAuthority(id),layers)&&!p.hidden.includes(id)&&(!p.isolated||p.selected===id);
  const mat=(id:RegionId,color?:string)=><SphinxMaterial color={color??SPHINX_REGIONS.find(r=>r.id===id)!.color} granite={id==='stela'} geology={p.geology&&['core','chest','head','nemes'].includes(id)} upper={id==='head'||id==='nemes'} wireframe={p.wireframe} selected={p.selected===id} clip={clip}/>;
  const ellipsoid=(id:RegionId,at:Vec3,scale:Vec3,color?:string)=><mesh position={at} scale={scale} castShadow receiveShadow><sphereGeometry args={[1,48,32]}/>{mat(id,color)}</mesh>;
  const region=(id:RegionId,children:ReactNode)=>visible(id)?<Region key={id} id={id} explosion={p.explosion} onSelect={p.onSelect}>{children}</Region>:null;
  return <>
    {region('core',<mesh geometry={body} castShadow receiveShadow>{mat('core')}</mesh>)}
    {region('chest',<mesh geometry={chest} castShadow receiveShadow>{mat('chest')}</mesh>)}
    {region('head',<>
      <mesh geometry={head} castShadow>{mat('head')}</mesh>
      {[-1,1].map(s=><group key={s}>
        {ellipsoid('head',[19.45,s*2.62,16.55],[.68,.28,.92])}
      </group>)}
    </>)}
    {region('nemes',<><mesh geometry={north} castShadow receiveShadow>{mat('nemes')}</mesh><mesh geometry={south} castShadow receiveShadow>{mat('nemes')}</mesh></>)}
    {region('north-paw',<mesh geometry={northPaw} castShadow receiveShadow>{mat('north-paw')}</mesh>)}
    {region('south-paw',<mesh geometry={southPaw} castShadow receiveShadow>{mat('south-paw')}</mesh>)}
    {region('haunches',<>{[-1,1].map(s=><group key={s}>{ellipsoid('haunches',[-23,s*6.25,3.5],[8.2,3.4,3.5])}{ellipsoid('haunches',[-17,s*7,1.2],[6,2.2,1.2])}</group>)}</>)}
    {region('tail',<mesh geometry={tail}>{mat('tail')}</mesh>)}
    {/* A small flat display face must not turn the monument-scale shadow map into false relief bands. */}
    {region('stela',<mesh geometry={stela} castShadow>{mat('stela')}</mesh>)}
    {visible('repairs')&&<Repairs explosion={p.explosion} clip={clip} wireframe={p.wireframe} onSelect={p.onSelect} selectedBlock={p.selectedBlock}/>}
    {p.ground&&!p.isolated&&<mesh position={[2,0,-.5]} receiveShadow><boxGeometry args={[98,40,.7]}/><meshStandardMaterial color="#6b6250" roughness={1}/></mesh>}
    {p.dimensions&&layers.OBSERVED&&p.selected==='stela'&&!p.hidden.includes('stela')&&<group position={regionOffset('stela',p.explosion)} userData={{reality_authority:'OBSERVED',coordinate_authority:'RECONSTRUCTED',reason:'Source-reported scalar at a display anchor; not an observed edge.'}}><Line points={[[23.5,-1.6,0],[23.5,-1.6,3.5]]} color="#72e8bb"/><Html position={[23.5,0,4.1]} center><span className="detailDimension">≈ 3.5 m · published height · observed record</span></Html></group>}
    {p.dimensions&&layers.OBSERVED&&!p.isolated&&p.selected!=='stela'&&<group userData={{reality_authority:'OBSERVED',coordinate_authority:'RECONSTRUCTED',reason:'Published overall summary dimensions; not surveyed surface control.'}}><Line points={[[-33,-16,.1],[40.5,-16,.1]]} color="#72e8bb"/><Html position={[4,-16,1]} center><span className="detailDimension">≈ 73.5 m · published overall length</span></Html><Line points={[[23,13,0],[23,13,20]]} color="#72e8bb"/><Html position={[23,13,21]} center><span className="detailDimension">≈ 20 m · height · observed record</span></Html></group>}
  </>;
}
export function SphinxScene(p:SphinxSceneProps){
  return <Canvas shadows dpr={[1,1.75]} camera={{fov:42,near:.1,far:1800,up:[0,0,1]}} gl={{antialias:true,alpha:false}} onCreated={({gl,scene})=>{gl.localClippingEnabled=true;scene.userData={geometry_authority:'ILLUSTRATIVE_RECONSTRUCTION',units:'metres',frame:'local X east Y north Z up; not georegistered'};p.onReady?.(scene);}}>
    <color attach="background" args={['#101b21']}/><ambientLight intensity={.55}/><hemisphereLight args={['#fff0dc','#51432e',1.3]}/>
    <directionalLight position={[35,-55,85]} intensity={3} color="#ffe4b0" castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-85} shadow-camera-right={85} shadow-camera-top={70} shadow-camera-bottom={-70} shadow-camera-far={250} shadow-bias={-.00005} shadow-normalBias={.08}/>
    <directionalLight position={[-35,30,30]} intensity={1.1} color="#d2e2ec"/>
    <WebGLRecovery/><Geometry {...p}/><Camera {...p}/>
  </Canvas>;
}
