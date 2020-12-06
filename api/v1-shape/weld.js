import { getNonVoidPaths, taggedPaths } from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';

export const weld = (shape) => {
  const weld = [];
  for (const { paths } of getNonVoidPaths(shape.toTransformedGeometry())) {
    weld.push(...paths);
  }
  return Shape.fromGeometry(taggedPaths({}, weld));
};
