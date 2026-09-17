import {useEffect,useId,useLayoutEffect,useRef,useState,type KeyboardEvent,type PointerEvent} from 'react';
import type {INSCRIPTION_IMAGES} from './catalog';
import {normalizedRect,type Point,type Region} from './model';
import {fitZoneToViewport} from './navigation';
type Source=typeof INSCRIPTION_IMAGES[number];
const path=(points:Point[])=>points.map((p,i)=>`${i?'L':'M'}${p[0]*1000},${p[1]*1000}`).join(' ');
export function SourceViewer({source,regions,selected,onSelect,onRegion,onTrace}:{
  source:Source;regions:Region[];selected:Region|undefined;onSelect:(id:string)=>void;
  onRegion:(rect:Region['rect'])=>void;onTrace:(points:Point[])=>void;
}){
  const [zoom,setZoom]=useState(100),[contrast,setContrast]=useState(100),[gray,setGray]=useState(false),[overlays,setOverlays]=useState(true);
  const [mode,setMode]=useState<'VIEW'|'REGION'|'TRACE'>('VIEW'),[draft,setDraft]=useState<Point[]>([]),[error,setError]=useState(false),[loaded,setLoaded]=useState(false);
  const stroke=useRef<Point[]>([]),pointer=useRef<number|null>(null),scroll=useRef<HTMLDivElement>(null);
  const pan=useRef<{id:number;x:number;y:number;left:number;top:number;moved:boolean}|null>(null),suppressZoneClick=useRef(false);
  const [panning,setPanning]=useState(false),[pendingFit,setPendingFit]=useState<Region['rect']|null>(null);
  const helpId=useId();
  const [fitWidth,setFitWidth]=useState(300);
  useEffect(()=>{const el=scroll.current;if(!el)return;const resize=()=>setFitWidth(Math.max(1,Math.min(el.clientWidth,el.clientHeight*source.width/source.height)));const observer=new ResizeObserver(resize);observer.observe(el);resize();return()=>observer.disconnect();},[source.id]);
  useEffect(()=>{setZoom(100);setContrast(100);setGray(false);setError(false);setLoaded(false);setMode('VIEW');setDraft([]);setPendingFit(null);setPanning(false);stroke.current=[];pointer.current=null;pan.current=null;suppressZoneClick.current=false;scroll.current?.scrollTo(0,0);},[source.id]);
  useLayoutEffect(()=>{
    const el=scroll.current;if(!el||!pendingFit||!loaded||error)return;
    const fit=fitZoneToViewport(pendingFit,source,{width:el.clientWidth,height:el.clientHeight});
    setZoom(fit.zoom);setFitWidth(fit.baseWidth);
    const frame=requestAnimationFrame(()=>{el.scrollTo({left:fit.scrollLeft,top:fit.scrollTop,behavior:'instant'});setPendingFit(null);});
    return()=>cancelAnimationFrame(frame);
  },[pendingFit,loaded,error,zoom,fitWidth,source]);
  const changeMode=(next:typeof mode)=>{setMode(next);setDraft([]);stroke.current=[];pointer.current=null;pan.current=null;setPanning(false);};
  const startPan=(e:PointerEvent<HTMLDivElement>)=>{
    if(mode!=='VIEW'||e.button!==0||!loaded||error||pan.current)return;
    suppressZoneClick.current=false;e.currentTarget.focus({preventScroll:true});
    pan.current={id:e.pointerId,x:e.clientX,y:e.clientY,left:e.currentTarget.scrollLeft,top:e.currentTarget.scrollTop,moved:false};
  };
  const movePan=(e:PointerEvent<HTMLDivElement>)=>{
    const current=pan.current;if(!current||current.id!==e.pointerId)return;
    const dx=e.clientX-current.x,dy=e.clientY-current.y;
    if(!current.moved&&Math.hypot(dx,dy)<5)return;
    if(!current.moved){current.moved=true;e.currentTarget.setPointerCapture(e.pointerId);setPanning(true);}
    e.preventDefault();suppressZoneClick.current=true;e.currentTarget.scrollLeft=current.left-dx;e.currentTarget.scrollTop=current.top-dy;
  };
  const endPan=(e:PointerEvent<HTMLDivElement>)=>{
    if(pan.current?.id!==e.pointerId)return;
    suppressZoneClick.current=pan.current.moved;pan.current=null;setPanning(false);
    if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const keyPan=(e:KeyboardEvent<HTMLDivElement>)=>{
    if(e.target!==e.currentTarget||e.altKey||e.ctrlKey||e.metaKey)return;
    const step=e.shiftKey?120:40,delta:Record<string,[number,number]>={ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,-step],ArrowDown:[0,step],PageUp:[0,-e.currentTarget.clientHeight*.85],PageDown:[0,e.currentTarget.clientHeight*.85]};
    if(delta[e.key]){e.preventDefault();e.currentTarget.scrollBy({left:delta[e.key][0],top:delta[e.key][1],behavior:'instant'});}
    else if(e.key==='Home'||e.key==='End'){e.preventDefault();e.currentTarget.scrollTo({left:e.key==='Home'?0:e.currentTarget.scrollWidth,top:e.key==='Home'?0:e.currentTarget.scrollHeight,behavior:'instant'});}
  };
  const point=(e:PointerEvent<SVGSVGElement>):Point=>{const b=e.currentTarget.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-b.left)/b.width)),Math.max(0,Math.min(1,(e.clientY-b.top)/b.height))];};
  const start=(e:PointerEvent<SVGSVGElement>)=>{
    if(mode==='VIEW'||e.button!==0||!loaded||error||pointer.current!==null)return;
    if(mode==='TRACE'&&!selected)return;
    e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);pointer.current=e.pointerId;stroke.current=[point(e)];setDraft(stroke.current);
  };
  const move=(e:PointerEvent<SVGSVGElement>)=>{
    if(pointer.current!==e.pointerId)return;
    const p=point(e);stroke.current=mode==='REGION'?[stroke.current[0],p]:[...stroke.current.slice(0,998),p];setDraft(stroke.current);
  };
  const end=(e:PointerEvent<SVGSVGElement>)=>{
    if(pointer.current!==e.pointerId)return;
    const points=[...stroke.current,point(e)];pointer.current=null;stroke.current=[];setDraft([]);
    if(mode==='REGION'){const rect=normalizedRect(points[0],points[points.length-1]);if(rect[2]>.005&&rect[3]>.005){onRegion(rect);setMode('VIEW');}}
    else if(points.length>1)onTrace(points.slice(0,1000));
  };
  const rect=draft.length?normalizedRect(draft[0],draft[draft.length-1]):null;
  return <section className="epiSource" aria-label="Inscription source viewer">
    <div className="epiSourceTools"><button aria-pressed={mode==='VIEW'} onClick={()=>changeMode('VIEW')}>Navigate</button><button disabled={!loaded||error} aria-pressed={mode==='REGION'} onClick={()=>changeMode('REGION')}>Mark zone</button><button disabled={!selected||!loaded||error} aria-pressed={mode==='TRACE'} onClick={()=>changeMode('TRACE')}>Trace marks</button><button disabled={!selected?.traces.length} onClick={()=>onTrace([])}>Undo trace</button><button disabled={!selected||!loaded||error} onClick={()=>{if(selected){changeMode('VIEW');setPendingFit([...selected.rect]);}}}>Fit selected zone</button><label><input type="checkbox" checked={overlays} onChange={e=>setOverlays(e.target.checked)}/>Overlays</label></div>
    <div className="epiSourceTools"><label>Zoom <input aria-label="Inscription zoom" type="range" min="100" max="400" step="1" value={zoom} onChange={e=>{setPendingFit(null);setZoom(+e.target.value);}}/>{zoom}%</label><label>Contrast <input aria-label="Inscription contrast" type="range" min="70" max="220" step="5" value={contrast} onChange={e=>setContrast(+e.target.value)}/>{contrast}%</label><label><input type="checkbox" checked={gray} onChange={e=>setGray(e.target.checked)}/>Grayscale</label><button onClick={()=>{setPendingFit(null);setZoom(100);setContrast(100);setGray(false);scroll.current?.scrollTo(0,0);}}>Reset image</button></div>
    <p className="epiMicro" id={helpId}>{mode==='REGION'?'Drag a rectangle around a line or sign.':mode==='TRACE'?'Draw only marks you can see. Gold traces are your interpretation, not recovered carving.':'Drag to pan; click a zone to select it. Focus the image, then use arrow keys (Shift for larger steps), Page Up/Down, Home or End. Zoom is limited to 400%.'}</p>
    <div className="epiImageScroll" ref={scroll} tabIndex={0} role="region" aria-label="Source image navigation" aria-describedby={helpId} onKeyDown={keyPan} style={{touchAction:'none',cursor:mode==='VIEW'?(panning?'grabbing':'grab'):'crosshair'}} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={endPan} onPointerCancel={endPan} onLostPointerCapture={endPan} onClickCapture={e=>{if(suppressZoneClick.current){e.preventDefault();e.stopPropagation();suppressZoneClick.current=false;}}}>
      {!loaded&&!error&&<p role="status">Loading source image…</p>}
      {error?<p role="alert">Image unavailable. <a href={source.source} target="_blank" rel="noreferrer">Open source record ↗</a></p>:<div className="epiImagePlane" style={{width:fitWidth*zoom/100}}>
        <img src={source.image} alt={`${source.title} by ${source.author}`} draggable={false} style={{filter:`contrast(${contrast}%) grayscale(${gray?1:0})`}} onLoad={()=>setLoaded(true)} onError={()=>setError(true)}/>
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-label="Reading zones and interpretive traces" style={{touchAction:'none',cursor:'inherit'}} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={()=>{pointer.current=null;stroke.current=[];setDraft([]);}}>
          {overlays&&regions.map(r=><g key={r.id} className={r.id===selected?.id?'epiSelectedZone':''}><rect x={r.rect[0]*1000} y={r.rect[1]*1000} width={r.rect[2]*1000} height={r.rect[3]*1000} onClick={()=>mode==='VIEW'&&onSelect(r.id)}><title>{r.label}</title></rect>{r.traces.map((t,i)=><path key={i} d={path(t)} className="epiTrace"/>)}</g>)}
          {mode==='REGION'&&rect&&<rect className="epiDraft" x={rect[0]*1000} y={rect[1]*1000} width={rect[2]*1000} height={rect[3]*1000}/>}
          {mode==='TRACE'&&draft.length>1&&<path d={path(draft)} className="epiTrace"/>}
        </svg>
      </div>}
    </div>
    <div className="epiCredit"><b>{source.kind}</b> · {source.author} · {source.date} · <a href={source.licenseUrl} target="_blank" rel="noreferrer">{source.license}</a><p>{source.note}</p><a href={source.source} target="_blank" rel="noreferrer">Source &amp; original resolution ↗</a></div>
  </section>;
}
