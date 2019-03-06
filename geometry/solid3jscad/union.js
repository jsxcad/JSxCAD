const CSG = require('./src/CSG');
const Polygon = require('./src/math/Polygon3');
const Vertex = require('./src/math/Vertex3');
const Vector3D = require('./src/math/Vector3');
const toPolygons = require('./toPolygons');
const fromPolygons = require('./fromPolygons');

const toOldPoly = (polygon) => new Polygon(polygon.map(point => new Vertex(new Vector3D(point[0], point[1], point[2]),
                                                                           new Vector3D(0, 0, 0))));
const fromOldPoly = (polygon) => polygon.vertices.map(vertex => [vertex.pos.x, vertex.pos.y, vertex.pos.z]);

const union = (...geometries) => {
  switch (geometries.length) {
    case 0: return fromPolygons({}, []);
    case 1: return geometries[0];
    default: {
      const csgs = geometries.map(geometry => CSG.fromPolygons(toPolygons({}, geometry).map(toOldPoly)));
      while (csgs.length > 1) {
        const a = csgs.shift();
        const b = csgs.shift();
        csgs.push(a.union(b));
      }
      return fromPolygons({}, csgs[0].toPolygons().map(fromOldPoly));
    }
  }
};

module.exports = union;
