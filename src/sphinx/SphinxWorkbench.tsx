import { useEffect, useRef, useState } from 'react';
import { Group, type Scene } from 'three';
import { SphinxScene, type SphinxView } from './SphinxScene';
import { SPHINX_REGIONS, SPHINX_SOURCES, repairBlocks, type RegionId } from './catalog';
import { InscriptionLauncher } from '../epigraphy/InscriptionLauncher';
import { SphinxReferences } from './SphinxReferences';
import { SpecificationsPanel } from './SpecificationsPanel';
import {DEFAULT_REALITY_LAYERS,sphinxObjectAuthority,type RealityLayers} from '../evidence/authority';
import type {RealityAuthority} from '../evidence/types';

export function SphinxWorkbench({onClose,initialArtifact=false}:{onClose:()=>void;initialArtifact?:boolean}){
  const scene=useRef<Scene|null>(null),[exportStatus,setExportStatus]=useState(''),[exporting,setExporting]=useState(false);
  const [explosion,setExplosion]=useState(0),[selected,setSelected]=useState<RegionId|null>(initialArtifact?'stela':null),[block,setBlock]=useState<number|undefined>();
  const [hidden,setHidden]=useState<RegionId[]>(['repairs']),[isolated,setIsolated]=useState(initialArtifact),[geology,setGeology]=useState(false),[wireframe,setWireframe]=useState(false);
  const [section,setSection]=useState<number|null>(null),[dimensions,setDimensions]=useState(initialArtifact),[ground,setGround]=useState(true),[turntable,setTurntable]=useState(false);
  const [view,setView]=useState<SphinxView>(initialArtifact?'Front':'Perspective'),[revision,setRevision]=useState(0),[sources,setSources]=useState(false),[focus,setFocus]=useState(false);
  const [photos,setPhotos]=useState(initialArtifact),[focused,setFocused]=useState<RegionId|null>(initialArtifact?'stela':null);
  const [realityLayers,setRealityLayers]=useState<RealityLayers>({...DEFAULT_REALITY_LAYERS});
  const region=SPHINX_REGIONS.find(r=>r.id===selected);
  const choose=(id:RegionId,index?:number)=>{setSelected(id);setBlock(index);setRealityLayers(v=>({...v,[sphinxObjectAuthority(id).authority]:true}));if(isolated)setRevision(v=>v+1);};
  const fit=()=>setRevision(v=>v+1);
  const inspectArtifact=()=>{setSelected('stela');setBlock(undefined);setHidden(v=>v.filter(id=>id!=='stela'));setIsolated(true);setFocused('stela');setExplosion(0);setSection(null);setGeology(false);setView('Front');setDimensions(true);setPhotos(true);setTurntable(false);setRealityLayers(v=>({...v,RECONSTRUCTED:true,OBSERVED:true}));fit();};
  const reset=()=>{setExportStatus('');setExplosion(0);setSelected(null);setBlock(undefined);setHidden(['repairs']);setIsolated(false);setGeology(false);setWireframe(false);setSection(null);setDimensions(false);setGround(true);setTurntable(false);setView('Perspective');setFocused(null);setRealityLayers({...DEFAULT_REALITY_LAYERS});fit();};
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'&&!document.querySelector('[data-epigraphy]')){setFocus(false);setIsolated(false);setSources(false);setPhotos(false);setFocused(null);}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[]);
  const exportView=()=>{
    const payload={schema:'giza.sphinx.study-view.v1',geometry_authority:'ILLUSTRATIVE_RECONSTRUCTION',not_a_survey:true,exported_at:new Date().toISOString(),view,focused,explosion,selected,block,isolated,hidden,section,geology,wireframe,dimensions,realityLayers,evidenceObjects:SPHINX_REGIONS.map(r=>sphinxObjectAuthority(r.id)),sources:SPHINX_SOURCES};
    const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='giza-sphinx-study-view.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const exportMesh=async()=>{
    if(!scene.current)return;setExporting(true);setExportStatus('Preparing model…');
    try{
      const {GLTFExporter}=await import('three/examples/jsm/exporters/GLTFExporter.js');
      const snapshot=scene.current.clone(true),omit:typeof snapshot.children=[];
      snapshot.traverse(o=>{if(!('isMesh' in o)&&!('isGroup' in o)&&!('isScene' in o))omit.push(o);if(o.type==='Line2'||o.type==='LineSegments2')omit.push(o);});omit.forEach(o=>o.removeFromParent());
      const axisRoot=new Group();axisRoot.name='Z-up study to glTF Y-up';axisRoot.rotation.x=-Math.PI/2;[...snapshot.children].forEach(o=>axisRoot.add(o));snapshot.add(axisRoot);
      snapshot.userData={...snapshot.userData,frame:'glTF Y-up: X east, Y up, -Z north; no global registration',realityLayers,evidenceObjects:SPHINX_REGIONS.map(r=>sphinxObjectAuthority(r.id)),presentation_export:true,sources:SPHINX_SOURCES.map(s=>s.url)};
      snapshot.updateMatrixWorld(true);
      const bytes=await new GLTFExporter().parseAsync(snapshot,{binary:true,onlyVisible:true});
      if(!(bytes instanceof ArrayBuffer))throw new Error('Expected a binary model.');
      const url=URL.createObjectURL(new Blob([bytes],{type:'model/gltf-binary'})),a=document.createElement('a');a.href=url;a.download='giza-sphinx-illustrative-study.glb';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      setExportStatus('GLB exported: current pose, base materials. Clipping, labels and shader grain are not baked. Not survey geometry.');
    }catch(e){setExportStatus(`Export failed: ${String(e)}`);}finally{setExporting(false);}
  };
  return <section className={`sphinxWorkbench${focus?' sphinxFocus':''}`} data-sphinx-workbench>
    <aside className="sphinxPanel">
      <div className="sphinxIntro"><small>MONUMENT EXPLORER</small><h2>The Great Sphinx</h2><p>Carved limestone · lion body · royal head</p><button onClick={onClose}>← Khafre pyramid</button></div>
      <h3>Inspect a region</h3><p className="sphinxMuted">Select on the model or below. Eye checkboxes control visibility.</p>
      <InscriptionLauncher onModel={inspectArtifact}/>
      <SpecificationsPanel/>
      <details className="sphinxReality"><summary>Reality layers · evidence authority</summary><p className="sphinxMuted">Published dimensions are observed records with reconstructed anchors. No Sphinx mesh is a registered observed surface.</p>{(['OBSERVED','RECONSTRUCTED','HYPOTHESIS'] as RealityAuthority[]).map(layer=><label key={layer} style={{display:'block',margin:'8px 0',color:layer==='OBSERVED'?'#72e8bb':layer==='HYPOTHESIS'?'#ce97ea':'#e9bc75'}}><input type="checkbox" aria-label={`Sphinx ${layer} layer`} checked={realityLayers[layer]} onChange={e=>setRealityLayers(v=>({...v,[layer]:e.target.checked}))}/>{layer}</label>)}<p className="sphinxMuted">RECONSTRUCTED: exterior/stela study. HYPOTHESIS: synthetic repair layout, purple and off by default. Region visibility remains independent.</p></details>
      <button onClick={()=>{setHidden(['repairs','stela']);setSelected('core');setIsolated(false);setFocused(null);setGeology(true);setExplosion(0);setSection(null);setRealityLayers(v=>({...v,RECONSTRUCTED:true}));fit();}}>Expose carved bedrock</button>
      <p className="sphinxMuted">The Sphinx is carved bedrock, not a hollow shell. This removes the study repair skin and stela; no undocumented interior is invented.</p>
      <div className="sphinxRegions">{SPHINX_REGIONS.map(r=><div key={r.id}><input aria-label={`Show ${r.name}`} type="checkbox" checked={!hidden.includes(r.id)} onChange={()=>{if(hidden.includes(r.id))setRealityLayers(v=>({...v,[sphinxObjectAuthority(r.id).authority]:true}));setHidden(v=>v.includes(r.id)?v.filter(id=>id!==r.id):[...v,r.id]);}}/><button aria-pressed={selected===r.id} onClick={()=>{setHidden(v=>v.filter(id=>id!==r.id));choose(r.id);}}><i style={{background:r.id==='repairs'?'#ce97ea':r.color}}/>{r.name}</button></div>)}</div>
      <section className="sphinxSelection" aria-live="polite"><h3>{region?.name??'Whole monument'}</h3><p>{region?.note??'A complete exterior study model, not a registered scan. Select a region to inspect its limitations.'}</p>
        <p>{selected?sphinxObjectAuthority(selected).authority:'RECONSTRUCTED'} · surface survey NOT ESTABLISHED · position uncertainty UNKNOWN</p>
        {block!==undefined&&<p>Synthetic block {block+1} / {repairBlocks().length} · course {repairBlocks()[block].course+1}. Display ID only—not an archaeological inventory number.</p>}
        <button disabled={!selected} aria-pressed={isolated} onClick={()=>{setIsolated(v=>!v);fit();}}>{isolated?'Show assembly':'Isolate selected'}</button>
        <button disabled={!selected} onClick={()=>{setFocused(selected);setIsolated(false);setHidden(v=>v.filter(id=>id!==selected));fit();}}>Focus selected in context</button>
        {selected==='stela'&&<div className="sphinxArtifactLink"><b>Artifact study · Dream Stela</b><p>Height reference → original photographs → reading zones → separate predictions.</p><InscriptionLauncher label="Explore this artifact" onModel={inspectArtifact}/><button onClick={inspectArtifact}>Stela + source photo</button></div>}
      </section>
      <button onClick={()=>setSources(v=>!v)} aria-expanded={sources}>Sources &amp; model limits</button>
      {sources&&<div className="sphinxSources">{SPHINX_SOURCES.map(s=><p key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a><small>{s.note}</small></p>)}<p>No hidden chambers, tunnels, intact missing features or dated repair phases are invented. Stone courses, erosion, facial details and enclosure slab are schematic.</p></div>}
    </aside>
    <div className="sphinxViewer">
      <div className="sphinxToolbar">
        {(['Perspective','Front','Side','Top'] as SphinxView[]).map(v=><button key={v} aria-pressed={view===v} onClick={()=>{setView(v);fit();}}>{v}</button>)}
        <button onClick={()=>{setFocused(null);fit();}}>Fit view</button><button onClick={reset}>Reset Sphinx</button><button aria-pressed={photos} onClick={()=>setPhotos(v=>!v)}>Compare photos</button><button aria-pressed={focus} onClick={()=>setFocus(v=>!v)}>{focus?'Restore controls · Esc':'Expand Sphinx'}</button><button onClick={exportView}>Export view</button><button disabled={exporting} onClick={exportMesh}>Export GLB</button>
      </div>
      <div className={`sphinxStage${photos?' withReferences':''}`}><div className="sphinxCanvas"><SphinxScene explosion={explosion} selected={selected} selectedBlock={block} isolated={isolated} focused={focused} hidden={hidden} geology={geology} wireframe={wireframe} section={section} ground={ground} dimensions={dimensions} turntable={turntable} view={view} revision={revision} realityLayers={realityLayers} onSelect={choose} onReady={s=>{scene.current=s;}}/>
        <span className="sphinxBadge">{selected==='repairs'?'HYPOTHESIS · SYNTHETIC REPAIR STUDY':'EXTERIOR RECONSTRUCTION · NOT A SCAN'}</span>
        <details className="sphinxExplode" open={!focused}><summary>Inspection explosion <b>{Math.round(explosion*100)}%</b></summary><input id="sphinx-explode" aria-label="Sphinx explosion distance" type="range" min="0" max="2" step=".01" value={explosion} onChange={e=>setExplosion(Number(e.target.value))}/><div><button onClick={()=>{setExplosion(0);fit();}}>Assemble</button><button onClick={()=>{setExplosion(1);setIsolated(false);setFocused(null);fit();}}>Explode &amp; fit</button></div></details>
      </div>{photos&&<SphinxReferences region={selected} onClose={()=>setPhotos(false)} onInspect={(id,camera)=>{setSelected(id);setBlock(undefined);setFocused(id==='core'?null:id);setIsolated(false);setHidden(v=>v.filter(h=>h!==id));setExplosion(0);setSection(null);setView(camera);setRealityLayers(v=>({...v,[sphinxObjectAuthority(id).authority]:true}));fit();}}/>}</div>
      <div className="sphinxTools">
        {exportStatus&&<p className="sphinxExportStatus" role="status">{exportStatus}</p>}
        <label><input type="checkbox" checked={geology} onChange={e=>setGeology(e.target.checked)}/>Geology palette</label>
        <label><input type="checkbox" checked={!hidden.includes('repairs')&&realityLayers.HYPOTHESIS} onChange={e=>{if(e.target.checked)setRealityLayers(v=>({...v,HYPOTHESIS:true}));setHidden(v=>e.target.checked?v.filter(id=>id!=='repairs'):[...v.filter(id=>id!=='repairs'),'repairs']);}}/>Hypothetical repair-block study</label>
        <label><input type="checkbox" checked={wireframe} onChange={e=>setWireframe(e.target.checked)}/>Wireframe</label>
        <label><input type="checkbox" checked={dimensions} onChange={e=>setDimensions(e.target.checked)}/>{selected==='stela'?'Published stela height':'Overall dimensions'}</label>
        <label><input type="checkbox" checked={ground} onChange={e=>setGround(e.target.checked)}/>Display plinth</label>
        <label><input type="checkbox" checked={turntable} onChange={e=>setTurntable(e.target.checked)}/>Turntable</label>
        <label><input type="checkbox" checked={section!==null} onChange={e=>setSection(e.target.checked?0:null)}/>Section cut</label>
        {section!==null&&<label>North/south cut <input aria-label="Sphinx section position" type="range" min="-12" max="12" step=".1" value={section} onChange={e=>setSection(Number(e.target.value))}/>{section.toFixed(1)} m</label>}
      </div>
      <div className="sphinxTruth"><b>{isolated?'ISOLATED REGION':explosion?'EXPLODED INSPECTION':'ASSEMBLED STUDY'}</b><span>Drag rotate · scroll zoom · right-drag pan. Explosion separates display regions of continuous bedrock; repair blocks are synthetic. Section cuts are uncapped. Local X east / Y north / Z up; no global registration.</span>{geology&&<span>Geology: lower bedrock / layered body / head and neck. Color boundaries are schematic, not a measured geological contact map.</span>}</div>
    </div>
  </section>;
}
