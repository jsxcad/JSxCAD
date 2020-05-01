import { Loops, Normalizer, Polygons } from './types';

import fromSurface from './fromSurface';

/**
 * fromPolygons
 *
 * @param {Polygons} polygons
 * @param {Normalizer} normalize
 * @returns {Loops}
 */
export const fromPolygons = (polygons, normalize) => fromSurface(polygons, normalize);

export default fromPolygons;
