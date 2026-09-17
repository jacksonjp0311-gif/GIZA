import { Component, Fragment, useEffect, useState, type ErrorInfo, type ReactNode } from 'react';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { RuntimeDiagnostic } from '../lib/runtimeData';
import { watchWebGLContext } from '../lib/runtimeWebGL';
import './runtimeHealth.css';

export class WorkspaceBoundary extends Component<{name:string;children:ReactNode;onExit?:()=>void},{error:string|null;revision:number}> {
  state={error:null as string|null,revision:0};
  static getDerivedStateFromError(error:Error){return {error:error.message||'Unknown workspace error'};}
  componentDidCatch(error:Error,info:ErrorInfo){console.error(`[GIZA ${this.props.name}] Recoverable workspace failure`,error,info.componentStack);}
  render(){return this.state.error?<section className="workspaceRecovery" role="alert"><h2>{this.props.name} is unavailable</h2><p>The rest of GIZA and the source records remain intact. No evidence has been changed.</p><details><summary>Technical details</summary><pre>{this.state.error}</pre></details><button onClick={()=>this.setState(s=>({error:null,revision:s.revision+1}))}>Retry workspace</button>{this.props.onExit&&<button onClick={this.props.onExit}>Return to model</button>}<button onClick={()=>window.location.reload()}>Reload application</button></section>:<Fragment key={this.state.revision}>{this.props.children}</Fragment>;}
}

export function UnavailableDataset({diagnostics,scope,onExit}:{diagnostics:RuntimeDiagnostic[];scope:string;onExit?:()=>void}){
  return <section className="workspaceRecovery" role="status"><h2>{scope} data unavailable</h2><p>This workspace is paused because its source data could not be loaded or validated. Missing data is not a zero result, a failed benchmark, or evidence of absence.</p><ul>{diagnostics.filter(d=>d.scope===scope).map(d=><li key={d.url}><code>{d.url}</code><span>{d.reason}</span></li>)}</ul><button onClick={()=>window.location.reload()}>Retry data load</button>{onExit&&<button onClick={onExit}>Return to model</button>}</section>;
}

export function DataHealthNotice({diagnostics}:{diagnostics:RuntimeDiagnostic[]}){
  if(!diagnostics.length)return null;
  return <details className="dataHealthNotice"><summary role="status">{diagnostics.length} optional dataset{diagnostics.length===1?'':'s'} unavailable · affected research tools paused</summary><p>The model remains available. These gaps are not verified empty results. Retry the data load after restoring the named files.</p><ul>{diagnostics.map(d=><li key={d.url}><b>{d.scope}</b><code>{d.url}</code><span>{d.reason}</span></li>)}</ul><button onClick={()=>window.location.reload()}>Retry data load</button></details>;
}

/** Mount inside an R3F Canvas. Listener cleanup also prevents duplicate notices under StrictMode. */
export function WebGLRecovery({onLost,onRestored}:{onLost?:()=>void;onRestored?:()=>void}){
  const {gl,invalidate}=useThree();const [lost,setLost]=useState(false);
  useEffect(()=>watchWebGLContext(gl.domElement,value=>{setLost(value);if(value)onLost?.();else{invalidate();onRestored?.();}}),[gl,invalidate,onLost,onRestored]);
  return lost?<Html center><section className="workspaceRecovery webglRecovery" role="alert"><h2>3-D graphics paused</h2><p>The browser lost its graphics context. Your evidence and coordinates are unchanged.</p><button onClick={()=>gl.getContext().getExtension('WEBGL_lose_context')?.restoreContext()}>Restore graphics</button><button onClick={()=>window.location.reload()}>Reload application</button></section></Html>:null;
}
