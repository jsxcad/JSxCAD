import { Shape } from './Shape';

/**
 *
 * # Polyhedron
 *
 * FIX: Invalid winding.
 *
 * ::: illustration { "view": { "position": [80, 20, 20] } }
 * ```
 * polyhedron({ points: [[10, 10, 0], [10, -10, 0], [-10, -10, 0], [-10, 10, 0], [0, 0, 10]],
 *              triangles: [[0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4], [1, 0, 3], [2, 1, 3]] })
 * ```
 * :::
 *
 **/

export const polyhedron = ({ points = [], triangles = [] }) => {
  const polygons = [];
  for (const triangle of triangles) {
    polygons.push(triangle.map(point => points[point]));
  }
  return Shape.fromPolygonsToSolid(polygons);
};
