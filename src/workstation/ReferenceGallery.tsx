import { useState } from 'react';
import type { PhotoRecord } from '../lib/model';

function ReferenceFigure({photo:p}:{photo:PhotoRecord}) {
  const [failed,setFailed]=useState(false);
  return <figure>
    <a href={p.page_url} target="_blank" rel="noreferrer">
      {failed?<span className="referenceUnavailable">Preview unavailable — open source ↗</span>:<img src={p.image_url} alt={p.title} loading="lazy" onError={()=>setFailed(true)}/>}
    </a>
    <figcaption><a href={p.page_url} target="_blank" rel="noreferrer">{p.title} ↗</a>
      <span>{p.kind==='photograph'?'PHOTOGRAPH':'DRAWING'} · {p.date||'Date unknown'}</span>
      <span>{p.credit}</span><small>{p.caption}</small>
      {p.license_url?<a href={p.license_url} target="_blank" rel="noreferrer">{p.license}</a>:<small>{p.license}</small>}
    </figcaption>
  </figure>;
}
export function ReferenceGallery({photos:records}:{photos:PhotoRecord[]}) {
  const photos=uniqueMedia(records);
  const [kind,setKind]=useState('all');
  const visible=photos.filter(p=>kind==='all'||p.kind===kind);
  return <>
    <label className="referenceFilter">Show references <select aria-label="Reference type" value={kind} onChange={e=>setKind(e.target.value)}>
      <option value="all">All ({photos.length})</option>
      <option value="photograph">Photographs ({photos.filter(p=>p.kind==='photograph').length})</option>
      <option value="diagram">Drawings ({photos.filter(p=>p.kind==='diagram').length})</option>
    </select></label>
    {visible.length?visible.map(p=><ReferenceFigure key={p.id} photo={p}/>):<p>No references of this type are bound to this component.</p>}
  </>;
}
import {uniqueMedia} from '../lib/mediaIdentity';
