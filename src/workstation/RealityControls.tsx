import type { RealityLayers } from '../evidence/authority';
import type { RealityAuthority } from '../evidence/types';
import './realityControls.css';
export function RealityControls({layers,onChange,showUnverified}:{layers:RealityLayers;onChange:(layers:RealityLayers)=>void;showUnverified:boolean}){
  return <details className="realityControls"><summary>Reality layers</summary><div role="group" aria-label="Overview reality layers">
    {(['OBSERVED','RECONSTRUCTED','HYPOTHESIS'] as RealityAuthority[]).map(authority=><label key={authority}><input type="checkbox" checked={layers[authority]} onChange={e=>onChange({...layers,[authority]:e.target.checked})}/><i className={authority.toLowerCase()} aria-hidden="true"/>{authority}</label>)}
    <p>Overview meshes are reconstructions, not observed survey surfaces. Procedural masonry and simulations are HYPOTHESIS. UNVERIFIED underground additionally requires its separate layer switch ({showUnverified?'enabled':'off'}).</p>
  </div></details>;
}
