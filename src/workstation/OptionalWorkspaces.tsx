import { lazy, Suspense, type ComponentProps } from 'react';
import { unavailable } from '../lib/runtimeData';
import { UnavailableDataset, WorkspaceBoundary } from './WorkspaceBoundary';
const ComponentWorkspace=lazy(()=>import('./ComponentWorkbench').then(module=>({default:module.ComponentWorkbench})));
const AtlasWorkspace=lazy(()=>import('../maps/MapAtlasPanel').then(module=>({default:module.MapAtlasPanel})));

export function ComponentWorkbench(props:ComponentProps<typeof ComponentWorkspace>){
  if(unavailable(props.model.runtimeDiagnostics,'COMPONENT'))return <UnavailableDataset diagnostics={props.model.runtimeDiagnostics} scope="COMPONENT" onExit={props.onClose}/>;
  return <WorkspaceBoundary name="Component inspection" onExit={props.onClose}><Suspense fallback={<div className="workspaceLoading" role="status">Loading component inspection…</div>}><ComponentWorkspace {...props}/></Suspense></WorkspaceBoundary>;
}
export function MapAtlasPanel(props:ComponentProps<typeof AtlasWorkspace>){
  if(unavailable(props.model.runtimeDiagnostics,'ATLAS'))return <UnavailableDataset diagnostics={props.model.runtimeDiagnostics} scope="ATLAS"/>;
  return <WorkspaceBoundary name="Map atlas"><Suspense fallback={<div className="workspaceLoading" role="status">Loading evidence atlas…</div>}><AtlasWorkspace {...props}/></Suspense></WorkspaceBoundary>;
}
