/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

import '@jsxcad/api-v1-deform';
import '@jsxcad/api-v1-extrude';
import '@jsxcad/api-v1-gcode';
import '@jsxcad/api-v1-layout';
import '@jsxcad/api-v1-pdf';
import '@jsxcad/api-v1-plans';
import '@jsxcad/api-v1-tools';

import { Peg } from '@jsxcad/api-v1-shapes';

export { define } from './define.js';

export const x = Peg([0, 0, 0], [0, 0, 1], [0, -1, 0]);
export const y = Peg([0, 0, 0], [0, 0, 1], [1, 0, 0]);
export const z = Peg([0, 0, 0], [0, 1, 0], [-1, 0, 0]);

// export const x = Peg([0, 0, 0], [0, 0, 1], [0, 1, 0]);
// export const y = Peg([0, 0, 0], [0, 0, 1], [-1, 0, 0]);
// export const z = Peg([0, 0, 0], [0, 1, 0], [1, 0, 0]);

export { Page, pack } from '@jsxcad/api-v1-layout';

export { md } from './md.js';

export {
  checkBox,
  numberBox,
  selectBox,
  sliderBox,
  stringBox,
} from './control.js';

export { source } from './source.js';

export { emit, read, write } from '@jsxcad/sys';

export {
  beginRecordingNotes,
  replayRecordedNotes,
  saveRecordedNotes,
} from './recordNotes.js';

// export { X, Y, Z } from '@jsxcad/api-v1-connector';

// export { Loop } from '@jsxcad/api-v1-extrude';

export { Shape, loadGeometry, log, saveGeometry } from '@jsxcad/api-v1-shape';

export { Line2 } from '@jsxcad/api-v1-line2';

export { Plan } from '@jsxcad/api-v1-plan';

export { Shell } from '@jsxcad/api-v1-shell';

export {
  Arc,
  Assembly,
  Block,
  Box,
  ChainedHull,
  Circle,
  Cone,
  Difference,
  Empty,
  Group,
  Hershey,
  Hexagon,
  Hull,
  Icosahedron,
  Implicit,
  Intersection,
  Line,
  LoopedHull,
  Octagon,
  Orb,
  Path,
  Peg,
  Pentagon,
  Plane,
  Point,
  Points,
  Polygon,
  Polyhedron,
  RegularPolygon,
  Rod,
  Septagon,
  Spiral,
  Square,
  Tetragon,
  Toolpath,
  Torus,
  Triangle,
  Union,
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

export { foot, inch, mm, mil, cm, m, thou, yard } from '@jsxcad/api-v1-units';
