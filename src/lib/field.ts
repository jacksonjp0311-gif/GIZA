export interface GeoReferenceAnchor {
  id: string;
  latitude_deg: number;
  longitude_deg: number;
  ellipsoid_height_m: number | null;
  vertical_datum: string;
  source_id: string;
  source_locator: string;
  status: string;
  horizontal_authority: string;
  vertical_authority: string;
}

export interface GeospatialFrame {
  version: string;
  field_phase: string;
  reference_anchor: GeoReferenceAnchor;
  local_frame: {
    id: string;
    units: string;
    handedness: string;
    axes: Record<string, string>;
    origin_local_m: [number, number, number];
    origin_geodetic: string;
    rotation_to_monument: string;
    status: string;
  };
  transform: {
    method: string;
    formula: string;
    max_intended_radius_m: number;
    z_rule: string;
    precision_rule: string;
  };
  required_upgrade: string[];
}

export interface TerrainFieldLayer {
  id: string;
  source_id: string;
  native_resolution_m: number | number[];
  status: string;
  model_role: string;
  allowed_precision_claim: string;
  not_allowed: string[];
  field_status: string;
  local_asset: string | null;
  transform_receipt: string | null;
  display_allowed: boolean;
  truth_rule: string;
}

export interface TerrainRegistry {
  version: string;
  active_layer: string | null;
  render_status: string;
  fallback: string;
  layers: TerrainFieldLayer[];
  ingest_gate: {
    required: string[];
    qa_status_required: string;
    allowed_model_role: string;
  };
}

export interface PhotoGraphNode {
  id: string;
  title: string;
  kind: string;
  view_class: string;
  targets: string[];
  camera_pose: unknown | null;
  intrinsics: unknown | null;
  calibration_status: string;
  photogrammetry_role: string;
  source_page: string;
  license: string;
}

export interface PhotoGraphEdge {
  a: string;
  b: string;
  relation: string;
  target: string;
  overlap_status: string;
  photogrammetry_use: string;
}

export interface PhotoGraph {
  version: string;
  node_count: number;
  edge_count: number;
  rule: string;
  nodes: PhotoGraphNode[];
  edges: PhotoGraphEdge[];
  upgrade_gate: Record<string, string | boolean>;
}

export interface UncertaintyParameter {
  quantity: string;
  value: number;
  uncertainty: number;
  unit: string;
  source_id: string;
}

export interface UncertaintyRecord {
  target: string;
  maturity: string;
  status: string;
  parameters: UncertaintyParameter[];
  render_envelope: {
    kind: 'AXIS_PAD';
    pad_m: [number, number, number];
    meaning: string;
  };
}

export interface UncertaintyCatalog {
  version: string;
  policy: string;
  records: UncertaintyRecord[];
  fallback: { status: string; render: boolean };
}

export interface PromotionState {
  target_id: string;
  current: string;
  target: string;
  status: string;
  blockers: string[];
}

export interface FieldPromotionCatalog {
  version: string;
  rule: string;
  states: PromotionState[];
  queue: Array<Record<string, unknown>>;
}

export interface FieldAcquisitionTarget {
  priority: number;
  id: string;
  target: string;
  goal: string;
  requirements: string[];
  status: string;
}

export interface FieldAcquisitionCatalog {
  version: string;
  targets: FieldAcquisitionTarget[];
  software_rule: string;
}

export interface FieldManifest {
  version: string;
  codename: string;
  geospatial_anchor: string;
  terrain_active: boolean;
  photo_nodes: number;
  photo_edges: number;
  numeric_uncertainty_targets: number;
  promotion_targets: number;
  acquisition_targets: number;
  truth_guards: string[];
}

const WGS84_A = 6378137.0;
const WGS84_E2 = 6.69437999014e-3;

/**
 * Context-grade WGS84 -> local EN conversion around the FIELD anchor.
 * This deliberately leaves Z unresolved until the project has a vertical datum.
 */
export function geodeticToLocalEN(
  latitudeDeg: number,
  longitudeDeg: number,
  frame: GeospatialFrame,
): [number, number] {
  const lat0 = frame.reference_anchor.latitude_deg * Math.PI / 180;
  const dLat = (latitudeDeg - frame.reference_anchor.latitude_deg) * Math.PI / 180;
  const dLon = (longitudeDeg - frame.reference_anchor.longitude_deg) * Math.PI / 180;
  const sinLat = Math.sin(lat0);
  const denom = Math.sqrt(1 - WGS84_E2 * sinLat * sinLat);
  const rn = WGS84_A / denom;
  const rm = WGS84_A * (1 - WGS84_E2) / Math.pow(1 - WGS84_E2 * sinLat * sinLat, 1.5);
  const east = dLon * rn * Math.cos(lat0);
  const north = dLat * rm;
  return [east, north];
}

export function uncertaintyForTarget(catalog: UncertaintyCatalog, targetId: string | null) {
  if (!targetId) return null;
  return catalog.records.find(record => record.target === targetId) ?? null;
}

export function promotionForTarget(catalog: FieldPromotionCatalog, targetId: string | null) {
  if (!targetId) return null;
  return catalog.states.find(state => state.target_id === targetId) ?? null;
}

export function photoGraphForTarget(graph: PhotoGraph, targetId: string | null) {
  if (!targetId) return { nodes: [] as PhotoGraphNode[], edges: [] as PhotoGraphEdge[] };
  const nodes = graph.nodes.filter(node => node.targets.includes(targetId));
  const ids = new Set(nodes.map(node => node.id));
  const edges = graph.edges.filter(edge => ids.has(edge.a) || ids.has(edge.b) || edge.target === targetId);
  return { nodes, edges };
}
