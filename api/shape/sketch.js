import Shape from './Shape.js';
import { taggedSketch } from '@jsxcad/geometry';

export const sketch = Shape.chainable(
  () => (shape) => Shape.fromGeometry(taggedSketch({}, shape.toGeometry()))
);

Shape.registerMethod('sketch', sketch);
