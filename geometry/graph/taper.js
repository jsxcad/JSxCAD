import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';
import { taperSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { toSurfaceMesh } from './toSurfaceMesh.js';

export const taper = (
  geometry,
  xPlusFactor,
  xMinusFactor,
  yPlusFactor,
  yMinusFactor,
  zPlusFactor,
  zMinusFactor
) =>
  taggedGraph(
    { tags: geometry.tags },
    fromSurfaceMeshLazy(
      taperSurfaceMesh(
        toSurfaceMesh(geometry.graph),
        geometry.matrix,
        xPlusFactor,
        xMinusFactor,
        yPlusFactor,
        yMinusFactor,
        zPlusFactor,
        zMinusFactor
      )
    )
  );
