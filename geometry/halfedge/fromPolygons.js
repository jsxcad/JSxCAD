import fromSurface from './fromSurface.js';

/**
 * fromPolygons
 *
 * @function
 * @param {Polygons} polygons
 * @param {Normalizer} normalize
 * @returns {Loops}
 */
export const fromPolygons = (polygons, normalize) =>
  fromSurface(polygons, normalize);

export default fromPolygons;
