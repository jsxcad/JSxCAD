import { clone } from './clone';
import { multiply } from '@jsxcad/math-mat4';

/**
 * Transforms the surface using the matrix provided.
 * This implementation uses a lazy transformation which is realized
 *   upon canonicalization.
 * @param {mat4} matrix - the transformation matrix.
 * @param {surface} surface - the surface to transform.
 * @returns {surface} the transformed surface.
 */
export const transform = (matrix, surface) => {
  if (!matrix.every(element => typeof element === 'number')) throw Error('die');
  let cloned = clone(surface);
  cloned.transforms = multiply(matrix, surface.transforms);
  cloned.polygons = undefined;
  cloned.isCanonicalized = false;
  return cloned;
};
