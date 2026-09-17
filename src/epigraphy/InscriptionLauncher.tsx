import {Component,lazy,Suspense,useState,type ReactNode} from 'react';
const Lab=lazy(()=>import('./InscriptionLab'));
class LabBoundary extends Component<{children:ReactNode;onClose:()=>void},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<span role="alert">Inscription Lab could not load. <button onClick={this.props.onClose}>Dismiss</button> Refresh to retry.</span>:this.props.children;}
}
export function InscriptionLauncher({onModel,label='Hieroglyphs · Inscription Lab'}:{onModel?:()=>void;label?:string}){
  const [open,setOpen]=useState(false);
  return <><button className="inscriptionLaunch" onClick={()=>setOpen(true)}>{label}</button>{open&&<LabBoundary onClose={()=>setOpen(false)}><Suspense fallback={<span role="status">Loading inscription tools… <button onClick={()=>setOpen(false)}>Cancel</button></span>}><Lab onClose={()=>setOpen(false)} onModel={onModel?()=>{setOpen(false);onModel();}:undefined}/></Suspense></LabBoundary>}</>;
}
