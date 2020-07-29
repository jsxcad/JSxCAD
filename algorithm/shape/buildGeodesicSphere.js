import { buildRegularIcosahedron } from './buildRegularIcosahedron.js';
import { subdivideTriangularMesh } from './subdivideTriangularMesh.js';
import { unit } from '@jsxcad/math-vec3';

/**
 *
 * Builds a sphere with at least the number of faces requested, and less than
 *   four times the number of faces requested.
 * @type {function(faces:number):Triangle[]}
 */
export const buildGeodesicSphere = (faces = 20) => {
  /** @type {Triangle[]} */
  let mesh = buildRegularIcosahedron({});
  while (mesh.length < faces) {
    mesh = subdivideTriangularMesh(mesh);
  }
  return mesh.map((triangle) => triangle.map(unit));
};
