import Shape from './Shape.js';
import { taggedSketch } from '@jsxcad/geometry';

export const sketch = Shape.registerMethod2(
  'sketch',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(taggedSketch({}, geometry))
);
