import fs from 'node:fs';
import crypto from 'node:crypto';
import { cavityModes, ductModes, screeningResponse, topPeaks, coincidenceClusters, cavityPressureField, perturbComponents, soundSpeedDryAir } from './acoustic-engine.mjs';

const cfgPath=process.argv[2] ?? 'public/model/simlab/experiments/acoustic.known-interiors-screening.json';
const cfg=JSON.parse(fs.readFileSync(cfgPath,'utf8'));
const partsDoc=JSON.parse(fs.readFileSync('public/model/parts.json','utf8'));
const snapshot=JSON.parse(fs.readFileSync('public/model/evidence/geometry_snapshot.json','utf8'));
const parts=new Map(partsDoc.parts.map(p=>[p.id,p]));
const soundSpeed=soundSpeedDryAir(cfg.atmosphere.temperature_c);

function serviceLength(p) {
  const path=p.spatial.service_path ?? [];
  if(path.length>=2) {
    let L=0;
    for(let i=1;i<path.length;i++) L+=Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1],path[i][2]-path[i-1][2]);
    return L;
  }
  const q=p.spatial.primitive;
  if(q.kind==='box') return Math.max(q.sx,q.sy,q.sz);
  return q.height;
}

const specs={};
const components=[];
for(const c of cfg.components) {
  const p=parts.get(c.part_id); if(!p) throw new Error(`missing ${c.part_id}`);
  if(p.provenance.class==='UNVERIFIED') throw new Error(`${c.part_id}: ECHO known-interior run cannot consume UNVERIFIED geometry`);
  const q=p.spatial.primitive;
  if(c.model==='CAVITY_BOX') {
    if(q.kind!=='box') throw new Error(`${p.id}: expected box`);
    const dims=[q.sx,q.sy,q.sz];
    specs[c.id]={kind:'cavity',dims};
    const ms=cavityModes({lx:dims[0],ly:dims[1],lz:dims[2],soundSpeed,maxHz:cfg.frequency.max_hz,maxOrder:cfg.frequency.max_mode_order});
    components.push({id:c.id,part_id:p.id,model:c.model,dims_m:dims,weight:c.weight,modes:ms,truth_note:c.truth_note});
  } else {
    const length=serviceLength(p);
    specs[c.id]={kind:'duct',length};
    const ms=ductModes({length,soundSpeed,maxHz:cfg.frequency.max_hz,boundary:c.boundary ?? 'OPEN_OPEN'});
    components.push({id:c.id,part_id:p.id,model:c.model,length_m:length,weight:c.weight,modes:ms,truth_note:c.truth_note});
  }
}

const freqs=[];
for(let f=cfg.frequency.min_hz;f<=cfg.frequency.max_hz+1e-9;f+=cfg.frequency.step_hz) freqs.push(Number(f.toFixed(6)));
const response=screeningResponse(components,freqs,cfg.loss_model.q_screening,cfg.response.first_modes_per_component);
const peaks=topPeaks(response,cfg.response.peak_count,cfg.response.min_peak_separation_hz);
const clusters=coincidenceClusters(components,cfg.coincidence);

const burial=parts.get('part.burial.chamber');
const burialComp=components.find(c=>c.id==='burial_chamber');
const selectedMode=burialComp.modes[0];
const pressureField=cavityPressureField({center:burial.spatial.origin_m,dims:burialComp.dims_m,mode:selectedMode.mode,nx:11,ny:7,nz:5});

// Deterministic null families. These are exploratory controls, not posteriors.
function buildComps(s) {
  return Object.entries(s).map(([id,v])=>({id,weight:cfg.components.find(c=>c.id===id)?.weight ?? 1,modes:v.kind==='cavity'
    ? cavityModes({lx:v.dims[0],ly:v.dims[1],lz:v.dims[2],soundSpeed,maxHz:cfg.frequency.max_hz,maxOrder:cfg.frequency.max_mode_order})
    : ductModes({length:v.length,soundSpeed,maxHz:cfg.frequency.max_hz,boundary:'OPEN_OPEN'})}));
}
const independent=[]; const constrained=[];
for(let i=0;i<cfg.controls.random_scenarios;i++) {
  const a=buildComps(perturbComponents(specs,cfg.controls.perturb_fraction,cfg.controls.seed+i,false));
  const b=buildComps(perturbComponents(specs,cfg.controls.perturb_fraction,cfg.controls.seed+i,true));
  independent.push(coincidenceClusters(a,cfg.coincidence).length);
  constrained.push(coincidenceClusters(b,cfg.coincidence).length);
}
function stats(values) {
  const mean=values.reduce((a,b)=>a+b,0)/values.length;
  const variance=values.reduce((s,x)=>s+(x-mean)**2,0)/values.length;
  const sorted=[...values].sort((a,b)=>a-b);
  return {n:values.length,mean,stddev:Math.sqrt(variance),min:sorted[0],max:sorted.at(-1),actual_percentile_le:values.filter(v=>v<=clusters.length).length/values.length};
}

const inputBasis={cfg,geometry_hash:snapshot.geometry_hash,component_ids:cfg.components.map(c=>c.part_id),sound_speed_m_s:soundSpeed};
const inputHash=crypto.createHash('sha256').update(JSON.stringify(inputBasis)).digest('hex');
const runId=`run.acoustic.${cfg.experiment_id}.${inputHash.slice(0,12)}`;
const result={
  run_id:runId,experiment_id:cfg.experiment_id,solver_id:'solver.acoustic',solver_version:'0.9.2-screening-analytic',provenance_class:'SIMULATED',
  truth_status:'CONDITIONAL_DERIVED_GEOMETRY',geometry_revision:snapshot.geometry_revision,geometry_hash:snapshot.geometry_hash,input_hash:inputHash,
  atmosphere:{...cfg.atmosphere,sound_speed_m_s:soundSpeed,model:'dry-air first-order screening'},
  boundary_model:{kind:'RIGID_WALL_SCREENING',passages:'OPEN_OPEN_1D_SCREENING',cavities:'RECTANGULAR_RIGID_ENVELOPE',warning:'Burial chamber gable and junction scattering are not resolved by this analytical screening model.'},
  loss_model:cfg.loss_model,frequency:cfg.frequency,
  components:components.map(c=>({...c,modes:c.modes.slice(0,cfg.output_modes_per_component)})),
  response:{kind:'SUMMED_LORENTZIAN_SCREENING_NOT_TRANSFER_FUNCTION',q:cfg.loss_model.q_screening,points:response,peaks},
  selected_visualization:{component_id:'burial_chamber',part_id:'part.burial.chamber',mode:selectedMode.mode,frequency_hz:selectedMode.frequency_hz,meaning:'Rigid-wall rectangular-envelope pressure mode',points:pressureField},
  coincidence_screen:{tolerance_hz:cfg.coincidence.toleranceHz,min_components:cfg.coincidence.minComponents,first_modes:cfg.coincidence.firstModes,actual_cluster_count:clusters.length,clusters:clusters.slice(0,20),independent_null:stats(independent),constraint_preserving_null:stats(constrained),interpretation:'Coincidence density is exploratory. Repeated passage lengths and construction constraints can create spectral coincidences without deliberate acoustic tuning.'},
  controls:{primary_null:'geometry perturbation family',random_scenarios:cfg.controls.random_scenarios,perturb_fraction:cfg.controls.perturb_fraction,seed:cfg.controls.seed,required_reference:'simple analytical tube/cavity benchmarks'},
  uncertainty:{kind:'SCENARIO_SENSITIVITY_NOT_POSTERIOR',dimension_measurement_uncertainty:'Use published uncertainty where available; unresolved chamber uncertainties are not replaced by zero.',atmosphere:'temperature parameterized; humidity/pressure refinement deferred'},
  status:'COMPLETE',created_at:new Date().toISOString(),
  human_summary:{
    headline:`Known Khafre interior screening predicts ${components.reduce((s,c)=>s+c.modes.length,0)} analytical modes below ${cfg.frequency.max_hz} Hz across ${components.length} components.`,
    burial_fundamental_hz:selectedMode.frequency_hz,
    lower_fundamental_hz:components.find(c=>c.id==='lower_chamber')?.modes[0]?.frequency_hz ?? null,
    first_pass_interpretation:clusters.length > 0 ? 'The geometry produces multiple low-frequency mode families and several near-coincidences. This is expected for coupled chambers/passages; controls are required before any tuning claim.' : 'No notable near-coincidence family appears in this screening model.',
    design_claim_status:'NOT_ESTABLISHED'
  },
  interpretation_guard:'Resonance is normal physical behavior. This screening result is not evidence of intentional acoustic design and does not promote any archaeological interpretation.'
};

fs.mkdirSync('public/model/simlab/results',{recursive:true});
fs.mkdirSync('public/model/solvers/runs',{recursive:true});
const resultPath=`public/model/simlab/results/${cfg.experiment_id}.json`;
const receiptPath=`public/model/solvers/runs/${runId}.json`;
fs.writeFileSync(resultPath,JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(receiptPath,JSON.stringify({...result,response:undefined,selected_visualization:undefined,result_path:resultPath},null,2)+'\n');
console.log(`${resultPath}\n${receiptPath}`);
console.log(`burial fundamental=${selectedMode.frequency_hz.toFixed(3)} Hz clusters=${clusters.length} null mean=${stats(independent).mean.toFixed(2)}`);
