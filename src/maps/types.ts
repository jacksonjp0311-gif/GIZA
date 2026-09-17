export type AtlasMapId = 'plateau' | 'ritual' | 'action' | 'rooms' | 'visibility' | 'metric' | 'survey' | 'geology' | 'history' | 'intent' | 'photos';
export type AtlasLayerKey = 'monuments' | 'ritual' | 'action' | 'rooms' | 'visibility' | 'metric' | 'survey' | 'sources' | 'uncertainty' | 'intent' | 'geology' | 'photos';

export interface AtlasMapDescriptor {
  id: AtlasMapId;
  label: string;
  subtitle: string;
  truth_class: string;
  geometry_authority: string;
  file: string;
}

export interface MapAtlasManifest {
  schema_version: string;
  version: string;
  phase: string;
  atlas_id: string;
  title: string;
  purpose: string;
  truth_rules: string[];
  maps: AtlasMapDescriptor[];
  default_layers: AtlasLayerKey[];
  source_ids: string[];
  ui_contract: Record<string, unknown>;
}

export interface PlateauFeature {
  id: string; label: string; kind: string; x: number; y: number; size: number; status: string;
  source_ids: string[]; part_id?: string;
}
export interface PlateauMapData {
  id: 'plateau'; version: string; title: string; coordinate_mode: string; metric: boolean; guard: string;
  source_ids: string[]; extent: Record<string, unknown>; features: PlateauFeature[];
  connections: {from:string;to:string;kind:string;label:string;status:string}[]; layers: AtlasLayerKey[];
}

export interface RitualStage {
  order: number; id: string; label: string; role: string; evidence: string; x: number; y: number;
  source_ids: string[]; part_id?: string;
}
export interface RitualMapData {
  id:'ritual'; version:string; title:string; coordinate_mode:string; metric:boolean; guard:string;
  source_ids:string[]; stages:RitualStage[]; sequence_edges:[number,number][]; questions:string[]; layers:AtlasLayerKey[];
}


export interface ActionGraphMapNode { id:string; kind:'PLACE'|'ACTION'; label:string; x:number; y:number; epistemic_status:string; evidence_strength_index:number; evidence_record_ids:string[]; }
export interface ActionGraphMapData {
  id:'action'; version:string; title:string; coordinate_mode:string; metric:boolean; guard:string; source_ids:string[];
  nodes:ActionGraphMapNode[]; edges:{from:string;to:string;relation:string;status:string}[]; layers:AtlasLayerKey[];
}


export interface RoomGraphMapSpace { id:string; complex:string; label:string; kind:string; x:number; y:number; status:string; access:string; visibility:string; evidence:string[]; }
export interface RoomGraphMapData {
  id:'rooms'; version:string; title:string; coordinate_mode:string; metric:boolean; guard:string; source_ids:string[];
  spaces:RoomGraphMapSpace[]; thresholds:{id:string;from:string;to:string;kind:string;status:string;evidence:string[]}[]; layers:AtlasLayerKey[];
}


export interface VisibilityLabMapSpace { id:string; label:string; complex:string; x:number; y:number; kind:string; topological_depth:number|null; is_branch:boolean; is_merge:boolean; is_articulation:boolean; visibility_state:string; environment:string; certainty:string; }
export interface VisibilityLabMapData {
  id:'visibility'; version:string; title:string; coordinate_mode:string; metric:boolean; guard:string; source_ids:string[];
  spaces:VisibilityLabMapSpace[]; thresholds:{id:string;from:string;to:string;kind:string;status:string;evidence:string[]}[];
  transitions:{threshold_id:string;from:string;to:string;from_environment:string;to_environment:string;contrast_index:number;contrast_class:string;status:string;guard:string}[]; layers:AtlasLayerKey[];
}


export interface MetricReadinessTarget { id:string; target:string; state:string; progress:number; blocking:string[]; candidate_id:string; }
export interface MetricReadinessMapData {
  id:'metric'; version:string; title:string; coordinate_mode:string; metric:boolean; guard:string; source_ids:string[];
  targets:MetricReadinessTarget[]; metric_ray_count:number; registered_plan_count:number; layers:AtlasLayerKey[];
}

export interface SurveyMapData {
  id:'survey'; version:string; title:string; coordinate_mode:string; metric:boolean; frame_id:string;
  vertical_status:string; translation_to_khafre_local:string; guard:string; source_ids:string[];
  points:{id:string;label:string;e:number;n:number;kind:string}[];
  orientation_prior:{yaw_arcmin:number;yaw_deg:number;rms_side_residual_arcmin:number;max_abs_residual_arcmin:number;measured_point_count:number;status:string};
  layers:AtlasLayerKey[];
}

export interface GeologyMapData {
  id:'geology'; version:string; title:string; coordinate_mode:string; metric:boolean; guard:string; source_ids:string[];
  bands:{id:string;label:string;y:number;thickness:number;truth:string}[];
  sequence:{before:string;after:string;claim:string;status:string}[]; layers:AtlasLayerKey[];
}

export interface HistoryMapData {
  id:'history'; version:string; title:string; coordinate_mode:string; metric:boolean; guard:string; source_ids:string[];
  events:{year:number;label:string;kind:string;status:string}[]; layers:AtlasLayerKey[];
}

export interface IntentMapData {
  id:'intent'; version:string; title:string; coordinate_mode:string; metric:boolean; guard:string; layers:AtlasLayerKey[];
  center:{label:string;x:number;y:number}; hypothesis_ids:string[];
}

export interface PhotoCoverageMapData {
  id:'photos'; version:string; title:string; coordinate_mode:string; metric:boolean; guard:string; source_ids:string[];
  coverage:{target:string;reviewed_assets:number;registration_state:string}[]; layers:AtlasLayerKey[];
}

export interface RitualNarrative {
  version:string; title:string; chapters:{id:string;title:string;plain:string;source_ids:string[]}[];
}

export interface MapAtlasBundle {
  manifest: MapAtlasManifest;
  plateau: PlateauMapData;
  ritual: RitualMapData;
  action: ActionGraphMapData;
  rooms: RoomGraphMapData;
  visibility: VisibilityLabMapData;
  metric: MetricReadinessMapData;
  survey: SurveyMapData;
  geology: GeologyMapData;
  history: HistoryMapData;
  intent: IntentMapData;
  photos: PhotoCoverageMapData;
  ritualNarrative: RitualNarrative;
}
