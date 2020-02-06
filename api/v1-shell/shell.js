import { Circle, Sphere } from '@jsxcad/api-v1-shapes';
import { Shape, assemble, union } from '@jsxcad/api-v1-shape';
import { getAnySurfaces, getSolids, outline, transform } from '@jsxcad/geometry-tagged';

import { getEdges } from '@jsxcad/geometry-path';
import { hull } from '@jsxcad/api-v1-extrude';
import { toPlane } from '@jsxcad/geometry-surface';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

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
  const assembly = [];

  // Handle solid aspects.
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
  assembly.push(union(...shells));

  // Handle surface aspects.
  for (const geometry of getAnySurfaces(keptGeometry)) {
    const anySurface = geometry.surface || geometry.z0Surface;
    const plane = toPlane(anySurface);
    if (plane === undefined) {
      continue;
    }
    const [to, from] = toXYPlaneTransforms(plane);
    const pieces = [];
    for (const { paths } of outline(transform(to, geometry))) {
      for (const path of paths) {
        for (const edge of getEdges(path)) {
          // FIX: Handle non-z0-surfaces properly.
          pieces.push(hull(...edge.map(([x, y]) => Circle(radius, resolution).move(x, y))));
        }
      }
    }
    assembly.push(assemble(...pieces.map(piece => piece.transform(from))).as(...(geometry.tags || [])));
  }

  return assemble(...assembly);
};

const method = function (radius, resolution) { return shell(this, radius, resolution); };
Shape.prototype.shell = method;

export default shell;
