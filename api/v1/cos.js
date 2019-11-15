/**
 *
 * # Cosine
 *
 * Gives the cosine in degrees.
 * ```
 * cos(a) => Math.cos(a / 360 * Math.PI * 2);
 *
 * cos(0) = 1
 * cos(45) = 0.707
 * cos(90) = 0
 * ```
 *
 **/

export const cos = (a) => Math.cos(a / 360 * Math.PI * 2);

export default cos;
