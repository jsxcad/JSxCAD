import { SurfaceMeshQuery } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';
import { visit } from '../tagged/visit.js';

const collect = (geometry, out) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'graph':
        out.push(geometry);
        break;
    }
    descend();
  };
  visit(geometry, op);
};

export const getQuery = (geometry) => {
  const graphGeometries = [];
  collect(geometry, graphGeometries);

  const queries = graphGeometries.map((graphGeometry) =>
    SurfaceMeshQuery(toSurfaceMesh(graphGeometry.graph), graphGeometry.matrix)
  );

  const isInteriorPoint = (x = 0, y = 0, z = 0) => {
    for (const query of queries) {
      if (query.isIntersectingPointApproximate(x, y, z)) {
        return true;
      }
    }
    return false;
  };
  const clipSegment = (
    [sourceX = 0, sourceY = 0, sourceZ = 0],
    [targetX = 0, targetY = 0, targetZ = 0]
  ) => {
    const segments = [];
    for (const query of queries) {
      query.clipSegmentApproximate(
        sourceX,
        sourceY,
        sourceZ,
        targetX,
        targetY,
        targetZ,
        (sourceX, sourceY, sourceZ, targetX, targetY, targetZ) =>
          segments.push([
            [sourceX, sourceY, sourceZ],
            [targetX, targetY, targetZ],
          ])
      );
    }
    return segments;
  };
  const clipSegments = (segments) => {
    const clipped = [];
    for (const [source, target] of segments) {
      clipped.push(...clipSegment(source, target));
    }
    return clipped;
  };
  const release = () => {
    for (const query of queries) {
      query.delete();
    }
  };
  return { clipSegment, clipSegments, isInteriorPoint, release };
};
