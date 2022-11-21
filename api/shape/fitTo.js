import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { disjoint } from '@jsxcad/geometry';

export const fitTo = Shape.registerMethod('fitTo', (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return async (shape) =>
    Shape.fromGeometry(
      disjoint(
        [await shape.toGeometry(), ...(await shape.toShapesGeometries(shapes))],
        undefined,
        modes.includes('exact')
      )
    );
});
