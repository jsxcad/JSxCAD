import Shape from './Shape.js';
import { toConcreteGeometry } from '@jsxcad/geometry';

export const reify = Shape.chainable(
  () => (shape) => Shape.fromGeometry(toConcreteGeometry(shape.toGeometry()))
);

Shape.registerMethod('reify', reify);

export default reify;
