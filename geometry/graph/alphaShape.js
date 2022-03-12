import {
  fromPointsToAlphaShapeAsSurfaceMesh,
  fromSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const alphaShape = ({ tags }, points, componentLimit) =>
  taggedGraph(
    { tags },
    fromSurfaceMesh(fromPointsToAlphaShapeAsSurfaceMesh(points, componentLimit))
  );
