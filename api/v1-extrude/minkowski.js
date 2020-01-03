import { Shape } from '@jsxcad/api-v1-shape';
import { buildConvexMinkowskiSum } from '@jsxcad/algorithm-shape';

/**
 *
 * # Minkowski (convex)
 *
 * Generates the minkowski sum of a two convex shapes.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * minkowski(Cube(10),
 *           Sphere(3));
 * ```
 * :::
 *
 **/

// TODO: Generalize for more operands?
export const minkowski = (a, b) => {
  const aPoints = [];
  const bPoints = [];
  a.eachPoint(point => aPoints.push(point));
  b.eachPoint(point => bPoints.push(point));
  return Shape.fromGeometry(buildConvexMinkowskiSum(aPoints, bPoints));
};

export default minkowski;

minkowski.signature = 'minkowski(a:Shape, b:Shape) -> Shape';
