import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const stitch = (graph) =>
  fromSurfaceMeshLazy(toSurfaceMesh(graph), /* forceNewGraph= */ true);
