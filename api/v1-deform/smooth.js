import Shape from '@jsxcad/api-v1-shape';
import { smooth as smoothGeometry } from '@jsxcad/geometry-tagged';

export const smooth = (shape) => {
  return Shape.fromGeometry(smoothGeometry(shape.toGeometry()));
};

const smoothMethod = function () {
  return smooth(this);
};
Shape.prototype.smooth = smoothMethod;

export default smooth;
