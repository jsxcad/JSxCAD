import Shape from './Shape.js';
import { deform as deformGeometry } from '@jsxcad/geometry';
import { identityMatrix } from '@jsxcad/math-mat4';

export const deform =
  (entries, { iterations, tolerance, alpha } = {}) =>
  (shape) =>
    Shape.fromGeometry(
      deformGeometry(
        shape.toGeometry(),
        entries.map(({ selection, deformation }) => ({
          selection: selection.toGeometry(),
          deformation: deformation
            ? deformation.toGeometry().matrix
            : identityMatrix,
        })),
        iterations,
        tolerance,
        alpha
      )
    );

Shape.registerMethod('deform', deform);
