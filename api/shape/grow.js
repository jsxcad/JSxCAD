import Point from './Point.js';
import Shape from './Shape.js';
import { grow as growGeometry } from '@jsxcad/geometry';
import { removeSelfIntersections } from './removeSelfIntersections.js';

export const grow =
  (amount, { doRemoveSelfIntersections = true } = {}) =>
  (shape) =>
    Shape.fromGeometry(
      growGeometry(shape.toGeometry(), Point().z(amount).toGeometry())
    ).op(doRemoveSelfIntersections && removeSelfIntersections());

Shape.registerMethod('grow', grow);
