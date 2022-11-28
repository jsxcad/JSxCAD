import Shape from './Shape.js';
import { computeNormal } from '@jsxcad/geometry';

export const normal = Shape.registerMethod('normal', () => async (shape) => {
  const result = Shape.fromGeometry(computeNormal(await shape.toGeometry()));
  return result;
});

export default normal;
