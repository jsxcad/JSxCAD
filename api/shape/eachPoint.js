import Shape from './Shape.js';
import { eachPoint as eachPointOfGeometry } from '@jsxcad/geometry';

export const eachPoint = (operation) => (shape) =>
  eachPointOfGeometry(operation, shape.toGeometry());

Shape.registerMethod('eachPoint', eachPoint);
