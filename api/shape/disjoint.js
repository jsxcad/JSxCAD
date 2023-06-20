import Shape from './Shape.js';
import { disjoint as disjointGeometry } from '@jsxcad/geometry';

export const disjoint = Shape.registerMethod2(
  'disjoint',
  ['inputGeometry', 'modes:backward,exact'],
  (geometry, modes) =>
    Shape.fromGeometry(
      disjointGeometry(
        [geometry],
        modes.includes('backward') ? 0 : 1,
        modes.includes('exact')
      )
    )
);
