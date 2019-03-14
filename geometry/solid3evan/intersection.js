import { CSG, Polygon, Vertex, Vector3D } from './csg/csg';

const toOldPoly = (polygon) => new Polygon(polygon.map(point => new Vertex(new Vector3D(point[0], point[1], point[2]),
                                                                           new Vector3D(0, 0, 0))));
const fromOldPoly = (polygon) => polygon.vertices.map(vertex => [vertex.pos.x, vertex.pos.y, vertex.pos.z]);

/**
   * Return a new Geom3 solid representing space in both this solid and
   * in the given solids.
   * Immutable: Neither this solid nor the given solids are modified.
   * @param {Geom3[]} geometry - list of Geom3 objects
   * @returns {Geom3} new Geom3 object
   * @example
   * let C = A.intersect(B)
   * @example
   * +-------+
   * |       |
   * |   A   |
   * |    +--+----+   =   +--+
   * +----+--+    |       +--+
   *      |   B   |
   *      |       |
   *      +-------+
   */
export const intersection = (...surfaces) => {
  const csgs = surfaces.map(surface => CSG.fromPolygons(surface.map(toOldPoly)));
  let a = csgs.shift();
  while (csgs.length > 0) {
    const b = csgs.shift();
    a = a.intersect(b);
  }
  return a.toPolygons().map(fromOldPoly);
};
