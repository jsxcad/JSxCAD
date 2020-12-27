import { fromFunctionToSurfaceMesh } from '@jsxcad/algorithm-cgal';
import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';

export const fromFunction = (op, options) =>
  fromSurfaceMeshLazy(
    fromFunctionToSurfaceMesh((x = 0, y = 0, z = 0) => op([x, y, z]), options)
  );
