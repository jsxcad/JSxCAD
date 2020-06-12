/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

import "@jsxcad/api-v1-deform";
import "@jsxcad/api-v1-layout";
import "@jsxcad/api-v1-pdf";
import "@jsxcad/api-v1-shell";
import "@jsxcad/api-v1-svg";
import "@jsxcad/api-v1-stl";
// import '@jsxcad/api-v1-view';

export { md } from "./md";

export { source } from "./source";

export { emit, read, write } from "@jsxcad/sys";

export { Connector, X, Y, Z } from "@jsxcad/api-v1-connector";

export { ChainedHull, Hull, Loop } from "@jsxcad/api-v1-extrude";

export { Shape, log, make } from "@jsxcad/api-v1-shape";

export { pack } from "@jsxcad/api-v1-layout";

export { Line2 } from "@jsxcad/api-v1-line2";

export { Plan } from "@jsxcad/api-v1-plan";

export { Page } from "@jsxcad/api-v1-plans";

export {
  Arc,
  Assembly,
  Circle,
  Cone,
  Cube,
  Cylinder,
  Difference,
  Empty,
  Hexagon,
  Icosahedron,
  Intersection,
  Layers,
  Line,
  Path,
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
  Union,
  Void,
  Wave,
} from "@jsxcad/api-v1-shapes";

export { Item } from "@jsxcad/api-v1-item";

export { WoodScrew } from "@jsxcad/api-v1-items";

export {
  Noise,
  Random,
  acos,
  cos,
  ease,
  max,
  min,
  numbers,
  sin,
  sqrt,
  vec,
} from "@jsxcad/api-v1-math";

export { foot, inch, mm, mil, cm, m, thou, yard } from "@jsxcad/api-v1-units";
