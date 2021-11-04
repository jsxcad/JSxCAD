import { fromSurfaceMeshToPolygonsWithHoles } from '@jsxcad/algorithm-cgal';
import { taggedGroup } from '../tagged/taggedGroup.js';
import { taggedPolygonsWithHoles } from '../tagged/taggedPolygonsWithHoles.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const faces = (geometry) => {
  const faces = [];
  for (const {
    plane,
    exactPlane,
    polygonsWithHoles,
  } of fromSurfaceMeshToPolygonsWithHoles(
    toSurfaceMesh(geometry.graph),
    geometry.matrix
  )) {
    faces.push(
      taggedPolygonsWithHoles(
        { tags: geometry.tags, plane, exactPlane },
        polygonsWithHoles
      )
    );
  }
  return taggedGroup({}, ...faces);
};
