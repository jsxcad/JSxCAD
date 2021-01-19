import Shape from './Shape.js';

import { test as testGeometry } from '@jsxcad/geometry-tagged';

export const test = (shape, md) => {
  if (md) {
    shape.md(md);
  }
  testGeometry(shape.toGeometry());
  return shape;
};

const testMethod = function (md) {
  return test(this, md);
};

Shape.prototype.test = testMethod;
