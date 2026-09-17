import fs from 'node:fs';
import crypto from 'node:crypto';

const read = p => JSON.parse(fs.readFileSync(p,'utf8'));
const obsDoc = read('public/model/observatory/observations.json');
const constraints = read('public/model/control_net/survey_constraints.json');
const snapshot = read('public/model/evidence/geometry_snapshot.json');

const ids = [
  'obs.nell2006.khafre.north_casing_orientation',
  'obs.nell2006.khafre.east_casing_orientation',
  'obs.nell2006.khafre.south_casing_orientation',
  'obs.nell2006.khafre.west_casing_orientation'
];
const byId = new Map(obsDoc.observations.map(o=>[o.id,o]));
const sides = ids.map(id=>{
  const o=byId.get(id); if(!o) throw new Error(`missing observation ${id}`);
  return {id, dfc_arcmin:o.numeric.deviation_from_cardinality_arcmin, point_count:o.numeric.point_count, azimuth_deg:o.numeric.best_fit_azimuth_deg, source_id:o.source_id};
});
const repeat = byId.get('obs.nell2006.khafre.repeatability');
if(!repeat) throw new Error('missing repeatability observation');
const mean = sides.reduce((s,x)=>s+x.dfc_arcmin,0)/sides.length;
const residuals = sides.map(x=>x.dfc_arcmin-mean);
const rms = Math.sqrt(residuals.reduce((s,x)=>s+x*x,0)/residuals.length);
const maxAbs = Math.max(...residuals.map(Math.abs));
const spread = Math.max(...sides.map(x=>x.dfc_arcmin))-Math.min(...sides.map(x=>x.dfc_arcmin));
const points = sides.reduce((s,x)=>s+x.point_count,0);
const deg = mean/60;
const rad = deg*Math.PI/180;
const inputBasis={geometry_hash:snapshot.geometry_hash,sides,repeatability_arcmin:repeat.numeric.reported_repeatability_arcmin};
const inputHash=crypto.createHash('sha256').update(JSON.stringify(inputBasis)).digest('hex');
const receipt={
  receipt_id:'receipt.orientation.khafre.nell2006.rigid_square',
  version:'0.9.8',
  kind:'SURVEY_DERIVED_ORIENTATION_PRIOR',
  provenance_class:'DERIVED_FROM_MEASURED_TOTAL_STATION',
  source_observation_ids:ids,
  source_ids:[...new Set(sides.map(x=>x.source_id))],
  method:'unweighted least-squares common yaw of four casing-foundation DFC measurements; equivalent to arithmetic mean for equal side weights',
  input_geometry_hash:snapshot.geometry_hash,
  input_hash:inputHash,
  side_measurements:sides.map((x,i)=>({...x,residual_from_common_yaw_arcmin:residuals[i]})),
  result:{
    yaw_from_true_cardinal_arcmin:mean,
    yaw_from_true_cardinal_deg:deg,
    yaw_from_true_cardinal_rad:rad,
    rms_side_residual_arcmin:rms,
    max_abs_side_residual_arcmin:maxAbs,
    side_spread_arcmin:spread,
    aggregated_measured_point_count:points,
    reported_repeatability_arcmin:repeat.numeric.reported_repeatability_arcmin
  },
  uncertainty_interpretation:{
    repeatability_note:'The 0.2 arcmin figure is a reported repeatability check for a repeated >10-point line, not the total absolute yaw uncertainty.',
    side_residual_note:'The four side measurements are not identical; residuals are retained rather than forcing an exact square.',
    absolute_survey_context:'Nell & Ruggles report survey-grid agreement with true north within their own margins; this receipt does not re-estimate that full uncertainty budget.'
  },
  translation_status:'UNRESOLVED',
  vertical_status:'UNRESOLVED',
  scale_status:'EXISTING_MODEL_SCALE_NOT_REESTIMATED',
  geometry_write_authority:'ORIENTATION_PRIOR_ONLY',
  canonical_geometry_mutation:false,
  status:'ACCEPTED_AS_CONTROL_PRIOR',
  created_at:new Date().toISOString(),
  guard:'This receipt constrains a monument yaw prior only. It does not rotate parts.json, solve GPMP translation, establish elevation, or prove every masonry course shares the casing-foundation orientation.'
};
fs.mkdirSync('public/model/control_net',{recursive:true});
fs.writeFileSync('public/model/control_net/orientation_receipts.json',JSON.stringify({schema_version:'1.0.0',version:'0.9.8',receipts:[receipt]},null,2)+'\n');
console.log(JSON.stringify(receipt.result,null,2));
