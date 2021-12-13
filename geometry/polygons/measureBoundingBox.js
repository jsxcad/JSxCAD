import { identityMatrix } from '@jsxcad/math-mat4';
import { transform } from '@jsxcad/math-vec3';

export const measureBoundingBox = (polygons, matrix = identityMatrix) => {
  if (polygons.measureBoundingBox === undefined) {
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (const path of polygons) {
      for (const rawPoint of path) {
        const point = transform(matrix, rawPoint);
        if (point[0] < min[0]) min[0] = point[0];
        if (point[1] < min[1]) min[1] = point[1];
        if (point[2] < min[2]) min[2] = point[2];
        if (point[0] > max[0]) max[0] = point[0];
        if (point[1] > max[1]) max[1] = point[1];
        if (point[2] > max[2]) max[2] = point[2];
      }
    }
    polygons.measureBoundingBox = [min, max];
  }
  return polygons.measureBoundingBox;
};
