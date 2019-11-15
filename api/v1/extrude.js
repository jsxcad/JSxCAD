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
 * Generates a solid from a surface.
 *
 * ::: illustration
 * ```
 * difference(Circle(10),
 *            Circle(8))
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * difference(Circle(10),
 *            Circle(8))
 *   .extrude(10)
 * ```
 * :::
 *
 **/

const op = (shape, twist = 0, steps = 1, heights) => {
  if (typeof heights === 'number') {
    heights = [heights];
  }
  const depth = heights.length > 1 ? Math.min(...heights) : 0;
  const height = heights.length > 0 ? Math.max(...heights) : 1;
  const twistRadians = twist * Math.PI / 180;
  // FIX: Handle extrusion along a vector properly.
  const solids = [];
  const keptGeometry = shape.toKeptGeometry();
  for (const { z0Surface, tags } of getZ0Surfaces(keptGeometry)) {
    if (z0Surface.length > 0) {
      const solid = extrudeAlgorithm(z0Surface, height, steps, twistRadians);
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

export const withTwist = (shape, twist, { steps, height = [] }) => op(shape, twist, steps, height);

export const toHeight = (shape, ...height) => op(shape, 0, 1, height);

export const extrude = (...args) => extrude.toHeight(...args);
extrude.toHeight = toHeight;
extrude.withTwist = withTwist;

const extrudeMethod = function (...args) { return extrude(this, ...args); };
Shape.prototype.extrude = extrudeMethod;

const extrudeToHeightMethod = function (...args) { return toHeight(this, ...args); };
Shape.prototype.extrudeToHeight = extrudeToHeightMethod;

const extrudeWithTwistMethod = function (...args) { return withTwist(this, ...args); };
Shape.prototype.extrudeWithTwist = extrudeWithTwistMethod;
