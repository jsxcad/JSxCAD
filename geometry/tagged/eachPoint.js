import { eachPoint as eachPointOfPaths } from '../paths/eachPoint.js';
import { eachPoint as eachPointOfPoints } from '../points/eachPoint.js';
import { eachPoint as graph } from '../graph/eachPoint.js';
import { op } from './op.js';
import { transform } from '@jsxcad/math-vec3';
import { visit } from './visit.js';

const paths = (geometry, emit) => eachPointOfPaths(emit, geometry.paths);

const points = (geometry, emit) => eachPointOfPoints(emit, geometry.points);

const polygonsWithHoles = (geometry, emit) => {
  for (const { points, holes } of geometry.polygonsWithHoles) {
    for (const point of points) {
      emit(transform(geometry.matrix, point));
    }
    for (const { points } of holes) {
      for (const point of points) {
        emit(transform(geometry.matrix, point));
      }
    }
  }
};

const segments = (geometry, emit) => {
  for (const [start, end] of geometry.segments) {
    emit(start);
    emit(end);
  }
};

export const eachPoint = op(
  { graph, paths, points, polygonsWithHoles, segments },
  visit
);
