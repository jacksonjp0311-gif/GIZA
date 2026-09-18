import type {Dispatch,SetStateAction} from 'react';
import type {ViewPreset,SectionAxis} from '../scene/types';
import type {DetailContext} from '../lib/componentDetails';
import type {LayerKey} from './types';
/** Keep navigation definitions out of the orchestration component; all existing actions preserved. */
export function quickViewDefinitions({setSphinx,setExplode,setSectionAxis,setSectionPos,activateView,selectPart,openDetail,setLayers}:{
  setSphinx:(v:boolean)=>void;setExplode:(v:number)=>void;setSectionAxis:(v:SectionAxis)=>void;setSectionPos:(v:number)=>void;
  activateView:(v:ViewPreset)=>void;selectPart:(v:string)=>void;openDetail:(id:string,context?:DetailContext)=>void;
  setLayers:Dispatch<SetStateAction<Record<LayerKey,boolean>>>;
}){
  return [
    { label:'Sphinx',id:'preview.sphinx',action:()=>setSphinx(true) },
    { label:'Full Pyramid',id:'part.pyramid.khafre',action:()=>{setLayers(l=>({...l,exterior:true}));setExplode(0);setSectionAxis('OFF');activateView('PERSPECTIVE');selectPart('part.pyramid.khafre');} },
    { label:'Exploded',id:'part.pyramid.khafre',action:()=>{setExplode(1.75);activateView('PERSPECTIVE');selectPart('part.pyramid.khafre');} },
    { label:'Interior',id:'part.burial.chamber',action:()=>openDetail('part.burial.chamber') },
    { label:'Underground',id:'part.shaft.alpha.1',action:()=>{setLayers(l=>({...l,subsurface:true}));setSectionAxis('OFF');setExplode(.56);activateView('UNDERGROUND');selectPart('part.shaft.alpha.1');} },
    { label:'Cross Section',id:'part.burial.chamber',action:()=>{setSectionAxis('Y');setSectionPos(0);activateView('SECTION');selectPart('part.burial.chamber');} },
    { label:'Burial Chamber',id:'part.burial.chamber',action:()=>openDetail('part.burial.chamber') },
    { label:'Sarcophagus',id:'part.sarcophagus.body',action:()=>openDetail('part.sarcophagus.body') },
    { label:'Lower Chamber',id:'part.lower.chamber',action:()=>openDetail('part.lower.chamber') },
    { label:'Sarcophagus Lid',id:'part.sarcophagus.lid',action:()=>openDetail('part.sarcophagus.lid','OBJECT') },
    { label:'Roof & Chamber',id:'part.burial.gable_envelope',action:()=>openDetail('part.burial.gable_envelope') },
    { label:'Upper Passage',id:'part.upper.entrance.existing',action:()=>openDetail('part.upper.entrance.existing','OBJECT') },
    { label:'Portcullis',id:'part.upper.portcullis.slab',action:()=>openDetail('part.upper.portcullis.slab','OBJECT') },
    { label:'Plateau View',id:'part.plateau.reference',action:()=>{setLayers(l=>({...l,terrain:true}));activateView('TOP');selectPart('part.plateau.reference');} },
  ];
}
