import Group from './Group.js';
import Shape from './Shape.js';
import { hasTypeMasked } from '@jsxcad/geometry';

export const masking = (masked) => (shape) =>
  Group(
    shape.void(),
    Shape.fromGeometry(hasTypeMasked(Shape.toShape(masked, shape).toGeometry()))
  );

Shape.registerMethod('masking', masking);

export default masking;
