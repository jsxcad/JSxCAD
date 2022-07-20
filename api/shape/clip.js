import { Shape } from './Shape.js';
import { clip as clipGeometry } from '@jsxcad/geometry';
import { destructure } from './destructure.js';

export const Clip = (shape, ...shapes) => shape.clip(...shapes);

export const clip = Shape.chainable((...args) => (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Shape.fromGeometry(
    clipGeometry(
      shape.toGeometry(),
      shapes.map((other) => Shape.toShape(other, shape).toGeometry()),
      modes.includes('open')
    )
  );
});

Shape.registerMethod('clip', clip);
