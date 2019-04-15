import { fromTranslation } from '@jsxcad/math-mat4';
import { transform } from '@jsxcad/math-vec3';

export const translate = ([x = 0, y = 0, z = 0], points) =>
  points.map(point => transform(fromTranslation([x, y, z]), point));
