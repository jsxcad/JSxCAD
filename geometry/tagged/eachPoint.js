import { eachPoint as eachPointOfGraph } from '../graph/eachPoint.js';
import { eachPoint as eachPointOfPaths } from '../paths/eachPoint.js';
import { eachPoint as eachPointOfPoints } from '../points/eachPoint.js';
import { reify } from './reify.js';
import { toTransformedGeometry } from './toTransformedGeometry.js';
import { visit } from './visit.js';

// FIX: Emit exactPoints as well as points.
export const eachPoint = (emit, geometry) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'plan':
        return eachPoint(emit, reify(geometry).content[0]);
      // fallthrough
      case 'group':
      case 'item':
      case 'layout':
        return descend();
      case 'polygonsWithHoles':
        for (const { points, holes } of geometry.polygonsWithHoles) {
          for (const point of points) {
            emit(point);
          }
          for (const { points } of holes) {
            for (const point of points) {
              emit(point);
            }
          }
        }
        return;
      case 'points':
        return eachPointOfPoints(emit, geometry.points);
      case 'segments':
        for (const [start, end] of geometry.segments) {
          emit(start);
          emit(end);
        }
        return;
      case 'paths':
        return eachPointOfPaths(emit, geometry.paths);
      case 'graph':
        return eachPointOfGraph(geometry, emit);
      case 'sketch':
        // Sketches do not contribute points.
        return;
      default:
        throw Error(
          `Unexpected geometry ${geometry.type} ${JSON.stringify(geometry)}`
        );
    }
  };
  visit(toTransformedGeometry(geometry), op);
};
