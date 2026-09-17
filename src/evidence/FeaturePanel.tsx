import type {EvidenceAssembly,EvidenceFeature,RealityAuthority} from './types';
import type {SpatialEvidenceGraph} from './graph';
import {traverseEvidence} from './graph';
import type {ModelBundle} from '../lib/model';
import {featureCenter} from './viewGeometry';
import {pointInFrame} from './spatial';
import {UncertaintyReadout} from './UncertaintyReadout';

export function formatValue(value:number|null,unit:string|null='m'){
  return value===null?'UNKNOWN':`${Number(value.toPrecision(8))} ${unit??''}`;
}
export function FeaturePanel({assembly,graph,feature,onSelect,layers,model}:{assembly:EvidenceAssembly;graph:SpatialEvidenceGraph;feature:EvidenceFeature;onSelect:(id:string)=>void;layers:Record<RealityAuthority,boolean>;model:ModelBundle}){
  const trace=traverseEvidence(graph,feature.id),observations=assembly.observations.filter(o=>feature.observationIds.includes(o.id));
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
    <details><summary>Evidence graph · {trace.nodes.length} reachable nodes</summary><p>Relationships are machine-readable in the graph export. Citation metadata is not custody.</p><div className="evidenceGraphPath">{trace.nodes.filter(n=>n.kind!=='FEATURE').map(n=><article key={n.id}><small>{n.kind}</small><code>{n.id}</code><span>{n.label}</span>{n.kind==='SOURCE_BYTES'&&<p>SHA-256: UNKNOWN · not rehashed</p>}</article>)}</div></details>
    <details><summary>Documentary references · {photos.length}</summary><p>Uncalibrated imagery. Feature locations are not registered; no metric claim.</p>{photos.map(p=><figure key={p.id}><img loading="lazy" className="evidencePhoto" src={p.image_url} alt={p.title} onError={e=>{e.currentTarget.hidden=true;}}/><figcaption><a href={p.page_url} target="_blank" rel="noreferrer">{p.title}</a><p>{p.credit}</p><p>{p.caption}</p></figcaption></figure>)}</details>
  </>;
}
