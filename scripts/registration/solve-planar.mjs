import fs from 'node:fs';
import {solveHomography,reprojectionStats} from './registration-math.mjs';
const jobsFile='public/model/registration/jobs.json';
const id=process.argv[2];
if(!id){console.error('Usage: node scripts/registration/solve-planar.mjs <job-id>');process.exit(2)}
const doc=JSON.parse(fs.readFileSync(jobsFile,'utf8')); const job=doc.jobs.find(j=>j.id===id);
if(!job){console.error(`job not found: ${id}`);process.exit(2)}
if(!job.plane_frame){console.error('job.plane_frame is required: define origin_xyz_m, x_axis_unit, y_axis_unit and source/uncertainty before solving');process.exit(2)}
if(job.pixel_controls.length<4){console.error('at least 4 pixel/plane correspondences required');process.exit(2)}
const corr=job.pixel_controls.map(c=>({id:c.id,image_px:c.image_px,plane_xy_m:c.plane_xy_m}));
const H=solveHomography(corr); const qa=reprojectionStats(H,corr);
job.solution={kind:'PLANAR_HOMOGRAPHY_IMAGE_TO_LOCAL_PLANE',matrix:H,created_at:new Date().toISOString(),truth_class:'DERIVED_REGISTRATION'};
job.qa={...job.qa,...qa,control_count:corr.length}; job.state='SOLVED'; job.promotion_cap='E1_ONLY_PENDING_REVIEW';
fs.writeFileSync(jobsFile,JSON.stringify(doc,null,2)+'\n'); console.log(JSON.stringify({id,state:job.state,qa},null,2));
