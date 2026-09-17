import type { ModelBundle } from '../lib/model';
import { GIZA_DISPLAY_VERSION } from '../version';

export function WorkstationHeader({model,surface,onSurface,modelTitle='KHAFRE / PYRAMID CORE'}: {
  modelTitle?:string;
  model:ModelBundle;
  surface:'MODEL'|'ATLAS'|'REGISTRATION';
  onSurface:(surface:'MODEL'|'ATLAS'|'REGISTRATION')=>void;
}) {
  const verified=model.parts.filter(p=>p.provenance.class!=='UNVERIFIED').length;
  return <header className="topbar edgeTop compactModelHeader">
    <div className="brandModelIdentity">
      <div className="animatedBrandMark" title="GIZA NEXUS">
        <i className="logoOrbit" aria-hidden="true"/>
        <img src="/GIZA-NEXUS.png" alt="GIZA NEXUS pyramid logo"/>
      </div>
    <div className="modelIdentity" title="CINEMATIC SPATIAL REVERSE-ENGINEERING WORKSTATION">
      <small>GIZA <em>NEXUS</em> · v{GIZA_DISPLAY_VERSION}</small>
      <h1 aria-live="polite" title={modelTitle}>{surface==='MODEL'?modelTitle:surface==='ATLAS'?'GIZA / MAP ATLAS':'GIZA / REGISTRATION'}</h1>
      <span>GIZA, EGYPT · {model.field.geospatialFrame.reference_anchor.latitude_deg.toFixed(6)}° N · {model.field.geospatialFrame.reference_anchor.longitude_deg.toFixed(6)}° E · c. 2570 BCE</span>
    </div>
    </div>
    <nav className="surfaceSwitch" aria-label="Viewport surface">
      <button aria-pressed={surface==='MODEL'} className={surface==='MODEL'?'active':''} onClick={()=>onSurface('MODEL')}>3D MODEL</button>
      <button aria-pressed={surface==='ATLAS'} className={surface==='ATLAS'?'active':''} onClick={()=>onSurface('ATLAS')}>MAP ATLAS</button>
      <button aria-pressed={surface==='REGISTRATION'} className={surface==='REGISTRATION'?'active':''} onClick={()=>onSurface('REGISTRATION')}>REGISTRATION</button>
    </nav>
    <div className="headerSummary" aria-label="Model evidence summary">
      <span><b>{verified}</b> evidence-bound</span><span><b>{model.parts.length-verified}</b> unverified</span><span><b>{model.measurements.length}</b> measurements</span>
    </div>
  </header>;
}
