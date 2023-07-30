import Shape from './Shape.js';
import { taggedSketch } from '@jsxcad/geometry';

export const sketch = Shape.registerMethod3(
  'sketch',
  ['inputGeometry'],
  (geometry) => taggedSketch({}, geometry)
);
