import { useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import {sphericalCellPosition} from './sphericalExpansion';
import type { StoneField } from '../lib/model';
import { buildStoneCells, clippingPlanes, explodedCellPosition } from './geometry';
import type { SectionAxis, StoneCellInfo } from './types';

function StoneFieldMesh({ field, explode, sphere, visible, selectedStoneId, sectionAxis, sectionPos, onSelectStone }: {
  field: StoneField; explode: number; sphere:boolean; visible: boolean; selectedStoneId?: string | null;
  sectionAxis: SectionAxis; sectionPos: number; onSelectStone: (cell: StoneCellInfo) => void;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const cells = useMemo(() => buildStoneCells(field), [field]);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);
  const rotation = useMemo(() => new THREE.Euler(), []);
  const scale = useMemo(() => new THREE.Vector3(), []);
  const cellColor = useMemo(() => new THREE.Color(), []);

  const progress=useRef(explode),last=useRef<string>('');
  useFrame((_,delta) => {
    if (!ref.current) return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    progress.current=reduced||!sphere?explode:THREE.MathUtils.damp(progress.current,explode,9,delta);
    if(Math.abs(progress.current-explode)<.0001)progress.current=explode;
    const key=`${progress.current}:${sphere}:${selectedStoneId}`;if(last.current===key)return;last.current=key;
    const displayExplode=progress.current;
    ref.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const gap = Math.max(0.76, 1 - field.joint_gap_fraction);

    cells.forEach((cell, i) => {
      const [x, y, z] = sphere?sphericalCellPosition(cell,i,cells.length,displayExplode/2.75):explodedCellPosition(cell, field, displayExplode);
      position.set(x, y, z);
      const individual = (((cell.index * 13 + cell.course * 7) % 17) - 8) / 8;
      const separationScale = 1;
      rotation.set(individual * displayExplode * 0.025, (cell.course % 3 - 1) * displayExplode * 0.012, individual * displayExplode * 0.035);
      quaternion.setFromEuler(rotation);
      if (cell.face === 'N' || cell.face === 'S') scale.set(cell.width_m * gap * separationScale, cell.depth_m * gap * separationScale, cell.height_m * gap * separationScale);
      else scale.set(cell.depth_m * gap * separationScale, cell.width_m * gap * separationScale, cell.height_m * gap * separationScale);
      matrix.compose(position, quaternion, scale);
      ref.current!.setMatrixAt(i, matrix);
      if (cell.id === selectedStoneId) cellColor.set('#ffe3a3');
      else {
        const coursePhase = cell.course / field.visual_course_count;
        const faceColor = cell.face === 'N' ? '#e8d19a'
          : cell.face === 'E' ? '#dcb56f'
            : cell.face === 'S' ? '#c98e5e'
              : '#f1dda6';
        cellColor.set(faceColor).offsetHSL(
          ((cell.index % 7) - 3) * 0.0025,
          ((cell.index % 5) - 2) * 0.012,
          coursePhase * 0.075 + ((cell.index % 4) - 1.5) * 0.012,
        );
      }
      ref.current!.setColorAt(i, cellColor);
    });

    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    ref.current.computeBoundingSphere();
    ref.current.userData.expansion={mode:sphere?'SPHERE':'COURSES',amount:displayExplode,count:cells.length};
  });

  if (!visible) return null;
  const clip = clippingPlanes(sectionAxis, sectionPos);
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.instanceId === undefined) return;
    e.stopPropagation();
    const cell = cells[e.instanceId];
    if (cell) onSelectStone(cell);
  };

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, cells.length]} userData={{authority:'HYPOTHESIS',geometryAuthority:'PROCEDURAL_ANALYSIS_CELLS',coordinateFrame:'frame.khafre.monument.legacy',surfaceSurvey:'NOT_ESTABLISHED',presentationOnly:true}} castShadow={false} receiveShadow onClick={handleClick} frustumCulled>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial vertexColors roughness={0.84} metalness={0.01} emissive="#9a7240" emissiveIntensity={0.34} clippingPlanes={clip} />
    </instancedMesh>
  );
}

function SelectedStoneOutline({ cell, field, explode,sphere }: { cell: StoneCellInfo | null; field: StoneField; explode: number;sphere:boolean }) {
  if (!cell) return null;
  const cells=buildStoneCells(field);
  const p = sphere?sphericalCellPosition(cell,cells.findIndex(c=>c.id===cell.id),cells.length,explode/2.75):explodedCellPosition(cell, field, explode);
  const size: [number, number, number] = cell.face === 'N' || cell.face === 'S'
    ? [cell.width_m * 1.05, cell.depth_m * 1.18, cell.height_m * 1.12]
    : [cell.depth_m * 1.18, cell.width_m * 1.05, cell.height_m * 1.12];
  return (
    <mesh position={p}>
      <boxGeometry args={size} />
      <meshBasicMaterial color="#ffe3a3" wireframe transparent opacity={0.98} depthTest={false} />
    </mesh>
  );
}

export function MasonryLayer({ field, explode,sphere=false, visible, selectedStone, sectionAxis, sectionPos, onSelectStone }: {
  field: StoneField; explode: number;sphere?:boolean; visible: boolean; selectedStone: StoneCellInfo | null;
  sectionAxis: SectionAxis; sectionPos: number; onSelectStone: (cell: StoneCellInfo) => void;
}) {
  // Hidden hypothesis cells need neither instanced allocations nor a surviving selection outline.
  if (!visible) return null;
  return <>
    <StoneFieldMesh
      field={field}
      explode={explode}
      sphere={sphere}
      visible={visible}
      selectedStoneId={selectedStone?.id}
      sectionAxis={sectionAxis}
      sectionPos={sectionPos}
      onSelectStone={onSelectStone}
    />
    {!sphere&&<SelectedStoneOutline cell={selectedStone} field={field} explode={explode} sphere={false}/>}
  </>;
}
