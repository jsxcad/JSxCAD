import Shape from './Shape.js';
import { minkowskiShell as minkowskiShellOfGeometry } from '@jsxcad/geometry-tagged';

export const minkowskiShell = (shape, offset) =>
  Shape.fromGeometry(
    minkowskiShellOfGeometry(shape.toGeometry(), offset.toGeometry())
  );

const minkowskiShellMethod = function (offset) {
  return minkowskiShell(this, offset);
};

Shape.registerMethod('minkowskiShell', minkowskiShellMethod);
