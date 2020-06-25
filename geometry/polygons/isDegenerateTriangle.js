import { equals } from '@jsxcad/math-vec3';

export const isDegenerateTriangle = (triangle) =>
  equals(triangle[0], triangle[1]) ||
  equals(triangle[1], triangle[2]) ||
  equals(triangle[2], triangle[0]);
