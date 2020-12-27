import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry-tagged';

export const hole = (shape) =>
  Shape.fromGeometry(
    rewriteTags(['compose/non-positive'], [], shape.toGeometry())
  );

const holeMethod = function () {
  return hole(this);
};
Shape.prototype.hole = holeMethod;
Shape.prototype.void = holeMethod;

export default hole;
