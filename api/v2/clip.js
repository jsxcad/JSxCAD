import { Shape } from './Shape.js';
import { intersection } from '@jsxcad/geometry';

export const clip =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      intersection(
        shape.toGeometry(),
        ...shapes.map((shape) => shape.toGeometry())
      )
    );

Shape.registerMethod('clip', clip);
