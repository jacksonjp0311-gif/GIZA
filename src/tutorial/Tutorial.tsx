import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {CHAPTERS,STEPS} from './curriculum';
import './tutorial.css';
const KEY='giza.tutorial.v1';
interface Progress {version:1;step:string;active:boolean;dismissed:boolean;completed:string[]}
const fresh=():Progress=>({version:1,step:'welcome',active:false,dismissed:false,completed:[]});
function load():Progress{try{const p=JSON.parse(localStorage.getItem(KEY)||'null');if(p?.version===1&&STEPS.some(s=>s.id===p.step)&&typeof p.active==='boolean'&&typeof p.dismissed==='boolean'&&Array.isArray(p.completed)&&p.completed.length<=STEPS.length&&p.completed.every((id:unknown)=>STEPS.some(s=>s.id===id)))return p;}catch{}return fresh();}
export function teach(chapter=0){window.dispatchEvent(new CustomEvent('giza:teach',{detail:chapter}));}
export function TeachButton({chapter}:{chapter:number}){return <button type="button" title="Teach me this" aria-label="Teach me this" onClick={()=>teach(chapter)}>?</button>;}
type Rect={left:number;top:number;right:number;bottom:number;width:number;height:number};
export function Tutorial({welcomeEnabled=true}:{welcomeEnabled?:boolean}){
  const [welcomeSlot,setWelcomeSlot]=useState<HTMLElement|null>(null);
  useEffect(()=>{setWelcomeSlot(document.getElementById('giza-welcome-slot'));},[]);
  const [progress,setProgress]=useState(load),[rect,setRect]=useState<Rect|null>(null),[layout,setLayout]=useState({width:320,height:220,left:12,top:90});
  const popup=useRef<HTMLElement>(null),lastFocus=useRef<HTMLElement|null>(null),pendingClick=useRef(false);
  const index=Math.max(0,STEPS.findIndex(s=>s.id===progress.step)),step=STEPS[index];
  const update=(patch:Partial<Progress>)=>setProgress(p=>({...p,...patch}));
  const exit=()=>{update({active:false,dismissed:true});lastFocus.current?.isConnected&&lastFocus.current.focus({preventScroll:true});};
  const go=(i:number)=>{pendingClick.current=false;update({step:STEPS[Math.max(0,Math.min(STEPS.length-1,i))].id});};
  const next=()=>{setProgress(p=>({...p,completed:[...new Set([...p.completed,step.id])],step:STEPS[Math.min(index+1,STEPS.length-1)].id}));pendingClick.current=false;};
  useEffect(()=>{try{localStorage.setItem(KEY,JSON.stringify(progress));}catch{/* UI-only progress; research is untouched. */}},[progress]);
  useEffect(()=>{const start=(e:Event)=>{const chapter=(e as CustomEvent<number>).detail;if(!Number.isInteger(chapter)||chapter<0||chapter>=CHAPTERS.length)return;lastFocus.current=document.activeElement as HTMLElement;setProgress(p=>({...p,active:true,dismissed:true,step:STEPS.find(s=>s.chapter===chapter)!.id}));};window.addEventListener('giza:teach',start);return()=>window.removeEventListener('giza:teach',start);},[]);
  useLayoutEffect(()=>{
    if(!progress.active)return;
    const selector='[data-tutorial-id="'+step.target+'"]';
    let frame=0,observed:HTMLElement|null=null,scrolled=false;
    const visible=(el:HTMLElement|null)=>!!el&&el.getClientRects().length>0&&!el.closest('[hidden]');
    const measure=()=>{
      const measuredAt=performance.now();
      const finish=()=>{if(new URLSearchParams(location.search).has('tutorialDiagnostics'))performance.measure('giza.tutorial.layout',{start:measuredAt,end:performance.now()});};
      frame=0;const target=document.querySelector<HTMLElement>(selector);
      if(target!==observed){if(observed)resize.unobserve(observed);observed=target;if(target)resize.observe(target);}
      const w=window.innerWidth,h=window.innerHeight;
      if(pendingClick.current&&(!step.after||visible(document.querySelector<HTMLElement>('[data-tutorial-id="'+step.after+'"]')))){pendingClick.current=false;next();return;}
      if(!visible(target)){setRect(null);setLayout({left:Math.max(8,(w-Math.min(340,w-16))/2),top:Math.min(90,h*.15),width:Math.min(340,w-16),height:h-32});return;}
      const raw=target!.getBoundingClientRect();
      if(!scrolled&&(raw.bottom>h||raw.top<0||raw.right>w||raw.left<0)){scrolled=true;target!.scrollIntoView({block:'nearest',inline:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
      const r={left:Math.max(0,raw.left-10),right:Math.min(w,raw.right+10),top:Math.max(0,raw.top-10),bottom:Math.min(h,raw.bottom+10),width:0,height:0};r.width=Math.max(0,r.right-r.left);r.height=Math.max(0,r.bottom-r.top);setRect(r);
      const spaces=[{left:r.right+8,top:8,width:w-r.right-16,height:h-16},{left:8,top:8,width:r.left-16,height:h-16},{left:8,top:r.bottom+8,width:w-16,height:h-r.bottom-16},{left:8,top:8,width:w-16,height:r.top-16}].filter(s=>s.width>=120&&s.height>=48);
      const best=spaces.find(s=>s.width>=300&&s.height>=240)??spaces.sort((a,b)=>Math.min(b.width,340)*Math.min(b.height,260)-Math.min(a.width,340)*Math.min(a.height,260))[0];
      // Full-screen targets cannot have an adjacent popover: keep a small header
      // description and report the unavailable opening rather than cover controls.
      if(!best){setRect(null);setLayout({left:8,top:8,width:Math.min(340,w-16),height:h-16});return;}
      setLayout({...best,width:Math.min(340,best.width),height:Math.min(360,best.height)});finish();
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure);};
    const resize=new ResizeObserver(schedule),mutation=new MutationObserver(records=>{if(records.some(r=>!(r.target as Element).closest?.('[data-tutorial-root]')))schedule();});
    resize.observe(document.documentElement);mutation.observe(document.querySelector('.app')??document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class','aria-pressed','open']});
    window.addEventListener('resize',schedule);window.addEventListener('scroll',schedule,true);
    const click=(e:MouseEvent)=>{if(step.click&&document.querySelector<HTMLElement>(selector)?.contains(e.target as Node)){pendingClick.current=true;schedule();}};
    document.addEventListener('click',click);
    schedule();popup.current?.focus({preventScroll:true});
    return()=>{cancelAnimationFrame(frame);resize.disconnect();mutation.disconnect();window.removeEventListener('resize',schedule);window.removeEventListener('scroll',schedule,true);document.removeEventListener('click',click);};
  },[progress.active,step.id]);
  useEffect(()=>{
    if(!progress.active)return;
    const key=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();exit();}
      if(e.key==='Tab'){
        const target=document.querySelector<HTMLElement>('[data-tutorial-id="'+step.target+'"]');
        const candidates=[...(target?.matches('button,input,select,a,[tabindex]')?[target]:[]),...Array.from(target?.querySelectorAll<HTMLElement>('button,input,select,a,[tabindex]')??[]),...Array.from(popup.current?.querySelectorAll<HTMLElement>('button,select')??[])].filter(el=>!el.hasAttribute('disabled')&&el.getClientRects().length&&!el.closest('[hidden]'));
        if(candidates.length){e.preventDefault();e.stopImmediatePropagation();const at=candidates.indexOf(document.activeElement as HTMLElement),n=(at+(e.shiftKey?-1:1)+candidates.length)%candidates.length;candidates[n].focus();}
      }
    };window.addEventListener('keydown',key,true);return()=>window.removeEventListener('keydown',key,true);
  },[progress.active,step.id]);
  if(!progress.active)return welcomeEnabled&&!progress.dismissed&&welcomeSlot?createPortal(<aside className="tutorialWelcome" data-tutorial-root aria-label="New to GIZA?"><b>NEW TO GIZA?</b><p>Take a guided tour.</p><button onClick={()=>teach(0)}>Start tutorial</button><button onClick={()=>update({dismissed:true})}>Explore on my own</button></aside>,welcomeSlot):null;
  const w=window.innerWidth,h=window.innerHeight;
  return <div data-tutorial-root className="tutorialRoot">
    {rect?<><div className="tutorialShade" style={{left:0,top:0,width:w,height:rect.top}}/><div className="tutorialShade" style={{left:0,top:rect.bottom,width:w,height:h-rect.bottom}}/><div className="tutorialShade" style={{left:0,top:rect.top,width:rect.left,height:rect.height}}/><div className="tutorialShade" style={{left:rect.right,top:rect.top,width:w-rect.right,height:rect.height}}/><div data-testid="tutorial-cutout" className="tutorialOutline" style={{left:rect.left,top:rect.top,width:rect.width,height:rect.height}}/></>:<div className="tutorialShade" style={{inset:0}}/>}
    <section ref={popup} tabIndex={-1} className="tutorialPopover" role="region" aria-label="GIZA tutorial" aria-describedby="tutorial-description" style={{left:layout.left,top:layout.top,width:layout.width,maxHeight:layout.height}}>
      <small>{index+1} / {STEPS.length} · {CHAPTERS[step.chapter]}</small><h2>{step.title}</h2><p id="tutorial-description" aria-live="polite">{step.text}</p><p>{step.instruction}</p>
      {!rect&&<p role="status">This target is not currently available or has no room for an adjacent guide. Open its workspace first. If its optional dataset did not load, retry that workspace or skip this chapter.</p>}
      {pendingClick.current&&step.after&&<p role="status">Waiting for the requested workspace. If its optional dataset is unavailable, retry the workspace or use Skip chapter. Research navigation may also require your confirmation.</p>}
      <nav aria-label="Tutorial navigation"><button disabled={index===0} onClick={()=>go(index-1)}>Back</button>{index===STEPS.length-1?<button onClick={exit}>Open GIZA</button>:<button disabled={!!step.click&&!!rect} onClick={next}>{step.click&&rect?'Use highlighted control':'Next'}</button>}<button onClick={exit}>Exit tutorial</button></nav>
      <details><summary>Chapters &amp; restart</summary><label>Choose a chapter<select aria-label="Tutorial chapter" value={step.chapter} onChange={e=>go(STEPS.findIndex(s=>s.chapter===Number(e.target.value)))}>{CHAPTERS.map((c,i)=><option key={c} value={i}>{i+1}. {c}</option>)}</select></label><button onClick={()=>go(STEPS.findIndex(s=>s.chapter===Math.min(14,step.chapter+1)))}>Skip chapter</button><button onClick={()=>go(0)}>Restart tutorial</button></details>
    </section>
  </div>;
}
