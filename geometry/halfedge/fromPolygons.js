import fromSurface from './fromSurface';

/**
 * fromPolygons
 *
 * @param polygons
 * @param normalize
 */
export const fromPolygons = (polygons, normalize) => fromSurface(polygons, normalize);

export default fromPolygons;
