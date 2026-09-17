import fs from 'node:fs';
import crypto from 'node:crypto';

const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const cfgPath=process.argv[2] ?? 'public/model/simlab/experiments/strata.deep-claim-screening.json';
const cfg=read(cfgPath);
const parts=read('public/model/parts.json').parts;
const snapshot=read('public/model/evidence/geometry_snapshot.json');
const material=read('public/model/research/material_properties.json');
const byId=new Map(parts.map(p=>[p.id,p]));
const g=cfg.parameters.gravity_m_s2;
const rhoRock=cfg.parameters.rock_density_kg_m3;
const rhoWater=cfg.parameters.water_density_kg_m3;
const ucs=material.properties.find(p=>p.quantity==='uniaxial_compressive_strength');
if(!ucs?.min || !ucs?.max) throw new Error('UCS prior range missing');
const stressMPa=d=>rhoRock*g*d/1e6;
const pressureMPa=d=>rhoWater*g*d/1e6;
const energyKWhM3=d=>rhoWater*g*d/3.6e6;

for(const id of cfg.components){
  const p=byId.get(id); if(!p) throw new Error(`missing ${id}`);
  if(p.provenance.class!=='UNVERIFIED') throw new Error(`${id} expected UNVERIFIED truth class`);
}

function mechanicalAt(depth){
  const s=stressMPa(depth);
  return {
    depth_m:depth,
    vertical_overburden_proxy_mpa:s,
    sample_ucs_mpa:{min:ucs.min,max:ucs.max},
    proxy_to_ucs_ratio:{best_case:s/ucs.max,worst_case:s/ucs.min},
    classification:s>ucs.max?'PROXY_EXCEEDS_SAMPLE_UCS_RANGE':s>=ucs.min?'PROXY_OVERLAPS_SAMPLE_UCS_RANGE':'PROXY_BELOW_SAMPLE_UCS_RANGE'
  };
}
function hydraulicAt(depth){
  return {
    depth_m:depth,
    hypothetical_freshwater_pressure_mpa:pressureMPa(depth),
    gravitational_potential_kwh_per_m3:energyKWhM3(depth),
    flow_rate_status:'NOT_COMPUTABLE_WITHOUT_PERMEABILITY_CONNECTIVITY_AND_BOUNDARY_HEAD'
  };
}

const shaftBottom=mechanicalAt(cfg.parameters.shaft_bottom_depth_m);
const terminal=mechanicalAt(cfg.parameters.terminal_center_depth_m);
const shaftHyd=hydraulicAt(cfg.parameters.shaft_bottom_depth_m);
const terminalHyd=hydraulicAt(cfg.parameters.terminal_center_depth_m);
const lower=byId.get('part.lower.chamber');
const lowerDepth=Math.abs(lower.spatial.origin_m[2]);
const knownReference=mechanicalAt(lowerDepth);
const densitySensitivity=cfg.controls.density_sensitivity_kg_m3.map(rho=>({
  rock_density_kg_m3:rho,
  shaft_bottom_mpa:rho*g*cfg.parameters.shaft_bottom_depth_m/1e6,
  terminal_center_mpa:rho*g*cfg.parameters.terminal_center_depth_m/1e6
}));

const field_points=[];
for(const id of cfg.components.filter(id=>id.includes('shaft.'))){
  const p=byId.get(id); const [x,y]=p.spatial.origin_m;
  for(let d=0;d<=cfg.parameters.shaft_bottom_depth_m;d+=cfg.parameters.vertical_sample_step_m){
    field_points.push({component_id:id,coordinates_m:[x,y,-d],depth_m:d,stress_mpa:stressMPa(d),hydraulic_pressure_mpa:pressureMPa(d)});
  }
}
for(const id of cfg.components.filter(id=>id.includes('terminal.'))){
  const p=byId.get(id); const [x,y,z]=p.spatial.origin_m; const d=Math.abs(z);
  field_points.push({component_id:id,coordinates_m:[x,y,z],depth_m:d,stress_mpa:stressMPa(d),hydraulic_pressure_mpa:pressureMPa(d)});
}

const inputBasis={cfg,geometry_hash:snapshot.geometry_hash,material_version:material.version,ucs:[ucs.min,ucs.max]};
const inputHash=crypto.createHash('sha256').update(JSON.stringify(inputBasis)).digest('hex');
const runId=`run.strata.${cfg.experiment_id}.${inputHash.slice(0,12)}`;
const result={
  run_id:runId,experiment_id:cfg.experiment_id,solver_id:'solver.strata',solver_version:'0.9.3-screening-analytic',provenance_class:'SIMULATED',
  truth_status:'CONDITIONAL_UNVERIFIED_GEOMETRY',geometry_revision:snapshot.geometry_revision,geometry_hash:snapshot.geometry_hash,input_hash:inputHash,
  parameters:cfg.parameters,material_prior:{source_id:material.source_id,scope:material.material_scope,ucs_mpa:{min:ucs.min,max:ucs.max},warning:material.model_warning},
  geomechanics:{kind:'VERTICAL_OVERBURDEN_PROXY_NOT_FEA',shaft_bottom:shaftBottom,terminal_center:terminal,known_lower_chamber_reference:knownReference,density_sensitivity:densitySensitivity,
    warning:'Vertical rho*g*h is a screening proxy only. It omits in-situ horizontal stress, discontinuities, cavity shape stress concentration, support, anisotropy, water weakening, scale effects and excavation history. Ratios are NOT factors of safety.'},
  hydraulics:{kind:'STATIC_FRESHWATER_HEAD_IF_FILLED',shaft_bottom:shaftHyd,terminal_center:terminalHyd,dry_null_pressure_mpa:0,
    warning:'Pressure and potential energy are conditional on a connected water column. No flooding, permeability, recharge, discharge or usable flow rate is established.'},
  field_points,controls:cfg.controls,
  uncertainty:{kind:'SCREENING_PRIOR_RANGE_NOT_POSTERIOR',rock_strength:'sample-level Khafre backing-limestone range only',hydraulic:'permeability/connectivity/head boundaries unresolved',geometry:'deep components remain UNVERIFIED'},
  human_summary:{
    headline:'Deep conditional geometry enters a high-overburden regime and would require explicit rock-mass and groundwater evidence before structural or hydraulic claims are credible.',
    shaft_bottom_stress_mpa:shaftBottom.vertical_overburden_proxy_mpa,
    terminal_center_stress_mpa:terminal.vertical_overburden_proxy_mpa,
    shaft_bottom_water_pressure_mpa:shaftHyd.hypothetical_freshwater_pressure_mpa,
    terminal_center_water_pressure_mpa:terminalHyd.hypothetical_freshwater_pressure_mpa,
    flow_status:'UNRESOLVED',stability_status:'UNRESOLVED_REQUIRES_ROCK_MASS_MODEL'
  },
  status:'COMPLETE',created_at:new Date().toISOString(),
  interpretation_guard:cfg.guard
};
fs.mkdirSync('public/model/simlab/results',{recursive:true});
fs.mkdirSync('public/model/solvers/runs',{recursive:true});
const resultPath=`public/model/simlab/results/${cfg.experiment_id}.json`;
const receiptPath=`public/model/solvers/runs/${runId}.json`;
fs.writeFileSync(resultPath,JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(receiptPath,JSON.stringify({...result,field_points:undefined,result_path:resultPath},null,2)+'\n');
console.log(resultPath); console.log(receiptPath);
console.log(`shaft=${shaftBottom.vertical_overburden_proxy_mpa.toFixed(3)} MPa terminal=${terminal.vertical_overburden_proxy_mpa.toFixed(3)} MPa water648=${shaftHyd.hypothetical_freshwater_pressure_mpa.toFixed(3)} MPa`);
