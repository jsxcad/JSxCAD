import fromPolygons from './fromPolygons';
import merge from './merge';
import toPolygons from './toPolygons';

/**
 * mergeCoplanarPolygons
 *
 * @param polygons
 * @param normalize
 * @param noIslands
 */
export const mergeCoplanarPolygons = (polygons, normalize, noIslands = false) => toPolygons(merge(fromPolygons(polygons, normalize), noIslands));

export default mergeCoplanarPolygons;
