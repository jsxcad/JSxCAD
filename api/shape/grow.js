import Point from './Point.js';
import Shape from './Shape.js';
import { grow as growGeometry } from '@jsxcad/geometry';

export const grow = Shape.registerMethod2(
  'grow',
  ['inputGeometry', 'number', 'string', 'geometries'],
  async (geometry, amount, axes = 'xyz', selections) =>
    Shape.fromGeometry(
      growGeometry(geometry, await Point().z(amount).toGeometry(), selections, {
        x: axes.includes('x'),
        y: axes.includes('y'),
        z: axes.includes('z'),
      })
    )
);
