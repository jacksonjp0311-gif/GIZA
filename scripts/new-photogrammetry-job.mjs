import fs from 'node:fs';
import crypto from 'node:crypto';
const file='public/model/evidence/photogrammetry_jobs.json';
const doc=JSON.parse(fs.readFileSync(file,'utf8'));
const target=process.argv[2];
if(!target){console.error('Usage: npm run new:photogrammetry -- part.id');process.exit(2)}
const job={
  id:`pg.${Date.now()}.${crypto.randomBytes(3).toString('hex')}`,
  target_id:target,
  state:'DRAFT',
  media_ids:[],
  scale_anchor_ids:[],
  camera_solution:null,
  qa:{reprojection_rmse_px:null,coverage_diversity_reviewed:false,coordinate_frame_receipt:false},
  outputs:{mesh_path:null,point_cloud_path:null},
  created_at:new Date().toISOString(),
  notes:'Created by scaffold. No evidence promotion has occurred.'
};
doc.jobs.push(job);fs.writeFileSync(file,JSON.stringify(doc,null,2)+'\n');console.log(job.id);
