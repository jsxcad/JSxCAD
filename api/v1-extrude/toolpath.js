import { Shape } from '@jsxcad/api-v1-shape';

import { toolpath as toolpathAlgorithm } from '@jsxcad/algorithm-toolpath';

export const toolpath = (
  shape,
  radius = 1,
  { overcut = true, solid = false } = {}
) =>
  Shape.fromGeometry({
    type: 'paths',
    paths: toolpathAlgorithm(shape.toKeptGeometry(), radius, overcut, solid),
  });

const method = function (...options) {
  return toolpath(this, ...options);
};

Shape.prototype.toolpath = method;
Shape.prototype.withToolpath = function (...args) {
  return this.with(toolpath(this, ...args));
};

export default toolpath;
