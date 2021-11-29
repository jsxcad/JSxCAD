import { identityMatrix } from '@jsxcad/math-mat4';
import { isNotVoid } from './isNotVoid.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
import { toTriangles as toTrianglesFromGraph } from '../graph/toTriangles.js';
import { transform } from '@jsxcad/math-vec3';
import { visit } from './visit.js';

export const toTriangleArray = (geometry) => {
  const triangles = [];
  const op = (geometry, descend) => {
    const { matrix = identityMatrix, tags, type } = geometry;
    const transformTriangles = (triangles) =>
      triangles.map((triangle) =>
        triangle.map((point) => transform(matrix, point))
      );
    switch (type) {
      case 'graph': {
        if (isNotVoid(geometry)) {
          triangles.push(
            ...transformTriangles(
              toTrianglesFromGraph({ tags }, geometry).triangles
            )
          );
        }
        break;
      }
      case 'triangles': {
        if (isNotVoid(geometry)) {
          triangles.push(...transformTriangles(geometry.triangles));
        }
        break;
      }
      case 'points':
      case 'paths':
      case 'segments':
        break;
      case 'layout':
      case 'plan':
      case 'item':
      case 'sketch':
      case 'group': {
        return descend();
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  visit(toConcreteGeometry(geometry), op);

  return triangles;
};
