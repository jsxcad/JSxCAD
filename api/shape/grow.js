import Shape from './Shape.js';
import { grow as growGeometry } from '@jsxcad/geometry';
import { removeSelfIntersections } from './removeSelfIntersections.js';

export const grow =
  (amount, { doRemoveSelfIntersections = true } = {}) =>
  (shape) =>
    Shape.fromGeometry(growGeometry(shape.toGeometry(), amount)).op(
      doRemoveSelfIntersections && removeSelfIntersections()
    );

Shape.registerMethod('grow', grow);
