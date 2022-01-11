import Shape from './Shape.js';
import { simplify as simplifyGeometry } from '@jsxcad/geometry';

export const simplify =
  (options = {}, ...selections) =>
  (shape) =>
    Shape.fromGeometry(
      simplifyGeometry(
        shape.toGeometry(),
        options,
        shape.toShapes(selections).map((selection) => selection.toGeometry())
      )
    );

Shape.registerMethod('simplify', simplify);
