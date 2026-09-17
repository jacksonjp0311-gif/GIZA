export interface SimlabManifest {
  version: string;
  codename: string;
  status: string;
  active_solvers: string[];
  planned_solvers: string[];
  first_experiment: string;
  second_experiment?: string;
  visualization: Record<string, unknown>;
  truth_invariant: string;
}

export interface GravityPoint {
  coordinates_m: [number, number, number];
  upward_delta_g_microgal: number;
  conventional_downward_delta_g_microgal: number;
  magnitude_microgal: number;
}

export interface GravitySummary {
  min_microgal: number;
  max_microgal: number;
  max_magnitude_microgal: number;
  peak: GravityPoint | null;
}

export interface GravityResult {
  run_id: string;
  experiment_id: string;
  solver_id: string;
  solver_version: string;
  provenance_class: 'SIMULATED';
  truth_status: string;
  geometry_revision: string;
  geometry_hash: string;
  input_hash: string;
  parameters: Record<string, unknown>;
  controls: Record<string, unknown>;
  uncertainty: Record<string, unknown>;
  components: { id: string; primitive: Record<string, unknown>; volume_m3: number }[];
  total_modeled_void_volume_m3: number;
  element_count: number;
  observation_count: number;
  summary: GravitySummary;
  points: GravityPoint[];
  component_control_summary?: {
    no_void_peak_microgal: number;
    shafts_only_peak_microgal: number;
    terminals_only_peak_microgal: number;
    combined_peak_microgal: number;
    note: string;
  };
  status: string;
  created_at: string;
  interpretation_guard: string;
}

export interface GravityBenchmark {
  benchmark_id: string;
  provenance_class: 'SIMULATED';
  tests: { id: string; pass: boolean; [key: string]: unknown }[];
  pass: boolean;
}

export interface AcousticMode {
  frequency_hz: number;
  mode: number[];
  boundary?: string;
}

export interface AcousticComponent {
  id: string;
  part_id: string;
  model: string;
  weight: number;
  truth_note: string;
  dims_m?: [number, number, number];
  length_m?: number;
  modes: AcousticMode[];
}

export interface AcousticPressurePoint {
  coordinates_m: [number, number, number];
  normalized_pressure: number;
}

export interface AcousticPeak {
  frequency_hz: number;
  screening_amplitude: number;
  dominant_components: { component_id: string; amplitude: number }[];
}

export interface AcousticResult {
  run_id: string;
  experiment_id: string;
  solver_id: string;
  solver_version: string;
  provenance_class: 'SIMULATED';
  truth_status: string;
  geometry_revision: string;
  geometry_hash: string;
  input_hash: string;
  atmosphere: {
    temperature_c: number;
    relative_humidity_percent: number | null;
    pressure_pa: number | null;
    sound_speed_m_s: number;
    model: string;
  };
  boundary_model: { kind: string; passages: string; cavities: string; warning: string };
  loss_model: { kind: string; q_screening: number; warning: string };
  frequency: { min_hz: number; max_hz: number; step_hz: number; max_mode_order: number };
  components: AcousticComponent[];
  response: {
    kind: string;
    q: number;
    points: { frequency_hz: number; screening_amplitude: number; dominant_components: { component_id: string; amplitude: number }[] }[];
    peaks: AcousticPeak[];
  };
  selected_visualization: {
    component_id: string;
    part_id: string;
    mode: number[];
    frequency_hz: number;
    meaning: string;
    points: AcousticPressurePoint[];
  };
  coincidence_screen: {
    tolerance_hz: number;
    min_components: number;
    first_modes: number;
    actual_cluster_count: number;
    clusters: { frequency_hz: number; component_count: number; components: string[] }[];
    independent_null: { n: number; mean: number; stddev: number; min: number; max: number; actual_percentile_le: number };
    constraint_preserving_null: { n: number; mean: number; stddev: number; min: number; max: number; actual_percentile_le: number };
    interpretation: string;
  };
  controls: Record<string, unknown>;
  uncertainty: Record<string, unknown>;
  human_summary: {
    headline: string;
    burial_fundamental_hz: number;
    lower_fundamental_hz: number | null;
    first_pass_interpretation: string;
    design_claim_status: string;
  };
  status: string;
  created_at: string;
  interpretation_guard: string;
}

export interface AcousticBenchmark {
  benchmark_id: string;
  solver_id: string;
  provenance_class: 'SIMULATED';
  sound_speed_m_s: number;
  tests: { id: string; pass: boolean; [key: string]: unknown }[];
  pass: boolean;
  created_at: string;
}

export interface StrataFieldPoint {
  component_id: string;
  coordinates_m: [number, number, number];
  depth_m: number;
  stress_mpa: number;
  hydraulic_pressure_mpa: number;
}

export interface StrataResult {
  run_id: string;
  experiment_id: string;
  solver_id: string;
  solver_version: string;
  provenance_class: 'SIMULATED';
  truth_status: string;
  geometry_revision: string;
  geometry_hash: string;
  input_hash: string;
  parameters: Record<string, number>;
  material_prior: { source_id: string; scope: string; ucs_mpa: { min: number; max: number }; warning: string };
  geomechanics: {
    kind: string;
    shaft_bottom: any;
    terminal_center: any;
    known_lower_chamber_reference: any;
    density_sensitivity: any[];
    warning: string;
  };
  hydraulics: {
    kind: string;
    shaft_bottom: any;
    terminal_center: any;
    dry_null_pressure_mpa: number;
    warning: string;
  };
  field_points: StrataFieldPoint[];
  controls: Record<string, unknown>;
  uncertainty: Record<string, unknown>;
  human_summary: Record<string, string | number>;
  status: string;
  created_at: string;
  interpretation_guard: string;
}

export interface StrataBenchmark {
  benchmark_id: string;
  solver_id: string;
  provenance_class: 'SIMULATED';
  tests: { id: string; pass: boolean; [key: string]: unknown }[];
  pass: boolean;
  created_at: string;
}

export type ActiveSimulation = 'GRAVITY' | 'ACOUSTICS' | 'STRATA';

export interface SimlabBundle {
  manifest: SimlabManifest;
  gravity: GravityResult;
  gravityBenchmark: GravityBenchmark;
  acoustic: AcousticResult;
  acousticBenchmark: AcousticBenchmark;
  strata: StrataResult;
  strataBenchmark: StrataBenchmark;
}
