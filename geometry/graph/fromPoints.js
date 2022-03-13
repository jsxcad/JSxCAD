import {
  fromPointsToSurfaceMesh,
  fromSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromPoints = ({ tags }, points) =>
  taggedGraph({ tags }, fromSurfaceMesh(fromPointsToSurfaceMesh(points)));
