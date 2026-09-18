/** Scoped acquisition and replay adapter. All fitting/gates remain in the shared engine. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import {ROOTS,sha,hashObject,readJson,inside,freezeLandmarks,fitFrozen,verifyFrozenExperiment,requireGate} from '../plate_registration/engine.mjs';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
async function contract(file){const r=await build({entryPoints:[path.join(repo,'src/evidence',file)],bundle:true,write:false,platform:'node',format:'esm'});return import('data:text/javascript;base64,'+Buffer.from(r.outputFiles[0].text).toString('base64'));}
const {assertSafeDocument}=await contract('observationContract.ts'),{importCanonicalAssembly}=await contract('spatial.ts');
const schema='giza.scoped-campaign.v1';
function context(){let commit='UNKNOWN';try{commit=execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8',windowsHide:true}).trim();}catch{}return {version:JSON.parse(fs.readFileSync(path.join(repo,'package.json'),'utf8')).version,commit,node:process.version,platform:process.platform,codeHashes:Object.fromEntries(['scripts/evidence/campaign.mjs','scripts/plate_registration/engine.mjs','scripts/plate_registration/math.mjs','src/evidence/observationContract.ts','src/evidence/spatial.ts'].map(p=>[p,sha(fs.readFileSync(path.join(repo,p)))]))};}
const identifier=id=>typeof id==='string'&&/^[a-z][a-z0-9.-]{2,100}$/.test(id);
const text=s=>typeof s==='string'&&s.trim().length>=3;
function exclusive(root,relative,data){const p=inside(root,relative);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(data,null,2)+'\n',{flag:'wx'});}
function bytes(root,relative,data){const p=inside(root,relative);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,data,{flag:'wx'});}
function decode(value){requireGate(typeof value==='string'&&value.length<=90_000_000&&/^[A-Za-z0-9+/]*={0,2}$/.test(value),'INVALID_SOURCE_BYTES');const b=Buffer.from(value,'base64');requireGate(b.length>0&&b.toString('base64')===value,'INVALID_SOURCE_BYTES');return b;}
function checkedConfig(config,assembly){
  assertSafeDocument(config,2_000_000);
  requireGate(config.schema===schema&&identifier(config.id)&&config.assemblyId===assembly.id,'CAMPAIGN_SCOPE_REQUIRED');
  requireGate(['SYNTHETIC_SOFTWARE_QA','DOCUMENTARY_CONSISTENCY','INDEPENDENT_CONTROLLED'].includes(config.classification),'CAMPAIGN_CLASS_REQUIRED');
  requireGate(text(config.question)&&text(config.acceptanceQuestion)&&text(config.pageLocator)&&text(config.featureIdentification),'PREREGISTER_QUESTION_AND_FEATURES');
  requireGate(config.units==='m'&&config.dimensionalScope==='PLAN_2D_ONLY'&&text(config.targetFrame)&&config.targetFrame!==assembly.authoritativeFrameId,'EXPLICIT_LOCAL_2D_FRAME_REQUIRED');
  requireGate(Array.isArray(config.sources)&&config.sources.length>0&&config.sources.length<=30,'SOURCE_IDENTITIES_REQUIRED');
  const ids=new Set();for(const s of config.sources){requireGate(identifier(s.id)&&!ids.has(s.id)&&text(s.title)&&text(s.locator)&&text(s.underlyingSourceId)&&text(s.rights?.permittedUse)&&text(s.rights?.basis),'SOURCE_ATTRIBUTION_AND_RIGHTS_REQUIRED');ids.add(s.id);}
  requireGate(ids.has(config.primarySourceId),'PRIMARY_SOURCE_REQUIRED');
  requireGate(Array.isArray(config.landmarks)&&config.landmarks.length<=1000,'LANDMARK_IDENTIFICATION_REQUIRED');
  const landmarkIds=new Set();for(const l of config.landmarks){requireGate(identifier(l.id)&&!landmarkIds.has(l.id)&&typeof l.sector==='string'&&l.sector.trim().length>0&&text(l.description)&&assembly.features.some(f=>f.id===l.featureId),'FEATURE_BINDING_REQUIRED');landmarkIds.add(l.id);}
  const profiles=readJson(repo,ROOTS.profile);requireGate(profiles.profiles.some(p=>p.id===config.thresholdProfileId),'USE_EXISTING_PROFILE');
  return profiles;
}
/** New private campaign directory only; canonical source files are never edited. */
export async function acquireCampaign(root,input){
  assertSafeDocument(input,100_000_000);const assembly=importCanonicalAssembly(input.assembly),config=input.config,profiles=checkedConfig(config,assembly);
  requireGate(!fs.existsSync(root),'CAMPAIGN_ALREADY_EXISTS');
  const source=decode(input.sourcePdfBase64),render=decode(input.renderPngBase64);
  requireGate(source.subarray(0,5).toString()==='%PDF-','SOURCE_NOT_PDF');requireGate(render.length>=24&&render.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'RENDER_NOT_PNG');
  requireGate(input.visualConfirmation===true,'PAGE_VISUAL_CONFIRMATION_REQUIRED');
  const assets=input.controlAssets??[];requireGate(Array.isArray(assets)&&assets.length<=30,'INVALID_CONTROL_ASSETS');
  const custody=[{sourceId:config.primarySourceId,path:'assets/source.pdf',sha256:sha(source),bytes:source.length}];
  const decoded=assets.map(asset=>{requireGate(config.sources.some(s=>s.id===asset.sourceId)&&!custody.some(s=>s.sourceId===asset.sourceId),'CONTROL_SOURCE_ID_INVALID');const data=decode(asset.base64),record={sourceId:asset.sourceId,path:`assets/${asset.sourceId}.bin`,sha256:sha(data),bytes:data.length};custody.push(record);return {record,data};});
  fs.mkdirSync(root,{recursive:true});bytes(root,'assets/source.pdf',source);bytes(root,'assets/render.png',render);for(const {record,data} of decoded)bytes(root,record.path,data);
  const acquisition={schema,config,assemblySha256:hashObject(assembly),custody,render:{path:'assets/render.png',sha256:sha(render),sourceSha256:sha(source),pageLocator:config.pageLocator},context:context(),identityReview:'OPERATOR_ASSERTED_NOT_AUTHENTICATED',rightsReview:'OPERATOR_ASSERTED_NOT_LEGAL_CERTIFICATION',renderDerivation:'OPERATOR_CONFIRMED_SOURCE_PAGE_BINDING_NOT_AUTOMATIC_EXTRACTION',createdAt:new Date().toISOString()};
  exclusive(root,'acquisition.json',{payload:acquisition,sha256:hashObject(acquisition)});exclusive(root,'assembly.json',assembly);
  exclusive(root,ROOTS.sources,{sources:config.sources});exclusive(root,ROOTS.profile,profiles);
  const minimums=readJson(repo,ROOTS.template).minimums;
  exclusive(root,ROOTS.template,{minimums,landmarks:config.landmarks});
  exclusive(root,ROOTS.candidates,{candidates:[{id:config.id,raw_byte_verified:true,local_path:'assets/source.pdf',sha256:sha(source)}]});
  // Explicit legacy-engine custody adapter. Field names are historical; source identity is this campaign, never Plate VI.
  exclusive(root,ROOTS.handoff,{accepted_candidate_id:config.id,local_custody:{path:'assets/source.pdf',sha256:sha(source),plate_vi_render_path:'assets/render.png',plate_vi_render_sha256:sha(render),render_source_sha256:sha(source),visual_confirmation:true}});
  exclusive(root,ROOTS.campaign,{campaign_id:config.id,candidate_id:config.id,threshold_profile_id:config.thresholdProfileId,freeze_state:'NOT_FROZEN',controls:[],holdouts:[]});
  return {status:'ACQUIRED',classification:config.classification,acquisitionSha256:hashObject(acquisition),geometryAuthority:'NONE'};
}
export function verifyAcquisition(root){
  const record=readJson(root,'acquisition.json');assertSafeDocument(record,2_000_000);requireGate(hashObject(record.payload)===record.sha256,'ACQUISITION_CHANGED');
  const p=record.payload,a=importCanonicalAssembly(readJson(root,'assembly.json'));checkedConfig(p.config,a);requireGate(hashObject(a)===p.assemblySha256,'ASSEMBLY_SNAPSHOT_CHANGED');
  for(const item of [...p.custody,p.render])requireGate(sha(fs.readFileSync(inside(root,item.path)))===item.sha256,'ACQUIRED_BYTES_CHANGED');
  requireGate(hashObject(readJson(root,ROOTS.sources).sources)===hashObject(p.config.sources)&&hashObject(readJson(root,ROOTS.template).landmarks)===hashObject(p.config.landmarks),'CAMPAIGN_METADATA_CHANGED');
  requireGate(hashObject(readJson(root,ROOTS.profile))===hashObject(readJson(repo,ROOTS.profile))&&hashObject(readJson(root,ROOTS.template).minimums)===hashObject(readJson(repo,ROOTS.template).minimums),'PROFILE_MINIMA_CHANGED');
  return record;
}
export function freezeCampaign(root,input){
  assertSafeDocument(input,2_000_000);const acquisition=verifyAcquisition(root),c=acquisition.payload.config;
  requireGate(input.threshold_profile_id===c.thresholdProfileId,'PREREGISTERED_PROFILE_CHANGED');
  requireGate(Array.isArray(input.landmarks),'LANDMARKS_REQUIRED');
  const refs=[input.scale_expectation,...input.landmarks.map(l=>l.target_source)];
  for(const ref of refs){requireGate(ref?.independent_of_fit===true,'INDEPENDENT_INPUT_REQUIRED');const source=c.sources.find(s=>s.id===ref.source_id);requireGate(source,'SOURCE_NOT_IN_CAMPAIGN');
    if(c.classification==='INDEPENDENT_CONTROLLED'){
      const primary=c.sources.find(s=>s.id===c.primarySourceId);
      requireGate(source.independentOfModel===true&&source.underlyingSourceId!==primary.underlyingSourceId&&acquisition.payload.custody.some(s=>s.sourceId===source.id),'INDEPENDENT_CONTROL_BYTES_AND_LINEAGE_REQUIRED');
    }
  }
  for(const l of input.landmarks)requireGate(l.uncertainty?.status==='UNKNOWN'&&l.uncertainty.value===null||['BOUND','STANDARD_UNCERTAINTY'].includes(l.uncertainty?.status)&&Number.isFinite(l.uncertainty.value)&&l.uncertainty.value>=0,'DECLARED_LANDMARK_UNCERTAINTY_REQUIRED');
  const result=freezeLandmarks(root,input),payload={input,acquisitionSha256:acquisition.sha256,freezeSha256:result.freeze_sha256};exclusive(root,'identified-inputs.json',{payload,sha256:hashObject(payload)});return result;
}
export function fitCampaign(root){
  const acquisition=verifyAcquisition(root),record=readJson(root,'identified-inputs.json'),input=record.payload,frozen=verifyFrozenExperiment(root);
  requireGate(hashObject(input)===record.sha256,'IDENTIFIED_INPUTS_CHANGED');
  requireGate(input.acquisitionSha256===acquisition.sha256&&input.freezeSha256===frozen.campaign.freeze_sha256,'CAMPAIGN_SCOPE_FREEZE_MISMATCH');
  const result=fitFrozen(root);return {result,claim:{classification:acquisition.payload.config.classification,dimension:'PLAN_2D_ONLY',targetFrame:acquisition.payload.config.targetFrame,physical3DPlacement:'UNRESOLVED',geometryAuthority:'NONE_PENDING_SCOPED_REVIEW'}};
}
const numerical=r=>{const copy=structuredClone(r);delete copy.generated_at;delete copy.result_sha256;return copy;};
export function exportCampaign(root){
  const a=verifyAcquisition(root),p=a.payload;
  const inputs=readJson(root,'identified-inputs.json');requireGate(hashObject(inputs.payload)===inputs.sha256,'IDENTIFIED_INPUTS_CHANGED');
  const optional=file=>fs.existsSync(inside(root,file))?readJson(root,file):null;
  return {schema:'giza.campaign-packet.v1',config:p.config,assembly:readJson(root,'assembly.json'),acquisition:a,freeze:readJson(root,ROOTS.frozen),revision:optional('accepted-revision.json'),rollback:optional('rollback.json'),sourcePdfBase64:fs.readFileSync(inside(root,p.custody[0].path)).toString('base64'),renderPngBase64:fs.readFileSync(inside(root,p.render.path)).toString('base64'),controlAssets:p.custody.slice(1).map(s=>({sourceId:s.sourceId,base64:fs.readFileSync(inside(root,s.path)).toString('base64')})),visualConfirmation:true,input:inputs.payload.input,result:readJson(root,ROOTS.result)};
}
export async function replayCampaign(root,packet){
  assertSafeDocument(packet,100_000_000);requireGate(packet.schema==='giza.campaign-packet.v1','INVALID_CAMPAIGN_PACKET');
  requireGate(packet.acquisition&&hashObject(packet.acquisition.payload)===packet.acquisition.sha256&&hashObject(packet.acquisition.payload.config)===hashObject(packet.config)&&packet.acquisition.payload.assemblySha256===hashObject(packet.assembly),'PACKET_ACQUISITION_MISMATCH');
  requireGate(packet.acquisition.payload.custody[0].sha256===sha(decode(packet.sourcePdfBase64))&&packet.acquisition.payload.render.sha256===sha(decode(packet.renderPngBase64)),'PACKET_CUSTODY_MISMATCH');
  const archivedControls=packet.acquisition.payload.custody.slice(1);requireGate(Array.isArray(packet.controlAssets)&&packet.controlAssets.length===archivedControls.length,'PACKET_CONTROL_CUSTODY_MISMATCH');
  for(const control of archivedControls){const asset=packet.controlAssets.find(a=>a.sourceId===control.sourceId);requireGate(asset&&sha(decode(asset.base64))===control.sha256,'PACKET_CONTROL_CUSTODY_MISMATCH');}
  requireGate(packet.freeze&&hashObject(packet.freeze.payload)===packet.freeze.sha256&&packet.freeze.sha256===packet.result.freeze_sha256,'PACKET_FREEZE_MISMATCH');
  await acquireCampaign(root,packet);freezeCampaign(root,packet.input);const replay=fitCampaign(root);
  requireGate(hashObject(numerical(replay.result))===hashObject(numerical(packet.result)),'RESULT_DOES_NOT_REPRODUCE');
  if(packet.revision){const r=packet.revision,p=r.payload;requireGate(hashObject(p)===r.sha256&&r.id===`revision:${r.sha256}`&&p.baseAssemblySha256===hashObject(packet.assembly)&&p.campaignId===packet.config.id&&p.classification===packet.config.classification&&p.canonicalGeometryChanged===false&&p.relationship.dimension==='PLAN_2D_ONLY'&&p.relationship.to===packet.config.targetFrame&&hashObject(p.relationship.fit)===hashObject(replay.result.fit)&&p.numericalResultSha256===hashObject(numerical(replay.result))&&replay.result.passed,'REVISION_DOES_NOT_REPRODUCE');exclusive(root,'imported-historical-revision.json',packet.revision);}
  if(packet.rollback){requireGate(packet.revision&&packet.rollback.revisionId===packet.revision.id&&packet.rollback.restore==='BASE_ASSEMBLY'&&packet.rollback.canonicalGeometryChanged===false,'INVALID_ROLLBACK');exclusive(root,'imported-historical-rollback.json',packet.rollback);}
  exclusive(root,'replay-receipt.json',{schema:'giza.campaign-replay.v1',packetSha256:hashObject(packet),resultSha256:replay.result.result_sha256,reproduced:true,claim:replay.claim,createdAt:new Date().toISOString()});return replay;
}
/** A revision adds scoped 2-D evidence, never a guessed 3-D rigid transform. */
export async function reviewCampaign(root,review){
  requireGate(!fs.existsSync(inside(root,'accepted-revision.json')),'REVISION_ALREADY_EXISTS');
  assertSafeDocument(review);requireGate(text(review.reviewer)&&text(review.note)&&review.acceptPlanScope===true,'EXPLICIT_SCOPED_REVIEW_REQUIRED');
  const replayRoot=path.join(root,'replays',`review-${Date.now()}-${Math.random().toString(16).slice(2)}`),packet=exportCampaign(root),replay=await replayCampaign(replayRoot,packet);
  requireGate(replay.result.passed,'FAILED_GATES_CANNOT_PROMOTE');
  if(packet.config.classification==='INDEPENDENT_CONTROLLED')requireGate(packet.input.landmarks.every(l=>l.uncertainty.status!=='UNKNOWN'),'REVIEW_REQUIRES_CONTROL_UNCERTAINTY');
  const payload={schema:'giza.assembly-plan-revision.v1',assemblyId:packet.assembly.id,baseAssemblySha256:hashObject(packet.assembly),previousRevision:'BASE_ASSEMBLY',campaignId:packet.config.id,classification:packet.config.classification,sourceSha256:replay.result.source_sha256,freezeSha256:replay.result.freeze_sha256,numericalResultSha256:hashObject(numerical(replay.result)),relationship:{from:'SOURCE_RENDER_PIXELS',to:packet.config.targetFrame,units:'m',dimension:'PLAN_2D_ONLY',fit:replay.result.fit,uncertainty:'CONTROL_AND_HOLDOUT_RESIDUALS_ARE_NOT_SURVEY_COVARIANCE'},affectedFeatures:[...new Set(packet.config.landmarks.map(l=>l.featureId))].sort(),difference:'Adds a reviewed source-pixel to local-plan relationship. 3-D surfaces, lid placement and monument/site transforms are unchanged.',review:{...review,authentication:'OPERATOR_ASSERTED_NOT_AUTHENTICATED'},canonicalGeometryChanged:false,createdAt:new Date().toISOString()};
  const revision={id:`revision:${hashObject(payload)}`,sha256:hashObject(payload),payload};exclusive(root,`revisions/${revision.sha256}.json`,revision);exclusive(root,'accepted-revision.json',revision);return revision;
}
export function rollbackCampaign(root,reason){
  requireGate(text(reason),'ROLLBACK_REASON_REQUIRED');const revision=readJson(root,'accepted-revision.json');requireGate(hashObject(revision.payload)===revision.sha256,'REVISION_CHANGED');
  const receipt={schema:'giza.revision-rollback.v1',revisionId:revision.id,restore:'BASE_ASSEMBLY',reason,canonicalGeometryChanged:false,createdAt:new Date().toISOString()};exclusive(root,'rollback.json',receipt);return receipt;
}

/** Fresh shared-engine replay is mandatory; imported pass/review flags are insufficient. */
export function campaignRevisionState(root){
  const revision=readJson(root,'accepted-revision.json');
  requireGate(hashObject(revision.payload)===revision.sha256,'REVISION_CHANGED');
  return {revisionId:revision.id,active:!fs.existsSync(inside(root,'rollback.json'))};
}
export async function replayCampaignVerification(root){
  const packet=exportCampaign(root),replayRoot=path.join(root,'replays',`inspect-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const replay=await replayCampaign(replayRoot,packet);
  return {verificationState:'REPLAY_VERIFIED',campaignId:packet.config.id,packetSha256:hashObject(packet),numericalResultSha256:hashObject(numerical(replay.result)),result:replay.result,scope:replay.claim,acceptedForLiveGraph:false,reason:packet.rollback?'Revision rolled back; replay remains historical.':'Numerical replay is not a scoped review or archaeological authentication.'};
}
export async function liveCampaignRelation(root){
  const packet=exportCampaign(root),revision=packet.revision;
  requireGate(revision&&!packet.rollback,'NO_ACTIVE_REVIEWED_REVISION');
  const review=revision.payload.review;
  requireGate(hashObject(revision.payload.affectedFeatures)===hashObject([...new Set(packet.config.landmarks.map(l=>l.featureId))].sort())&&revision.payload.relationship.from==='SOURCE_RENDER_PIXELS','REVISION_FEATURE_SCOPE_MISMATCH');
  requireGate(text(review?.reviewer)&&text(review?.note)&&review.acceptPlanScope===true&&review.authentication==='OPERATOR_ASSERTED_NOT_AUTHENTICATED','SCOPED_OPERATOR_REVIEW_REQUIRED');
  const replayRoot=path.join(root,'replays',`live-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const replay=await replayCampaign(replayRoot,packet);
  requireGate(replay.result.passed,'FAILED_GATES_CANNOT_ENTER_LIVE_GRAPH');
  requireGate(packet.config.classification!=='INDEPENDENT_CONTROLLED'||packet.input.landmarks.every(l=>l.uncertainty.status!=='UNKNOWN'),'REVIEW_REQUIRES_CONTROL_UNCERTAINTY');
  const payload={schema:'giza.live-plan-relation.v1',id:`plan-relation:${revision.sha256}`,
    campaignId:packet.config.id,assemblyId:packet.assembly.id,assemblySha256:hashObject(packet.assembly),
    dimensionalScope:'PLAN_2D_ONLY',from:'SOURCE_RENDER_PIXELS',targetFrame:packet.config.targetFrame,
    authority:packet.config.classification==='SYNTHETIC_SOFTWARE_QA'?'HYPOTHESIS':'RECONSTRUCTED',
    classification:packet.config.classification,sourceIdentity:packet.config.sources,custody:packet.acquisition.payload.custody,acquisitionSha256:packet.acquisition.sha256,
    sourceSha256:replay.result.source_sha256,renderSha256:replay.result.render_sha256,
    freezeSha256:replay.result.freeze_sha256,numericalResultSha256:hashObject(numerical(replay.result)),
    rule:context(),fitRule:'SHARED_SIMILARITY_2D',fit:replay.result.fit,
    controls:replay.result.control_residuals,holdouts:replay.result.holdout_residuals,
    frozenInput:packet.input,independentScale:packet.input.scale_expectation,
    uncertainty:'CONTROL_AND_HOLDOUT_RESIDUALS_ARE_NOT_SURVEY_COVARIANCE',
    affectedFeatures:revision.payload.affectedFeatures,reviewReceipt:revision,
    revisionId:revision.id,rollbackLink:{campaignId:packet.config.id,revisionId:revision.id,restore:'BASE_ASSEMBLY'},
    replay:{packetSha256:hashObject(packet),resultSha256:replay.result.result_sha256,reproduced:true},
    verificationClaim:'REVIEWED_SCOPED_RELATION',physical3DPlacement:'UNRESOLVED',
    rightsAuthentication:'OPERATOR_DECLARATION',historicalAuthentication:'NOT_ESTABLISHED'};
  // Preserve the replayed relationship as an immutable audit record, not a 3-D transform.
  const record={payload,sha256:hashObject(payload)};exclusive(replayRoot,'live-relation.json',record);return record;
}
