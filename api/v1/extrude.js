import { assertNonZeroNumber, assertShape } from './assert';
import { getSurfaces, getZ0Surfaces, toKeptGeometry, transform } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { dispatch } from './dispatch';
import { extrude as extrudeAlgorithm } from '@jsxcad/algorithm-shape';
import { toPlane as toPlaneOfSurface } from '@jsxcad/geometry-surface';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

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
 *   .extrude({ height: 10 })
 * ```
 * :::
 *
 **/

export const fromHeight = (shape, height = 1, steps = 1, twist = 0) => {
  const twistRadians = twist * Math.PI / 180;
  // FIX: Handle extrusion along a vector properly.
  const solids = [];
  const keptGeometry = shape.toKeptGeometry();
  for (const z0SurfaceGeometry of getZ0Surfaces(keptGeometry)) {
    const solidGeometry = extrudeAlgorithm(z0SurfaceGeometry, height, steps, twistRadians);
    solids.push(Shape.fromGeometry(solidGeometry));
  }
  for (const surfaceGeometry of getSurfaces(keptGeometry)) {
    const [toZ0, fromZ0] = toXYPlaneTransforms(toPlaneOfSurface(surfaceGeometry.surface));
    const z0SolidGeometry = extrudeAlgorithm(toKeptGeometry(transform(toZ0, surfaceGeometry)), height, steps, twistRadians);
    const solidGeometry = transform(fromZ0, z0SolidGeometry);
    solids.push(Shape.fromGeometry(solidGeometry));
  }
  if (height < 0) {
    // Turn negative extrusions inside out.
    return assemble(...solids).flip();
  } else {
    return assemble(...solids);
  }
};

export const fromValue = (shape, height) => fromHeight(shape, height);

export const extrude = dispatch(
  'extrude',
  (height, shape) => {
    assertNonZeroNumber(height);
    assertShape(shape);
    return () => fromValue(shape, height);
  },
  ({ height, steps = 1, twist = 0 }, shape) => {
    assertNonZeroNumber(height);
    assertShape(shape);
    return () => fromHeight(shape, height, steps, twist);
  }
);

extrude.fromValue = fromValue;
extrude.fromHeight = fromHeight;

const method = function (options) { return extrude(options, this); };
Shape.prototype.extrude = method;
