import { Shape, fromGeometry } from './Shape.js';
import { disjoint as disjointGeometry } from '@jsxcad/geometry';

export const disjoint =
  ({ strategy } = {}) =>
  (shape) =>
    fromGeometry(disjointGeometry([shape.toGeometry()], strategy));

Shape.registerMethod('disjoint', disjoint);
