import type {CanonicalPoint,EvidenceAssembly,EvidenceFeature,RealityAuthority,SectionPlane,Vec3} from './types';
import { invertRigid, pointInFrame, polygonArea, resolveTransform, sectionBox, transformPoint,validateCanonicalMembership } from './spatial';
import { displayPoint, inspectionPose, physicalPoint } from './presentation';

export function featureAnchors(feature:EvidenceFeature):Vec3[]{
  const g=feature.geometry;
  if(g.kind==='point')return [g.point];
  if(g.kind==='segment')return [g.a,g.b];
  if(g.kind==='surface')return g.vertices;
  if(g.kind==='box')return Array.from({length:8},(_,i)=>[i&1?g.max[0]:g.min[0],i&2?g.max[1]:g.min[1],i&4?g.max[2]:g.min[2]] as Vec3);
  return [];
}
export function featureCenter(feature:EvidenceFeature):Vec3{
  const points=featureAnchors(feature);return points.length?points.reduce<Vec3>((s,p)=>s.map((v,i)=>v+p[i]/points.length) as Vec3,[0,0,0]):[0,0,0];
}
export interface VisibilityState {layers:Record<RealityAuthority,boolean>;room:boolean;isolated:string|null;hotspots:boolean;selectedId:string}
/** One display-space selection for rendering and camera fitting; never a physical transform. */
export function visibleGeometry(assembly:EvidenceAssembly,state:VisibilityState):EvidenceFeature[]{
  return assembly.features.filter(f=>state.layers[f.authority]&&(!state.isolated||f.objectId===state.isolated)&&(state.room||f.objectId.includes('sarcophagus'))&&featureAnchors(f).length>0&&(f.geometry.kind!=='segment'||state.hotspots||f.id===state.selectedId));
}
export function pickSectionCanonical(assembly:EvidenceAssembly,feature:EvidenceFeature,display:Vec3,explode:number,section:SectionPlane):CanonicalPoint{
  const point=pickCanonical(assembly,feature,display,explode),at=pointInFrame(assembly,point,section.frameId);
  const n=Math.hypot(...section.normal);if(!at||!Number.isFinite(n)||n<1e-12||Math.abs(at.reduce((s,v,i)=>s+v*(section.normal[i]/n),-section.offset/n))>1e-7)throw new Error('Section pick does not lie on its physical plane');
  const picked:CanonicalPoint={...point,origin:{kind:'COMPUTED_SECTION',section:structuredClone(section),surfaceAuthority:'RECONSTRUCTED'}};validateCanonicalMembership(assembly,picked);return picked;
}
export function bodyOrigin(assembly:EvidenceAssembly):Vec3{
  const body=assembly.features.find(f=>f.objectId==='part.sarcophagus.body');
  return body?pointInFrame(assembly,{frameId:body.frameId,position:[0,0,0]},assembly.authoritativeFrameId)??[0,0,0]:[0,0,0];
}
/** A parked lid may share a display, never an authoritative coordinate system. */
export function pointForDisplay(assembly:EvidenceAssembly,feature:EvidenceFeature,p:Vec3,explode:number):Vec3{
  const physical=pointInFrame(assembly,{frameId:feature.frameId,position:p},assembly.authoritativeFrameId);
  if(physical)return physical;
  return displayPoint(displayPoint(p,{purpose:'PRESENTATION_ONLY',translation:bodyOrigin(assembly)}),inspectionPose(feature.objectId,explode));
}
export function pickCanonical(assembly:EvidenceAssembly,feature:EvidenceFeature,display:Vec3,explode:number):CanonicalPoint{
  const matrix=resolveTransform(assembly.frames,assembly.transforms,feature.frameId,assembly.authoritativeFrameId);
  return {frameId:feature.frameId,featureId:feature.id,position:matrix?transformPoint(invertRigid(matrix),display):physicalPoint(physicalPoint(display,inspectionPose(feature.objectId,explode)),{purpose:'PRESENTATION_ONLY',translation:bodyOrigin(assembly)})};
}
export interface SectionCut {featureId:string;frameId:string;polygon:Vec3[];area:number}
export function assemblySections(assembly:EvidenceAssembly,plane:SectionPlane):SectionCut[]{
  return assembly.features.flatMap(f=>{
    if(f.geometry.kind!=='box'||f.authority!=='RECONSTRUCTED')return [];
    const matrix=resolveTransform(assembly.frames,assembly.transforms,f.frameId,plane.frameId);if(!matrix)return [];
    const n=plane.normal;
    const localPlane:SectionPlane={frameId:f.frameId,normal:[matrix[0]*n[0]+matrix[4]*n[1]+matrix[8]*n[2],matrix[1]*n[0]+matrix[5]*n[1]+matrix[9]*n[2],matrix[2]*n[0]+matrix[6]*n[1]+matrix[10]*n[2]],offset:plane.offset-n[0]*matrix[3]-n[1]*matrix[7]-n[2]*matrix[11]};
    // Match clipping's positive retained half-space. At a shared face only the
    // solid with retained volume contributes, avoiding duplicated interface area.
    const distances=featureAnchors(f).map(p=>p.reduce((s,x,i)=>s+x*localPlane.normal[i],-localPlane.offset));
    if(Math.max(...distances)<=1e-10)return [];
    const polygon=sectionBox(f.geometry,localPlane);
    return polygon.length>=3?[{featureId:f.id,frameId:f.frameId,polygon,area:polygonArea(polygon)}]:[];
  });
}
