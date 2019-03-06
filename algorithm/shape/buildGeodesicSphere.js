const buildRegularIcosahedron = require('./buildRegularIcosahedron');
const subdivideTriangularMesh = require('./subdivideTriangularMesh');
const vec3 = require('@jsxcad/math-vec3');

/**
 *
 * Builds a sphere with at least the number of faces requested, and less than
 *   four times the number of faces requested.
 */
const buildGeodesicSphere = ({ faces = 20 }) => {
  let mesh = buildRegularIcosahedron({});
  while (mesh.length < faces) {
    mesh = subdivideTriangularMesh(mesh);
  }
  return mesh.map(triangle => triangle.map(vec3.unit));
};

module.exports = buildGeodesicSphere;
