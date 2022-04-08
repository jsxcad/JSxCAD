import { eachPoint as eachPointOfPaths } from '../paths/eachPoint.js';
import { eachPoint as graph } from '../graph/eachPoint.js';
import { op } from './op.js';
import { transform } from '@jsxcad/math-vec3';
import { visit } from './visit.js';

const paths = (geometry, emit) => eachPointOfPaths(emit, geometry.paths);

const points = (geometry, emit) => {
  const { points, matrix } = geometry;
  for (const point of points) {
    emit(transform(matrix, point));
  }
};

const polygonsWithHoles = (geometry, emit) => {
  const { polygonsWithHoles, matrix } = geometry;
  for (const { points, holes } of polygonsWithHoles) {
    for (const point of points) {
      emit(transform(matrix, point));
    }
    for (const { points } of holes) {
      for (const point of points) {
        emit(transform(matrix, point));
      }
    }
  }
};

const segments = ({ segments, matrix }, emit) => {
  for (const [start, end] of segments) {
    emit(transform(matrix, start));
    emit(transform(matrix, end));
  }
};

export const eachPoint = op(
  { graph, paths, points, polygonsWithHoles, segments },
  visit
);
