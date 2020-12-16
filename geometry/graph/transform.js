import {
  fromApproximateToTransform,
  fromExactToTransform,
  transformSurfaceMeshByTransform,
} from '@jsxcad/algorithm-cgal';

import { fromSurfaceMeshLazy } from './fromSurfaceMeshLazy.js';
import { toSurfaceMesh } from './toSurfaceMesh.js';
import { transformSymbol } from './symbols.js';

export const transform = (matrix, graph) => {
  let transform = matrix[transformSymbol];
  if (transform === undefined) {
    if (matrix.length > 16) {
      transform = fromExactToTransform(...matrix.slice(16));
    } else {
      const [
        m00,
        m10,
        m20,
        ,
        m01,
        m11,
        m21,
        ,
        m02,
        m12,
        m22,
        ,
        m03,
        m13,
        m23,
        hw,
      ] = matrix;
      transform = fromApproximateToTransform(
        m00,
        m01,
        m02,
        m03,
        m10,
        m11,
        m12,
        m13,
        m20,
        m21,
        m22,
        m23,
        hw
      );
    }
    matrix[transformSymbol] = transform;
  }
  return fromSurfaceMeshLazy(
    transformSurfaceMeshByTransform(toSurfaceMesh(graph), transform)
  );
};
