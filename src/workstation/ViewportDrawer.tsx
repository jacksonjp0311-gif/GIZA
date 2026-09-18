import {useEffect,useRef,useState,type ReactNode} from 'react';
import './viewportDrawer.css';

/** Compact hover drawer; keyboard and touch users never depend on hovering. */
export function ViewportDrawer({label,side,children}:{label:string;side:'inspection'|'explosion';children:ReactNode}){
  const [hover,setHover]=useState(false),[focus,setFocus]=useState(false),[tap,setTap]=useState(false),[drag,setDrag]=useState(false);
  const root=useRef<HTMLDivElement>(null),pointer=useRef(false);
  const open=hover||focus||tap||drag;
  const [available,setAvailable]=useState(240);
  useEffect(()=>{const parent=root.current?.parentElement;if(!parent)return;const resize=()=>setAvailable(Math.max(60,parent.clientHeight-(side==='explosion'?42:12)-(root.current?.offsetHeight??36)-12));resize();const observer=new ResizeObserver(resize);observer.observe(parent);return()=>observer.disconnect();},[side]);
  useEffect(()=>{const end=()=>setDrag(false);const keyboard=()=>{pointer.current=false;};window.addEventListener('keydown',keyboard,true);window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);return()=>{window.removeEventListener('keydown',keyboard,true);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',end);};},[]);
  const close=()=>{setHover(false);setFocus(false);setTap(false);setDrag(false);const active=document.activeElement;if(active instanceof HTMLElement&&root.current?.contains(active))active.blur();};
  return <div ref={root} className={'viewportDrawer '+side} data-open={open} onPointerEnter={e=>{if(e.pointerType==='mouse')setHover(true);}} onPointerLeave={e=>{if(e.pointerType==='mouse'){setHover(false);setTap(false);if(pointer.current)setFocus(false);}}} onPointerDown={e=>{pointer.current=true;if(e.target instanceof HTMLInputElement&&e.target.type==='range')setDrag(true);}} onFocus={e=>{if(!pointer.current&&e.target.matches(':focus-visible'))setFocus(true);}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setFocus(false);}} onKeyDown={e=>{pointer.current=false;if(e.key==='Escape'){e.stopPropagation();close();}}}>
    <button data-tutorial-id={side==="inspection"?"inspect-layers":"explode"} className="viewportDrawerTab" aria-expanded={open} aria-controls={'viewport-'+side} onClick={()=>{setTap(v=>!v);}}> {label} <span aria-hidden="true">{open?'▴':'▾'}</span></button>
    <div id={'viewport-'+side} className="viewportDrawerBody" style={{maxHeight:Math.min(360,available)}} hidden={!open}>{children}<button className="viewportDrawerClose" onClick={close}>Close {label.toLowerCase()}</button></div>
  </div>;
}
