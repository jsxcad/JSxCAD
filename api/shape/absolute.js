import Shape from './Shape.js';
import { makeAbsolute } from '@jsxcad/geometry';

export const absolute = Shape.registerMethod(
  'absolute',
  () => (shape) => Shape.fromGeometry(makeAbsolute(shape.toGeometry()))
);

export default absolute;
