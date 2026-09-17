import type { ViewPreset, SectionAxis } from '../scene/types';
import type { LayerKey } from './types';
import { VIEW_BUTTONS } from './types';
import type { AtlasMapId } from '../maps/types';

export function LeftRail({
  filter, setFilter, layers, toggleLayer, sectionAxis, setSectionAxis, viewPreset, setViewPreset, onReset, onOpenAtlas, onOpenModel,
}: {
  filter: string; setFilter: (value: string) => void;
  layers: Record<LayerKey, boolean>; toggleLayer: (key: LayerKey) => void;
  sectionAxis: SectionAxis; setSectionAxis: (axis: SectionAxis) => void;
  viewPreset: ViewPreset; setViewPreset: (preset: ViewPreset) => void; onReset: () => void;
  onOpenAtlas: (id:AtlasMapId) => void; onOpenModel: () => void;
}) {
  const layerRows: [LayerKey, string][] = [
    ['exterior', 'Exterior (Current)'], ['casing', 'Casing Stones'], ['internal', 'Internal Architecture'],
    ['subsurface', 'Subterranean (Unverified)'], ['terrain', 'Surrounding Terrain'], ['photos', 'Photo Textures'],
    ['measurements', 'Measurement Overlays'], ['blocks', 'Block / Slab Detail'], ['xray', 'X-Ray Mode'], ['field', 'FIELD Registration'],
  ];

  return (
    <aside className="leftRail edgeLeft">
      <section className="railCard projectCard">
        <div className="railHeader"><b>PROJECT EXPLORER</b><span>▱</span></div>
        <div className="projectSearch">⌕ <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Find chamber, slab, passage…" /></div>
        <div className="projectTree">
          <div className="rootNode">⌄ <b>Giza Plateau</b></div>
          <button onClick={() => onOpenAtlas('plateau')}>› <span>Khufu (Context)</span></button>
          <button className="active" onClick={onOpenModel}>⌄ <span>Khafre (Active)</span><i>◉</i></button>
          <button onClick={() => onOpenAtlas('plateau')}>› <span>Menkaure</span></button>
          <button onClick={() => onOpenAtlas('geology')}>› <span>Sphinx</span></button>
          <button onClick={() => onOpenAtlas('rooms')}>› <span>Valley Temple</span></button>
          <button onClick={() => onOpenAtlas('rooms')}>› <span>Causeway</span></button>
          <button onClick={() => onOpenAtlas('plateau')}>› <span>Mastabas & Tombs</span></button>
          <button onClick={() => onOpenAtlas('rooms')}>› <span>Room / Threshold Graph</span><i>MAP</i></button>
          <button onClick={() => onOpenAtlas('survey')}>› <span>Survey Data</span><i>MAP</i></button>
          <button onClick={() => onOpenAtlas('history')}>› <span>Historical Maps</span><i>MAP</i></button>
          <button onClick={() => onOpenAtlas('plateau')}>› <span>Plateau / Terrain</span><i>MAP</i></button>
          <button onClick={() => onOpenAtlas('photos')}>› <span>Open Source Photos</span><i>MAP</i></button>
          <button onClick={() => onOpenAtlas('intent')}>› <span>Intent Reconstruction</span><i>MAP</i></button>
        </div>
      </section>

      <section className="railCard layerCard">
        <div className="railHeader"><b>MODEL LAYERS</b><span>▱</span></div>
        {layerRows.map(([key, label]) => (
          <label className="layerRow" key={key}>
            <span className="layerName">◈ {label}</span>
            <input type="checkbox" checked={layers[key]} onChange={() => toggleLayer(key)} />
            <i className="toggleVisual" />
          </label>
        ))}
        <label className="layerRow">
          <span className="layerName">◈ Section Cut Plane</span>
          <input type="checkbox" checked={sectionAxis !== 'OFF'} onChange={() => setSectionAxis(sectionAxis === 'OFF' ? 'Y' : 'OFF')} />
          <i className="toggleVisual" />
        </label>
      </section>

      <section className="railCard viewCard">
        <div className="railHeader"><b>VIEW CONTROLS</b><span>▱</span></div>
        <div className="viewGrid">
          {VIEW_BUTTONS.map(item => (
            <button key={item.preset} className={viewPreset === item.preset ? 'active' : ''} onClick={() => setViewPreset(item.preset)}>{item.label}</button>
          ))}
          <button onClick={onReset}>Reset</button>
        </div>
      </section>
    </aside>
  );
}
