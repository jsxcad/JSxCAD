import Point from './Point.js';
import Shape from './Shape.js';
import { hasTypeReference } from '@jsxcad/geometry';

export const Ref = (...args) => Point(...args).ref();
Shape.prototype.Point = Shape.shapeMethod(Ref);

export const ref = Shape.chainable(
  () => (shape) => Shape.fromGeometry(hasTypeReference(shape.toGeometry()))
);

Shape.registerMethod('ref', ref);

export default Ref;
