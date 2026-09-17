import fs from 'node:fs';
import crypto from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const errors=[];
const manifest=read('public/model/control_net/manifest.json');
const frames=read('public/model/control_net/frames.json');
const constraints=read('public/model/control_net/survey_constraints.json');
const points=read('public/model/control_net/survey_points.json');
const receipts=read('public/model/control_net/orientation_receipts.json');
const gates=read('public/model/control_net/quality_gates.json');
const benchmark=read('public/model/control_net/benchmarks/projective_camera.json');
const reg=read('public/model/registration/jobs.json');
const geo=read('public/model/field/geospatial_frame.json');
const parts=read('public/model/parts.json').parts;
const snap=read('public/model/evidence/geometry_snapshot.json');
const obs=read('public/model/observatory/observations.json').observations;
const byObs=new Map(obs.map(o=>[o.id,o]));
if(manifest.version!=='0.9.8')errors.push('CONTROL NET manifest version drift');
if(frames.version!=='0.9.8'||constraints.version!=='0.9.8'||points.version!=='0.9.8')errors.push('CONTROL NET dataset version drift');
const receipt=receipts.receipts.find(r=>r.receipt_id==='receipt.orientation.khafre.nell2006.rigid_square');
if(!receipt)errors.push('Khafre orientation receipt missing');
else{
  if(Math.abs(receipt.result.yaw_from_true_cardinal_arcmin+4.45)>1e-12)errors.push('Khafre yaw result drift');
  if(Math.abs(receipt.result.rms_side_residual_arcmin-0.7921489758877429)>1e-12)errors.push('orientation RMS residual drift');
  if(receipt.result.aggregated_measured_point_count!==54)errors.push('orientation measured point count drift');
  if(receipt.translation_status!=='UNRESOLVED')errors.push('orientation receipt improperly claims translation');
  if(receipt.canonical_geometry_mutation!==false)errors.push('orientation receipt claims geometry mutation');
  for(const id of receipt.source_observation_ids) if(!byObs.has(id))errors.push(`receipt references missing observation ${id}`);
}
if(!benchmark.pass)errors.push('projective-camera benchmark failed');
if(benchmark.solver_kind!=='PROJECTIVE_CAMERA_DLT')errors.push('benchmark solver kind changed');
if(gates.gates.projective_camera_dlt.calibrated_pose_claim_allowed!==false)errors.push('DLT gate allows calibrated pose claim');
const local=frames.frames.find(f=>f.id==='frame.giza.local');
if(local?.translation_to_gpmp_status!=='UNRESOLVED')errors.push('GIZA local translation prematurely resolved');
if(!String(geo.local_frame.status).includes('TRANSLATION_UNRESOLVED'))errors.push('FIELD geospatial status lost unresolved translation guard');
// Preserve published variants rather than averaging.
const g11=points.points.filter(p=>p.variant_group==='gpmp.g1_1');
if(g11.length<2)errors.push('G1.1 published coordinate variants not preserved');
else if(new Set(g11.map(p=>`${p.easting_m},${p.northing_m}`)).size<2)errors.push('G1.1 variants collapsed');
// Real registration jobs remain unsolved absent pixel controls.
for(const j of reg.jobs){
  if((j.pixel_controls?.length??0)===0 && ['SOLVED','QA_PASSED','REVIEWED','E2_POSE_CANDIDATE','PROMOTABLE'].includes(j.state))errors.push(`${j.id}: solved/promoted without pixel controls`);
  if(j.control_net?.pose_status && j.control_net.pose_status!=='UNSOLVED')errors.push(`${j.id}: real camera pose prematurely promoted`);
}
if(manifest.status.real_camera_poses_promoted!==0||manifest.status.photo_derived_geometry_promotions!==0)errors.push('CONTROL NET manifest claims real pose/geometry promotion');
if(parts.filter(p=>p.provenance?.class==='UNVERIFIED').length!==31)errors.push('deep-claim UNVERIFIED count changed');
// Verify geometry-bearing files against the frozen geometry snapshot.
for(const f of snap.files){
  const buf=fs.readFileSync(f.path); const h=crypto.createHash('sha256').update(buf).digest('hex');
  if(h!==f.sha256)errors.push(`canonical geometry file changed without new geometry freeze: ${f.path}`);
}
console.log(`CONTROL NET frames=${frames.frames.length} constraints=${constraints.constraints.length} points=${points.points.length} real_jobs=${reg.jobs.length} yaw=${receipt?.result?.yaw_from_true_cardinal_arcmin?.toFixed(2)} arcmin DLT=${benchmark.pass?'PASS':'FAIL'}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('PASS');
