import type { SectionAxis, UiMode, ViewPreset } from '../components/GizaScene';

export type PersistedLayerKey = 'exterior' | 'casing' | 'internal' | 'subsurface' | 'terrain' | 'photos' | 'measurements' | 'blocks' | 'xray' | 'field' | 'simulation';

export interface WorkspaceState {
  version: 1;
  selectedId: string | null;
  explode: number;
  mode: UiMode;
  sectionAxis: SectionAxis;
  sectionPos: number;
  viewPreset: ViewPreset;
  animationSpeed: number;
  showLabels: boolean;
  showDimensions: boolean;
  layers: Record<PersistedLayerKey, boolean>;
}

const KEY = 'giza.nexus.workspace.v1';

export const DEFAULT_WORKSPACE: WorkspaceState = {
  version: 1,
  selectedId: 'part.pyramid.khafre',
  explode: 0.18,
  mode: 'EXPLORE',
  sectionAxis: 'OFF',
  sectionPos: 0,
  viewPreset: 'PERSPECTIVE',
  animationSpeed: 1,
  showLabels: true,
  showDimensions: true,
  layers: {
    exterior: true,
    casing: true,
    internal: true,
    subsurface: false,
    terrain: true,
    photos: true,
    measurements: true,
    blocks: true,
    xray: false,
    field: true,
    simulation: false,
  },
};

export function loadWorkspaceState(): WorkspaceState {
  if (typeof window === 'undefined') return DEFAULT_WORKSPACE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_WORKSPACE;
    const parsed = JSON.parse(raw) as Partial<WorkspaceState>;
    if (parsed.version !== 1) return DEFAULT_WORKSPACE;
    return {
      ...DEFAULT_WORKSPACE,
      ...parsed,
      layers: { ...DEFAULT_WORKSPACE.layers, ...(parsed.layers ?? {}) },
    };
  } catch {
    return DEFAULT_WORKSPACE;
  }
}

export function saveWorkspaceState(state: WorkspaceState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage failure should never block the workstation.
  }
}

export function clearWorkspaceState() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(KEY); } catch { /* no-op */ }
}
