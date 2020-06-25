import { buildRegularIcosahedron } from './buildRegularIcosahedron';
import { subdivideTriangularMesh } from './subdivideTriangularMesh';
import { unit } from '@jsxcad/math-vec3';

/**
 *
 * Builds a sphere with at least the number of faces requested, and less than
 *   four times the number of faces requested.
 */
export const buildGeodesicSphere = ({ faces = 20 }) => {
  let mesh = buildRegularIcosahedron({});
  while (mesh.length < faces) {
    mesh = subdivideTriangularMesh(mesh);
  }
  return mesh.map((triangle) => triangle.map(unit));
};
