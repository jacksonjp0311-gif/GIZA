import type {EvidenceAssembly,EvidenceFeature,RealityAuthority} from './types';
import type {SpatialEvidenceGraph} from './graph';
import {traverseEvidence} from './graph';
import type {ModelBundle} from '../lib/model';
import {featureCenter} from './viewGeometry';
import {pointInFrame} from './spatial';
import {UncertaintyReadout} from './UncertaintyReadout';
import {useState} from 'react';
import type {EvidenceQueryPurpose} from './graph';

export function formatValue(value:number|null,unit:string|null='m'){
  return value===null?'UNKNOWN':`${Number(value.toPrecision(8))} ${unit??''}`;
}
export function FeaturePanel({assembly,graph,feature,onSelect,layers,model}:{assembly:EvidenceAssembly;graph:SpatialEvidenceGraph;feature:EvidenceFeature;onSelect:(id:string)=>void;layers:Record<RealityAuthority,boolean>;model:ModelBundle}){
  const [purpose,setPurpose]=useState<EvidenceQueryPurpose>('DIRECT_SUPPORT');
  const trace=traverseEvidence(graph,feature.id,8,purpose),observations=assembly.observations.filter(o=>feature.observationIds.includes(o.id));
  const center=feature.geometry.kind==='unknown'?null:featureCenter(feature);
  const coords=center?pointInFrame(assembly,{frameId:feature.frameId,position:center},assembly.authoritativeFrameId):null;
  const photos=model.photos.filter(p=>p.bind.includes(feature.objectId));
  return <>
    <label>Feature / source dimension<select aria-label="Evidence feature" value={feature.id} onChange={e=>onSelect(e.target.value)}>{assembly.features.filter(f=>layers[f.authority]).map(f=><option key={f.id} value={f.id}>{f.label}</option>)}{!layers[feature.authority]&&<option value={feature.id}>{feature.label} · layer hidden</option>}</select></label>
    {!layers[feature.authority]&&<p className="evidenceWarning">This authority layer is hidden. Its source record remains available; the geometry is not shown.</p>}
    <span className="evidenceBadge">{feature.authority}</span>
    <h3>{feature.label}</h3>
    {feature.value!==null&&<div className="evidenceReadout"><small>SOURCE / DERIVED VALUE</small><strong>{formatValue(feature.value,feature.unit)}</strong><small>Uncertainty: {formatValue(feature.uncertainty.value,feature.uncertainty.unit)}</small></div>}
    <p>{feature.derivation}</p>
    <UncertaintyReadout feature={feature}/>
    <dl className="evidenceKeyValues"><dt>Frame</dt><dd>{feature.frameId}</dd><dt>Local anchor</dt><dd>{center?center.map(n=>n.toFixed(5)).join(', ')+' m':'UNKNOWN'}</dd><dt>Assembly XYZ</dt><dd>{coords?coords.map(n=>n.toFixed(5)).join(', ')+' m':'UNKNOWN'}</dd><dt>Position class</dt><dd>{feature.coordinateAuthority} · feature centre / reference anchor, not survey XYZ</dd><dt>Registration</dt><dd>UNKNOWN · no accepted feature fit</dd><dt>World XYZ</dt><dd>UNKNOWN · unresolved datum/control</dd></dl>
    {feature.unknowns.length>0&&<div className="evidenceWarning">{feature.unknowns.map(s=><p key={s}>{s}</p>)}</div>}
    <section><h4>Exact observation bindings</h4>{observations.map(o=>{const source=assembly.sources.find(s=>s.id===o.sourceId);return <article key={o.id} className="evidenceReadout"><code>{o.id}</code><p>{typeof o.value==='number'?formatValue(o.value,o.unit):o.value??'UNKNOWN'}</p><small>{o.authority} · {o.locator}</small><p><a href={/^https?:\/\//.test(source?.url??'')?source!.url:undefined} target="_blank" rel="noreferrer">{source?.title??o.sourceId}</a></p><small>Native: {String(o.nativeValue??'UNKNOWN')} {o.nativeUnit} · uncertainty {formatValue(o.uncertainty.value,o.uncertainty.unit)}</small><p>{o.derivation}</p></article>;})}</section>
    <label>Relationship purpose<select aria-label="Evidence relationship purpose" value={purpose} onChange={e=>setPurpose(e.target.value as EvidenceQueryPurpose)}><option value="DIRECT_SUPPORT">Direct observation support</option><option value="DERIVED_DEPENDENCIES">Derived dependencies</option><option value="PLACEMENT">Placement / transforms</option><option value="RELATED_CONTEXT">Related context — not support</option></select></label>
    <details><summary>Evidence graph · {trace.nodes.length} nodes · {purpose}</summary><p>Scalar authority: {feature.authority}. Coordinates: {feature.coordinateAuthority}. Reference geometry is not a surveyed surface. Review is not authenticated; source bytes are not verified.</p>{purpose==='RELATED_CONTEXT'&&<p className="evidenceWarning">General relationships are context, not additional supporting observations.</p>}<div className="evidenceGraphPath">{trace.nodes.filter(n=>n.kind!=='FEATURE').map(n=><article key={n.id}><small>{n.kind}</small><code>{n.id}</code><span>{n.label}</span><p>{trace.edges.filter(e=>e.to===n.id).map(e=>`${e.from} → ${e.relationship}`).join('; ')}</p>{n.kind==='SOURCE_BYTES'&&<p>SHA-256: UNKNOWN · not rehashed</p>}</article>)}</div></details>
    <details><summary>Documentary references · {photos.length}</summary><p>Uncalibrated imagery. Feature locations are not registered; no metric claim.</p>{photos.map(p=><figure key={p.id}><img loading="lazy" className="evidencePhoto" src={p.image_url} alt={p.title} onError={e=>{e.currentTarget.hidden=true;}}/><figcaption><a href={p.page_url} target="_blank" rel="noreferrer">{p.title}</a><p>{p.credit}</p><p>{p.caption}</p></figcaption></figure>)}</details>
  </>;
}
