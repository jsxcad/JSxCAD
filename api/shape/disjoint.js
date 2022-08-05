import { Shape, fromGeometry } from './Shape.js';
import { destructure } from './destructure.js';
import { disjoint as disjointGeometry } from '@jsxcad/geometry';

export const disjoint = Shape.chainable((...args) => (shape) => {
  const { strings: modes } = destructure(args);
  return fromGeometry(
    disjointGeometry(
      [shape.toGeometry()],
      modes.includes('backward') ? 0 : 1,
      modes.includes('exact')
    )
  );
});

Shape.registerMethod('disjoint', disjoint);
