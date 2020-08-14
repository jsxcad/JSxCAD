import { Shape } from '@jsxcad/api-v1-shape';

import { toolpath as toolpathAlgorithm } from '@jsxcad/algorithm-toolpath';

export const toolpath = (
  shape,
  diameter = 1,
  { overcut = false, solid = true } = {}
) =>
  Shape.fromGeometry({
    type: 'paths',
    paths: toolpathAlgorithm(shape.toKeptGeometry(), diameter, overcut, solid),
  });

const method = function (...options) {
  return toolpath(this, ...options);
};

Shape.prototype.toolpath = method;
Shape.prototype.withToolpath = function (...args) {
  return this.with(toolpath(this, ...args));
};

export default toolpath;
