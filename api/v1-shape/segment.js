import Shape from './Shape';
import { getPaths } from '@jsxcad/geometry-tagged';
import { segment as segmentPaths } from '@jsxcad/geometry-paths';

export const segment = (shape, start = 0, end = start) => {
  const outputPaths = [];
  for (const { paths } of getPaths(shape.toKeptGeometry())) {
    const segments = segmentPaths(paths, start, end);
    outputPaths.push(...segments);
  }
  return Shape.fromGeometry({ paths: outputPaths });
};

const segmentMethod = function (start, end) {
  return segment(this, start, end);
};
Shape.prototype.segment = segmentMethod;
