import Point from './Point.js';
import Shape from './Shape.js';
import { hasTypeReference } from '@jsxcad/geometry';

export const Ref = Shape.registerShapeMethod('Ref', (...args) =>
  Point(...args).ref()
);

export const ref = Shape.registerMethod(
  'ref',
  () => (shape) => Shape.fromGeometry(hasTypeReference(shape.toGeometry()))
);

export default Ref;
