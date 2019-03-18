import { measureBoundingBox } from './measureBoundingBox';
import { add, distance, scale } from '@jsxcad/math-vec3';

/** Measure the bounding sphere of the given poly3
 * @param {poly3} the poly3 to measure
 * @returns computed bounding sphere; center (vec3) and radius
 */
export const measureBoundingSphere = (poly3) => {
  const box = measureBoundingBox(poly3);
  const center = scale(0.5, add(box[0], box[1]));
  const radius = distance(center, box[1]);
  return [center, radius];
};
