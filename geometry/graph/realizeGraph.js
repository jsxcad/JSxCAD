import { fromSurfaceMesh } from './fromSurfaceMesh.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const realizeGraph = (geometry) => {
  if (geometry.graph.isLazy) {
    return {
      ...geometry,
      graph: fromSurfaceMesh(toSurfaceMesh(geometry.graph)),
    };
  } else {
    return geometry;
  }
};
