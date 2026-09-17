import { Component, type ReactNode } from 'react';
import { clearWorkspaceState } from '../lib/workspace';
export class RecoveryBoundary extends Component<{children:ReactNode},{error:Error|null}> {
  state:{error:Error|null}={error:null};
  static getDerivedStateFromError(error:Error){return {error};}
  render(){return this.state.error?<section className="fatal" role="alert"><h1>The viewer needs a restart</h1><p>Your source data has not been changed.</p><details><summary>Technical details</summary><pre>{this.state.error.message}</pre></details><button onClick={()=>window.location.reload()}>Reload viewer</button><button onClick={()=>{clearWorkspaceState();window.location.reload();}}>Reset saved view and reload</button></section>:this.props.children;}
}
