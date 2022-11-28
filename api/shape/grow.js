import Point from './Point.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { grow as growGeometry } from '@jsxcad/geometry';

export const grow = Shape.registerMethod('grow', (...args) => async (shape) => {
  const {
    number: amount,
    string: axes = 'xyz',
    shapesAndFunctions: selections,
  } = destructure(args);
  return Shape.fromGeometry(
    growGeometry(
      await shape.toGeometry(),
      await Point().z(amount).toGeometry(),
      await shape.toShapesGeometries(selections),
      {
        x: axes.includes('x'),
        y: axes.includes('y'),
        z: axes.includes('z'),
      }
    )
  );
});
