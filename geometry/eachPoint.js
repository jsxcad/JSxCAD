import { Group } from './Group.js';
import { Point } from './Point.js';
import { eachPoint as eachPointWithCgal } from '@jsxcad/algorithm-cgal';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { translate } from './translate.js';

const filter = (geometry) =>
  ['graph', 'polygonsWithHoles', 'segments', 'points'].includes(
    geometry.type
  ) && isNotTypeGhost(geometry);

export const emitEachCoordinate = (geometry, emit) => {
  const inputs = linearize(geometry, filter);
  eachPointWithCgal(inputs, emit);
};

export const toCoordinates = (geometry) => {
  const coordinates = [];
  emitEachCoordinate(geometry, (coordinate) => coordinates.push(coordinate));
  return coordinates;
};

export const toPoints = (geometry) => {
  const points = [];
  emitEachCoordinate(geometry, (coordinate) =>
    points.push(translate(Point(), coordinate))
  );
  return Group(points);
};

export const toPointList = (geometry) => {
  const points = [];
  emitEachCoordinate(geometry, (coordinate) =>
    points.push(translate(Point(), coordinate))
  );
  return points;
};
