/** GIZA 0.10.12: validated registration, shared by the CLI and local workbench.
 * Inputs are operator-supplied assertions with explicit provenance, not automatically
 * verified archaeological facts. No function here promotes canonical geometry.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fitSimilarity, residuals, summarizeResiduals, frameDiagonal } from './math.mjs';
export const VERSION = '0.10.12';
export const ROOTS = {
  candidates:'public/model/source_byte_registration/candidates.json',
  handoff:'public/model/plate_registration/custody_handoff.json',
  campaign:'public/model/plate_registration/first_plate_campaign.json',
  profile:'public/model/plate_registration/preregistered_thresholds.json',
  template:'public/model/plate_registration/landmark_protocol.json',
  sources:'public/model/evidence/source_registry.json',
  result:'public/model/plate_registration/first_plate_result.json',
  frozen:'public/model/plate_registration/frozen_experiment.json',
};
export class GateError extends Error { constructor(code, message=code) { super(message); this.name='GateError'; this.code=code; } }
export function requireGate(test, code, message=code) { if(!test) throw new GateError(code,message); }
export function canonical(value) {
  if(Array.isArray(value)) return '['+value.map(canonical).join(',')+']';
  if(value && typeof value==='object') return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
  return JSON.stringify(value);
}
export const sha = data => crypto.createHash('sha256').update(data).digest('hex');
export const hashObject = data => sha(canonical(data));
export function inside(root, relative) {
  requireGate(typeof relative==='string' && relative.length>0 && !path.isAbsolute(relative),'UNSAFE_PATH');
  const base=path.resolve(root), full=path.resolve(base,relative);
  requireGate(full.startsWith(base+path.sep),'UNSAFE_PATH');
  // Reject symlink escapes for all existing ancestors, including not-yet-created outputs.
  let ancestor=full; while(!fs.existsSync(ancestor) && ancestor!==base) ancestor=path.dirname(ancestor);
  const resolved=fs.realpathSync(ancestor), realBase=fs.realpathSync(base);
  requireGate(resolved===realBase||resolved.startsWith(realBase+path.sep),'UNSAFE_SYMLINK');
  return full;
}
export function readJson(root, rel) { return JSON.parse(fs.readFileSync(inside(root,rel),'utf8')); }
export function atomicJson(root, rel, data) {
  const dest=inside(root,rel); fs.mkdirSync(path.dirname(dest),{recursive:true});
  const tmp=dest+'.'+crypto.randomBytes(6).toString('hex')+'.tmp';
  try { fs.writeFileSync(tmp,JSON.stringify(data,null,2)+'\n',{flag:'wx'}); fs.renameSync(tmp,dest); }
  finally { if(fs.existsSync(tmp))fs.unlinkSync(tmp); }
}
function exclusiveJson(root, rel, data) {
  const dest=inside(root,rel);fs.mkdirSync(path.dirname(dest),{recursive:true});
  try { fs.writeFileSync(dest,JSON.stringify(data,null,2)+'\n',{flag:'wx'}); }
  catch(e) { if(e.code==='EEXIST')throw new GateError('EXPERIMENT_ALREADY_EXISTS');throw e; }
}
export function knownSource(root, p, code='TARGET_PROVENANCE_REQUIRED') {
  requireGate(p && typeof p==='object' && !Array.isArray(p),code,'Specify a source ID, locator, and independence assertion.');
  const known=new Set(readJson(root,ROOTS.sources).sources.map(s=>s.id));
  requireGate(known.has(p.source_id),code,'The target source ID must exist in the source registry.');
  requireGate(typeof p.locator==='string' && p.locator.trim().length>=3,code,'A specific source locator is required.');
  requireGate(p.independent_of_fit===true,code,'Target coordinates must be independent of this fit.');
  requireGate(!/^(unknown|none|todo|unspecified|replace)/i.test(p.locator.trim()),code);
  return {source_id:p.source_id,locator:p.locator.trim(),independent_of_fit:true};
}
function bytesChecked(root, rel, expected, error) {
  requireGate(typeof expected==='string'&&/^[0-9a-f]{64}$/.test(expected),error);
  const full=inside(root,rel);requireGate(fs.existsSync(full),error);
  const b=fs.readFileSync(full);requireGate(sha(b)===expected,error);
  return b;
}
export function verifyCustody(root) {
  const handoff=readJson(root,ROOTS.handoff);
  const candidate=readJson(root,ROOTS.candidates).candidates.find(c=>c.id===handoff.accepted_candidate_id);
  requireGate(candidate?.raw_byte_verified===true,'SOURCE_BYTES_NOT_CHECKSUM_BOUND','Import and hash the source PDF first.');
  const source=bytesChecked(root,candidate.local_path,candidate.sha256,'SOURCE_SHA256_MISMATCH');
  requireGate(source.subarray(0,5).toString()==='%PDF-','SOURCE_NOT_PDF');
  const custody=handoff.local_custody;
  requireGate(custody.sha256===candidate.sha256&&custody.path===candidate.local_path,'CUSTODY_SOURCE_MISMATCH');
  requireGate(custody.visual_confirmation===true,'PLATE_VISUAL_CONFIRMATION_REQUIRED');
  const render=bytesChecked(root,custody.plate_vi_render_path,custody.plate_vi_render_sha256,'RENDER_SHA256_MISMATCH');
  requireGate(render.length>=24&&render.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'RENDER_NOT_PNG');
  requireGate(custody.render_source_sha256===candidate.sha256,'RENDER_SOURCE_BINDING_MISSING');
  const width=render.readUInt32BE(16),height=render.readUInt32BE(20);
  requireGate(width>0&&height>0,'RENDER_INVALID_DIMENSIONS');
  return {candidate,handoff,custody,width,height};
}
export function profileFor(root,id) {
  const p=readJson(root,ROOTS.profile).profiles.find(p=>p.id===id);
  requireGate(p?.fit_model==='SIMILARITY_2D','PROFILE_MISSING_OR_UNSUPPORTED');
  for(const key of ['minimum_controls','minimum_holdouts'])requireGate(Number.isInteger(p[key])&&p[key]>=2,'PROFILE_INVALID');
  for(const key of ['normalized_holdout_rms_max','normalized_holdout_max_max','absolute_holdout_rms_m_max','scale_drift_fraction_max'])requireGate(Number.isFinite(p.acceptance?.[key])&&p.acceptance[key]>0,'PROFILE_INVALID');
  return p;
}
function fullRank(points,key) {
  const xs=points.map(p=>p[key].x),ys=points.map(p=>p[key].y), mx=xs.reduce((s,v)=>s+v,0)/xs.length,my=ys.reduce((s,v)=>s+v,0)/ys.length;
  let xx=0,yy=0,xy=0; for(let i=0;i<xs.length;i++){const x=xs[i]-mx,y=ys[i]-my;xx+=x*x;yy+=y*y;xy+=x*y;}
  return xx>0 && yy>0 && (xx*yy-xy*xy)/(xx*yy)>1e-8;
}
export function validateCoordinates(root, controls, holdouts, profile, bounds=null) {
  requireGate(Array.isArray(controls)&&controls.length>=profile.minimum_controls,'PROFILE_CONTROL_MINIMUM',`${profile.id} requires ${profile.minimum_controls} controls.`);
  requireGate(Array.isArray(holdouts)&&holdouts.length>=profile.minimum_holdouts,'PROFILE_HOLDOUT_MINIMUM',`${profile.id} requires ${profile.minimum_holdouts} holdouts.`);
  const seenId=new Set(),seenPixel=new Set(),seenTarget=new Set();
  for(const p of [...controls,...holdouts]) {
    requireGate(typeof p.id==='string'&&!seenId.has(p.id),'DUPLICATE_LANDMARK'); seenId.add(p.id);
    for(const n of [p.source?.x,p.source?.y,p.target?.x,p.target?.y])requireGate(Number.isFinite(n),'NONFINITE_COORDINATES');
    const pix=`${p.source.x},${p.source.y}`,tar=`${p.target.x},${p.target.y}`;
    requireGate(!seenPixel.has(pix)&&!seenTarget.has(tar),'DUPLICATE_COORDINATES'); seenPixel.add(pix);seenTarget.add(tar);
    if(bounds)requireGate(p.source.x>=0&&p.source.y>=0&&p.source.x<=bounds.width&&p.source.y<=bounds.height,'PIXEL_OUTSIDE_RENDER');
    knownSource(root,p.target_source);
  }
  requireGate(fullRank(controls,'source')&&fullRank(controls,'target'),'DEGENERATE_CONTROLS','Controls must span a non-collinear two-dimensional area.');
  const mins=readJson(root,ROOTS.template).minimums;
  requireGate(new Set(controls.map(p=>p.sector)).size>=mins.control_sectors,'CONTROL_SECTOR_MINIMUM');
  requireGate(new Set(holdouts.map(p=>p.sector)).size>=mins.holdout_sectors,'HOLDOUT_SECTOR_MINIMUM');
}
function scaleExpectation(root, s) {
  requireGate(s&&Number.isFinite(s.meters_per_pixel)&&s.meters_per_pixel>0,'INDEPENDENT_SCALE_REQUIRED','Provide an independent meters-per-pixel expectation before freezing.');
  return {meters_per_pixel:s.meters_per_pixel,...knownSource(root,s,'SCALE_PROVENANCE_REQUIRED')};
}
function immutableContent(c) { return {schema_version:'2.0.0',campaign_id:c.campaign_id,candidate_id:c.candidate_id,target_frame:c.target_frame,pixel_axis:c.pixel_axis,source_sha256:c.source_sha256,render_sha256:c.render_sha256,threshold_profile_id:c.threshold_profile_id,profile_snapshot:c.profile_snapshot,scale_expectation:c.scale_expectation,controls:c.controls,holdouts:c.holdouts}; }
export function freezeLandmarks(root, input) {
  requireGate(!fs.existsSync(inside(root,ROOTS.frozen))&&!fs.existsSync(inside(root,ROOTS.result)),'EXPERIMENT_ALREADY_FROZEN','This experiment is immutable. Use a new project copy for a new experiment.');
  const current=readJson(root,ROOTS.campaign);
  requireGate(current.freeze_state!=='FROZEN_BEFORE_FIT'&&!(current.controls?.length),'EXPERIMENT_ALREADY_FROZEN');
  const {candidate,custody,width,height}=verifyCustody(root);
  requireGate(input.source_sha256===candidate.sha256,'LANDMARK_SOURCE_HASH_MISMATCH');
  requireGate(input.render_sha256===custody.plate_vi_render_sha256,'LANDMARK_RENDER_HASH_MISMATCH');
  const profile=profileFor(root,input.threshold_profile_id??current.threshold_profile_id);
  const scale=scaleExpectation(root,input.scale_expectation);
  requireGate(['Y_UP','Y_DOWN'].includes(input.pixel_axis),'PIXEL_AXIS_REQUIRED');
  requireGate(Array.isArray(input.landmarks),'LANDMARKS_ARRAY_REQUIRED');
  const template=new Map(readJson(root,ROOTS.template).landmarks.map(x=>[x.id,x]));
  const controls=[],holdouts=[];
  for(const x of input.landmarks) {
    requireGate(template.has(x.id),'UNKNOWN_LANDMARK');
    requireGate(['CONTROL','HOLDOUT'].includes(x.role),'LANDMARK_ROLE_REQUIRED');
    const row={id:x.id,sector:template.get(x.id).sector,source:{...x.source_px},target:{...x.target_m},target_source:knownSource(root,x.target_source)};
    (x.role==='CONTROL'?controls:holdouts).push(row);
  }
  validateCoordinates(root,controls,holdouts,profile,{width,height});
  const c={...current,version:VERSION,pixel_axis:input.pixel_axis,target_frame:'PLATE_LOCAL_METERS',source_sha256:candidate.sha256,render_sha256:custody.plate_vi_render_sha256,threshold_profile_id:profile.id,profile_snapshot:profile,scale_expectation:scale,controls,holdouts,freeze_state:'FROZEN_BEFORE_FIT',state:'FROZEN_AWAITING_FIT',frozen_at:new Date().toISOString()};
  const payload=immutableContent(c),seal={payload,sha256:hashObject(payload),frozen_at:c.frozen_at}; c.freeze_sha256=seal.sha256;
  // Exclusive lock is written before publishing the active campaign. A interrupted freeze
  // remains blocked rather than silently replacing an old experiment.
  exclusiveJson(root,ROOTS.frozen,seal);
  atomicJson(root,ROOTS.campaign,c);
  return {state:c.state,freeze_sha256:seal.sha256,controls:controls.length,holdouts:holdouts.length,geometry_authority:'NONE'};
}
export function verifyFrozenExperiment(root) {
  const c=readJson(root,ROOTS.campaign);
  requireGate(c.freeze_state==='FROZEN_BEFORE_FIT','EXPERIMENT_NOT_FROZEN');
  const {candidate,custody,width,height}=verifyCustody(root);
  requireGate(c.source_sha256===candidate.sha256&&c.render_sha256===custody.plate_vi_render_sha256,'CAMPAIGN_CUSTODY_MISMATCH');
  requireGate(fs.existsSync(inside(root,ROOTS.frozen)),'FREEZE_SEAL_MISSING');
  const seal=readJson(root,ROOTS.frozen);
  requireGate(hashObject(seal.payload)===seal.sha256&&seal.sha256===c.freeze_sha256&&hashObject(immutableContent(c))===seal.sha256,'FROZEN_EXPERIMENT_CHANGED');
  const p=profileFor(root,c.threshold_profile_id);
  requireGate(hashObject(p)===hashObject(c.profile_snapshot),'PROFILE_CHANGED_AFTER_FREEZE');
  scaleExpectation(root,c.scale_expectation);
  validateCoordinates(root,c.controls,c.holdouts,p,{width,height});
  return {campaign:c,profile:p};
}
export function fitFrozen(root) {
  requireGate(!fs.existsSync(inside(root,ROOTS.result)),'FIT_RESULT_ALREADY_EXISTS','Existing results are immutable. Do not retune this experiment.');
  const {campaign:c,profile:p}=verifyFrozenExperiment(root);
  const mapPoint=p=>({...p,source:{x:p.source.x,y:c.pixel_axis==='Y_DOWN'?-p.source.y:p.source.y}});
  const controls=c.controls.map(mapPoint),holdouts=c.holdouts.map(mapPoint);
  const fit=fitSimilarity(controls),diag=frameDiagonal([...controls,...holdouts]);
  requireGate(Number.isFinite(diag)&&diag>0&&Number.isFinite(fit.scale)&&fit.scale>0,'DEGENERATE_FIT');
  const hr=residuals(fit,holdouts),cr=residuals(fit,controls),hs=summarizeResiduals(hr,diag),cs=summarizeResiduals(cr,diag),a=p.acceptance;
  const drift=Math.abs(fit.scale/c.scale_expectation.meters_per_pixel-1);
  const gates={holdout_rms:hs.rms<=a.absolute_holdout_rms_m_max,normalized_rms:hs.normalized_rms<=a.normalized_holdout_rms_max,worst_holdout:hs.normalized_max<=a.normalized_holdout_max_max,independent_scale:drift<=a.scale_drift_fraction_max};
  const passed=Object.values(gates).every(Boolean);
  const result={version:VERSION,campaign_id:c.campaign_id,source_sha256:c.source_sha256,render_sha256:c.render_sha256,freeze_sha256:c.freeze_sha256,fit_model:p.fit_model,target_frame:'PLATE_LOCAL_METERS',pixel_axis:c.pixel_axis,threshold_profile_id:p.id,profile_sha256:hashObject(p),fit,frame_diagonal_m:diag,control_summary:cs,holdout_summary:hs,control_residuals:cr,holdout_residuals:hr,scale_check:{evaluated:true,expected_meters_per_pixel:c.scale_expectation.meters_per_pixel,actual_meters_per_pixel:fit.scale,relative_drift:drift,maximum_drift:a.scale_drift_fraction_max},gates,passed,generated_at:new Date().toISOString(),geometry_authority:passed?'PLATE_LOCAL_METRIC_CANDIDATE_REQUIRES_MANUAL_REVIEW':'NONE',canonical_geometry_mutated:false};
  result.result_sha256=hashObject(result);
  exclusiveJson(root,ROOTS.result,result);
  return result;
}
