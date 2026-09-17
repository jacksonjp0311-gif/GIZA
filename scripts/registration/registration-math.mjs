export function solveLinear(A, b) {
  const n=A.length;
  const M=A.map((row,i)=>[...row,b[i]]);
  for(let col=0;col<n;col++){
    let pivot=col;
    for(let r=col+1;r<n;r++) if(Math.abs(M[r][col])>Math.abs(M[pivot][col])) pivot=r;
    if(Math.abs(M[pivot][col])<1e-12) throw new Error(`singular system at column ${col}`);
    [M[col],M[pivot]]=[M[pivot],M[col]];
    const div=M[col][col];
    for(let j=col;j<=n;j++) M[col][j]/=div;
    for(let r=0;r<n;r++){
      if(r===col) continue;
      const f=M[r][col];
      for(let j=col;j<=n;j++) M[r][j]-=f*M[col][j];
    }
  }
  return M.map(row=>row[n]);
}

function leastSquares(A,b){
  const m=A.length,n=A[0].length;
  const ata=Array.from({length:n},()=>Array(n).fill(0));
  const atb=Array(n).fill(0);
  for(let i=0;i<m;i++) for(let j=0;j<n;j++){
    atb[j]+=A[i][j]*b[i];
    for(let k=0;k<n;k++) ata[j][k]+=A[i][j]*A[i][k];
  }
  return solveLinear(ata,atb);
}

export function solveHomography(correspondences){
  if(correspondences.length<4) throw new Error('homography needs at least 4 correspondences');
  const A=[],b=[];
  for(const c of correspondences){
    const [u,v]=c.image_px; const [x,y]=c.plane_xy_m;
    A.push([u,v,1,0,0,0,-x*u,-x*v]); b.push(x);
    A.push([0,0,0,u,v,1,-y*u,-y*v]); b.push(y);
  }
  const h=leastSquares(A,b);
  return [[h[0],h[1],h[2]],[h[3],h[4],h[5]],[h[6],h[7],1]];
}

export function applyHomography(H,[u,v]){
  const w=H[2][0]*u+H[2][1]*v+H[2][2];
  return [(H[0][0]*u+H[0][1]*v+H[0][2])/w,(H[1][0]*u+H[1][1]*v+H[1][2])/w];
}

export function invert3x3(M){
  const [a,b,c]=M[0],[d,e,f]=M[1],[g,h,i]=M[2];
  const A=e*i-f*h,B=-(d*i-f*g),C=d*h-e*g;
  const D=-(b*i-c*h),E=a*i-c*g,F=-(a*h-b*g);
  const G=b*f-c*e,H=-(a*f-c*d),I=a*e-b*d;
  const det=a*A+b*B+c*C;
  if(Math.abs(det)<1e-14) throw new Error('singular 3x3');
  return [[A/det,D/det,G/det],[B/det,E/det,H/det],[C/det,F/det,I/det]];
}

export function reprojectionStats(H,correspondences){
  const Hinv=invert3x3(H); let sumPlane=0,sumPx=0,maxPlane=0,maxPx=0;
  const residuals=correspondences.map(c=>{
    const planePred=applyHomography(H,c.image_px);
    const imagePred=applyHomography(Hinv,c.plane_xy_m);
    const planeErr=Math.hypot(planePred[0]-c.plane_xy_m[0],planePred[1]-c.plane_xy_m[1]);
    const pxErr=Math.hypot(imagePred[0]-c.image_px[0],imagePred[1]-c.image_px[1]);
    sumPlane+=planeErr*planeErr; sumPx+=pxErr*pxErr; maxPlane=Math.max(maxPlane,planeErr); maxPx=Math.max(maxPx,pxErr);
    return {id:c.id ?? null,plane_error_m:planeErr,image_error_px:pxErr,plane_pred_m:planePred,image_pred_px:imagePred};
  });
  return {n:correspondences.length,plane_rmse_m:Math.sqrt(sumPlane/correspondences.length),reprojection_rmse_px:Math.sqrt(sumPx/correspondences.length),max_plane_error_m:maxPlane,max_reprojection_error_px:maxPx,residuals};
}
