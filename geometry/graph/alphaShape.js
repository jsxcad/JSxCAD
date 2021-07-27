import { fromPointsToAlphaShapeAsSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const alphaShape = ({ tags }, points, componentLimit) =>
  taggedGraph(
    { tags },
    fromSurfaceMeshLazy(
      fromPointsToAlphaShapeAsSurfaceMesh(points, componentLimit)
    )
  );
