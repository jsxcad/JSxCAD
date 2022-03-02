import Shape from './Shape.js';
import { remesh as remeshGeometry } from '@jsxcad/geometry';

export const remesh =
  (...args) =>
  (shape) => {
    const {
      number: resolution = 1,
      shapesAndFunctions: selections,
      object: options,
    } = Shape.destructure(args);
    return Shape.fromGeometry(
      remeshGeometry(
        shape.toGeometry(),
        resolution,
        options,
        shape.toShapes(selections).map((selection) => selection.toGeometry())
      )
    );
  };

Shape.registerMethod('remesh', remesh);
