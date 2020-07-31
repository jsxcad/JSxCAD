import Shape from './Shape.js';
import { assemble } from './assemble.js';
import { getNonVoidPaths } from '@jsxcad/geometry-tagged';

export const toolpaths = (shape, xform = (_) => _) => {
  const toolpaths = [];
  for (const geometry of getNonVoidPaths(shape.toDisjointGeometry())) {
    const { tags = [] } = geometry;
    if (tags.includes('path/Toolpath')) {
      toolpaths.push(xform(Shape.fromGeometry(geometry)));
    }
  }
  return toolpaths;
};

const toolpathsMethod = function (xform) {
  return toolpaths(this, xform);
};
Shape.prototype.toolpaths = toolpathsMethod;

const keepToolpathsMethod = function (xform) {
  return assemble(...toolpaths(this, xform));
};
Shape.prototype.keepToolpaths = keepToolpathsMethod;

export default toolpaths;
