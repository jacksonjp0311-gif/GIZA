import type { AtlasLayerKey, AtlasMapId, MapAtlasManifest } from './types';

const LAYERS: {id:AtlasLayerKey; label:string; short:string}[] = [
  {id:'monuments',label:'Monuments',short:'MON'}, {id:'ritual',label:'Ritual sequence',short:'RIT'},
  {id:'action',label:'Action graph',short:'ACT'}, {id:'rooms',label:'Room graph',short:'ROM'}, {id:'visibility',label:'Visibility lab',short:'VIS'}, {id:'metric',label:'Metric readiness',short:'MET'}, {id:'survey',label:'Survey control',short:'SUR'}, {id:'sources',label:'Source evidence',short:'SRC'},
  {id:'uncertainty',label:'Uncertainty',short:'UNC'}, {id:'intent',label:'Intent models',short:'INT'},
  {id:'geology',label:'Geology',short:'GEO'}, {id:'photos',label:'Photo coverage',short:'PHO'},
];

export function AtlasNavigator({manifest,activeMap,layers,onMap,onToggleLayer}:{
  manifest:MapAtlasManifest; activeMap:AtlasMapId; layers:Record<AtlasLayerKey,boolean>;
  onMap:(id:AtlasMapId)=>void; onToggleLayer:(id:AtlasLayerKey)=>void;
}) {
  return <div className="atlasNavigator">
    <div className="atlasNavHead">
      <div><span>RITUAL MAP ATLAS</span><b>{manifest.maps.length} EVIDENCE VIEWS</b></div>
      <small>SCROLLABLE · SOURCE-GOVERNED · NO GEOMETRY WRITE</small>
    </div>
    <div className="atlasMapTabs">
      {manifest.maps.map(m=><button key={m.id} className={activeMap===m.id?'active':''} onClick={()=>onMap(m.id)}>
        <b>{m.label}</b><span>{m.subtitle}</span>
      </button>)}
    </div>
    <div className="atlasLayerStrip">
      {LAYERS.map(l=><button key={l.id} title={l.label} className={layers[l.id]?'active':''} onClick={()=>onToggleLayer(l.id)}><i/>{l.short}</button>)}
    </div>
  </div>;
}
