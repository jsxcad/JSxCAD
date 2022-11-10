import Point from './Point.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { grow as growGeometry } from '@jsxcad/geometry';

export const grow = Shape.registerMethod('grow', (...args) => (shape) => {
  const {
    number: amount,
    string: axes = 'xyz',
    shapesAndFunctions: selections,
  } = destructure(args);
  return Shape.fromGeometry(
    growGeometry(
      shape.toGeometry(),
      Point().z(amount).toGeometry(),
      shape.toShapes(selections).map((shape) => shape.toGeometry()),
      {
        x: axes.includes('x'),
        y: axes.includes('y'),
        z: axes.includes('z'),
      }
    )
  );
});
