import Shape from './Shape.js';
import { computeNormal } from '@jsxcad/geometry';

export const normal = Shape.registerMethod2(
  'normal',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(computeNormal(geometry))
);

export default normal;
