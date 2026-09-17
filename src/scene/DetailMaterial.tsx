import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

// Deterministic illustrative mineral grain, NOT a photograph or surface scan.
export function GraniteMaterial({rough=false,attach,color='#978779',clippingPlanes=[]}:{rough?:boolean;attach?:string;color?:string;clippingPlanes?:THREE.Plane[]}) {
  const texture=useMemo(()=>{
    const size=256,data=new Uint8Array(size*size*4);
    let seed=1883;
    for(let i=0;i<size*size;i++){
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const n=seed/4294967296;
      const c=n<.16?[53,49,44]:n>.83?[173,157,133]:[116,100,82];
      for(let j=0;j<3;j++)data[i*4+j]=c[j]+Math.floor(n*18);
      data[i*4+3]=255;
    }
    const t=new THREE.DataTexture(data,size,size,THREE.RGBAFormat);
    t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);
    t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;
    t.generateMipmaps=true;t.colorSpace=THREE.SRGBColorSpace;t.needsUpdate=true;
    return t;
  },[]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <meshStandardMaterial attach={attach} map={texture} color={color} clippingPlanes={clippingPlanes} roughness={rough?.94:.3} metalness={0}/>;
}
