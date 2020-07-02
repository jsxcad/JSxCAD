import { max, min } from '@jsxcad/math-vec3';

import { eachPoint } from './eachPoint.js';
import { isVoid } from './isNotVoid.js';
import { measureBoundingBox as measureBoundingBoxOfSolid } from '@jsxcad/geometry-solid';
import { measureBoundingBox as measureBoundingBoxOfSurface } from '@jsxcad/geometry-surface';
import { measureBoundingBox as measureBoundingBoxOfZ0Surface } from '@jsxcad/geometry-z0surface';
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
      case 'assembly':
      case 'layers':
      case 'disjointAssembly':
      case 'item':
      case 'plan':
        return descend();
      case 'layout':
        return update(geometry.marks);
      case 'solid':
        return update(measureBoundingBoxOfSolid(geometry.solid));
      case 'surface':
        return update(measureBoundingBoxOfSurface(geometry.surface));
      case 'z0Surface':
        return update(measureBoundingBoxOfZ0Surface(geometry.z0Surface));
      case 'points':
      case 'paths':
        return update(measureBoundingBoxGeneric(geometry));
      default:
        throw Error(`Unknown geometry: ${geometry.type}`);
    }
  };

  visit(toKeptGeometry(geometry), op);

  return [minPoint, maxPoint];
};
