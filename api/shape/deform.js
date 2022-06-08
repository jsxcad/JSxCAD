import Point from './Point.js';
import Shape from './Shape.js';
import { deform as deformGeometry } from '@jsxcad/geometry';

export const deform = Shape.chainable(
  (entries = [], { iterations, tolerance, alpha } = {}) =>
    (shape) =>
      Shape.fromGeometry(
        deformGeometry(
          shape.toGeometry(),
          entries.map(({ selection, deformation }) => ({
            selection: selection.toGeometry(),
            deformation: deformation
              ? deformation.toGeometry()
              : Point().toGeometry(),
          })),
          iterations,
          tolerance,
          alpha
        )
      )
);

Shape.registerMethod('deform', deform);
