import { Circle, Sphere } from '@jsxcad/api-v1-shapes';
import { Shape, union } from '@jsxcad/api-v1-shape';
import { getSolids, outline } from '@jsxcad/geometry-tagged';

import { hull } from '@jsxcad/api-v1-extrude';
import { toSegments } from '@jsxcad/geometry-path';

/**
 *
 * # Shell
 *
 * Converts a solid into a hollow shell of a given thickness.
 *
 * ::: illustration
 * ```
 * Cube(10).shell(1);
 * ```
 * :::
 *
 **/

export const shell = (shape, radius = 1, resolution = 8) => {
  resolution = Math.max(resolution, 3);
  const keptGeometry = shape.toKeptGeometry();
  const shells = [];
  for (const { solid, tags = [] } of getSolids(keptGeometry)) {
    const pieces = [];
    for (const surface of solid) {
      for (const polygon of surface) {
        pieces.push(hull(...polygon.map(point => Sphere(radius, resolution).move(...point))));
      }
    }
    shells.push(union(...pieces).as(...tags));
  }
  for (const { paths, tags = [] } of outline(keptGeometry)) {
    const pieces = [];
    for (const path of paths) {
      for (const segment of toSegments({}, path)) {
        // FIX: Handle non-z0-surfaces properly.
        pieces.push(hull(...segment.map(([x, y]) => Circle(radius, resolution).move(x, y))));
      }
    }
    shells.push(union(...pieces).as(...tags));
  }
  return union(...shells);
};

const method = function (radius, resolution) { return shell(this, radius, resolution); };
Shape.prototype.shell = method;

export default shell;