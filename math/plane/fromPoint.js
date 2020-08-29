import { dot } from '@jsxcad/math-vec3';

export const fromPoint = ([x = 0, y = 0, z = 0, u = 0, v = 0, d = 1]) => {
  const w = dot([x, y, z], [u, v, d]);
  return [u, v, d, w];
};
