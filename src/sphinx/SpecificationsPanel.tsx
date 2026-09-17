import {SPHINX_DIMENSIONS} from './specifications';
export function SpecificationsPanel(){
  return <details className="sphinxSpecifications"><summary>Dimensions &amp; accuracy</summary><p>Published dimensions constrain the study envelope. They do not make the sculptural surface survey-accurate.</p>{SPHINX_DIMENSIONS.map(d=><div key={d.id}><b>{d.label} · ≈ {d.metres} m</b><p>{d.binding}</p><a href={d.source} target="_blank" rel="noreferrer">{d.publisher} ↗</a></div>)}<p>Face, headdress, weathering, stela width/thickness and individual repair stones still require registered survey control. Foreleg-length definitions also need reconciliation with a survey plan; no unsupported local measurement is asserted.</p></details>;
}
