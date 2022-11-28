import { Shape } from './Shape.js';
import { destructure } from './destructure.js';
import { outline as outlineGeometry } from '@jsxcad/geometry';

export const outline = Shape.registerMethod(
  'outline',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions: selections } = destructure(args);
      return Shape.fromGeometry(
        outlineGeometry(
          await shape.toGeometry(),
          await shape.toShapesGeometries(selections)
        )
      );
    }
);
