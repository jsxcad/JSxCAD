/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

import '@jsxcad/api-v1-connector';
import '@jsxcad/api-v1-deform';
import '@jsxcad/api-v1-extrude';
import '@jsxcad/api-v1-item';
import '@jsxcad/api-v1-layout';
import '@jsxcad/api-v1-shell';

export {
  source
} from './source';

export {
  X,
  Y,
  Z
} from '@jsxcad/api-v1-connector';

export {
  Shape,
  log
} from '@jsxcad/api-v1-shape';

export {
  pack
} from '@jsxcad/api-v1-layout';

export {
  Plan
} from '@jsxcad/api-v1-plan';

export {
  Page
} from '@jsxcad/api-v1-plans';

export {
  Arc,
  Assembly,
  Circle,
  Cone,
  Cube,
  Cylinder,
  Empty,
  Hexagon,
  Icosahedron,
  Layers,
  Line,
  Point,
  Points,
  Polygon,
  Polyhedron,
  Prism,
  Sphere,
  Spiral,
  Square,
  Tetrahedron,
  Torus,
  Triangle,
  Wave
} from '@jsxcad/api-v1-shapes';

export {
  WoodScrew
} from '@jsxcad/api-v1-items';

export {
  acos,
  cos,
  ease,
  max,
  min,
  numbers,
  sin,
  sqrt,
  vec
} from '@jsxcad/api-v1-math';

export {
  foot,
  inch,
  mm,
  mil,
  cm,
  m,
  thou,
  yard
} from '@jsxcad/api-v1-units';
