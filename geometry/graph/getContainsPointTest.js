import { SurfaceMeshQuery } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const getContainsPointTest = (geometry) => {
  const query = SurfaceMeshQuery(
    toSurfaceMesh(geometry.graph),
    geometry.matrix
  );
  const op = (x, y, z) => query.isIntersectingPointApproximate(x, y, z);
  const release = () => query.delete();
  return { op, release };
};
