import fs from 'node:fs';
import crypto from 'node:crypto';
import { partElements, regularGrid, runGrid, summarizeGrid, totalVolume } from './gravity-engine.mjs';

const cfgPath=process.argv[2] ?? 'public/model/simlab/experiments/gravity.deep-claim-conditional.json';
const cfg=JSON.parse(fs.readFileSync(cfgPath,'utf8'));
const partsDoc=JSON.parse(fs.readFileSync('public/model/parts.json','utf8'));
const snapshot=JSON.parse(fs.readFileSync('public/model/evidence/geometry_snapshot.json','utf8'));
const all=new Map(partsDoc.parts.map(p=>[p.id,p]));
const parts=cfg.part_ids.map(id=>{const p=all.get(id);if(!p) throw new Error(`missing part ${id}`);return p;});
for(const p of parts) if(cfg.require_unverified && p.provenance.class!=='UNVERIFIED') throw new Error(`${p.id}: expected UNVERIFIED`);

const densityContrast=cfg.density_contrast_kg_m3;
const elements=parts.flatMap(p=>partElements(p,densityContrast,cfg.integration.target_cell_m));
const observations=regularGrid(cfg.observation_grid);
const points=runGrid(elements,observations);
const summary=summarizeGrid(points);
const inputBasis={cfg,geometry_hash:snapshot.geometry_hash,part_ids:cfg.part_ids,density_contrast_kg_m3:densityContrast};
const inputHash=crypto.createHash('sha256').update(JSON.stringify(inputBasis)).digest('hex');
const runId=`run.gravity.${cfg.experiment_id}.${inputHash.slice(0,12)}`;

const componentVolumes=parts.map(p=>({id:p.id,primitive:p.spatial.primitive,volume_m3:totalVolume([p])}));
const result={
  run_id:runId,
  experiment_id:cfg.experiment_id,
  solver_id:'solver.gravity',
  solver_version:'0.9.0-direct-summation',
  provenance_class:'SIMULATED',
  truth_status:cfg.truth_status,
  geometry_revision:snapshot.geometry_revision,
  geometry_hash:snapshot.geometry_hash,
  input_hash:inputHash,
  parameters:{density_contrast_kg_m3:densityContrast,integration_method:'finite-volume point-element direct summation',target_cell_m:cfg.integration.target_cell_m,observation_height_m:cfg.observation_grid.z},
  controls:{primary_null:'no_void_density_contrast',null_prediction_microgal:0,additional_controls:cfg.controls},
  uncertainty:cfg.uncertainty,
  components:componentVolumes,
  total_modeled_void_volume_m3:totalVolume(parts),
  element_count:elements.length,
  observation_count:observations.length,
  summary,
  points,
  status:'COMPLETE',
  created_at:new Date().toISOString(),
  interpretation_guard:'This is a conditional forward prediction. It is not evidence that any UNVERIFIED component exists.',
};

fs.mkdirSync('public/model/simlab/results',{recursive:true});
fs.mkdirSync('public/model/solvers/runs',{recursive:true});
const resultPath=`public/model/simlab/results/${cfg.experiment_id}.json`;
const receiptPath=`public/model/solvers/runs/${runId}.json`;
fs.writeFileSync(resultPath,JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(receiptPath,JSON.stringify({...result,points:undefined,result_path:resultPath},null,2)+'\n');
console.log(`${resultPath}\n${receiptPath}\npeak=${summary.max_magnitude_microgal.toFixed(3)} microGal`);
