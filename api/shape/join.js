import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { join as joinGeometry } from '@jsxcad/geometry';

export const join = Shape.registerMethod(
  ['add', 'join'],
  (...args) =>
    async (shape) => {
      const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
      return Shape.fromGeometry(
        joinGeometry(
          shape.toGeometry(),
          await shape.toShapesGeometries(shapes),
          modes.includes('exact'),
          modes.includes('noVoid')
        )
      );
    }
);
