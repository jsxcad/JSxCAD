import { identity } from '@jsxcad/algorithm-cgal';
import { isTypeGhost } from './type.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
import { toTriangles as toTrianglesFromGraph } from './toTriangles.js';
import { transformCoordinate } from '../transform.js';
import { visit } from './visit.js';

export const toTriangleArray = (geometry) => {
  const triangles = [];
  const op = (geometry, descend) => {
    if (isTypeGhost(geometry)) {
      return;
    }
    const { matrix = identity(), tags, type } = geometry;
    const transformTriangles = (triangles) =>
      triangles.map((triangle) =>
        triangle.map((point) => transformCoordinate(point, matrix))
      );
    switch (type) {
      case 'graph': {
        triangles.push(
          ...transformTriangles(
            toTrianglesFromGraph({ tags }, geometry).triangles
          )
        );
        break;
      }
      case 'triangles': {
        triangles.push(...transformTriangles(geometry.triangles));
        break;
      }
      case 'polygonsWithHoles':
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
