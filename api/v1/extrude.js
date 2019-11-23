import { getSurfaces, getZ0Surfaces } from '@jsxcad/geometry-tagged';
import { toPlane as toPlaneOfSurface, transform as transformSurface } from '@jsxcad/geometry-surface';

import Shape from './Shape';
import assemble from './assemble';
import { extrude as extrudeAlgorithm } from '@jsxcad/algorithm-shape';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';
import { transform as transformSolid } from '@jsxcad/geometry-solid';

/**
 *
 * # Extrude
 *
 * Generates a solid from a surface by linear extrusion.
 *
 * ```
 * shape.extrude(height, depth, { twist = 0, steps = 1 })
 * ```
 *
 * ::: illustration
 * ```
 * Circle(10).cut(Circle(8))
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * Circle(10).cut(Circle(8)).extrude(10)
 * ```
 * :::
 *
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * Triangle(10).extrude(5, -2)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * Triangle(10).extrude(10, 0, { twist: 90, steps: 10 })
 * ```
 * :::
 *
 **/

export const extrude = (shape, height = 1, depth = 0, { twist = 0, steps = 1 } = {}) => {
  if (height < depth) {
    [height, depth] = [depth, height];
  }
  const twistRadians = twist * Math.PI / 180;
  // FIX: Handle extrusion along a vector properly.
  const solids = [];
  const keptGeometry = shape.toKeptGeometry();
  for (const { z0Surface, tags } of getZ0Surfaces(keptGeometry)) {
    if (z0Surface.length > 0) {
      const solid = extrudeAlgorithm(z0Surface, height, depth, steps, twistRadians);
      solids.push(Shape.fromGeometry({ solid, tags }));
    }
  }
  for (const { surface, tags } of getSurfaces(keptGeometry)) {
    if (surface.length > 0) {
      const [toZ0, fromZ0] = toXYPlaneTransforms(toPlaneOfSurface(surface));
      const z0SolidGeometry = extrudeAlgorithm(transformSurface(toZ0, surface), height, depth, steps, twistRadians);
      const solid = transformSolid(fromZ0, z0SolidGeometry);
      solids.push(Shape.fromGeometry({ solid, tags }));
    }
  }
  return assemble(...solids);
};

const extrudeMethod = function (...args) { return extrude(this, ...args); };
Shape.prototype.extrude = extrudeMethod;

export default extrude;
