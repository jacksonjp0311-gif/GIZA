export const G = 6.67430e-11;
export const MICROGAL_PER_MPS2 = 1e8;

export function pointMassGzMicrogal(massKg, center, observation) {
  const dx = center[0] - observation[0];
  const dy = center[1] - observation[1];
  const dz = center[2] - observation[2];
  const r2 = dx*dx + dy*dy + dz*dz;
  if (r2 <= 1e-12) return 0;
  const r = Math.sqrt(r2);
  return G * massKg * dz / (r2 * r) * MICROGAL_PER_MPS2;
}

function rotateXYZ([x,y,z], [roll,pitch,yaw]) {
  // Intrinsic XYZ / roll-pitch-yaw, equivalent to Rz(yaw) Ry(pitch) Rx(roll).
  const cr=Math.cos(roll), sr=Math.sin(roll);
  const cp=Math.cos(pitch), sp=Math.sin(pitch);
  const cy=Math.cos(yaw), sy=Math.sin(yaw);
  const x1=x;
  const y1=cr*y-sr*z;
  const z1=sr*y+cr*z;
  const x2=cp*x1+sp*z1;
  const y2=y1;
  const z2=-sp*x1+cp*z1;
  return [cy*x2-sy*y2, sy*x2+cy*y2, z2];
}

export function boxElements(part, densityContrastKgM3, targetCellM=12) {
  const prim=part.spatial.primitive;
  if (prim.kind !== 'box') throw new Error('boxElements requires box primitive');
  const nx=Math.max(1, Math.ceil(prim.sx/targetCellM));
  const ny=Math.max(1, Math.ceil(prim.sy/targetCellM));
  const nz=Math.max(1, Math.ceil(prim.sz/targetCellM));
  const dx=prim.sx/nx, dy=prim.sy/ny, dz=prim.sz/nz;
  const mass=densityContrastKgM3*dx*dy*dz;
  const out=[];
  for(let ix=0;ix<nx;ix++) for(let iy=0;iy<ny;iy++) for(let iz=0;iz<nz;iz++) {
    const local=[-prim.sx/2+(ix+.5)*dx, -prim.sy/2+(iy+.5)*dy, -prim.sz/2+(iz+.5)*dz];
    const r=rotateXYZ(local, part.spatial.rpy_rad ?? [0,0,0]);
    out.push({center:[part.spatial.origin_m[0]+r[0],part.spatial.origin_m[1]+r[1],part.spatial.origin_m[2]+r[2]],massKg:mass});
  }
  return out;
}

export function cylinderElements(part, densityContrastKgM3, targetCellM=8) {
  const prim=part.spatial.primitive;
  if (prim.kind !== 'cylinder') throw new Error('cylinderElements requires cylinder primitive');
  // Narrow shafts are represented as a vertical stack of equal-mass disks.
  // This preserves exact volume/mass and is stable for surface stations whose scale
  // is large compared with the shaft radius. It is explicitly a first-order model.
  const nz=Math.max(1, Math.ceil(prim.height/targetCellM));
  const dz=prim.height/nz;
  const area=Math.PI*prim.radius*prim.radius;
  const mass=densityContrastKgM3*area*dz;
  const out=[];
  for(let iz=0;iz<nz;iz++) {
    const local=[0,0,-prim.height/2+(iz+.5)*dz];
    const r=rotateXYZ(local, part.spatial.rpy_rad ?? [0,0,0]);
    out.push({center:[part.spatial.origin_m[0]+r[0],part.spatial.origin_m[1]+r[1],part.spatial.origin_m[2]+r[2]],massKg:mass});
  }
  return out;
}

export function partElements(part, densityContrastKgM3, targetCellM=12) {
  const prim=part.spatial.primitive;
  if (prim.kind === 'box') return boxElements(part,densityContrastKgM3,targetCellM);
  if (prim.kind === 'cylinder') return cylinderElements(part,densityContrastKgM3,Math.min(targetCellM,8));
  throw new Error(`Unsupported primitive: ${prim.kind}`);
}

export function gravityAtObservation(elements, observation) {
  let gzUp=0;
  for(const e of elements) gzUp += pointMassGzMicrogal(e.massKg,e.center,observation);
  return {
    upward_delta_g_microgal: gzUp,
    conventional_downward_delta_g_microgal: -gzUp,
    magnitude_microgal: Math.abs(gzUp),
  };
}

export function regularGrid({xmin,xmax,ymin,ymax,step,z}) {
  const out=[];
  for(let y=ymin;y<=ymax+1e-9;y+=step) {
    for(let x=xmin;x<=xmax+1e-9;x+=step) out.push([Number(x.toFixed(9)),Number(y.toFixed(9)),z]);
  }
  return out;
}

export function runGrid(elements, observations) {
  return observations.map(obs=>({coordinates_m:obs,...gravityAtObservation(elements,obs)}));
}

export function summarizeGrid(points) {
  if(!points.length) return {min_microgal:0,max_microgal:0,max_magnitude_microgal:0,peak:null};
  let min=Infinity,max=-Infinity,peak=null,peakMag=-Infinity;
  for(const p of points) {
    const v=p.conventional_downward_delta_g_microgal;
    if(v<min) min=v;
    if(v>max) max=v;
    if(p.magnitude_microgal>peakMag){peakMag=p.magnitude_microgal;peak=p;}
  }
  return {min_microgal:min,max_microgal:max,max_magnitude_microgal:peakMag,peak};
}

export function totalVolume(parts) {
  let v=0;
  for(const p of parts) {
    const q=p.spatial.primitive;
    if(q.kind==='box') v+=q.sx*q.sy*q.sz;
    else if(q.kind==='cylinder') v+=Math.PI*q.radius*q.radius*q.height;
  }
  return v;
}
