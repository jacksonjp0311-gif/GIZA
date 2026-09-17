import { lazy, Suspense } from 'react';
import type { ModelBundle } from '../lib/model';
import { WorkspaceBoundary,UnavailableDataset } from '../workstation/WorkspaceBoundary';

const AssemblyWorkbench=lazy(()=>import('./AssemblyWorkbench'));
export function AssemblyEntry(props:{model:ModelBundle;initialPart:string;onClose:()=>void;onLegacy:()=>void}){
  const blocked=props.model.runtimeDiagnostics.filter(d=>['/model/component_research.json','/model/evidence/source_registry.json'].includes(d.url));
  if(blocked.length)return <UnavailableDataset diagnostics={blocked} scope={blocked[0].scope} onExit={props.onClose}/>;
  return <WorkspaceBoundary name="Evidence Assembly" onExit={props.onClose}>
    <Suspense fallback={<div className="boot"><b>GIZA EVIDENCE ASSEMBLY</b><span>Loading spatial interrogation tools…</span></div>}>
      <AssemblyWorkbench {...props}/>
    </Suspense>
  </WorkspaceBoundary>;
}
