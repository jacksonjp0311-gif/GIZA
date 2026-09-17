import {Component,lazy,Suspense,type ReactNode} from 'react';
const Workspace=lazy(()=>import('./SphinxWorkbench').then(m=>({default:m.SphinxWorkbench})));
class SphinxBoundary extends Component<{children:ReactNode;onClose:()=>void},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<section role="alert">The Sphinx viewer could not load. Refresh to retry, or <button onClick={this.props.onClose}>return to Khafre</button>.</section>:this.props.children;}
}
export function SphinxWorkbench({onClose,initialArtifact=false}:{onClose:()=>void;initialArtifact?:boolean}){
  return <SphinxBoundary onClose={onClose}><Suspense fallback={<section role="status">Loading Sphinx explorer… <button onClick={onClose}>Return to Khafre</button></section>}><Workspace onClose={onClose} initialArtifact={initialArtifact}/></Suspense></SphinxBoundary>;
}
