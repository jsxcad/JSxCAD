import { dot } from '@jsxcad/math-vec3';

const W = 3;

/**
 * Calculate the distance to the given point
 * @return {Number} signed distance to point
 */
export const signedDistanceToPoint = (plane, vector) => dot(plane, vector) - plane[W];
