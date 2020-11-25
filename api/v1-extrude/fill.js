import { Shape } from '@jsxcad/api-v1-shape';
import { fill as fillGeometry } from '@jsxcad/geometry-tagged';

export const fill = (shape) =>
  Shape.fromGeometry(fillGeometry(shape.toGeometry()));

const fillMethod = function () {
  return fill(this);
};

Shape.prototype.interior = fillMethod;
Shape.prototype.fill = fillMethod;

export default fill;
