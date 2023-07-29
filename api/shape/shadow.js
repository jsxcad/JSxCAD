import { XY, cast as castGeometry } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const shadow = Shape.registerMethod3(
  ['silhouette', 'shadow'],
  ['inputGeometry', 'geometry', 'geometry'],
  (geometry, planeReference = XY(0), sourceReference = XY(1)) =>
    castGeometry(planeReference, sourceReference, geometry)
);

export default shadow;
