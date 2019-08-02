import { Shape } from './Shape';

/**
 *
 * # Polyhedron
 *
 * ::: illustration { "view": { "position": [80, 20, 20] } }
 * ```
 * Polyhedron({ points: [[10, 10, 0], [10, -10, 0], [-10, -10, 0], [-10, 10, 0], [0, 0, 10]],
 *              triangles: [[4, 1, 0], [4, 2, 1], [4, 3, 2], [4, 0, 3], [3, 0, 1], [3, 1, 2]] })
 * ```
 * :::
 *
 **/

export const Polyhedron = ({ points = [], triangles = [] }) => {
  const polygons = [];
  for (const triangle of triangles) {
    polygons.push(triangle.map(point => points[point]));
  }
  return Shape.fromPolygonsToSolid(polygons);
};
