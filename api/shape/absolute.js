import Shape from './Shape.js';
import { makeAbsolute } from '@jsxcad/geometry';

export const absolute = Shape.registerMethod2(
  'absolute',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(makeAbsolute(geometry))
);

export default absolute;
