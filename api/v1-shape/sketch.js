import Shape from './Shape.js';
import { taggedSketch } from '@jsxcad/geometry';

export const sketch = () => (shape) =>
  Shape.fromGeometry(taggedSketch({}, shape.toGeometry()));

Shape.registerMethod('sketch', sketch);
