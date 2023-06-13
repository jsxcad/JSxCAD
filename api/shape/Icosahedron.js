import { buildCorners, computeMiddle, computeScale } from './Plan.js';

import Shape from './Shape.js';

const fromPointsAndPaths = (points = [], paths = []) => {
  const polygons = [];
  for (const path of paths) {
    polygons.push({ points: path.map((nth) => points[nth]) });
  }
  return polygons;
};

// Unit icosahedron vertices.
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

const reifyIcosahedron = async (c1, c2) => {
  const scale = computeScale(c1, c2);
  const middle = computeMiddle(c1, c2);
  return Shape.chain(Shape.fromPolygons(buildRegularIcosahedron({})))
    .scale(...scale)
    .move(...middle)
    .absolute();
};

export const Icosahedron = Shape.registerMethod2(
  'Icosahedron',
  ['input', 'interval', 'interval', 'interval'],
  async (input, x = 1, y = x, z = x) => {
    const [c1, c2] = await buildCorners(x, y, z)(input);
    return reifyIcosahedron(c1, c2);
  }
);

export default Icosahedron;
