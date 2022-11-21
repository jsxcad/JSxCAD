import Shape from './Shape.js';
import { taggedSketch } from '@jsxcad/geometry';

export const sketch = Shape.registerMethod(
  'sketch',
  () => async (shape) =>
    Shape.fromGeometry(taggedSketch({}, await shape.toGeometry()))
);
