import { fromFunctionToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromFunction = ({ tags }, op, options) =>
  taggedGraph(
    { tags },
    fromSurfaceMeshLazy(
      fromFunctionToSurfaceMesh((x = 0, y = 0, z = 0) => op([x, y, z]), options)
    )
  );
