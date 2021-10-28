import { SurfaceMeshQuery } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const getQuery = (geometry) => {
  const query = SurfaceMeshQuery(
    toSurfaceMesh(geometry.graph),
    geometry.matrix
  );
  const isInteriorPoint = (x, y, z) =>
    query.isIntersectingPointApproximate(x, y, z);
  const clipSegment = (
    [sourceX = 0, sourceY = 0, sourceZ = 0],
    [targetX = 0, targetY = 0, targetZ = 0]
  ) => {
    const segments = [];
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
    return segments;
  };
  const clipSegments = (segments) => {
    const clipped = [];
    for (const [source, target] of segments) {
      clipped.push(...clipSegment(source, target));
    }
    return clipped;
  };
  const release = () => query.delete();
  return { clipSegment, clipSegments, isInteriorPoint, release };
};
