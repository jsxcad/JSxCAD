import Shape from './Shape.js';
import { remesh as remeshGeometry } from '@jsxcad/geometry';

export const remesh =
  (options, ...selections) =>
  (shape) =>
    Shape.fromGeometry(
      remeshGeometry(
        shape.toGeometry(),
        options,
        shape.toShapes(selections).map((selection) => selection.toGeometry())
      )
    );

Shape.registerMethod('remesh', remesh);
