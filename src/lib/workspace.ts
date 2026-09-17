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
  explode: 0,
  mode: 'EXPLORE',
  sectionAxis: 'OFF',
  sectionPos: 0,
  viewPreset: 'PERSPECTIVE',
  animationSpeed: 1,
  showLabels: true,
  showDimensions: false,
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

export function sanitizeWorkspace(value:unknown):WorkspaceState {
  const defaults={...DEFAULT_WORKSPACE,layers:{...DEFAULT_WORKSPACE.layers}};
  if(!value||typeof value!=='object'||Array.isArray(value))return defaults;
  const v=value as Record<string,unknown>;
  if(v.version!==1)return defaults;
  const number=(key:string,min:number,max:number,fallback:number)=>typeof v[key]==='number'&&Number.isFinite(v[key])?Math.min(max,Math.max(min,v[key] as number)):fallback;
  const choice=<T extends string>(key:string,options:T[],fallback:T):T=>options.includes(v[key] as T)?v[key] as T:fallback;
  const layers=v.layers&&typeof v.layers==='object'?v.layers as Record<string,unknown>:{};
  for(const key of Object.keys(defaults.layers) as PersistedLayerKey[])if(typeof layers[key]==='boolean')defaults.layers[key]=layers[key] as boolean;
  return {...defaults,
    selectedId:v.selectedId===null?null:typeof v.selectedId==='string'&&/^part\.[a-z0-9._-]+$/i.test(v.selectedId)?v.selectedId:defaults.selectedId,
    explode:number('explode',0,2.75,defaults.explode),sectionPos:number('sectionPos',-1000,1000,defaults.sectionPos),animationSpeed:number('animationSpeed',.25,2,1),
    mode:choice('mode',['DISCOVER','EXPLORE','ENGINEER'],defaults.mode),sectionAxis:choice('sectionAxis',['OFF','X','Y','Z'],defaults.sectionAxis),
    viewPreset:choice('viewPreset',['PERSPECTIVE','NORTH','EAST','TOP','INTERIOR','UNDERGROUND','SECTION'],defaults.viewPreset),
    showLabels:typeof v.showLabels==='boolean'?v.showLabels:defaults.showLabels,showDimensions:typeof v.showDimensions==='boolean'?v.showDimensions:defaults.showDimensions};
}

export function loadWorkspaceState(): WorkspaceState {
  if (typeof window === 'undefined') return DEFAULT_WORKSPACE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_WORKSPACE;
    return sanitizeWorkspace(JSON.parse(raw));
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
