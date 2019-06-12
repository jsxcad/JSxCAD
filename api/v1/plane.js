import { fromPoints } from '@jsxcad/math-plane';

/**
 *
 * # Plane
 *
 * Generates a plane with the given constraints.
 *
 * ::: illustration { "view": { "position": [-100, -100, 100] } }
 * ```
 * sphere(20).cut(planeX())[0];
 * ```
 * :::
 * ::: illustration { "view": { "position": [-100, -100, 100] } }
 * ```
 * sphere(20).cut(planeY(0))[0];
 * ```
 * :::
 * ::: illustration { "view": { "position": [-100, -100, 100] } }
 * ```
 * sphere(20).cut(planeZ(0))[1];
 * ```
 * :::
 *
 **/

// Plane Interfaces.

export const planeX = (x = 0) => fromPoints([x, 0, 0], [x, 1, 0], [x, 0, 1]);
export const planeY = (y = 0) => fromPoints([1, y, 0], [0, y, 0], [0, y, 1]);
export const planeZ = (z = 0) => fromPoints([1, 0, z], [0, 1, z], [0, 0, z]);
