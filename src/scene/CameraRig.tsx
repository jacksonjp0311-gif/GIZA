import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { VIEW_PRESETS } from './geometry';
import type { ViewPreset } from './types';
import type { Part } from '../lib/model';
import { inspectionBounds } from '../lib/interiorInspection';

export function CameraRig({ preset, revision, speed=1,fitParts,explode=0 }: { preset: ViewPreset; revision: number;speed?:number;fitParts?:Part[];explode?:number }) {
  const { camera,size } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const moving = useRef(true);
  const desired = VIEW_PRESETS[preset];
  const desiredPosition = useMemo(() => new THREE.Vector3(...desired.position), [desired]);
  const desiredTarget = useMemo(() => new THREE.Vector3(...desired.target), [desired]);

  useEffect(() => {
    moving.current = !fitParts;
    if(!fitParts||!controls.current)return;
    const bounds=inspectionBounds(fitParts,explode),cam=camera as THREE.PerspectiveCamera;
    const vfov=THREE.MathUtils.degToRad(cam.fov),hfov=2*Math.atan(Math.tan(vfov/2)*size.width/size.height);
    const distance=bounds.radius/Math.sin(Math.min(vfov,hfov)/2)*1.15;
    controls.current.target.set(...bounds.target);
    camera.position.copy(new THREE.Vector3(.85,-1.3,.7).normalize().multiplyScalar(distance).add(controls.current.target));
    controls.current.update();
    // Explosion does not refit on every slider move. Fit interior explicitly reframes it.
  }, [preset, revision,fitParts,size.width,size.height]);

  useFrame((_, delta) => {
    if (!moving.current || !controls.current) return;
    const alpha = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 1 - Math.exp(-delta * 5.1 * speed);
    camera.position.lerp(desiredPosition, alpha);
    controls.current.target.lerp(desiredTarget, alpha);
    controls.current.update();
    if (camera.position.distanceTo(desiredPosition) < 0.35 && controls.current.target.distanceTo(desiredTarget) < 0.2) {
      camera.position.copy(desiredPosition);
      controls.current.target.copy(desiredTarget);
      controls.current.update();
      moving.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      maxDistance={1800}
      minDistance={fitParts?.length ? .15 : 10}
      enableDamping
      dampingFactor={0.075}
      rotateSpeed={0.55}
      zoomSpeed={0.92}
      zoomToCursor
      minPolarAngle={0.08}
      maxPolarAngle={Math.PI * 0.92}
      enablePan
      panSpeed={0.72}
      screenSpacePanning
      keyPanSpeed={18}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
      onStart={() => { moving.current = false; }}
    />
  );
}
