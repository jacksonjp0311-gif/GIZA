export type UiMode = 'DISCOVER' | 'EXPLORE' | 'ENGINEER';
export type SectionAxis = 'OFF' | 'X' | 'Y' | 'Z';
export type ViewPreset = 'PERSPECTIVE' | 'NORTH' | 'EAST' | 'TOP' | 'INTERIOR' | 'UNDERGROUND' | 'SECTION';

export interface StoneCellInfo {
  id: string;
  course: number;
  face: 'N' | 'E' | 'S' | 'W';
  index: number;
  center_m: [number, number, number];
  width_m: number;
  height_m: number;
  depth_m: number;
  provenance: 'ASSUMED';
}
