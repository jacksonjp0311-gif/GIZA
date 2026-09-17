import {useEffect,useState} from 'react';
import type {EvidenceAssembly} from './types';
import {formatValue} from './FeaturePanel';
import {loadRegistrationComparison,parseRegistrationComparison,unavailableRegistration,type RegistrationComparison} from './registration';

function ResidualMap({comparison}:{comparison:RegistrationComparison}){
  const [active,setActive]=useState<string|null>(null),[role,setRole]=useState<'ALL'|'CONTROL'|'HOLDOUT'>('ALL');
  const vectors=comparison.vectors.filter(v=>role==='ALL'||v.role===role),points=vectors.length?vectors.flatMap(v=>[v.target,v.predicted]):[[0,0]];
  if(!comparison.vectors.length)return <p className="evidenceWarning">Residual field: UNKNOWN. There are no accepted control or holdout residuals for this assembly.</p>;
  const minX=Math.min(...points.map(p=>p[0]))-.1,minY=Math.min(...points.map(p=>p[1]))-.1;
  const width=Math.max(.2,Math.max(...points.map(p=>p[0]))-minX+.1),height=Math.max(.2,Math.max(...points.map(p=>p[1]))-minY+.1),r=Math.max(width,height)/90;
  const selected=vectors.find(v=>v.id===active);
  return <><label>Residual role<select aria-label="Residual role" value={role} onChange={e=>setRole(e.target.value as typeof role)}><option>ALL</option><option>CONTROL</option><option>HOLDOUT</option></select></label><div className="evidenceCompareViewport"><svg role="group" aria-label="Plate-local control and holdout residual vectors; unverified imported result" viewBox={`${minX} ${minY} ${width} ${height}`}>{vectors.map(v=><g key={v.id} role="button" tabIndex={0} aria-pressed={active===v.id} aria-label={`${v.role} ${v.id} error ${v.error} metres`} onClick={()=>setActive(v.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setActive(v.id);}}}><line x1={v.target[0]} y1={v.target[1]} x2={v.predicted[0]} y2={v.predicted[1]} stroke={v.role==='CONTROL'?'#73dfb5':'#d8a0eb'} strokeWidth={r/4}/><circle cx={v.target[0]} cy={v.target[1]} r={r} fill={v.role==='CONTROL'?'#73dfb5':'#d8a0eb'}/><path d={`M${v.predicted[0]-r} ${v.predicted[1]-r}l${2*r} ${2*r}m0 ${-2*r}l${-2*r} ${2*r}`} stroke="#ffd088" strokeWidth={r/4} fill="none"/></g>)}</svg></div>{!vectors.length&&<p>No {role.toLowerCase()} points in this imported result.</p>}<p>● target / × prediction · green control / purple holdout. Actual vector scale (not exaggerated); auto-fit view, image-style Y downward.</p>{selected&&<p>{selected.id} · {selected.role}<br/>dx {formatValue(selected.dx)} · dy {formatValue(selected.dy)}<br/>error {formatValue(selected.error)}</p>}</>;
}
export function ComparisonPanel({assembly,overlay,onOverlay}:{assembly:EvidenceAssembly;overlay:boolean;onOverlay:(v:boolean)=>void}){
  const [comparison,setComparison]=useState(unavailableRegistration),[error,setError]=useState('');
  useEffect(()=>{let current=true;loadRegistrationComparison().then(v=>{if(current)setComparison(v);});return()=>{current=false;};},[]);
  return <>
    <label><input type="checkbox" checked={overlay} onChange={e=>onOverlay(e.target.checked)}/>Compare legacy coffer envelope in 3-D</label><p>Explicit comparison-only floor adapter. It does not resolve the archaeological monument transform. Both originals are preserved.</p>
    {assembly.audit.map(a=><article key={a.id} className="evidenceReadout"><b>{a.label}</b><p>{a.status}</p><small>Legacy {formatValue(a.legacyValue,a.unit)} · detail {formatValue(a.detailValue,a.unit)}</small><p>{a.note}</p></article>)}
    {comparison.campaignId&&<details><summary>Imported result identity · unverified</summary><dl className="evidenceKeyValues"><dt>Campaign</dt><dd>{comparison.campaignId}</dd><dt>Frame</dt><dd>{comparison.targetFrame}</dd><dt>Source hash</dt><dd>{comparison.sourceSha256}</dd><dt>Result hash</dt><dd>{comparison.resultSha256}</dd></dl><p>These are imported claims, not locally rehashed source custody.</p></details>}
    <section><h4>Registered source comparison</h4><p>{comparison.note}</p><span className="evidenceBadge">{comparison.status} · METRIC AUTHORITY: NONE</span><ResidualMap comparison={comparison}/><p>Plate-local results remain separate from the assembly until an independently controlled frame tie exists. A scattered web photograph cannot supply that tie.</p><label>Inspect shared-engine result JSON<input type="file" accept="application/json,.json" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>2_000_000)throw new Error('Result exceeds 2 MB');setComparison(parseRegistrationComparison(JSON.parse(await file.text())));setError('');}catch(err){setError(String(err));}}}/></label>{error&&<p role="alert">{error} — previous comparison retained.</p>}
    <p><a href="/workbench/" target="_blank" rel="noreferrer">Open governed registration workbench</a></p>
    <details><summary>Required metric promotion gates</summary><ul><li>Legitimate source bytes rehashed, rights and source locators retained.</li><li>Frozen correspondences, independent scale / control and untouched holdouts.</li><li>Shared-engine profile gates, residuals and transform receipt.</li><li>Explicit assembly-frame tie and uncertainty propagation.</li></ul><p>No fit or promotion has been manufactured here.</p></details></section>
  </>;
}
