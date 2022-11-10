import Shape from './Shape.js';
import { computeNormal } from '@jsxcad/geometry';

export const normal = Shape.registerMethod(
  'normal',
  () => async (shape) => Shape.fromGeometry(computeNormal((await shape).toGeometry()))
);

export default normal;
