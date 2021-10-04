import { computeCentroidOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedPoints } from '../tagged/taggedPoints.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const computeCentroid = (geometry) => {
  const approximate = [];
  const exact = [];
  computeCentroidOfSurfaceMesh(
    toSurfaceMesh(geometry.graph),
    geometry.matrix,
    approximate,
    exact
  );
  return taggedPoints({ tags: geometry.tags }, [approximate], [exact]);
};
