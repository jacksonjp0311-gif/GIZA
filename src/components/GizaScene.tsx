import { Canvas } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import type { Part, StoneField } from '../lib/model';
import type { UncertaintyRecord } from '../lib/field';
import type { ActiveSimulation, AcousticResult, GravityResult, StrataResult } from '../simlab/types';
import { MonumentLayer } from '../scene/MonumentLayer';
import { MasonryLayer } from '../scene/MasonryLayer';
import { FieldLayer } from '../scene/FieldLayer';
import { CameraRig } from '../scene/CameraRig';
import { SimulationLayer } from '../scene/SimulationLayer';
import { VIEW_PRESETS } from '../scene/geometry';
import type { SectionAxis, StoneCellInfo, UiMode, ViewPreset } from '../scene/types';

export type { SectionAxis, StoneCellInfo, UiMode, ViewPreset } from '../scene/types';
export { buildStoneCells } from '../scene/geometry';

export function GizaScene({
  parts, stoneField, showStoneField, explode, selectedId, selectedStone, showUnverified, mode, sectionAxis, sectionPos, animationSpeed,
  viewPreset = 'PERSPECTIVE', cameraRevision = 0, xray = false, showLabels = true, showFieldFrame = false, uncertainty = null, simulationVisible = false, activeSimulation = 'GRAVITY', gravityResult = null, acousticResult = null, strataResult = null,
  onSelect, onSelectStone,
}: {
  parts: Part[]; stoneField: StoneField; showStoneField: boolean; explode: number; selectedId: string | null;
  animationSpeed:number;
  selectedStone?: StoneCellInfo | null; showUnverified: boolean; mode: UiMode; sectionAxis: SectionAxis; sectionPos: number;
  viewPreset?: ViewPreset; cameraRevision?: number; xray?: boolean; showLabels?: boolean; showFieldFrame?: boolean; uncertainty?: UncertaintyRecord | null; simulationVisible?: boolean; activeSimulation?: ActiveSimulation; gravityResult?: GravityResult | null; acousticResult?: AcousticResult | null; strataResult?: StrataResult | null;
  onSelect: (id: string | null) => void;
  onSelectStone: (cell: StoneCellInfo) => void;
}) {
  const selectedPart = parts.find(part => part.id === selectedId) ?? null;

  return (
    <Canvas
      shadows
      dpr={[1, 1.65]}
      performance={{ min: 0.55 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: VIEW_PRESETS.PERSPECTIVE.position, fov: 36, near: 0.1, far: 4200 }}
      onPointerMissed={() => onSelect(null)}
      onCreated={({ gl, camera }) => {
        gl.localClippingEnabled = true;
        camera.up.set(0, 0, 1);
      }}
    >
      <color attach="background" args={['#02070b']} />
      <ambientLight intensity={0.82} />
      <hemisphereLight args={['#fff1d2', '#6b5132', 1.12]} />
      <directionalLight position={[320, -260, 520]} intensity={3.15} color="#fff0cf" castShadow />
      <directionalLight position={[-360, 260, 180]} intensity={1.05} color="#d7e4df" />
      <pointLight position={[0, -80, 210]} intensity={1.2} distance={760} color="#d99a4f" />
      <pointLight position={[-180, 210, 110]} intensity={0.9} distance={680} color="#e6bd77" />
      <Grid
        args={[820, 820]}
        position={[0, 0, -4.5]}
        rotation={[Math.PI / 2, 0, 0]}
        cellSize={20}
        cellThickness={0.55}
        cellColor="#173b49"
        sectionSize={100}
        sectionThickness={1.05}
        sectionColor="#2b6372"
        fadeDistance={610}
        fadeStrength={2.4}
        infiniteGrid={false}
        followCamera={false}
      />

      <MasonryLayer
        field={stoneField}
        explode={explode}
        visible={showStoneField}
        selectedStone={selectedStone ?? null}
        sectionAxis={sectionAxis}
        sectionPos={sectionPos}
        onSelectStone={onSelectStone}
      />

      <MonumentLayer
        parts={parts}
        explode={explode}
        selectedId={selectedId}
        showUnverified={showUnverified}
        mode={mode}
        sectionAxis={sectionAxis}
        sectionPos={sectionPos}
        xray={xray || showStoneField}
        showLabels={showLabels}
        onSelect={onSelect}
      />

      <FieldLayer visible={showFieldFrame} selectedPart={selectedPart} uncertainty={uncertainty} explode={explode} />
      <SimulationLayer visible={simulationVisible} active={activeSimulation} gravity={gravityResult} acoustic={acousticResult} strata={strataResult} />
      <CameraRig preset={viewPreset} revision={cameraRevision} speed={animationSpeed}/>
    </Canvas>
  );
}
