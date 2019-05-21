import { Shape } from './Shape';
import { assemble } from './assemble';
import { assertNumber } from './assert';
import { dispatch } from './dispatch';
import { extrude as extrudeAlgorithm } from '@jsxcad/algorithm-shape';
import { getZ0Surfaces } from '@jsxcad/geometry-eager';

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
  const z0Surfaces = getZ0Surfaces(shape.toGeometry());
  const solids = z0Surfaces.map(z0Surface => extrudeAlgorithm({ height: height }, z0Surface));
  const assembly = assemble(...solids.map(Shape.fromSolid));
  return assembly;
};

export const extrude = dispatch(
  'extrude',
  ({ height }, shape) => {
    assertNumber(height);
    return () => fromHeight({ height }, shape);
  }
);

const method = function (options) { return extrude(options, this); };

Shape.prototype.extrude = method;
