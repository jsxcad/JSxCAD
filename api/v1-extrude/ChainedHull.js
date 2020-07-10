import { Shape, assemble } from '@jsxcad/api-v1-shape';
import {
  buildConvexHull,
  buildConvexSurfaceHull,
} from '@jsxcad/algorithm-shape';

/**
 *
 * # Chained Hull
 *
 * Builds a convex hull between adjacent pairs in a sequence of shapes.
 *
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * chainHull(Cube(3).move(-5, 5),
 *           Sphere(3).move(5, -5),
 *           Cylinder(3, 10).move(-10, -10))
 *   .move(10, 10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 0] } }
 * ```
 * chainHull(Circle(20).moveZ(-10),
 *           Circle(10),
 *           Circle(20).moveZ(10))
 * ```
 * :::
 *
 **/

const Z = 2;

export const ChainedHull = (...shapes) => {
  const pointsets = shapes.map((shape) => shape.toPoints());
  const chain = [];
  for (let nth = 1; nth < pointsets.length; nth++) {
    const points = [...pointsets[nth - 1], ...pointsets[nth]];
    if (points.every((point) => point[Z] === 0)) {
      chain.push(Shape.fromGeometry(buildConvexSurfaceHull(points)));
    } else {
      chain.push(Shape.fromGeometry(buildConvexHull(points)));
    }
  }
  return assemble(...chain);
};

const ChainedHullMethod = function (...args) {
  return ChainedHull(this, ...args);
};
Shape.prototype.ChainedHull = ChainedHullMethod;

ChainedHull.signature = 'ChainedHull(...shapes:Shape) -> Shape';

export default ChainedHull;
