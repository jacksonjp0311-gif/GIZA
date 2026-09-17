import { GizaScene } from '../components/GizaScene';
import type { ModelBundle, Part } from '../lib/model';
import type { UncertaintyRecord } from '../lib/field';
import type { SectionAxis, StoneCellInfo, UiMode, ViewPreset } from '../scene/types';
import type { ActiveSimulation } from '../simlab/types';
import type { QuickViewItem } from './types';
import { MapAtlasPanel } from '../maps/MapAtlasPanel';
import type { AtlasMapId } from '../maps/types';
import { ComponentWorkbench } from './ComponentWorkbench';
import type { DetailContext } from '../lib/componentDetails';

export function SpatialViewport({
  model, parts, selectedId, selectedStone, explode, setExplode, mode, sectionAxis, sectionPos, viewPreset, cameraRevision,
  showStoneField, showUnverified, xray, showLabels, showPhotos, showFieldFrame, showSimulation, activeSimulation, uncertainty,
  quickViews, onSelectPart, onSelectStone, surface, onSurface, atlasFocus, onAtlasFocus,
  detail, onOpenDetail, onCloseDetail, activeQuickView,
}: {
  detail: {id:string;context:DetailContext;revision:number}|null;
  activeQuickView:string|null;
  onOpenDetail: (id:string,context?:DetailContext)=>void;
  onCloseDetail: ()=>void;
  model: ModelBundle;
  parts: Part[];
  selectedId: string | null;
  selectedStone: StoneCellInfo | null;
  explode: number;
  setExplode: (value: number) => void;
  mode: UiMode;
  sectionAxis: SectionAxis;
  sectionPos: number;
  viewPreset: ViewPreset;
  cameraRevision: number;
  showStoneField: boolean;
  showUnverified: boolean;
  xray: boolean;
  showLabels: boolean;
  showPhotos: boolean;
  showFieldFrame: boolean;
  showSimulation: boolean;
  activeSimulation: ActiveSimulation;
  uncertainty: UncertaintyRecord | null;
  quickViews: QuickViewItem[];
  onSelectPart: (id: string | null) => void;
  onSelectStone: (cell: StoneCellInfo) => void;
  surface: 'MODEL' | 'ATLAS' | 'REGISTRATION';
  onSurface: (surface:'MODEL'|'ATLAS'|'REGISTRATION') => void;
  atlasFocus: AtlasMapId | null;
  onAtlasFocus: (id:AtlasMapId) => void;
}) {
  const verified = model.parts.filter(p => p.provenance.class !== 'UNVERIFIED').length;
  const unverified = model.parts.length - verified;
  const detailPart=detail?model.parts.find(p=>p.id===detail.id):null;

  return (
    <section className="sceneShell edgeSceneShell">
      <div className="sceneWrap edgeScene">

        {surface === 'MODEL' && detailPart && detail ? <ComponentWorkbench key={detail.id+':'+detail.revision} model={model} part={detailPart} initialContext={detail.context} onClose={onCloseDetail} onOpen={onOpenDetail} onSelect={id=>onSelectPart(id)}/> : surface === 'MODEL' ? <>
        <GizaScene
          parts={parts}
          stoneField={model.stoneField}
          showStoneField={showStoneField}
          explode={explode}
          selectedId={selectedId}
          selectedStone={selectedStone}
          viewPreset={viewPreset}
          cameraRevision={cameraRevision}
          showUnverified={showUnverified}
          mode={xray ? 'ENGINEER' : mode}
          sectionAxis={sectionAxis}
          sectionPos={sectionPos}
          xray={xray}
          showLabels={showLabels}
          showFieldFrame={showFieldFrame}
          uncertainty={uncertainty}
          simulationVisible={showSimulation}
          activeSimulation={activeSimulation}
          gravityResult={model.simlab.gravity}
          acousticResult={model.simlab.acoustic}
          strataResult={model.simlab.strata}
          onSelect={onSelectPart}
          onSelectStone={onSelectStone}
        />

        <div className="sceneModePill">{viewPreset} · {explode > 0.5 ? 'EXPLODED' : 'ASSEMBLED'}{showSimulation ? (activeSimulation === 'ACOUSTICS' ? ` · ECHO ${model.simlab.acoustic.selected_visualization.frequency_hz.toFixed(2)} Hz MODE` : activeSimulation === 'STRATA' ? ` · STRATA ${model.simlab.strata.geomechanics.shaft_bottom.vertical_overburden_proxy_mpa.toFixed(1)} MPa @ 648 m` : ` · GRAVITY ${model.simlab.gravity.summary.max_magnitude_microgal.toFixed(1)} µGal PEAK`) : ''}</div>
        <div className="viewportExplodeControl">
          <div><span>EXPLOSION DISTANCE</span><b>{Math.round(explode * 100)}%</b></div>
          <input aria-label="Explosion distance" type="range" min="0" max="2.75" step="0.01" value={explode} onChange={event => setExplode(Number(event.target.value))} />
          <button type="button" onClick={() => setExplode(0)}>ASSEMBLE</button>
        </div>
          <div className="sceneHintLarge">DRAG ROTATE · WHEEL ZOOM · RIGHT-DRAG PAN · CLICK SELECT</div>
        </> : surface === 'REGISTRATION' ? <div className="registrationSurface"><iframe title="GIZA Registration Workbench" src="/workbench/"/><a href="http://127.0.0.1:4174/workbench/" target="_blank" rel="noreferrer">Open local workbench separately · requires npm run workbench</a></div> : <>
          <MapAtlasPanel model={model} atlas={model.maps} focusMap={atlasFocus} onSelectPart={id => { onSelectPart(id); onSurface('MODEL'); }} onActiveMap={onAtlasFocus}/>
          <div className="sceneModePill atlasModePill">MAP ATLAS · {model.maps.manifest.maps.length} EVIDENCE VIEWS</div>
          <div className="sceneHintLarge">SCROLL ATLAS · USE STICKY INDEX · M RETURNS 3D</div>
        </>}
      </div>

      <div className="quickViewsBar">
        <div className="quickTitle">QUICK VIEWS</div>
        <div className="quickScroller">
          {quickViews.map(view => (
            <button key={view.label} title={view.label} aria-pressed={activeQuickView===view.label} className={activeQuickView===view.label ? 'active' : ''} onClick={view.action}>
              <div className="thumb">{view.photo && showPhotos ? <img src={view.photo.image_url} alt="" /> : <span>3D</span>}</div>
              <b>{view.label}</b>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
