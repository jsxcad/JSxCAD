import { max, min } from '@jsxcad/math-vec3';

import { eachPoint } from './eachPoint.js';
import { isVoid } from './isNotVoid.js';
import { measureBoundingBox as measureBoundingBoxOfGraph } from '../graph/measureBoundingBox.js';
import { measureBoundingBox as measureBoundingBoxOfPoints } from '../points/measureBoundingBox.js';
import { measureBoundingBox as measureBoundingBoxOfPolygons } from '../polygons/measureBoundingBox.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
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
      case 'group':
      case 'item':
      case 'sketch':
      case 'displayGeometry':
        return descend();
      case 'graph':
        return update(measureBoundingBoxOfGraph(geometry));
      case 'layout':
        return update(geometry.marks);
      case 'points':
        return update(measureBoundingBoxOfPoints(geometry.points));
      case 'paths':
        return update(measureBoundingBoxGeneric(geometry));
      case 'triangles':
        return update(measureBoundingBoxOfPolygons(geometry.triangles));
      default:
        throw Error(`Unknown geometry: ${geometry.type}`);
    }
  };

  visit(toConcreteGeometry(geometry), op);

  return [minPoint, maxPoint];
};
