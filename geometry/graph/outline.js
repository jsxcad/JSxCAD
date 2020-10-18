import { eachFace, eachFaceEdge, getPointNode } from './graph.js';

import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { outlineOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const outline = (graph) => {
  const paths = [];
  const outline = fromSurfaceMesh(outlineOfSurfaceMesh(toSurfaceMesh(graph)));
  eachFace(outline, (face) => {
    const path = [];
    eachFaceEdge(outline, face, (edge, { point }) => {
      path.push(getPointNode(outline, point));
    });
    paths.push(path);
  });
  return paths;
};
