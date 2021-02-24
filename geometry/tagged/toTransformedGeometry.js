import { composeTransforms } from '@jsxcad/algorithm-cgal';
import { identityMatrix } from '@jsxcad/math-mat4';
import { rewrite } from './visit.js';
import { transform as transformGraph } from '@jsxcad/geometry-graph';
import { transform as transformPaths } from '@jsxcad/geometry-paths';
import { transform as transformPoints } from '@jsxcad/geometry-points';
import { transform as transformPolygons } from '@jsxcad/geometry-polygons';

const transformedGeometry = Symbol('transformedGeometry');

export const clearTransformedGeometry = (geometry) => {
  delete geometry[transformedGeometry];
  return geometry;
};

export const toTransformedGeometry = (geometry) => {
  if (geometry[transformedGeometry] === undefined) {
    const op = (geometry, descend, walk, matrix) => {
      switch (geometry.type) {
        case 'transform':
          // Preserve any tags applied to the untransformed geometry.
          // FIX: Ensure tags are merged between transformed and untransformed upon resolution.
          return walk(
            geometry.content[0],
            composeTransforms(matrix, geometry.matrix)
          );
        case 'assembly':
        case 'layout':
        case 'layers':
        case 'item':
        case 'sketch':
          return descend(undefined, matrix);
        case 'disjointAssembly':
          if (matrix === identityMatrix) {
            // A disjointAssembly does not contain any untransformed geometry.
            // There is no transform, so we can stop here.
            return geometry;
          } else {
            return descend(undefined, matrix);
          }
        case 'plan': {
          const composedMatrix = composeTransforms(
            matrix,
            geometry.plan.matrix || identityMatrix
          );
          return descend(
            {
              ...geometry,
              plan: {
                ...geometry.plan,
                matrix: composedMatrix,
              },
            },
            composedMatrix
          );
        }
        case 'triangles':
          return descend({
            triangles: transformPolygons(matrix, geometry.triangles),
          });
        case 'paths':
          return descend({ paths: transformPaths(matrix, geometry.paths) });
        case 'points':
          return descend({ points: transformPoints(matrix, geometry.points) });
        case 'graph':
          return descend({ graph: transformGraph(matrix, geometry.graph) });
        default:
          throw Error(
            `Unexpected geometry ${geometry.type} see ${JSON.stringify(
              geometry
            )}`
          );
      }
    };
    geometry[transformedGeometry] = rewrite(geometry, op, identityMatrix);
  }
  return geometry[transformedGeometry];
};
