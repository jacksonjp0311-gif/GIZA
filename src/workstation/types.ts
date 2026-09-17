import type { Part, PhotoRecord } from '../lib/model';
import type { UiMode, ViewPreset } from '../scene/types';

export type InspectorTab = 'OVERVIEW' | 'SPECS' | 'PHOTOS' | 'EVIDENCE' | 'CANON' | 'FIELD' | 'SIMULATION' | 'FINDINGS';
export type LayerKey = 'exterior' | 'casing' | 'internal' | 'subsurface' | 'terrain' | 'photos' | 'measurements' | 'blocks' | 'xray' | 'field' | 'simulation';

export interface QuickViewItem {
  label: string;
  id: string;
  action: () => void;
  part?: Part;
  photo: PhotoRecord | null;
}

export const MODES: { id: UiMode; label: string; sub: string }[] = [
  { id: 'DISCOVER', label: 'DISCOVER', sub: 'Guided View' },
  { id: 'EXPLORE', label: 'EXPLORE', sub: 'Spatial Navigation' },
  { id: 'ENGINEER', label: 'REVERSE ENGINEER', sub: 'Evidence + Specs' },
];

export const VIEW_BUTTONS: { preset: ViewPreset; label: string }[] = [
  { preset: 'PERSPECTIVE', label: 'Perspective' },
  { preset: 'NORTH', label: 'North' },
  { preset: 'EAST', label: 'East' },
  { preset: 'TOP', label: 'Top' },
  { preset: 'INTERIOR', label: 'Interior' },
];
