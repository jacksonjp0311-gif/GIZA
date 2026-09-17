import * as THREE from 'three';
import type { StoneField } from '../lib/model';
import type { SectionAxis, StoneCellInfo, ViewPreset } from './types';

export const VIEW_PRESETS: Record<ViewPreset, { position: [number, number, number]; target: [number, number, number] }> = {
  PERSPECTIVE: { position: [310, -420, 245], target: [0, 0, 35] },
  NORTH: { position: [0, -535, 155], target: [0, 0, 30] },
  EAST: { position: [535, 0, 155], target: [0, 0, 30] },
  TOP: { position: [0.01, -0.01, 625], target: [0, 0, 0] },
  INTERIOR: { position: [195, -265, 95], target: [0, 0, 7] },
  UNDERGROUND: { position: [335, -455, -105], target: [0, 0, -235] },
  SECTION: { position: [430, -18, 105], target: [0, 0, 0] },
};

export function normalizeVector(v: [number, number, number]) {
  const m = Math.hypot(...v) || 1;
  return [v[0] / m, v[1] / m, v[2] / m] as [number, number, number];
}

export function clippingPlanes(axis: SectionAxis, pos: number) {
  if (axis === 'OFF') return [];
  const n = axis === 'X' ? new THREE.Vector3(-1, 0, 0)
    : axis === 'Y' ? new THREE.Vector3(0, -1, 0)
      : new THREE.Vector3(0, 0, -1);
  return [new THREE.Plane(n, pos)];
}

export function buildStoneCells(field: StoneField): StoneCellInfo[] {
  const cells: StoneCellInfo[] = [];
  const h = field.height_m;
  const courseH = h / field.visual_course_count;
  const faces: StoneCellInfo['face'][] = ['N', 'E', 'S', 'W'];

  for (let course = 0; course < field.visual_course_count; course += 1) {
    const z = (course + 0.5) * courseH;
    const span = Math.max(field.target_block_width_m, field.base_m * (1 - z / h));
    const n = Math.max(1, Math.ceil(span / field.target_block_width_m));
    const blockW = span / n;

    for (const face of faces) {
      for (let index = 0; index < n; index += 1) {
        const tangent = -span / 2 + (index + 0.5) * blockW;
        const radial = span / 2 + field.radial_depth_m / 2;
        const center: [number, number, number] = face === 'N' ? [tangent, radial, z]
          : face === 'S' ? [tangent, -radial, z]
            : face === 'E' ? [radial, tangent, z]
              : [-radial, tangent, z];
        cells.push({
          id: `cell.c${String(course + 1).padStart(3, '0')}.${face}.${String(index + 1).padStart(3, '0')}`,
          course: course + 1,
          face,
          index: index + 1,
          center_m: center,
          width_m: blockW,
          height_m: courseH,
          depth_m: field.radial_depth_m,
          provenance: 'ASSUMED',
        });
      }
    }
  }
  return cells;
}

export function explodedCellPosition(cell: StoneCellInfo, field: StoneField, explode: number) {
  const [x, y, z] = cell.center_m;
  const normal = cell.face === 'N' ? [0, 1, 0]
    : cell.face === 'S' ? [0, -1, 0]
      : cell.face === 'E' ? [1, 0, 0]
        : [-1, 0, 0];
  const coursePhase = cell.course / field.visual_course_count;
  const stagger = (((cell.index * 13 + cell.course * 7) % 17) - 8) / 8;
  const radialExplode = explode * (14 + 76 * coursePhase + Math.abs(stagger) * 10);
  const verticalExplode = explode * (
    (cell.course - field.visual_course_count / 2) * 0.2
    + (((cell.index + cell.course) % 5) - 2) * 1.35
  );
  const cascade = explode * stagger * (8 + 16 * coursePhase);
  return [
    x + normal[0] * radialExplode + (cell.face === 'N' || cell.face === 'S' ? cascade : 0),
    y + normal[1] * radialExplode + (cell.face === 'E' || cell.face === 'W' ? cascade : 0),
    z + verticalExplode,
  ] as [number, number, number];
}
