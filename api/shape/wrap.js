import { Group } from './Group.js';
import { Shape } from './Shape.js';
import { wrap as wrapGeometry } from '@jsxcad/geometry';

export const Wrap = Shape.registerShapeMethod(
  'Wrap',
  (offset = 1, alpha = 0.1) =>
    (...shapes) =>
      Group(...shapes).wrap(offset, alpha)
);

export const wrap = Shape.registerMethod(
  'wrap',
  (offset = 1, alpha = 0.1) =>
    (shape) =>
      Shape.fromGeometry(
        wrapGeometry(shape.toGeometry(), shape.getTags(), offset, alpha)
      )
);

export default wrap;
