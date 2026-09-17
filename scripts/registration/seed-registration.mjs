import fs from 'node:fs';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const write=(f,d)=>fs.writeFileSync(f,JSON.stringify(d,null,2)+'\n');
const media=read('public/model/observatory/media_catalog.json').assets;
const parts=read('public/model/parts.json').parts;
const byPart=new Map(parts.map(p=>[p.id,p]));
function boxCorners(partId,prefix){
  const p=byPart.get(partId); const q=p?.spatial?.primitive;
  if(!p||q?.kind!=='box')return[];
  const [ox,oy,oz]=p.spatial.origin_m; const hx=q.sx/2,hy=q.sy/2,hz=q.sz/2;
  const out=[]; let n=0;
  for(const sx of [-1,1])for(const sy of [-1,1])for(const sz of [-1,1]) out.push({id:`${prefix}.${++n}`,target_id:partId,xyz_m:[ox+sx*hx,oy+sy*hy,oz+sz*hz],truth_class:'DERIVED_MODEL_ANCHOR',anchor_kind:'BOX_CORNER',image_match_status:'UNMATCHED',guard:'Candidate world anchor only; image correspondence must be manually/algorithmically reviewed.'});
  return out;
}
const pyramid=byPart.get('part.pyramid.khafre'); const q=pyramid.spatial.primitive; const hx=q.sx/2,hy=q.sy/2;
const world=[
  {id:'khafre.base.NW',target_id:'part.pyramid.khafre',xyz_m:[-hx,hy,0],truth_class:'DERIVED_PETRIE_ENVELOPE',anchor_kind:'ORIGINAL_BASE_CORNER_CANDIDATE',image_match_status:'UNMATCHED'},
  {id:'khafre.base.NE',target_id:'part.pyramid.khafre',xyz_m:[hx,hy,0],truth_class:'DERIVED_PETRIE_ENVELOPE',anchor_kind:'ORIGINAL_BASE_CORNER_CANDIDATE',image_match_status:'UNMATCHED'},
  {id:'khafre.base.SE',target_id:'part.pyramid.khafre',xyz_m:[hx,-hy,0],truth_class:'DERIVED_PETRIE_ENVELOPE',anchor_kind:'ORIGINAL_BASE_CORNER_CANDIDATE',image_match_status:'UNMATCHED'},
  {id:'khafre.base.SW',target_id:'part.pyramid.khafre',xyz_m:[-hx,-hy,0],truth_class:'DERIVED_PETRIE_ENVELOPE',anchor_kind:'ORIGINAL_BASE_CORNER_CANDIDATE',image_match_status:'UNMATCHED'},
  {id:'khafre.summit',target_id:'part.pyramid.khafre',xyz_m:[0,0,q.sz],truth_class:'DERIVED_PETRIE_ENVELOPE',anchor_kind:'SUMMIT_CANDIDATE',image_match_status:'UNMATCHED'},
  ...boxCorners('part.burial.chamber','burial.corner'),
  ...boxCorners('part.sarcophagus.body','sarcophagus.corner'),
  ...boxCorners('part.lower.chamber','lower.corner')
];
for(const id of ['part.upper.entrance.existing','part.upper.horizontal.gh']){
 const p=byPart.get(id); for(let i=0;i<(p?.spatial?.service_path?.length??0);i++) world.push({id:`${id}.centerline.${i+1}`,target_id:id,xyz_m:p.spatial.service_path[i],truth_class:'DERIVED_SURVEY_PATH_ANCHOR',anchor_kind:'CENTERLINE_ENDPOINT',image_match_status:'UNMATCHED',guard:'Centerline is not a visible wall corner unless independently matched.'});
}
write('public/model/registration/world_control_candidates.json',{schema_version:'1.0.0',version:'0.9.8',rule:'World anchors are candidates, not image matches. External survey control supersedes derived model anchors when registered.',count:world.length,anchors:world});

const priors=media.map(a=>({media_id:a.id,image_dimensions_px:a.original_dimensions??null,camera_model:a.exif?.camera??null,focal_length_mm:a.exif?.focal_length_mm??null,equivalent_focal_length_mm:a.exif?.equivalent_focal_length_mm??null,principal_point_px:a.original_dimensions?[a.original_dimensions[0]/2,a.original_dimensions[1]/2]:null,principal_point_status:a.original_dimensions?'ASSUMED_IMAGE_CENTER':'UNRESOLVED',sensor_dimensions_mm:null,focal_length_px:null,distortion_model:'UNRESOLVED',camera_location:a.camera_location??null,camera_location_status:a.camera_location?'CONTEXT_ONLY_NOT_SURVEY_CONTROL':'UNAVAILABLE',intrinsic_status:a.exif?.focal_length_mm?'PARTIAL_EXIF_SENSOR_UNRESOLVED':'UNRESOLVED',guard:'EXIF is a prior only. Metric pose requires calibrated intrinsics or jointly solved camera parameters plus spatial controls.'}));
write('public/model/registration/camera_priors.json',{schema_version:'1.0.0',version:'0.9.8',count:priors.length,priors});

const targetMap={
 'media.commons.khafre_casing_2004':'part.pyramid.khafre','media.commons.khafre_granite_casing':'part.pyramid.khafre','media.commons.khafre_exterior_geotagged':'part.pyramid.khafre','media.commons.khafre_exterior_cc0_2002':'part.pyramid.khafre',
 'media.commons.khafre_burial_chamber_2007':'part.burial.chamber','media.commons.khafre_interior_2022':'part.burial.chamber','media.commons.khafre_interior_liber_2006':'part.burial.chamber',
 'media.commons.khafre_sarcophagus_detail_2006':'part.sarcophagus.body','media.commons.khafre_coffer_2007':'part.sarcophagus.body','media.commons.khafre_passage_2007':'part.upper.entrance.existing'
};
const jobs=[];
for(const a of media){
 const target=targetMap[a.id]; if(!target)continue;
 const anchorIds=world.filter(w=>w.target_id===target).map(w=>w.id);
 jobs.push({id:`reg.${a.id.replaceAll('.','_')}`,media_id:a.id,target_id:target,state:'CONTROL_CANDIDATES_READY',solve_mode:target==='part.pyramid.khafre'?'EXTERIOR_POSE_PENDING_SURVEY_CONTROL':'PLANAR_OR_PNP_PENDING_PIXEL_CONTROLS',camera_prior_id:a.id,world_anchor_ids:anchorIds,pixel_controls:[],plane_frame:null,solution:null,qa:{reprojection_rmse_px:null,plane_rmse_m:null,control_count:0,control_spread_reviewed:false,holdout_reviewed:false},promotion_cap:'NONE_UNTIL_SOLVED',guard:'No geometry write authority until controls are matched, solve succeeds, residuals are reviewed, and an independent receipt is issued.'});
}
write('public/model/registration/jobs.json',{schema_version:'1.0.0',version:'0.9.8',state_machine:['DISCOVERED','MEDIA_VERIFIED','CONTROL_CANDIDATES_READY','PIXEL_CONTROLS_MARKED','SOLVED','QA_PASSED','REVIEWED','E1_RECTIFIED_CANDIDATE','E2_POSE_CANDIDATE','PROMOTABLE','REJECTED'],defaults:{planar_min_controls:4,pnp_min_controls:6,default_reprojection_rmse_gate_px:2.0,require_control_spread_review:true,require_holdout_review:true},count:jobs.length,jobs});
console.log(`seeded controls=${world.length} priors=${priors.length} jobs=${jobs.length}`);
