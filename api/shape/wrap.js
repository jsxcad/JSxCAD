import { Shape } from './Shape.js';
import { wrap as wrapGeometry } from '@jsxcad/geometry';

export const wrap =
  (offset = 1, alpha = 20) =>
  (shape) =>
    Shape.fromGeometry(
      wrapGeometry(shape.toGeometry(), shape.getTags(), offset, alpha)
    );

Shape.registerMethod('wrap', wrap);

export default wrap;
