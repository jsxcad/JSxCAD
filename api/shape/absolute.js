import Shape from './Shape.js';
import { makeAbsolute } from '@jsxcad/geometry';

export const absolute = Shape.registerMethod(
  'absolute',
  () => async (shape) =>
    Shape.fromGeometry(makeAbsolute(await shape.toGeometry()))
);

export default absolute;
