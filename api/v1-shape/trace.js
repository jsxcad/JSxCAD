import { getPaths, taggedPaths } from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';
import { segment } from '@jsxcad/geometry-paths';

export const trace = (shape, length = 1) => {
  const tracePaths = [];
  for (const { paths } of getPaths(shape.toKeptGeometry())) {
    for (let start = 0; ; start += length) {
      const segments = segment(paths, start, start + length);
      if (segments.length === 0) {
        break;
      }
      tracePaths.push(...segments);
    }
  }
  return Shape.fromGeometry(
    taggedPaths({ tags: ['display/trace'] }, tracePaths)
  );
};

const traceMethod = function (length = 1) {
  return trace(this, length);
};
Shape.prototype.trace = traceMethod;
