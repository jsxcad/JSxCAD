import Shape from './Shape.js';
import { remesh as remeshGeometry } from '@jsxcad/geometry';

export const remesh = Shape.registerMethod('remesh', (...args) => async (shape) => {
  const {
    number: resolution = 1,
    shapesAndFunctions: selections,
    object: options,
  } = Shape.destructure(args);
  const {
    iterations = 1,
    relaxationSteps = 1,
    targetEdgeLength = resolution,
  } = options;
  return Shape.fromGeometry(
    remeshGeometry(
      await shape.toGeometry(),
      await shape.toShapesGeometries(selections),
      iterations,
      relaxationSteps,
      targetEdgeLength
    )
  );
});
