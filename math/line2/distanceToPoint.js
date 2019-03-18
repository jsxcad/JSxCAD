import { dot } from '@jsxcad/math-vec2';

/**
 * Calculate the distance (positive) between the given point and line
 *
 * @param {vec2} point the point of reference
 * @param {line2} line the 2D line of reference
 * @return {Number} distance between line and point
 */
export const distanceToPoint = (point, line) => Math.abs(dot(point, line) - line[2]);
