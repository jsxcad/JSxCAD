import { assertGood as assertGoodSolid, transform as transformSolid } from '@jsxcad/geometry-solid';
import { assertGood as assertGoodSurface, toPlane as toPlaneOfSurface, transform as transformSurface } from '@jsxcad/geometry-surface';
import { assertNonZeroNumber, assertShape } from './assert';
import { getSurfaces, getZ0Surfaces } from '@jsxcad/geometry-tagged';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { cache } from './cache';
import { dispatch } from './dispatch';
import { extrude as extrudeAlgorithm } from '@jsxcad/algorithm-shape';
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

export const fromHeight =
  cache((shape, height = 1, steps = 1, twist = 0) => {
    const twistRadians = twist * Math.PI / 180;
    // FIX: Handle extrusion along a vector properly.
    const solids = [];
    const keptGeometry = shape.toKeptGeometry();
    for (const { tags, z0Surface } of getZ0Surfaces(keptGeometry)) {
      assertGoodSurface(z0Surface);
      const solid = extrudeAlgorithm({ height, steps, twistRadians }, z0Surface);
      assertGoodSolid(solid);
      solids.push(Shape.fromGeometry({ solid, tags }));
    }
    for (const { tags, surface } of getSurfaces(keptGeometry)) {
      assertGoodSurface(surface);
      const [toZ0, fromZ0] = toXYPlaneTransforms(toPlaneOfSurface(surface));
      const z0Solid = extrudeAlgorithm({ height, steps, twistRadians }, transformSurface(toZ0, surface));
      assertGoodSolid(z0Solid);
      const solid = transformSolid(fromZ0, z0Solid);
      assertGoodSolid(solid);
      solids.push(Shape.fromGeometry({ solid, tags }));
    }
    if (height < 0) {
      // Turn negative extrusions inside out.
      return assemble(...solids).flip();
    } else {
      return assemble(...solids);
    }
  });

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
