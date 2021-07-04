import { Shape } from '@jsxcad/api-v2';
import { fill as fillGeometry } from '@jsxcad/geometry';

export const fill = (shape) =>
  Shape.fromGeometry(fillGeometry(shape.toGeometry()));

const fillMethod = function () {
  return fill(this);
};

const withFillMethod = function () {
  return this.group(this.fill());
};

Shape.prototype.interior = fillMethod;
Shape.prototype.fill = fillMethod;
Shape.prototype.withFill = withFillMethod;

export default fill;
