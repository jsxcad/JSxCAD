import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { disjoint } from '@jsxcad/geometry';

export const fit = Shape.registerMethod('fit', (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return async (shape) =>
    Shape.fromGeometry(
      disjoint(
        [...(await shape.toShapesGeometries(shapes)), await shape.toGeometry()],
        undefined,
        modes.includes('exact')
      )
    );
});
