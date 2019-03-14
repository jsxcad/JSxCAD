import { CSG, Polygon, Vertex, Vector3D } from './csg/csg';

const toOldPoly = (polygon) => new Polygon(polygon.map(point => new Vertex(new Vector3D(point[0], point[1], point[2]),
                                                                           new Vector3D(0, 0, 0))));
const fromOldPoly = (polygon) => polygon.vertices.map(vertex => [vertex.pos.x, vertex.pos.y, vertex.pos.z]);

export const union = (...surfaces) => {
  const csgs = surfaces.map(surface => CSG.fromPolygons(surface.map(toOldPoly)));
  while (csgs.length > 1) {
    const a = csgs.shift();
    const b = csgs.shift();
    csgs.push(a.union(b));
  }
  return csgs[0].toPolygons().map(fromOldPoly);
};
