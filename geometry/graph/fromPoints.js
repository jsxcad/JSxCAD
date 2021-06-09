import { fromPointsToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromPoints = ({ tags }, points) =>
  taggedGraph({ tags }, fromSurfaceMeshLazy(fromPointsToSurfaceMesh(points)));
