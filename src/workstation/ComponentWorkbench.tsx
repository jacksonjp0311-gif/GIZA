import { useState } from 'react';
import type { ModelBundle, Part } from '../lib/model';
import { burialDimensions, detailCoverage, isBurialDetail, type DetailContext } from '../lib/componentDetails';
import { ComponentScene } from '../scene/ComponentScene';
import { ReferenceGallery } from './ReferenceGallery';

export function ComponentWorkbench({model,part,initialContext,onClose,onOpen,onSelect,dimensions,setDimensions}:{
  dimensions:boolean;setDimensions:(value:boolean)=>void;
  model:ModelBundle;part:Part;initialContext:DetailContext;onClose:()=>void;
  onOpen:(id:string,context?:DetailContext)=>void;onSelect:(id:string)=>void;
}) {
  const [context,setContext]=useState<DetailContext>(initialContext);
  const [lidLift,setLidLift]=useState(.8);
  const [explosion,setExplosion]=useState(0);
  const [survey,setSurvey]=useState(false);
  const [roof,setRoof]=useState(part.id==='part.burial.gable_envelope');
  const [revision,setRevision]=useState(0);
  const [top,setTop]=useState(false);
  const [wide,setWide]=useState(false);
  const [evidence,setEvidence]=useState(false);
  const [search,setSearch]=useState('');
  const [catalog,setCatalog]=useState(false);
  const coverage=detailCoverage(model,part);
  const burial=isBurialDetail(part.id);
  const cavity=part.id==='part.sarcophagus.body'?burialDimensions(model):null;
  const chamber=part.id==='part.lower.chamber';
  const showLid=burial&&(context==='ROOM'||part.id==='part.sarcophagus.body');
  const hasDimensions=chamber||(burial&&(context==='ROOM'||part.id==='part.burial.chamber'||part.id.startsWith('part.sarcophagus.')));
  const refs=model.componentResearch.sources;
  const observations=model.componentResearch.observations.filter(o=>o.bind?o.bind.includes(part.id):burial);
  return <div className="componentWorkbench">
    <div className="componentToolbar">
      <button onClick={onClose}>← Full pyramid</button>
      <div><small>COMPONENT EXPLORER</small><h2>{part.name}</h2></div>
      <button onClick={()=>{setCatalog(!catalog);setEvidence(false);}} aria-expanded={catalog}>All {model.parts.length} components</button>
      <button onClick={()=>{setEvidence(!evidence);setCatalog(false);}} aria-expanded={evidence}>Photos &amp; measurements ({coverage.photos.length} / {coverage.measurements.length})</button>
    </div>
    <div className={`componentStage${evidence||catalog?' drawerOpen':''}`}>
      <div className="componentVisual">
      <div className="componentRender">
      <ComponentScene explosion={explosion} model={model} part={part} context={context} lidLift={lidLift} dimensions={dimensions} roof={roof} survey={survey} revision={revision} top={top} wide={wide} onSelect={onSelect}/>
      </div>
      <div className="componentViewControls">
        {!chamber&&part.id!=='part.burial.chamber'&&<><button className={context==='OBJECT'?'active':''} onClick={()=>{setContext('OBJECT');setWide(false);setRevision(v=>v+1);}}>Object only</button>
        <button className={context==='ROOM'?'active':''} onClick={()=>{setContext('ROOM');setRevision(v=>v+1);}}>{burial?'In room':'Assembly context'}</button></>}
        {part.id.startsWith('part.sarcophagus.')&&context==='ROOM'&&<button onClick={()=>{setWide(!wide);setRevision(v=>v+1);}}>{wide?'Focus sarcophagus':'Fit room'}</button>}
        <button onClick={()=>{setTop(false);setRevision(v=>v+1);}}>Recenter</button>
        <button className={top?'active':''} onClick={()=>{setTop(!top);setRevision(v=>v+1);}}>Top view</button>
        {part.id==='part.sarcophagus.body'&&<button onClick={()=>{setLidLift(0);setContext('OBJECT');setTop(true);setWide(false);setDimensions(false);setRevision(v=>v+1);}}>Inspect cavity</button>}
        {part.id==='part.sarcophagus.body'&&<button onClick={()=>onOpen('part.sarcophagus.lid','OBJECT')}>Inspect lid</button>}
      </div>
      <div className="componentControls">
        <details className="assemblyExplode"><summary>Explode / restore</summary><label>Inspection separation<input aria-label="Component explosion distance" type="range" min="0" max="3" step=".01" value={explosion} onChange={e=>setExplosion(Number(e.target.value))}/></label><button onClick={()=>setExplosion(0)}>Restore assembly</button><small>Display-only separation of modeled components and room panels, not stone fractures or physical clearances. A single-piece object stays intact.</small></details>
        {showLid&&<label>Inspection lid lift <input aria-label="Sarcophagus lid lift" type="range" min="0" max="1.5" step=".01" value={lidLift} onChange={e=>setLidLift(Number(e.target.value))}/><span>{lidLift===0?'Hidden':(lidLift*1.3).toFixed(2)+' m'}</span></label>}
        {hasDimensions&&<label><input type="checkbox" checked={dimensions} onChange={e=>setDimensions(e.target.checked)}/>Dimensions</label>}
        {part.id==='part.sarcophagus.body'&&<label><input type="checkbox" checked={survey} onChange={e=>setSurvey(e.target.checked)}/>Survey pin markers</label>}
        {burial&&(context==='ROOM'||part.id==='part.burial.chamber')&&<label><input type="checkbox" checked={roof} onChange={e=>setRoof(e.target.checked)}/>Roof envelope</label>}
        {cavity&&context==='OBJECT'&&<small className="cavityReadout">Measured cavity · {cavity.innerLength.toFixed(3)} × {cavity.innerWidth.toFixed(3)} × {cavity.innerDepth.toFixed(3)} m (L × W × depth)</small>}
        <span>Drag rotate · wheel zoom · right-drag pan</span>
      </div>
      </div>
      {catalog&&<div className="componentCatalog"><input aria-label="Search component models" placeholder="Search rooms, passages, objects…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <div>{model.parts.filter(p=>(p.name+' '+p.id).toLowerCase().includes(search.toLowerCase())).map(p=><button key={p.id} onClick={()=>onOpen(p.id,isBurialDetail(p.id)?'ROOM':'OBJECT')}>
          <b>{p.name}</b><small>{detailCoverage(model,p).quality}</small>
        </button>)}</div></div>}
      {evidence&&<div className="componentEvidence">
        <button className="detailClose" onClick={()=>setEvidence(false)}>Close evidence ×</button>
        <h3>Reference photographs &amp; drawings</h3>
        <ReferenceGallery photos={coverage.photos}/>
        <h3>{part.id.startsWith('part.sarcophagus.')?'Selected object survey records':'Associated survey records'}</h3>
        <p>{part.id.startsWith('part.sarcophagus.')?'Body and lid records are separated. Measurements constrain this idealized reconstruction, not every point on its surface.':'These records can include assembly context. A listed dimension is not automatically a direct measurement of this selected surface.'}</p>
        {coverage.measurements.length?coverage.measurements.map(m=><div className="detailMeasure" key={m.id}><span>{m.quantity.replaceAll('_',' ')}</span><b>{typeof m.si_value==='number'?m.si_value.toFixed(4):m.si_value} {m.si_unit}</b><small>{m.source_id} · {m.source_locator}</small></div>):<p>No direct measured dimensions are bound. The current shape is an envelope.</p>}
        {coverage.contextMeasurements.length>0&&<details><summary>Other assembly records ({coverage.contextMeasurements.length})</summary><p>These describe related components, not the selected object.</p>{coverage.contextMeasurements.map(m=><div className="detailMeasure" key={m.id}><span>{m.quantity.replaceAll('_',' ')}</span><b>{m.si_value} {m.si_unit}</b><small>{m.source_id} · {m.source_locator}</small></div>)}</details>}
        {observations.length>0&&<><h3>Placement &amp; interpretation</h3>{observations.map(o=><p key={o.id}><b>{o.id.replaceAll('coffer.','').replaceAll('_',' ')}</b>: {o.value} {o.unit??''}{typeof o.si_value==='number'&&<small>{o.si_value.toFixed(6)} m</small>}<small>{o.status} · {o.locator}</small>{o.note&&<small>{o.note}</small>}</p>)}</>}
        <h3>Research sources</h3>{refs.map(r=><p key={r.id}><a href={r.url} target="_blank" rel="noreferrer">{r.title} ↗</a><small>{r.note}</small></p>)}
        <h3>What is still missing</h3>{model.componentResearch.limitations.map(l=><p key={l}>{l}</p>)}
      </div>}
    </div>
    <div className="componentTruth"><b>{coverage.quality}</b><span>{burial?'Measured dimensions; idealized surfaces and illustrative materials. Room shown as cutaway; lifted lid is an inspection pose.'
      :chamber?'Measured east-wall doorway plan. 2.40 m wall height is unverified; doorway is a full-height cutaway, not a measured elevation.'
      :part.provenance.reason??'Preview geometry; detailed surface survey unavailable.'}</span></div>
  </div>;
}
