import { extrudeToPlaneOfSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { scale } from '@jsxcad/math-vec3';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';

// FIX: The face needs to be selected with the transform in mind.
export const extrudeToPlane = (
  geometry,
  { high = [], low = [], direction = [0, 0, 1] } = {}
) => {
  if (geometry.graph.isEmpty) {
    return geometry;
  }
  const [highX, highY, highZ] = scale(1, direction);
  const [highA = 0, highB = 0, highC = 0, highD = 0] = high;
  const [lowX, lowY, lowZ] = scale(-1, direction);
  const [lowA = 0, lowB = 0, lowC = 0, lowD = 0] = low;
  return taggedGraph(
    { tags: geometry.tags },
    fromSurfaceMeshLazy(
      extrudeToPlaneOfSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        geometry.matrix,
        high.length > 0,
        highX,
        highY,
        highZ,
        highA,
        highB,
        highC,
        highD,
        low.length > 0,
        lowX,
        lowY,
        lowZ,
        lowA,
        lowB,
        lowC,
        lowD
      )
    )
  );
};
