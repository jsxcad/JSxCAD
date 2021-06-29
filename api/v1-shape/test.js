import Shape from './Shape.js';

import { test as testGeometry } from '@jsxcad/geometry';

export const test = (md) => (shape) => {
  if (md) {
    shape.md(md);
  }
  testGeometry(shape.toGeometry());
  return shape;
};

Shape.registerMethod('test', test);
