/** Display-only state. Nothing in this module is accepted by the evidence solver. */
export type DisplayPoint=[number,number,number];
export interface InspectionPose { readonly purpose:'PRESENTATION_ONLY'; readonly translation:DisplayPoint }
export interface CameraBookmark { name:string;position:DisplayPoint;target:DisplayPoint }
export const REST_POSE:InspectionPose={purpose:'PRESENTATION_ONLY',translation:[0,0,0]};
export function inspectionPose(objectId:string,explode:number):InspectionPose{
  const distance=Number.isFinite(explode)?Math.min(3,Math.max(0,explode)):0;
  // Lid parking is an inspection stand, never a recovered position or a closed-fit solution.
  return {purpose:'PRESENTATION_ONLY',translation:objectId.includes('lid')?[1.7+distance*.6,0,.65+distance]:[0,0,0]};
}
export function displayPoint(physical:DisplayPoint,pose:InspectionPose):DisplayPoint{
  return physical.map((n,i)=>n+pose.translation[i]) as DisplayPoint;
}
export function physicalPoint(display:DisplayPoint,pose:InspectionPose):DisplayPoint{
  if(display.some(n=>!Number.isFinite(n)))throw new Error('Invalid picked coordinate');
  return display.map((n,i)=>n-pose.translation[i]) as DisplayPoint;
}
export function validateBookmark(value:unknown):CameraBookmark{
  if(!value||typeof value!=='object')throw new Error('Invalid camera bookmark');
  const b=value as Partial<CameraBookmark>;
  const valid=(p:unknown):p is DisplayPoint=>Array.isArray(p)&&p.length===3&&p.every(n=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<1e6);
  if(typeof b.name!=='string'||!b.name.trim()||b.name.length>80||!valid(b.position)||!valid(b.target)||Math.hypot(...b.position.map((n,i)=>n-b.target![i]))<.001)throw new Error('Invalid camera bookmark');
  return {name:b.name,position:[...b.position],target:[...b.target]};
}
