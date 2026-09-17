import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadModel, type ModelBundle, type Part } from './lib/model';
import { DEFAULT_WORKSPACE, clearWorkspaceState, loadWorkspaceState, saveWorkspaceState } from './lib/workspace';
import { uncertaintyForTarget } from './lib/field';
import type { StoneCellInfo, UiMode, SectionAxis, ViewPreset } from './scene/types';
import { WorkstationHeader } from './workstation/WorkstationHeader';
import { LeftRail } from './workstation/LeftRail';
import { SpatialViewport } from './workstation/SpatialViewport';
import { ObjectInspectorPanel } from './workstation/ObjectInspectorPanel';
import { WorkstationFooter } from './workstation/WorkstationFooter';
import type { InspectorTab, LayerKey, QuickViewItem } from './workstation/types';
import type { ActiveSimulation } from './simlab/types';
import type { AtlasMapId } from './maps/types';
import type { DetailContext } from './lib/componentDetails';

function isInternal(part: Part) {
  return part.id.startsWith('part.upper.') || part.id.startsWith('part.lower.') || part.id.startsWith('part.burial.') || part.id.startsWith('part.sarcophagus.');
}

export default function App() {
  const [model, setModel] = useState<ModelBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initial] = useState(loadWorkspaceState);
  const [selectedId, setSelectedId] = useState<string | null>(initial.selectedId);
  const [selectedStone, setSelectedStone] = useState<StoneCellInfo | null>(null);
  const [explode, setExplode] = useState(initial.explode);
  const [mode, setMode] = useState<UiMode>(initial.mode);
  const [sectionAxis, setSectionAxis] = useState<SectionAxis>(initial.sectionAxis);
  const [sectionPos, setSectionPos] = useState(initial.sectionPos);
  const [viewPreset, setViewPreset] = useState<ViewPreset>(initial.viewPreset);
  const [cameraRevision, setCameraRevision] = useState(0);
  const [filter, setFilter] = useState('');
  const [tab, setTab] = useState<InspectorTab>('OVERVIEW');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(initial.animationSpeed);
  const [showLabels, setShowLabels] = useState(initial.showLabels);
  const [showDimensions, setShowDimensions] = useState(initial.showDimensions);
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>(initial.layers);
  const [activeSimulation, setActiveSimulation] = useState<ActiveSimulation>('ACOUSTICS');
  const [surface, setSurface] = useState<'MODEL'|'ATLAS'|'REGISTRATION'>('MODEL');
  const [atlasFocus, setAtlasFocus] = useState<AtlasMapId|null>('plateau');
  const [detail, setDetail] = useState<{id:string;context:DetailContext;revision:number}|null>(null);
  const [activeQuickView,setActiveQuickView]=useState<string|null>('Full Pyramid');
  const openDetail = useCallback((id:string, context:DetailContext='ROOM') => {
    setActiveQuickView(null);
    setDetail(v=>({id,context,revision:(v?.revision??0)+1}));
    setSelectedId(id);setSelectedStone(null);setTab('OVERVIEW');setSurface('MODEL');
  }, []);

  const activateView = useCallback((preset: ViewPreset) => {
    setViewPreset(preset);
    setCameraRevision(value => value + 1);
  }, []);

  useEffect(() => {
    loadModel().then(setModel).catch(e => setError(String(e)));
  }, []);

  useEffect(() => {
    saveWorkspaceState({
      version: 1, selectedId, explode, mode, sectionAxis, sectionPos, viewPreset, animationSpeed,
      showLabels, showDimensions, layers,
    });
  }, [selectedId, explode, mode, sectionAxis, sectionPos, viewPreset, animationSpeed, showLabels, showDimensions, layers]);

  const resetWorkspace = () => {
    setSurface('MODEL');setFilter('');
    setActiveQuickView('Full Pyramid');
    setDetail(null);
    clearWorkspaceState();
    setSelectedId(DEFAULT_WORKSPACE.selectedId);
    setSelectedStone(null);
    setExplode(DEFAULT_WORKSPACE.explode);
    setMode(DEFAULT_WORKSPACE.mode);
    setSectionAxis(DEFAULT_WORKSPACE.sectionAxis);
    setSectionPos(DEFAULT_WORKSPACE.sectionPos);
    activateView(DEFAULT_WORKSPACE.viewPreset);
    setAnimationSpeed(DEFAULT_WORKSPACE.animationSpeed);
    setShowLabels(DEFAULT_WORKSPACE.showLabels);
    setShowDimensions(DEFAULT_WORKSPACE.showDimensions);
    setLayers(DEFAULT_WORKSPACE.layers);
    setTab('OVERVIEW');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();document.getElementById('component-search')?.focus();return;}
      if(event.ctrlKey||event.metaKey||event.altKey)return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const key = event.key.toLowerCase();
      if (key === '1') setMode('DISCOVER');
      if (key === '2') setMode('EXPLORE');
      if (key === '3') setMode('ENGINEER');
      if (key === 'e') setExplode(v => v > 0.5 ? 0.18 : 1.75);
      if (key === 'b') setLayers(v => ({ ...v, blocks: !v.blocks }));
      if (key === 'x') setLayers(v => ({ ...v, xray: !v.xray }));
      if (key === 'u') setLayers(v => ({ ...v, subsurface: !v.subsurface }));
      if (key === 'l') setShowLabels(v => !v);
      if (key === 'p') activateView('PERSPECTIVE');
      if (key === 'n') activateView('NORTH');
      if (key === 't') activateView('TOP');
      if (key === 'i') activateView('INTERIOR');
      if (key === 'g') activateView('UNDERGROUND');
      if (key === 'f') { setLayers(v => ({ ...v, field: !v.field })); setMode('ENGINEER'); setTab('FIELD'); }
      if (key === 's') { setLayers(v => ({ ...v, simulation: !v.simulation })); setMode('ENGINEER'); setTab('SIMULATION'); }
      if (key === 'a') { setActiveSimulation('ACOUSTICS'); setLayers(v => ({ ...v, simulation: true })); setMode('ENGINEER'); setTab('SIMULATION'); }
      if (key === 'v') { setActiveSimulation('GRAVITY'); setLayers(v => ({ ...v, simulation: true })); setMode('ENGINEER'); setTab('SIMULATION'); }
      if (key === 'j') { setActiveSimulation('STRATA'); setLayers(v => ({ ...v, simulation: true, subsurface: true })); setMode('ENGINEER'); setTab('SIMULATION'); }
      if (key === 'k') { setMode('ENGINEER'); setTab('FINDINGS'); }
      if (key === 'h') setSurface('REGISTRATION');
      if (key === 'm') setSurface(v => v === 'MODEL' ? 'ATLAS' : 'MODEL');
      if (key === 'r') resetWorkspace();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const selected = useMemo(() => model?.parts.find(p => p.id === selectedId) ?? null, [model, selectedId]);
  const selectedUncertainty = useMemo(
    () => model ? uncertaintyForTarget(model.field.uncertaintyCatalog, selectedId) : null,
    [model, selectedId],
  );

  useEffect(() => setPhotoIndex(0), [selectedId]);

  const displayedParts = useMemo(() => {
    if (!model) return [];
    return model.parts.filter(p => {
      if (p.provenance.class === 'UNVERIFIED') return layers.subsurface;
      if (p.id === 'part.plateau.reference') return layers.terrain;
      if (p.id === 'part.pyramid.khafre') return layers.exterior;
      if (p.id === 'part.casing.granite.lower') return layers.casing;
      if (isInternal(p)) return layers.internal;
      return true;
    });
  }, [model, layers]);

  const toggleLayer = (key: LayerKey) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  const selectPart = (id: string | null, inspector: InspectorTab = 'OVERVIEW') => {
    setSelectedStone(null);
    setSelectedId(id);
    if (id) setTab(inspector);
  };

  const selectStone = (cell: StoneCellInfo) => {
    setSelectedStone(cell);
    setSelectedId(null);
    setTab('OVERVIEW');
  };

  const quickViews = useMemo<QuickViewItem[]>(() => {
    if (!model) return [];
    const defs = [
      { label: 'Full Pyramid', id: 'part.pyramid.khafre', action: () => { setExplode(0); setSectionAxis('OFF'); activateView('PERSPECTIVE'); selectPart('part.pyramid.khafre'); } },
      { label: 'Exploded', id: 'part.pyramid.khafre', action: () => { setExplode(1.75); activateView('PERSPECTIVE'); selectPart('part.pyramid.khafre'); } },
      { label: 'Interior', id: 'part.burial.chamber', action: () => openDetail('part.burial.chamber') },
      { label: 'Underground', id: 'part.shaft.alpha.1', action: () => { setLayers(l => ({ ...l, subsurface: true })); setExplode(0.56); activateView('UNDERGROUND'); selectPart('part.shaft.alpha.1'); } },
      { label: 'Cross Section', id: 'part.burial.chamber', action: () => { setSectionAxis('Y'); setSectionPos(0); activateView('SECTION'); selectPart('part.burial.chamber'); } },
      { label: 'Burial Chamber', id: 'part.burial.chamber', action: () => openDetail('part.burial.chamber') },
      { label: 'Sarcophagus', id: 'part.sarcophagus.body', action: () => openDetail('part.sarcophagus.body') },
      { label: 'Lower Chamber', id: 'part.lower.chamber', action: () => openDetail('part.lower.chamber') },
      { label: 'Sarcophagus Lid', id: 'part.sarcophagus.lid', action: () => openDetail('part.sarcophagus.lid','OBJECT') },
      { label: 'Roof & Chamber', id: 'part.burial.gable_envelope', action: () => openDetail('part.burial.gable_envelope') },
      { label: 'Upper Passage', id: 'part.upper.entrance.existing', action: () => openDetail('part.upper.entrance.existing','OBJECT') },
      { label: 'Portcullis', id: 'part.upper.portcullis.slab', action: () => openDetail('part.upper.portcullis.slab','OBJECT') },
      { label: 'Plateau View', id: 'part.plateau.reference', action: () => { setLayers(l => ({ ...l, terrain: true })); activateView('TOP'); selectPart('part.plateau.reference'); } },
    ];
    return defs.map(def => ({
      ...def,
      part: model.parts.find(p => p.id === def.id),
      photo: model.photos.find(p => p.bind.includes(def.id)) ?? null,
    }));
  }, [model, activateView, openDetail]);

  if (error) return <div className="fatal" role="alert"><h1>GIZA couldn’t load</h1><p>{error}</p><button onClick={()=>{setError(null);loadModel().then(setModel).catch(e=>setError(String(e)));}}>Retry loading</button><button onClick={()=>{clearWorkspaceState();window.location.reload();}}>Reset saved workspace</button></div>;
  if (!model) return <div className="boot"><b>GIZA NEXUS</b><span>Initializing evidence-governed workstation…</span></div>;

  return (
    <div className="app nexusEdge">
      <WorkstationHeader
        modelTitle={activeQuickView ? `KHAFRE / ${activeQuickView.toUpperCase()}` : model.parts.find(p=>p.id===detail?.id)?.name ?? 'KHAFRE / PYRAMID CORE'}
        model={model}
        surface={surface}
        onSurface={setSurface}
      />

      <main className="workspace edgeWorkspace">
        <LeftRail
          parts={model.parts}
          onOpenPart={id=>openDetail(id,id.startsWith('part.sarcophagus.')||id.startsWith('part.burial.')?'ROOM':'OBJECT')}
          filter={filter}
          setFilter={setFilter}
          layers={layers}
          toggleLayer={toggleLayer}
          sectionAxis={sectionAxis}
          setSectionAxis={setSectionAxis}
          viewPreset={viewPreset}
          setViewPreset={activateView}
          onReset={resetWorkspace}
          onOpenAtlas={id => { setAtlasFocus(id); setSurface('ATLAS'); }}
          onOpenModel={() => {setSurface('MODEL');setDetail(null);setActiveQuickView('Full Pyramid');}}
        />

        <SpatialViewport
          animationSpeed={animationSpeed}
          showDimensions={showDimensions}
          setShowDimensions={setShowDimensions}
          detail={detail}
          onOpenDetail={openDetail}
          onCloseDetail={()=>{setDetail(null);setActiveQuickView('Full Pyramid');}}
          model={model}
          parts={displayedParts}
          selectedId={selectedId}
          selectedStone={selectedStone}
          explode={explode}
          setExplode={setExplode}
          mode={mode}
          sectionAxis={sectionAxis}
          sectionPos={sectionPos}
          viewPreset={viewPreset}
          cameraRevision={cameraRevision}
          showStoneField={layers.blocks}
          showUnverified={layers.subsurface}
          xray={layers.xray}
          showLabels={showLabels}
          showPhotos={layers.photos}
          showFieldFrame={layers.field}
          showSimulation={layers.simulation}
          activeSimulation={activeSimulation}
          uncertainty={layers.measurements && mode === 'ENGINEER' ? selectedUncertainty : null}
          activeQuickView={activeQuickView}
          quickViews={quickViews.map(v => ({ ...v, action: () => { setSurface('MODEL');setDetail(null); v.action();setActiveQuickView(v.label); } }))}
          onSelectPart={id => selectPart(id)}
          onSelectStone={selectStone}
          surface={surface}
          onSurface={setSurface}
          atlasFocus={atlasFocus}
          onAtlasFocus={setAtlasFocus}
        />

        <ObjectInspectorPanel
          onOpenDetail={openDetail}
          model={model}
          selected={selected}
          selectedStone={selectedStone}
          tab={tab}
          setTab={setTab}
          photoIndex={photoIndex}
          setPhotoIndex={setPhotoIndex}
          animationSpeed={animationSpeed}
          setAnimationSpeed={setAnimationSpeed}
          showLabels={showLabels}
          setShowLabels={setShowLabels}
          showDimensions={showDimensions}
          setShowDimensions={setShowDimensions}
          layers={layers}
          activeSimulation={activeSimulation}
          setActiveSimulation={setActiveSimulation}
          toggleLayer={toggleLayer}
          onSelectPart={id => selectPart(id)}
        />
      </main>

      <WorkstationFooter keyStructures={model.parts.length} />
    </div>
  );
}
