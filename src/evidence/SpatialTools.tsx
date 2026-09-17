import type {CanonicalPoint,EvidenceAssembly,EvidenceFeature,SectionPlane,Vec3} from './types';
import {measureAngle,measurePoints,pointInFrame,resolveTransform,transformPoint} from './spatial';
import {featureAnchors,assemblySections} from './viewGeometry';
import {formatValue} from './FeaturePanel';

export function MeasurementTools({assembly,feature,points,onPoints,mode,onMode,frame,onFrame,snap,onSnap}:{assembly:EvidenceAssembly;feature:EvidenceFeature;points:CanonicalPoint[];onPoints:(p:CanonicalPoint[])=>void;mode:'DISTANCE'|'ANGLE';onMode:(m:'DISTANCE'|'ANGLE')=>void;frame:string;onFrame:(f:string)=>void;snap:boolean;onSnap:(v:boolean)=>void}){
  const result=mode==='ANGLE'&&points.length===3?measureAngle(assembly,points[0],points[1],points[2],frame):mode==='DISTANCE'&&points.length===2?measurePoints(assembly,points[0],points[1],frame):null;
  const anchors=featureAnchors(feature);
  return <>
    <div className="actions"><button aria-pressed={mode==='DISTANCE'} onClick={()=>{onMode('DISTANCE');onPoints([]);}}>Point distance</button><button aria-pressed={mode==='ANGLE'} onClick={()=>{onMode('ANGLE');onPoints([]);}}>Angle · A–B–C</button></div>
    <p>Click {mode==='ANGLE'?'three':'two'} locations in 3-D or choose exact feature anchors below. B is the angle vertex. Measurements ignore inspection motion.</p>
    <label>Authoritative output frame<select aria-label="Measurement frame" value={frame} onChange={e=>onFrame(e.target.value)}>{assembly.frames.map(f=><option key={f.id} value={f.id}>{f.label}</option>)}</select></label>
    <label><input type="checkbox" checked={snap} onChange={e=>onSnap(e.target.checked)}/>Snap picks to nearest feature anchor</label>
    <div className="evidenceReadout" aria-live="polite"><small>{mode==='ANGLE'?'ANGLE':'DISTANCE'} · {points.length}/{mode==='ANGLE'?3:2} POINTS</small><strong>{result?formatValue(result.value,result.unit):'Select points'}</strong>{result&&<><p>{result.reason}</p><small>Uncertainty: UNKNOWN · reconstruction computation</small></>}</div>
    {points.map((p,i)=>{const at=pointInFrame(assembly,p,frame);return <p key={i}><b>{String.fromCharCode(65+i)}</b> · {at?at.map(n=>n.toFixed(6)).join(', ')+' m':'UNKNOWN in requested frame'}<br/><small>{p.featureId} · local {p.position.map(n=>n.toFixed(6)).join(', ')}</small></p>;})}
    <button onClick={()=>onPoints([])}>Clear measurement</button>
    {points.some(p=>p.origin)&&<p>Computed section surface · RECONSTRUCTED · {points.filter(p=>p.origin).length} picked points retain their original section definition.</p>}
    <section><h4>Exact anchors · {feature.label}</h4><p>These are reconstructed corners/endpoints, not observed survey targets.</p><div className="actions">{anchors.map((p,i)=><button key={i} title={p.join(', ')} onClick={()=>onPoints([...points.slice(points.length>=(mode==='ANGLE'?3:2)?points.length:0),{frameId:feature.frameId,featureId:feature.id,position:p}])}>Anchor {i+1}</button>)}</div>{!anchors.length&&<p>UNKNOWN: this feature has no mapped geometry.</p>}</section>
    <section><h4>Assembly clearances / constraints</h4>{assembly.constraints.map(c=><article key={c.id}><b>{c.kind} · {c.status}</b><p>{c.value===null?'UNKNOWN / not numeric':formatValue(c.value,c.unit)}</p><small>{c.note}</small></article>)}</section>
  </>;
}
export interface SectionState {enabled:boolean;axis:'X'|'Y'|'Z'|'OBLIQUE';offset:number;azimuth:number;inclination:number;frameId:string;caps:boolean}
export function sectionPlane(state:SectionState):SectionPlane|null{
  if(!state.enabled)return null;
  const a=state.azimuth*Math.PI/180,e=state.inclination*Math.PI/180;
  return {frameId:state.frameId,normal:state.axis==='X'?[1,0,0]:state.axis==='Y'?[0,1,0]:state.axis==='Z'?[0,0,1]:[Math.cos(e)*Math.cos(a),Math.cos(e)*Math.sin(a),Math.sin(e)],offset:state.offset};
}
function SectionMap({assembly,plane}:{assembly:EvidenceAssembly;plane:SectionPlane}){
  const cuts=assemblySections(assembly,plane),n=plane.normal;
  const cross=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const c=cross(n,Math.abs(n[2])<.9?[0,0,1]:[0,1,0]),len=Math.hypot(...c),u=c.map(x=>x/len) as Vec3,v=cross(n,u),dot=(a:Vec3,b:Vec3)=>a.reduce((s,x,i)=>s+x*b[i],0);
  const polygons=cuts.map(c=>{const matrix=resolveTransform(assembly.frames,assembly.transforms,c.frameId,plane.frameId)!;return c.polygon.map(p=>{const q=transformPoint(matrix,p);return [dot(q,u),dot(q,v)];});});
  const all=polygons.flat();if(!all.length)return <p>Plane does not intersect a supported solid in this frame.</p>;
  const minX=Math.min(...all.map(p=>p[0]))-.12,minY=Math.min(...all.map(p=>p[1]))-.12,w=Math.max(...all.map(p=>p[0]))-minX+.12,h=Math.max(...all.map(p=>p[1]))-minY+.12;
  return <><div className="evidenceCompareViewport"><svg role="img" aria-label="Physical cross-section, cavity left empty" viewBox={`${minX} ${minY} ${w} ${h}`}>{polygons.map((p,i)=><polygon key={i} points={p.map(q=>q.join(',')).join(' ')} fill="#b48b56" stroke="#f6d594" strokeWidth={.008}/>)}</svg></div><p>Solid area: {cuts.reduce((s,c)=>s+c.area,0).toFixed(6)} m²</p><small>Analytic idealized solids in {plane.frameId}. Empty cavity is not capped. Display cuts include only connected frames; visibility filtering does not change this physical readout.</small></>;
}
export function SectionTools({assembly,state,onChange}:{assembly:EvidenceAssembly;state:SectionState;onChange:(s:SectionState)=>void}){
  const plane=sectionPlane(state);const change=(patch:Partial<SectionState>)=>onChange({...state,...patch});
  return <><label><input type="checkbox" checked={state.enabled} onChange={e=>change({enabled:e.target.checked})}/>Clipping / cross-section active</label>
    <label>Physical section frame<select aria-label="Section frame" value={state.frameId} onChange={e=>change({frameId:e.target.value})}>{assembly.frames.filter(f=>f.status==='DEFINED'&&!f.id.includes('legacy')).map(f=><option key={f.id} value={f.id}>{f.label}</option>)}</select></label>
    <div className="actions">{(['X','Y','Z','OBLIQUE'] as const).map(axis=><button key={axis} aria-pressed={state.axis===axis} onClick={()=>change({axis,enabled:true})}>{axis}</button>)}</div>
    {state.axis==='OBLIQUE'&&<><label>Azimuth {state.azimuth}°<input aria-label="Section azimuth" type="range" min="-180" max="180" step="1" value={state.azimuth} onChange={e=>change({azimuth:Number(e.target.value)})}/></label><label>Inclination {state.inclination}°<input aria-label="Section inclination" type="range" min="-90" max="90" step="1" value={state.inclination} onChange={e=>change({inclination:Number(e.target.value)})}/></label></>}
    <label>Plane offset (m)<input aria-label="Section offset exact" type="number" min="-10" max="10" step=".001" value={state.offset} onChange={e=>{if(e.target.value!==''&&Number.isFinite(e.target.valueAsNumber))change({offset:Math.max(-10,Math.min(10,e.target.valueAsNumber))});}}/></label>
    <input aria-label="Move section plane" type="range" min="-3" max="3" step=".01" value={state.offset} onChange={e=>change({offset:Number(e.target.value)})}/>
    <label><input type="checkbox" checked={state.caps} onChange={e=>change({caps:e.target.checked})}/>Show analytic section caps</label>
    {plane&&<SectionMap assembly={assembly} plane={plane}/>}<p>No wall thickness, groove, bore depth or unknown contact surface is invented to close a cut.</p>
  </>;
}
