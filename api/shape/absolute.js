import Shape from './Shape.js';
import { makeAbsolute } from '@jsxcad/geometry';

export const absolute = Shape.chainable(
  () => (shape) => Shape.fromGeometry(makeAbsolute(shape.toGeometry()))
);

Shape.registerMethod('absolute', absolute);

export default absolute;
