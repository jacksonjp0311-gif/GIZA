import fs from 'node:fs';
import path from 'node:path';
import {acquireCampaign,freezeCampaign,fitCampaign,exportCampaign,replayCampaign,reviewCampaign,rollbackCampaign} from './campaign.mjs';
const [command,location,arg]=process.argv.slice(2);
if(!command||!location){console.log('campaign-cli demo NEW_DIRECTORY | acquire NEW_DIRECTORY INPUT.json | freeze DIRECTORY LANDMARKS.json | fit DIRECTORY | export DIRECTORY NEW_PACKET.json | replay NEW_DIRECTORY PACKET.json | review DIRECTORY REVIEW.json | rollback DIRECTORY REASON');process.exit(1);}
const root=path.resolve(location),read=p=>{if(fs.statSync(p).size>100_000_000)throw new Error('Input exceeds 100 MB');return JSON.parse(fs.readFileSync(p,'utf8'));};
let result;
try{
  if(command==='demo'||command==='negative'){
    const {campaignFixture}=await import('./campaign-fixture.mjs'),fixture=campaignFixture();
    if(command==='negative'){fixture.config.id='qa.khafre.plan.negative';fixture.config.question='Does the shared engine retain and reject a deliberately inconsistent synthetic holdout?';fixture.input.landmarks[4].target_m.x+=2;}
    await acquireCampaign(root,fixture);freezeCampaign(root,fixture.input);result=fitCampaign(root);
    let revisionId=null;
    if(command==='demo'){const revision=await reviewCampaign(root,{reviewer:'Automated software QA',note:'Synthetic-only positive path; no archaeological authority.',acceptPlanScope:true});revisionId=revision.id;}
    else{if(result.result.passed)throw new Error('Negative holdout unexpectedly passed');try{await reviewCampaign(root,{reviewer:'Automated negative QA',note:'Attempted review of intentionally failed holdout',acceptPlanScope:true});throw new Error('Negative review unexpectedly accepted');}catch(e){if(e.code!=='FAILED_GATES_CANNOT_PROMOTE')throw e;fs.writeFileSync(path.join(root,'denied-review.json'),JSON.stringify({status:'DENIED',reason:e.code,synthetic:true,createdAt:new Date().toISOString()},null,2),{flag:'wx'});}}
    fs.writeFileSync(path.join(root,'packet.json'),JSON.stringify(exportCampaign(root),null,2),{flag:'wx'});result={...result,revisionId,packet:path.join(root,'packet.json')};
  }else if(command==='acquire')result=await acquireCampaign(root,read(arg));
  else if(command==='freeze')result=freezeCampaign(root,read(arg));
  else if(command==='fit')result=fitCampaign(root);
  else if(command==='replay')result=await replayCampaign(root,read(arg));
  else if(command==='review')result=await reviewCampaign(root,read(arg));
  else if(command==='rollback')result=rollbackCampaign(root,arg);
  else if(command==='export'){fs.writeFileSync(arg,JSON.stringify(exportCampaign(root),null,2),{flag:'wx'});result={exported:arg};}
  else throw new Error('Unknown campaign command');
  console.log(JSON.stringify(result,null,2));
}catch(e){
  if(fs.existsSync(path.join(root,'acquisition.json'))){const attempts=path.join(root,'attempts');fs.mkdirSync(attempts,{recursive:true});fs.writeFileSync(path.join(attempts,`${Date.now()}-${command}.json`),JSON.stringify({command,error:e.code??e.message,createdAt:new Date().toISOString(),canonicalGeometryChanged:false},null,2),{flag:'wx'});}
  console.error(e.code??e.message);process.exitCode=1;
}
