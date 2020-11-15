import { Shape } from '@jsxcad/api-v1-shape';
import { interior as interiorGeometry } from '@jsxcad/geometry-tagged';

export const interior = (shape) =>
  Shape.fromGeometry(interiorGeometry(shape.toGeometry()));

const interiorMethod = function () {
  return interior(this);
};

Shape.prototype.interior = interiorMethod;
Shape.prototype.fill = interiorMethod;

export default interior;
