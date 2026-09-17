import fs from 'node:fs';
import { partElements, gravityAtObservation } from './gravity-engine.mjs';

const parts=JSON.parse(fs.readFileSync('public/model/parts.json','utf8')).parts;
const byId=new Map(parts.map(p=>[p.id,p]));
const shaftIds=parts.filter(p=>p.id.startsWith('part.shaft.') && p.provenance.class==='UNVERIFIED').map(p=>p.id);
const termIds=['part.terminal.alpha','part.terminal.beta'];
const densities=[-2400,-2600,-2800];
const terminalSides=[70,80,90];
const terminalDepths=[680,720,760];
const stations=[
  [-150,0,5],[150,0,5],[0,0,5],[-70,-72,5],[-70,-24,5],[-70,24,5],[-70,72,5],[70,-72,5],[70,-24,5],[70,24,5],[70,72,5]
];
const scenarios=[];
for(const rho of densities) for(const side of terminalSides) for(const depth of terminalDepths){
  const selected=[];
  for(const id of shaftIds) selected.push(structuredClone(byId.get(id)));
  for(const id of termIds){
    const p=structuredClone(byId.get(id));
    p.spatial.origin_m[2]=-depth;
    p.spatial.primitive={kind:'box',sx:side,sy:side,sz:side};
    selected.push(p);
  }
  const elements=selected.flatMap(p=>partElements(p,rho,10));
  let peak=0;
  let peakStation=null;
  for(const station of stations){
    const g=gravityAtObservation(elements,station);
    if(g.magnitude_microgal>peak){peak=g.magnitude_microgal;peakStation=station;}
  }
  scenarios.push({density_contrast_kg_m3:rho,terminal_side_m:side,terminal_center_depth_m:depth,peak_screen_microgal:peak,peak_station_m:peakStation});
}
const vals=scenarios.map(x=>x.peak_screen_microgal).sort((a,b)=>a-b);
const result={
  id:'sensitivity.gravity.deep-claim.v0.9.0',
  kind:'SCENARIO_SENSITIVITY_NOT_POSTERIOR',
  provenance_class:'SIMULATED',
  parameters:{density_contrast_kg_m3:densities,terminal_side_m:terminalSides,terminal_center_depth_m:terminalDepths,shaft_geometry:'held at current UNVERIFIED model values'},
  station_count:stations.length,
  scenario_count:scenarios.length,
  summary:{min_peak_microgal:vals[0],median_peak_microgal:vals[Math.floor(vals.length/2)],max_peak_microgal:vals.at(-1)},
  scenarios,
  warning:'These ranges are deterministic stress-test assumptions, not confidence intervals and not a posterior distribution.'
};
fs.writeFileSync('public/model/simlab/results/gravity.deep-claim-sensitivity.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result.summary,null,2));
