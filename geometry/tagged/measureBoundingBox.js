import { max, min } from '@jsxcad/math-vec3';

import { eachPoint } from './eachPoint.js';
import { isVoid } from './isNotVoid.js';
import { measureBoundingBox as measureBoundingBoxOfGraph } from '@jsxcad/geometry-graph';
import { measureBoundingBox as measureBoundingBoxOfPoints } from '@jsxcad/geometry-points';
import { measureBoundingBox as measureBoundingBoxOfSolid } from '@jsxcad/geometry-solid';
import { measureBoundingBox as measureBoundingBoxOfSurface } from '@jsxcad/geometry-surface';
import { reify } from './reify.js';
import { toKeptGeometry } from './toKeptGeometry.js';
import { visit } from './visit.js';

const measureBoundingBoxGeneric = (geometry) => {
  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];
  eachPoint((point) => {
    minPoint = min(minPoint, point);
    maxPoint = max(maxPoint, point);
  }, geometry);
  return [minPoint, maxPoint];
};

export const measureBoundingBox = (geometry) => {
  let minPoint = [Infinity, Infinity, Infinity];
  let maxPoint = [-Infinity, -Infinity, -Infinity];

  const update = ([itemMinPoint, itemMaxPoint]) => {
    minPoint = min(minPoint, itemMinPoint);
    maxPoint = max(maxPoint, itemMaxPoint);
  };

  const op = (geometry, descend) => {
    if (isVoid(geometry)) {
      return;
    }
    switch (geometry.type) {
      case 'plan':
      case 'assembly':
      case 'layers':
      case 'disjointAssembly':
      case 'item':
      case 'sketch':
        return descend();
      case 'graph':
        return update(measureBoundingBoxOfGraph(geometry.graph));
      case 'layout':
        return update(geometry.marks);
      case 'solid':
        return update(measureBoundingBoxOfSolid(geometry.solid));
      case 'surface':
        return update(measureBoundingBoxOfSurface(geometry.surface));
      case 'points':
        return update(measureBoundingBoxOfPoints(geometry.points));
      case 'paths':
        return update(measureBoundingBoxGeneric(geometry));
      default:
        throw Error(`Unknown geometry: ${geometry.type}`);
    }
  };

  visit(toKeptGeometry(reify(geometry)), op);

  return [minPoint, maxPoint];
};
