import {useLayoutEffect,useRef} from 'react';
const drafts=new Map<symbol,()=>boolean>();
let approvedDepth=0;
export const UNSAVED_RESEARCH_MESSAGE='You have unsaved research changes. Leave without saving? Cancel to keep working, or save/export your investigation before leaving.';
export function hasUnsavedResearch(){return [...drafts.values()].some(read=>read());}
/** All destructive workspace transitions use this one boundary, including tutorial clicks. */
export function requestNavigation(action:()=>void):boolean{
  if(!approvedDepth&&hasUnsavedResearch()&&!window.confirm(UNSAVED_RESEARCH_MESSAGE))return false;
  approvedDepth++;try{action();return true;}finally{approvedDepth--;}
}
export function useResearchDraft(dirty:boolean){
  const current=useRef(dirty);current.current=dirty;
  useLayoutEffect(()=>{const id=Symbol('research-draft');drafts.set(id,()=>current.current);return()=>{drafts.delete(id);};},[]);
}
export function useNavigationUnloadGuard(){
  useLayoutEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(hasUnsavedResearch()){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[]);
}
