import { computeNormalOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { taggedPoints } from '../tagged/taggedPoints.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const computeNormal = (geometry) => {
  const approximate = [];
  const exact = [];
  computeNormalOfSurfaceMesh(
    toSurfaceMesh(geometry.graph),
    geometry.matrix,
    approximate,
    exact
  );
  return taggedPoints({ tags: geometry.tags }, [approximate], [exact]);
};
