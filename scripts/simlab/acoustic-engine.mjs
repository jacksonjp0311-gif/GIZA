export const DEFAULT_SOUND_SPEED_M_S = 343.2;

export function soundSpeedDryAir(tempC = 20) {
  // First-order screening relation. Humidity/pressure are deliberately not hidden
  // inside this approximation; richer atmospheric models belong in later solvers.
  return 331.3 + 0.606 * tempC;
}

export function cavityModes({ lx, ly, lz, soundSpeed = DEFAULT_SOUND_SPEED_M_S, maxHz = 250, maxOrder = 8 }) {
  const out = [];
  for (let m=0; m<=maxOrder; m++) for (let n=0; n<=maxOrder; n++) for (let p=0; p<=maxOrder; p++) {
    if (m===0 && n===0 && p===0) continue;
    const f = soundSpeed/2 * Math.sqrt((m/lx)**2 + (n/ly)**2 + (p/lz)**2);
    if (f <= maxHz) out.push({ frequency_hz:f, mode:[m,n,p] });
  }
  out.sort((a,b)=>a.frequency_hz-b.frequency_hz || String(a.mode).localeCompare(String(b.mode)));
  return out;
}

export function ductModes({ length, soundSpeed = DEFAULT_SOUND_SPEED_M_S, maxHz = 250, boundary = 'OPEN_OPEN' }) {
  const out=[];
  const divisor = boundary === 'CLOSED_OPEN' ? 4 : 2;
  if (boundary === 'CLOSED_OPEN') {
    for(let k=0;;k++) {
      const harmonic=2*k+1;
      const f=harmonic*soundSpeed/(divisor*length);
      if(f>maxHz) break;
      out.push({frequency_hz:f,mode:[harmonic],boundary});
    }
  } else {
    for(let n=1;;n++) {
      const f=n*soundSpeed/(divisor*length);
      if(f>maxHz) break;
      out.push({frequency_hz:f,mode:[n],boundary});
    }
  }
  return out;
}

export function lorentzianAmplitude(f, f0, q=12) {
  if (f0 <= 0) return 0;
  const r=f/f0;
  return 1 / Math.sqrt((1-r*r)**2 + (r/q)**2);
}

export function screeningResponse(components, frequencies, q=12, firstModes=8) {
  return frequencies.map(f=>{
    let sum=0;
    const contributions=[];
    for(const comp of components) {
      const ms=comp.modes.slice(0,firstModes);
      let c=0;
      for(const m of ms) c += comp.weight * lorentzianAmplitude(f,m.frequency_hz,q);
      sum += c;
      contributions.push({component_id:comp.id,amplitude:c});
    }
    contributions.sort((a,b)=>b.amplitude-a.amplitude);
    return {frequency_hz:f,screening_amplitude:sum,dominant_components:contributions.slice(0,3)};
  });
}

export function topPeaks(response, count=12, minSeparationHz=0.75) {
  const candidates=[];
  for(let i=1;i<response.length-1;i++) {
    if(response[i].screening_amplitude >= response[i-1].screening_amplitude && response[i].screening_amplitude >= response[i+1].screening_amplitude) candidates.push(response[i]);
  }
  candidates.sort((a,b)=>b.screening_amplitude-a.screening_amplitude);
  const picked=[];
  for(const p of candidates) {
    if(picked.every(x=>Math.abs(x.frequency_hz-p.frequency_hz)>=minSeparationHz)) picked.push(p);
    if(picked.length>=count) break;
  }
  return picked.sort((a,b)=>a.frequency_hz-b.frequency_hz);
}

export function coincidenceClusters(components, {firstModes=8,toleranceHz=0.35,minComponents=3}={}) {
  const data=[];
  for(const c of components) for(const m of c.modes.slice(0,firstModes)) data.push({f:m.frequency_hz,component_id:c.id,mode:m.mode});
  data.sort((a,b)=>a.f-b.f);
  const clusters=[];
  for(const datum of data) {
    const members=data.filter(x=>Math.abs(x.f-datum.f)<=toleranceHz);
    const ids=[...new Set(members.map(x=>x.component_id))];
    if(ids.length<minComponents) continue;
    const center=members.reduce((s,x)=>s+x.f,0)/members.length;
    if(clusters.some(c=>Math.abs(c.frequency_hz-center)<=toleranceHz)) continue;
    clusters.push({frequency_hz:center,component_count:ids.length,components:ids,members});
  }
  return clusters;
}

export function cavityPressureField({center,dims,mode=[1,0,0],nx=11,ny=7,nz=5}) {
  const [cx,cy,cz]=center; const [lx,ly,lz]=dims; const [m,n,p]=mode;
  const points=[];
  for(let ix=0;ix<nx;ix++) for(let iy=0;iy<ny;iy++) for(let iz=0;iz<nz;iz++) {
    const ux=(ix+.5)/nx, uy=(iy+.5)/ny, uz=(iz+.5)/nz;
    const pressure=Math.cos(m*Math.PI*ux)*Math.cos(n*Math.PI*uy)*Math.cos(p*Math.PI*uz);
    points.push({coordinates_m:[cx+(ux-.5)*lx,cy+(uy-.5)*ly,cz+(uz-.5)*lz],normalized_pressure:pressure});
  }
  return points;
}

export function deterministicRng(seed=49382) {
  let x=seed>>>0;
  return () => {
    x = (1664525*x + 1013904223) >>> 0;
    return x/4294967296;
  };
}

export function perturbComponents(componentSpecs, amplitude=0.05, seed=49382, grouped=false) {
  const r=deterministicRng(seed);
  const factor=()=>1 + (r()*2-1)*amplitude;
  const out=JSON.parse(JSON.stringify(componentSpecs));
  const groupedIds = new Set();
  if(grouped) {
    for(const group of [['lower_horizontal_bc','lower_horizontal_ce'],['upper_entrance_existing','lower_entrance_existing']]) {
      const f=factor();
      for(const id of group) if(out[id]?.kind==='duct') { out[id].length *= f; groupedIds.add(id); }
    }
  }
  for(const [id,s] of Object.entries(out)) {
    if(groupedIds.has(id)) continue;
    if(s.kind==='cavity') s.dims=s.dims.map(v=>v*factor());
    else s.length*=factor();
  }
  return out;
}
