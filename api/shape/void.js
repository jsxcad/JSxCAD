import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry';

export const voidFn = () => (shape) =>
  Shape.fromGeometry(
    rewriteTags(['type:void'], [], shape.toGeometry())
  );

Shape.registerMethod('void', voidFn);
