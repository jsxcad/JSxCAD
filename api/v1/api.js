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
  defGrblPlotter,
  defGrblSpindle,
  defRgbColor,
  defThreejsMaterial,
  defTool,
} from './define.js';

export const yz = Peg('x', [0, 0, 0], [0, 0, 1], [0, -1, 0]);
export const xz = Peg('y', [0, 0, 0], [0, 0, 1], [1, 0, 0]);
export const xy = Peg('z', [0, 0, 0], [0, 1, 0], [-1, 0, 0]);

export { card, emitSourceLocation } from './card.js';

export { md } from './md.js';

export { control } from './control.js';

export { source } from './source.js';

export { elapsed, emit, info, read, write } from '@jsxcad/sys';

export {
  beginRecordingNotes,
  replayRecordedNotes,
  saveRecordedNotes,
} from './recordNotes.js';

export {
  Shape,
  add,
  and,
  addTo,
  align,
  as,
  bend,
  clip,
  clipFrom,
  color,
  colors,
  cut,
  cutFrom,
  drop,
  // each,
  fuse,
  grow,
  inset,
  keep,
  loadGeometry,
  loft,
  log,
  loop,
  material,
  minkowskiDifference,
  minkowskiShell,
  minkowskiSum,
  move,
  noVoid,
  notAs,
  offset,
  op,
  pack,
  push,
  peg,
  remesh,
  rotate,
  rx,
  ry,
  rz,
  rotateX,
  rotateY,
  rotateZ,
  saveGeometry,
  scale,
  smooth,
  size,
  sketch,
  split,
  tags,
  test,
  tint,
  tool,
  twist,
  voidFn,
  weld,
  withFn,
  withInset,
  withOp,
  x,
  y,
  z,
} from '@jsxcad/api-v1-shape';

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
  Plan,
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
  ofPlan,
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
  zag,
} from '@jsxcad/api-v1-math';

export { readSvg } from '@jsxcad/api-v1-svg';

export { readStl } from '@jsxcad/api-v1-stl';

export { readObj } from '@jsxcad/api-v1-obj';
export { readOff } from '@jsxcad/api-v1-off';

export { foot, inch, mm, mil, cm, m, thou, yard } from '@jsxcad/api-v1-units';
