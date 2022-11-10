import Shape from './Shape.js';
import { remesh as remeshGeometry } from '@jsxcad/geometry';

export const remesh = Shape.registerMethod('remesh', (...args) => (shape) => {
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
      shape.toGeometry(),
      shape.toShapes(selections).map((selection) => selection.toGeometry()),
      iterations,
      relaxationSteps,
      targetEdgeLength
    )
  );
});
