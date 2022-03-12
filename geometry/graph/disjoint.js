import {
  deletePendingSurfaceMeshes,
  disjoint as disjointCgal,
} from '@jsxcad/algorithm-cgal';

export const disjoint = (geometries) => {
  if (geometries.length < 2) {
    return geometries;
  }
  const results = disjointCgal(geometries);
  deletePendingSurfaceMeshes();
  return results;
};
