import { lazy, Suspense } from 'react';
import type { ModelBundle } from '../lib/model';
import { WorkspaceBoundary } from '../workstation/WorkspaceBoundary';

const AssemblyWorkbench=lazy(()=>import('./AssemblyWorkbench'));
export function AssemblyEntry(props:{model:ModelBundle;initialPart:string;onClose:()=>void;onLegacy:()=>void}){
  return <WorkspaceBoundary name="Evidence Assembly" onExit={props.onClose}>
    <Suspense fallback={<div className="boot"><b>GIZA EVIDENCE ASSEMBLY</b><span>Loading spatial interrogation tools…</span></div>}>
      <AssemblyWorkbench {...props}/>
    </Suspense>
  </WorkspaceBoundary>;
}
