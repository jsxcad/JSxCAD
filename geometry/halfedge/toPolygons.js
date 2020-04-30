import getEdges from './getEdges';
import { pushWhenValid } from '@jsxcad/geometry-polygons';

/**
 * toPolygons
 *
 * @param loops
 */
export const toPolygons = (loops) => {
  const polygons = [];
  for (const loop of loops) {
    const polygon = [];
    for (const edge of getEdges(loop)) {
      if (edge.face !== undefined) {
        polygon.push(edge.start);
      }
    }
    pushWhenValid(polygons, polygon);
  }
  return polygons;
};

export default toPolygons;
