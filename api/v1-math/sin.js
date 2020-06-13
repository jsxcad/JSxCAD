/**
 *
 * # Sine
 *
 * Gives the sine in degrees.
 * ```
 * sin(a) => Math.sin(a / 360 * Math.PI * 2);
 *
 * sin(0) = 0
 * sin(45) = 0.707
 * sin(90) = 1
 * ```
 *
 **/

export const sin = (a) => Math.sin((a / 360) * Math.PI * 2);

export default sin;
