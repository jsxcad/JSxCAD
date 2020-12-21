import Shape from '@jsxcad/api-v1-shape';
import { smooth as smoothGeometry } from '@jsxcad/geometry-tagged';

export const smooth = (shape, length, angle) => {
  return Shape.fromGeometry(
    smoothGeometry(shape.toGeometry(), { length, angle })
  );
};

const smoothMethod = function (length, { angle } = {}) {
  return smooth(this, length, angle);
};
Shape.prototype.smooth = smoothMethod;

export default smooth;
