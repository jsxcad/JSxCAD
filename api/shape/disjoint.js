import { Shape, fromGeometry } from './Shape.js';
import { destructure } from './destructure.js';
import { disjoint as disjointGeometry } from '@jsxcad/geometry';

export const disjoint = Shape.registerMethod(
  'disjoint',
  (...args) =>
    async (shape) => {
      const { strings: modes } = destructure(args);
      return fromGeometry(
        disjointGeometry(
          [await shape.toGeometry()],
          modes.includes('backward') ? 0 : 1,
          modes.includes('exact')
        )
      );
    }
);
