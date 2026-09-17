import type {Part} from '../lib/model';
export function DimensionReadout({part}:{part:Part|undefined}) {
  if(!part)return null;
  const g=part.spatial.primitive;
  const sizes=g.kind==='box'?[g.sx,g.sy,g.sz]:[g.radius*2,g.radius*2,g.height];
  return <details className="dimensionReadout"><summary>Selected preview dimensions</summary><b>{part.name}</b><p>{sizes.map(n=>n.toFixed(3)).join(' × ')} m</p><small>Local envelope X × Y × Z, not a surface survey. Open the component for source measurements.</small></details>;
}
