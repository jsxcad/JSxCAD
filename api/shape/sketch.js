import Shape from './Shape.js';
import { taggedSketch } from '@jsxcad/geometry';

export const sketch = Shape.registerMethod(
  'sketch',
  () => (shape) => Shape.fromGeometry(taggedSketch({}, shape.toGeometry()))
);
