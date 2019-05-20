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
 * ::: xillustration { "view": { "position": [40, 40, 60] } }
 * circle({ radius: 10, resolution: 3 }).extrude({ height: 10 })
 * :::
 * ::: illustration
 * difference(circle(10), circle(8)).outline()
 * :::
 * ::: illustration { "view": { "position": [40, 40, 60] } }
 * difference(circle(10), circle(8)).extrude({ height: 10 })
 * :::
 *
 **/

export const fromHeight = ({ height }, shape) => {
console.log(`QQ/fromHeight/1`);
  const z0Surfaces = getZ0Surfaces(shape.toGeometry());
console.log(`QQ/fromHeight/2: ${JSON.stringify(z0Surfaces)}`);
  const solids = z0Surfaces.map(z0Surface => extrudeAlgorithm({ height: height }, z0Surface));
console.log(`QQ/fromHeight/3: ${JSON.stringify(solids)}`);
  const assembly = assemble(...solids.map(Shape.fromSolid));
console.log(`QQ/fromHeight/4: ${JSON.stringify(assembly)}`);
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
