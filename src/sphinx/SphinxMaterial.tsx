import { useMemo } from 'react';
import * as THREE from 'three';
export function SphinxMaterial({color,geology,upper=false,granite=false,wireframe,selected,clip}:{color:string;geology:boolean;upper?:boolean;granite?:boolean;wireframe:boolean;selected:boolean;clip:THREE.Plane[]}) {
  const shader=useMemo(()=>(s:THREE.WebGLProgramParametersWithUniforms)=>{
    s.vertexShader=s.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vStone;').replace('#include <begin_vertex>','#include <begin_vertex>\nvStone = position;');
    s.fragmentShader=s.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vStone;');
    s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      float grain=sin(dot(vStone,vec3(83.4,117.8,71.3)))*sin(dot(vStone,vec3(139.7,51.8,99.1)));
      float beds=sin(vStone.z*6.4 + sin(vStone.x*.21)*.25);
      float footprint=length(fwidth(vStone));
      float grainFilter=1.0-smoothstep(.004,.025,footprint);
      float bedFilter=1.0-smoothstep(.12,.5,footprint);
      diffuseColor.rgb *= .96 + ${granite?'.10':'.028'}*grain*grainFilter ${granite?'':'+ .04*beds*bedFilter'};
      ${geology?`diffuseColor.rgb = mix(diffuseColor.rgb, ${upper?'20.0':'vStone.z'} < 3.0 ? vec3(.48,.39,.25) : ${upper?'20.0':'vStone.z'} < 12.0 ? vec3(.73,.48,.26) : vec3(.88,.76,.51), .65);`:''}
    `);
  },[geology,upper,granite]);
  return <meshStandardMaterial key={`${geology}-${upper}-${granite}`} color={color} roughness={granite?.8:.88} metalness={0} wireframe={wireframe} clippingPlanes={clip} side={THREE.DoubleSide} emissive={selected?'#845521':'#000000'} emissiveIntensity={selected?.22:0} onBeforeCompile={shader} customProgramCacheKey={()=>`sphinx-${geology}-${upper}-${granite}`}/>;
}
