import {useEffect,useRef,useState} from 'react';
import {requestNavigation,useResearchDraft} from '../workstation/navigationGuard';
import {EPIGRAPHY_REFERENCES,INSCRIPTION,INSCRIPTION_IMAGES} from './catalog';
import {SIGN_PALETTE} from './signs';
import {aiReviewPacket,newRegion,parseNotebook,updateReading,type Notebook,type Region} from './model';
import {SourceViewer} from './SourceViewer';
import {ReadingBoard} from './ReadingBoard';
import {RestorationStudio} from './RestorationStudio';
import {StoryPanel} from './StoryPanel';
import {ArtifactOverview} from './ArtifactOverview';
import {loadNotebook,saveNotebook,MAX_NOTEBOOK_BYTES} from './storage';
import './epigraphy.css';

const storageKey='giza.epigraphy.dream-stela.v1';
const parse=(value:unknown)=>parseNotebook(value,INSCRIPTION_IMAGES.map(i=>i.id),SIGN_PALETTE.map(s=>s.code));
function browserStorage(){try{return window.localStorage;}catch{return undefined;}}
function load(){return loadNotebook(browserStorage(),storageKey,parse);}
function download(name:string,value:unknown){const url=URL.createObjectURL(new Blob([JSON.stringify(value)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function downloadRaw(raw:string){const url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='giza-preserved-stored-notebook.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

export default function InscriptionLab({onClose,onModel}:{onClose:()=>void;onModel?:()=>void}){
  const dialog=useRef<HTMLDialogElement>(null),upload=useRef<HTMLInputElement>(null),dirty=useRef(false);
  const [initial]=useState(load),[notebook,setNotebook]=useState<Notebook>(initial.notebook),[notice,setNotice]=useState(initial.message);
  const currentNotebook=useRef(notebook);
  const baseline=useRef(initial.baseline);
  const rawSnapshot=useRef(initial.raw);
  const [saveIssue,setSaveIssue]=useState(initial.state==='ready'?'':initial.message),[unsaved,setUnsaved]=useState(false);
  useResearchDraft(unsaved);
  const [imageId,setImageId]=useState<string>(INSCRIPTION_IMAGES[0].id),[selectedId,setSelectedId]=useState<string|null>(null);
  const [removed,setRemoved]=useState<Region|null>(null);
  const [workspace,setWorkspace]=useState<'OVERVIEW'|'READ'|'RESTORE'|'STORY'>('OVERVIEW');
  const source=INSCRIPTION_IMAGES.find(i=>i.id===imageId)!,regions=notebook.regions.filter(r=>r.imageId===imageId),selected=regions.find(r=>r.id===selectedId);
  useEffect(()=>{dialog.current?.showModal();},[]);
  useEffect(()=>{if(!dirty.current)return;const saved=saveNotebook(browserStorage(),storageKey,baseline.current,notebook);if(saved.ok){baseline.current=saved.baseline;dirty.current=false;setUnsaved(false);setSaveIssue('');setNotice('Saved on this browser · export a notebook to back up your work.');}else{setSaveIssue(saved.message);setNotice(saved.message);}},[notebook]);
  useEffect(()=>{const changed=(event:StorageEvent)=>{if((event.key===storageKey||event.key===null)&&event.storageArea===browserStorage()&&event.newValue!==baseline.current)setSaveIssue('The stored notebook changed in another tab. Saving is paused to protect both copies. Export your draft, then load the stored copy.');};window.addEventListener('storage',changed);return()=>{window.removeEventListener('storage',changed);};},[]);
  const change=(next:Notebook)=>{if(new TextEncoder().encode(JSON.stringify(next)).byteLength>MAX_NOTEBOOK_BYTES){setNotice('Edit not applied: the notebook reached its 2 MB data limit. Export a backup, then remove unneeded zones or strokes.');return false;}dirty.current=true;currentNotebook.current=next;setUnsaved(true);setNotebook(next);return true;};
  const requestExit=(action:()=>void,_label:string)=>requestNavigation(action);
  const reloadStored=()=>{const next=load();if(next.raw!==null)rawSnapshot.current=next.raw;if(next.state!=='ready'){setSaveIssue(next.message);return;}dirty.current=false;baseline.current=next.baseline;currentNotebook.current=next.notebook;setUnsaved(false);setNotebook(next.notebook);setSelectedId(null);setRemoved(null);setSaveIssue('');setNotice('Stored notebook loaded. No automatic merge or review promotion occurred.');};
  const exportDraft=()=>download('giza-dream-stela-notebook.json',{...notebook,sources:INSCRIPTION_IMAGES,exportedAt:new Date().toISOString(),authority:'OPERATOR_ANNOTATION_NOT_AUTHENTICATED',licenseNote:'Image credits and licenses travel with this notebook; image bytes are not embedded. Interpretive traces are separate annotations.'});
  const read=(id?:string)=>{if(id&&INSCRIPTION_IMAGES.some(i=>i.id===id)){setImageId(id);setSelectedId(notebook.regions.find(r=>r.imageId===id)?.id??null);}setWorkspace('READ');};
  const update=(region:Region)=>change({...notebook,regions:notebook.regions.map(r=>r.id===region.id?region:r)});
  const add=(rect:Region['rect'])=>{if(notebook.regions.length>=100){setNotice('Notebook limit: 100 zones. Export before starting another notebook.');return;}const r=newRegion(crypto.randomUUID(),imageId,rect,`Reading zone ${regions.length+1}`);if(change({...notebook,regions:[...notebook.regions,r]}))setSelectedId(r.id);};
  const importFile=async(file:File)=>{
    try{if(file.size>MAX_NOTEBOOK_BYTES+64_000)throw new Error('Import exceeds 2 MB of notebook data plus the bounded source-metadata allowance.');const imported=parse(JSON.parse(await file.text()));
      const latest=currentNotebook.current;
      if(latest.regions.length+imported.regions.length>100)throw new Error('Import would exceed 100 zones.');
      const added=imported.regions.map(r=>({...r,id:crypto.randomUUID(),status:'DRAFT' as const,reviewedAt:''}));
      if(change({...latest,regions:[...latest.regions,...added]})&&added[0]){setImageId(added[0].imageId);setSelectedId(added[0].id);}
    }catch(e){setNotice(`Import rejected without changing your notebook: ${String(e)}`);}
  };
  return <dialog ref={dialog} className="epigraphyLab" aria-labelledby="epigraphy-title" data-epigraphy onClose={onClose} onCancel={event=>{event.preventDefault();requestExit(onClose,'Leave without saving');}}>
    <header className="epiHeader"><div><small>GIZA NEXUS / HIEROGLYPHS · {unsaved?'UNSAVED DRAFT':'LOCAL RESEARCH'}</small><h1 id="epigraphy-title">From stone to meaning</h1><nav aria-label="Hieroglyph workspace"><button aria-pressed={workspace==='OVERVIEW'} onClick={()=>setWorkspace('OVERVIEW')}>Artifact overview</button><button aria-pressed={workspace==='READ'} onClick={()=>read()}>Inspect &amp; translate</button><button aria-pressed={workspace==='RESTORE'} onClick={()=>setWorkspace('RESTORE')}>Restoration hypotheses</button><button aria-pressed={workspace==='STORY'} onClick={()=>setWorkspace('STORY')}>Story &amp; sources</button></nav></div><button autoFocus onClick={()=>requestExit(onClose,'Leave without saving')}>Back to 3D · Esc</button></header>
    {saveIssue&&<section className="epiSaveWarning" role="alert"><p>{saveIssue}</p><button onClick={exportDraft}>Export current draft</button><button onClick={()=>requestExit(reloadStored,'Replace draft with stored copy')}>Load stored copy</button><button onClick={()=>{let raw=rawSnapshot.current,fallback=true;try{const latest=browserStorage()?.getItem(storageKey);if(latest!=null){raw=latest;fallback=false;}}catch{/* Retain the exact bytes from the last successful read. */}if(raw!==null){downloadRaw(raw);setNotice(fallback?'Recovery download started from the earlier retained snapshot, not the current stored copy.':'Stored-copy download started. Your working draft remains open.');}else setNotice('No stored bytes are available. Your working draft remains open.');}}>Back up stored bytes</button></section>}
    <div className={`epiLayout${workspace!=='READ'?' epiWideLayout':''}`}>
      {workspace==='OVERVIEW'?<ArtifactOverview zoneCount={notebook.regions.length} reviewedCount={notebook.regions.filter(r=>r.status==='HUMAN_REVIEWED').length} onRead={read} onRestore={()=>setWorkspace('RESTORE')} onStory={()=>setWorkspace('STORY')} onModel={onModel?()=>requestExit(onModel,'Leave without saving'):undefined}/>:<>
      <aside className="epiCatalog"><small>01 / EVIDENCE</small><h2>{INSCRIPTION.title}</h2><p>{INSCRIPTION.context}</p>
        <div className="epiSourceList">{INSCRIPTION_IMAGES.map(i=><button key={i.id} aria-pressed={imageId===i.id} onClick={()=>{setImageId(i.id);setSelectedId(notebook.regions.find(r=>r.imageId===i.id)?.id??null);}}><img src={i.image} alt=""/><span>{i.title}<small>{i.author} · {i.date}</small></span></button>)}</div>
        <h3>Reading zones <span>{regions.length}</span></h3><p className="epiMicro">Each zone belongs to its source image. Photograph and facsimile coordinates are never mixed.</p>
        <button onClick={()=>{add([.2,.35,.6,.15]);setWorkspace('READ');}}>Add centered zone</button>
        <div className="epiZoneList">{regions.map(r=><button key={r.id} aria-pressed={r.id===selectedId} onClick={()=>{setSelectedId(r.id);if(workspace==='STORY')setWorkspace('READ');}}>{r.label||'Unnamed zone'}<small>{r.status==='HUMAN_REVIEWED'?'Operator reviewed':'Draft'} · {r.signs.length} signs · {r.traces.length} traces</small></button>)}</div>
        {selected&&<button onClick={()=>{setRemoved(selected);change({...notebook,regions:notebook.regions.filter(r=>r.id!==selected.id)});setSelectedId(null);}}>Remove selected zone</button>}
        {removed&&<button disabled={notebook.regions.length>=100} onClick={()=>{change({...notebook,regions:[...notebook.regions,removed]});setImageId(removed.imageId);setSelectedId(removed.id);setRemoved(null);}}>Undo last removal</button>}
        <details><summary>Research links &amp; limits</summary><p>{INSCRIPTION.limitation}</p>{EPIGRAPHY_REFERENCES.map(r=><p key={r.url}><a href={r.url} target="_blank" rel="noreferrer">{r.title} ↗</a></p>)}<p>No inscription has been assigned a validated translation here. Missing signs remain unknown. Local annotations do not change the archaeological database.</p></details>
        <div className="epiNotebookActions"><button onClick={exportDraft}>Export notebook</button><button onClick={()=>upload.current?.click()}>Import notebook</button><input ref={upload} type="file" accept=".json,application/json" hidden onChange={e=>{const f=e.target.files?.[0];if(f)void importFile(f);e.target.value='';}}/><p className="epiMicro">Imports append as drafts; they never replace existing zones.</p><p role="status">{notice||'Saved locally as you work. Export a notebook for a portable backup.'}</p></div>
      </aside>
      {workspace==='RESTORE'?<RestorationStudio key={`${imageId}-${selectedId}`} source={source} selected={selected} onChange={update} onCreate={()=>add([.01,.01,.98,.98])} onDetail={()=>{setImageId('dream-detail');setSelectedId(notebook.regions.find(r=>r.imageId==='dream-detail')?.id??null);}}/>:workspace==='STORY'?<StoryPanel onRead={()=>setWorkspace('READ')}/>:<>
        <div className="epiEvidence"><div className="epiEvidenceTitle"><small>02 / INSPECT THE SOURCE</small><h2>{source.title}</h2></div><SourceViewer source={source} regions={regions} selected={selected} onSelect={setSelectedId} onRegion={add} onTrace={points=>{if(!selected)return;if(points.length&&selected.traces.length>=200){setNotice('Maximum 200 traces per zone.');return;}update(updateReading(selected,{traces:points.length?[...selected.traces,points]:selected.traces.slice(0,-1)}));}}/></div>
        {selected?<ReadingBoard key={selected.id} region={selected} onChange={update} onPacket={()=>download('giza-dream-stela-ai-review-packet.json',aiReviewPacket(selected,source))}/>:<section className="epiBoard epiEmpty"><small>03 / RECONSTRUCT &amp; READ</small><h2>Start with a visible mark</h2><p>Use <b>Mark zone</b> and drag across the source, or add a centered zone. The translation board opens for that region.</p><ol><li>Record visible marks and damage.</li><li>Trace contours without inventing missing strokes.</li><li>Propose signs and alternative readings.</li><li>Add a cited translation and human review.</li></ol><button onClick={()=>add([.2,.35,.6,.15])}>Create first reading zone</button><p className="epiMicro">A facsimile can suggest a reading, but it is not proof of what remains on the stone today.</p></section>}
      </>}
      </>}
    </div>
  </dialog>;
}
