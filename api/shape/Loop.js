import Shape from './Shape.js';
import { link as linkGeometry } from '@jsxcad/geometry';

export const Loop = Shape.registerMethod2(
  'Loop',
  ['geometries'],
  (geometries) =>
    Shape.fromGeometry(linkGeometry(geometries, /* close= */ true))
);

export const loop = Shape.registerMethod2(
  'loop',
  ['input', 'shapes'],
  (input, shapes) => Loop(input, ...shapes)
);

export default Loop;
