import { useMemo } from 'react';
import type { Measurement, ModelBundle, Part } from '../lib/model';
import { evidenceSummary } from '../lib/evidence';
import { photoGraphForTarget, promotionForTarget, uncertaintyForTarget } from '../lib/field';
import type { StoneCellInfo } from '../scene/types';
import type { InspectorTab, LayerKey } from './types';
import type { ActiveSimulation } from '../simlab/types';
import { uniquePhotos, type DetailContext } from '../lib/componentDetails';
import { unavailable } from '../lib/runtimeData';
import { UnavailableDataset } from './WorkspaceBoundary';

function pretty(label: string) {
  return label.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
}


function AcousticSpectrum({ points, activeHz }: { points: {frequency_hz:number;screening_amplitude:number}[]; activeHz:number }) {
  const sampled = points.filter((_,i)=>i%4===0);
  const max = Math.max(1,...sampled.map(p=>p.screening_amplitude));
  const maxHz = Math.max(1,...sampled.map(p=>p.frequency_hz));
  const path = sampled.map((p,i)=>{
    const x=8+(p.frequency_hz/maxHz)*284;
    const y=62-(p.screening_amplitude/max)*48;
    return `${i?'L':'M'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const activeX=8+(activeHz/maxHz)*284;
  return <div className="echoSpectrum"><div className="spectrumTitle"><b>SCREENING RESPONSE</b><span>1–{maxHz.toFixed(0)} Hz</span></div><svg viewBox="0 0 300 72" role="img" aria-label="Mode screening response by frequency"><line x1="8" y1="62" x2="292" y2="62" className="axisLine"/><line x1={activeX} y1="9" x2={activeX} y2="62" className="activeLine"/><path d={path} className="spectrumPath"/><text x="8" y="70">0</text><text x="143" y="70">{(maxHz/2).toFixed(0)}</text><text x="278" y="70">{maxHz.toFixed(0)} Hz</text></svg></div>;
}

function measureValue(m: Measurement) {
  if (m.si_value === null || m.si_value === undefined) return '—';
  const v = typeof m.si_value === 'number' ? Number(m.si_value.toFixed(6)) : m.si_value;
  return `${v} ${m.si_unit ?? ''}`.trim();
}

export function ObjectInspectorPanel({
  model, selected, selectedStone, tab, setTab, photoIndex, setPhotoIndex,
  animationSpeed, setAnimationSpeed, showLabels, setShowLabels,
  showDimensions, setShowDimensions, layers, activeSimulation, setActiveSimulation, toggleLayer, onSelectPart,
  onOpenDetail,
}: {
  onOpenDetail:(id:string,context?:DetailContext)=>void;
  model: ModelBundle;
  selected: Part | null;
  selectedStone: StoneCellInfo | null;
  tab: InspectorTab;
  setTab: (tab: InspectorTab) => void;
  photoIndex: number;
  setPhotoIndex: (index: number) => void;
  animationSpeed: number;
  setAnimationSpeed: (value: number) => void;
  showLabels: boolean;
  setShowLabels: (value: boolean) => void;
  showDimensions: boolean;
  setShowDimensions: (value: boolean) => void;
  layers: Record<LayerKey, boolean>;
  activeSimulation: ActiveSimulation;
  setActiveSimulation: (value: ActiveSimulation) => void;
  toggleLayer: (key: LayerKey) => void;
  onSelectPart: (id: string) => void;
}) {
  const selectedId = selected?.id ?? null;
  const meta = selected ? model.atlasObjects[selected.id] : undefined;
  const photos = useMemo(() => selectedId ? uniquePhotos(model.photos.filter(p => p.bind.includes(selectedId))) : [], [model, selectedId]);
  const activePhoto = photos.length ? photos[photoIndex % photos.length] : null;
  const selectedEvidence = useMemo(() => evidenceSummary(selected, model.evidenceItems ?? []), [selected, model.evidenceItems]);
  const selectedMaturity = model.maturityLevels.find(level => level.id === selectedEvidence.maturity);
  const selectedSources = useMemo(() => {
    const ids = new Set(selectedEvidence.sourceIds);
    return model.sourceRegistry.filter(source => ids.has(source.id));
  }, [model.sourceRegistry, selectedEvidence.sourceIds]);
  const canonBindings = selected ? model.objectSourceMap.parts[selected.id] ?? [] : [];
  const bySourceId = useMemo(() => new Map(model.sourceRegistry.map(source => [source.id, source])), [model.sourceRegistry]);
  const canonSources = canonBindings.map(binding => ({ binding, source: bySourceId.get(binding.source_id) })).filter(row => row.source);
  const canonConflicts = selected
    ? model.conflicts.filter(conflict => conflict.scope === selected.id || (selected.provenance.class === 'UNVERIFIED' && conflict.scope === 'deep_claim_layer'))
    : [];
  const rightsBySource = useMemo(() => new Map(model.rightsRows.map(row => [row.source_id, row])), [model.rightsRows]);
  const selectedUncertainty = uncertaintyForTarget(model.field.uncertaintyCatalog, selectedId);
  const selectedFieldPhotos = photoGraphForTarget(model.field.photoGraph, selectedId);
  const selectedPromotion = promotionForTarget(model.field.promotionCatalog, selectedId);
  const selectedAcquisition = selected
    ? model.field.acquisitionCatalog.targets.filter(item => item.target === selected.id || item.target === 'khafre_interior').slice(0, 4)
    : [];
  const measurements = selected && meta
    ? model.measurements.filter(m => meta.measurement_components.includes(m.component))
    : [];
  const related = selected ? model.parts.filter(p => p.id !== selected.id && p.parent === selected.parent).slice(0, 5) : [];
  const acoustic = model.simlab.acoustic;
  const strongestAcousticPeak = acoustic.response.peaks.reduce((best, peak) => !best || peak.screening_amplitude > best.screening_amplitude ? peak : best, acoustic.response.peaks[0]);
  const independentPercentile = acoustic.coincidence_screen.independent_null.actual_percentile_le * 100;
  const constrainedPercentile = acoustic.coincidence_screen.constraint_preserving_null.actual_percentile_le * 100;
  const dataScope=tab==='CANON'?'EVIDENCE':tab;
  const blockedScope=unavailable(model.runtimeDiagnostics,dataScope)?dataScope:null;
  const surveyTie=model.field.geospatialFrame.local_frame.rotation_to_monument;

  return (
    <aside data-tutorial-id="object-inspector" className="rightRail edgeRight inspectorDock">
      <section className="panelCard inspectorHead">
        <div className="inspectorTitle">
          <b>OBJECT INSPECTOR</b>
          <span className={`truthBadge ${tab === 'FINDINGS' ? 'global' : selectedStone ? 'assumed' : (selected?.provenance.class.toLowerCase() ?? '')}`}>
            {tab === 'FINDINGS' ? 'GLOBAL' : selectedStone ? 'ASSUMED' : (selected?.provenance.class ?? 'NONE')}
          </span>
        </div>
        <h2>{tab === 'FINDINGS' ? 'Persistent Findings' : selectedStone ? selectedStone.id : (meta?.title ?? selected?.name ?? 'No object selected')}</h2>
        <span className="objectSub">
          {tab === 'FINDINGS' ? 'Cross-version research memory · controls · next tests' : selectedStone ? `Analysis cell · Course ${selectedStone.course} · ${selectedStone.face} face` : (selected?.name ?? 'Select an object in the 3-D viewport')}
        </span>
      </section>

      <section className={`panelCard mainInspector ${(tab === 'OVERVIEW' || tab === 'PHOTOS') ? 'withHero' : 'dataOnly'}`}>
        <div className="inspectorTabs">
          {(['OVERVIEW', 'SPECS', 'PHOTOS', 'EVIDENCE', 'CANON', 'FIELD', 'SIMULATION', 'FINDINGS'] as InspectorTab[]).map(t => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {(tab === 'OVERVIEW' || tab === 'PHOTOS') && (
          activePhoto && layers.photos ? (
            <div className="inspectorHero">
              <img src={activePhoto.image_url} alt={activePhoto.title} />
              <div className="photoNav"><button onClick={() => setPhotoIndex((photoIndex - 1 + photos.length) % photos.length)}>‹</button><span>{photoIndex + 1} / {photos.length}</span><button onClick={() => setPhotoIndex((photoIndex + 1) % photos.length)}>›</button></div>
            </div>
          ) : (
            <div className="inspectorHero noPhoto"><b>NO VERIFIED PHOTO BOUND</b><span>Model data remains available.</span></div>
          )
        )}

        <div className="inspectorBody">
          {tab === 'OVERVIEW' && (
            <>
              <p className="leadText">{selectedStone ? 'Procedural masonry analysis cell generated from the measured pyramid envelope. It is selectable and explodable, but is not claimed to be an individually mapped historical stone.' : (meta?.simple ?? selected?.name ?? 'Select a component.')}</p>
              {selectedStone ? (
                <>
                  <div className="specRows compactSpec">
                    <div><span>Course</span><b>{selectedStone.course}</b></div>
                    <div><span>Face</span><b>{selectedStone.face}</b></div>
                    <div><span>Cell width</span><b>{selectedStone.width_m.toFixed(3)} m</b></div>
                    <div><span>Cell height</span><b>{selectedStone.height_m.toFixed(3)} m</b></div>
                    <div><span>Cell depth</span><b>{selectedStone.depth_m.toFixed(3)} m</b></div>
                    <div><span>Provenance</span><b>ASSUMED ANALYSIS CELL</b></div>
                  </div>
                  <div className="whyBox"><b>WHY IT IS IN THE MODEL</b><p>FORGE/VAULT uses these cells as a reversible analysis lattice for block-scale inspection and explosion. A cell must be replaced by a mapped stone record before it can be treated as historical masonry geometry.</p></div>
                </>
              ) : (
                <>
                  <div className="specRows compactSpec">
                    <div><span>Material</span><b>{selected?.material ?? 'Unspecified'}</b></div>
                    <div><span>Placement</span><b>{selected?.parent ?? '—'}</b></div>
                    <div><span>Provenance</span><b>{selected?.provenance.class ?? '—'}</b></div>
                    <div><span>Revision</span><b>{selected?.provenance.revision_id ?? '—'}</b></div>
                    <div><span>Evidence maturity</span><b>{selectedEvidence.maturity} · {selectedMaturity?.name ?? 'REFERENCE_ONLY'}</b></div>
                    <div><span>Evidence receipts</span><b>{selectedEvidence.items.length}</b></div>
                    <div><span>CANON source map</span><b>{canonBindings.length}</b></div>
                  </div>
                  <div className="whyBox"><b>WHY IT IS IN THE MODEL</b><p>{meta?.why_known ?? selected?.provenance.reason ?? 'No provenance note.'}</p></div>
                </>
              )}
            </>
          )}

          {tab === 'SPECS' && (selected || selectedStone) && (
            <>
              {selectedStone ? (
                <>
                  <div className="specRows">
                    <div><span>Cell ID</span><b>{selectedStone.id}</b></div><div><span>Course / face</span><b>{selectedStone.course} / {selectedStone.face}</b></div>
                    <div><span>X</span><b>{selectedStone.center_m[0].toFixed(3)} m</b></div><div><span>Y</span><b>{selectedStone.center_m[1].toFixed(3)} m</b></div>
                    <div><span>Z</span><b>{selectedStone.center_m[2].toFixed(3)} m</b></div><div><span>Dimensions</span><b>{selectedStone.width_m.toFixed(3)} × {selectedStone.depth_m.toFixed(3)} × {selectedStone.height_m.toFixed(3)} m</b></div>
                  </div>
                  <h3>TRUTH WARNING</h3><p className="empty">{model.stoneField.truth_warning}</p>
                </>
              ) : selected ? (
                <>
                  <div className="specRows">
                    <div><span>Object ID</span><b>{selected.id}</b></div><div><span>Type</span><b>{selected.spatial.primitive.kind.toUpperCase()}</b></div>
                    <div><span>X</span><b>{selected.spatial.origin_m[0].toFixed(3)} m</b></div><div><span>Y</span><b>{selected.spatial.origin_m[1].toFixed(3)} m</b></div><div><span>Z</span><b>{selected.spatial.origin_m[2].toFixed(3)} m</b></div>
                  </div>
                  <h3>BOUND MEASUREMENTS</h3>
                  {measurements.length ? measurements.map(m => <div className="measurementRow" key={m.id}><div><b>{pretty(m.quantity)}</b><span>{m.source_locator ?? m.source_id}</span></div><strong>{measureValue(m)}</strong></div>) : <p className="empty">No measurement rows bound to this object.</p>}
                </>
              ) : null}
            </>
          )}

          {tab === 'PHOTOS' && <div className="photoEvidence">{activePhoto ? <div className="photoEvidenceMeta"><b>{activePhoto.title}</b><p>{activePhoto.caption}</p><div><span>{activePhoto.date}</span><span>{activePhoto.license}</span></div><a href={activePhoto.page_url} target="_blank" rel="noreferrer">SOURCE / RIGHTS ↗</a><small>VISUAL EVIDENCE · NO METRIC GEOMETRY WITHOUT CALIBRATION</small></div> : null}<div className="photoList">{photos.length ? photos.map((p, i) => <button key={p.id} className={i === photoIndex ? 'active' : ''} onClick={() => setPhotoIndex(i)}><b>{p.title}</b><span>{p.credit}</span></button>) : <p className="empty">No vetted reusable photos bound.</p>}</div></div>}

          {tab === 'EVIDENCE' && !blockedScope && (
            <div className="sourceList evidencePipeline">
              <div className="maturityCard"><span>EVIDENCE MATURITY</span><b>{selectedEvidence.maturity} · {selectedMaturity?.name ?? 'REFERENCE_ONLY'}</b><p>{selectedMaturity?.meaning ?? 'No explicit evidence receipt is bound to this object yet.'}</p></div>
              <h3>EVIDENCE RECEIPTS</h3>
              {selectedEvidence.items.length ? selectedEvidence.items.map(item => <div className="evidenceReceipt" key={item.id}><div><b>{item.id}</b><span>{item.kind} · {item.maturity}</span></div><p>{item.notes ?? item.claims.join(' · ')}</p></div>) : <p className="empty">No explicit promotion receipt is bound. The object remains at E0 for evidence-maturity purposes.</p>}
              <h3>BOUND SOURCES</h3>
              {selectedSources.length ? selectedSources.map(source => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><b>{source.title}</b><span>{source.kind} · {source.asset_action}</span>{source.authority ? <small>Authority G{source.authority.geometry} · M{source.authority.materials} · V{source.authority.visual} · Method {source.authority.method}</small> : null}</a>) : <p className="empty">No source registry entries are bound through an evidence receipt.</p>}
              <h3>AVAILABLE SOLVERS</h3>
              {model.solverRegistry.map(solver => <div className="solverCard" key={solver.id}><b>{solver.name}</b><span>SIMULATED output only</span><p>{solver.purpose}</p></div>)}
            </div>
          )}

          {tab === 'CANON' && !blockedScope && (
            <div className="canonPanel">
              {selectedStone ? <div className="canonWarning"><b>ASSUMED ANALYSIS CELL</b><p>This procedural cell has no stone-specific CANON authority. It inherits only the measured pyramid envelope. Promote it only after a mapped-stone evidence receipt exists.</p></div> : selected ? <>
                <div className="canonSummary"><div><span>SOURCE MAP</span><b>{canonBindings.length}</b></div><div><span>CONFLICTS</span><b>{canonConflicts.length}</b></div><div><span>EVIDENCE</span><b>{selectedEvidence.maturity}</b></div></div>
                <h3>SOURCE PRECEDENCE & WRITE AUTHORITY</h3>
                {canonSources.length ? canonSources.map(({ binding, source }) => source ? <div className="canonSource" key={`${selected.id}-${source.id}`}><div className="canonSourceHead"><a href={source.url} target="_blank" rel="noreferrer"><b>{source.title}</b></a><span>G{source.authority?.geometry ?? 0}</span></div><div className="canonTags"><i>{binding.role}</i><i>{binding.write_authority}</i><i>{source.resolution ?? 'UNSPECIFIED_RESOLUTION'}</i></div><p>{source.notes ?? source.kind}</p><small>Rights: {rightsBySource.get(source.id)?.rights_class ?? source.rights_class ?? 'CHECK SOURCE'} · Action: {rightsBySource.get(source.id)?.asset_action ?? source.asset_action}</small></div> : null) : <p className="empty">No CANON source mapping exists for this object.</p>}
                <h3>CONFLICTS / PRECEDENCE RULES</h3>
                {canonConflicts.length ? canonConflicts.map(conflict => <div className={`canonConflict severity-${conflict.severity.toLowerCase().replaceAll('_','-')}`} key={conflict.id}><div><b>{conflict.quantity}</b><span>{conflict.severity}</span></div><p>{conflict.canonical_rule}</p><small>{conflict.status} · {conflict.observations.length} recorded observations</small></div>) : <p className="empty">No explicit source conflict is registered for this object.</p>}
                {(selected.id === 'part.pyramid.khafre' || selected.id === 'part.casing.granite.lower') && <><h3>MATERIAL PRIORS</h3><div className="materialGuard"><b>{model.materialProperties.material_scope}</b><p>{model.materialProperties.model_warning}</p></div>{model.materialProperties.properties.map(prop => <div className="materialRow" key={prop.id}><span>{pretty(prop.quantity)}</span><b>{prop.mean ?? (prop.min !== undefined && prop.max !== undefined ? `${prop.min}–${prop.max}` : '—')} {prop.unit}</b></div>)}</>}
                <h3>DESKTOP ACQUISITION QUEUE</h3>
                {model.acquisitionBacklog.slice(0, 4).map(item => <div className="acquisitionRow" key={item.id}><span>{item.priority}</span><div><b>{item.goal}</b><small>{item.expected_gain} · {item.size_risk}</small></div></div>)}
              </> : <p className="empty">Select an object to inspect CANON authority.</p>}
            </div>
          )}

          {blockedScope&&<UnavailableDataset diagnostics={model.runtimeDiagnostics} scope={blockedScope}/>}
          {tab === 'FIELD' && !blockedScope && (
            <div className="fieldPanel">
              {selectedStone ? <div className="fieldWarning"><b>FORGE CELL · NOT FIELD-MAPPED</b><p>This analysis cell has no independent world coordinate, camera observation, or mapped-stone receipt. FIELD cannot promote it until spatial evidence replaces the procedural cell.</p></div> : selected ? <>
                <div className="fieldSummary"><div><span>GEO FRAME</span><b>{model.field.geospatialFrame.local_frame.status}</b></div><div><span>UNCERTAINTY</span><b>{selectedUncertainty?.status ?? 'UNRESOLVED'}</b></div><div><span>PHOTO VIEWS</span><b>{selectedFieldPhotos.nodes.length}</b></div><div><span>PROMOTION</span><b>{selectedPromotion?.current ?? selectedEvidence.maturity}</b></div></div>
                <h3>WORLD REGISTRATION</h3>
                <div className="fieldGeoCard"><div><span>WGS84 anchor</span><b>{model.field.geospatialFrame.reference_anchor.latitude_deg.toFixed(6)}°, {model.field.geospatialFrame.reference_anchor.longitude_deg.toFixed(6)}°</b></div><div><span>Horizontal status</span><b>{model.field.geospatialFrame.reference_anchor.status}</b></div><div><span>Vertical datum</span><b>{model.field.geospatialFrame.reference_anchor.vertical_datum}</b></div><div><span>Survey tie</span><b>{typeof surveyTie==='string'?surveyTie:`${surveyTie.status} · ${surveyTie.application}`}</b></div><p>{model.field.geospatialFrame.transform.precision_rule}</p></div>
                <h3>3-D UNCERTAINTY</h3>
                {selectedUncertainty ? <div className="uncertaintyCard"><b>{selectedUncertainty.maturity} · {selectedUncertainty.status}</b><p>{selectedUncertainty.render_envelope.meaning}</p>{selectedUncertainty.parameters.map(param => <div className="fieldMetric" key={`${selected.id}-${param.quantity}`}><span>{pretty(param.quantity)}</span><b>{param.value} ± {param.uncertainty} {param.unit}</b></div>)}</div> : <p className="empty">No explicit numeric uncertainty is registered. FIELD does not interpret missing uncertainty as zero.</p>}
                <h3>PHOTO / VIEW GRAPH</h3>
                {selectedFieldPhotos.nodes.length ? selectedFieldPhotos.nodes.map(node => <div className="fieldPhotoNode" key={node.id}><div><b>{node.title}</b><span>{node.view_class}</span></div><i>{node.calibration_status}</i></div>) : <p className="empty">No FIELD photo node currently sees this object.</p>}
                {selectedFieldPhotos.edges.length ? <div className="fieldEdges">{selectedFieldPhotos.edges.map((edge, i) => <span key={`${edge.a}-${edge.b}-${i}`}>{edge.relation} · {edge.overlap_status}</span>)}</div> : null}
                <h3>PROMOTION / MISSING OBSERVATIONS</h3>
                {selectedPromotion ? <div className="promotionCard"><div><span>Current</span><b>{selectedPromotion.current}</b></div><div><span>Target</span><b>{selectedPromotion.target}</b></div><div><span>Status</span><b>{selectedPromotion.status}</b></div>{selectedPromotion.blockers.map((blocker, i) => <p key={i}>□ {blocker}</p>)}</div> : <p className="empty">No explicit promotion path is registered for this object yet.</p>}
                <h3>TERRAIN REALITY BINDING</h3>
                <div className="terrainStatus"><b>{model.field.terrainRegistry.render_status}</b><p>{model.field.terrainRegistry.fallback}</p></div>
                {model.field.terrainRegistry.layers.map(layer => <div className="terrainRow" key={layer.id}><span>{layer.id}</span><b>{Array.isArray(layer.native_resolution_m) ? layer.native_resolution_m.join('/') : layer.native_resolution_m} m · {layer.field_status}</b></div>)}
                <h3>NEXT FIELD ACQUISITION</h3>
                {(selectedAcquisition.length ? selectedAcquisition : model.field.acquisitionCatalog.targets.slice(0, 3)).map(item => <div className="fieldAcq" key={item.id}><span>{item.priority}</span><div><b>{item.goal}</b><small>{item.status}</small>{item.requirements.slice(0, 3).map((r, i) => <p key={i}>□ {r}</p>)}</div></div>)}
              </> : <p className="empty">Select an object to inspect FIELD registration and promotion state.</p>}
            </div>
          )}


          {tab === 'FINDINGS' && !blockedScope && (
            <div className="findingsPanel">
              <div className="findingsHero"><div><span>PERSISTENT RESEARCH MEMORY</span><b>{model.findings.entries.length}</b><small>tracked findings</small></div><p>Interesting patterns and model consequences live here so they survive chat, provider, and model changes. Every entry carries controls, a truth guard, and the next discriminating test.</p></div>
              <div className="findingsLegend"><span>PATTERN WATCH</span><span>MODEL CONSEQUENCE</span><span>RESEARCH PRIORITY</span></div>
              {model.findings.entries.map(item => <article className={`findingCard finding-${item.status.toLowerCase().replaceAll('_','-')}`} key={item.id}>
                <header><div><span>{item.domain}</span><h3>{item.title}</h3></div><b>{item.status.replaceAll('_',' ')}</b></header>
                <p>{item.summary}</p>
                <div className="findingWhy"><strong>WHY IT MATTERS</strong><p>{item.why_interesting}</p></div>
                <div className="findingMeta"><span>Priority <b>{item.priority}</b></span><span>Truth <b>{item.truth_class}</b></span><span>Updated <b>v{item.updated_version??item.last_updated_version}</b></span></div>
                <details><summary>Controls, next test & guard</summary><p><b>Controls:</b> {item.controls.join(' · ')}</p><p><b>Next:</b> {item.next_test}</p><p><b>Guard:</b> {item.guard}</p></details>
              </article>)}
              <div className="findingsFooter"><b>REGISTRY RULE</b><p>{model.findings.purpose}</p><small>Last reviewed with software v{model.findings.last_reviewed_version}</small></div>
            </div>
          )}

          {tab === 'SIMULATION' && !blockedScope && (
            <div className="simulationPanel echoPanel">
              <div className="simGuard"><b>PREDICTION · NOT OBSERVATION</b><p>{model.simlab.manifest.truth_invariant}</p></div>

              <div className="simSolverSwitch" role="group" aria-label="Simulation solver">
                <button className={activeSimulation === 'ACOUSTICS' ? 'active' : ''} onClick={() => setActiveSimulation('ACOUSTICS')}>
                  <span>ECHO</span><b>ACOUSTICS</b><small>Modes · pressure · controls</small>
                </button>
                <button className={activeSimulation === 'GRAVITY' ? 'active' : ''} onClick={() => setActiveSimulation('GRAVITY')}>
                  <span>FIELD</span><b>GRAVITY</b><small>Density contrast · µGal</small>
                </button>
                <button className={activeSimulation === 'STRATA' ? 'active' : ''} onClick={() => setActiveSimulation('STRATA')}>
                  <span>EARTH</span><b>STRATA</b><small>Stress · head · plausibility</small>
                </button>
              </div>

              {activeSimulation === 'ACOUSTICS' ? <>
                <div className="echoHero">
                  <div className="echoFrequency"><span>ACTIVE MODE</span><b>{acoustic.selected_visualization.frequency_hz.toFixed(2)} <i>Hz</i></b><small>Burial chamber · mode ({acoustic.selected_visualization.mode.join(',')})</small></div>
                  <div className="echoPlain"><span>WHAT DOES THIS MEAN?</span><p>At this modeled frequency, air pressure would form a standing-wave pattern inside the burial-chamber envelope. Orange and blue are opposite pressure phases; the dim middle region is a pressure node.</p></div>
                </div>

                <div className="simSummary echoSummary">
                  <div><span>BURIAL FUNDAMENTAL</span><b>{acoustic.human_summary.burial_fundamental_hz.toFixed(2)} Hz</b></div>
                  <div><span>LOWER CHAMBER</span><b>{acoustic.human_summary.lower_fundamental_hz?.toFixed(2) ?? '—'} Hz</b></div>
                  <div><span>SOUND SPEED</span><b>{acoustic.atmosphere.sound_speed_m_s.toFixed(2)} m/s</b></div>
                  <div><span>BENCHMARK</span><b>{model.simlab.acousticBenchmark.pass ? 'PASS' : 'FAIL'}</b></div>
                </div>

                <div className="echoExplain">
                  <b>FIRST-PASS RESULT</b>
                  <p>{acoustic.human_summary.first_pass_interpretation}</p>
                </div>

                <AcousticSpectrum points={acoustic.response.points} activeHz={acoustic.selected_visualization.frequency_hz} />

                <h3>RESPONSE PEAKS</h3>
                <div className="echoPeakStrip">
                  {acoustic.response.peaks.slice(0, 8).map(peak => <div key={peak.frequency_hz}><b>{peak.frequency_hz.toFixed(2)}</b><span>Hz</span></div>)}
                </div>
                {strongestAcousticPeak ? <p className="echoFootnote">Strongest screening-response peak: <b>{strongestAcousticPeak.frequency_hz.toFixed(2)} Hz</b>. This summed Lorentzian response is a comparison aid, not a measured transfer function.</p> : null}

                <h3>PATTERN WATCH</h3>
                <div className="patternWatch">
                  <div className="patternHeadline"><span>{acoustic.coincidence_screen.actual_cluster_count}</span><b>near-coincidence clusters</b></div>
                  <p>The measured/derived geometry lands near the <b>{independentPercentile.toFixed(0)}th percentile</b> of the simple independent ±5% perturbation null, but only the <b>{constrainedPercentile.toFixed(0)}th percentile</b> when repeated construction relationships are preserved.</p>
                  <strong>Interesting screening signal — NOT evidence of deliberate acoustic tuning.</strong>
                  <small>{acoustic.coincidence_screen.interpretation}</small>
                </div>

                <h3>WHY WE ARE CAUTIOUS</h3>
                <div className="simAssumptions echoAssumptions">
                  <p><b>Rigid-wall screening:</b> {acoustic.boundary_model.warning}</p>
                  <p><b>Loss model:</b> {acoustic.loss_model.warning}</p>
                  <p><b>Atmosphere:</b> {acoustic.atmosphere.temperature_c}°C dry-air approximation; humidity and pressure are unresolved.</p>
                  <p><b>Design claim:</b> {acoustic.human_summary.design_claim_status.replaceAll('_',' ')}</p>
                </div>

                <h3>WHAT WOULD MAKE THIS STRONGER?</h3>
                <div className="echoNext">
                  <p>□ better lower-chamber height constraint</p>
                  <p>□ gabled-roof geometry in the acoustic mesh</p>
                  <p>□ measured absorption / reverberation data</p>
                  <p>□ FEM convergence against the analytical screen</p>
                  <p>□ real in-situ impulse-response measurements</p>
                </div>

                <label className="simToggle echoToggle"><input type="checkbox" checked={layers.simulation} onChange={() => toggleLayer('simulation')} /><i />Show standing-wave field in 3-D</label>
                <div className="echoLegend"><span><i className="phaseNeg"/>Negative phase</span><span><i className="phaseNode"/>Node</span><span><i className="phasePos"/>Positive phase</span></div>
              </> : activeSimulation === 'STRATA' ? <>
                <div className="strataHero">
                  <div><span>648 m OVERBURDEN PROXY</span><b>{model.simlab.strata.geomechanics.shaft_bottom.vertical_overburden_proxy_mpa.toFixed(2)} <i>MPa</i></b><small>conditional shaft-bottom depth</small></div>
                  <div><span>IF WATER-CONNECTED</span><b>{model.simlab.strata.hydraulics.shaft_bottom.hypothetical_freshwater_pressure_mpa.toFixed(2)} <i>MPa</i></b><small>static fresh-water pressure · not observed</small></div>
                </div>
                <div className="simGuard strataGuard"><b>SCREENING · NOT A STABILITY VERDICT</b><p>{model.simlab.strata.interpretation_guard}</p></div>
                <div className="simSummary">
                  <div><span>720 m LOAD PROXY</span><b>{model.simlab.strata.geomechanics.terminal_center.vertical_overburden_proxy_mpa.toFixed(2)} MPa</b></div>
                  <div><span>SAMPLE UCS PRIOR</span><b>{model.simlab.strata.material_prior.ucs_mpa.min.toFixed(1)}–{model.simlab.strata.material_prior.ucs_mpa.max.toFixed(1)} MPa</b></div>
                  <div><span>720 m WATER HEAD</span><b>{model.simlab.strata.hydraulics.terminal_center.hypothetical_freshwater_pressure_mpa.toFixed(2)} MPa</b></div>
                  <div><span>BENCHMARK</span><b>{model.simlab.strataBenchmark.pass ? 'PASS' : 'FAIL'}</b></div>
                </div>
                <h3>WHAT THIS TELLS US</h3>
                <div className="strataExplain"><p>{String(model.simlab.strata.human_summary.headline)}</p><strong>Rock-mass stability: {String(model.simlab.strata.human_summary.stability_status).replaceAll('_',' ')}</strong></div>
                <h3>MECHANICAL SCREEN</h3>
                <div className="simControls">
                  <div><span>648 m proxy / weak UCS</span><b>{model.simlab.strata.geomechanics.shaft_bottom.proxy_to_ucs_ratio.worst_case.toFixed(2)}×</b></div>
                  <div><span>648 m proxy / strong UCS</span><b>{model.simlab.strata.geomechanics.shaft_bottom.proxy_to_ucs_ratio.best_case.toFixed(2)}×</b></div>
                  <div><span>720 m proxy / weak UCS</span><b>{model.simlab.strata.geomechanics.terminal_center.proxy_to_ucs_ratio.worst_case.toFixed(2)}×</b></div>
                  <div><span>Known lower chamber</span><b>{model.simlab.strata.geomechanics.known_lower_chamber_reference.vertical_overburden_proxy_mpa.toFixed(2)} MPa</b></div>
                  <p>These ratios are deliberately not called factors of safety. The solver has no rock-mass discontinuity model yet.</p>
                </div>
                <h3>HYDRAULIC GATE</h3>
                <div className="strataGate"><b>FLOW RATE: UNRESOLVED</b><p>{model.simlab.strata.hydraulics.warning}</p><small>Required next: groundwater level · permeability · fractures/connectivity · recharge/discharge boundaries.</small></div>
                <h3>RUN RECEIPT</h3>
                <div className="simReceipt">
                  <div><span>Run</span><b>{model.simlab.strata.run_id}</b></div>
                  <div><span>Geometry</span><b>{model.simlab.strata.geometry_revision} · {model.simlab.strata.geometry_hash.slice(0,12)}…</b></div>
                  <div><span>Input hash</span><b>{model.simlab.strata.input_hash.slice(0,12)}…</b></div>
                  <div><span>Field samples</span><b>{model.simlab.strata.field_points.length}</b></div>
                </div>
                <label className="simToggle strataToggle"><input type="checkbox" checked={layers.simulation} onChange={() => toggleLayer('simulation')} /><i />Show STRATA depth field in 3-D</label>
              </> : <>
                <div className="simSummary">
                  <div><span>ACTIVE SOLVER</span><b>GRAVITY</b></div>
                  <div><span>STATUS</span><b>{model.simlab.gravity.status}</b></div>
                  <div><span>BENCHMARK</span><b>{model.simlab.gravityBenchmark.pass ? 'PASS' : 'FAIL'}</b></div>
                  <div><span>PEAK</span><b>{model.simlab.gravity.summary.max_magnitude_microgal.toFixed(2)} µGal</b></div>
                </div>
                <h3>RUN RECEIPT</h3>
                <div className="simReceipt">
                  <div><span>Run</span><b>{model.simlab.gravity.run_id}</b></div>
                  <div><span>Geometry</span><b>{model.simlab.gravity.geometry_revision} · {model.simlab.gravity.geometry_hash.slice(0,12)}…</b></div>
                  <div><span>Input hash</span><b>{model.simlab.gravity.input_hash.slice(0,12)}…</b></div>
                  <div><span>Stations</span><b>{model.simlab.gravity.observation_count}</b></div>
                  <div><span>Elements</span><b>{model.simlab.gravity.element_count}</b></div>
                  <div><span>Void volume</span><b>{Math.round(model.simlab.gravity.total_modeled_void_volume_m3).toLocaleString()} m³</b></div>
                </div>
                <h3>NULL / ABLATION CONTROLS</h3>
                {model.simlab.gravity.component_control_summary ? <div className="simControls">
                  <div><span>No void</span><b>{model.simlab.gravity.component_control_summary.no_void_peak_microgal.toFixed(1)} µGal</b></div>
                  <div><span>Shafts only</span><b>{model.simlab.gravity.component_control_summary.shafts_only_peak_microgal.toFixed(1)} µGal</b></div>
                  <div><span>Terminals only</span><b>{model.simlab.gravity.component_control_summary.terminals_only_peak_microgal.toFixed(1)} µGal</b></div>
                  <div><span>Combined</span><b>{model.simlab.gravity.component_control_summary.combined_peak_microgal.toFixed(1)} µGal</b></div>
                  <p>{model.simlab.gravity.component_control_summary.note}</p>
                </div> : null}
                <h3>MODEL ASSUMPTIONS</h3>
                <div className="simAssumptions"><p>Density contrast: {String(model.simlab.gravity.parameters.density_contrast_kg_m3)} kg/m³</p><p>Integration: {String(model.simlab.gravity.parameters.integration_method)}</p><p>{model.simlab.gravity.interpretation_guard}</p></div>
                <label className="simToggle"><input type="checkbox" checked={layers.simulation} onChange={() => toggleLayer('simulation')} /><i />Show gravity field in 3-D</label>
              </>}
            </div>
          )}
        </div>

        <div className="inspectorActions"><button disabled={!selectedId} onClick={()=>selectedId&&onOpenDetail(selectedId,'ROOM')}>▣ View in Context</button><button disabled={!selectedId} onClick={()=>selectedId&&onOpenDetail(selectedId,'OBJECT')}>◉ Isolate</button><button onClick={()=>setTab('SPECS')}>⌖ Measurements</button></div>
      </section>

      <section className="panelCard relatedCard">
        <div className="sectionLabel">RELATED COMPONENTS <span>{related.length}</span></div>
        <div className="relatedStrip">
          {related.length ? related.map(p => {
            const ph = model.photos.find(x => x.bind.includes(p.id));
            return <button key={p.id} onClick={() => onOpenDetail(p.id,'OBJECT')}><div className="relatedThumb">{ph && layers.photos ? <img src={ph.image_url} alt="" /> : <span>3D</span>}</div><b>{p.name}</b></button>;
          }) : <span className="empty">No siblings in this assembly.</span>}
        </div>
      </section>

      <section className="panelCard analysisCard">
        <div className="sectionLabel">ANIMATION & ANALYSIS</div>
        <label><span>Overview camera speed</span><input aria-label="Overview camera speed" type="range" min="0.25" max="2" step="0.25" value={animationSpeed} onChange={e => setAnimationSpeed(Number(e.target.value))} /><b>{animationSpeed.toFixed(2)}x</b></label>
        <div className="analysisToggles">
          <label><input type="checkbox" checked={showLabels} onChange={e => setShowLabels(e.target.checked)} /><i />Show Labels</label>
          <label><input type="checkbox" checked={showDimensions} onChange={e => setShowDimensions(e.target.checked)} /><i />Show Dimensions</label>
          <label><input type="checkbox" checked={layers.photos} onChange={() => toggleLayer('photos')} /><i />Show Photos</label>
        </div>
      </section>
    </aside>
  );
}
