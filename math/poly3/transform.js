import { isMirroring } from '@jsxcad/math-mat4';
import { map } from './map';
import { transform as transformVec3 } from '@jsxcad/math-vec3';

// Affine transformation of polygon. Returns a new polygon.
export const transform = (matrix, polygons) => {
  const transformed = map(polygons, vertex => transformVec3(matrix, vertex));
  if (isMirroring(matrix)) {
    // Reverse the order to preserve the orientation.
    transformed.reverse();
  }
  return transformed;
};
