import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry-tagged';

export const voidFn = (shape) =>
  Shape.fromGeometry(
    rewriteTags(['compose/non-positive'], [], shape.toGeometry())
  );

const voidMethod = function () {
  return voidFn(this);
};
Shape.prototype.void = voidMethod;
