import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import { getAt, getFrom, getMatrix, getScale, getTo } from './Plan.js';
import { registerReifier, taggedPlan } from '@jsxcad/geometry';

import { fromPoints } from '@jsxcad/math-poly3';
import { negate } from '@jsxcad/math-vec3';

/** @type {function(Point[], Path[]):Triangle[]} */
const fromPointsAndPaths = (points = [], paths = []) => {
  /** @type {Polygon[]} */
  const polygons = [];
  for (const path of paths) {
    polygons.push({ points: fromPoints(path.map((nth) => points[nth])) });
  }
  return polygons;
};

// Unit icosahedron vertices.
/** @type {Point[]} */
const points = [
  [0.850651, 0.0, -0.525731],
  [0.850651, -0.0, 0.525731],
  [-0.850651, -0.0, 0.525731],
  [-0.850651, 0.0, -0.525731],
  [0.0, -0.525731, 0.850651],
  [0.0, 0.525731, 0.850651],
  [0.0, 0.525731, -0.850651],
  [0.0, -0.525731, -0.850651],
  [-0.525731, -0.850651, -0.0],
  [0.525731, -0.850651, -0.0],
  [0.525731, 0.850651, 0.0],
  [-0.525731, 0.850651, 0.0],
];

// Triangular decomposition structure.
/** @type {Path[]} */
const paths = [
  [1, 9, 0],
  [0, 10, 1],
  [0, 7, 6],
  [0, 6, 10],
  [0, 9, 7],
  [4, 1, 5],
  [9, 1, 4],
  [1, 10, 5],
  [3, 8, 2],
  [2, 11, 3],
  [4, 5, 2],
  [2, 8, 4],
  [5, 11, 2],
  [6, 7, 3],
  [3, 11, 6],
  [3, 7, 8],
  [4, 8, 9],
  [5, 10, 11],
  [6, 11, 10],
  [7, 9, 8],
];

// FIX: Why aren't we computing the convex hull?

/**
 * Computes the polygons of a unit icosahedron.
 * @type {function():Triangle[]}
 */
const buildRegularIcosahedron = () => {
  return fromPointsAndPaths(points, paths);
};

registerReifier('Icosahedron', (geometry) => {
  const [scale, middle] = getScale(geometry);
  const a = Shape.fromPolygons(buildRegularIcosahedron({}));
  const b = a.scale(...scale);
  const c = b.move(...middle);
  const d = c.orient({
    center: negate(getAt(geometry)),
    from: getFrom(geometry),
    at: getTo(geometry),
  });
  const e = d.transform(getMatrix(geometry))
  const f = e.setTags(geometry.tags);
  const g = f.toGeometry();
  return g;
});

export const Icosahedron = (x = 1, y = x, z = x) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Icosahedron' })).diameter(x, y, z);

export default Icosahedron;

Shape.prototype.Icosahedron = shapeMethod(Icosahedron);
