import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { smooth as smoothGeometry } from '@jsxcad/geometry';

export const smooth = Shape.registerMethod(
  'smooth',
  (...args) =>
    async (shape) => {
      const {
        number: resolution = 1,
        object: options = {},
        shapesAndFunctions: selections,
      } = destructure(args);
      const {
        iterations = 1,
        time = 1,
        remeshIterations = 1,
        remeshRelaxationSteps = 1,
      } = options;
      return Shape.fromGeometry(
        smoothGeometry(
          await shape.toGeometry(),
          await shape.toShapesGeometries(selections),
          resolution,
          iterations,
          time,
          remeshIterations,
          remeshRelaxationSteps
        )
      );
    }
);
