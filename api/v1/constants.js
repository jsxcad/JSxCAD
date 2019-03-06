/** Number of polygons per 360 degree revolution for 2D objects.
 * @default
 */
export const defaultResolution2D = 32;
/** Number of polygons per 360 degree revolution for 3D objects.
 * @default
 */
export const defaultResolution3D = 12;

/** Epsilon used during determination of near zero distances.
 * @default
 */
export const EPS = 1e-5;

/** Epsilon used during determination of near zero areas.
 * @default
 */
export const angleEPS = 0.10;

/** Epsilon used during determination of near zero areas.
 *  This is the minimal area of a minimal polygon.
 * @default
 */
export const areaEPS = 0.50 * EPS * EPS * Math.sin(angleEPS);

export const X = 0;
export const Y = 1;
export const Z = 2;
export const W = 3;
