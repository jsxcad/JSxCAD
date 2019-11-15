/**
 *
 * # Arc Cosine
 *
 * Gives the arc cosine converted to degrees.
 * ```
 * acos(a) => Math.acos(a) / (Math.PI * 2) * 360;
 *
 * acos(0) = 90
 * acos(0.5) = 60
 * acos(1) = 0
 * ```
 *
 **/

export const acos = (a) => Math.acos(a) / (Math.PI * 2) * 360;

export default acos;
