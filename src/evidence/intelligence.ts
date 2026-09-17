import type { EvidenceAssembly } from './types';
import type { SpatialEvidenceGraph } from './graph';

export interface InvestigationCandidate {
  id: string;
  title: string;
  detected: string;
  evidenceIds: string[];
  featureIds: string[];
  computation: { method: string; expression: string; inputs: { id: string; value: number | string | null; unit: string | null }[]; result: number | string | null; unit: string | null };
  uncertainty: { status: 'KNOWN' | 'UNKNOWN'; value: number | null; unit: string | null; note: string };
  alternatives: string[];
  falsification: { test: string; neededEvidence: string[] };
  authority: 'RECONSTRUCTED' | 'HYPOTHESIS';
  status: 'REVIEW_REQUIRED';
  frameId: string;
}

/** Arithmetic review candidates only. No significance inference, historical intention or discovery claim. */
export function generateInvestigationCandidates(assembly: EvidenceAssembly, graph: SpatialEvidenceGraph): InvestigationCandidate[] {
  if (graph.assemblyId !== assembly.id) throw new Error('Candidate graph/assembly mismatch');
  const result: InvestigationCandidate[] = [];
  const observations = new Map(assembly.observations.map(o => [o.id, o]));
  const featuresFor = (ids: string[]) => assembly.features.filter(f => f.observationIds.some(id => ids.includes(id))).map(f => f.id).sort();
  const difference = (id: string, title: string, left: string, right: string, detected: string, alternatives: string[], falsifier: string) => {
    const a = observations.get(left), b = observations.get(right);
    if (!a || !b || typeof a.value !== 'number' || typeof b.value !== 'number' || a.unit !== b.unit) return;
    const known = a.uncertainty.status === 'KNOWN' && b.uncertainty.status === 'KNOWN' && typeof a.uncertainty.value === 'number' && typeof b.uncertainty.value === 'number';
    const uncertainty = known ? a.uncertainty.value! + b.uncertainty.value! : null;
    result.push({ id, title, detected, evidenceIds: [left, right], featureIds: featuresFor([left, right]),
      computation: { method: 'DIRECT_DIFFERENCE', expression: `${left} - ${right}`, inputs: [{ id: left, value: a.value, unit: a.unit }, { id: right, value: b.value, unit: b.unit }], result: a.value - b.value, unit: a.unit },
      uncertainty: { status: known ? 'KNOWN' : 'UNKNOWN', value: uncertainty, unit: a.unit, note: known ? 'Conservative sum of the supplied uncertainty magnitudes; no independence or confidence distribution assumed.' : 'At least one source uncertainty is unreported; no statistical significance or tolerance claim is possible.' },
      alternatives, falsification: { test: falsifier, neededEvidence: ['Independent measurements of the same named features', 'Measurement uncertainty and datum definitions'] },
      authority: 'RECONSTRUCTED', status: 'REVIEW_REQUIRED', frameId: assembly.authoritativeFrameId });
  };
  difference('candidate.coffer.lid-length-fit', 'Lid/body length compatibility', 'm.coffer.lid_length', 'm.coffer.outer_length', 'The reported west lid length and body outer length differ. This is a dimensional comparison, not a seated-fit or motion solution.', ['Measurements may refer to different edges or irregular surfaces.', 'Damage, rounding, transcription or source measurement uncertainty may explain the difference.', 'The seated position and contact surfaces are not independently surveyed.'], 'Repeat both measurements on identified common-axis edges; reject a meaningful fit discrepancy if their uncertainty intervals overlap or the dimensions are not comparable.');
  difference('candidate.coffer.lid-width-fit', 'Lid/body width compatibility', 'm.coffer.lid_width', 'm.coffer.outer_width', 'The reported south lid width differs from the mean body outer width; half this difference is not an observed edge clearance.', ['South-edge versus mean-width sampling may explain the difference.', 'The lid is not established as centred in its observed or intended seat.', 'Irregularity or unknown survey uncertainty may dominate.'], 'Survey corresponding lid/body contact edges in one independently controlled frame; reject a fit interpretation if sampling or uncertainty explains the difference.');
  difference('candidate.coffer.lid-thickness-range', 'Lid is not a uniform-thickness slab', 'm.coffer.lid_thickness_max', 'm.coffer.lid_thickness_min', 'The source reports a nonzero thickness range. A mean-thickness display slab cannot be promoted to a measured surface.', ['Reported points may include relief, damage or different reference surfaces.', 'A thickness range alone does not establish the spatial profile.'], 'Acquire point-located thickness observations with uncertainty; reject a particular reconstructed profile if those observations fall outside its predicted bounds.');
  difference('candidate.chamber.length-spread', 'Opposite chamber lengths differ', 'm.burial.length_n', 'm.burial.length_s', 'North and south length observations differ. Their average is a reconstruction, not evidence that both walls are equal.', ['True non-parallelism', 'Uneven wall surfaces or distinct sampling heights', 'Unreported survey uncertainty or transcription'], 'Independently survey corresponding wall endpoints; reject non-parallelism if the coordinate/uncertainty model accounts for the difference.');
  difference('candidate.chamber.width-spread', 'Opposite chamber widths differ', 'm.burial.width_w', 'm.burial.width_e', 'West and east width observations differ; the rectangular envelope suppresses this source variation.', ['Surface irregularity', 'Different endpoint definitions', 'Unreported survey uncertainty'], 'Survey the actual four corners and sampling heights with uncertainty; reject inferred asymmetry if the independently surveyed geometry is consistent with equal widths.');

  for (const audit of [...assembly.audit].sort((a, b) => a.id.localeCompare(b.id))) {
    if (audit.status === 'AGREEMENT') continue;
    result.push({ id: `candidate.transform:${audit.id}`, title: audit.label, detected: audit.note, evidenceIds: [...audit.observationIds].sort(), featureIds: featuresFor(audit.observationIds),
      computation: { method: 'LEGACY_DETAIL_AUDIT', expression: 'detail value - legacy value (comparison only)', inputs: [{ id: `${audit.id}:legacy`, value: audit.legacyValue, unit: audit.unit }, { id: `${audit.id}:detail`, value: audit.detailValue, unit: audit.unit }], result: audit.difference, unit: audit.unit },
      uncertainty: { status: 'UNKNOWN', value: null, unit: audit.unit, note: 'Legacy display assumptions cannot be converted to survey uncertainty.' },
      alternatives: ['Distinct reconstruction datums or orientations', 'Legacy envelope/preview dimensions', 'Missing archaeological placement information'],
      falsification: { test: 'Resolve the source-backed datum and orientation, then independently verify both representations using an explicit transform; do not edit canonical records to hide the difference.', neededEvidence: ['Explicit datum/control receipt', ...audit.observationIds] }, authority: 'HYPOTHESIS', status: 'REVIEW_REQUIRED', frameId: assembly.authoritativeFrameId });
  }

  for (const constraint of [...assembly.constraints].sort((a, b) => a.id.localeCompare(b.id))) {
    if (constraint.status === 'SATISFIED') continue;
    result.push({ id: `candidate.constraint:${constraint.id}`, title: `${constraint.status === 'VIOLATED' ? 'Constraint disagreement' : 'Unresolved constraint'} · ${constraint.id}`, detected: constraint.note, evidenceIds: [...constraint.observationIds].sort(), featureIds: [...constraint.featureIds].sort(),
      computation: { method: 'ASSEMBLY_CONSTRAINT_REVIEW', expression: constraint.kind, inputs: constraint.observationIds.map(id => { const o = observations.get(id); return { id, value: o?.value ?? null, unit: o?.unit ?? null }; }), result: constraint.value, unit: constraint.unit },
      uncertainty: { status: 'UNKNOWN', value: null, unit: constraint.unit, note: 'A constraint state does not establish the uncertainty or the cause of its failure.' },
      alternatives: ['Legacy display datum or inspection pose may differ from physical placement.', 'The source does not yet constrain this relation.', 'The reconstruction may be wrong.'],
      falsification: { test: 'Provide independent, feature-specific observations in a declared common frame, then rerun this constraint without altering the archived inputs.', neededEvidence: [...constraint.observationIds, 'Independent position/control and uncertainty'] }, authority: 'HYPOTHESIS', status: 'REVIEW_REQUIRED', frameId: assembly.authoritativeFrameId });
  }
  const registrationIds = graph.nodes.filter(n => n.kind === 'REGISTRATION' && n.data.status !== 'ENGINE_VERIFIED').map(n => n.id).sort();
  if (registrationIds.length) result.push({ id: 'candidate.assembly.independent-control', title: 'Independent image scale/control remains unestablished', detected: 'No accepted assembly image registration constrains canonical placement. Source-text dimensions remain usable as source-text observations, not registered photogrammetry.', evidenceIds: registrationIds, featureIds: [],
    computation: { method: 'AUTHORITY_GATE_AUDIT', expression: 'count(registrations without engine-verified assembly scope)', inputs: registrationIds.map(id => ({ id, value: 'NO_ACCEPTED_ASSEMBLY_REGISTRATION', unit: null })), result: registrationIds.length, unit: 'registrations' },
    uncertainty: { status: 'UNKNOWN', value: null, unit: 'm', note: 'No fit means no residual estimate; UNKNOWN is not zero.' },
    alternatives: ['A legitimate fit may exist outside the repository; it must be imported through custody and the shared registration engine.', 'Photographs may be suitable only for visual comparison.'],
    falsification: { test: 'Produce a source-byte-bound, frozen, independently scaled/control-checked assembly registration and evaluate untouched holdouts using the shared validated engine.', neededEvidence: ['Raw source bytes and rehashed SHA-256', 'Independent scale/control provenance', 'Frozen controls and holdouts', 'Shared-engine fit and residual receipt', 'Explicit assembly-frame tie'] }, authority: 'HYPOTHESIS', status: 'REVIEW_REQUIRED', frameId: assembly.authoritativeFrameId });
  return result.sort((a, b) => a.id.localeCompare(b.id));
}
