function solveLinear(A,b){
  const n=A.length;
  const M=A.map((row,i)=>[...row,b[i]]);
  for(let col=0;col<n;col++){
    let pivot=col;
    for(let r=col+1;r<n;r++) if(Math.abs(M[r][col])>Math.abs(M[pivot][col])) pivot=r;
    if(Math.abs(M[pivot][col])<1e-12) throw new Error('singular linear system');
    [M[col],M[pivot]]=[M[pivot],M[col]];
    const q=M[col][col];
    for(let c=col;c<=n;c++) M[col][c]/=q;
    for(let r=0;r<n;r++){
      if(r===col) continue;
      const f=M[r][col]; if(Math.abs(f)<1e-18) continue;
      for(let c=col;c<=n;c++) M[r][c]-=f*M[col][c];
    }
  }
  return M.map(row=>row[n]);
}
function leastSquares(A,b){
  const m=A.length,n=A[0].length;
  const AtA=Array.from({length:n},()=>Array(n).fill(0));
  const Atb=Array(n).fill(0);
  for(let r=0;r<m;r++) for(let i=0;i<n;i++){
    Atb[i]+=A[r][i]*b[r];
    for(let j=0;j<n;j++) AtA[i][j]+=A[r][i]*A[r][j];
  }
  return solveLinear(AtA,Atb);
}
export function projectPoint(P, xyz){
  const [X,Y,Z]=xyz;
  const d=P[2][0]*X+P[2][1]*Y+P[2][2]*Z+P[2][3];
  if(Math.abs(d)<1e-12) throw new Error('projective denominator near zero');
  return [
    (P[0][0]*X+P[0][1]*Y+P[0][2]*Z+P[0][3])/d,
    (P[1][0]*X+P[1][1]*Y+P[1][2]*Z+P[1][3])/d
  ];
}
export function solveProjectiveCamera(correspondences){
  if(!Array.isArray(correspondences)||correspondences.length<6) throw new Error('PROJECTIVE_CAMERA_DLT requires >=6 3D↔2D correspondences');
  const A=[],b=[];
  for(const c of correspondences){
    const [X,Y,Z]=c.world; const [u,v]=c.pixel;
    A.push([X,Y,Z,1, 0,0,0,0, -u*X,-u*Y,-u*Z]); b.push(u);
    A.push([0,0,0,0, X,Y,Z,1, -v*X,-v*Y,-v*Z]); b.push(v);
  }
  const p=leastSquares(A,b);
  const P=[p.slice(0,4),p.slice(4,8),[p[8],p[9],p[10],1]];
  return {kind:'PROJECTIVE_CAMERA_DLT',matrix_3x4:P,normalization:'p34=1',calibrated:false,euclidean_pose:false};
}
export function residualReport(P,correspondences){
  const rows=correspondences.map((c,i)=>{
    const predicted=projectPoint(P,c.world);
    const dx=predicted[0]-c.pixel[0],dy=predicted[1]-c.pixel[1];
    return {id:c.id??String(i),world:c.world,pixel_observed:c.pixel,pixel_predicted:predicted,dx_px:dx,dy_px:dy,error_px:Math.hypot(dx,dy)};
  });
  const rmse=Math.sqrt(rows.reduce((s,r)=>s+r.error_px*r.error_px,0)/rows.length);
  const max=Math.max(...rows.map(r=>r.error_px));
  return {count:rows.length,rmse_px:rmse,max_error_px:max,residuals:rows};
}
export function deterministicRng(seed=9801){
  let x=seed>>>0; return ()=>{x=(1664525*x+1013904223)>>>0;return x/4294967296};
}
