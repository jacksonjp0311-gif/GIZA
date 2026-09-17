import fs from 'node:fs'; import crypto from 'node:crypto';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const manifest=read('public/model/registration/manifest.json'); const pairs=read('public/model/registration/pair_candidates.json'); const priors=read('public/model/registration/camera_priors.json'); const controls=read('public/model/registration/world_control_candidates.json'); const jobs=read('public/model/registration/jobs.json'); const survey=read('public/model/registration/survey_control_sources.json'); const bench=read('public/model/registration/benchmarks/planar_homography.json');
const errors=[];
if(manifest.version!=='0.9.8')errors.push('registration manifest version drift');
if(priors.priors.length<10)errors.push('camera prior registry unexpectedly small');
if(controls.anchors.length<20)errors.push('world control candidate registry unexpectedly small');
if(jobs.jobs.length<8)errors.push('registration job seed unexpectedly small');
if(!bench.pass)errors.push('planar homography benchmark failed');
if(survey.sources.filter(s=>s.priority==='CRITICAL').length<2)errors.push('survey control acquisition priorities missing');
if(pairs.clusters.length<3)errors.push('registration pair clusters missing');
if(pairs.clusters.some(c=>c.overlap_status==='VERIFIED' && c.status.includes('CANDIDATE')))errors.push('candidate cluster claims verified overlap without promotion');
for(const j of jobs.jobs){
 if(j.state==='SOLVED' && !j.solution)errors.push(`${j.id}: solved without solution`);
 if(j.state!=='SOLVED' && j.promotion_cap!=='NONE_UNTIL_SOLVED' && !String(j.promotion_cap).includes('E1'))errors.push(`${j.id}: premature promotion cap`);
}
for(const p of priors.priors) if(p.camera_location && p.camera_location_status!=='CONTEXT_ONLY_NOT_SURVEY_CONTROL')errors.push(`${p.media_id}: consumer GPS promoted to survey control`);
console.log(`REGISTRATION LAB priors=${priors.priors.length} controls=${controls.anchors.length} jobs=${jobs.jobs.length} pairClusters=${pairs.clusters.length} surveySources=${survey.sources.length} benchmark=${bench.pass?'PASS':'FAIL'}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)} console.log('PASS');
