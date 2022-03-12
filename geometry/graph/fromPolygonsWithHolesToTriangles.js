import { arrangePaths } from '@jsxcad/algorithm-cgal';

export const fromPolygonsWithHolesToTriangles = (geometry) => {
  const triangles = [];
  for (const polygonWithHoles of geometry.polygonsWithHoles) {
    const paths = [polygonWithHoles, ...polygonWithHoles.holes];
    triangles.push(
      ...arrangePaths(
        geometry.plane,
        geometry.exactPlane,
        paths,
        /* triangulate= */ true
      )
    );
  }
  return triangles;
};
