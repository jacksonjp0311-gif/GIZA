import type {ModelBundle} from '../lib/model';
import type {AssemblyConstraint,BoxGeometry,EvidenceAssembly,EvidenceFeature,EvidenceObservation,FeatureGeometry,RealityAuthority,SpatialFrame,SpatialTransform,Uncertainty,Vec3} from './types';
import {rigidMatrix,unknownUncertainty} from './spatial';

export const ASSEMBLY_FRAME='frame.khafre.burial.reconstruction';
export const BODY_FRAME='frame.khafre.coffer.object';
export const LID_FRAME='frame.khafre.lid.object';
export const MONUMENT_FRAME='frame.khafre.monument.legacy';
export const SITE_FRAME='frame.giza.local';
export const REALITY_STYLES={
  OBSERVED:{color:'#6de1b2',label:'OBSERVED · cited observations',pattern:'solid'},
  RECONSTRUCTED:{color:'#e9bc75',label:'RECONSTRUCTED · derived geometry',pattern:'outline'},
  HYPOTHESIS:{color:'#ce97ea',label:'HYPOTHESIS · untested proposal',pattern:'dashed'},
} as const;
type AssemblyModel=Pick<ModelBundle,'measurements'|'componentResearch'|'parts'|'sourceRegistry'> & Partial<Pick<ModelBundle,'field'>>;
const frame=(id:string,label:string,datum:string,status:SpatialFrame['status']='DEFINED'):SpatialFrame=>({id,label,units:'m',axes:{x:'+EAST',y:'+NORTH',z:'+UP'},handedness:'RIGHT_HANDED',datum,authority:'RECONSTRUCTED',status});
const unknownGeometry=(reason:string):FeatureGeometry=>({kind:'unknown',reason});
const box=(min:Vec3,max:Vec3):BoxGeometry=>({kind:'box',min,max});

/** Build a new derived contract; original model records and coordinates are never mutated. */
export function buildKhafreAssembly(model:AssemblyModel):EvidenceAssembly {
  const measurements=(Array.isArray(model.measurements)?model.measurements:[]).filter(m=>/^m\.(coffer|burial)\./.test(m.id));
  const supplemental=(model.componentResearch?.observations??[]).filter(o=>/^(coffer|burial)\./.test(o.id));
  const observations:EvidenceObservation[]=[
    ...measurements.map(m=>({id:m.id,sourceId:m.source_id,locator:m.source_locator??'UNKNOWN',value:typeof m.si_value==='number'&&Number.isFinite(m.si_value)?m.si_value:null,
      unit:m.si_unit,nativeValue:m.native_value,nativeUnit:m.native_unit,
      uncertainty:typeof m.uncertainty_si==='number'&&Number.isFinite(m.uncertainty_si)&&m.uncertainty_si>=0?{status:'KNOWN' as const,value:m.uncertainty_si,unit:m.si_unit??'UNKNOWN',note:'Uncertainty copied verbatim from the canonical record; its statistical interpretation is not specified.'}:unknownUncertainty(),
      authority:(m.status.startsWith('DERIVED')?'RECONSTRUCTED':'OBSERVED') as RealityAuthority,derivation:m.notes||'Source-reported scalar; no registered source-image position.',status:m.status})),
    ...supplemental.map(o=>({id:o.id,sourceId:o.source,locator:o.locator,value:typeof o.si_value==='number'&&Number.isFinite(o.si_value)?o.si_value:typeof o.value==='string'?o.value:null,
      unit:typeof o.si_value==='number'?'m':o.unit??null,nativeValue:o.value,nativeUnit:o.unit??null,uncertainty:unknownUncertainty(),
      authority:(o.status.startsWith('DERIVED')?'RECONSTRUCTED':'OBSERVED') as RealityAuthority,derivation:o.note??'Cited historical record; not a registered image observation.',status:o.status})),
  ];
  const obs=new Map(observations.map(o=>[o.id,o]));
  const value=(id:string)=>{const n=obs.get(id)?.value;return typeof n==='number'&&Number.isFinite(n)&&n>0?n:null;};
  const mean=(a:string,b:string)=>{const x=value(a),y=value(b);return x!==null&&y!==null?(x+y)/2:null;};
  const d={outerLength:value('m.coffer.outer_length'),outerWidth:value('m.coffer.outer_width'),outerHeight:value('m.coffer.outer_height'),innerLength:value('m.coffer.inner_length'),innerWidth:value('m.coffer.inner_width'),innerDepth:value('m.coffer.inner_depth'),lidLength:value('m.coffer.lid_length'),lidWidth:value('m.coffer.lid_width'),lidThickness:mean('m.coffer.lid_thickness_min','m.coffer.lid_thickness_max'),length:mean('m.burial.length_n','m.burial.length_s'),width:mean('m.burial.width_e','m.burial.width_w'),height:value('m.burial.wall_height'),rise:value('m.burial.gable_rise.vyse'),west:value('coffer.west_clearance'),north:value('coffer.north_clearance')};
  const frames=[frame(BODY_FRAME,'Coffer object-local','Reconstructed rim centre; rim z=0; length follows +N. Cavity centring is an idealization.'),
    frame(LID_FRAME,'Lid object-local','Idealized lid underside centre; z=0. Physical chamber pose UNKNOWN.'),
    frame(ASSEMBLY_FRAME,'Burial assembly reconstruction','Mean interior plan centre; reconstructed paving/coffer-rim z=0. Not the legacy overview datum.'),
    frame(MONUMENT_FRAME,'Preserved monument overview','Existing parts.json engineering coordinates, unchanged; inherited placements retain their limitations.'),
    frame(SITE_FRAME,'Site / world context','Existing FIELD local ENU frame. Horizontal survey translation and vertical datum unresolved.','UNRESOLVED')];
  const bodyX=d.length!==null&&d.west!==null&&d.outerWidth!==null?-d.length/2+d.west+d.outerWidth/2:null;
  const bodyY=d.width!==null&&d.north!==null&&d.outerLength!==null?d.width/2-d.north-d.outerLength/2:null;
  const transform=(id:string,from:string,to:string,matrix:SpatialTransform['matrix'],observationIds:string[],derivation:string,scope:SpatialTransform['scope']='AUTHORITATIVE_RECONSTRUCTION'):SpatialTransform=>({id,from,to,matrix,status:matrix?'RESOLVED':'UNRESOLVED',scope,authority:'RECONSTRUCTED',observationIds,derivation,uncertainty:unknownUncertainty('No complete placement covariance / independently controlled registration exists.')});
  const chamber=model.parts.find(p=>p.id==='part.burial.chamber');
  const body=model.parts.find(p=>p.id==='part.sarcophagus.body');
  const chamberFloor=chamber?.spatial.primitive.kind==='box'?chamber.spatial.origin_m[2]-chamber.spatial.primitive.sz/2:null;
  const transforms=[
    transform('transform.coffer.assembly',BODY_FRAME,ASSEMBLY_FRAME,bodyX!==null&&bodyY!==null?rigidMatrix([bodyX,bodyY,0]):null,['m.burial.length_n','m.burial.length_s','m.burial.width_e','m.burial.width_w','m.coffer.outer_width','m.coffer.outer_length','coffer.west_clearance','coffer.north_clearance','coffer.orientation','coffer.floor'],'Reported local clearances in idealized mean chamber; flush rim reconstructed from historical description. Source notes subsequent movement; not observed present-day XYZ.'),
    transform('transform.lid.assembly',LID_FRAME,ASSEMBLY_FRAME,null,['coffer.lid'],'Detached lid is reported; measured physical position/orientation in chamber is UNKNOWN. Inspection lift is never this transform.'),
    transform('transform.assembly.monument',ASSEMBLY_FRAME,MONUMENT_FRAME,null,['coffer.floor','coffer.orientation'],'Blocked: legacy orientation and floor/rim disagree. No surveyed control/registration establishes a corrected archaeological transform.'),
    transform('transform.monument.site',MONUMENT_FRAME,SITE_FRAME,null,[],'FIELD orientation prior is unapplied; site translation and vertical datum remain unresolved. Geographic context is not metric control.'),
    transform('comparison.assembly.legacy-floor',ASSEMBLY_FRAME,MONUMENT_FRAME,chamber&&chamberFloor!==null?rigidMatrix([chamber.spatial.origin_m[0],chamber.spatial.origin_m[1],chamberFloor]):null,['m.burial.wall_height'],'Comparison adapter only: align reconstructed chamber floor with preserved envelope floor to quantify disagreement. NOT a promotion or measurement frame.','COMPARISON_ONLY'),
  ];
  const features:EvidenceFeature[]=[];
  const add=(id:string,objectId:string,label:string,frameId:string,geometry:FeatureGeometry,observationIds:string[],derivation:string,unknowns:string[]=[],authority:RealityAuthority='RECONSTRUCTED',numeric:number|null=null,unit:string|null=null,uncertainty:Uncertainty=unknownUncertainty())=>features.push({id,objectId,label,frameId,geometry,observationIds,derivation,unknowns,authority,value:numeric,unit,uncertainty,coordinateAuthority:geometry.kind==='unknown'?'UNKNOWN':'RECONSTRUCTED'});
  const bodyId='part.sarcophagus.body',lidId='part.sarcophagus.lid',roomId='part.burial.chamber';
  const cofferIds=['m.coffer.outer_width','m.coffer.outer_length','m.coffer.outer_height','m.coffer.inner_width','m.coffer.inner_length','m.coffer.inner_depth'];
  const ideal='Idealized planar reconstruction from reported dimensions; centred rectangular cavity is not a mapped survey surface.';
  const surfaceUnknown=['Actual surface irregularities, chips and local face positions UNKNOWN.','Complete propagated uncertainty UNKNOWN.'];
  const validBody=cofferIds.every(id=>value(id)!==null)&&d.innerWidth!<d.outerWidth!&&d.innerLength!<d.outerLength!&&d.innerDepth!<d.outerHeight!;
  if(validBody){
    const w=d.outerWidth!/2,l=d.outerLength!/2,iw=d.innerWidth!/2,il=d.innerLength!/2,h=d.outerHeight!,depth=d.innerDepth!;
    add('feature.coffer.wall.west',bodyId,'West wall / rim',BODY_FRAME,box([-w,-l,-depth],[-iw,l,0]),['m.coffer.outer_width','m.coffer.inner_width','m.coffer.outer_length','m.coffer.inner_depth'],ideal,surfaceUnknown);
    add('feature.coffer.wall.east',bodyId,'East wall / rim',BODY_FRAME,box([iw,-l,-depth],[w,l,0]),['m.coffer.outer_width','m.coffer.inner_width','m.coffer.outer_length','m.coffer.inner_depth'],ideal,surfaceUnknown);
    add('feature.coffer.wall.north',bodyId,'North end / rim',BODY_FRAME,box([-iw,il,-depth],[iw,l,0]),['m.coffer.inner_width','m.coffer.inner_length','m.coffer.outer_length','m.coffer.inner_depth'],ideal,surfaceUnknown);
    add('feature.coffer.wall.south',bodyId,'South end / rim',BODY_FRAME,box([-iw,-l,-depth],[iw,-il,0]),['m.coffer.inner_width','m.coffer.inner_length','m.coffer.outer_length','m.coffer.inner_depth'],ideal,surfaceUnknown);
    add('feature.coffer.base',bodyId,'Cavity floor / base',BODY_FRAME,box([-w,-l,-h],[w,l,-depth]),['m.coffer.outer_width','m.coffer.outer_length','m.coffer.outer_height','m.coffer.inner_depth','coffer.bottom.saw_overcut','coffer.surface.finish'],'Base thickness is outer height minus cavity depth. Reported overcut is not carved without a mapped location/profile.',surfaceUnknown);
  }else add('feature.coffer.body.unknown',bodyId,'Body geometry unavailable',BODY_FRAME,unknownGeometry('Required dimensions absent, invalid, or cavity exceeds body.'),cofferIds,'Fail closed: never replace missing dimensions with defaults.',['Body dimensions UNKNOWN.']);
  if(d.lidLength!==null&&d.lidWidth!==null&&d.lidThickness!==null){
    add('feature.lid.envelope',lidId,'Lid mean-thickness envelope',LID_FRAME,box([-d.lidWidth/2,-d.lidLength/2,0],[d.lidWidth/2,d.lidLength/2,d.lidThickness]),['m.coffer.lid_width','m.coffer.lid_length','m.coffer.lid_thickness_min','m.coffer.lid_thickness_max'],'Plan dimensions reported at different edges; midpoint thickness is visualization only, not a uniform physical lid.',['Thickness field / taper UNKNOWN.','Actual closure fit and seating height UNKNOWN.','Actual chamber placement UNKNOWN.']);
  }else add('feature.lid.envelope',lidId,'Lid geometry unavailable',LID_FRAME,unknownGeometry('Required lid dimensions absent.'),['m.coffer.lid_width','m.coffer.lid_length','m.coffer.lid_thickness_min','m.coffer.lid_thickness_max'],'Missing dimensions remain UNKNOWN.',['Lid surface UNKNOWN.']);
  const planIds=['m.burial.length_n','m.burial.length_s','m.burial.width_e','m.burial.width_w'];
  if(d.length!==null&&d.width!==null&&d.height!==null){
    const L=d.length/2,W=d.width/2,H=d.height;
    for(const [side,vertices] of Object.entries({west:[[-L,-W,0],[-L,W,0],[-L,W,H],[-L,-W,H]],east:[[L,-W,0],[L,W,0],[L,W,H],[L,-W,H]],north:[[-L,W,0],[L,W,0],[L,W,H],[-L,W,H]],south:[[-L,-W,0],[L,-W,0],[L,-W,H],[-L,-W,H]]}))
      add(`feature.chamber.${side}`,roomId,`${side[0].toUpperCase()+side.slice(1)} chamber boundary`,ASSEMBLY_FRAME,{kind:'surface',vertices:vertices as Vec3[]},[...planIds,'m.burial.wall_height'],'Mean orthogonal envelope; individual opposing wall lengths differ. Boundary surface only; no invented wall thickness.',['Surveyed wall surface and local deviation UNKNOWN.','Door opening height UNKNOWN; doorway is only a plan anchor.']);
    add('feature.chamber.floor', 'part.burial.floor_paving','Reconstructed floor datum',ASSEMBLY_FRAME,{kind:'surface',vertices:[[-L,-W,0],[L,-W,0],[L,W,0],[-L,W,0]]},[...planIds,'coffer.floor','burial.floor.disturbance'],'Reference surface, not a complete physical floor slab. Opening/recess profile and disturbed paving are UNKNOWN.',['Coffer recess and present floor surface UNKNOWN.']);
    const start=value('m.burial.door_from_e.start'),end=value('m.burial.door_from_e.end');
    add('feature.chamber.doorway',roomId,'North doorway plan interval',ASSEMBLY_FRAME,start!==null&&end!==null?{kind:'segment',a:[L-end,W,0],b:[L-start,W,0]}:unknownGeometry('Door offsets absent'),['m.burial.door_from_e.start','m.burial.door_from_e.end',...planIds],'Reported plan interval at floor datum; no invented 1.805 m door height.',['Door height, jamb profile and independently surveyed connection transform UNKNOWN.'],'RECONSTRUCTED',start!==null&&end!==null?end-start:null,'m');
    if(d.rise!==null)for(const sign of [-1,1])add(`feature.chamber.roof.${sign<0?'south':'north'}`,'part.burial.gable_envelope',`${sign<0?'South':'North'} gable boundary`,ASSEMBLY_FRAME,{kind:'surface',vertices:[[-L,0,H+d.rise],[L,0,H+d.rise],[L,sign*W,H],[-L,sign*W,H]]},[...planIds,'m.burial.wall_height','m.burial.gable_rise.vyse'],'Vyse rise reported by Petrie; idealized envelope only. No fabricated beam joints.',['Individual beam profiles / thickness / joints UNKNOWN.']);
  }
  const segments:[string,string,string,string,Vec3,Vec3][]=[];
  if(d.outerLength!==null)segments.push(['m.coffer.outer_length',bodyId,'Outer length',BODY_FRAME,[0,-d.outerLength/2,0],[0,d.outerLength/2,0]]);
  if(d.outerWidth!==null)segments.push(['m.coffer.outer_width',bodyId,'Mean outer width',BODY_FRAME,[-d.outerWidth/2,0,0],[d.outerWidth/2,0,0]]);
  if(d.outerHeight!==null)segments.push(['m.coffer.outer_height',bodyId,'Outer height',BODY_FRAME,[0,0,-d.outerHeight],[0,0,0]]);
  if(d.innerLength!==null)segments.push(['m.coffer.inner_length',bodyId,'Cavity length',BODY_FRAME,[0,-d.innerLength/2,0],[0,d.innerLength/2,0]]);
  if(d.innerWidth!==null)segments.push(['m.coffer.inner_width',bodyId,'Cavity width',BODY_FRAME,[-d.innerWidth/2,0,0],[d.innerWidth/2,0,0]]);
  if(d.innerDepth!==null)segments.push(['m.coffer.inner_depth',bodyId,'Cavity depth',BODY_FRAME,[0,0,-d.innerDepth],[0,0,0]]);
  if(d.lidLength!==null)segments.push(['m.coffer.lid_length',lidId,'Lid west length',LID_FRAME,[0,-d.lidLength/2,0],[0,d.lidLength/2,0]]);
  if(d.lidWidth!==null)segments.push(['m.coffer.lid_width',lidId,'Lid south width',LID_FRAME,[-d.lidWidth/2,0,0],[d.lidWidth/2,0,0]]);
  for(const [id,object,label,fid,a,b] of segments)add(`feature.dimension.${id}`,object,label,fid,{kind:'segment',a,b},[id],'Cited scalar represented on a reconstructed reference line; line position is not an observed/surveyed edge.',[],obs.get(id)!.authority,value(id),'m',obs.get(id)!.uncertainty);
  // Keep every cited scalar accessible even when its geometric location/profile is unknown.
  for(const o of observations.filter(o=>typeof o.value==='number'&&!segments.some(s=>s[0]===o.id)))add(`feature.record.${o.id}`,o.id.includes('lid')?lidId:o.id.includes('burial')?roomId:bodyId, o.id.replace(/^m\./,'').replaceAll('.',' · ').replaceAll('_',' '),o.id.includes('lid')?LID_FRAME:o.id.includes('burial')?ASSEMBLY_FRAME:BODY_FRAME,unknownGeometry('Scalar/range is sourced; a unique mapped feature position is not established.'),[o.id],o.derivation,['Mapped feature geometry UNKNOWN.'],o.authority,typeof o.value==='number'?o.value:null,o.unit,o.uncertainty);
  for(const side of ['n','s']){
    const across=value(`coffer.pin_${side}.from_w_outer`),along=value(`coffer.pin_${side}.from_${side}_inner`),diameter=value('coffer.pin_diameter');
    const p:Vec3|null=across!==null&&along!==null&&d.outerWidth!==null&&d.innerLength!==null?[-d.outerWidth/2+across,side==='n'?d.innerLength/2-along:-d.innerLength/2+along,0]:null;
    add(`feature.coffer.pin.${side}`,bodyId,`${side==='n'?'North':'South'} locking-pin marker`,BODY_FRAME,p?{kind:'point',point:p}:unknownGeometry('Pin offsets absent'),[`coffer.pin_${side}.from_w_outer`,`coffer.pin_${side}.from_${side}_inner`,'coffer.pin_diameter','m.coffer.outer_width','m.coffer.inner_length'],'Transcript edge-midpoint marker only, not a cylindrical bore.',['Bore depth / axis / shape UNKNOWN.'],'RECONSTRUCTED',diameter,'m');
  }
  add('feature.lid.closure-hypothesis',lidId,'Proposed closure / sliding fit',LID_FRAME,unknownGeometry('Groove geometry, engagement, seating and measured closure pose are absent.'),['coffer.lid','coffer.ledge_n.width_min','coffer.ledge_n.width_max','coffer.ledge_s.width_min','coffer.ledge_s.width_max'],'Historical sliding direction is reported, but a collision/clearance model cannot be inferred from plan envelopes.',['Contact geometry, fit clearance and admissible closure trajectory UNKNOWN.'],'HYPOTHESIS');
  const constraints:AssemblyConstraint[]=[
    {id:'constraint.cavity.within-body',kind:'CONTAINMENT',featureIds:['feature.coffer.base','feature.coffer.wall.west','feature.coffer.wall.east'],observationIds:cofferIds,status:cofferIds.every(id=>value(id)!==null)?validBody?'SATISFIED':'VIOLATED':'UNKNOWN',value:null,unit:null,note:'Necessary envelope containment only; no claim about surface-level fit.'},
    {id:'constraint.lid.fit',kind:'CLEARANCE',featureIds:['feature.lid.envelope','feature.coffer.wall.west','feature.lid.closure-hypothesis'],observationIds:['coffer.lid','m.coffer.lid_width','m.coffer.outer_width'],status:'UNKNOWN',value:null,unit:'m',note:'Plan overhang is not closure clearance. Groove/contact profiles and actual lid pose are UNKNOWN.'},
    {id:'constraint.chamber.connection',kind:'CONNECTION',featureIds:['feature.chamber.doorway'],observationIds:['m.burial.door_from_e.start','m.burial.door_from_e.end'],status:'UNKNOWN',value:null,unit:'m',note:'Known north doorway references the existing upper route. Navigable metric connection requires validated endpoint orientation, elevation and opening geometry; no new space is created.'},
    {id:'constraint.coffer.west-clearance',kind:'CLEARANCE',featureIds:['feature.coffer.wall.west','feature.chamber.west'],observationIds:['coffer.west_clearance'],status:bodyX!==null?'SATISFIED':'UNKNOWN',value:d.west,unit:'m',note:'Source-derived mean in reconstructed assembly; later movement noted. Not a present-day measured clearance.'},
    {id:'constraint.coffer.north-clearance',kind:'CLEARANCE',featureIds:['feature.coffer.wall.north','feature.chamber.north'],observationIds:['coffer.north_clearance'],status:bodyY!==null?'SATISFIED':'UNKNOWN',value:d.north,unit:'m',note:'Source-reported clearance used as reconstruction constraint; full uncertainty UNKNOWN.'},
  ];
  const legacyRim=body?.spatial.primitive.kind==='box'?body.spatial.origin_m[2]+body.spatial.primitive.sz/2:null;
  // Missing inputs remain explicit graph nodes, not broken links or fabricated defaults.
  for(const id of new Set([...features.flatMap(f=>f.observationIds),...transforms.flatMap(t=>t.observationIds),...constraints.flatMap(c=>c.observationIds)]))if(!obs.has(id)){
    const missing:EvidenceObservation={id,sourceId:'source.unknown',locator:'UNKNOWN',value:null,unit:null,nativeValue:null,nativeUnit:null,uncertainty:unknownUncertainty('Required source record is absent.'),authority:'RECONSTRUCTED',status:'MISSING',derivation:'UNKNOWN: missing input record; no substitute value or source was invented.'};
    observations.push(missing);obs.set(id,missing);
  }
  for(const id of new Set(constraints.flatMap(c=>c.featureIds)))if(!features.some(f=>f.id===id))add(id,id.includes('chamber')?roomId:bodyId,'Unavailable constrained feature',id.includes('chamber')?ASSEMBLY_FRAME:BODY_FRAME,unknownGeometry('Required measurements are unavailable.'),[], 'Constraint target preserved as UNKNOWN until evidence exists.',['Geometry UNKNOWN.']);
  const sources=[...new Set(observations.map(o=>o.sourceId))].map(id=>{
    const canonical=model.sourceRegistry?.find(s=>s.id===id),detail=model.componentResearch?.sources?.find(s=>s.id===id);
    return {id,title:canonical?.title??detail?.title??id,url:canonical?.url??detail?.url??'',authority:detail?.geometry_authority??'CITED_MEASUREMENTS_ONLY',byteStatus:'UNKNOWN' as const};
  });
  return {schemaVersion:'giza.evidence-assembly.v1',id:'assembly.khafre.sarcophagus',title:'Khafre Sarcophagus Evidence Assembly',authoritativeFrameId:ASSEMBLY_FRAME,frames,transforms,sources,observations,features,constraints,
    audit:[
      {id:'audit.coffer.axis',label:'Coffer long-axis disagreement',status:'DISAGREEMENT',legacyValue:body?.spatial.rpy_rad[2]??null,detailValue:Math.PI/2,difference:body?Math.PI/2-body.spatial.rpy_rad[2]:null,unit:'rad',observationIds:['coffer.orientation'],note:'Legacy envelope has length along X; detail reconstruction has length along Y. A single chamber translation cannot reconcile this.'},
      {id:'audit.coffer.floor-rim',label:'Legacy rim above chamber-floor adapter',status:'DISAGREEMENT',legacyValue:legacyRim!==null&&chamberFloor!==null?legacyRim-chamberFloor:null,detailValue:0,difference:legacyRim!==null&&chamberFloor!==null?chamberFloor-legacyRim:null,unit:'m',observationIds:['coffer.floor','m.coffer.outer_height','m.burial.wall_height'],note:'Difference = detail minus legacy. Comparison only. Legacy body sits above its chamber floor; detail reconstructs a recessed coffer with rim at floor. Neither data set is silently rewritten.'},
      {id:'audit.coffer.north-offset',label:'Legacy/detail north–south offset',status:'DISAGREEMENT',legacyValue:body&&chamber?body.spatial.origin_m[1]-chamber.spatial.origin_m[1]:null,detailValue:bodyY,difference:body&&chamber&&bodyY!==null?bodyY-(body.spatial.origin_m[1]-chamber.spatial.origin_m[1]):null,unit:'m',observationIds:['coffer.north_clearance','m.burial.width_e','m.burial.width_w','m.coffer.outer_length'],note:'Difference = detail minus legacy. Reported northern clearance versus preserved centred overview body.'},
      {id:'audit.coffer.west-offset',label:'Legacy/detail east–west offset',status:'DISAGREEMENT',legacyValue:body&&chamber?body.spatial.origin_m[0]-chamber.spatial.origin_m[0]:null,detailValue:bodyX,difference:body&&chamber&&bodyX!==null?bodyX-(body.spatial.origin_m[0]-chamber.spatial.origin_m[0]):null,unit:'m',observationIds:['coffer.west_clearance','m.burial.length_n','m.burial.length_s','m.coffer.outer_width','m.coffer.outer_length'],note:'Difference = detail minus legacy. The legacy long-axis orientation uses a different extent when locating the body from the west wall; a rotation about its old centre is insufficient.'},
      {id:'audit.site.datum',label:'Site/world datum unresolved',status:'UNRESOLVED',legacyValue:null,detailValue:null,difference:null,unit:'m',observationIds:[],note:'Geospatial FIELD context anchor is not survey control. No precise world coordinate export is authorized.'},
    ],limitations:[
      'Source-reported dimensions constrain idealized geometry; this is not a scan or new archaeological survey.',
      'No metric registration, independent scale/control, holdout result or feature-image residual is established for this assembly.',
      'Raw source-byte custody must be resolved through the existing source vault; this contract does not assert that a source URL is a byte receipt.',
      'Missing uncertainty is UNKNOWN, never zero. Apparent decimal precision is not measurement accuracy.',
      'Cavity centring, planar orthogonal faces and mean chamber envelope are explicit reconstruction assumptions.',
      'Lid inspection position, selection, explode, camera and animation are presentation only, excluded from measurement and export.',
      'Physical lid pose, closure fit, groove profile, pin depth, recess profile, per-beam and per-stone geometry remain UNKNOWN.',
      'Assembly→monument→site transforms remain blocked pending reconciliation and independently controlled evidence.',
    ]};
}

export function visibleFeatures(assembly:EvidenceAssembly,layers:Readonly<Record<RealityAuthority,boolean>>):EvidenceFeature[] {return assembly.features.filter(f=>layers[f.authority]===true);}
