import type { Part } from './model';

export const INTERIOR_SCOPES = [
  {id:'ALL',label:'Whole internal system'},
  {id:'upper',label:'Upper passages'},
  {id:'lower',label:'Lower passages & chamber'},
  {id:'burial',label:'Burial chamber & sarcophagus'},
] as const;
export type InteriorScope = typeof INTERIOR_SCOPES[number]['id'];
export function interiorParts(parts:Part[],scope:InteriorScope):Part[] {
  return parts.filter(p=>p.provenance.class!=='UNVERIFIED' && p.detail_tier!=='hidden' &&
    (scope==='ALL'?/^part\.(upper|lower|burial|sarcophagus)\./.test(p.id):
      scope==='burial'?/^part\.(burial|sarcophagus)\./.test(p.id):p.id.startsWith(`part.${scope}.`)));
}
// Conservative bounds around primitive envelopes; not a new survey measurement.
export function inspectionBounds(parts:Part[],explode=0) {
  const low=[Infinity,Infinity,Infinity],high=[-Infinity,-Infinity,-Infinity];
  for(const p of parts){
    const g=p.spatial.primitive;
    const radius=g.kind==='box'?Math.hypot(g.sx,g.sy,g.sz)/2:Math.hypot(g.radius,g.height/2);
    const vectorLength=Math.hypot(...p.spatial.explosion_vector)||1;
    p.spatial.origin_m.forEach((value,i)=>{
      const center=value+p.spatial.explosion_vector[i]/vectorLength*p.spatial.explosion_distance_m*explode;
      low[i]=Math.min(low[i],center-radius);high[i]=Math.max(high[i],center+radius);
    });
  }
  return parts.length?{target:low.map((v,i)=>(v+high[i])/2) as [number,number,number],radius:Math.hypot(...low.map((v,i)=>high[i]-v))/2}:{target:[0,0,0] as [number,number,number],radius:10};
}
