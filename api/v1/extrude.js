import { assertNumber, assertShape } from './assert';

import { Shape } from './Shape';
import { dispatch } from './dispatch';
import { extrude as extrudeAlgorithm } from '@jsxcad/algorithm-shape';
import { map } from '@jsxcad/geometry-tagged';

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

export const fromHeight = ({ height }, shape) =>
  Shape.fromGeometry(
    map(shape.toKeptGeometry(),
        (item) => {
          if (item.z0Surface) {
            return { ...item, solid: extrudeAlgorithm({ height: height }, item.z0Surface) };
          } else {
            return item;
          }
        }));
// const z0Surfaces = getZ0Surfaces(shape.toKeptGeometry());
// const solids = z0Surfaces.map(({ z0Surface }) => extrudeAlgorithm({ height: height }, z0Surface));
// const assembly = assemble(...solids.map(Shape.fromSolid)).setTags(shape.getTags());
// return assembly;

export const fromValue = (height, shape) => fromHeight({ height }, shape);

export const extrude = dispatch(
  'extrude',
  (height, shape) => {
    assertNumber(height);
    assertShape(shape);
    return () => fromValue(height, shape);
  },
  ({ height }, shape) => {
    assertNumber(height);
    assertShape(shape);
    return () => fromHeight({ height }, shape);
  }
);

extrude.fromValue = fromValue;
extrude.fromHeight = fromHeight;

const method = function (options) { return extrude(options, this); };
Shape.prototype.extrude = method;
