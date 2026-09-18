import { GizaScene } from '../components/GizaScene';
import { useEffect, useMemo, useState, useRef } from 'react';
import type { ModelBundle, Part } from '../lib/model';
import type { UncertaintyRecord } from '../lib/field';
import type { SectionAxis, StoneCellInfo, UiMode, ViewPreset } from '../scene/types';
import type { ActiveSimulation } from '../simlab/types';
import type { QuickViewItem } from './types';
import { ComponentWorkbench, MapAtlasPanel } from './OptionalWorkspaces';
import { WorkspaceBoundary } from './WorkspaceBoundary';
import { unavailable } from '../lib/runtimeData';
import type { AtlasMapId } from '../maps/types';
import type { DetailContext } from '../lib/componentDetails';
import { DimensionReadout } from './DimensionReadout';
import { INTERIOR_SCOPES, interiorParts, type InteriorScope } from '../lib/interiorInspection';
import { InscriptionLauncher } from '../epigraphy/InscriptionLauncher';
import { DEFAULT_REALITY_LAYERS, legacyObjectAuthority, objectVisibleInRealityLayer, type RealityLayers } from '../evidence/authority';
import { RealityControls } from './RealityControls';

export function SpatialViewport({
  model, parts, selectedId, selectedStone, explode, setExplode, mode, sectionAxis, sectionPos, viewPreset, cameraRevision,
  showStoneField, showUnverified, xray, showLabels, showPhotos, showFieldFrame, showSimulation, activeSimulation, uncertainty,
  quickViews, onSelectPart, onSelectStone, surface, onSurface, atlasFocus, onAtlasFocus,
  detail, onOpenDetail, onCloseDetail, activeQuickView,animationSpeed,showDimensions,setShowDimensions,onArtifact,
}: {
  onArtifact:()=>void;
  detail: {id:string;context:DetailContext;revision:number}|null;
  activeQuickView:string|null;
  animationSpeed:number;showDimensions:boolean;setShowDimensions:(value:boolean)=>void;
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
  const [expanded,setExpanded]=useState(false);
  const [sphere,setSphere]=useState(false);
  const [reality,setReality]=useState<RealityLayers>({...DEFAULT_REALITY_LAYERS,HYPOTHESIS:showUnverified});
  const [inspection,setInspection]=useState(false),[scope,setScope]=useState<InteriorScope>('ALL'),[fitRevision,setFitRevision]=useState(0);
  const visibleParts=useMemo(()=>(inspection?interiorParts(parts,scope):parts).filter(part=>objectVisibleInRealityLayer(legacyObjectAuthority(part),reality)),[parts,inspection,scope,reality]);
  const previousLayers=useRef({showUnverified,showStoneField,showSimulation,showFieldFrame});
  useEffect(()=>{const previous=previousLayers.current;
    if(showUnverified&&!previous.showUnverified||showStoneField&&!previous.showStoneField||showSimulation&&!previous.showSimulation)setReality(r=>({...r,HYPOTHESIS:true}));
    if(showFieldFrame&&!previous.showFieldFrame)setReality(r=>({...r,RECONSTRUCTED:true}));
    previousLayers.current={showUnverified,showStoneField,showSimulation,showFieldFrame};
  },[showUnverified,showStoneField,showSimulation,showFieldFrame]);
  const inspect=(value:boolean)=>{setInspection(value);setExplode(0);onSelectPart(null);setFitRevision(v=>v+1);};
  useEffect(()=>{const exit=(e:KeyboardEvent)=>{if(e.key==='Escape')setExpanded(false);};window.addEventListener('keydown',exit);return()=>window.removeEventListener('keydown',exit);},[]);
  const detailPart=detail?model.parts.find(p=>p.id===detail.id):null;
  const simulationAvailable=!unavailable(model.runtimeDiagnostics,'SIMULATION');

  return (
    <section className={`sceneShell edgeSceneShell${surface==='ATLAS'?' atlasShell':''}${expanded?' viewerExpanded':''}`}>
      <div className="sceneWrap edgeScene">

        {surface === 'MODEL' && detailPart && detail ? <ComponentWorkbench key={detail.id+':'+detail.revision} model={model} part={detailPart} initialContext={detail.context} dimensions={showDimensions} setDimensions={setShowDimensions} onClose={()=>{setInspection(false);onCloseDetail();}} onOpen={onOpenDetail} onSelect={id=>onSelectPart(id)}/> : surface === 'MODEL' ? <>
        <WorkspaceBoundary name="3-D model"><GizaScene
          sphere={sphere&&!inspection}
          animationSpeed={animationSpeed}
          parts={visibleParts}
          inspection={inspection}
          stoneField={model.stoneField}
          showStoneField={showStoneField&&!inspection&&reality.HYPOTHESIS}
          explode={explode}
          selectedId={selectedId}
          selectedStone={reality.HYPOTHESIS?selectedStone:null}
          viewPreset={viewPreset}
          cameraRevision={cameraRevision+fitRevision}
          showUnverified={showUnverified&&!inspection&&reality.HYPOTHESIS}
          mode={xray ? 'ENGINEER' : mode}
          sectionAxis={inspection?'OFF':sectionAxis}
          sectionPos={sectionPos}
          xray={xray&&!inspection}
          showLabels={showLabels}
          showFieldFrame={showFieldFrame&&!inspection&&reality.RECONSTRUCTED}
          uncertainty={uncertainty}
          simulationVisible={showSimulation&&!inspection&&simulationAvailable&&reality.HYPOTHESIS}
          activeSimulation={activeSimulation}
          gravityResult={model.simlab.gravity}
          acousticResult={model.simlab.acoustic}
          strataResult={model.simlab.strata}
          onSelect={onSelectPart}
          onSelectStone={onSelectStone}
        /></WorkspaceBoundary>

        <div className="interiorControls"><button aria-pressed={inspection} onClick={()=>inspect(!inspection)}>{inspection?'Restore shell':'Remove shell / inspect inside'}</button>{showUnverified&&!reality.HYPOTHESIS&&<div role="status" className="evidenceWarning">Subterranean layer is enabled but hidden by HYPOTHESIS. <button onClick={()=>setReality(r=>({...r,HYPOTHESIS:true}))}>Show hypothetical underground</button></div>}<RealityControls layers={reality} onChange={value=>{setReality(value);onSelectPart(null);}} showUnverified={showUnverified}/>{inspection&&<><select aria-label="Internal system" value={scope} onChange={e=>{setScope(e.target.value as InteriorScope);setExplode(0);onSelectPart(null);}}>{INTERIOR_SCOPES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select><button onClick={()=>setFitRevision(v=>v+1)}>Fit interior</button><button disabled={!visibleParts.some(p=>p.id===selectedId)} onClick={()=>selectedId&&onOpenDetail(selectedId,'OBJECT')}>Isolate selected object</button><small>{visibleParts.length} source-linked reconstructions · envelopes, not a scan. Speculative structures excluded.</small></>}</div>

        <div className="sceneModePill">{inspection?'INTERNAL SYSTEM':viewPreset} · {explode > 0.5 ? 'EXPLODED' : 'ASSEMBLED'}{showSimulation&&!inspection ? (!simulationAvailable?' · SIMULATION UNAVAILABLE':!reality.HYPOTHESIS?' · SIMULATION HIDDEN BY HYPOTHESIS LAYER':activeSimulation === 'ACOUSTICS' ? ` · HYPOTHESIS · ECHO ${model.simlab.acoustic.selected_visualization.frequency_hz.toFixed(2)} Hz MODE` : activeSimulation === 'STRATA' ? ` · HYPOTHESIS · STRATA ${model.simlab.strata.geomechanics.shaft_bottom.vertical_overburden_proxy_mpa.toFixed(1)} MPa @ 648 m` : ` · HYPOTHESIS · GRAVITY ${model.simlab.gravity.summary.max_magnitude_microgal.toFixed(1)} µGal PEAK`) : ''}</div>
        {showDimensions&&<DimensionReadout part={visibleParts.find(p=>p.id===selectedId)}/>}
        <div className="viewportExplodeControl">
          {!inspection&&<label>Stone arrangement <select aria-label="Stone arrangement" value={sphere?'SPHERE':'COURSES'} onChange={e=>{setSphere(e.target.value==='SPHERE');setReality(r=>({...r,HYPOTHESIS:true}));}}><option value="COURSES">Course separation</option><option value="SPHERE">Spherical expansion</option></select></label>}
          {sphere&&!inspection&&<small>HYPOTHESIS · illustrative cells, not surveyed blocks. Enable Exterior and Block / Slab Detail.</small>}
          <div><span>EXPLOSION DISTANCE</span><b>{Math.round(explode * 100)}%</b></div>
          <input aria-label="Explosion distance" type="range" min="0" max="2.75" step="0.01" value={explode} onChange={event => setExplode(Number(event.target.value))} />
          <button type="button" onClick={() => {setExplode(0);setSphere(false);}}>ASSEMBLE</button>
        </div>
          <div className="sceneHintLarge">DRAG ROTATE · WHEEL ZOOM · RIGHT-DRAG PAN · CLICK SELECT</div>
        </> : surface === 'REGISTRATION' ? <div className="registrationSurface"><iframe title="GIZA Registration Workbench" src="/workbench/"/><a href="/workbench/" target="_blank" rel="noreferrer">Open local workbench in a separate tab</a></div> : <>
          <MapAtlasPanel model={model} atlas={model.maps} focusMap={atlasFocus} onSelectPart={id => { onSelectPart(id); onSurface('MODEL'); }} onActiveMap={onAtlasFocus}/>


        </>}
      </div>

      <div className="quickViewsBar">
        <div className="quickTitle">QUICK VIEWS<InscriptionLauncher onModel={onArtifact}/><button className="expandViewer" aria-pressed={expanded} onClick={()=>setExpanded(v=>!v)}>{expanded?'Restore panels · Esc':'Expand viewer'}</button></div>
        <div className="quickScroller">
          {quickViews.map(view => (
            <button key={view.label} title={view.label} aria-pressed={activeQuickView===view.label} className={activeQuickView===view.label ? 'active' : ''} onClick={()=>{setInspection(false);if(['Full Pyramid','Exploded','Cross Section','Plateau View'].includes(view.label))setReality(r=>({...r,RECONSTRUCTED:true}));if(view.label==='Underground')setReality(r=>({...r,HYPOTHESIS:true}));view.action();}}>
              <div className="thumb" aria-hidden="true">{view.photo && showPhotos ? <img src={view.photo.image_url} alt="" /> : <span>3D</span>}</div>
              <b>{view.label}</b>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
