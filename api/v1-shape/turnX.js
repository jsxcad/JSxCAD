import { Shape } from './Shape';
import { negate } from '@jsxcad/math-vec3';

export const turnX = (shape, angle) => {
  const center = shape.measureCenter();
  return shape.move(...negate(center))
      .rotateX(angle)
      .move(...center);
};

const turnXMethod = function (angle) { return turnX(this, angle); };
Shape.prototype.turnX = turnXMethod;

export default turnX;
