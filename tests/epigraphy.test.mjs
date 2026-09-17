import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import ts from 'typescript';
async function load(file){const code=ts.transpileModule(fs.readFileSync(new URL('../src/'+file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));}
const {interiorParts,inspectionBounds,INTERIOR_SCOPES}=await load('lib/interiorInspection.ts');
const {emptyNotebook,newRegion,normalizedRect,parseNotebook,parseProposal,updateReading,reviewReading,aiReviewPacket}=await load('epigraphy/model.ts');
const {parseRestoration}=await load('epigraphy/model.ts');
const {INSCRIPTION_IMAGES}=await load('epigraphy/catalog.ts');
const {SIGN_PALETTE}=await load('epigraphy/signs.ts');
const parts=JSON.parse(fs.readFileSync(new URL('../public/model/parts.json',import.meta.url))).parts;
const parse=v=>parseNotebook(v,INSCRIPTION_IMAGES.map(i=>i.id),SIGN_PALETTE.map(s=>s.code));
const region=()=>newRegion('test-zone','dream-photo',[.2,.3,.4,.1],'Synthetic test zone');
const notebook=r=>({...emptyNotebook(),regions:[r]});

test('old v1 notebooks migrate to an empty prediction layer without source changes',()=>{
  const r=region();delete r.restoration;const before=JSON.stringify(r),loaded=parse(notebook(r)).regions[0];
  assert.equal(loaded.restoration.status,'PREDICTION');assert.equal(loaded.restoration.pigmentEvidence,'NOT_ESTABLISHED');assert.deepEqual(loaded.restoration.strokes,[]);assert.equal(JSON.stringify(r),before);
});
test('predicted color round trips with provenance and never becomes observed pigment',()=>{
  const r=region();r.restoration={status:'VERIFIED',pigmentEvidence:'MEASURED',strokes:[{points:[[.3,.4],[.5,.6]],color:'#3277a8',width:.008}],rationale:'Hypothesis only',alternatives:'Leave uncolored'};
  const out=parse(notebook(r)).regions[0];assert.equal(out.restoration.status,'PREDICTION');assert.equal(out.restoration.pigmentEvidence,'NOT_ESTABLISHED');assert.equal(out.restoration.strokes.length,1);
  const reviewed=reviewReading({...out,translation:'Test reading',citation:'Synthetic fixture',reviewer:'Test'});assert.equal(reviewed.restoration.status,'PREDICTION');assert.equal(out.traces.length,0);assert.equal(out.signs.length,0);
});
test('hypothesis imports reject malformed, injected and unbounded strokes',()=>{
  const valid={strokes:[{points:[[.2,.3],[.4,.5]],width:.01,color:'#aabbcc'}]};
  for(const patch of [{color:'url(javascript:x)'},{width:NaN},{width:100},{points:[[2,0],[0,0]]},{points:[[0,0]]},{points:Array(1001).fill([0,0])}])assert.throws(()=>parseRestoration({strokes:[{...valid.strokes[0],...patch}]}));
  assert.throws(()=>parseRestoration({strokes:Array(101).fill(valid.strokes[0])}));assert.throws(()=>parseRestoration(null));
  const parsed=parseRestoration(valid);parsed.strokes[0].points[0][0]=.9;assert.equal(valid.strokes[0].points[0][0],.2);
});
test('generated prediction is checksum-bound and excluded from the evidence catalog',()=>{
  const bytes=fs.readFileSync(new URL('../public/epigraphy/dream-stela-color-hypothesis-v1.png',import.meta.url));
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),'51eb74f690fbe7f43ebdb14215cd571b41cc8614a4945e9d5b02ca49cdedbafe');
  assert.ok(!INSCRIPTION_IMAGES.some(i=>i.image.includes('hypothesis')));
  const receipt=fs.readFileSync(new URL('../public/epigraphy/RECONSTRUCTION-RECEIPT.md',import.meta.url),'utf8');assert.match(receipt,/NOT ARCHAEOLOGICAL EVIDENCE/);assert.match(receipt,/CC BY-SA 3.0/);assert.match(receipt,/Exact generation prompt/);
});
test('inspection excludes shells, terrain, hidden envelopes and hypotheses',()=>{
  const internal=interiorParts(parts,'ALL');assert.equal(internal.length,22);
  for(const p of internal){assert.match(p.id,/^part\.(upper|lower|burial|sarcophagus)\./);assert.notEqual(p.provenance.class,'UNVERIFIED');assert.notEqual(p.detail_tier,'hidden');}
  assert.ok(!internal.some(p=>p.id==='part.pyramid.khafre'));
});
test('subsystem isolation is reversible and does not edit canonical parts',()=>{
  const before=JSON.stringify(parts);for(const s of INTERIOR_SCOPES){const sub=interiorParts(parts,s.id);assert.ok(sub.length>0);const b=inspectionBounds(sub,2.75);assert.ok(b.radius>0&&Number.isFinite(b.radius));assert.ok(b.target.every(Number.isFinite));}
  assert.ok(interiorParts(parts,'burial').some(p=>p.id==='part.sarcophagus.body'));assert.equal(JSON.stringify(parts),before);
});
test('fit bounds follow normalized explosion vectors and handle empty selection',()=>{
  const p=structuredClone(parts[0]);p.spatial.origin_m=[0,0,0];p.spatial.explosion_vector=[2,0,0];p.spatial.explosion_distance_m=10;
  assert.deepEqual(inspectionBounds([p],2).target,[20,0,0]);assert.deepEqual(inspectionBounds([]),{target:[0,0,0],radius:10});
});
test('zone coordinates normalize reverse drags and clamp image bounds',()=>{
  assert.deepEqual(normalizedRect([.8,.7],[.2,.1]).map(n=>+n.toFixed(4)),[.2,.1,.6,.6]);
  assert.deepEqual(normalizedRect([-1,NaN],[3,4]),[0,0,1,1]);
});
test('notebook round trip retains source identity and separate traces',()=>{
  const r=region();r.signs=['N35'];r.traces=[[[.2,.3],[.4,.35]]];assert.deepEqual(parse(notebook(r)),notebook(r));
  const second=newRegion('other','dream-lepsius',[.1,.1,.2,.2],'Facsimile');assert.equal(parse({...notebook(r),regions:[r,second]}).regions[1].imageId,'dream-lepsius');
});
test('malformed imports cannot supply unknown sources, duplicate IDs or invalid geometry',()=>{
  for(const patch of [{imageId:'https://attacker.invalid/image'},{rect:[.9,0,.5,.1]},{rect:[0,0,Infinity,.2]},{traces:[[[0,0],[2,1]]]},{signs:['invented']},{traces:new Array(201).fill([[0,0],[1,1]])}])assert.throws(()=>parse(notebook({...region(),...patch})));
  assert.throws(()=>parse({...notebook(region()),regions:[region(),region()]}));
  assert.throws(()=>parse({schema:'wrong',regions:[]}));assert.throws(()=>parse({...emptyNotebook(),regions:new Array(101).fill(region())}));
});
test('AI import cannot promote itself to a human-reviewed translation',()=>{
  const proposal=parseProposal({transliteration:'test',translation:'Synthetic test',reasoning:'Uncertain',status:'HUMAN_REVIEWED',origin:'MEASURED'});
  assert.equal(proposal.status,'UNREVIEWED');assert.equal(proposal.origin,'AI_OR_EXTERNAL');assert.throws(()=>parseProposal({translation:42}));
  const r=region();r.proposal=proposal;assert.equal(parse(notebook(r)).regions[0].status,'DRAFT');assert.equal(r.translation,'');
});
test('review needs an operator, citation and reading; edits revoke attestation',()=>{
  assert.throws(()=>reviewReading(region()));const reviewed=reviewReading({...region(),reviewer:'Test operator',citation:'Synthetic fixture; no archaeological claim',translation:'Test only'});
  assert.equal(reviewed.status,'HUMAN_REVIEWED');assert.equal(updateReading(reviewed,{translation:'changed'}).status,'DRAFT');assert.equal(updateReading(reviewed,{signs:['A1']}).reviewedAt,'');
  assert.equal(parse(notebook({...reviewed,reviewer:''})).regions[0].status,'DRAFT');
});
test('manual AI packet retains image provenance and never claims connected inference',()=>{
  const packet=aiReviewPacket(region(),INSCRIPTION_IMAGES.find(i=>i.id==='dream-photo'));assert.equal(packet.source.author,'HoremWeb');assert.match(packet.instruction,/abstain/);assert.match(packet.integration,/No OCR service or AI provider is connected/);assert.deepEqual(packet.normalized_image_rect,[.2,.3,.4,.1]);
});
test('bundled source images have stable bytes and visible rights metadata',()=>{
  const hashes={'dream-detail':'833fdd37ac8a16f8f2b5a6daf0d42a4287ae25e3d02d737576eeba8729d8c602','dream-photo':'73826fd777b8af7872c52ba040da26e1c6c18d006bcec7f174d8d87ce6925f1f','dream-lepsius':'e42018d9ea06e34e01b3230034d1893c7cc762d62ad60dbcd9d303dcb2daca55'};
  for(const source of INSCRIPTION_IMAGES){const bytes=fs.readFileSync(new URL('../public'+source.image,import.meta.url));assert.equal(bytes[0],0xff);assert.equal(bytes[1],0xd8);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),hashes[source.id]);assert.ok(source.author&&source.license&&source.licenseUrl&&source.source);}
});
test('sign palette contains unique valid Egyptian Unicode characters with code labels',()=>{
  assert.equal(SIGN_PALETTE.length,1072);
  assert.equal(new Set(SIGN_PALETTE.map(s=>s.code)).size,SIGN_PALETTE.length);for(const s of SIGN_PALETTE)assert.ok(s.unicode>=0x13000&&s.unicode<=0x1342f);
});
test('bundled hieroglyph font maps every sign, including late base-block additions',()=>{
  const font=fs.readFileSync(new URL('../public/epigraphy/NotoSansEgyptianHieroglyphs-Regular.ttf',import.meta.url));
  let cmap;for(let i=0;i<font.readUInt16BE(4);i++){const entry=12+i*16;if(font.toString('ascii',entry,entry+4)==='cmap')cmap=font.readUInt32BE(entry+8);}
  assert.notEqual(cmap,undefined);let map;
  for(let i=0;i<font.readUInt16BE(cmap+2);i++){const entry=cmap+4+i*8,offset=cmap+font.readUInt32BE(entry+4);if(font.readUInt16BE(offset)===12){map=offset;break;}}
  assert.notEqual(map,undefined);const ranges=[];
  for(let i=0;i<font.readUInt32BE(map+12);i++){const start=map+16+i*12;ranges.push([font.readUInt32BE(start),font.readUInt32BE(start+4),font.readUInt32BE(start+8)]);}
  for(const sign of SIGN_PALETTE)assert.ok(ranges.some(([lo,hi,glyph])=>sign.unicode>=lo&&sign.unicode<=hi&&glyph+sign.unicode-lo>0),`Missing glyph ${sign.code}`);
});
