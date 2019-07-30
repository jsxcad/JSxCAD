import { assertNonZeroNumber, assertShape } from './assert';

import { Shape } from './Shape';
import { assemble } from './assemble';
import { assertGood as assertGoodSolid, transform as transformSolid } from '@jsxcad/geometry-solid';
import { assertGood as assertGoodSurface, toPlane as toPlaneOfSurface, transform as transformSurface } from '@jsxcad/geometry-surface';
import { dispatch } from './dispatch';
import { extrude as extrudeAlgorithm } from '@jsxcad/algorithm-shape';
import { getSurfaces, getZ0Surfaces } from '@jsxcad/geometry-tagged';
import { toXYPlaneTransforms } from '@jsxcad/math-plane';

/**
 *
 * # Extrude
 *
 * Generates a solid from a surface.
 *
 * ::: illustration
 * ```
 * difference(circle(10),
 *            circle(8))
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * ```
 * difference(circle(10),
 *            circle(8))
 *   .extrude({ height: 10 })
 * ```
 * :::
 *
 **/

export const fromHeight = ({ height }, shape) => {
  console.log(`QQ/fromHeight: ${height}`);
  // FIX: Handle extrusion along a vector properly.
  const solids = [];
  const keptGeometry = shape.toKeptGeometry();
  for (const { tags, z0Surface } of getZ0Surfaces(keptGeometry)) {
    assertGoodSurface(z0Surface);
    const solid = extrudeAlgorithm({ height }, z0Surface);
    assertGoodSolid(solid);
    solids.push(Shape.fromGeometry({ solid, tags }));
  }
  for (const { tags, surface } of getSurfaces(keptGeometry)) {
    assertGoodSurface(surface);
    const [toZ0, fromZ0] = toXYPlaneTransforms(toPlaneOfSurface(surface));
    const z0Solid = extrudeAlgorithm({ height }, transformSurface(toZ0, surface));
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
};

export const fromValue = (height, shape) => fromHeight({ height }, shape);

export const extrude = dispatch(
  'extrude',
  (height, shape) => {
    assertNonZeroNumber(height);
    assertShape(shape);
    return () => fromValue(height, shape);
  },
  ({ height }, shape) => {
    assertNonZeroNumber(height);
    assertShape(shape);
    return () => fromHeight({ height }, shape);
  }
);

extrude.fromValue = fromValue;
extrude.fromHeight = fromHeight;

const method = function (options) { return extrude(options, this); };
Shape.prototype.extrude = method;
