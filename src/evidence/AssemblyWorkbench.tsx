import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import type {ModelBundle} from '../lib/model';
import {GIZA_BUILD,GIZA_DISPLAY_VERSION} from '../version';
import {ASSEMBLY_FRAME,BODY_FRAME,LID_FRAME,buildKhafreAssembly} from './assembly';
import type {CanonicalPoint,EvidenceFeature,RealityAuthority,Vec3} from './types';
import {buildEvidenceGraph} from './graph';
import {generateInvestigationCandidates} from './intelligence';
import {appendReceipt,graphWithReceipt,loadReceiptJournal,saveReceiptJournal,type EvidenceReceipt,type ReceiptContext} from './receipts';
import {exportCanonicalAssembly,invertRigid,pointInFrame,transformPoint} from './spatial';
import {featureAnchors} from './viewGeometry';
import {validateBookmark,type CameraBookmark} from './presentation';
import {AssemblyScene,type CameraCommand,type LegacyEnvelope} from './AssemblyScene';
import {FeaturePanel} from './FeaturePanel';
import {MeasurementTools,SectionTools,sectionPlane,type SectionState} from './SpatialTools';
import {ComparisonPanel} from './ComparisonPanel';
import {InvestigationPanel} from './InvestigationPanel';
import {downloadJson} from './export';
import './evidence.css';

type Panel='EVIDENCE'|'MEASURE'|'SECTION'|'COMPARE'|'INVESTIGATE'|'VIEWS';
const JOURNAL_KEY='giza.evidence-assembly.journal.v1';
export default function AssemblyWorkbench({model,initialPart,onClose,onLegacy}:{model:ModelBundle;initialPart:string;onClose:()=>void;onLegacy:()=>void}){
  const assembly=useMemo(()=>buildKhafreAssembly(model),[model]),baseGraph=useMemo(()=>buildEvidenceGraph(assembly),[assembly]);
  const candidates=useMemo(()=>generateInvestigationCandidates(assembly,baseGraph),[assembly,baseGraph]);
  const [selectedId,setSelectedId]=useState(()=>initialPart.includes('lid')?'feature.lid.envelope':initialPart.includes('chamber')?'feature.chamber.doorway':'feature.coffer.wall.west');
  const selected=assembly.features.find(f=>f.id===selectedId)??assembly.features[0];
  const [panel,setPanel]=useState<Panel|null>('EVIDENCE'),[room,setRoom]=useState(initialPart.includes('chamber')),[isolated,setIsolated]=useState<string|null>(null);
  const [layers,setLayers]=useState<Record<RealityAuthority,boolean>>({OBSERVED:true,RECONSTRUCTED:true,HYPOTHESIS:false});
  const [hotspots,setHotspots]=useState(false),[explode,setExplode]=useState(.6),[comparison,setComparison]=useState(false),[glLost,setGlLost]=useState(false),[canvasRevision,setCanvasRevision]=useState(0);
  const [camera,setCamera]=useState<CameraCommand>({revision:0,mode:initialPart.includes('chamber')?'ROOM':'OBJECT'}),[bookmarks,setBookmarks]=useState<CameraBookmark[]>([]);
  const [points,setPoints]=useState<CanonicalPoint[]>([]),[pickMode,setPickMode]=useState<'DISTANCE'|'ANGLE'>('DISTANCE'),[snap,setSnap]=useState(true),[measureFrame,setMeasureFrame]=useState(initialPart.includes('lid')?LID_FRAME:BODY_FRAME);
  const [section,setSection]=useState<SectionState>({enabled:false,axis:'Z',offset:-.3,azimuth:35,inclination:30,frameId:BODY_FRAME,caps:true});
  const [candidateId,setCandidateId]=useState<string|null>(null),[status,setStatus]=useState('Select a face to inspect its evidence.'),[journal,setJournal]=useState<readonly EvidenceReceipt[]>([]),[journalMessage,setJournalMessage]=useState('Loading research journal…'),[preservedRaw,setPreservedRaw]=useState<string|null>(null);
  const baseline=useRef<string|null|undefined>(undefined),writing=useRef(false);
  useEffect(()=>{let live=true;try{loadReceiptJournal(localStorage,JOURNAL_KEY,{assemblyId:assembly.id,frameId:assembly.authoritativeFrameId}).then(r=>{if(live){baseline.current=r.baseline;setJournal(r.receipts);setPreservedRaw(r.state==='UNREADABLE'?r.raw:null);setJournalMessage(r.message||'Append-only local journal. Export receipts for durable custody.');}});}catch(e){setJournalMessage(`Journal unavailable: ${String(e)}. Exports remain available.`);}return()=>{live=false;};},[assembly]);
  const graph=useMemo(()=>journal.reduce((g,r)=>graphWithReceipt(g,r),baseGraph),[baseGraph,journal]);
  const addReceipt=async(receipt:EvidenceReceipt)=>{
    if(writing.current)throw new Error('A journal write is already in progress');writing.current=true;
    try{const next=await appendReceipt(journal,receipt);const saved=await saveReceiptJournal(localStorage,JOURNAL_KEY,baseline.current,next);if(!saved.ok)throw new Error(`${saved.message} Download the sealed receipt before leaving.`);baseline.current=saved.baseline;setJournal(next);setJournalMessage('Append-only journal saved locally. Export receipts for durable custody.');}finally{writing.current=false;}
  };
  const receiptContext=():ReceiptContext=>({version:GIZA_DISPLAY_VERSION,commit:`${GIZA_BUILD.commit}${GIZA_BUILD.dirty?' + working changes':''}`,environment:`${navigator.userAgent}; build source SHA-256=${GIZA_BUILD.sourceSha256}; built=${GIZA_BUILD.builtAt}`,createdAt:new Date().toISOString()});
  const command=(mode:CameraCommand['mode'],bookmark?:CameraBookmark)=>setCamera(v=>({revision:v.revision+1,mode,bookmark}));
  const chooseFeature=(id:string)=>{const f=assembly.features.find(f=>f.id===id);if(!f)return;setSelectedId(id);if(!f.objectId.includes('sarcophagus'))setRoom(true);};
  const locate=(id:string)=>{chooseFeature(id);setPanel('EVIDENCE');setIsolated(null);const f=assembly.features.find(f=>f.id===id);if(f)setLayers(v=>({...v,[f.authority]:true}));command(f?.objectId.includes('sarcophagus')?'OBJECT':'ROOM');};
  const pick=(f:EvidenceFeature,p:CanonicalPoint)=>{
    setSelectedId(f.id);const at=pointInFrame(assembly,p,measureFrame);setStatus(`${f.label} · ${at?at.map(n=>n.toFixed(5)).join(', ')+' m':'UNKNOWN in measurement frame'}`);
    if(panel!=='MEASURE'){setPanel('EVIDENCE');return;}
    const anchors=featureAnchors(f),chosen=snap&&anchors.length?anchors.reduce((a,b)=>Math.hypot(...a.map((n,i)=>n-p.position[i]))<Math.hypot(...b.map((n,i)=>n-p.position[i]))?a:b):p.position;
    const point={...p,position:chosen};setPoints(v=>v.length>=(pickMode==='ANGLE'?3:2)?[point]:[...v,point]);
  };
  const onBookmark=useCallback((b:CameraBookmark)=>{setBookmarks(v=>[...v.slice(-11),validateBookmark({...b,name:`Bookmark ${v.length+1}`})]);setStatus('Camera bookmark captured for this session; physical geometry unchanged.');},[]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT|BUTTON/.test((e.target as HTMLElement)?.tagName))return;if(e.key==='Escape'){setPanel(null);return;}if(e.key.toLowerCase()==='f'){e.preventDefault();command(room?'ROOM':'OBJECT');}if(e.key.toLowerCase()==='m')setPanel('MEASURE');if(e.key.toLowerCase()==='c')setPanel('SECTION');if(e.key.toLowerCase()==='e')setExplode(v=>v?0:1.5);};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[room]);
  const legacy=useMemo<LegacyEnvelope|null>(()=>{const p=model.parts.find(p=>p.id==='part.sarcophagus.body'),adapter=assembly.transforms.find(t=>t.id==='comparison.assembly.legacy-floor');if(!p||p.spatial.primitive.kind!=='box'||!adapter?.matrix)return null;return {position:transformPoint(invertRigid(adapter.matrix),p.spatial.origin_m),size:[p.spatial.primitive.sx,p.spatial.primitive.sy,p.spatial.primitive.sz],rotation:p.spatial.rpy_rad};},[model,assembly]);
  const plane=useMemo(()=>sectionPlane(section),[section]);
  const names:Record<Panel,string>={EVIDENCE:'Feature evidence',MEASURE:'Spatial measurement',SECTION:'Section laboratory',COMPARE:'Source / model comparison',INVESTIGATE:'Investigation workspace',VIEWS:'View & assembly'};
  return <div className="evidenceWorkbench" data-evidence-workbench>
    <header className="evidenceHeader"><button onClick={onClose}>← Workstation</button><div><small>EVIDENCE ASSEMBLY / 01</small><h2>Sarcophagus · lid · burial chamber</h2></div><nav className="evidenceTools" aria-label="Spatial interrogation tools">{(['EVIDENCE','MEASURE','SECTION','COMPARE','INVESTIGATE','VIEWS'] as Panel[]).map(p=><button key={p} aria-pressed={panel===p} onClick={()=>setPanel(v=>v===p?null:p)}>{p==='EVIDENCE'?'Evidence':p==='MEASURE'?'Measure':p==='SECTION'?'Section':p==='COMPARE'?'Compare':p==='INVESTIGATE'?'Investigate':'Views'}</button>)}</nav></header>
    <div className={`evidenceStage${panel?' hasPanel':''}`}><section className="evidenceView" aria-label="Evidence Assembly 3-D viewport"><div className="evidenceViewbar"><button aria-pressed={room} onClick={()=>{setRoom(v=>!v);setIsolated(null);command(room?'OBJECT':'ROOM');}}>{room?'Isolate coffer assembly':'Show burial chamber'}</button><button onClick={()=>command(room?'ROOM':'OBJECT')}>Fit · F</button><button onClick={()=>command('TOP')}>Top</button><div className="evidenceLegend" aria-label="Reality layers">{(['OBSERVED','RECONSTRUCTED','HYPOTHESIS'] as RealityAuthority[]).map(layer=><label key={layer}><input type="checkbox" aria-label={`${layer} reality layer`} checked={layers[layer]} onChange={e=>setLayers(v=>({...v,[layer]:e.target.checked}))}/><i className={layer.toLowerCase()}/>{layer}</label>)}</div></div>
      <div className="evidenceCanvas"><AssemblyScene key={canvasRevision} assembly={assembly} selectedId={selected.id} layers={layers} room={room} isolated={isolated} explode={explode} plane={plane} caps={section.caps} hotspots={hotspots} points={points} camera={camera} onBookmark={onBookmark} onPick={pick} onLost={()=>setGlLost(true)} onRestored={()=>setGlLost(false)} comparison={comparison&&layers.HYPOTHESIS} legacy={legacy}/>{glLost&&<div className="evidenceWebglAlert" role="alert"><h3>Graphics context interrupted</h3><p>Evidence and measurements are retained.</p><button onClick={()=>{setCanvasRevision(v=>v+1);setGlLost(false);command(room?'ROOM':'OBJECT');}}>Recreate 3-D viewport</button></div>}</div>
      <div className="evidenceStatus" aria-live="polite"><span>{status}</span><span>m · X east / Y north / Z up · {panel==='MEASURE'?'Click to measure':'Drag rotate · wheel zoom · right-drag pan'}</span></div>
    </section><aside className="evidencePanel" hidden={!panel} aria-label={panel?names[panel]:'Contextual tools'}><header><h3>{panel?names[panel]:''}</h3><button aria-label="Close contextual panel" onClick={()=>setPanel(null)}>×</button></header>
      {panel==='EVIDENCE'&&<FeaturePanel assembly={assembly} graph={graph} feature={selected} onSelect={chooseFeature} layers={layers} model={model}/>}
      {panel==='MEASURE'&&<><label>Feature for precise anchors<select aria-label="Measurement feature" value={selected.id} onChange={e=>chooseFeature(e.target.value)}>{assembly.features.filter(f=>f.geometry.kind!=='unknown').map(f=><option key={f.id} value={f.id}>{f.label}</option>)}</select></label><MeasurementTools assembly={assembly} feature={selected} points={points} onPoints={setPoints} mode={pickMode} onMode={setPickMode} frame={measureFrame} onFrame={setMeasureFrame} snap={snap} onSnap={setSnap}/></>}
      {panel==='SECTION'&&<SectionTools assembly={assembly} state={section} onChange={setSection}/>}
      {panel==='COMPARE'&&<ComparisonPanel assembly={assembly} overlay={comparison} onOverlay={v=>{setComparison(v);if(v)setLayers(s=>({...s,HYPOTHESIS:true}));}}/>}
      <div hidden={panel!=='INVESTIGATE'}>{preservedRaw!==null&&<button onClick={()=>downloadJson('GIZA-preserved-unreadable-journal.txt',preservedRaw)}>Export preserved stored bytes</button>}<InvestigationPanel assembly={assembly} graph={baseGraph} candidates={candidates} selected={candidateId} feature={selected} onCandidate={setCandidateId} onLocate={locate} context={receiptContext} journal={journal} onAppend={addReceipt} journalMessage={journalMessage}/></div>
      {panel==='VIEWS'&&<>
        <h4>Reversible inspection pose</h4><p>The detached lid is parked beside the coffer for inspection. Its physical chamber pose is UNKNOWN. Zero restores the inspection stand, not a historical closure.</p><label>Lid separation · {explode.toFixed(2)} m<input aria-label="Lid inspection separation" type="range" min="0" max="3" step=".01" value={explode} onChange={e=>setExplode(Number(e.target.value))}/></label><div className="actions"><button onClick={()=>setExplode(0)}>Restore inspection pose</button><button aria-pressed={isolated===selected.objectId} onClick={()=>setIsolated(v=>v?null:selected.objectId)}>{isolated?'Show assembly':'Isolate selected object'}</button></div><label><input type="checkbox" checked={hotspots} onChange={e=>setHotspots(e.target.checked)}/>Source observation callouts</label><p>Observation callouts occupy reconstructed reference lines; they are not surveyed endpoints.</p>
        <h4>Camera bookmarks</h4><button onClick={()=>command('SAVE')}>Save current camera</button><div className="actions">{bookmarks.map((b,i)=><button key={i} onClick={()=>command('BOOKMARK',b)}>{b.name}</button>)}</div><p>Session bookmarks are display state only.</p>
        <h4>Explicit coordinate hierarchy</h4>{assembly.transforms.map(t=><details key={t.id}><summary>{t.status} · {t.scope==='COMPARISON_ONLY'?'COMPARISON ONLY':t.id.replace('transform.','')}</summary><code>{t.from} → {t.to}</code><p>{t.derivation}</p><small>Uncertainty UNKNOWN</small></details>)}
        <h4>Machine-readable exports</h4><div className="actions"><button onClick={()=>downloadJson('GIZA-khafre-evidence-assembly.json',exportCanonicalAssembly(assembly))}>Export physical contract</button><button onClick={()=>downloadJson('GIZA-spatial-evidence-graph.json',graph)}>Export evidence graph</button></div><p>Includes units, axes, datums, unknowns and evidence. No selection, camera or inspection transforms enter the physical export.</p><button onClick={onLegacy}>Open preserved component viewer</button>
      </>}
    </aside></div>
    <footer className="evidenceTruth"><strong>RECONSTRUCTION ≠ OBSERVATION</strong><span>Source-reported dimensions · idealized surfaces · lid placement, survey uncertainty and site transform UNKNOWN. No new metric registration or archaeological finding is asserted.</span></footer>
  </div>;
}
