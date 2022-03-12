import {
  fromFunctionToSurfaceMesh,
  fromSurfaceMesh,
} from '@jsxcad/algorithm-cgal';
import { taggedGraph } from '../tagged/taggedGraph.js';

export const fromFunction = ({ tags }, op, options) =>
  taggedGraph(
    { tags },
    fromSurfaceMesh(
      fromFunctionToSurfaceMesh((x = 0, y = 0, z = 0) => op([x, y, z]), options)
    )
  );
