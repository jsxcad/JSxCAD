import { arrangePaths } from '@jsxcad/algorithm-cgal';

export const fromPolygonsWithHolesToTriangles = (polygonsWithHoles) => {
  const triangles = [];
  for (const polygonWithHoles of polygonsWithHoles) {
    const paths = [polygonWithHoles, ...polygonWithHoles.holes];
    triangles.push(
      ...arrangePaths(
        polygonWithHoles.plane,
        polygonWithHoles.exactPlane,
        paths,
        /* triangulate= */ true
      )
    );
  }
  return triangles;
};
