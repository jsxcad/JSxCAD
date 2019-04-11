import { measureBoundingBox } from './measureBoundingBox';
import { add, distance, scale } from '@jsxcad/math-vec3';

/** Measure the bounding sphere of the given poly3
 * @param {poly3} the poly3 to measure
 * @returns computed bounding sphere; center (vec3) and radius
 */
export const measureBoundingSphere = (solid) => {
  if (solid.boundingSphere === undefined) {
    const [min, max] = measureBoundingBox(solid);
    const center = scale(0.5, add(min, max));
    const radius = distance(center, max);
    solid.boundingSphere = [center, radius];
  }
  return solid.boundingSphere;
};
