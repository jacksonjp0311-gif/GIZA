import {ReadableMap} from './ReadableMap';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ModelBundle } from '../lib/model';
import { AtlasNavigator } from './AtlasNavigator';
import { ActionGraphMap, RoomGraphMap, VisibilityLabMap, MetricReadinessMap, GeologyQuarryMap, HistoricalMap, IntentEvidenceMap, PhotoCoverageMap, PlateauMasterMap, RitualRouteMap, SurveyControlMap } from './MapVisuals';
import type { AtlasLayerKey, AtlasMapId, MapAtlasBundle } from './types';

const DEFAULT_LAYERS:Record<AtlasLayerKey,boolean>={monuments:true,ritual:true,action:true,rooms:true,visibility:true,metric:true,survey:true,sources:true,uncertainty:true,intent:true,geology:true,photos:true};

export function MapAtlasPanel({model,atlas,focusMap,onSelectPart,onActiveMap}:{
  model:ModelBundle; atlas:MapAtlasBundle; focusMap:AtlasMapId|null; onSelectPart:(id:string)=>void; onActiveMap?:(id:AtlasMapId)=>void;
}) {
  const scrollRef=useRef<HTMLDivElement|null>(null);
  const [activeMap,setActiveMap]=useState<AtlasMapId>(focusMap??'plateau');
  const [layers,setLayers]=useState<Record<AtlasLayerKey,boolean>>(DEFAULT_LAYERS);
  const descriptors=useMemo(()=>Object.fromEntries(atlas.manifest.maps.map(m=>[m.id,m])),[atlas]);

  const go=(id:AtlasMapId)=>{
    setActiveMap(id); onActiveMap?.(id);
    const root=scrollRef.current; if(!root)return;
    const target=root.querySelector<HTMLElement>(`[data-atlas-map="${id}"]`);
    if(target) root.scrollTo({top:root.scrollTop+target.getBoundingClientRect().top-root.getBoundingClientRect().top,behavior:'smooth'});
  };
  useEffect(()=>{if(focusMap) requestAnimationFrame(()=>go(focusMap));},[focusMap]);
  const onScroll=()=>{
    const root=scrollRef.current;if(!root)return;
    const top=root.getBoundingClientRect().top+6;
    let best:AtlasMapId=activeMap,bestDelta=Infinity;
    root.querySelectorAll<HTMLElement>('[data-atlas-map]').forEach(el=>{const d=Math.abs(el.getBoundingClientRect().top-top);if(d<bestDelta){bestDelta=d;best=el.dataset.atlasMap as AtlasMapId;}});
    if(best!==activeMap){setActiveMap(best)}
  };
  const toggle=(key:AtlasLayerKey)=>setLayers(v=>({...v,[key]:!v[key]}));

  const sections:{id:AtlasMapId;render:()=>ReactNode;note:string}[]=[
    {id:'plateau',render:()=> <PlateauMasterMap data={atlas.plateau} layers={layers} onSelectPart={onSelectPart}/>,note:'Read the plateau as a connected engineered landscape. Positions here are schematic; use SURVEY CONTROL for metric data.'},
    {id:'ritual',render:()=> <RitualRouteMap data={atlas.ritual} layers={layers} onSelectPart={onSelectPart}/>,note:'A lower-to-upper sequence reconstructed from surviving architecture and royal mortuary context. The architecture is direct evidence; exact ritual meaning remains interpretive.'},
    {id:'action',render:()=> <ActionGraphMap data={atlas.action} layers={layers}/>,note:'A source-addressed place → action → place network. Direct architecture, find provenance, scholarly function and behavioral inference remain separate; this is not a recovered ritual script.'},
    {id:'rooms',render:()=> <RoomGraphMap data={atlas.rooms} layers={layers}/>,note:'Room-level topology resolves temples and pyramid interiors into spaces, branches and thresholds. Positions are schematic and source-linked; they are not traced survey walls.'},
    {id:'visibility',render:()=> <VisibilityLabMap data={atlas.visibility} layers={layers}/>,note:'Premetric visibility/access analysis exposes topological depth, branching, chokepoints and source-linked environment changes. No line here is a measured sightline or illumination simulation.'},
    {id:'metric',render:()=> <MetricReadinessMap data={atlas.metric} layers={layers}/>,note:'Shows exactly what blocks real metric sightlines: legal source bytes, checksums, scale/frame parsing, control/holdout registration and wall/opening geometry. Progress is workflow readiness, not confidence.'},
    {id:'survey',render:()=> <SurveyControlMap data={atlas.survey} layers={layers}/>,note:'Published GPMP-native controls and Khafre orientation prior. Translation and vertical tie remain unresolved, so the pyramid model is deliberately not drawn into this native survey plot.'},
    {id:'geology',render:()=> <GeologyQuarryMap data={atlas.geology} layers={layers}/>,note:'The quarry, causeway foundation and temple terrace constrain construction sequence. This view is relational, not a replacement for the underlying geological archive.'},
    {id:'history',render:()=> <HistoricalMap data={atlas.history} layers={layers}/>,note:'The monument has been repeatedly re-observed. Layering historical exploration, surveys and modern instrumentation lets GIZA track what changed in knowledge rather than blending sources together.'},
    {id:'intent',render:()=> <IntentEvidenceMap data={atlas.intent} layers={layers} synthesis={model.intent.synthesis}/>,note:'Competing purpose/message models remain visible at once. Evidence balance guides testing; it does not declare historical truth.'},
    {id:'photos',render:()=> <PhotoCoverageMap data={atlas.photos} layers={layers}/>,note:'Open photography is now an evidence reservoir. Until a camera is actually solved and QA-passed, coverage cannot become metric geometry.'},
  ];

  const guards:Record<AtlasMapId,string>={plateau:atlas.plateau.guard,ritual:atlas.ritual.guard,action:atlas.action.guard,rooms:atlas.rooms.guard,visibility:atlas.visibility.guard,metric:atlas.metric.guard,survey:atlas.survey.guard,geology:atlas.geology.guard,history:atlas.history.guard,intent:atlas.intent.guard,photos:atlas.photos.guard};

  return <div className="mapAtlasRoot">
    <AtlasNavigator manifest={atlas.manifest} activeMap={activeMap} layers={layers} onMap={go} onToggleLayer={toggle}/>
    <div ref={scrollRef} className="mapAtlasScroller" onScroll={onScroll}>
      <div className="atlasHero">
        <div><small>GIZA NEXUS / CARTOGRAPHIC INTELLIGENCE</small><h2>READ THE COMPLEX AS A SYSTEM</h2><p>{atlas.manifest.purpose}</p></div>
        <div className="atlasHeroStats"><span><b>{atlas.manifest.maps.length}</b> MAPS</span><span><b>{atlas.manifest.source_ids.length}</b> CORE SOURCES</span><span><b>0</b> AUTO PROMOTIONS</span></div>
      </div>
      {sections.map(({id,render,note},index)=>{const d=descriptors[id];return <section key={id} data-atlas-map={id} className="atlasMapSection">
        <header><div><small>{String(index+1).padStart(2,'0')} / {String(sections.length).padStart(2,'0')}</small><h3>{d.label}</h3><p>{d.subtitle}</p></div><div className="mapTruthBadges"><span>{d.truth_class}</span><b>GEOMETRY: {d.geometry_authority}</b></div></header>
        <ReadableMap>{render()}</ReadableMap>
        <div className="atlasMapNote"><b>READING</b><p>{note}</p><span>{guards[id]}</span></div>
      </section>})}
      <div className="atlasEndCap"><span>END OF ATLAS</span><b>RETURN TO ANY MAP FROM THE STICKY INDEX ABOVE</b><p>RITUAL MAP never writes geometry. It makes relationships visible so the next tests can be sharper.</p></div>
    </div>
  </div>;
}
