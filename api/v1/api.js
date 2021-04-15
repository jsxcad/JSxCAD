/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

import '@jsxcad/api-v1-extrude';
import '@jsxcad/api-v1-gcode';
import '@jsxcad/api-v1-pdf';
import '@jsxcad/api-v1-tools';

import { Peg } from '@jsxcad/api-v1-shapes';

export {
  define,
  defGrblConstantLaser,
  defGrblDynamicLaser,
  defGrblSpindle,
  defRgbColor,
  defThreejsMaterial,
  defTool,
} from './define.js';

export const x = Peg('x', [0, 0, 0], [0, 0, 1], [0, -1, 0]);
export const y = Peg('y', [0, 0, 0], [0, 0, 1], [1, 0, 0]);
export const z = Peg('z', [0, 0, 0], [0, 1, 0], [-1, 0, 0]);

export { card } from './card.js';

export { md } from './md.js';

export { control } from './control.js';

export { source } from './source.js';

export { elapsed, emit, read, write } from '@jsxcad/sys';

export {
  beginRecordingNotes,
  replayRecordedNotes,
  saveRecordedNotes,
} from './recordNotes.js';

export { Shape, loadGeometry, log, saveGeometry } from '@jsxcad/api-v1-shape';

export {
  Arc,
  Assembly,
  Box,
  ChainedHull,
  Cone,
  Empty,
  Group,
  Hershey,
  Hexagon,
  Hull,
  Icosahedron,
  Implicit,
  Line,
  LoopedHull,
  Octagon,
  Orb,
  Page,
  Path,
  Peg,
  Pentagon,
  Plane,
  Point,
  Points,
  Polygon,
  Polyhedron,
  Septagon,
  Spiral,
  Tetragon,
  Triangle,
  Wave,
  Weld,
} from '@jsxcad/api-v1-shapes';

export { Item } from '@jsxcad/api-v1-item';

export {
  Noise,
  Random,
  acos,
  cos,
  each,
  ease,
  max,
  min,
  numbers,
  sin,
  sqrt,
  vec,
} from '@jsxcad/api-v1-math';

export { readSvg } from '@jsxcad/api-v1-svg';

export { readStl } from '@jsxcad/api-v1-stl';

export { readObj } from '@jsxcad/api-v1-obj';
export { readOff } from '@jsxcad/api-v1-off';

export { foot, inch, mm, mil, cm, m, thou, yard } from '@jsxcad/api-v1-units';
