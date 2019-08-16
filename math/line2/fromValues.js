/**
 * Creates a new unbounded 2D line initialized with the given values.
 *
 * This is a 2d plane, similar to the [x, y, z, w] form of the 3d plane.
 *
 * @param {Number} x X coordinate of the unit normal
 * @param {Number} y Y coordinate of the unit normal
 * @param {Number} w length (positive) of the normal segment
 * @returns {line2} a new unbounded 2D line
 */
export const fromValues = (x = 0, y = 1, w = 0) => [x, y, w];
