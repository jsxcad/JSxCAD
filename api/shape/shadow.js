import Shape from './Shape.js';
import { cast as castGeometry } from '@jsxcad/geometry';

export const shadow = Shape.registerMethod3(
  ['silhouette', 'shadow'],
  ['inputGeometry', 'geometry', 'geometry'],
  (geometry, planeReference, sourceReference) =>
    castGeometry(planeReference, sourceReference, geometry)
);

export default shadow;
