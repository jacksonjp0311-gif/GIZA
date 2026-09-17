import {useEffect,useState} from 'react';
import {SPHINX_PHOTOS} from './references';
import type {RegionId} from './catalog';
import type {SphinxView} from './SphinxScene';

export function SphinxReferences({onClose,onInspect,region}:{onClose:()=>void;onInspect:(region:RegionId,view:SphinxView)=>void;region?:RegionId|null}){
  const [index,setIndex]=useState(()=>Math.max(0,SPHINX_PHOTOS.findIndex(p=>p.region===region))),[zoom,setZoom]=useState(1),[failed,setFailed]=useState(false);
  useEffect(()=>{const next=SPHINX_PHOTOS.findIndex(p=>p.region===region);if(next>=0){setIndex(next);setZoom(1);setFailed(false);}},[region]);
  const photo=SPHINX_PHOTOS[index];
  return <aside className="sphinxReference" aria-label="Sphinx photo comparison">
    <header><div><small>REAL PHOTOGRAPH</small><h3>Reference desk</h3></div><button aria-label="Close photo comparison" onClick={onClose}>×</button></header>
    <label>Photograph <select value={index} onChange={e=>{setIndex(Number(e.target.value));setZoom(1);setFailed(false);}}>{SPHINX_PHOTOS.map((p,i)=><option value={i} key={p.id}>{p.title}</option>)}</select></label>
    <div className="sphinxPhotoPan">{failed?<p>Image unavailable. Open the original source below.</p>:<img src={photo.file} alt={`${photo.title}, Great Sphinx of Giza. Photograph by ${photo.author}.`} style={{width:`${zoom*100}%`}} onError={()=>setFailed(true)}/>}</div>
    <label>Photo zoom <input aria-label="Reference photo zoom" type="range" min="1" max="3" step=".1" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/><output>{Math.round(zoom*100)}%</output></label>
    <p>{photo.note}</p>
    <button onClick={()=>onInspect(photo.region,photo.view)}>Focus model on this region</button>
    <p className="sphinxCredit">© {photo.author} · {photo.date}<br/><a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> · <a href={photo.source} target="_blank" rel="noreferrer">Original source ↗</a><br/>Unmodified source file. Visual comparison only; no image-to-model registration.</p>
    <a href="https://aeraweb.org/projects/sphinx/" target="_blank" rel="noreferrer">AERA survey archive &amp; research ↗</a>
  </aside>;
}
