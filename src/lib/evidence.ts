import type { Part } from './model';

export type EvidenceMaturity = 'E0' | 'E1' | 'E2' | 'E3' | 'E4' | 'E5';

export interface EvidenceItem {
  id: string;
  targets: string[];
  kind: string;
  source_ids: string[];
  maturity: EvidenceMaturity;
  status: 'ACCEPTED' | 'CANDIDATE' | 'REJECTED' | string;
  provenance_class: string;
  claims: string[];
  notes?: string;
}

export interface SourceAuthority { geometry: number; materials: number; visual: number; method: number; }

export interface SourceRegistryEntry {
  id: string;
  title: string;
  author: string;
  year: number | null;
  kind: string;
  url: string;
  access: string;
  rights: string;
  rights_class?: string;
  asset_action: string;
  authority?: SourceAuthority;
  roles?: string[];
  resolution?: string;
  targets?: string[];
  geometry_role: string[];
  resolution_role: string;
  notes?: string;
}

export interface PromotionGate {
  requires: string[];
  recommended?: string[];
}

export interface PromotionPolicy {
  version: string;
  hard_rules: string[];
  gates: Record<string, PromotionGate>;
  provenance_mapping: Record<EvidenceMaturity, string[]>;
}

export interface EvidenceMaturityCatalog {
  version: string;
  independent_axis_note: string;
  levels: Array<{
    id: EvidenceMaturity;
    name: string;
    meaning: string;
    allowed_mutation: boolean | string;
  }>;
}

const ORDER: EvidenceMaturity[] = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5'];

export function maturityRank(level: EvidenceMaturity): number {
  return ORDER.indexOf(level);
}

export function evidenceForTarget(items: EvidenceItem[], targetId: string): EvidenceItem[] {
  return items.filter(item => item.targets.includes(targetId) && item.status !== 'REJECTED');
}

export function highestMaturity(items: EvidenceItem[]): EvidenceMaturity {
  if (!items.length) return 'E0';
  return items.reduce<EvidenceMaturity>((best, item) =>
    maturityRank(item.maturity) > maturityRank(best) ? item.maturity : best, 'E0');
}

export function evidenceSummary(part: Part | null, items: EvidenceItem[]) {
  if (!part) return { maturity: 'E0' as EvidenceMaturity, items: [] as EvidenceItem[], sourceIds: [] as string[] };
  const matched = evidenceForTarget(items, part.id);
  const sourceIds = [...new Set(matched.flatMap(item => item.source_ids))];
  return { maturity: highestMaturity(matched), items: matched, sourceIds };
}

export function provenanceCompatible(part: Part, maturity: EvidenceMaturity, policy: PromotionPolicy): boolean {
  const allowed = policy.provenance_mapping[maturity] ?? [];
  return allowed.includes(part.provenance.class);
}
