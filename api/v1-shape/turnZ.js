import { Shape } from './Shape';
import { negate } from '@jsxcad/math-vec3';

export const turnZ = (shape, angle) => {
  const center = shape.measureCenter();
  return shape.move(...negate(center))
      .rotateZ(angle)
      .move(...center);
};

const turnZMethod = function (angle) { return turnZ(this, angle); };
Shape.prototype.turnZ = turnZMethod;

export default turnZ;
