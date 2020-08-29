import Shape from '@jsxcad/api-v1-shape';
import { rewriteTags } from '@jsxcad/geometry-tagged';

// FIX: Move to api-v1-shape?
export const hole = (shape) =>
  Shape.fromGeometry(
    rewriteTags(['compose/non-positive'], [], shape.toGeometry())
  );

const holeMethod = function () {
  return hole(this);
};
Shape.prototype.hole = holeMethod;

export default hole;
