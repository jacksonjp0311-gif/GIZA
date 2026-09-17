/** Centered least-squares 2-D similarity. Avoids the uncentered normal equations. */
export function fitSimilarity(points) {
  if(!Array.isArray(points)||points.length<2)throw new Error('INSUFFICIENT_POINTS');
  const n=points.length;
  for(const p of points)for(const x of [p.source?.x,p.source?.y,p.target?.x,p.target?.y])if(!Number.isFinite(x))throw new Error('NONFINITE_COORDINATES');
  const mean=key=>({x:points.reduce((s,p)=>s+p[key].x,0)/n,y:points.reduce((s,p)=>s+p[key].y,0)/n});
  const c=mean('source'),d=mean('target'); let denom=0,na=0,nb=0;
  for(const p of points){const x=p.source.x-c.x,y=p.source.y-c.y,X=p.target.x-d.x,Y=p.target.y-d.y;denom+=x*x+y*y;na+=x*X+y*Y;nb+=x*Y-y*X;}
  if(!(denom>0))throw new Error('DEGENERATE_SOURCE');
  const a=na/denom,b=nb/denom;return {a,b,tx:d.x-a*c.x+b*c.y,ty:d.y-b*c.x-a*c.y,scale:Math.hypot(a,b),angle_deg:Math.atan2(b,a)*180/Math.PI};
}
export function applySimilarity(t,p){return {x:t.a*p.x-t.b*p.y+t.tx,y:t.b*p.x+t.a*p.y+t.ty};}
export function residuals(t,points){return points.map(p=>{const q=applySimilarity(t,p.source),dx=q.x-p.target.x,dy=q.y-p.target.y;return {id:p.id,sector:p.sector??'UNASSIGNED',dx,dy,error:Math.hypot(dx,dy),predicted:q,target:p.target};});}
export function summarizeResiduals(rows,normalizer=1){if(!rows.length||!Number.isFinite(normalizer)||normalizer<=0)throw new Error('INVALID_RESIDUAL_INPUT');const rms=Math.sqrt(rows.reduce((s,r)=>s+r.error*r.error,0)/rows.length),max=Math.max(...rows.map(r=>r.error));return {count:rows.length,rms,max,normalized_rms:rms/normalizer,normalized_max:max/normalizer};}
export function frameDiagonal(points){const xs=points.map(p=>p.target.x),ys=points.map(p=>p.target.y);return Math.hypot(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys));}
