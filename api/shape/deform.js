import Shape from './Shape.js';
import { deform as deformGeometry } from '@jsxcad/geometry';
import { destructure } from './destructure.js';

export const deform = Shape.registerMethod(
  'deform',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions: selections, object: options } =
        destructure(args);
      const { iterations, tolerance, alpha } = options;
      return Shape.fromGeometry(
        deformGeometry(
          await shape.toGeometry(),
          await shape.toShapesGeometries(selections),
          iterations,
          tolerance,
          alpha
        )
      );
    }
);
