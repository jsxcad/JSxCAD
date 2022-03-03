import { Shape, fromGeometry } from './Shape.js';
import { disjoint as disjointGeometry } from '@jsxcad/geometry';

export const disjoint = () => (shape) =>
  fromGeometry(disjointGeometry([shape.toGeometry()]));

Shape.registerMethod('disjoint', disjoint);
