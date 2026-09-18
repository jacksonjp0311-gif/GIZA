import type {FeatureGeometry,Vec3} from './types';
const sub=(a:Vec3,b:Vec3)=>a.map((v,i)=>v-b[i]) as Vec3;
const dot=(a:Vec3,b:Vec3)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a:Vec3,b:Vec3):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const finite=(p:unknown):p is Vec3=>Array.isArray(p)&&p.length===3&&p.every(v=>typeof v==='number'&&Number.isFinite(v));
/** Metre-frame floating-point tolerance, never archaeological uncertainty. */
export function geometryTolerance(points:Vec3[]){return Math.max(1e-7,64*Number.EPSILON*Math.max(1,...points.flat().map(Math.abs)));}
function onSegment(p:Vec3,a:Vec3,b:Vec3,tolerance:number){const ab=sub(b,a),length=Math.hypot(...ab);if(length<=tolerance)return false;const projection=dot(sub(p,a),ab)/length;return projection>=-tolerance&&projection<=length+tolerance&&Math.hypot(...cross(sub(p,a),ab))/length<=tolerance;}
export function polygonProjection(vertices:Vec3[]){
  if(!Array.isArray(vertices)||vertices.length<3||vertices.length>1000||!vertices.every(finite))throw new Error('Invalid polygon');
  const tolerance=geometryTolerance(vertices),origin=vertices[0];let normal:Vec3=[0,0,0];
  for(let i=1;i<vertices.length-1;i++){normal=cross(sub(vertices[i],origin),sub(vertices[i+1],origin));if(Math.hypot(...normal)>tolerance*tolerance)break;}
  const magnitude=Math.hypot(...normal);if(magnitude<=tolerance*tolerance)throw new Error('Degenerate polygon');normal=normal.map(v=>v/magnitude) as Vec3;
  if(vertices.some(p=>Math.abs(dot(sub(p,origin),normal))>tolerance))throw new Error('Nonplanar polygon');
  const drop=normal.map(Math.abs).indexOf(Math.max(...normal.map(Math.abs))),project=(p:Vec3)=>p.filter((_,i)=>i!==drop) as [number,number],points=vertices.map(project);
  const orient=(a:number[],b:number[],c:number[])=> (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  for(let i=0;i<vertices.length;i++){
    if(Math.hypot(...sub(vertices[i],vertices[(i+1)%vertices.length]))<=tolerance)throw new Error('Degenerate polygon edge');
    for(let j=i+1;j<vertices.length;j++)if(j!==i+1&&!(i===0&&j===vertices.length-1)){
      const a=points[i],b=points[(i+1)%points.length],c=points[j],d=points[(j+1)%points.length];
      const overlap=Math.max(Math.min(a[0],b[0]),Math.min(c[0],d[0]))<=Math.min(Math.max(a[0],b[0]),Math.max(c[0],d[0]))+tolerance&&Math.max(Math.min(a[1],b[1]),Math.min(c[1],d[1]))<=Math.min(Math.max(a[1],b[1]),Math.max(c[1],d[1]))+tolerance;
      if(overlap&&orient(a,b,c)*orient(a,b,d)<=0&&orient(c,d,a)*orient(c,d,b)<=0)throw new Error('Self-intersecting polygon');
    }
  }
  return {normal,origin,tolerance,points,project};
}
export function belongsToGeometry(g:FeatureGeometry,p:Vec3,computedSection=false):boolean {
  if(!finite(p)||g.kind==='unknown')return false;
  if(g.kind==='box'){
    if(!finite(g.min)||!finite(g.max)||g.min.some((v,i)=>v>=g.max[i]))return false;
    const t=geometryTolerance([g.min,g.max]);return p.every((v,i)=>v>=g.min[i]-t&&v<=g.max[i]+t)&&(computedSection||p.some((v,i)=>Math.abs(v-g.min[i])<=t||Math.abs(v-g.max[i])<=t));
  }
  if(computedSection)return false; // Current analytic caps are supported only on actual box solids.
  if(g.kind==='point')return finite(g.point)&&Math.hypot(...sub(p,g.point))<=geometryTolerance([g.point]);
  if(g.kind==='segment')return finite(g.a)&&finite(g.b)&&onSegment(p,g.a,g.b,geometryTolerance([g.a,g.b]));
  const {normal,origin,tolerance,points,project}=polygonProjection(g.vertices);
  if(Math.abs(dot(sub(p,origin),normal))>tolerance)return false;
  if(g.vertices.some((a,i)=>onSegment(p,a,g.vertices[(i+1)%g.vertices.length],tolerance)))return true; // Closed boundary.
  const q=project(p);let inside=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++){const a=points[i],b=points[j];if((a[1]>q[1])!==(b[1]>q[1])&&q[0]<(b[0]-a[0])*(q[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside;}
  return inside;
}
