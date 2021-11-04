import { getQuery as getQueryForGraph } from '../graph/getQuery.js';
import { toConcreteGeometry } from './toConcreteGeometry.js';
import { visit } from './visit.js';

export const withQuery = (geometry, thunk) => {
  const queries = [];
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        queries.push(getQueryForGraph(geometry));
        return;
      default:
        descend();
    }
  };
  visit(toConcreteGeometry(geometry), op);
  const clipSegment = (source, target) => {
    const clippedSegments = [];
    for (const query of queries) {
      if (query.clipSegment) {
        clippedSegments.push(...query.clipSegment(source, target));
      }
    }
    return clippedSegments;
  };
  const clipSegments = (segments) => {
    const clippedSegments = [];
    for (const query of queries) {
      if (query.clipSegments) {
        clippedSegments.push(...query.clipSegments(segments));
      }
    }
    return clippedSegments;
  };
  const isInteriorPoint = (x = 0, y = 0, z = 0) => {
    for (const query of queries) {
      if (query.isInteriorPoint && query.isInteriorPoint(x, y, z)) {
        return true;
      }
    }
    return false;
  };
  thunk({ clipSegment, clipSegments, isInteriorPoint });
  for (const query of queries) {
    query.release();
  }
};
