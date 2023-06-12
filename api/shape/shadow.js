import Shape from './Shape.js';
import { XY } from './refs.js';
import { cast as castGeometry } from '@jsxcad/geometry';

export const shadow = Shape.registerMethod2(
  'shadow',
  ['inputGeometry', 'geometry', 'geometry'],
  (geometry, planeReference = XY(0), sourceReference = XY(1)) =>
    Shape.fromGeometry(castGeometry(planeReference, sourceReference, geometry))
);

export default shadow;
