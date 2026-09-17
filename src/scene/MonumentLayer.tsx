import { Suspense, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { Edges, Html } from '@react-three/drei';
import { STLLoader } from 'three-stdlib';
import type { Part, ProvenanceClass } from '../lib/model';
import { clippingPlanes, normalizeVector } from './geometry';
import type { SectionAxis, UiMode } from './types';

const PROVENANCE: Record<ProvenanceClass, string> = {
  SOURCE: '#61e6a8', MEASURED: '#61e6a8', VALIDATED: '#61e6a8',
  DERIVED: '#75a7ff', GENERATED: '#aeb7c2', SIMULATED: '#b38cff',
  ASSUMED: '#e0a22f', UNVERIFIED: '#e45a47', USER_LOCKED: '#d8edf7',
};

function partColor(part: Part, selected: boolean, mode: UiMode) {
  if (selected) return '#ffe3a3';
  if (part.provenance.class === 'UNVERIFIED') return '#ad796b';
  if (mode === 'DISCOVER') {
    if (part.id.includes('pyramid')) return '#d8bd7b';
    if (part.id.includes('sarcophagus')) return '#a96f58';
    return '#c8ad78';
  }
  if (mode === 'EXPLORE') {
    if (part.id.includes('pyramid')) return '#d7bb79';
    if (part.id.includes('casing') && !part.id.includes('granite')) return '#ecd49a';
    if (part.id.includes('granite') || part.id.includes('sarcophagus')) return '#a66f59';
    if (part.id.includes('chamber')) return '#cfaa72';
    if (part.id.includes('shaft') || part.id.includes('passage')) return '#b6976d';
    if (part.id.includes('temple') || part.id.includes('causeway')) return '#c3a875';
    if (part.id.includes('plateau')) return '#696659';
    return '#c9ad78';
  }
  return PROVENANCE[part.provenance.class] ?? '#96a0aa';
}

function Stl({ url, color, opacity, clip }: { url: string; color: string; opacity: number; clip: ReturnType<typeof clippingPlanes> }) {
  const geometry = useLoader(STLLoader, url);
  useMemo(() => {
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
  }, [geometry]);
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.82} metalness={0.015} emissive={color} emissiveIntensity={0.11} transparent={opacity < 1} opacity={opacity} depthWrite={opacity >= 0.5} clippingPlanes={clip} />
      <Edges threshold={26} color="#5b4930" />
    </mesh>
  );
}

function PartMesh({
  part, explode, selected, showUnverified, mode, sectionAxis, sectionPos, xray, showLabels, onSelect,
}: {
  part: Part; explode: number; selected: boolean; showUnverified: boolean; mode: UiMode;
  sectionAxis: SectionAxis; sectionPos: number; xray: boolean; showLabels: boolean; onSelect: (id: string) => void;
}) {
  if (part.provenance.class === 'UNVERIFIED' && !showUnverified) return null;
  if (part.detail_tier === 'hidden' && part.id !== 'part.plateau.reference') return null;

  const ev = normalizeVector(part.spatial.explosion_vector ?? [0, 0, 1]);
  const distance = (part.spatial.explosion_distance_m || 0) * explode;
  const p = part.spatial.origin_m;
  const position: [number, number, number] = [p[0] + ev[0] * distance, p[1] + ev[1] * distance, p[2] + ev[2] * distance];
  const color = partColor(part, selected, mode);
  const opacity = part.id === 'part.plateau.reference' ? 0.12
      : part.id === 'part.pyramid.khafre' ? (xray ? 0.11 : 0.78)
      : part.provenance.class === 'UNVERIFIED' ? 0.48 : 0.98;
  const cad = part.spatial.cad;
  const stl = cad && cad.format.toLowerCase() === 'stl' ? `/model/${(cad.preview || cad.path).replaceAll('\\', '/')}` : null;
  const primitive = part.spatial.primitive;
  const clip = clippingPlanes(sectionAxis, sectionPos);

  return (
    <group position={position} rotation={part.spatial.rpy_rad} onClick={e => { e.stopPropagation(); onSelect(part.id); }} scale={selected ? 1.018 : 1}>
      {stl ? (
        <Suspense fallback={<Html center><span className="loader">mesh…</span></Html>}>
          <Stl url={stl} color={color} opacity={opacity} clip={clip} />
        </Suspense>
      ) : primitive.kind === 'box' ? (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[primitive.sx, primitive.sy, primitive.sz]} />
          <meshStandardMaterial color={color} roughness={0.84} emissive={color} emissiveIntensity={0.11} transparent={opacity < 1} opacity={opacity} depthWrite={opacity >= 0.5} clippingPlanes={clip} />
          <Edges threshold={30} color={selected ? '#ffe8b1' : '#5b4930'} />
        </mesh>
      ) : (
        <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[primitive.radius, primitive.radius, primitive.height, 28]} />
          <meshStandardMaterial color={color} roughness={0.82} emissive={color} emissiveIntensity={0.11} transparent={opacity < 1} opacity={opacity} depthWrite={opacity >= 0.5} clippingPlanes={clip} />
          <Edges threshold={30} color={selected ? '#ffe8b1' : '#5b4930'} />
        </mesh>
      )}
      {selected && showLabels && <Html center position={[0, 0, 5]}><div className="objectTag">{part.name}</div></Html>}
    </group>
  );
}

export function MonumentLayer({
  parts, explode, selectedId, showUnverified, mode, sectionAxis, sectionPos, xray, showLabels, onSelect,
}: {
  parts: Part[]; explode: number; selectedId: string | null; showUnverified: boolean; mode: UiMode;
  sectionAxis: SectionAxis; sectionPos: number; xray: boolean; showLabels: boolean; onSelect: (id: string) => void;
}) {
  return <>{parts.map(part => (
    <PartMesh
      key={part.id}
      part={part}
      explode={explode}
      selected={selectedId === part.id}
      showUnverified={showUnverified}
      mode={mode}
      sectionAxis={sectionAxis}
      sectionPos={sectionPos}
      xray={xray}
      showLabels={showLabels}
      onSelect={onSelect}
    />
  ))}</>;
}
