import Shape from './Shape.js';
import { minkowskiShell as minkowskiShellOfGeometry } from '@jsxcad/geometry';

export const minkowskiShell = (shape, offset) =>
  Shape.fromGeometry(
    minkowskiShellOfGeometry(shape.toGeometry(), offset.toGeometry())
  );

Shape.registerMethod('minkowskiShell', minkowskiShell);
