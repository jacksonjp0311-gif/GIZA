import type { ActionGraphMapData, RoomGraphMapData, VisibilityLabMapData, MetricReadinessMapData, MapAtlasBundle, MapAtlasManifest, PlateauMapData, RitualMapData, SurveyMapData, GeologyMapData, HistoryMapData, IntentMapData, PhotoCoverageMapData, RitualNarrative } from '../maps/types';
import { createRuntimeLoader, type RuntimeDiagnostic } from './runtimeData';
import type { SimlabBundle, SimlabManifest, GravityResult, GravityBenchmark, AcousticResult, AcousticBenchmark, StrataResult, StrataBenchmark } from '../simlab/types';
import type {
  FieldAcquisitionCatalog,
  FieldManifest,
  FieldPromotionCatalog,
  GeospatialFrame,
  PhotoGraph,
  TerrainRegistry,
  UncertaintyCatalog,
} from './field';

export type ProvenanceClass =
  | 'SOURCE' | 'DERIVED' | 'GENERATED' | 'SIMULATED' | 'VALIDATED'
  | 'MEASURED' | 'ASSUMED' | 'UNVERIFIED' | 'USER_LOCKED';

export interface Provenance {
  class: ProvenanceClass;
  created_by: string;
  reason?: string;
  evidence_ids?: string[];
  revision_id?: string;
}

export interface PrimitiveBox { kind: 'box'; sx: number; sy: number; sz: number }
export interface PrimitiveCylinder { kind: 'cylinder'; radius: number; height: number }
export type Primitive = PrimitiveBox | PrimitiveCylinder;

export interface CadRef {
  format: string;
  path: string;
  preview?: string | null;
  truth?: string;
  geometry_class?: string;
  note?: string;
}

export interface Part {
  id: string;
  name: string;
  parent?: string | null;
  system?: string | null;
  material?: string | null;
  semantic_role?: string;
  detail_tier?: string;
  spatial: {
    origin_m: [number, number, number];
    rpy_rad: [number, number, number];
    primitive: Primitive;
    assembly_stage: number;
    explosion_vector: [number, number, number];
    explosion_distance_m: number;
    radial_group?: string | null;
    service_path?: [number, number, number][];
    cad?: CadRef | null;
  };
  provenance: Provenance;
}

export interface Assembly {
  id: string;
  name: string;
  parent?: string | null;
  system?: string | null;
  children: string[];
  semantic_role?: string;
  provenance: Provenance;
}

export interface Measurement {
  id: string;
  component: string;
  quantity: string;
  native_value: number | string | null;
  native_unit: string | null;
  si_value: number | string | null;
  si_unit: string | null;
  uncertainty_si?: number | null;
  source_id: string;
  source_locator?: string;
  status: string;
  model_use?: string;
  notes?: string;
}

export interface PhotoRecord {
  id: string;
  title: string;
  kind: 'photograph' | 'diagram';
  image_url: string;
  page_url: string;
  author: string;
  date: string;
  license: string;
  credit: string;
  caption: string;
  bind: string[];
  license_url?: string;
}

export interface ComponentResearch {
  version: number;
  reviewed: string;
  photos: PhotoRecord[];
  sources: { id: string; title: string; url: string; kind: string; geometry_authority: string; note: string }[];
  observations: { id: string; value: string | number; unit?: string; si_value?: number; source: string; locator: string; status: string; note?: string; bind?: string[] }[];
  limitations: string[];
}

export interface AtlasObject {
  title: string;
  simple: string;
  why_known: string;
  measurement_components: string[];
  questions: string[];
}
export interface AtlasSource { id: string; title: string; url: string; role: string }

export interface StoneField {
  version: string;
  id: string;
  name: string;
  provenance: string;
  base_m: number;
  height_m: number;
  visual_course_count: number;
  target_block_width_m: number;
  radial_depth_m: number;
  joint_gap_fraction: number;
  seed: number;
  truth_warning: string;
  explode_modes: string[];
}

export interface EvidenceItem {
  id: string;
  targets: string[];
  kind: string;
  source_ids: string[];
  maturity: 'E0'|'E1'|'E2'|'E3'|'E4'|'E5';
  status: string;
  provenance_class: string;
  claims: string[];
  notes?: string;
}
export interface SourceAuthority { geometry: number; materials: number; visual: number; method: number }
export interface SourceRegistryEntry {
  id: string;
  title: string;
  author: string;
  year: number|null;
  kind: string;
  url: string;
  doi?: string;
  access: string;
  rights?: string;
  rights_class?: string;
  asset_action: string;
  authority?: SourceAuthority;
  roles?: string[];
  resolution?: string;
  targets?: string[];
  geometry_role?: string[];
  resolution_role?: string;
  notes?: string;
}
export interface EvidenceMaturityLevel {
  id:'E0'|'E1'|'E2'|'E3'|'E4'|'E5';
  name:string;
  meaning:string;
  allowed_mutation:boolean|string;
}
export interface SolverRegistryEntry { id:string; name:string; purpose:string; contract:string }
export interface ObjectSourceBinding { source_id:string; role:string; write_authority:string }
export interface ObjectSourceMap {
  version:string;
  canon_phase:string;
  rule:string;
  part_count:number;
  parts:Record<string,ObjectSourceBinding[]>;
  future_scope:Record<string,string[]>;
}
export interface ConflictObservation { source_id?:string; [key:string]:unknown }
export interface SourceConflict {
  id:string;
  quantity:string;
  scope:string;
  status:string;
  observations:ConflictObservation[];
  canonical_rule:string;
  severity:string;
}
export interface RightsRow {
  source_id:string;
  rights_class:string;
  access:string;
  asset_action:string;
  may_store_numeric_facts:boolean;
  may_store_citation_metadata:boolean;
  may_bundle_original_media:boolean;
  requires_per_asset_check:boolean;
  geometry_write_authority:number;
  notes?:string;
}
export interface AcquisitionItem {
  priority:number;
  id:string;
  source_id:string;
  goal:string;
  desktop_action:string;
  expected_gain:string;
  size_risk:string;
}
export interface MaterialProperty {
  id:string;
  quantity:string;
  min?:number;
  max?:number;
  mean?:number;
  unit:string;
  sample_context?:string;
}
export interface MaterialProperties {
  version:string;
  source_id:string;
  material_scope:string;
  status:string;
  solver_use:{
    allowed_as_prior:boolean;
    requires_uncertainty_sampling:boolean;
    cannot_override_measured_block_specific_data:boolean;
  };
  properties:MaterialProperty[];
  petrography:Record<string,string>;
  model_warning:string;
}
export interface FutureMeasurement {
  id:string;
  target:string;
  quantity:string;
  value?:number;
  min?:number;
  max?:number;
  unit?:string;
  native_value?:number|string;
  native_unit?:string;
  si_value?:number|string|null;
  source_id:string;
  source_locator?:string;
  status:string;
  geometry_use:string;
  warning?:string;
}


export interface FindingEntry {
  id: string;
  title: string;
  status: string;
  priority: string;
  domain: string;
  introduced_version?: string;
  updated_version?: string;
  first_seen_version?: string;
  last_updated_version?: string;
  truth_class: string;
  summary: string;
  why_interesting: string;
  controls: string[];
  related_runs: string[];
  next_test: string;
  guard: string;
}
export interface FindingsRegistry {
  version: string;
  registry_id: string;
  purpose: string;
  status_vocabulary: Record<string,string>;
  invariants: string[];
  entries: FindingEntry[];
  last_reviewed_version: string;
  generated_at: string;
}


export interface IntentHypothesis {
  id: string;
  label: string;
  question: string;
  prior_status: string;
  critical_expected_evidence: string[];
  falsifier: string;
}
export interface IntentSynthesisRow {
  hypothesis_id: string;
  label: string;
  prior_status: string;
  support_weight: number;
  limitation_weight: number;
  missing_expected_weight: number;
  evidence_balance_index: number;
  coverage_index: number;
  interpretation_guard: string;
}
export interface IntentBundle {
  hypotheses: IntentHypothesis[];
  synthesis: IntentSynthesisRow[];
}

export interface ModelBundle {
  /** Missing optional data is quarantined, not silently interpreted as verified emptiness. */
  runtimeDiagnostics: RuntimeDiagnostic[];
  componentResearch: ComponentResearch;
  project: Record<string,unknown>;
  parts: Part[];
  assemblies: Assembly[];
  measurements: Measurement[];
  hypotheses: Record<string,unknown>[];
  calculations: Record<string,unknown>;
  photos: PhotoRecord[];
  atlasObjects: Record<string,AtlasObject>;
  sources: AtlasSource[];
  stoneField: StoneField;
  evidenceItems: EvidenceItem[];
  sourceRegistry: SourceRegistryEntry[];
  maturityLevels: EvidenceMaturityLevel[];
  solverRegistry: SolverRegistryEntry[];
  objectSourceMap: ObjectSourceMap;
  conflicts: SourceConflict[];
  rightsRows: RightsRow[];
  acquisitionBacklog: AcquisitionItem[];
  materialProperties: MaterialProperties;
  futureMeasurements: FutureMeasurement[];
  findings: FindingsRegistry;
  intent: IntentBundle;
  maps: MapAtlasBundle;
  simlab: SimlabBundle;
  field: {
    manifest: FieldManifest;
    geospatialFrame: GeospatialFrame;
    terrainRegistry: TerrainRegistry;
    photoGraph: PhotoGraph;
    uncertaintyCatalog: UncertaintyCatalog;
    promotionCatalog: FieldPromotionCatalog;
    acquisitionCatalog: FieldAcquisitionCatalog;
  };
}

export async function loadModel():Promise<ModelBundle> {
  const runtimeDiagnostics:RuntimeDiagnostic[]=[];
  const getJson=createRuntimeLoader(runtimeDiagnostics);
  const [
    project, partsDoc, assembliesDoc, measurementsDoc, hypothesesDoc, calculations,
    photoDoc, atlasDoc, stoneField, evidenceDoc, sourceRegistryDoc, maturityDoc,
    solverDoc, objectSourceMap, conflictsDoc, rightsDoc, acqDoc, materialProperties,
    futureDoc, fieldManifest, geospatialFrame, terrainRegistry, photoGraph,
    uncertaintyCatalog, promotionCatalog, fieldAcquisition, findingsRegistry, intentHypotheses, intentSynthesis,
    mapManifest, plateauMap, ritualMap, actionMap, roomMap, visibilityMap, metricMap, surveyMap, geologyMap, historyMap, intentMap, photoCoverageMap, ritualNarrative,
    simlabManifest, gravityResult, gravityBenchmark, acousticResult, acousticBenchmark, strataResult, strataBenchmark, componentResearch,
  ] = await Promise.all([
    getJson<Record<string,unknown>>('/model/project.json'),
    getJson<{parts:Part[]}>('/model/parts.json'),
    getJson<{assemblies:Assembly[]}>('/model/assemblies.json'),
    getJson<{measurements:Measurement[]}>('/model/research/measurements.json'),
    getJson<{hypotheses?:Record<string,unknown>[]}>('/model/research/hypotheses.json'),
    getJson<Record<string,unknown>>('/model/research/calculations.json'),
    getJson<{photos:PhotoRecord[]}>('/model/photo_index.json'),
    getJson<{objects:Record<string,AtlasObject>;sources:AtlasSource[]}>('/model/atlas_objects.json'),
    getJson<StoneField>('/model/stone_field.json'),
    getJson<{items:EvidenceItem[]}>('/model/evidence/evidence_items.json'),
    getJson<{sources:SourceRegistryEntry[]}>('/model/evidence/source_registry.json'),
    getJson<{levels:EvidenceMaturityLevel[]}>('/model/evidence/evidence_maturity.json'),
    getJson<{solvers:SolverRegistryEntry[]}>('/model/solvers/solver_registry.json'),
    getJson<ObjectSourceMap>('/model/evidence/object_source_map.json'),
    getJson<{conflicts:SourceConflict[]}>('/model/evidence/conflict_matrix.json'),
    getJson<{rows:RightsRow[]}>('/model/evidence/rights_matrix.json'),
    getJson<{backlog:AcquisitionItem[]}>('/model/evidence/acquisition_backlog.json'),
    getJson<MaterialProperties>('/model/research/material_properties.json'),
    getJson<{measurements:FutureMeasurement[]}>('/model/research/complex_measurements.json'),
    getJson<FieldManifest>('/model/field/field_manifest.json'),
    getJson<GeospatialFrame>('/model/field/geospatial_frame.json'),
    getJson<TerrainRegistry>('/model/field/terrain_registry.json'),
    getJson<PhotoGraph>('/model/field/photo_graph.json'),
    getJson<UncertaintyCatalog>('/model/field/uncertainty_envelopes.json'),
    getJson<FieldPromotionCatalog>('/model/field/promotion_state.json'),
    getJson<FieldAcquisitionCatalog>('/model/field/acquisition_targets.json'),
    getJson<FindingsRegistry>('/model/research/findings_registry.json'),
    getJson<{hypotheses:IntentHypothesis[]}>('/model/intent/hypotheses.json'),
    getJson<{results:IntentSynthesisRow[]}>('/model/intent/synthesis.json'),
    getJson<MapAtlasManifest>('/model/maps/manifest.json'),
    getJson<PlateauMapData>('/model/maps/layers/plateau_master.json'),
    getJson<RitualMapData>('/model/maps/layers/ritual_route.json'),
    getJson<ActionGraphMapData>('/model/maps/layers/action_graph.json'),
    getJson<RoomGraphMapData>('/model/maps/layers/room_graph.json'),
    getJson<VisibilityLabMapData>('/model/maps/layers/visibility_lab.json'),
    getJson<MetricReadinessMapData>('/model/maps/layers/metric_readiness.json'),
    getJson<SurveyMapData>('/model/maps/layers/survey_control.json'),
    getJson<GeologyMapData>('/model/maps/layers/geology_quarry.json'),
    getJson<HistoryMapData>('/model/maps/layers/historical_sources.json'),
    getJson<IntentMapData>('/model/maps/layers/intent_map.json'),
    getJson<PhotoCoverageMapData>('/model/maps/layers/photo_coverage.json'),
    getJson<RitualNarrative>('/model/maps/narratives/ritual_sequence.json'),
    getJson<SimlabManifest>('/model/simlab/simlab_manifest.json'),
    getJson<GravityResult>('/model/simlab/results/gravity.deep-claim-conditional.json'),
    getJson<GravityBenchmark>('/model/simlab/benchmarks/gravity_benchmark.json'),
    getJson<AcousticResult>('/model/simlab/results/acoustic.known-interiors-screening.json'),
    getJson<AcousticBenchmark>('/model/simlab/benchmarks/acoustic_benchmark.json'),
    getJson<StrataResult>('/model/simlab/results/strata.deep-claim-screening.json'),
    getJson<StrataBenchmark>('/model/simlab/benchmarks/strata_benchmark.json'),
    getJson<ComponentResearch>('/model/component_research.json'),
  ]);

  return {
    runtimeDiagnostics:runtimeDiagnostics.sort((a,b)=>a.url.localeCompare(b.url)),
    componentResearch,
    project,
    parts: partsDoc.parts,
    assemblies: assembliesDoc.assemblies,
    measurements: measurementsDoc.measurements ?? [],
    hypotheses: hypothesesDoc.hypotheses ?? [],
    calculations,
    photos: [...(photoDoc.photos ?? []), ...componentResearch.photos],
    atlasObjects: atlasDoc.objects ?? {},
    sources: atlasDoc.sources ?? [],
    stoneField,
    evidenceItems: evidenceDoc.items ?? [],
    sourceRegistry: sourceRegistryDoc.sources ?? [],
    maturityLevels: maturityDoc.levels ?? [],
    solverRegistry: solverDoc.solvers ?? [],
    objectSourceMap,
    conflicts: conflictsDoc.conflicts ?? [],
    rightsRows: rightsDoc.rows ?? [],
    acquisitionBacklog: acqDoc.backlog ?? [],
    materialProperties,
    futureMeasurements: futureDoc.measurements ?? [],
    findings: findingsRegistry,
    intent: { hypotheses: intentHypotheses.hypotheses ?? [], synthesis: intentSynthesis.results ?? [] },
    maps: { manifest: mapManifest, plateau: plateauMap, ritual: ritualMap, action: actionMap, rooms: roomMap, visibility: visibilityMap, metric: metricMap, survey: surveyMap, geology: geologyMap, history: historyMap, intent: intentMap, photos: photoCoverageMap, ritualNarrative },
    simlab: { manifest: simlabManifest, gravity: gravityResult, gravityBenchmark, acoustic: acousticResult, acousticBenchmark, strata: strataResult, strataBenchmark },
    field: {
      manifest: fieldManifest,
      geospatialFrame,
      terrainRegistry,
      photoGraph,
      uncertaintyCatalog,
      promotionCatalog,
      acquisitionCatalog: fieldAcquisition,
    },
  };
}
