import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { ActiveSimulation, AcousticResult, GravityResult, StrataResult } from '../simlab/types';

function heatColor(t: number) {
  const x = Math.max(0, Math.min(1, t));
  const c = new THREE.Color();
  if (x < 0.33) c.setRGB(0.08, 0.35 + x * 1.1, 0.95);
  else if (x < 0.66) c.setRGB((x - 0.33) * 2.4, 0.82, 0.85 - (x - 0.33) * 1.3);
  else c.setRGB(0.78 + (x - 0.66) * 0.65, 0.72 - (x - 0.66) * 1.6, 0.12);
  return c;
}

function pressureColor(p: number) {
  const a=Math.min(1,Math.abs(p));
  const neg=new THREE.Color('#38bdf8');
  const node=new THREE.Color('#334155');
  const pos=new THREE.Color('#ff8a35');
  return p < 0 ? node.clone().lerp(neg,a) : node.clone().lerp(pos,a);
}

function GravityField({gravity}:{gravity:GravityResult}) {
  const ref=useRef<THREE.InstancedMesh>(null);
  const peak=gravity.summary.max_magnitude_microgal || 1;
  const cellSize=useMemo(()=>{
    if(gravity.points.length<2)return 18;
    const a=gravity.points[0].coordinates_m,b=gravity.points[1].coordinates_m;
    return Math.max(4,Math.hypot(b[0]-a[0],b[1]-a[1])*.88);
  },[gravity]);
  useLayoutEffect(()=>{
    if(!ref.current)return;
    const mesh=ref.current,dummy=new THREE.Object3D();
    gravity.points.forEach((point,i)=>{
      const [x,y,z]=point.coordinates_m;
      const t=point.magnitude_microgal/peak;
      dummy.position.set(x,y,z+.8); dummy.scale.set(1,1,.15+2.4*t); dummy.updateMatrix();
      mesh.setMatrixAt(i,dummy.matrix); mesh.setColorAt(i,heatColor(t));
    });
    mesh.instanceMatrix.needsUpdate=true; if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  },[gravity,peak]);
  return <instancedMesh ref={ref} args={[undefined,undefined,gravity.points.length]} frustumCulled={false}>
    <boxGeometry args={[cellSize,cellSize,1]}/>
    <meshStandardMaterial transparent opacity={.58} roughness={.35} metalness={.05} vertexColors/>
  </instancedMesh>;
}

function AcousticField({acoustic}:{acoustic:AcousticResult}) {
  const points=acoustic.selected_visualization.points;
  const ref=useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(()=>{
    if(!ref.current)return;
    const mesh=ref.current,dummy=new THREE.Object3D();
    points.forEach((point,i)=>{
      const [x,y,z]=point.coordinates_m;
      const mag=Math.abs(point.normalized_pressure);
      const size=.45+1.45*mag;
      dummy.position.set(x,y,z); dummy.scale.setScalar(size); dummy.updateMatrix();
      mesh.setMatrixAt(i,dummy.matrix); mesh.setColorAt(i,pressureColor(point.normalized_pressure));
    });
    mesh.instanceMatrix.needsUpdate=true; if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  },[points]);
  return <group>
    <instancedMesh ref={ref} args={[undefined,undefined,points.length]} frustumCulled={false}>
      <sphereGeometry args={[.52,10,8]}/>
      <meshBasicMaterial transparent opacity={.8} vertexColors depthWrite={false}/>
    </instancedMesh>
    <mesh position={[8.536305,4.40123,-.92872]}>
      <boxGeometry args={[14.16431,4.97459,5.24256]}/>
      <meshBasicMaterial color="#6bc7ef" wireframe transparent opacity={.13}/>
    </mesh>
  </group>;
}


function strataColor(t: number, hydraulic = false) {
  const x = Math.max(0, Math.min(1, t));
  const cold = new THREE.Color(hydraulic ? '#2dd4ff' : '#62c6f2');
  const hot = new THREE.Color(hydraulic ? '#ffb04c' : '#ff694c');
  return cold.lerp(hot, x);
}

function StrataField({strata}:{strata:StrataResult}) {
  const points=strata.field_points;
  const ref=useRef<THREE.InstancedMesh>(null);
  const maxStress=Math.max(1,...points.map(p=>p.stress_mpa));
  useLayoutEffect(()=>{
    if(!ref.current)return;
    const mesh=ref.current,dummy=new THREE.Object3D();
    points.forEach((point,i)=>{
      const [x,y,z]=point.coordinates_m;
      const t=point.stress_mpa/maxStress;
      dummy.position.set(x,y,z); dummy.scale.setScalar(.65+1.5*t); dummy.updateMatrix();
      mesh.setMatrixAt(i,dummy.matrix); mesh.setColorAt(i,strataColor(t,false));
    });
    mesh.instanceMatrix.needsUpdate=true; if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
  },[points,maxStress]);
  return <group>
    <instancedMesh ref={ref} args={[undefined,undefined,points.length]} frustumCulled={false}>
      <sphereGeometry args={[1.45,10,8]}/>
      <meshBasicMaterial transparent opacity={.8} vertexColors depthWrite={false}/>
    </instancedMesh>
  </group>;
}

export function SimulationLayer({visible,active,gravity,acoustic,strata}:{visible:boolean;active:ActiveSimulation;gravity:GravityResult|null;acoustic:AcousticResult|null;strata:StrataResult|null}) {
  if(!visible)return null;
  if(active==='ACOUSTICS' && acoustic)return <AcousticField acoustic={acoustic}/>;
  if(active==='GRAVITY' && gravity)return <GravityField gravity={gravity}/>;
  if(active==='STRATA' && strata)return <StrataField strata={strata}/>;
  return null;
}
