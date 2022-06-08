import Shape from './Shape.js';
import { serialize as serializeGeometry } from '@jsxcad/geometry';

export const serialize = Shape.chainable(
  (op = (v) => v, groupOp = (v, s) => s) =>
    (shape) =>
      groupOp(op(serializeGeometry(shape.toGeometry())), shape)
);

Shape.registerMethod('serialize', serialize);
