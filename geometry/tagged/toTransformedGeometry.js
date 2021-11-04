import { fromPolygonsWithHoles as fromPolygonsWithHolesToGraph } from '../graph/fromPolygonsWithHoles.js';
import { rewrite } from './visit.js';
import { taggedSegments } from './taggedSegments.js';
import { transform as transformPaths } from '../paths/transform.js';
import { transform as transformPoints } from '../points/ops.js';
import { transform as transformPolygons } from '../polygons/transform.js';
import { transform as transformVec3 } from '@jsxcad/math-vec3';

const transformedGeometry = Symbol('transformedGeometry');

export const clearTransformedGeometry = (geometry) => {
  delete geometry[transformedGeometry];
  return geometry;
};

export const transformSegments = (geometry) => {
  const { matrix, segments } = geometry;
  if (!matrix) {
    return geometry;
  }
  const transformed = [];
  for (const [start, end] of segments) {
    transformed.push([
      transformVec3(matrix, start),
      transformVec3(matrix, end),
    ]);
  }
  return taggedSegments({ tags: geometry.tags }, transformed);
};

export const toTransformedGeometry = (geometry) => {
  if (geometry[transformedGeometry] === undefined) {
    const op = (geometry, descend, walk) => {
      if (geometry.matrix === undefined) {
        return descend();
      }
      switch (geometry.type) {
        // Branch
        case 'layout':
        case 'group':
        case 'item':
        case 'sketch':
        case 'plan':
          return descend();
        // Leaf
        case 'triangles':
          return descend({
            triangles: transformPolygons(geometry.matrix, geometry.triangles),
            matrix: undefined,
          });
        case 'polygonsWithHoles':
          return fromPolygonsWithHolesToGraph(geometry);
        case 'segments':
          return transformSegments(geometry);
        case 'paths':
          return descend({
            paths: transformPaths(geometry.matrix, geometry.paths),
            matrix: undefined,
          });
        case 'points':
          return descend({
            points: transformPoints(geometry.matrix, geometry.points),
            matrix: undefined,
          });
        case 'graph':
          // Graphs don't need a transformed version.
          return geometry;
        default:
          throw Error(
            `Unexpected geometry ${geometry.type} see ${JSON.stringify(
              geometry
            )}`
          );
      }
    };
    geometry[transformedGeometry] = rewrite(geometry, op);
  }
  return geometry[transformedGeometry];
};
