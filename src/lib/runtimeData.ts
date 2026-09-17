/** Runtime trust boundary, not archaeological validation. Unknown keys are retained verbatim.
 * Failed optional documents are quarantined; their inert shape is NEVER a research result. */
export interface RuntimeDiagnostic { url:string; status:'UNAVAILABLE'; reason:string; scope:string }
type Rule = 'string'|'number'|'boolean'|'value'|'record'|{[key:string]:Rule}|Rule[];
const S:Rule='string', N:Rule='number', B:Rule='boolean', V:Rule='value', R:Rule='record';
const strings=[S], numbers=[N];
const fields=(names:string):Record<string,Rule>=>Object.fromEntries(names.split(' ').map(key=>[key,S]));
const photo={...fields('id title kind image_url page_url author date license credit caption'),bind:strings};
const observation={...fields('id source locator status'),value:V};
const measure={...fields('id component quantity source_id status'),native_value:V,native_unit:V,si_value:V,si_unit:V};
const provenance={class:S,created_by:S};
const map={...fields('id version title coordinate_mode guard'),metric:B,layers:strings};
const result={...fields('run_id experiment_id solver_id solver_version provenance_class truth_status geometry_revision geometry_hash input_hash status created_at interpretation_guard')};
const benchmark={benchmark_id:S,provenance_class:S,tests:[{id:S,pass:B}],pass:B};
const nullScreen={n:N,mean:N,stddev:N,min:N,max:N,actual_percentile_le:N};
const point={coordinates_m:numbers};
const stress={vertical_overburden_proxy_mpa:N,proxy_to_ucs_ratio:{best_case:N,worst_case:N}};

/** Deliberately explicit consumed-field contracts; no sample values enter fallbacks. */
export const runtimeContracts:Record<string,Rule>={
  '/model/project.json':R,
  '/model/parts.json':{parts:[{id:S,name:S,spatial:{origin_m:numbers,rpy_rad:numbers,primitive:{kind:S},assembly_stage:N,explosion_vector:numbers,explosion_distance_m:N},provenance}]},
  '/model/assemblies.json':{assemblies:[{id:S,name:S,children:strings,provenance}]},
  '/model/research/measurements.json':{measurements:[measure]},
  '/model/research/hypotheses.json':{hypotheses:[R]},
  '/model/research/calculations.json':R,
  '/model/photo_index.json':{photos:[photo]},
  '/model/atlas_objects.json':{objects:R,sources:[{id:S,title:S,url:S,role:S}]},
  '/model/stone_field.json':{...fields('version id name provenance truth_warning'),base_m:N,height_m:N,visual_course_count:N,target_block_width_m:N,radial_depth_m:N,joint_gap_fraction:N,seed:N,explode_modes:strings},
  '/model/evidence/evidence_items.json':{items:[{...fields('id kind maturity status provenance_class'),targets:strings,source_ids:strings,claims:strings}]},
  '/model/evidence/source_registry.json':{sources:[{...fields('id title kind url access asset_action')}]},
  '/model/evidence/evidence_maturity.json':{levels:[{id:S,name:S,meaning:S,allowed_mutation:V}]},
  '/model/solvers/solver_registry.json':{solvers:[{id:S,name:S,purpose:S,contract:S}]},
  '/model/evidence/object_source_map.json':{...fields('version canon_phase rule'),part_count:N,parts:R,future_scope:R},
  '/model/evidence/conflict_matrix.json':{conflicts:[{...fields('id quantity scope status canonical_rule severity'),observations:[R]}]},
  '/model/evidence/rights_matrix.json':{rows:[{...fields('source_id rights_class access asset_action'),may_store_numeric_facts:B,may_store_citation_metadata:B,may_bundle_original_media:B,requires_per_asset_check:B,geometry_write_authority:N}]},
  '/model/evidence/acquisition_backlog.json':{backlog:[{...fields('id source_id goal desktop_action expected_gain size_risk'),priority:N}]},
  '/model/research/material_properties.json':{...fields('version source_id material_scope status model_warning'),solver_use:{allowed_as_prior:B,requires_uncertainty_sampling:B,cannot_override_measured_block_specific_data:B},properties:[{id:S,quantity:S,unit:S}],petrography:R},
  '/model/research/complex_measurements.json':{measurements:[{...fields('id target quantity source_id status geometry_use')}]},
  '/model/field/field_manifest.json':{...fields('version codename geospatial_anchor'),terrain_active:B,photo_nodes:N,photo_edges:N,numeric_uncertainty_targets:N,promotion_targets:N,acquisition_targets:N,truth_guards:strings},
  '/model/field/geospatial_frame.json':{...fields('version field_phase'),reference_anchor:{...fields('id vertical_datum source_id source_locator status horizontal_authority vertical_authority'),latitude_deg:N,longitude_deg:N,ellipsoid_height_m:V},local_frame:{...fields('id units handedness origin_geodetic status'),rotation_to_monument:V,axes:R,origin_local_m:numbers},transform:{...fields('method formula z_rule precision_rule'),max_intended_radius_m:N},required_upgrade:strings},
  '/model/field/terrain_registry.json':{version:S,active_layer:V,render_status:S,fallback:S,layers:[{...fields('id source_id status model_role allowed_precision_claim field_status truth_rule'),native_resolution_m:V,not_allowed:strings,display_allowed:B,local_asset:V,transform_receipt:V}],ingest_gate:{required:strings,qa_status_required:S,allowed_model_role:S}},
  '/model/field/photo_graph.json':{version:S,node_count:N,edge_count:N,rule:S,nodes:[{...fields('id title kind view_class calibration_status photogrammetry_role source_page license'),targets:strings,camera_pose:V,intrinsics:V}],edges:[{...fields('a b relation target overlap_status photogrammetry_use')}],upgrade_gate:R},
  '/model/field/uncertainty_envelopes.json':{version:S,policy:S,records:[{target:S,maturity:S,status:S,parameters:[{quantity:S,value:N,uncertainty:N,unit:S,source_id:S}],render_envelope:{kind:S,pad_m:numbers,meaning:S}}],fallback:{status:S,render:B}},
  '/model/field/promotion_state.json':{version:S,rule:S,states:[{target_id:S,current:S,target:S,status:S,blockers:strings}],queue:[R]},
  '/model/field/acquisition_targets.json':{version:S,targets:[{priority:N,id:S,target:S,goal:S,requirements:strings,status:S}],software_rule:S},
  '/model/research/findings_registry.json':{...fields('version registry_id purpose last_reviewed_version generated_at'),status_vocabulary:R,invariants:strings,entries:[{...fields('id title status priority domain truth_class summary why_interesting next_test guard'),controls:strings}]},
  '/model/intent/hypotheses.json':{hypotheses:[{id:S,label:S,question:S,prior_status:S,critical_expected_evidence:strings,falsifier:S}]},
  '/model/intent/synthesis.json':{results:[{hypothesis_id:S,label:S,prior_status:S,support_weight:N,limitation_weight:N,missing_expected_weight:N,evidence_balance_index:N,coverage_index:N,interpretation_guard:S}]},
  '/model/maps/manifest.json':{...fields('schema_version version phase atlas_id title purpose'),truth_rules:strings,maps:[{...fields('id label subtitle truth_class geometry_authority file')}],default_layers:strings,source_ids:strings,ui_contract:R},
  '/model/maps/layers/plateau_master.json':{...map,source_ids:strings,extent:R,features:[{id:S,label:S,kind:S,x:N,y:N,size:N,status:S,source_ids:strings}],connections:[{from:S,to:S,kind:S,label:S,status:S}]},
  '/model/maps/layers/ritual_route.json':{...map,source_ids:strings,stages:[{order:N,id:S,label:S,role:S,evidence:S,x:N,y:N,source_ids:strings}],sequence_edges:[numbers],questions:strings},
  '/model/maps/layers/action_graph.json':{...map,source_ids:strings,nodes:[{id:S,kind:S,label:S,x:N,y:N,epistemic_status:S,evidence_strength_index:N,evidence_record_ids:strings}],edges:[{from:S,to:S,relation:S,status:S}]},
  '/model/maps/layers/room_graph.json':{...map,source_ids:strings,spaces:[{...fields('id complex label kind status access visibility'),x:N,y:N,evidence:strings}],thresholds:[{...fields('id from to kind status'),evidence:strings}]},
  '/model/maps/layers/visibility_lab.json':{...map,source_ids:strings,spaces:[{...fields('id label complex kind visibility_state environment certainty'),x:N,y:N,topological_depth:V,is_branch:B,is_merge:B,is_articulation:B}],thresholds:[{...fields('id from to kind status'),evidence:strings}],transitions:[{...fields('threshold_id from to from_environment to_environment contrast_class status guard'),contrast_index:N}]},
  '/model/maps/layers/metric_readiness.json':{...map,source_ids:strings,targets:[{id:S,target:S,state:S,progress:N,blocking:strings,candidate_id:S}],metric_ray_count:N,registered_plan_count:N},
  '/model/maps/layers/survey_control.json':{...map,source_ids:strings,frame_id:S,vertical_status:S,translation_to_khafre_local:S,points:[{id:S,label:S,e:N,n:N,kind:S}],orientation_prior:{yaw_arcmin:N,yaw_deg:N,rms_side_residual_arcmin:N,max_abs_residual_arcmin:N,measured_point_count:N,status:S}},
  '/model/maps/layers/geology_quarry.json':{...map,source_ids:strings,bands:[{id:S,label:S,y:N,thickness:N,truth:S}],sequence:[{before:S,after:S,claim:S,status:S}]},
  '/model/maps/layers/historical_sources.json':{...map,source_ids:strings,events:[{year:N,label:S,kind:S,status:S}]},
  '/model/maps/layers/intent_map.json':{...map,center:{label:S,x:N,y:N},hypothesis_ids:strings},
  '/model/maps/layers/photo_coverage.json':{...map,source_ids:strings,coverage:[{target:S,reviewed_assets:N,registration_state:S}]},
  '/model/maps/narratives/ritual_sequence.json':{version:S,title:S,chapters:[{id:S,title:S,plain:S,source_ids:strings}]},
  '/model/simlab/simlab_manifest.json':{version:S,codename:S,status:S,active_solvers:strings,planned_solvers:strings,first_experiment:S,visualization:R,truth_invariant:S},
  '/model/simlab/results/gravity.deep-claim-conditional.json':{...result,parameters:R,controls:R,uncertainty:R,components:[{id:S,primitive:R,volume_m3:N}],total_modeled_void_volume_m3:N,element_count:N,observation_count:N,summary:{min_microgal:N,max_microgal:N,max_magnitude_microgal:N,peak:V},points:[{...point,upward_delta_g_microgal:N,conventional_downward_delta_g_microgal:N,magnitude_microgal:N}]},
  '/model/simlab/benchmarks/gravity_benchmark.json':benchmark,
  '/model/simlab/results/acoustic.known-interiors-screening.json':{...result,atmosphere:{temperature_c:N,relative_humidity_percent:V,pressure_pa:V,sound_speed_m_s:N,model:S},boundary_model:{kind:S,passages:S,cavities:S,warning:S},loss_model:{kind:S,q_screening:N,warning:S},frequency:{min_hz:N,max_hz:N,step_hz:N,max_mode_order:N},components:[{id:S,part_id:S,model:S,weight:N,truth_note:S,modes:[{frequency_hz:N,mode:numbers}]}],response:{kind:S,q:N,points:[{frequency_hz:N,screening_amplitude:N}],peaks:[{frequency_hz:N,screening_amplitude:N,dominant_components:[{component_id:S,amplitude:N}]}]},selected_visualization:{component_id:S,part_id:S,mode:numbers,frequency_hz:N,meaning:S,points:[{...point,normalized_pressure:N}]},coincidence_screen:{tolerance_hz:N,min_components:N,first_modes:N,actual_cluster_count:N,clusters:[{frequency_hz:N,component_count:N,components:strings}],independent_null:nullScreen,constraint_preserving_null:nullScreen,interpretation:S},controls:R,uncertainty:R,human_summary:{headline:S,burial_fundamental_hz:N,lower_fundamental_hz:V,first_pass_interpretation:S,design_claim_status:S}},
  '/model/simlab/benchmarks/acoustic_benchmark.json':{...benchmark,solver_id:S,sound_speed_m_s:N,created_at:S},
  '/model/simlab/results/strata.deep-claim-screening.json':{...result,parameters:R,material_prior:{source_id:S,scope:S,ucs_mpa:{min:N,max:N},warning:S},geomechanics:{kind:S,shaft_bottom:stress,terminal_center:stress,known_lower_chamber_reference:{vertical_overburden_proxy_mpa:N},density_sensitivity:[R],warning:S},hydraulics:{kind:S,shaft_bottom:{hypothetical_freshwater_pressure_mpa:N},terminal_center:{hypothetical_freshwater_pressure_mpa:N},dry_null_pressure_mpa:N,warning:S},field_points:[{...point,component_id:S,depth_m:N,stress_mpa:N,hydraulic_pressure_mpa:N}],controls:R,uncertainty:R,human_summary:R},
  '/model/simlab/benchmarks/strata_benchmark.json':{...benchmark,solver_id:S,created_at:S},
  '/model/component_research.json':{version:N,reviewed:S,photos:[photo],sources:[{id:S,title:S,url:S,kind:S,geometry_authority:S,note:S}],observations:[observation],limitations:strings},
};

export const requiredDatasets=new Set(['/model/project.json','/model/parts.json','/model/assemblies.json','/model/research/measurements.json','/model/stone_field.json']);
const object=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v);
export function validateRuntimeShape(value:unknown,rule:Rule,path='$'):void {
  if(Array.isArray(rule)){
    if(!Array.isArray(value))throw new Error(`${path}: expected array`);
    value.forEach((item,i)=>validateRuntimeShape(item,rule[0],`${path}[${i}]`));return;
  }
  if(typeof rule==='object'){
    if(!object(value))throw new Error(`${path}: expected object`);
    for(const [key,child] of Object.entries(rule))validateRuntimeShape(value[key],child,`${path}.${key}`);return;
  }
  const valid=rule==='record'?object(value):rule==='value'?value!==undefined:
    rule==='number'?typeof value==='number'&&Number.isFinite(value):typeof value===rule;
  if(!valid)throw new Error(`${path}: expected ${rule}`);
}
export function inertRuntimeShape(rule:Rule):unknown {
  if(Array.isArray(rule))return [];
  if(typeof rule==='object')return Object.fromEntries(Object.entries(rule).map(([key,child])=>[key,inertRuntimeShape(child)]));
  return rule==='string'?'UNAVAILABLE':rule==='number'?NaN:rule==='boolean'?false:rule==='record'?{}:null;
}
export function runtimeScope(url:string):string {
  if(url.includes('/maps/'))return 'ATLAS';if(url.includes('/simlab/'))return 'SIMULATION';
  if(url.includes('/field/'))return 'FIELD';if(url.includes('component_research'))return 'COMPONENT';
  if(url.includes('findings_registry'))return 'FINDINGS';return 'EVIDENCE';
}
export function unavailable(diagnostics:RuntimeDiagnostic[]|undefined,scope:string):boolean{return !!diagnostics?.some(d=>d.scope===scope);}

export function validateRuntimeDocument(url:string,value:unknown):void {
  const rule=runtimeContracts[url];if(!rule)throw new Error(`No runtime contract for ${url}`);
  validateRuntimeShape(value,rule);
  const doc=value as Record<string,any>;
  for(const key of ['parts','assemblies','measurements','photos','observations','entries','sources','items','levels','solvers'])if(Array.isArray(doc[key])){
    const ids=doc[key].map((row:{id?:string})=>row.id).filter(Boolean);
    if(new Set(ids).size!==ids.length)throw new Error(`${url}.${key}: duplicate record identifiers`);
  }
  if(url==='/model/parts.json')for(const part of doc.parts){
    for(const key of ['origin_m','rpy_rad','explosion_vector'])if(part.spatial[key].length!==3)throw new Error(`${part.id}.${key}: expected 3 coordinates`);
    const p=part.spatial.primitive;
    const dims=p.kind==='box'?['sx','sy','sz']:p.kind==='cylinder'?['radius','height']:null;
    if(!dims||dims.some(key=>typeof p[key]!=='number'||!Number.isFinite(p[key])||p[key]<=0))throw new Error(`${part.id}: invalid primitive dimensions`);
    if(!['SOURCE','DERIVED','GENERATED','SIMULATED','VALIDATED','MEASURED','ASSUMED','UNVERIFIED','USER_LOCKED'].includes(part.provenance.class))throw new Error(`${part.id}: unknown provenance class`);
  }
  if(url==='/model/stone_field.json'){
    if(['base_m','height_m','visual_course_count','target_block_width_m','radial_depth_m'].some(key=>doc[key]<=0)||!Number.isInteger(doc.visual_course_count)||doc.joint_gap_fraction<0||doc.joint_gap_fraction>=1)throw new Error('stone field: invalid construction dimensions');
  }
  if(url==='/model/research/measurements.json')for(const row of doc.measurements){
    for(const key of ['native_value','si_value'])if(row[key]!==null&&typeof row[key]!=='string'&&(typeof row[key]!=='number'||!Number.isFinite(row[key])))throw new Error(`${row.id}: invalid ${key}`);
    for(const key of ['native_unit','si_unit'])if(row[key]!==null&&typeof row[key]!=='string')throw new Error(`${row.id}: invalid ${key}`);
    if(row.uncertainty_si!=null&&(typeof row.uncertainty_si!=='number'||!Number.isFinite(row.uncertainty_si)||row.uncertainty_si<0))throw new Error(`${row.id}: invalid uncertainty`);
  }
  if(url==='/model/component_research.json')for(const row of doc.observations){
    if(typeof row.value!=='string'&&(typeof row.value!=='number'||!Number.isFinite(row.value)))throw new Error(`${row.id}: invalid observation value`);
    if(row.si_value!==undefined&&(typeof row.si_value!=='number'||!Number.isFinite(row.si_value)))throw new Error(`${row.id}: invalid observation SI value`);
    if(row.bind!==undefined)validateRuntimeShape(row.bind,strings,`${row.id}.bind`);
    if(!doc.sources.some((source:{id:string})=>source.id===row.source))throw new Error(`${row.id}: unbound observation source`);
  }
  if(url==='/model/atlas_objects.json')for(const [id,row] of Object.entries(doc.objects))validateRuntimeShape(row,{title:S,simple:S,why_known:S,measurement_components:strings,questions:strings},id);
  if(url==='/model/evidence/object_source_map.json')for(const [id,rows] of Object.entries(doc.parts))validateRuntimeShape(rows,[{source_id:S,role:S,write_authority:S}],id);
  if(url==='/model/evidence/source_registry.json')for(const source of doc.sources){
    if(source.authority!==undefined)validateRuntimeShape(source.authority,{geometry:N,materials:N,visual:N,method:N},`${source.id}.authority`);
    for(const key of ['notes','resolution','rights_class'])if(source[key]!==undefined&&typeof source[key]!=='string')throw new Error(`${source.id}: invalid ${key}`);
  }
  if(url==='/model/evidence/evidence_items.json')for(const item of doc.items){
    if(!['E0','E1','E2','E3','E4','E5'].includes(item.maturity))throw new Error(`${item.id}: unknown maturity`);
    if(item.notes!==undefined&&typeof item.notes!=='string')throw new Error(`${item.id}: invalid notes`);
  }
  if(url==='/model/research/material_properties.json')for(const item of doc.properties)for(const key of ['mean','min','max'])if(item[key]!==undefined&&(typeof item[key]!=='number'||!Number.isFinite(item[key])))throw new Error(`${item.id}: invalid ${key}`);
  if(url==='/model/field/geospatial_frame.json'&&typeof doc.local_frame.rotation_to_monument!=='string')validateRuntimeShape(doc.local_frame.rotation_to_monument,{status:S,receipt_id:S,yaw_arcmin:N,application:S},'rotation_to_monument');
  if(url==='/model/research/findings_registry.json')for(const row of doc.entries){
    if(typeof (row.introduced_version??row.first_seen_version)!=='string'||typeof (row.updated_version??row.last_updated_version)!=='string')throw new Error(`${row.id}: missing finding version lineage`);
    if(row.related_runs!==undefined)validateRuntimeShape(row.related_runs,strings,`${row.id}.related_runs`);
  }
}

export function createRuntimeLoader(diagnostics:RuntimeDiagnostic[],fetcher:typeof fetch=fetch){
  return async function getJson<T>(url:string):Promise<T>{
    try{
      const response=await fetcher(url,{signal:AbortSignal.timeout(15000)});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const value:unknown=await response.json();validateRuntimeDocument(url,value);return value as T;
    }catch(error){
      const reason=error instanceof Error?error.message:String(error);
      if(requiredDatasets.has(url))throw new Error(`Required dataset ${url} unavailable: ${reason}`);
      if(!runtimeContracts[url])throw error;
      diagnostics.push({url,status:'UNAVAILABLE',reason,scope:runtimeScope(url)});
      return inertRuntimeShape(runtimeContracts[url]) as T;
    }
  };
}
