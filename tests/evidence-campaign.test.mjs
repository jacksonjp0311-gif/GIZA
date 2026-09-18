import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {campaignFixture} from '../scripts/evidence/campaign-fixture.mjs';
import {acquireCampaign,freezeCampaign,fitCampaign,exportCampaign,replayCampaign,reviewCampaign,rollbackCampaign,verifyAcquisition} from '../scripts/evidence/campaign.mjs';
import {ROOTS,readJson} from '../scripts/plate_registration/engine.mjs';
const root=()=>path.join(fs.mkdtempSync(path.join(os.tmpdir(),'giza-scoped-campaign-')),'campaign');
test('positive source bytes → freeze → shared fit → replay → reviewed 2D revision → rollback',async()=>{
  const r=root(),fixture=campaignFixture();await acquireCampaign(r,fixture);freezeCampaign(r,fixture.input);const fit=fitCampaign(r);assert.equal(fit.result.passed,true);assert.equal(fit.result.holdout_residuals.length,2);
  const packet=exportCampaign(r),replay=await replayCampaign(root(),packet);assert.equal(replay.result.passed,true);
  const original=fs.readFileSync(path.join(r,'assembly.json')),revision=await reviewCampaign(r,{reviewer:'Synthetic QA operator',note:'Software-only success, no archaeological promotion.',acceptPlanScope:true});
  assert.equal(revision.payload.relationship.dimension,'PLAN_2D_ONLY');assert.equal(revision.payload.canonicalGeometryChanged,false);assert.equal(revision.payload.classification,'SYNTHETIC_SOFTWARE_QA');
  assert.equal(rollbackCampaign(r,'Software rollback proof').restore,'BASE_ASSEMBLY');assert.deepEqual(fs.readFileSync(path.join(r,'assembly.json')),original);assert.ok(fs.existsSync(path.join(r,'accepted-revision.json')));
});
test('failed holdout is retained and cannot become an accepted revision',async()=>{
  const r=root(),f=campaignFixture();f.input.landmarks[4].target_m.x+=2;await acquireCampaign(r,f);freezeCampaign(r,f.input);const result=fitCampaign(r);assert.equal(result.result.passed,false);assert.equal(result.result.holdout_residuals.length,2);
  await assert.rejects(reviewCampaign(r,{reviewer:'QA operator',note:'Attempt to promote failed holdouts',acceptPlanScope:true}),/FAILED_GATES/);assert.equal(readJson(r,ROOTS.result).passed,false);
});
test('independent classification rejects same-underlying-source control even if fit is numerically perfect',async()=>{
  const r=root(),f=campaignFixture();f.config.classification='INDEPENDENT_CONTROLLED';f.config.sources[1].underlyingSourceId=f.config.sources[0].underlyingSourceId;await acquireCampaign(r,f);assert.throws(()=>freezeCampaign(r,f.input),/INDEPENDENT_CONTROL_BYTES_AND_LINEAGE/);
});
test('missing scale, missing source permission and wrong units reject before result',async()=>{
  const f=campaignFixture();f.config.units='cm';await assert.rejects(acquireCampaign(root(),f),/LOCAL_2D_FRAME/);
  const p=campaignFixture();delete p.config.sources[0].rights;await assert.rejects(acquireCampaign(root(),p),/RIGHTS/);
  const r=root(),s=campaignFixture();await acquireCampaign(r,s);delete s.input.scale_expectation;assert.throws(()=>freezeCampaign(r,s.input),/INDEPENDENT_INPUT/);
});
test('byte changes, input changes and fabricated replay results fail closed',async()=>{
  const r=root(),f=campaignFixture();await acquireCampaign(r,f);freezeCampaign(r,f.input);fitCampaign(r);const packet=exportCampaign(r);packet.result.holdout_summary.rms=123;await assert.rejects(replayCampaign(root(),packet),/DOES_NOT_REPRODUCE/);
  fs.appendFileSync(path.join(r,'assets/source.pdf'),'tamper');assert.throws(()=>verifyAcquisition(r),/BYTES_CHANGED/);
});
test('packet replay rehashes independent control assets, not just the image',async()=>{
  const r=root(),f=campaignFixture();await acquireCampaign(r,f);freezeCampaign(r,f.input);fitCampaign(r);const packet=exportCampaign(r);packet.controlAssets[0].base64=Buffer.from('altered independent control bytes').toString('base64');await assert.rejects(replayCampaign(root(),packet),/CONTROL_CUSTODY_MISMATCH/);
});
