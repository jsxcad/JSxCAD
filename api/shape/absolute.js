import Shape from './Shape.js';
import { makeAbsolute } from '@jsxcad/geometry';

export const absolute = () => (shape) =>
  Shape.fromGeometry(makeAbsolute(shape.toGeometry()));

Shape.registerMethod('absolute', absolute);

export default absolute;
