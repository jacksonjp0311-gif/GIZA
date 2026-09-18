import type {BoxGeometry,CanonicalPoint,EvidenceAssembly,Matrix4,SectionPlane,SpatialFrame,SpatialResult,SpatialTransform,Uncertainty,Vec3} from './types';
import {assertSafeDocument,validateObservation,validateFeatureSupport} from './observationContract';
import {belongsToGeometry,geometryTolerance,polygonProjection} from './membership';

export const unknownUncertainty=(note='No uncertainty supplied by the cited record.'):Uncertainty=>({status:'UNKNOWN',value:null,unit:'m',note});
export const identityMatrix=():Matrix4=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
export function rigidMatrix(translation:Vec3=[0,0,0],yaw=0):Matrix4 {
  if(!translation.every(Number.isFinite)||!Number.isFinite(yaw))throw new Error('Non-finite transform');
  const c=Math.cos(yaw),s=Math.sin(yaw);return [c,-s||0,0,translation[0],s||0,c,0,translation[1],0,0,1,translation[2],0,0,0,1];
}
export const dot=(a:Vec3,b:Vec3)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const subtract=(a:Vec3,b:Vec3):Vec3=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
export const distance=(a:Vec3,b:Vec3)=>Math.hypot(...subtract(a,b));
const cross=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const normalized=(a:Vec3):Vec3=>{const n=Math.hypot(...a);if(!Number.isFinite(n)||n<1e-12)throw new Error('Degenerate vector');return a.map(v=>v/n) as Vec3;};
export function validateRigidMatrix(m:Matrix4,tolerance=1e-9):void {
  if(!Array.isArray(m)||m.length!==16||!m.every(Number.isFinite))throw new Error('Invalid transform matrix');
  if(Math.abs(m[12])+Math.abs(m[13])+Math.abs(m[14])+Math.abs(m[15]-1)>tolerance)throw new Error('Not affine');
  const axes:Vec3[]=[[m[0],m[4],m[8]],[m[1],m[5],m[9]],[m[2],m[6],m[10]]];
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)if(Math.abs(dot(axes[i],axes[j])-(i===j?1:0))>tolerance)throw new Error('Scale/shear cannot enter metric frame');
  if(Math.abs(dot(axes[0],cross(axes[1],axes[2]))-1)>tolerance)throw new Error('Reflection/handedness change');
}
export function multiplyMatrices(a:Matrix4,b:Matrix4):Matrix4 {
  const out=Array(16).fill(0);for(let r=0;r<4;r++)for(let c=0;c<4;c++)for(let k=0;k<4;k++)out[r*4+c]+=a[r*4+k]*b[k*4+c];return out as Matrix4;
}
export function invertRigid(m:Matrix4):Matrix4 {
  validateRigidMatrix(m);const out:Matrix4=[m[0],m[4],m[8],0,m[1],m[5],m[9],0,m[2],m[6],m[10],0,0,0,0,1];
  for(let r=0;r<3;r++)out[r*4+3]=-(out[r*4]*m[3]+out[r*4+1]*m[7]+out[r*4+2]*m[11]);return out;
}
export function transformPoint(m:Matrix4,p:Vec3):Vec3 {
  if(!Array.isArray(p)||p.length!==3||!p.every(Number.isFinite))throw new Error('Invalid point');validateRigidMatrix(m);
  return [m[0]*p[0]+m[1]*p[1]+m[2]*p[2]+m[3],m[4]*p[0]+m[5]*p[1]+m[6]*p[2]+m[7],m[8]*p[0]+m[9]*p[1]+m[10]*p[2]+m[11]];
}
/** All available paths must agree. Unknown edges never become implicit identities. */
export function resolveTransform(frames:SpatialFrame[],transforms:SpatialTransform[],from:string,to:string,scope:'AUTHORITATIVE_RECONSTRUCTION'|'COMPARISON_ONLY'='AUTHORITATIVE_RECONSTRUCTION'):Matrix4|null {
  if(!frames.some(f=>f.id===from)||!frames.some(f=>f.id===to))throw new Error('Unknown coordinate frame');
  if(frames.some(f=>f.units!=='m'||f.handedness!=='RIGHT_HANDED'))throw new Error('Frame units/handedness require explicit normalization');
  if(from===to)return identityMatrix();
  const found=new Map<string,Matrix4>([[from,identityMatrix()]]),queue=[from];
  const eligible=transforms.filter(t=>t.status==='RESOLVED'&&t.matrix&&t.scope===scope);
  while(queue.length){const current=queue.shift()!;for(const edge of eligible){
    if(edge.from!==current&&edge.to!==current)continue;
    const next=edge.from===current?edge.to:edge.from;
    const m=edge.from===current?edge.matrix!:invertRigid(edge.matrix!);validateRigidMatrix(m);
    const composed=multiplyMatrices(m,found.get(current)!);const previous=found.get(next);
    if(previous){if(previous.some((v,i)=>Math.abs(v-composed[i])>1e-8))throw new Error('Conflicting transform paths');}
    else{found.set(next,composed);queue.push(next);}
  }}return found.get(to)??null;
}
export function pointInFrame(assembly:EvidenceAssembly,point:CanonicalPoint,frameId:string):Vec3|null {
  const transform=resolveTransform(assembly.frames,assembly.transforms,point.frameId,frameId);return transform?transformPoint(transform,point.position):null;
}
export function validateCanonicalMembership(a:EvidenceAssembly,p:CanonicalPoint):void {
  const f=a.features.find(f=>f.id===p.featureId);
  if(!f||f.coordinateAuthority==='UNKNOWN'||f.frameId!==p.frameId||!belongsToGeometry(f.geometry,p.position,!!p.origin))throw new Error('Point does not belong to its originating physical surface');
  if(p.origin){
    const plane=p.origin.section;if(p.origin.kind!=='COMPUTED_SECTION'||p.origin.surfaceAuthority!=='RECONSTRUCTED'||!plane||!Array.isArray(plane.normal)||plane.normal.length!==3||!plane.normal.every(Number.isFinite)||!Number.isFinite(plane.offset))throw new Error('Invalid computed section');
    const magnitude=Math.hypot(...plane.normal),at=pointInFrame(a,p,plane.frameId);
    if(!at||!Number.isFinite(magnitude)||magnitude<1e-12)throw new Error('Invalid section plane magnitude');
    const normal=plane.normal.map(v=>v/magnitude) as Vec3,offset=plane.offset/magnitude;
    if(!Number.isFinite(offset)||Math.abs(dot(at,normal)-offset)>geometryTolerance([p.position]))throw new Error('Section point is off its archived plane');
    const matrix=resolveTransform(a.frames,a.transforms,f.frameId,plane.frameId)!;
    if(f.geometry.kind!=='box')throw new Error('Unsupported computed section origin');
    const box=f.geometry;const corners:Vec3[]=Array.from({length:8},(_,i)=>[i&1?box.max[0]:box.min[0],i&2?box.max[1]:box.min[1],i&4?box.max[2]:box.min[2]]);
    if(Math.max(...corners.map(v=>dot(transformPoint(matrix,v),normal)-offset))<=geometryTolerance(corners))throw new Error('Section has no retained solid volume');
    const localPlane:SectionPlane={frameId:f.frameId,normal:[matrix[0]*normal[0]+matrix[4]*normal[1]+matrix[8]*normal[2],matrix[1]*normal[0]+matrix[5]*normal[1]+matrix[9]*normal[2],matrix[2]*normal[0]+matrix[6]*normal[1]+matrix[10]*normal[2]],offset:offset-normal[0]*matrix[3]-normal[1]*matrix[7]-normal[2]*matrix[11]};
    const cut=sectionBox(box,localPlane);
    if(f.authority!=='RECONSTRUCTED'||cut.length<3||polygonArea(cut)<=geometryTolerance(corners)**2||!belongsToGeometry({kind:'surface',vertices:cut},p.position))throw new Error('Point is not on an actual supported section cap');
  }
}
function result(value:number|null,unit:'m'|'deg',frameId:string,reason:string):SpatialResult {
  return {status:value===null?'UNKNOWN':'KNOWN',value,unit,frameId,reason,uncertainty:{...unknownUncertainty('Source uncertainty and idealized feature positions do not establish complete propagated uncertainty.'),unit}};
}
export function measurePoints(assembly:EvidenceAssembly,a:CanonicalPoint,b:CanonicalPoint,frameId:string):SpatialResult {
  const p=pointInFrame(assembly,a,frameId),q=pointInFrame(assembly,b,frameId);
  return result(p&&q?distance(p,q):null,'m',frameId,p&&q?'Distance in explicitly declared reconstruction frame; not a new survey measurement.':'UNKNOWN: no authoritative transform connects these points to the declared frame.');
}
export function measureAngle(assembly:EvidenceAssembly,a:CanonicalPoint,vertex:CanonicalPoint,b:CanonicalPoint,frameId:string):SpatialResult {
  const p=pointInFrame(assembly,a,frameId),v=pointInFrame(assembly,vertex,frameId),q=pointInFrame(assembly,b,frameId);
  if(!p||!v||!q)return result(null,'deg',frameId,'UNKNOWN: unresolved frame transform.');
  const u=subtract(p,v),w=subtract(q,v);if(Math.hypot(...u)<1e-12||Math.hypot(...w)<1e-12)return result(null,'deg',frameId,'UNKNOWN: coincident points do not define an angle.');
  return result(Math.acos(Math.max(-1,Math.min(1,dot(normalized(u),normalized(w)))))*180/Math.PI,'deg',frameId,'Angle in declared reconstruction frame; surface orientation remains idealized.');
}
/** Exact convex intersection polygon in the box frame. Normal need not be unit length. */
export function sectionBox(box:BoxGeometry,plane:SectionPlane):Vec3[] {
  if(!Number.isFinite(plane.offset)||!Array.isArray(plane.normal)||plane.normal.length!==3||!plane.normal.every(Number.isFinite)||Math.hypot(...plane.normal)<1e-12)throw new Error('Invalid section plane');
  const magnitude=Math.hypot(...plane.normal);if(!Number.isFinite(magnitude))throw new Error('Invalid section magnitude');plane={...plane,normal:plane.normal.map(v=>v/magnitude) as Vec3,offset:plane.offset/magnitude};
  if(!Array.isArray(box.min)||!Array.isArray(box.max)||box.min.length!==3||box.max.length!==3||box.min.some((v,i)=>!Number.isFinite(v)||!Number.isFinite(box.max[i])||v>box.max[i]))throw new Error('Invalid box');
  const corners:Vec3[]=Array.from({length:8},(_,i)=>[i&1?box.max[0]:box.min[0],i&2?box.max[1]:box.min[1],i&4?box.max[2]:box.min[2]]);
  const points:Vec3[]=[];const add=(p:Vec3)=>{if(!points.some(q=>distance(p,q)<1e-9))points.push(p);};
  for(let i=0;i<8;i++)for(const bit of [1,2,4])if(!(i&bit)){
    const a=corners[i],b=corners[i|bit],da=dot(plane.normal,a)-plane.offset,db=dot(plane.normal,b)-plane.offset;
    if(Math.abs(da)<1e-10)add(a);if(Math.abs(db)<1e-10)add(b);
    if(da*db<0){const t=da/(da-db);add(a.map((v,k)=>v+(b[k]-v)*t) as Vec3);}
  }
  if(points.length<3)return points;
  const center=points.reduce<Vec3>((sum,p)=>sum.map((v,i)=>v+p[i]/points.length) as Vec3,[0,0,0]);
  const n=normalized(plane.normal),u=normalized(cross(n,Math.abs(n[0])<.9?[1,0,0]:[0,1,0])),v=cross(n,u);
  return points.sort((a,b)=>Math.atan2(dot(subtract(a,center),v),dot(subtract(a,center),u))-Math.atan2(dot(subtract(b,center),v),dot(subtract(b,center),u)));
}
export function polygonArea(points:Vec3[]):number {
  if(points.length<3)return 0;let sum:Vec3=[0,0,0];for(let i=0;i<points.length;i++){const c=cross(points[i],points[(i+1)%points.length]);sum=sum.map((v,k)=>v+c[k]) as Vec3;}return Math.hypot(...sum)/2;
}
/** Fail-closed trust boundary; imports do not resolve unknown datums or promote authority. */
export function importCanonicalAssembly(input:unknown):EvidenceAssembly {
  if(typeof input==='string'&&new TextEncoder().encode(input).length>8_000_000)throw new Error('Assembly exceeds 8 MB');
  const data=typeof input==='string'?JSON.parse(input):input;
  assertSafeDocument(data);
  if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('Invalid assembly document');
  const a=data as EvidenceAssembly;
  if(a.schemaVersion!=='giza.evidence-assembly.v1'||typeof a.id!=='string'||typeof a.title!=='string')throw new Error('Invalid assembly identity/version');
  for(const key of ['frames','transforms','sources','observations','features','constraints','audit','limitations'] as const)if(!Array.isArray(a[key])||a[key].length>10000)throw new Error(`Invalid ${key}`);
  const unique=(rows:{id:string}[],name:string)=>{const ids=rows.map(r=>r?.id);if(ids.some(id=>typeof id!=='string'||!id)||new Set(ids).size!==ids.length)throw new Error(`Invalid/duplicate ${name} ids`);};
  for(const key of ['frames','transforms','sources','observations','features','constraints','audit'] as const)unique(a[key],key);
  const ids=new Set(a.frames.map(f=>f.id)),observationIds=new Set(a.observations.map(o=>o.id));
  const sourceIds=new Set(a.sources.map(s=>s.id)),featureIds=new Set(a.features.map(f=>f.id));
  if(!ids.has(a.authoritativeFrameId))throw new Error('Undeclared authoritative frame');
  const finitePoint=(p:unknown):p is Vec3=>Array.isArray(p)&&p.length===3&&p.every(v=>typeof v==='number'&&Number.isFinite(v));
  const uncertainty=(u:Uncertainty)=>{if(!u||!['KNOWN','UNKNOWN'].includes(u.status)||typeof u.unit!=='string'||typeof u.note!=='string'||(u.status==='UNKNOWN'?u.value!==null:typeof u.value!=='number'||!Number.isFinite(u.value)||u.value<0))throw new Error('Invalid uncertainty');};
  const authority=(v:unknown)=>{if(!['OBSERVED','RECONSTRUCTED','HYPOTHESIS'].includes(String(v)))throw new Error('Invalid reality authority');};
  for(const f of a.frames){if(f.units!=='m'||f.handedness!=='RIGHT_HANDED'||!f.axes||f.axes.x!=='+EAST'||f.axes.y!=='+NORTH'||f.axes.z!=='+UP'||typeof f.datum!=='string'||!['DEFINED','UNRESOLVED'].includes(f.status))throw new Error('Frame normalization/datum invalid');authority(f.authority);}
  for(const t of a.transforms){
    if(!ids.has(t.from)||!ids.has(t.to)||!['AUTHORITATIVE_RECONSTRUCTION','COMPARISON_ONLY'].includes(t.scope)||!['RESOLVED','UNRESOLVED'].includes(t.status))throw new Error('Invalid transform edge');
    if(t.status==='RESOLVED'){if(!t.matrix)throw new Error('Missing transform matrix');validateRigidMatrix(t.matrix);}else if(t.matrix!==null)throw new Error('Unresolved transform must have null matrix');
    if(!Array.isArray(t.observationIds)||t.observationIds.some(id=>!observationIds.has(id)))throw new Error('Invalid transform observation binding');
    uncertainty(t.uncertainty);authority(t.authority);
  }
  for(const s of a.sources)if(typeof s.title!=='string'||typeof s.url!=='string'||(s.url!==''&&!/^https?:\/\//i.test(s.url))||s.byteStatus!=='UNKNOWN')throw new Error('Invalid source metadata / unsupported custody claim');
  for(const o of a.observations)validateObservation(o,sourceIds);
  for(const f of a.features){
    validateFeatureSupport(f,a.observations);
    if(!ids.has(f.frameId)||!Array.isArray(f.observationIds)||f.observationIds.some(id=>!observationIds.has(id)))throw new Error('Invalid feature binding');
    if(f.value!==null&&(typeof f.value!=='number'||!Number.isFinite(f.value)))throw new Error('Invalid feature scalar');
    authority(f.authority);uncertainty(f.uncertainty);const g=f.geometry;
    if(!g||!['box','surface','segment','point','unknown'].includes(g.kind))throw new Error('Invalid feature geometry');
    if(g.kind==='box'&&(!finitePoint(g.min)||!finitePoint(g.max)||g.min.some((v,i)=>v>g.max[i])))throw new Error('Invalid box');
    if(g.kind==='surface'&&(!Array.isArray(g.vertices)||g.vertices.length<3||g.vertices.length>1000||!g.vertices.every(finitePoint)))throw new Error('Invalid surface');
    if(g.kind==='surface')polygonProjection(g.vertices);
    if(g.kind==='box'&&g.min.some((v,i)=>v>=g.max[i]))throw new Error('Degenerate box');
    if(g.kind==='segment'&&finitePoint(g.a)&&finitePoint(g.b)&&distance(g.a,g.b)<=geometryTolerance([g.a,g.b]))throw new Error('Degenerate segment');
    if(g.kind==='segment'&&(!finitePoint(g.a)||!finitePoint(g.b)))throw new Error('Invalid segment');
    if(g.kind==='point'&&!finitePoint(g.point))throw new Error('Invalid point');
    if(g.kind==='unknown'&&typeof g.reason!=='string')throw new Error('UNKNOWN requires reason');
    if(f.coordinateAuthority!=='RECONSTRUCTED'&&f.coordinateAuthority!=='UNKNOWN')throw new Error('Survey coordinate authority cannot be inferred');
  }
  for(const c of a.constraints)if(!Array.isArray(c.featureIds)||c.featureIds.some(id=>!featureIds.has(id))||!Array.isArray(c.observationIds)||c.observationIds.some(id=>!observationIds.has(id))||!['SATISFIED','VIOLATED','UNKNOWN'].includes(c.status)||c.value!==null&&(typeof c.value!=='number'||!Number.isFinite(c.value)))throw new Error('Invalid constraint');
  for(const audit of a.audit)if(!Array.isArray(audit.observationIds)||audit.observationIds.some(id=>!observationIds.has(id))||[audit.legacyValue,audit.detailValue,audit.difference].some(v=>v!==null&&(typeof v!=='number'||!Number.isFinite(v))))throw new Error('Invalid transform audit');
  // Explore every connected component, including cycles with no route to the assembly frame.
  for(const f of a.frames)for(const scope of ['AUTHORITATIVE_RECONSTRUCTION','COMPARISON_ONLY'] as const){const other=a.frames.find(t=>t.id!==f.id);if(other)resolveTransform(a.frames,a.transforms,f.id,other.id,scope);}
  return JSON.parse(JSON.stringify({schemaVersion:a.schemaVersion,id:a.id,title:a.title,authoritativeFrameId:a.authoritativeFrameId,frames:a.frames,transforms:a.transforms,sources:a.sources,observations:a.observations,features:a.features,constraints:a.constraints,audit:a.audit,limitations:a.limitations})) as EvidenceAssembly;
}
/** Explicit document allowlist excludes top-level camera, selection and explode state. */
export function exportCanonicalAssembly(assembly:EvidenceAssembly):string {return JSON.stringify(importCanonicalAssembly(assembly),null,2);}
