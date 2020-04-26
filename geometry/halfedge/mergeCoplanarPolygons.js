import fromPolygons from './fromPolygons';
import merge from './merge';
import toPolygons from './toPolygons';

export const mergeCoplanarPolygons = (polygons, normalize, noIslands = false) => toPolygons(merge(fromPolygons(polygons, normalize), noIslands));

export default mergeCoplanarPolygons;
