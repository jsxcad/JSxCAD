import { add, distance, scale } from '@jsxcad/math-vec3';

import { measureBoundingBox } from './measureBoundingBox';

/** Measure the bounding sphere of the given poly3
 * @param {poly3} the poly3 to measure
 * @returns computed bounding sphere; center (vec3) and radius
 */
export const measureBoundingSphere = (polygons) => {
  if (polygons.boundingSphere === undefined) {
    const [min, max] = measureBoundingBox(polygons);
    const center = scale(0.5, add(min, max));
    const radius = distance(center, max);
    polygons.boundingSphere = [center, radius];
  }
  return polygons.boundingSphere;
};
