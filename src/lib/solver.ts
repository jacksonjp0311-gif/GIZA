export type SolverRunStatus = 'DRAFT' | 'RUNNING' | 'COMPLETE' | 'FAILED' | 'REJECTED';

export interface SolverRegistryEntry {
  id: string;
  name: string;
  purpose: string;
  contract: string;
}

export interface SolverRegistry {
  version: string;
  invariant: string;
  required_run_fields: string[];
  solvers: SolverRegistryEntry[];
}

export interface SolverRunReceipt {
  run_id: string;
  solver_id: string;
  solver_version: string;
  geometry_revision: string;
  geometry_hash: string;
  input_hash: string;
  parameters: Record<string, unknown>;
  controls: Record<string, unknown>;
  outputs: Record<string, unknown>;
  uncertainty: Record<string, unknown>;
  status: SolverRunStatus;
  created_at: string;
  provenance_class: 'SIMULATED';
}

export function assertSimulationReceipt(run: SolverRunReceipt): string[] {
  const errors: string[] = [];
  if (run.provenance_class !== 'SIMULATED') errors.push('Solver output provenance must be SIMULATED.');
  if (!run.geometry_hash) errors.push('geometry_hash is required.');
  if (!run.input_hash) errors.push('input_hash is required.');
  if (!run.solver_id) errors.push('solver_id is required.');
  if (!run.run_id) errors.push('run_id is required.');
  return errors;
}
