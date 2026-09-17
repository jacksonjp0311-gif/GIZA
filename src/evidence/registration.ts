/** Read-only adapter for output from scripts/plate_registration/engine.mjs.
 * This is NOT a fit/validation engine. Imported output never grants metric authority.
 * The shared server/CLI engine must rehash custody and re-evaluate frozen controls.
 */
export interface ResidualVector {
  id: string; role: 'CONTROL' | 'HOLDOUT'; target: [number, number]; predicted: [number, number]; dx: number; dy: number; error: number;
}
export interface RegistrationComparison {
  status: 'UNAVAILABLE' | 'IMPORTED_UNVERIFIED'; campaignId: string | null; targetFrame: string | null;
  sourceSha256: string | null; renderSha256: string | null; freezeSha256: string | null;
  resultSha256: string | null; vectors: ResidualVector[]; metricAuthority: 'NONE';
  independentScale: 'UNKNOWN' | 'CLAIMED_IN_IMPORTED_RESULT'; engineReportedPass: boolean | null;
  note: string;
}
export const unavailableRegistration = (note = 'No accepted assembly registration, controls or holdouts. Residuals are UNKNOWN, not zero.'): RegistrationComparison => ({ status: 'UNAVAILABLE', campaignId: null, targetFrame: null, sourceSha256: null, renderSha256: null, freezeSha256: null, resultSha256: null, vectors: [], metricAuthority: 'NONE', independentScale: 'UNKNOWN', engineReportedPass: null, note });
const hash = (v: unknown): string => { if (typeof v !== 'string' || !/^[a-f0-9]{64}$/i.test(v)) throw new Error('Registration custody hash is missing or malformed'); return v.toLowerCase(); };
const object = (v: unknown): Record<string, unknown> => { if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('Invalid registration record'); return v as Record<string, unknown>; };
const finite = (v: unknown): number => { if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error('Nonfinite registration residual'); return v; };
export function parseRegistrationComparison(value: unknown): RegistrationComparison {
  const record = object(value);
  if (typeof record.campaign_id !== 'string' || !record.campaign_id || record.fit_model !== 'SIMILARITY_2D' || record.target_frame !== 'PLATE_LOCAL_METERS') throw new Error('Unsupported registration output');
  const ids = new Set<string>();
  const rows = (value: unknown, role: ResidualVector['role']): ResidualVector[] => {
    if (!Array.isArray(value) || value.length > 10000) throw new Error('Malformed residual collection');
    return value.map(value => {
      const row = object(value), predicted = object(row.predicted), target = object(row.target);
      if (typeof row.id !== 'string' || !row.id || ids.has(row.id)) throw new Error('Duplicate/missing residual ID');
      ids.add(row.id);
      const px = finite(predicted.x), py = finite(predicted.y), tx = finite(target.x), ty = finite(target.y), dx = finite(row.dx), dy = finite(row.dy), error = finite(row.error);
      if (Math.abs((px - tx) - dx) > 1e-8 || Math.abs((py - ty) - dy) > 1e-8 || Math.abs(Math.hypot(dx, dy) - error) > 1e-8) throw new Error('Inconsistent residual vector');
      return { id: row.id, role, target: [tx, ty], predicted: [px, py], dx, dy, error };
    });
  };
  const vectors = [...rows(record.control_residuals, 'CONTROL'), ...rows(record.holdout_residuals, 'HOLDOUT')];
  if (!vectors.length) throw new Error('Empty registration result is not a residual field');
  const scale = record.scale_check && typeof record.scale_check === 'object' ? record.scale_check as Record<string, unknown> : null;
  return { status: 'IMPORTED_UNVERIFIED', campaignId: record.campaign_id, targetFrame: record.target_frame, sourceSha256: hash(record.source_sha256), renderSha256: hash(record.render_sha256), freezeSha256: hash(record.freeze_sha256), resultSha256: hash(record.result_sha256), vectors, metricAuthority: 'NONE', independentScale: scale?.evaluated === true ? 'CLAIMED_IN_IMPORTED_RESULT' : 'UNKNOWN', engineReportedPass: typeof record.passed === 'boolean' ? record.passed : null, note: 'Display of imported shared-engine output only. Hash strings are not byte verification. Re-run shared engine custody/frozen-experiment verification for authority; no transform connects this plate-local plane to this assembly.' };
}

export async function loadRegistrationComparison(url = '/model/plate_registration/first_plate_result.json'): Promise<RegistrationComparison> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) return unavailableRegistration(`Registration output unavailable (HTTP ${response.status}). No residuals manufactured.`);
    // Static SPA servers may return index.html with HTTP 200 for absent optional data.
    if (response.headers?.get('content-type')?.includes('text/html')) return unavailableRegistration('No registration result is installed. Source custody and independent control gates remain unresolved; residuals are UNKNOWN.');
    return parseRegistrationComparison(await response.json());
  }
  catch (error) { return unavailableRegistration(`Registration comparison isolated: ${error instanceof Error ? error.message : 'invalid optional data'}. Canonical assembly remains available.`); }
}
