import { Shape } from './Shape.js';
import { intersection } from '@jsxcad/geometry-tagged';

export const clip = (shape, ...shapes) =>
  Shape.fromGeometry(
    intersection(
      shape.toGeometry(),
      ...shapes.map((shape) => shape.toGeometry())
    )
  );

const clipMethod = function (...shapes) {
  return clip(this, ...shapes);
};
Shape.prototype.clip = clipMethod;
