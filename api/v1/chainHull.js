import { Shape } from './Shape';
import { assemble } from './assemble';
import { buildConvexHull } from '@jsxcad/geometry-points';
import { toPoints } from '@jsxcad/geometry-eager';

/**
 *
 * # Chain Hull
 *
 * Builds a convex hull between adjacent pairs in a sequence of shapes.
 *
 * ::: illustration { "view": { "position": [30, 30, 30] } }
 * ```
 * chainHull(cube(3).translate([-5, 5]),
 *           sphere(3).translate([5, -5]),
 *           cylinder(3, 10).translate([-10, -10]))
 *   .translate([10, 10])
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 0] } }
 * ```
 * chainHull(circle(20).translate([0, 0, -10]),
 *           circle(10),
 *           circle(20).translate([0, 0, 10]))
 * ```
 * :::
 *
 **/

export const chainHull = (...shapes) => {
  const pointsets = shapes.map(shape => toPoints({}, shape.toGeometry()).points);
  const chain = [];
  for (let nth = 1; nth < pointsets.length; nth++) {
    chain.push(Shape.fromPolygonsToSolid(buildConvexHull({}, [...pointsets[nth - 1], ...pointsets[nth]])));
  }
  return assemble(...chain);
};
