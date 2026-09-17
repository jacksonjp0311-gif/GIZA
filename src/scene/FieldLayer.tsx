import { Html } from '@react-three/drei';
import type { Part } from '../lib/model';
import type { UncertaintyRecord } from '../lib/field';
import { normalizeVector } from './geometry';

function FieldReferenceOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <group position={[0, 0, 0.25]}>
      <mesh>
        <ringGeometry args={[3.5, 4.2, 64]} />
        <meshBasicMaterial color="#68d7ff" transparent opacity={0.95} depthTest={false} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[2.2, 48]} />
        <meshBasicMaterial color="#68d7ff" transparent opacity={0.16} depthTest={false} />
      </mesh>
      <Html position={[6, 6, 2.5]} center={false} distanceFactor={7}>
        <div className="fieldTag"><b>FIELD ORIGIN</b><span>WGS84 context anchor · Z datum unresolved</span></div>
      </Html>
    </group>
  );
}

function UncertaintyEnvelope({ part, uncertainty, explode }: { part: Part | null; uncertainty: UncertaintyRecord | null; explode: number }) {
  if (!part || !uncertainty) return null;
  const [padX, padY, padZ] = uncertainty.render_envelope.pad_m;
  const primitive = part.spatial.primitive;
  const size: [number, number, number] = primitive.kind === 'box'
    ? [primitive.sx + 2 * padX, primitive.sy + 2 * padY, primitive.sz + 2 * padZ]
    : [primitive.radius * 2 + 2 * padX, primitive.radius * 2 + 2 * padY, primitive.height + 2 * padZ];
  const ev = normalizeVector(part.spatial.explosion_vector ?? [0, 0, 1]);
  const distance = (part.spatial.explosion_distance_m || 0) * explode;
  const p = part.spatial.origin_m;
  const position: [number, number, number] = [p[0] + ev[0] * distance, p[1] + ev[1] * distance, p[2] + ev[2] * distance];
  return (
    <group position={position} rotation={part.spatial.rpy_rad}>
      <mesh>
        <boxGeometry args={size} />
        <meshBasicMaterial color="#d879ff" wireframe transparent opacity={0.72} depthTest={false} />
      </mesh>
      <Html center position={[0, 0, size[2] / 2 + 4]} distanceFactor={6}>
        <div className="uncertaintyTag"><b>UNCERTAINTY</b><span>{uncertainty.render_envelope.meaning}</span></div>
      </Html>
    </group>
  );
}

export function FieldLayer({ visible, selectedPart, uncertainty, explode }: {
  visible: boolean; selectedPart: Part | null; uncertainty: UncertaintyRecord | null; explode: number;
}) {
  return <>
    <FieldReferenceOverlay visible={visible} />
    <UncertaintyEnvelope part={selectedPart} uncertainty={uncertainty} explode={explode} />
  </>;
}
