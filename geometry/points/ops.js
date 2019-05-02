import { fromTranslation } from '@jsxcad/math-mat4';
import { transform as transformPoint } from '@jsxcad/math-vec3';

export const transform = (matrix, points) => points.map(point => transformPoint(matrix, point));
export const translate = ([x = 0, y = 0, z = 0], points) => transform(fromTranslation([x, y, z]), points);
