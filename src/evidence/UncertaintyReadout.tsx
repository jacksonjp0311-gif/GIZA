import type {EvidenceFeature} from './types';
/** A source scalar interval, never a 3-D survey covariance ellipsoid. */
export function UncertaintyReadout({feature}:{feature:EvidenceFeature}){
  const u=feature.uncertainty;
  if(u.status!=='KNOWN'||u.value===null||feature.value===null)return <div className="uncertaintyUnknown" role="img" aria-label="Uncertainty unknown; no numeric error envelope is available"><i/><span>UNKNOWN</span><small>No numeric error envelope can be drawn.</small></div>;
  return <div className="uncertaintyInterval" role="img" aria-label={`Reported scalar uncertainty ${feature.value} plus or minus ${u.value} ${u.unit}; not spatial covariance`}><svg viewBox="0 0 240 45" aria-hidden="true"><line x1="24" x2="216" y1="22" y2="22" stroke="#72e8bb" strokeWidth="3"/>{[24,120,216].map(x=><line key={x} x1={x} x2={x} y1={x===120?8:15} y2={x===120?36:29} stroke="#f3d39c" strokeWidth="2"/>)}</svg><div><span>{Number((feature.value-u.value).toPrecision(8))}</span><span>{Number((feature.value+u.value).toPrecision(8))} {u.unit}</span></div><small>Reported ±{u.value} {u.unit}; statistical interpretation unspecified. This interval does not locate the endpoints in space.</small></div>;
}
