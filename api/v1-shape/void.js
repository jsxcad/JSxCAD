import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry';

export const voidFn = (shape) =>
  Shape.fromGeometry(
    rewriteTags(['compose/non-positive'], [], shape.toGeometry())
  );

Shape.registerMethod('void', voidFn);
