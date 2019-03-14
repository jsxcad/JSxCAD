import { CSG, Polygon, Vertex, Vector3D } from './csg/csg';

const toOldPoly = (polygon) => new Polygon(polygon.map(point => new Vertex(new Vector3D(point[0], point[1], point[2]),
                                                                           new Vector3D(0, 0, 0))));
const fromOldPoly = (polygon) => polygon.vertices.map(vertex => [vertex.pos.x, vertex.pos.y, vertex.pos.z]);

/**
   * Return a new geom3 representing space in this solid but
   * not in the given solids. Neither this solid nor the given solids are modified.
   * @param {geom3[]} csg - list of geom3 objects
   * @returns {geom3} new geom3 object
   * @example
   * let C = A.subtract(B)
   * @example
   * +-------+            +-------+
   * |       |            |       |
   * |   A   |            |       |
   * |    +--+----+   =   |    +--+
   * +----+--+    |       +----+
   *      |   B   |
   *      |       |
   *      +-------+
   */
export const difference = (...surfaces) => {
  const csgs = surfaces.map(surface => CSG.fromPolygons(surface.map(toOldPoly)));
  let differences = csgs[0];
  for (let i = 1; i < csgs.length; i++) {
    differences = differences.subtract(csgs[i]);
  }
  return differences.toPolygons().map(fromOldPoly);
};
