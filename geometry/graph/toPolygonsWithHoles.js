import { fromSurfaceMeshToPolygonsWithHoles } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const toPolygonsWithHoles = (geometry) => {
  if (geometry.graph === undefined) {
    throw Error('geometry graph undefined');
  }
  const mesh = toSurfaceMesh(geometry.graph);
  const polygonsWithHoles = fromSurfaceMeshToPolygonsWithHoles(
    mesh,
    geometry.matrix
  );
  return polygonsWithHoles;
};
