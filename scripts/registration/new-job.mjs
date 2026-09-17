import fs from 'node:fs'; import crypto from 'node:crypto';
const mediaId=process.argv[2],targetId=process.argv[3];
if(!mediaId||!targetId){console.error('Usage: node scripts/registration/new-job.mjs <media-id> <target-id>');process.exit(2)}
const file='public/model/registration/jobs.json'; const doc=JSON.parse(fs.readFileSync(file,'utf8'));
const anchors=JSON.parse(fs.readFileSync('public/model/registration/world_control_candidates.json','utf8')).anchors.filter(a=>a.target_id===targetId).map(a=>a.id);
const job={id:`reg.manual.${Date.now()}.${crypto.randomBytes(3).toString('hex')}`,media_id:mediaId,target_id:targetId,state:'CONTROL_CANDIDATES_READY',solve_mode:'UNRESOLVED',camera_prior_id:mediaId,world_anchor_ids:anchors,pixel_controls:[],plane_frame:null,solution:null,qa:{reprojection_rmse_px:null,plane_rmse_m:null,control_count:0,control_spread_reviewed:false,holdout_reviewed:false},promotion_cap:'NONE_UNTIL_SOLVED',guard:'No geometry write authority until registration QA and independent review.'};
doc.jobs.push(job); doc.count=doc.jobs.length; fs.writeFileSync(file,JSON.stringify(doc,null,2)+'\n'); console.log(job.id);
